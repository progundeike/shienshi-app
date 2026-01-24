<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Question;
use App\Models\ExamSentence;
use App\Models\ModelAnswer;
use App\Models\SubmittedExam;
use App\Models\UserAnswer;

// 試験問題に関する情報を提供するコントローラ
class ExamController extends Controller
{

    // 設問をjson形式で取得して、httpレスポンスを返す
    // ログイン済みで、答案提出済みの場合は、添削画面を表示する
    public function getExamQuestionsJson(string $year, string $season, string $section)
    {
        $year = (int) $year;
        $section = (int) $section;
        $examCode = $year . '_' . $season . '_' . $section;

        try {
            $questions = $this->fetchExamQuestionsArray($examCode);

            // questionsが取得できない場合は404エラーを返す
            if (!$questions) {
                return response()->json(['error' => 'Questions not found'], 404);
            }

            return response()->json($questions);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Failed to get questions'], 500);
        }
    }

    // 大問または設問番号を指定して設問を取得する
    public function fetchExamQuestionsArray(string $examCode, ?string $questionCode = null): array | null
    {
        $query = Question::where('exam_code', $examCode);

        // 特定の設問を取得する場合は条件を追加
        if ($questionCode) {
            [$q, $sub, $small] = array_map('intval', explode('_', $questionCode));
            $query->where('question_number', $q)
                ->where('sub_question_number', $sub)
                ->where('small_question_number', $small);
        }
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
                'options' => $question->options,
                // 'options' => $question->options ? json_decode($question->options) : null,
                'maxLength' => $question->max_length,
            ];
        });

        return $questions->toArray();
    }

    // 指定した大問の問題文, 出題趣旨、講評を取得する
    // 現在は問題文のみを返す
    public function fetchExamSentences(string $examCode): array
    {
        $examData = ExamSentence::where('exam_code', $examCode)
            ->first();

        return [
            'sentence' => $examData->sentence,
            // 'purpose' => $examData->purpose,
            // 'review_comment' => $examData->review_comment,
        ];
    }

    // 模範解答を取得する
    public function fetchModelAnswer(string $examCode, ?string $questionCode = null): array
    {
        $query = ModelAnswer::where('exam_code', $examCode);

        if ($questionCode) {
            $query->where('question_code', $questionCode);
        }
        $result = $query->get();

        $modelAnswer = $result->map(function ($answer) {
            return [
                'questionCode' => $answer->question_code,
                'text' => $answer->text,
            ];
        });

        return $modelAnswer->toArray();
    }

    // 指定した問題のユーザーの回答を取得する
    public function fetchUserAnswer(int $userId, string $examCode, string $questionCode): array
    {
        $answer = UserAnswer::where('user_id', $userId)
            ->where('exam_code', $examCode)
            ->where('question_code', $questionCode)
            ->first();

        return [
            'questionCode' => $answer->question_code,
            'user_text' => $answer->user_text,
        ];
    }

    // 提出済みの試験一覧を取得する
    public function fetchSubmittedExams()
    {
        $userId = Auth::id();

        $fetchedSubmittedAnswers = SubmittedExam::where('user_id', $userId)
            ->get();

        $submittedAnswers = $fetchedSubmittedAnswers->map(function ($exam) {

            // TODO: exam_codeを分解する
            $examCodeParts = explode('_', $exam->exam_code);
            $year = (int) $examCodeParts[0];
            $season = $examCodeParts[1];
            $section = (int) $examCodeParts[2];

            $submittedExam = [
                'year' => $year
            ];

            // seasonを日本語に変換
            if ($season === 'haru') {
                $submittedExam['season_japanese'] = '春期';
            } elseif ($season === 'aki') {
                $submittedExam['season_japanese'] = '秋期';
            } else {
                // 例外
                $submittedExam['season_japanese'] = '未登録';
                Log::error('Unknown season: ' . $submittedExam['season']);
            }

            // sectionを問いに変換。2023年までは午後I, 午後Ⅱに分ける
            if ($section >= 2023) {
                // sectionをそのまま問いに変換
                $submittedExam['section_converted'] = '問' . $section;
            } else {
                // sectionを午前、午後に分類
                if ($section < 4) {
                    $submittedExam['section_converted'] = '午後I 問' . $section;
                } elseif ($section === 4) {
                    $submittedExam['section_converted'] = '午後Ⅱ 問1';
                } elseif ($section === 5) {
                    $submittedExam['section_converted'] = '午後Ⅱ 問2';
                } else {
                    // 例外
                    $submittedExam['section_converted'] = '未登録';
                    Log::error('Unknown section: ' . $submittedExam['section']);
                }
            }

            return $submittedExam;
        });

        return response()->json($submittedAnswers, 200);
    }

    # userAnswersは [{"examCode":"2023_aki_3","questionNumber":1,"subQuestionNumber":1,"smallQuestionNumber":0,"user_text":"test"},]の形式
    public function convertUserAnswerToText(array $userAnswers): string
    {
        $length = count($userAnswers);

        $userAnswerText = '';
        for ($i = 0; $i < $length; $i++) {
            $userAnswerText .= '設問' . $userAnswers[$i]['questionNumber'] . ' ';
            if ($userAnswers[$i]['subQuestionNumber'] !== 0) {
                $userAnswerText .= '(' . $userAnswers[$i]['subQuestionNumber'] . ') ';
            }

            if ($userAnswers[$i]['user_text']) {
                $userAnswerText .= $userAnswers[$i]['user_text'] . PHP_EOL;
            } else {
                $userAnswerText .= '未回答' . PHP_EOL;
            };
        }

        return $userAnswerText;
    }

    // 試験のPDFファイルの存在確認
    public function checkFileExists(string $year, string $season, string $section): JsonResponse
    {
        $examCode = $year . '_' . $season . '_' . $section;

        $filePath = storage_path('app/public/pdf/' . $year . '/' . $examCode . '.pdf');

        if (!file_exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        return response()->json([
            'message' => 'File exists',
            'url' => url('/storage/exam_pdf/'  . $filePath),
        ], 200);
    }
}
