<?php

namespace Tests\Feature;

use App\Models\UserAiDialogue;
use App\Services\AiClientService;
use Illuminate\Support\Facades\RateLimiter;
use Mockery\Expectation;
use Mockery\MockInterface;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\Support\FeatureTestCase;

class AiQuestionControllerTest extends FeatureTestCase
{
    #[Test]
    public function ユーザーがaiチャットの対話履歴を取得できる(): void
    {
        $response = $this->actingAs($this->normalUser)->get("/api/dialogues/{$this->testExamCode}/1_1_0");

        $response->assertStatus(200);
        $data = $response->json();
        $this->assertEquals('user', $data[0]['role']);
        $this->assertEquals('これはユーザーが投稿したAIへの質問のサンプル1です。', $data[0]['content']);
        $this->assertEquals('assistant', $data[1]['role']);
        $this->assertEquals('これはAIからのダミーの回答1です。', $data[1]['content']);
    }

    #[Test]
    public function ユーザーがaiチャットの対話履歴を削除できる(): void
    {
        // ターゲットを取得
        $target = UserAiDialogue::where('user_id', $this->normalUser->id)
            ->where('exam_code', $this->testExamCode)
            ->where('question_code', '1_1_0')
            ->first();

        $response = $this->actingAs($this->normalUser)->delete("/api/dialogues/{$this->testExamCode}/1_1_0");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('user_ai_dialogues', ['id' => $target->id]);
    }

    #[Test]
    public function ユーザーがaiに質問できる(): void
    {
        $userMessage = 'これはユーザーからのダミーの質問です。';
        $aiMessage = 'これはAIからのダミーの解答です。';

        $this->mock(
            AiClientService::class,
            function (MockInterface $mock) use ($aiMessage, $userMessage): void {
                $mock->expects('chat')
                    ->withArgs(function (array $prompt) use ($userMessage): bool {
                        $lastMessage = $prompt[array_key_last($prompt)];

                        return $lastMessage === [
                            'role' => 'user',
                            'content' => $userMessage,
                        ];
                    })
                    ->andReturn([
                        'choices' => [
                            [
                                'message' => [
                                    'content' => $aiMessage,
                                ],
                            ],
                        ],
                    ]);
            }
        );

        $response = $this->actingAs($this->normalUser)->postJson('/api/chat', [
            'examCode' => $this->testExamCode,
            'questionCode' => '1_1_0',
            'message' => $userMessage,
        ]);

        $response->assertOk();
        $this->assertSame($aiMessage, $response->json());

        $this->assertDatabaseHas('user_ai_dialogues', [
            'user_id' => $this->normalUser->id,
            'exam_code' => $this->testExamCode,
            'question_code' => '1_1_0',
            'user_question' => $userMessage,
            'ai_answer' => $aiMessage,
        ]);
    }

    #[Test]
    public function aiチャットのレート制限が機能する(): void
    {
        RateLimiter::clear(
            md5('ai-chat' . "ai-chat:10-minutes:{$this->normalUser->id}")
        );
        RateLimiter::clear(
            md5('ai-chat' . "ai-chat:daily:{$this->normalUser->id}")
        );

        $this->mock(
            AiClientService::class,
            function (MockInterface $mock): void {
                /** @var Expectation $expectation */
                $expectation = $mock->shouldReceive('chat');
                $expectation
                    ->times(5)
                    ->andReturn([
                        'choices' => [
                            [
                                'message' => [
                                    'content' => 'AIのダミー回答です。',
                                ],
                            ],
                        ],
                    ]);
            }
        );

        $requestData = [
            'examCode' => $this->testExamCode,
            'questionCode' => '1_1_0',
            'message' => 'ユーザーからの質問です。',
        ];

        // 5回までは成功
        for ($i = 0; $i < 5; $i++) {
            $this->actingAs($this->normalUser)
                ->postJson('/api/chat', $requestData)
                ->assertOk();
        }

        // 6回目はレート制限
        $this->actingAs($this->normalUser)
            ->postJson('/api/chat', $requestData)
            ->assertStatus(429);
    }
}
