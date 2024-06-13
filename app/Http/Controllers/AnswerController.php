<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnswerRequest;
use Illuminate\Http\Request;
use App\Models\UserAnswer;
use App\Models\AnswerSubmit;
use Illuminate\Support\Facades\Log;

class AnswerController extends Controller
{
    public function run(AnswerRequest $request)
    {
        $userAnswers = $this->storeAnswerInput($request);

        $controller = new AIcontroller($userAnswers);
        $aiResponse = $controller->run();

        return response()->json($aiResponse, 200);
    }

    private function storeAnswerInput(AnswerRequest $request): array
    {
        $data = $request->validated();

        $answerSubmit = AnswerSubmit::create(
            [
                'user_id' => $data['userId'],
            ]
        );

        $answers = $data['answers'];
        $createdAnswers = [];

        foreach ($answers as $answer) {
            $createdAnswer =
                UserAnswer::create([
                    'submit_id' => $answerSubmit->id,
                    'exam_year' => $data['examYear'],
                    'exam_season' => $data['examSeason'],
                    'question_id' => $answer['questionId'],
                    'sub_question_id' => $answer['subQuestionId'],
                    'text' => $answer['text'],
                ]);

            $createdAnswers[] = [
                'submitId' => $createdAnswer->submit_id,
                'examYear' => $createdAnswer->exam_year,
                'examSeason' => $createdAnswer->exam_season,
                'questionId' => $createdAnswer->question_id,
                'subQuestionId' => $createdAnswer->sub_question_id,
                'text' => $createdAnswer->text,
            ];
        }

        return $createdAnswers;
    }
}
