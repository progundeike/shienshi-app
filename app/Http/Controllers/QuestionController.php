<?php

namespace App\Http\Controllers;

use App\Http\Requests\QuestionRequest;
use App\Models\Question;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class QuestionController extends Controller
{
    public function run(QuestionRequest $request)
    {
        $request = $request->validated();

        $year = request('year');
        $season = request('season');
        $section = request('section');

        $userId = Auth::id();

        Log::debug($request);

        // 質問をAIに投げる処理
        // 問題文を取得

        // これまでの質問とその回答を取得

        // これまでの質問とその回答をAIに投げる

        // AIの回答を取得

        // AIの回答をDBに保存

        // AIの回答を返す



        // return response()->json($questions);
    }
}
