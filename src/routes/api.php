<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AiQuestionController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\NewsItemController;
use Illuminate\Support\Facades\Route;

Route::get('/questions/{year}-{season}-{section}', [ExamController::class, 'getExamQuestionsJson']);
Route::get('/exam/{year}-{season}-{section}', [ExamController::class, 'checkFileExists']);
Route::get('/exam-list', [ExamController::class, 'getExamList']);
Route::get('/news', [NewsItemController::class, 'index']);
Route::post('/inquiry', [InquiryController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    // ユーザー情報
    Route::get('/user', [UserController::class, 'getUserInfo']);
    Route::get('/user/submittedExams', [ExamController::class, 'fetchSubmittedExams']);
    Route::delete('/user', [UserController::class, 'deleteUser']);

    // 解答
    Route::post('/answer', [AnswerController::class, 'answerSubmit']);
    Route::delete('answer/{year}-{season}-{section}', [AnswerController::class, 'deleteSubmittedAnswer']);
    Route::post('/chat', [AiQuestionController::class, 'run']);
    Route::get('/dialogues/{examCode}/{questionCode}', [AiQuestionController::class, 'getDialogues']);
    Route::delete('/dialogues/{examCode}/{questionCode}', [AiQuestionController::class, 'deleteDialogues']);
    Route::get('/corrections/{examCode}', [AnswerController::class, 'fetchCorrection']);
});

// 管理者用のルート
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/sentence/{year}-{season}-{section}', [AdminController::class, 'fetchExamSentence']);
    Route::put('/sentence', [AdminController::class, 'updateExamSentence']);
    Route::post('/upload-pdf', [AdminController::class, 'uploadExamPdf']);
    Route::get('/model-answers/{year}-{season}-{section}', [AdminController::class, 'getModelAnswers']);
    Route::post('/model-answers/{year}-{season}-{section}', [AdminController::class, 'updateModelAnswers']);

    Route::get('/questions/{year}-{season}-{section}', [AdminController::class, 'fetchQuestionsForEdit']);
    Route::post('/question', [AdminController::class, 'updateExamQuestion']);
    Route::delete('/question/{year}-{season}-{section}/{questionCode}', [AdminController::class, 'deleteQuestion']);

    // お知らせ管理
    Route::post('/news', [NewsItemController::class, 'createOrUpdate']);
    Route::delete('/news/{newsItem}', [NewsItemController::class, 'delete']);

    // お問い合わせ
    Route::get('/inquiry', [InquiryController::class, 'index']);
    Route::delete('/inquiry/{inquiry}', [InquiryController::class, 'destroy']);
});
