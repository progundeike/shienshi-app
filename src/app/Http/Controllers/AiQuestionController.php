<?php

namespace App\Http\Controllers;

use App\Exceptions\AiRequestInProgressException;
use App\Exceptions\AiResponseException;
use App\Http\Requests\QuestionRequest;
use App\Models\UserAiDialogue;
use App\Services\AiClientService;
use App\Services\AiExecutionLockService;
use App\Services\AnswerBuildService;
use App\Services\ExamDataService;
use App\Services\PromptService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Throwable;

class AiQuestionController extends Controller
{
    public function __construct(
        private readonly ExamDataService $examDataService,
        private readonly AnswerBuildService $answerBuildService,
        private readonly AiClientService $aiClientService,
        private readonly AiExecutionLockService $aiExecutionLockService,
        private readonly PromptService $promptService,
    ) {
    }

    // リクエストの例
    // [
    //     'examCode' => '2023_aki_1',
    //     'questionCode' => '1_1_0',
    //     'message' => 'test',
    // ];
    public function run(QuestionRequest $request): JsonResponse|Response
    {
        $start = microtime(true);
        $examCode = null;
        $questionCode = null;

        $userId = $this->currentUserId();

        try {
            $validated = $request->validated();

            // 試験回とどの設問への質問かを取得
            $examCode = $validated['examCode'];
            $questionCode = $validated['questionCode'];
            $userMessage = $validated['message'];

            // processingの管理
            $processingKey = $this->aiExecutionLockService->keyForAiQuestion($userId, $examCode, $questionCode);

            return $this->aiExecutionLockService->run($processingKey, function () use (
                $examCode,
                $questionCode,
                $userMessage,
                $userId
            ) {
                // 問題文を取得
                $examSentence = $this->examDataService->fetchExamSentences($examCode);
                $examQuestions = $this->examDataService->fetchExamQuestionsForAi($examCode, $questionCode);

                // 模範解答を取得
                $modelAnswers = $this->examDataService->fetchModelAnswers($examCode, $questionCode);

                // ユーザーの回答を取得
                $userAnswer = $this->examDataService->fetchUserAnswer($userId, $examCode, $questionCode);
                $userAnswerContent = $this->examDataService->convertUserAnswerToText([$userAnswer], $examQuestions);

                // これまでの質問とその回答を取得
                $dialogues = $this->fetchDialogues($userId, $examCode, $questionCode);

                // これまでの質問とその回答に新しい質問を追加してAIに投げる
                $dialogues[] =
                    [
                        'role' => 'user',
                        'content' => $userMessage,
                    ];

                // プロンプトを組み立てる
                $questionPrompt = $this->answerBuildService->buildQuestionPrompt($examSentence, $examQuestions, $modelAnswers);

                $prompt = [
                    [
                        'role' => 'system',
                        'content' => $this->promptService->aiQuestionSystemPrompt().PHP_EOL.$questionPrompt,
                    ],
                    [
                        'role' => 'user',
                        'content' => '<ユーザーの解答>'.$userAnswerContent.'</ユーザーの解答>',
                    ],
                ];

                // dialoguesをpromptに追加
                $prompt = array_merge($prompt, $dialogues);

                // AIに投げる
                $result = $this->aiClientService->chat($prompt);

                $aiMessage = data_get($result, 'choices.0.message.content');

                if (! is_string($aiMessage) || trim($aiMessage) === '') {
                    throw new AiResponseException('AI response is missing content');
                }

                // ユーザーの質問とAIの回答をDBに保存
                UserAiDialogue::create([
                    'user_id' => $userId,
                    'exam_code' => $examCode,
                    'question_code' => $questionCode,
                    'user_question' => $userMessage,
                    'ai_answer' => $aiMessage,
                ]);

                // AIの回答を返す
                return response()->json($aiMessage, 200);
            });
        } catch (AiRequestInProgressException $e) {
            return response()->json(['message' => '前のAI処理がまだ実行中です。少し待ってから再度お試しください'], 429);
        } catch (ModelNotFoundException $e) {
            Log::error('Required resource not found in AiQuestionController:run', [
                'examCode' => $examCode,
                'questionCode' => $questionCode,
            ]);

            return response()->json(['message' => 'Required exam data not found'], 404);
        } catch (AiResponseException $e) {
            Log::error('AI response failed', ['error' => $e->getMessage()]);

            return response()->json(['message' => 'AI service is unavailable'], 502);
        } catch (Throwable $e) {
            Log::error('Unexpected error in AiQuestionController::run', ['error' => $e]);

            return response()->json(['message' => 'Failed to process AI Question'], 500);
        } finally {
            $elapsedSec = round(microtime(true) - $start, 3);
            Log::debug('AI question run elapsed', ['sec' => $elapsedSec]);
        }
    }

    public function fetchChatProcessingStatus(string $examCode, string $questionCode)
    {
        $userId = $this->currentUserId();

        $processingKey = $this->aiExecutionLockService->keyForAiQuestion($userId, $examCode, $questionCode);
        $isProcessing = $this->aiExecutionLockService->isProcessing($processingKey);

        return response()->json(['status' => $isProcessing ? 'processing' : 'idle'], 200);
    }

    public function getDialogues(string $examCode, string $questionCode)
    {
        $userId = $this->currentUserId();

        $dialogues = $this->fetchDialogues($userId, $examCode, $questionCode);

        return response()->json($dialogues, 200);
    }

    /**
     * これまでの対話履歴を取得する
     *
     * @return list<array{role: 'user'|'assistant', content: string}>
     */
    private function fetchDialogues(int|string $userId, string $examCode, string $questionCode): array
    {
        $results = UserAiDialogue::where('user_id', $userId)
            ->where('exam_code', $examCode)
            ->where('question_code', $questionCode)
            ->orderBy('created_at', 'asc')
            ->orderBy('id', 'asc') // created_atが同じ場合の順序保証
            ->get();

        $dialogues = [];
        foreach ($results as $result) {
            $dialogues[] = [
                'role' => 'user',
                'content' => $result->user_question,
            ];
            $dialogues[] = [
                'role' => 'assistant',
                'content' => $result->ai_answer,
            ];
        }

        return $dialogues;
    }

    public function deleteDialogues(string $examCode, string $questionCode)
    {
        $userId = $this->currentUserId();

        try {
            UserAiDialogue::where('user_id', $userId)
                ->where('exam_code', $examCode)
                ->where('question_code', $questionCode)
                ->delete();

            // 対象の対話がなかった場合も、削除後は空の状態なので成功とみなす

            return response()->noContent();
        } catch (Throwable $e) {
            Log::error('Failed to delete dialogues', [
                'examCode' => $examCode,
                'questionCode' => $questionCode,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Failed to delete'], 500);
        }
    }
}
