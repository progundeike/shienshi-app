<?php

namespace Tests\Feature;

use App\Exceptions\AiResponseException;
use App\Models\User;
use App\Services\AiClientService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Mockery\MockInterface;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AnswerControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $normalUser;

    public function setUp(): void
    {
        parent::setUp();

        // 初期データをシード
        $this->seed();

        // テスト用一般ユーザーを作成
        $this->normalUser = User::factory()->create([
            'username' => 'NewTestUser',
            'password' => Hash::make('password'),
            'is_admin' => false,
        ]);

        // テスト用のexamSentenceを作成
        DB::table('exam_sentences')->insert([
            [
                'exam_code' => '9999_haru_1',
                'sentence' => 'テスト用の文脈です',
                'purpose' => 'sample_purpose',
                'review_comment' => 'sample_review_comment',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // テスト用のquestionを作成
        DB::table('questions')->insert([
            [
                'exam_code' => '9999_haru_1',
                'question_code' => '1_1_1',
                'text' => 'テスト用の設問1',
                'type' => 'input',
                'options' => null,
                'max_length' => null,
                'text_for_ai' => 'テスト用の設問1のAI向けテキスト',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // テスト用のユーザー解答を作成
        DB::table('user_answers')->insert([
            [
                'user_id' => $this->normalUser->id,
                'exam_code' => '9999_haru_1',
                'question_code' => '1_1_1',
                'user_text' => 'ア',
                'ai_rating' => '×',
                'ai_text' => 'これはAIの添削結果のサンプルです',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // テスト用の模範解答を作成
        DB::table('model_answers')->insert([
            [
                'exam_code' => '9999_haru_1',
                'question_code' => '1_1_1',
                'text' => 'エ',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    #[Test]
    public function ユーザーの回答とAIの添削を取得できる(): void
    {
        $response = $this->actingAs($this->normalUser)->getJson('/api/corrections/9999_haru_1', ['Accept' => 'application/json']);

        $response->assertStatus(200);
        $this->assertCount(1, $response->json());
    }

    #[Test]
    public function 多重実行時は429を返す(): void
    {
        /** @var User $user */
        $user = User::factory()->createOne();
        $this->actingAs($user);

        $examCode = '9999_haru_1';
        $processingKey = "answer_processing:{$user->id}:{$examCode}";

        Cache::store('redis')->put($processingKey, true, 60);

        $payLoad = [
            'year' => '9999',
            'season' => 'haru',
            'section' => '1',
            'answers' => [
                ['questionCode' => '1_1_1', 'user_text' => 'test'],
            ],
        ];

        $response = $this->postJson('/api/answer', $payLoad, ['Accept' => 'application/json']);
        $response->assertStatus(429);
    }

    #[Test]
    public function openAIのAPIエラー時は502を返す(): void
    {
        Log::spy();

        /** @var User $user */
        $user = User::factory()->createOne();
        $this->actingAs($user);

        $payLoad = [
            'year' => '9999',
            'season' => 'haru',
            'section' => '1',
            'answers' => [
                ['questionCode' => '1_1_1', 'user_text' => 'test'],
            ],
        ];

        // ロックを解除しておく
        $examCode = $payLoad['year'].'_'.$payLoad['season'].'_'.$payLoad['section'];
        $processingKey = "answer_processing:{$user->id}:{$examCode}";
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
