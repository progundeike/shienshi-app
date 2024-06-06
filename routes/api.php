<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\ExamController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'getUserInfo']);
    // Route::delete('/user', [UserController::class, 'deleteUser']);
});

Route::post('/answer', [AnswerController::class, 'storeAnswerInput']);

Route::get('/questions/{examYear}-{examSeason}-{examId}', [ExamController::class, 'getQuestions']);
