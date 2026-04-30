<?php

namespace App\Services;

class AnswerBuildService
{
    public function buildQuestionPrompt(array $examSentence, array $examQuestions, array $modelAnswers): string
    {
        $sentence = $examSentence['sentence']; // 問題文
        $modelMap = array_column($modelAnswers, 'text', 'questionCode');

        $questionAndAnswerText = '';
        for ($i = 0; $i < count($examQuestions); $i++) {
            if ($examQuestions[$i]['subQuestionNumber'] === 1 && $examQuestions[$i]['smallQuestionNumber'] < 2) {
                $questionAndAnswerText .= '設問'.$examQuestions[$i]['questionNumber'].' ';
            }

            // text_for_aiも渡す
            if ($examQuestions[$i]['textForAi']) {
                $questionAndAnswerText .= '[AI添削用の設問への補足:'.$examQuestions[$i]['textForAi'].']';
            }

            $modelText = $modelMap[$examQuestions[$i]['questionCode']] ?? '(模範解答なし)';

            $questionAndAnswerText .= $this->convertQuestionToString($examQuestions[$i]);

            // labelがあれば追加
            if ($examQuestions[$i]['options'] && isset($examQuestions[$i]['options'][0]['label'])) {
                $questionAndAnswerText .= $examQuestions[$i]['options'][0]['label'];
            }

            $questionAndAnswerText .= '[模範解答:'.$modelText.']'.PHP_EOL;
        }

        // 参考情報
        // $purpose = $examData['purpose']; // 出題趣旨
        // $reviewComment = $examData['review_comment']; // 採点講評

        return <<<EOF
                <Question>
                <問題文>{$sentence}</問題文>
                <設問と解答>{$questionAndAnswerText}</設問と解答>
                </Question>
                EOF;
    }

    // 設問を文字列に変換する
    public function convertQuestionToString(array $questionArray): string
    {
        $text = $questionArray['text'];

        // 選択肢の問題の場合は選択肢をデコードする
        if ($questionArray['type'] === 'radio') {
            $options = $questionArray['options'];

            $choices = '';
            foreach ($options as $option) {
                $choices .= '('.$option['value'].') '.$option['label'].', ';
            }

            $text .= '[解答群:'.$choices.']';
        }

        return $text;
    }
}
