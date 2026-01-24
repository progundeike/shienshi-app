<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserAnswer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;

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

        // テスト用の模範解答を作成
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
            [
                'user_id' => $this->normalUser->id,
                'exam_code' => '9999_haru_1',
                'question_code' => '1_1_2',
                'user_text' => 'イ',
                'ai_rating' => '×',
                'ai_text' => 'これはAIの添削結果のサンプルです',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $this->normalUser->id,
                'exam_code' => '9999_haru_1',
                'question_code' => '1_2_0',
                'user_text' => 'ウ',
                'ai_rating' => '×',
                'ai_text' => 'これはAIの添削結果のサンプルです',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    #[Test]
    public function ユーザーの回答とAIの添削を取得できる(): void
    {
        $response = $this->actingAs($this->normalUser)->getJson('/api/corrections/9999_haru_1', ['Accept' => 'application/json']);

        dump($response);

        $response->assertStatus(200);
        $this->assertCount(3, $response->json());
    }
}
