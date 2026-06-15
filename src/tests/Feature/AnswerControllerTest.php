<?php

namespace Tests\Feature;

use App\Exceptions\AiResponseException;
use App\Models\User;
use App\Services\AiClientService;
use App\Services\AiExecutionLockService;
use Illuminate\Contracts\Cache\LockProvider;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Mockery\MockInterface;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\Support\FeatureTestCase;

class AnswerControllerTest extends FeatureTestCase
{
    #[Test]
    public function ユーザーの回答とAIの添削を取得できる(): void
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
    public function openAIのAPIエラー時は502を返す(): void
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
            /** @var \Mockery\Expectation $exception */
            $exception = $mock->shouldReceive('useFunctionCall');

            $exception
                ->once()
                ->andThrow(new AiResponseException('AI failed'));
        });

        $response = $this->postJson('/api/answer', $payLoad, ['Accept' => 'application/json']);
        $response->assertStatus(502);
        $response->assertJson(['message' => 'AIとの接続に不具合が生じております。しばらく経ってから再度お試しください。']);
    }
}
