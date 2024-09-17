<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\AIQuestionController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'getUserInfo']);
    // Route::delete('/user', [UserController::class, 'deleteUser']);
    Route::post('/answer', [AnswerController::class, 'run']);
    Route::post('/question', [AIQuestionController::class, 'run']);
});


Route::get('/questions/{year}-{season}-{section}', [ExamController::class, 'getExamQuestionsJson']);
