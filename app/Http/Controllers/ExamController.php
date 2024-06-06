<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Question;

class ExamController extends Controller
{
    public function getQuestions(string $examYear, string $examSeason, string $examId)
    {
        try {
            $result = Question::where('exam_year', (int) $examYear)
                ->where('exam_season', $examSeason)
                ->where('exam_id', (int) $examId)
                ->get();


            // questionsが取得できない場合は404エラーを返す
            if ($result->isEmpty()) {
                return response()->json(['error' => 'Questions not found'], 404);
            }

            // 必要なデータだけを取り出す
            $questions = $result->map(function ($question) {
                return [
                    'examYear' => $question->exam_year,
                    'examSeason' => $question->exam_season,
                    'examId' => $question->exam_id,
                    'questionId' => $question->question_id,
                    'subQuestionId' => $question->sub_question_id,
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
}
