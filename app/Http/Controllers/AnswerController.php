<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnswerRequest;
use Illuminate\Http\Request;
use App\Models\UserAnswer;
use App\Models\AnswerSubmit;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

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
        $userId = Auth::id();

        $answers = $data['answers'];
        $createdAnswers = [];

        foreach ($answers as $answer) {
            // ユーザーの回答を保存、更新する。AIの評価と回答はnullで初期化
            $createdAnswer =
                UserAnswer::updateOrCreate(
                    [
                        'user_id' => $userId,
                        'year' => $data['year'],
                        'season' => $data['season'],
                        'section' => $data['section'],
                        'question_number' => $answer['questionNumber'],
                        'sub_question_number' => $answer['subQuestionNumber'],
                    ],
                    [
                        'user_text' => $answer['user_text'],
                        'ai_rating' => null,
                        'ai_text' => null,
                    ]
                );

            $createdAnswers[] = [
                'year' => $createdAnswer->year,
                'season' => $createdAnswer->season,
                'section' => $createdAnswer->section,
                'questionNumber' => $createdAnswer->question_number,
                'subQuestionNumber' => $createdAnswer->sub_question_number,
                'user_text' => $createdAnswer->user_text,
            ];
        }

        return $createdAnswers;
    }
}
