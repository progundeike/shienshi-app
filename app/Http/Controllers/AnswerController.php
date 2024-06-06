<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnswerRequest;
use Illuminate\Http\Request;
use App\Models\Answer;
use App\Models\UserAnswer;
use Illuminate\Support\Facades\Log;

class AnswerController extends Controller
{
    public function storeAnswerInput(AnswerRequest $request)
    {
        $data = $request->validated();

        $userAnswer = UserAnswer::create(
            [
                'user_id' => $data['userId'],
            ]
        );

        $answers = $data['answers'];
        foreach ($answers as $answer) {
            Answer::create([
                'submit_id' => $userAnswer->id,
                'exam_year' => $data['examYear'],
                'exam_season' => $data['examSeason'],
                'question_id' => $answer['questionId'],
                'sub_question_id' => $answer['subQuestionId'],
                'text' => $answer['text'],
            ]);
        }
    }
}
