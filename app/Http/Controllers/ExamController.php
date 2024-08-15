<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Question;
use App\Models\ExamSentence;

class ExamController extends Controller
{
    // 開催年度(year)、季節(season)、大問番号(section)を指定して、設問を取得する
    public function fetchQuestions(string $year, string $season, string $section)
    {
        try {
            $result = Question::where('year', (int) $year)
                ->where('season', $season)
                ->where('section', (int) $section)
                ->get();

            // questionsが取得できない場合は404エラーを返す
            if ($result->isEmpty()) {
                return response()->json(['error' => 'Questions not found'], 404);
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

            return response()->json($questions);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Failed to get questions'], 500);
        }
    }

    // 開催年度、季節、大問番号と設問番号、小問番号を指定して、設問を取得する
    public function fetchSingleQuestion(string $year, string $season, string $section, string $questionNumber, string $subQuestionNumber)
    {
        try {
            $result = Question::where('year', (int) $year)
                ->where('season', $season)
                ->where('section', (int) $section)
                ->where('question_number', (int) $questionNumber)
                ->where('sub_question_number', (int) $subQuestionNumber)
                ->first();

            // questionが取得できない場合は404エラーを返す
            if (!$result) {
                return response()->json(['error' => 'Question not found'], 404);
            }

            // 必要なデータだけを取り出す
            $question = [
                'year' => $result->year,
                'season' => $result->season,
                'section' => $result->section,
                'questionNumber' => $result->question_number,
                'subQuestionNumber' => $result->sub_question_number,
                'type' => $result->type,
                'text' => $result->text,
                'options' => $result->options ? json_decode($result->options) : null,
                'maxLength' => $result->max_length,
            ];

            return response()->json($question);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Failed to get question'], 500);
        }
    }

    // 指定した大問に対して、全ての設問を取得する
    public function fetchExamQuestions($year, $season, $section)
    {
        $result = Question::where('year', $year)
            ->where('season', $season)
            ->where('section', $section)
            ->get();

        $questions = $result->map(function ($question) {
            $text = $question->text;

            // 選択肢の問題の場合は選択肢をデコードする
            if ($question->type === 'radio') {
                $options = json_decode($question->options);

                $labels = array_map(function ($option) {
                    return $option->label;
                }, $options);

                $commaSeparatedLabels = implode(', ', $labels);

                $text = $text . '解答群[' . $commaSeparatedLabels . ']';
            }

            return [
                'questionNumber' => $question->question_number,
                'subQuestionNumber' => $question->sub_question_number,
                'text' => $text,
            ];
        });

        return $questions;
    }

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
}
