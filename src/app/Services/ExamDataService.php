<?php

namespace App\Services;

use App\Models\ExamSentence;
use App\Models\ModelAnswer;
use App\Models\Question;
use App\Models\UserAnswer;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ExamDataService
{
    // 大問または設問番号を指定して設問を取得する
    public function fetchExamQuestionsForPublic(string $examCode, ?string $questionCode = null): ?array
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
                'questionCode' => $question->question_number.'_'.$question->sub_question_number.'_'.$question->small_question_number,
                'type' => $question->type,
                'text' => $question->text,
                'options' => $question->options,
                'maxLength' => $question->max_length,
            ];
        });

        return $questions->toArray();
    }

    public function fetchExamQuestionsForAi(string $examCode, ?string $questionCode = null): array
    {
        $query = Question::where('exam_code', $examCode);

        // questionCodeが指定されている場合はその大問を取得する
        if ($questionCode !== null) {
            $q = (int) explode('_', $questionCode)[0];
            $query->where('question_number', $q);
        }

        $result = $query->get();

        if ($result->isEmpty()) {
            if ($questionCode !== null) {
                $q = explode('_', $questionCode)[0];
                throw new ModelNotFoundException("Questions not found for examCode: {$examCode} and questionNumber: {$q}");
            }
            throw new ModelNotFoundException("Questions not found for examCode: {$examCode}");
        }

        // 必要なデータだけを取り出す
        $examQuestions = $result->map(function ($question) {
            return [
                'questionNumber' => $question->question_number,
                'subQuestionNumber' => $question->sub_question_number,
                'smallQuestionNumber' => $question->small_question_number,
                'questionCode' => $question->question_number.'_'.$question->sub_question_number.'_'.$question->small_question_number,
                'type' => $question->type,
                'text' => $question->text,
                'options' => $question->options,
                'textForAi' => $question->text_for_ai ?? null,
            ];
        })->toArray();

        return $examQuestions;
    }

    // 指定した大問の問題文, 出題趣旨、講評を取得する
    // 現在は問題文のみを返す
    public function fetchExamSentences(string $examCode): array
    {
        $examData = ExamSentence::where('exam_code', $examCode)
            ->firstOrFail();

        return [
            'sentence' => $examData->sentence,
            // 'purpose' => $examData->purpose,
            // 'review_comment' => $examData->review_comment,
        ];
    }

    // 模範解答を取得する
    public function fetchModelAnswers(string $examCode, ?string $questionCode = null): array
    {
        $query = ModelAnswer::where('exam_code', $examCode);

        if ($questionCode) {
            [$q, $sub, $small] = explode('_', $questionCode);
            $query->where('question_code', 'like', $q.'\_%');
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
            ->firstOrFail();

        return [
            'questionCode' => $answer->question_code,
            'userText' => $answer->user_text,
        ];
    }

    public function convertUserAnswerToText(array $userAnswers, array $examQuestions): string
    {
        $length = count($userAnswers);

        $mapOptions = array_column($examQuestions, 'options', 'questionCode');

        $userAnswerText = '';
        for ($i = 0; $i < $length; $i++) {
            $userAnswerText .= '[questionCode:'.$userAnswers[$i]['questionCode'].']';
            [$q, $sub, $small] = array_map('intval', explode('_', $userAnswers[$i]['questionCode']));
            $userAnswerText .= '設問'.$q.' ';
            if ($sub !== 0) {
                $userAnswerText .= '('.$sub.') ';
            }

            $questionCode = $userAnswers[$i]['questionCode'] ?? '';
            $optionsForQuestion = $mapOptions[$questionCode] ?? null;

            if (is_array($optionsForQuestion) && isset($optionsForQuestion[0]['label'])) {
                // 設問識別のためのlabelをユーザー回答テキストの先頭に追加
                // 設問識別用ラベルはoptionsのcountが1のみ存在する前提
                if (count($optionsForQuestion) === 1) {
                    $userAnswerText .= $optionsForQuestion[0]['label'];
                }
            }

            if ($userAnswers[$i]['userText']) {
                $userAnswerText .= $userAnswers[$i]['userText'].PHP_EOL;
            } else {
                $userAnswerText .= '未回答'.PHP_EOL;
            }
        }

        return $userAnswerText;
    }
}
