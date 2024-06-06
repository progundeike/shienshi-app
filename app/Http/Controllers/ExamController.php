<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExamController extends Controller
{
    public function getQuestions(string $examYear, string $examSeason, string $examId)
    {
        $questions = DB::table('questions')
            ->where('exam_year', (int) $examYear)
            ->where('exam_season', $examSeason)
            ->where('exam_id', (int) $examId)
            ->get();

        Log::debug($questions);
    }
}
