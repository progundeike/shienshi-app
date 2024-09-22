<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Question;
use App\Models\ExamSentence;
use App\Models\ModelAnswer;
use App\Models\UserAnswer;

// 試験問題に関する情報を提供するコントローラ
class ExamController extends Controller
{
    // 設問をjson形式で取得して、httpレスポンスを返す
    public function getExamQuestionsJson(string $year, string $season, string $section)
    {
        $year = (int) $year;
        $section = (int) $section;

        try {
            $questions = $this->fetchExamQuestionsArray($year, $season, $section);

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

    // 設問を文字列で取得する。各設問は配列として返す。
    // public function getExamQuestionString(int $year, string $season, int $section): array
    // {
    //     try {
    //         $questions = $this->fetchExamQuestionsArray($year, $season, $section);

    //         // questionsが取得できない場合は例外を投げる
    //         if (!$questions) {
    //             throw new \Exception('Questions not found');
    //         }

    //         // 各設問を文字列に変換する
    //         $stringQuestions = $this->convertQuestionsToString($questions);

    //         return $stringQuestions;
    //     } catch (\Exception $e) {
    //         Log::error($e->getMessage());
    //         throw $e;
    //     }
    // }

    // 大問または設問番号を指定して設問を取得する
    public function fetchExamQuestionsArray(
        int $year,
        string $season,
        int $section,
        ?string $questionNumber = null,
        ?string $subQuestionNumber = null
    ): array | null {

        $query = Question::where('year', $year)
            ->where('season', $season)
            ->where('section', $section);

        // 特定の設問を取得する場合は条件を追加
        if ($questionNumber) {
            $query->where('question_number', $questionNumber);
        }
        if ($subQuestionNumber) {
            $query->where('sub_question_number', $subQuestionNumber);
        }


        $result = $query->get();

        // questionsが取得できない場合はnullを返す
        if ($result->isEmpty()) {
            return null;
        }

        // 必要なデータだけを取り出す
        $questions = $result->map(function ($question) {
            return [
                'year' => $question->year,
                'season' => $question->season,
                'section' => $question->section,
                'questionNumber' => $question->question_number,
                'subQuestionNumber' => $question->sub_question_number,
                'type' => $question->type,
                'text' => $question->text,
                'options' => $question->options ? json_decode($question->options) : null,
                'maxLength' => $question->max_length,
            ];
        });

        return $questions->toArray();
    }

    // 設問を文字列に変換する
    // public function convertQuestionsToString(array $questionsArray)
    // {
    //     $questions = [];
    //     foreach ($questionsArray as $question) {
    //         $text = $question['text'];

    //         // 選択肢の問題の場合は選択肢をデコードする
    //         if ($question['type'] === 'radio') {
    //             $options = json_decode($question->options);

    //             $labels = array_map(function ($option) {
    //                 return $option->label;
    //             }, $options);

    //             $commaSeparatedLabels = implode(', ', $labels);

    //             $text = $text . '解答群[' . $commaSeparatedLabels . ']';
    //         }

    //         $questions[] =  [
    //             'questionNumber' => $question->question_number,
    //             'subQuestionNumber' => $question->sub_question_number,
    //             'text' => $text,
    //         ];
    //     };

    //     return $questions;
    // }

    //指定した大問の問題文, 出題趣旨、講評を取得する
    public function fetchExamSentences(int $year, string $season, int $section): array
    {
        $examData = ExamSentence::where('year', $year)
            ->where('season', $season)
            ->where('section', $section)
            ->first();

        return [
            'sentence' => $examData->sentence,
            'purpose' => $examData->purpose,
            'review_comment' => $examData->review_comment,
        ];
    }

    // 模範解答を取得する
    public function fetchModelAnswer(int $year, string $season, int $section, $questionNumber = null, $subQuestionNumber = null): array
    {
        $query = ModelAnswer::where('year', $year)
            ->where('season', $season)
            ->where('section', $section);

        // 特定の設問を取得する場合は条件を追加
        if ($questionNumber) {
            $query->where('question_number', $questionNumber);
        }
        if ($subQuestionNumber) {
            $query->where('sub_question_number', $subQuestionNumber);
        }

        $result = $query->get();

        $modelAnswer = $result->map(function ($answer) {
            return [
                'questionNumber' => $answer->question_number,
                'subQuestionNumber' => $answer->sub_question_number,
                'text' => $answer->text,
            ];
        });

        return $modelAnswer->toArray();
    }

    // ユーザーの回答を取得する
    public function fetchUserAnswer(int $userId, int $year, string $season, int $section, int $questionNumber, int $subQuestionNumber): array
    {
        $answer = UserAnswer::where('user_id', $userId)
            ->where('year', $year)
            ->where('season', $season)
            ->where('section', $section)
            ->where('question_number', $questionNumber)
            ->where('sub_question_number', $subQuestionNumber)
            ->first();

        return [
            'questionNumber' => $answer->question_number,
            'subQuestionNumber' => $answer->sub_question_number,
            'user_text' => $answer->user_text,
        ];
    }

    // ユーザーが答案提出済みかどうかを判定する
    public function isUserAnswerSubmitted(int $userId, int $year, string $season, int $section): bool
    {
        $result = UserAnswer::where('user_id', $userId)
            ->where('year', $year)
            ->where('season', $season)
            ->where('section', $section)
            ->exists();

        return $result;
    }

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
}
