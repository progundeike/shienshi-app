<?php

namespace App\Http\Controllers;

use App\Models\ExamSentence;
use App\Models\ModelAnswer;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    public function updateExamQuestion(Request $request): JsonResponse
    {
        $this->checkIsAdmin();

        Log::debug($request->all());

        // リクエストのバリデーション
        $validated = $request->validate([
            'year' => 'required|numeric',
            'season' => 'required|in:haru,aki',
            'section' => 'required|numeric',
            'questionNumber' => 'required|numeric|max:20',
            'subQuestionNumber' => 'required|numeric|max:20',
            'smallQuestionNumber' => 'nullable|numeric|max:20',
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

        // numericで受け入れた文字列を念の為 int にキャスト
        $validated['year'] = (int) $validated['year'];
        $validated['section'] = (int) $validated['section'];
        $validated['questionNumber'] = (int) $validated['questionNumber'];
        $validated['subQuestionNumber'] = (int) $validated['subQuestionNumber'];
        $validated['smallQuestionNumber'] = (int) $validated['smallQuestionNumber'];

        $examCode = $validated['year'] . '_' . $validated['season'] . '_' . $validated['section'];

        // 一時的にphp形式でも保存する
        $phpFilePath = database_path("exam-questions/{$validated['year']}/question_{$examCode}.php");
        // ディレクトリが存在しない場合は作成する
        if (!file_exists(dirname($phpFilePath))) {
            if (!mkdir(dirname($phpFilePath), 0755, true) && !is_dir(dirname($phpFilePath))) {
                Log::error('Failed to create directory for exam questions: ' . dirname($phpFilePath));
                return response()->json(['error' => 'Failed to create directory for exam questions'], 500);
            }
        }

        // すでにファイルが存在する場合は、既存ファイルの配列に追加する。
        if (file_exists($phpFilePath)) {
            $existingQuestions = include $phpFilePath;
        } else {
            $existingQuestions = [];
        }
        // 新しい問題を配列に追加
        $newQuestion = [
            'exam_code' => $examCode,
            'question_number' => $validated['questionNumber'],
            'sub_question_number' => $validated['subQuestionNumber'],
            'small_question_number' => $validated['smallQuestionNumber'] ?? null,
            'type' => $validated['type'],
            'text' => $validated['text'] ? $validated['text'] : "",
            'text_for_ai' => $validated['textForAi'] ? $validated['textForAi'] : "",
            'options' => empty($validated['options']) ? null : $validated['options'],
            'max_length' => $validated['maxLength'] ?? null,
        ];

        // 既存の問題を更新または新規追加
        $questionExists = false;
        foreach ($existingQuestions as $question) {
            if (
                $question['exam_code'] === $examCode &&
                $question['question_number'] === $validated['questionNumber'] &&
                $question['sub_question_number'] === $validated['subQuestionNumber'] &&
                $question['small_question_number'] === ($validated['smallQuestionNumber'] ?? null)
            ) {
                // 既存の問題を更新
                $question = $newQuestion;
                $questionExists = true;
                break;
            }
        }

        if (!$questionExists) {
            // 新しい問題を追加
            $existingQuestions[] = $newQuestion;
        }
        // PHPファイルに保存
        try {
            $phpContent = "<?php\nreturn " . var_export($existingQuestions, true) . ";\n";
            file_put_contents($phpFilePath, $phpContent);
        } catch (\Exception $e) {
            Log::error('Failed to write to PHP file: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to write to PHP file'], 500);
        }

        // 試験問題の更新処理を実行
        try {
            Question::UpdateOrCreate(
                [
                    'exam_code' => $examCode,
                    'question_number' => $validated['questionNumber'],
                    'sub_question_number' => $validated['subQuestionNumber'],
                    'small_question_number' => $validated['smallQuestionNumber'],
                ],
                $newQuestion
            );

            return response()->json(['message' => 'Exam question updated successfully'], 201);
        } catch (\Exception $e) {
            Log::error('Failed to update exam question: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update exam question'], 500);
        }
    }

    // examSentenceを返す
    public function fetchExamSentence(string $year, string $season, string $section): JsonResponse
    {
        $this->checkIsAdmin();

        // 試験文の取得
        try {
            $examSentence = ExamSentence::where('exam_code', $year . '_' . $season . '_' . $section)
                ->first();

            if (!$examSentence) {
                // まだ登録されていない可能性もあるので、空のデータを返す
                return response()->json([
                    'sentence' => "",
                    'purpose' => "",
                    'reviewComment' => "",
                ], 200);
            }

            return response()->json([
                'sentence' => $examSentence->sentence,
                'purpose' => $examSentence->purpose,
                'reviewComment' => $examSentence->review_comment,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch exam sentences: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch exam sentences'], 500);
        }
    }

    // examSentence, purpose, reviewCommentを更新する
    public function updateExamSentence(Request $request): JsonResponse
    {
        $this->checkIsAdmin();

        // リクエストのバリデーション
        $validated = $request->validate([
            'year' => 'required|integer',
            'season' => 'required|in:haru,aki',
            'section' => 'required|integer',
            'sentence' => 'nullable|string',
            'purpose' => 'nullable|string',
            'reviewComment' => 'nullable|string'
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

            ExamSentence::updateOrCreate(['exam_code' => $validated['year'] . '_' . $validated['season'] . '_' . $validated['section']], $updateData);

            return response()->json(['message' => 'Exam sentence updated successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to update exam sentence: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update exam sentence'], 500);
        }
    }

    public function uploadExamPdf(Request $request): JsonResponse
    {
        $this->checkIsAdmin();

        Log::debug('AdminController@uploadExamPdf called', [
            $request->all(),
        ]);

        // リクエストのバリデーション
        $validated = $request->validate([
            'year' => 'required|integer',
            'season' => 'required|in:haru,aki',
            'section' => 'required|integer',
            'file' => 'required|file|mimes:pdf|max:4096', // 最大4MBのPDFファイル
        ]);

        $directory = 'pdf/' . $validated['year'];

        // ファイルの保存処理
        try {
            $filePath = $request->file('file')->storeAs(
                $directory,
                "{$validated['year']}_{$validated['season']}_{$validated['section']}.pdf",
                'public'
            );

            Log::debug($filePath);

            return response()->json(['message' => 'PDF uploaded successfully'], 201);
        } catch (\Exception $e) {
            Log::error('Failed to upload PDF: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to upload PDF'], 500);
        }
    }

    public function getModelAnswers(string $year, string $season, string $section): JsonResponse
    {
        $this->checkIsAdmin();

        $controller = new ExamController();
        $examCode = $year . '_' . $season . '_' . $section;
        $modelAnswers = $controller->fetchModelAnswer($examCode);

        if (is_null($modelAnswers)) {
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

    public function updateModelAnswers(Request $request, string $year, string $season, string $section): JsonResponse
    {
        $this->checkIsAdmin();
        Log::debug('modelAnswers', ['modelAnswers' => $request->input('modelAnswers')]);

        // リクエストのバリデーション
        $validated = $request->validate([
            'modelAnswers' => 'required|array'
        ]);

        $examCode = $year . '_' . $season . '_' . $section;

        // 模範解答をアップデート
        try {
            foreach ($validated['modelAnswers'] as $questionCode => $text) {
                ModelAnswer::updateOrCreate(
                    [
                        'exam_code' => $examCode,
                        'question_code' => $questionCode,
                    ],
                    ['text' => $text]
                );
            }

            return response()->json(['message' => 'Model answers updated successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to update model answers: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update model answers'], 500);
        }
    }

    public function deleteQuestion(string $year, string $season, string $section, string $questionId): JsonResponse
    {
        $this->checkIsAdmin();
        list($questionNumber, $subQuestionNumber, $smallQuestionNumber) = explode('_', $questionId);

        // TODO:模範解答も念の為消したほうがいいかも

        try {
            // 該当の問題を削除
            Question::where('exam_code', "{$year}_{$season}_{$section}")
                ->where('question_number', $questionNumber)
                ->where('sub_question_number', $subQuestionNumber)
                ->where('small_question_number', $smallQuestionNumber)
                ->delete();

            return response()->json(['message' => 'Question deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to delete question: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete question'], 500);
        }
    }

    // fetchExamQuestionsArrayでは取得しなかったtext_for_aiも取得する
    // 大問または設問番号を指定して設問を取得する
    public function fetchQuestionsForEdit(
        string $year,
        string $season,
        string $section,
    ): array | null {
        $this->checkIsAdmin();

        $examCode = $year . '_' . $season . '_' . $section;
        $query = Question::where('exam_code', $examCode);
        $result = $query->get();

        // questionsが取得できない場合はnullを返す
        if ($result->isEmpty()) {
            return null;
        }

        // 必要なデータだけを取り出す
        $questions = $result->map(function ($question) {
            return [
                'examCode' => $question->exam_code,
                'questionNumber' => $question->question_number,
                'subQuestionNumber' => $question->sub_question_number,
                'smallQuestionNumber' => $question->small_question_number,
                'type' => $question->type,
                'text' => $question->text,
                'textForAi' => $question->text_for_ai,
                'options' => $question->options,
                'maxLength' => $question->max_length,
            ];
        });

        return $questions->toArray();
    }

    // 管理者権限があるか確認する
    public function checkIsAdmin()
    {
        $user = auth()->user();
        if (!$user || !$user instanceof \App\Models\User || !$user->isAdmin()) {
            Log::warning('Unauthorized access attempt by user ID: ' . ($user ? $user->id : 'null'));
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    }
}
