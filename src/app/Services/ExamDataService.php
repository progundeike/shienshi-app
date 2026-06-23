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
            $query->where('question_code', $questionCode);
        }
        $result = $query->get();

        // questionsが取得できない場合はnullを返す
        if ($result->isEmpty()) {
            return null;
        }

        // 必要なデータだけを取り出す
        $questions = $result->map(function ($question) {

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
                'options' => $question->options,
                'maxLength' => $question->max_length,
            ];
        });

        return $questions->toArray();
    }

    public function fetchExamQuestionsForAi(string $examCode, ?string $questionCode = null): array
    {
        $result = Question::where('exam_code', $examCode)
            ->get();

        // questionCodeが指定されている場合はその大問を取得する
        if ($questionCode !== null) {
            $questionNumber = explode('_', $questionCode)[0];
            $result = $result->filter(
                fn (Question $question): bool => explode('_', $question->question_code)[0] === $questionNumber
            )->values();
        }

        if ($result->isEmpty()) {
            if ($questionCode !== null) {
                $questionNumber = explode('_', $questionCode)[0];
                throw new ModelNotFoundException(
                    "Questions not found for examCode: {$examCode} and questionNumber: {$questionNumber}"
                );
            }
            throw new ModelNotFoundException("Questions not found for examCode: {$examCode}");
        }

        // 必要なデータだけを取り出す
        $examQuestions = $result->map(function ($question) {

            [$questionNumber, $subQuestionNumber, $smallQuestionNumber] = array_map(
                'intval',
                explode('_', $question->question_code)
            );

            return [
                'questionNumber' => $questionNumber,
                'subQuestionNumber' => $subQuestionNumber,
                'smallQuestionNumber' => $smallQuestionNumber,
                'questionCode' => $question->question_code,
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
        $result = ModelAnswer::where('exam_code', $examCode)->get();

        if ($questionCode !== null) {
            $questionNumber = explode('_', $questionCode)[0];
            $result = $result->filter(
                fn (ModelAnswer $modelAnswer): bool => explode('_', $modelAnswer->question_code)[0] === $questionNumber
            )->values();
        }

        $modelAnswer = $result->map(function (ModelAnswer $answer) {
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

    // 出題趣旨、採点講評を取得する
    public function fetchPurposeAndReviewComment(string $examCode): array
    {
        $examData = ExamSentence::where('exam_code', $examCode)->first();

        if (! $examData) {
            return [
                'purpose' => null,
                'reviewComment' => null,
            ];
        }

        return [
            'purpose' => $examData->purpose ?? '',
            'reviewComment' => $examData->review_comment ?? '',
        ];
    }
}
