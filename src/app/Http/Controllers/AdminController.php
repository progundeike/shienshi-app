<?php

namespace App\Http\Controllers;

use App\Models\ExamSentence;
use App\Models\ModelAnswer;
use App\Models\Question;
use App\Services\ExamDataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function __construct(
        private readonly ExamDataService $examDataService,
    ) {}

    public function updateExamQuestion(Request $request): JsonResponse
    {
        // リクエストのバリデーション
        $validated = $request->validate([
            'examCode' => 'required|string',
            'questionNumber' => 'required|integer|max:20',
            'subQuestionNumber' => 'required|integer|max:20',
            'smallQuestionNumber' => 'nullable|integer|max:20',
            'text' => 'nullable|string|max:1000',
            'textForAi' => 'nullable|string|max:5000',
            'type' => 'required|string|in:textarea,radio,checkbox,input',
            'options' => 'nullable|array',
            'options.*' => 'required|required_array_keys:label,value',
            'maxLength' => 'nullable|integer|max:5000',
        ]);

        // optionsがkey,valueともに空文字列の配列の場合はnullにする
        if (isset($validated['options'])) {
            $checkedOptions = [];
            foreach ($validated['options'] as $option) {
                // keyとvalueで構成されていることを確認
                if ($option['label'] || $option['value']) {
                    $checkedOptions[] = $option;
                }
            }
            $validated['options'] = $checkedOptions;
        }

        $questionCode = "{$validated['questionNumber']}_{$validated['subQuestionNumber']}_{$validated['smallQuestionNumber']}";

        // 試験問題の更新処理を実行
        try {
            Question::upsert(
                [
                    [
                        'exam_code' => $validated['examCode'],
                        'question_code' => $questionCode,
                        'type' => $validated['type'],
                        'text' => $validated['text'] ? $validated['text'] : '',
                        'text_for_ai' => $validated['textForAi'] ? $validated['textForAi'] : '',
                        'options' => empty($validated['options']) ? null : $validated['options'],
                        'max_length' => $validated['maxLength'] ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                ],
                ['exam_code', 'question_code'],
                [
                    'type',
                    'text',
                    'text_for_ai',
                    'options',
                    'max_length',
                    'updated_at',
                ]
            );

            return response()->json(['message' => 'Exam question updated successfully'], 201);
        } catch (\Exception $e) {
            Log::error('Failed to update exam question: '.$e->getMessage());

            return response()->json(['error' => 'Failed to update exam question'], 500);
        }
    }

    // examSentenceを返す
    public function fetchExamSentence(string $year, string $season, string $section): JsonResponse
    {
        // 試験文の取得
        try {
            $examSentence = ExamSentence::where('exam_code', $year.'_'.$season.'_'.$section)
                ->first();

            if (! $examSentence) {
                // まだ登録されていない可能性もあるので、空のデータを返す
                return response()->json([
                    'sentence' => '',
                    'purpose' => '',
                    'reviewComment' => '',
                ], 200);
            }

            return response()->json([
                'sentence' => $examSentence->sentence,
                'purpose' => $examSentence->purpose,
                'reviewComment' => $examSentence->review_comment,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch exam sentences: '.$e->getMessage());

            return response()->json(['error' => 'Failed to fetch exam sentences'], 500);
        }
    }

    // examSentence, purpose, reviewCommentを更新する
    public function updateExamSentence(Request $request): JsonResponse
    {
        // リクエストのバリデーション
        $validated = $request->validate([
            'year' => 'required|integer',
            'season' => 'required|in:haru,aki',
            'section' => 'required|integer',
            'sentence' => 'nullable|string',
            'purpose' => 'nullable|string',
            'reviewComment' => 'nullable|string',
        ]);

        // 試験文の更新処理を実行
        try {
            $updateData = [];

            if ($request->has('sentence') && $validated['sentence'] !== null) {
                $updateData['sentence'] = $validated['sentence'];
            }
            if ($request->has('purpose') && $validated['purpose'] !== null) {
                $updateData['purpose'] = $validated['purpose'];
            }
            if ($request->has('reviewComment') && $validated['reviewComment'] !== null) {
                $updateData['review_comment'] = $validated['reviewComment'];
            }

            ExamSentence::updateOrCreate(['exam_code' => $validated['year'].'_'.$validated['season'].'_'.$validated['section']], $updateData);

            return response()->json(['message' => 'Exam sentence updated successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to update exam sentence: '.$e->getMessage());

            return response()->json(['error' => 'Failed to update exam sentence'], 500);
        }
    }

    public function deleteExamPdf(string $year, string $season, string $section)
    {
        // validation
        $validator = Validator::make(
            compact('year', 'season', 'section'),
            [
                'year' => ['required', 'regex:/^20\d{2}$/'],
                'season' => ['required', 'in:haru,aki'],
                'section' => ['required', 'in:1,2,3,4,5'],
            ]
        );
        if ($validator->fails()) {
            return response()->json(['error' => 'Invalid Parameters'], 422);
        }

        $examCode = $year.'_'.$season.'_'.$section;

        $relativePath = 'pdf/'.$year.'/'.$examCode.'.pdf';
        $deleted = Storage::disk('public')->delete($relativePath);

        if (! $deleted) {
            return response()->json(['error' => 'Failed to delete file'], 500);
        }

        return response()->json(['message' => 'File deleted'], 200);
    }

    public function uploadExamPdf(Request $request): JsonResponse
    {
        // リクエストのバリデーション
        $validated = $request->validate([
            'year' => 'required|integer|between:2000,2099',
            'season' => 'required|in:haru,aki',
            'section' => 'required|integer|min:1|max:5|',
            'file' => 'required|file|mimes:pdf|max:4096', // 最大4MBのPDFファイル
        ]);

        $directory = 'pdf/'.$validated['year'];

        // ファイルの保存処理 既存ファイルがある場合、勝手に上書きされる
        try {
            $request->file('file')->storeAs(
                $directory,
                "{$validated['year']}_{$validated['season']}_{$validated['section']}.pdf",
                'public'
            );

            return response()->json(['message' => 'PDF uploaded successfully'], 201);
        } catch (\Exception $e) {
            Log::error('Failed to upload PDF: '.$e->getMessage());

            return response()->json(['error' => 'Failed to upload PDF'], 500);
        }
    }

    public function getModelAnswers(string $examCode): JsonResponse
    {
        $modelAnswers = $this->examDataService->fetchModelAnswers($examCode);

        if (empty($modelAnswers)) {
            return response()->json(['error' => 'Model answers not found'], 404);
        }

        // キーと値のペアで返す
        $modelMap = [];
        foreach ($modelAnswers as &$answer) {
            $modelMap[] = [
                'questionCode' => $answer['questionCode'],
                'text' => $answer['text'],
            ];
        }

        return response()->json($modelMap, 200);
    }

    public function updateModelAnswers(Request $request, string $examCode): JsonResponse
    {
        // リクエストのバリデーション
        $validated = $request->validate([
            'modelAnswers' => 'required|array',
            'modelAnswers.answers' => 'required|array',
        ]);

        // checkboxの値が配列で送られてくるため、文字列に変換する
        $modelAnswers = [];
        foreach ($validated['modelAnswers']['answers'] as $modelAnswer) {
            if (is_array($modelAnswer['content'])) {
                $modelAnswers[$modelAnswer['questionCode']] = implode(',', $modelAnswer['content']);
            } else {
                $modelAnswers[$modelAnswer['questionCode']] = $modelAnswer['content'];
            }
        }

        // 模範解答をアップデート
        try {
            $rows = [];
            foreach ($modelAnswers as $questionCode => $text) {
                $rows[] = [
                    'exam_code' => $examCode,
                    'question_code' => $questionCode,
                    'text' => $text,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            ModelAnswer::upsert(
                $rows,
                ['exam_code', 'question_code'],
                ['text', 'updated_at']
            );

            return response()->json(['message' => 'Model answers updated successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to update model answers: '.$e->getMessage());

            return response()->json(['error' => 'Failed to update model answers'], 500);
        }
    }

    public function deleteQuestion(string $examCode, string $questionCode): JsonResponse
    {
        try {
            // 該当の問題を削除
            Question::where('exam_code', $examCode)
                ->where('question_code', $questionCode)
                ->delete();

            // 模範解答もあれば削除する
            ModelAnswer::where('exam_code', $examCode)
                ->where('question_code', $questionCode)
                ->delete();

            return response()->json(['message' => 'Question deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to delete question: '.$e->getMessage());

            return response()->json(['error' => 'Failed to delete question'], 500);
        }
    }

    // fetchExamQuestionsArrayでは取得しなかったtext_for_aiも取得する
    // 大問または設問番号を指定して設問を取得する
    public function fetchQuestionsForEdit(
        string $examCode
    ): ?array {

        $query = Question::where('exam_code', $examCode);
        $result = $query->get();

        // questionsが取得できない場合はnullを返す
        if ($result->isEmpty()) {
            return null;
        }

        // 必要なデータだけを取り出す
        $questions = $result->map(function ($question): array {

            [$questionNumber, $subQuestionNumber, $smallQuestionNumber] = array_map(
                'intval',
                explode('_', $question->question_code)
            );

            return [
                'examCode' => $question->exam_code,
                'questionCode' => $question->question_code,
                'questionNumber' => $questionNumber,
                'subQuestionNumber' => $subQuestionNumber,
                'smallQuestionNumber' => $smallQuestionNumber,
                'type' => $question->type,
                'text' => $question->text,
                'textForAi' => $question->text_for_ai,
                'options' => $question->options,
                'maxLength' => $question->max_length,
            ];
        });

        return $questions->toArray();
    }
}
