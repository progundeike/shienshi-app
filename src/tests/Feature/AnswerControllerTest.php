<?php

namespace Tests\Feature;

use App\Exceptions\AiResponseException;
use App\Models\User;
use App\Services\AiClientService;
use App\Services\AiExecutionLockService;
use Illuminate\Contracts\Cache\LockProvider;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Mockery\Expectation;
use Mockery\MockInterface;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\Support\FeatureTestCase;

class AnswerControllerTest extends FeatureTestCase
{
    #[Test]
    public function ユーザーの回答とaiの添削を取得できる(): void
    {
        $response = $this->actingAs($this->normalUser)->getJson("/api/corrections/{$this->testExamCode}", ['Accept' => 'application/json']);

        $response->assertStatus(200);
        $this->assertCount(3, $response->json());
    }

    #[Test]
    public function 多重実行時は429を返す(): void
    {
        Log::spy();
        /** @var User $user */
        $user = User::factory()->createOne();
        $this->actingAs($user);

        $processingKey = app(AiExecutionLockService::class)->keyForAnswer($user->id, $this->testExamCode);

        $store = Cache::store('redis')->getStore();
        if (! $store instanceof LockProvider) {
            throw new \RuntimeException("The cache store 'redis' does not support locking.");
        }
        $lock = $store->lock($processingKey, 60);
        $this->assertTrue($lock->get());
        Cache::store('redis')->put($processingKey, true, 60);

        $payLoad = [
            'year' => $this->testExamYear,
            'season' => $this->testExamSeason,
            'section' => $this->testExamSection,
            'answers' => [
                ['questionCode' => '1_1_0', 'user_text' => 'test'],
            ],
        ];

        try {
            $response = $this->postJson('/api/answer', $payLoad, ['Accept' => 'application/json']);
            $response->assertStatus(429);
        } finally {
            $lock->release();
        }
    }

    #[Test]
    public function openaiのapiエラー時は502を返す(): void
    {
        Log::spy();

        /** @var User $user */
        $user = User::factory()->createOne();
        $this->actingAs($user);

        $payLoad = [
            'year' => $this->testExamYear,
            'season' => $this->testExamSeason,
            'section' => $this->testExamSection,
            'answers' => [
                ['questionCode' => '1_1_0', 'user_text' => 'test'],
            ],
        ];

        // ロックを解除しておく
        $examCode = $payLoad['year'].'_'.$payLoad['season'].'_'.$payLoad['section'];
        $processingKey = app(AiExecutionLockService::class)->keyForAnswer($user->id, $examCode);
        Cache::store('redis')->forget($processingKey);

        $this->mock(AiClientService::class, function (MockInterface $mock) {
            /** @var Expectation $exception */
            $exception = $mock->shouldReceive('useFunctionCall');

            $exception
                ->once()
                ->andThrow(new AiResponseException('AI failed'));
        });

        $response = $this->postJson('/api/answer', $payLoad, ['Accept' => 'application/json']);
        $response->assertStatus(502);
        $response->assertJson(['message' => 'AIとの接続に不具合が生じております。しばらく経ってから再度お試しください。']);
    }

    #[Test]
    public function ユーザーが答案を提出してaiの添削を保存できる(): void
    {
        $this->actingAs($this->normalUser);

        $this->mock(
            AiClientService::class,
            function (MockInterface $mock): void {
                /** @var Expectation $expectation */
                $expectation = $mock->shouldReceive('useFunctionCall');

                $expectation
                    ->once()
                    ->andReturn([
                        'choices' => [
                            [
                                'message' => [
                                    'functionCall' => [
                                        'name' => 'reviewUserAnswer',
                                        'arguments' => json_encode([
                                            'evaluations' => [
                                                [
                                                    'questionCode' => '1_1_0',
                                                    'rating' => '◯',
                                                    'comment' => 'ダミーの添削です。',
                                                ],
                                            ],
                                        ], JSON_UNESCAPED_UNICODE),
                                    ],
                                ],
                            ],
                        ],
                    ]);
            }
        );

        $payload = [
            'year' => $this->testExamYear,
            'season' => $this->testExamSeason,
            'section' => $this->testExamSection,
            'answers' => [
                [
                    'questionCode' => '1_1_0',
                    'content' => 'test',
                ],
            ],
        ];

        $response = $this->postJson('/api/answer', $payload);
        $response->assertCreated();

        $this->assertDatabaseHas('user_answers', [
            'user_id' => $this->normalUser->id,
            'exam_code' => $this->testExamCode,
            'question_code' => '1_1_0',
            'user_text' => 'test',
            'ai_rating' => '◯',
            'ai_text' => 'ダミーの添削です。',

        ]);

        $this->assertDatabaseHas('submitted_exams', [
            'user_id' => $this->normalUser->id,
            'exam_code' => $this->testExamCode,
        ]);
    }

    #[Test]
    public function レート制限が機能する(): void
    {
        RateLimiter::clear(
            md5('ai-answer'."ai-answer:10-minutes:{$this->normalUser->id}")
        );
        RateLimiter::clear(
            md5('ai-answer'."ai-answer:daily:{$this->normalUser->id}")
        );

        $this->mock(
            AiClientService::class,
            function (MockInterface $mock): void {
                /** @var Expectation $expectation */
                $expectation = $mock->shouldReceive('useFunctionCall');
                $expectation
                    ->times(3) // 4回目はコントローラーに到達していないことをテスト
                    ->andReturn([
                        'choices' => [
                            [
                                'message' => [
                                    'functionCall' => [
                                        'name' => 'reviewUserAnswer',
                                        'arguments' => json_encode([
                                            'evaluations' => [
                                                [
                                                    'questionCode' => '1_1_0',
                                                    'rating' => '◯',
                                                    'comment' => 'ダミーの添削です。',
                                                ],
                                            ],
                                        ], JSON_UNESCAPED_UNICODE),
                                    ],
                                ],
                            ],
                        ],
                    ]);
            }
        );

        $payload = [
            'year' => $this->testExamYear,
            'season' => $this->testExamSeason,
            'section' => $this->testExamSection,
            'answers' => [
                [
                    'questionCode' => '1_1_0',
                    'content' => 'test',
                ],
            ],
        ];

        // 3回までは成功
        for ($i = 0; $i < 3; $i++) {
            $this->actingAs($this->normalUser)
                ->postJson('/api/answer', $payload)
                ->assertCreated();
        }

        // 4回目はレート制限
        $this->actingAs($this->normalUser)
            ->postJson('/api/answer', $payload)
            ->assertStatus(429);
    }
}
