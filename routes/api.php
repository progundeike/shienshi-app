<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\AIQuestionController;
use App\Http\Controllers\AdminController;

Route::middleware('auth:sanctum')->group(function () {
    // ユーザー情報
    Route::get('/user', [UserController::class, 'getUserInfo']);
    Route::get('/user/submittedExams', [ExamController::class, 'fetchSubmittedExams']);
    Route::delete('/user', [UserController::class, 'deleteUser']);

    // 解答
    Route::post('/answer', [AnswerController::class, 'answerSubmit']);
    Route::delete('answer/{year}-{season}-{section}', [AnswerController::class, 'deleteSubmittedAnswer']);
    Route::post('/question', [AIQuestionController::class, 'run']);
    Route::get('/dialogues', [AIQuestionController::class, 'getDialogues']);
    Route::delete('/dialogues/{year}-{season}-{section}-{questionNumber}-{subQuestionNumber}', [AIQuestionController::class, 'deleteDialogues']);
    Route::get('/corrections/{year}-{season}-{section}', [AnswerController::class, 'fetchCorrection']);
});

Route::get('/questions/{year}-{season}-{section}', [ExamController::class, 'getExamQuestionsJson']);
Route::get('/exam/{year}-{season}-{section}', [ExamController::class, 'checkFileExists']);
Route::get('/exam-list', [ExamController::class, 'getExamList']);

// 管理者用のルート
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/sentence/{year}-{season}-{section}', [AdminController::class, 'fetchExamSentence']);
    Route::put('/sentence', [AdminController::class, 'updateExamSentence']);
    Route::post('/question', [AdminController::class, 'updateExamQuestion']);
    Route::post('/upload-pdf', [AdminController::class, 'uploadExamPdf']);
});
