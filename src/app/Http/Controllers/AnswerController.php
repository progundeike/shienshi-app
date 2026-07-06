<?php

namespace App\Http\Controllers;

use App\Exceptions\AiRequestInProgressException;
use App\Exceptions\AiResponseException;
use App\Exceptions\ExamDataException;
use App\Http\Requests\AnswerRequest;
use App\Models\SubmittedExam;
use App\Models\UserAiDialogue;
use App\Models\UserAnswer;
use App\Services\AiClientService;
use App\Services\AiExecutionLockService;
use App\Services\AnswerBuildService;
use App\Services\ExamDataService;
use App\Services\PromptService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class AnswerController extends Controller
{
    public function __construct(
        private readonly ExamDataService $examDataService,
        private readonly AnswerBuildService $answerBuildService,
        private readonly AiClientService $aiClientService,
        private readonly PromptService $promptService,
        private readonly AiExecutionLockService $aiExecutionLockService,
    ) {}

    public function answerSubmit(AnswerRequest $request): JsonResponse
    {
        $start = microtime(true);
        $userId = $this->currentUserId();
        $examCode = null;

        try {
            $validated = $request->validated();
            $examCode = $validated['year'].'_'.$validated['season'].'_'.$validated['section'];
            $processingKey = $this->aiExecutionLockService->keyForAnswer($userId, $examCode);

            return $this->aiExecutionLockService->run($processingKey, function () use (
                $examCode,
                $validated,
                $userId
            ) {

                $examSentence = $this->examDataService->fetchExamSentences($examCode);
                $examQuestions = $this->examDataService->fetchExamQuestionsForAi($examCode);

                // ユーザーの回答
                $userAnswers = $this->formatUserAnswers($validated['answers']);
                $userAnswerText = $this->examDataService->convertUserAnswerToText($userAnswers, $examQuestions);

                // 模範解答を取得
                $modelAnswers = $this->examDataService->fetchModelAnswers($examCode);

                if (count($examQuestions) !== count($modelAnswers)) {
                    throw new ExamDataException('Question count and model answer count do not match');
                }

                // プロンプトを組み立てる
                // プロンプトは <SystemPrompt> <Question> <UserAnswer> の3つから構成される
                $questionPrompt = $this->answerBuildService->buildQuestionPrompt($examSentence, $examQuestions, $modelAnswers);

                $prompt = [
                    [
                        'role' => 'system',
                        'content' => $this->promptService->answerSystemPrompt().PHP_EOL.$questionPrompt,
                    ],
                    [
                        'role' => 'user',
                        'content' => '<UserAnswer>'.$userAnswerText.'</UserAnswer>',
                    ],
                ];

                // AIに投げる
                $argumentsJson = $this->aiClientService->useFunctionCall($prompt, $this->promptService->answerFunctionParameter());

                try {
                    $arguments = json_decode($argumentsJson, true, 512, JSON_THROW_ON_ERROR);
                } catch (\JsonException $e) {
                    throw new AiResponseException('Failed to decode AI function call arguments', 0, $e);
                }

                if (! is_array($arguments) || ! isset($arguments['evaluations']) || ! is_array($arguments['evaluations'])) {
                    throw new AiResponseException('AI function call arguments are not in expected format');
                }

                $evaluations = $arguments['evaluations'];

                $aiResponseMap = $this->buildAiResponseMap($evaluations);
                $rows = $this->buildUpsertRows($userAnswers, $aiResponseMap, $modelAnswers, $examCode, $userId);

                DB::transaction(function () use ($rows, $userId, $examCode) {
                    UserAnswer::upsert($rows, ['user_id', 'exam_code', 'question_code'], ['user_text', 'ai_rating', 'ai_text', 'updated_at']);

                    SubmittedExam::updateOrCreate(
                        [
                            'user_id' => $userId,
                            'exam_code' => $examCode,
                        ],
                        [
                            'updated_at' => now(),
                        ]
                    );
                });

                return response()->json(['message' => 'Answer submitted successfully'], 201);
            });
        } catch (ExamDataException $e) {
            Log::error('Exam data error in AnswerController::answerSubmit', ['error' => $e]);

            return response()->json(['message' => '試験データの取得に失敗しました。しばらく経ってから再度お試しください。'], 500);
        } catch (AiRequestInProgressException $e) {
            Log::warning('AI request in progress in AnswerController::answerSubmit', [
                'error' => $e,
            ]);

            if ($e->getMessage() === 'already_processing') {
                return response()->json(['message' => '前のAI処理がまだ実行中です。少し待ってから再度お試しください'], 429);
            }

            if ($e->getMessage() === 'ttl_exceeded') {
                return response()->json(['message' => '混雑中のため処理がタイムアウトしました。少し待ってから再度お試しください。'], 429);
            }

            return response()->json(['message' => '混雑中のため処理がタイムアウトしました。少し待ってから再度お試しください。'], 429);
        } catch (ModelNotFoundException $e) {
            Log::error('Required resource not found in AnswerController::answerSubmit', [
                'error' => $e,
            ]);

            return response()->json(['message' => 'Required exam data not found'], 404);
        } catch (AiResponseException $e) {
            Log::error('AI response error in AnswerController::answerSubmit', ['error' => $e]);

            return response()->json(['message' => 'AIとの接続に不具合が生じております。しばらく経ってから再度お試しください。'], 502);
        } catch (Throwable $e) {
            Log::error('Unexpected error in AnswerController::answerSubmit', ['error' => $e]);

            return response()->json(['message' => 'Failed to process chat'], 500);
        } finally {
            $elapsedSec = round(microtime(true) - $start, 3);
            Log::info('answerSubmit elapsed', ['sec' => $elapsedSec]);
        }
    }

    public function fetchAnswerProcessingStatus(string $examCode): JsonResponse
    {
        $userId = $this->currentUserId();

        $processingKey = $this->aiExecutionLockService->keyForAnswer($userId, $examCode);
        $isProcessing = $this->aiExecutionLockService->isProcessing($processingKey);

        return response()->json(['status' => $isProcessing ? 'processing' : 'idle'], 200);
    }

    private function formatUserAnswers(array $answers): array
    {
        $userAnswers = [];

        foreach ($answers as $answer) {
            $userAnswers[] = [
                'questionCode' => $answer['questionCode'],
                'userText' => $answer['user_text'],
            ];
        }

        return $userAnswers;
    }

    private function buildAiResponseMap(array $evaluations): array
    {
        $aiResponseMap = [];
        foreach ($evaluations as $evaluation) {
            if (! is_array($evaluation)) {
                Log::warning('Skipping invalid evaluation item', ['evaluation' => $evaluation]);

                continue;
            }

            $questionCode = $evaluation['questionCode'] ?? null;

            if (! is_string($questionCode) || trim($questionCode) === '') {
                Log::warning('Skipping evaluation with invalid questionCode', ['questionCode' => $questionCode]);

                continue;
            }

            $rating = $evaluation['rating'] ?? '-';
            if (! is_string($rating)) {
                $rating = '-';
            }
            $rating = trim($rating);

            if (! in_array($rating, ['◯', '△', '×'], true)) {
                Log::warning('Unexpected rating value in evaluation', [
                    'questionCode' => $questionCode,
                    'rating' => $rating,
                ]);
                $rating = '-';
            }

            $comment = $evaluation['comment'] ?? '';
            if (! is_string($comment)) {
                $comment = '';
            }

            $aiResponseMap[$questionCode] = [
                'ai_rating' => $rating,
                'ai_text' => $comment,
            ];
        }

        return $aiResponseMap;
    }

    private function buildUpsertRows(
        array $userAnswers,
        array $aiResponseMap,
        array $modelAnswers,
        string $examCode,
        int $userId
    ): array {
        $modelMap = array_column($modelAnswers, 'text', 'questionCode');
        $now = now();
        $rows = [];

        foreach ($userAnswers as $answer) {
            // ユーザーが無回答の問題はai_textを模範解答で上書きする
            // ai_textが取得できなかった場合も模範解答を返す
            $userText = trim((string) $answer['userText']);
            $aiRating = $aiResponseMap[$answer['questionCode']]['ai_rating'] ?? '-';
            $aiText = $aiResponseMap[$answer['questionCode']]['ai_text'] ?? '';

            if (trim($aiText) === '') {
                $aiText = '模範解答: '.($modelMap[$answer['questionCode']] ?? '');
            }

            if ($userText === '') {
                $aiRating = '×';
                $aiText = '模範解答: '.($modelMap[$answer['questionCode']] ?? '');
            }

            $rows[] = [
                'user_id' => $userId,
                'exam_code' => $examCode,
                'question_code' => $answer['questionCode'],
                'user_text' => $answer['userText'],
                'ai_rating' => $aiRating,
                'ai_text' => $aiText,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        return $rows;
    }

    // ユーザーの回答とAIの添削を取得する
    public function fetchCorrection(string $examCode): JsonResponse
    {
        $userId = $this->currentUserId();

        $userAnswers = UserAnswer::where('user_id', $userId)
            ->where('exam_code', $examCode)
            ->get();

        if ($userAnswers->isEmpty()) {
            return response()->json([], 200);
        }

        $answers = $userAnswers->map(function ($answer) {
            [$q, $sub, $small] = array_map('intval', explode('_', $answer['question_code']));

            return [
                'questionNumber' => $q,
                'subQuestionNumber' => $sub,
                'smallQuestionNumber' => $small,
                'userText' => $answer->user_text,
                'aiRating' => $answer->ai_rating,
                'aiText' => $answer->ai_text,
            ];
        })->toArray();

        return response()->json($answers, 200);
    }

    public function deleteSubmittedAnswer(string $year, string $season, string $section): JsonResponse
    {
        $userId = $this->currentUserId();

        $year = (int) $year;
        $section = (int) $section;
        $examCode = $year.'_'.$season.'_'.$section;

        try {
            $deletedAnswers =
                DB::transaction(function () use ($userId, $examCode) {
                    $deletedAnswers = UserAnswer::where('user_id', $userId)
                        ->where('exam_code', $examCode)
                        ->delete();

                    UserAiDialogue::where('user_id', $userId)
                        ->where('exam_code', $examCode)
                        ->delete();

                    return $deletedAnswers;
                });

            if ($deletedAnswers === 0) {
                return response()->json(['message' => 'No records found to delete'], 404);
            } else {
                return response()->json(['message' => 'Deleted'], 200);
            }
        } catch (Throwable $e) {
            Log::error('Failed to delete submitted answer', [
                'examCode' => $examCode,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Failed to delete'], 500);
        }
    }
}
