<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AiQuestionController;
use App\Http\Controllers\AnswerController;
use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\NewsItemController;
use Illuminate\Support\Facades\Route;

Route::get('/questions/{examCode}', [ExamController::class, 'getExamQuestionsJson']);
Route::get('/exam/{year}-{season}-{section}', [ExamController::class, 'checkFileExists']);
Route::get('/news', [NewsItemController::class, 'index']);
Route::post('/inquiry', [InquiryController::class, 'store'])->middleware('throttle:inquiry');

Route::middleware('auth:sanctum')->group(function () {
    // ユーザー情報
    Route::get('/user', [UserController::class, 'getUserInfo']);
    Route::get('/user/submittedExams', [ExamController::class, 'fetchSubmittedExams']);
    Route::delete('/user', [UserController::class, 'deleteUser']);

    // 解答
    Route::post('/answer', [AnswerController::class, 'answerSubmit'])->middleware('throttle:ai-answer');
    Route::delete('answer/{year}-{season}-{section}', [AnswerController::class, 'deleteSubmittedAnswer']);
    Route::post('/chat', [AiQuestionController::class, 'run'])->middleware('throttle:ai-chat');
    Route::get('/dialogues/{examCode}/{questionCode}', [AiQuestionController::class, 'getDialogues']);
    Route::delete('/dialogues/{examCode}/{questionCode}', [AiQuestionController::class, 'deleteDialogues']);
    Route::get('/corrections/{examCode}', [AnswerController::class, 'fetchCorrection']);
    Route::get('/answer-processing-status/{examCode}', [AnswerController::class, 'fetchAnswerProcessingStatus']);
    Route::get('/chat-processing-status/{examCode}/{questionCode}', [AiQuestionController::class, 'fetchChatProcessingStatus']);

    // 採点講評、出題趣旨
    Route::get('/exam/{examCode}/review', [ExamController::class, 'getPurposeAndReviewComment']);
});

// 管理者用のルート
Route::middleware(['auth:sanctum', 'admin', 'admin.2fa'])->prefix('admin')->group(function () {
    Route::get('/sentence/{year}-{season}-{section}', [AdminController::class, 'fetchExamSentence']);
    Route::put('/sentence', [AdminController::class, 'updateExamSentence']);
    Route::post('/upload-pdf', [AdminController::class, 'uploadExamPdf']);
    Route::delete('/delete-pdf/{year}-{season}-{section}', [AdminController::class, 'deleteExamPdf']);
    Route::get('/model-answers/{examCode}', [AdminController::class, 'getModelAnswers']);
    Route::post('/model-answers/{examCode}', [AdminController::class, 'updateModelAnswers']);

    Route::get('/questions/{examCode}', [AdminController::class, 'fetchQuestionsForEdit']);
    Route::post('/question', [AdminController::class, 'updateExamQuestion']);
    Route::delete('/question/{examCode}/{questionCode}', [AdminController::class, 'deleteQuestion']);

    // お知らせ管理
    Route::post('/news', [NewsItemController::class, 'createOrUpdate']);
    Route::delete('/news/{newsItem}', [NewsItemController::class, 'delete']);

    // お問い合わせ
    Route::get('/inquiry', [InquiryController::class, 'index']);
    Route::delete('/inquiry/{inquiry}', [InquiryController::class, 'destroy']);
});
