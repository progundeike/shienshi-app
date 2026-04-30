<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserAiDialogue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AiQuestionControllerTest extends TestCase
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

        // テスト用データベースをシード
        UserAiDialogue::create([
            'exam_code' => '2099_haru_1',
            'question_code' => '1_1_0',
            'user_id' => $this->normalUser->id,
            'user_question' => 'これはユーザーが投稿したAIへの質問のサンプルです。',
            'ai_answer' => 'これはAIからのダミーの回答です。',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    #[Test]
    public function ユーザーがAIチャットの対話履歴を取得できる(): void
    {
        $response = $this->actingAs($this->normalUser)->get('/api/dialogues/2099_haru_1/1_1_0');

        $response->assertStatus(200);
        $data = $response->json();
        $this->assertEquals('user', $data[0]['role']);
        $this->assertEquals('これはユーザーが投稿したAIへの質問のサンプルです。', $data[0]['content']);
        $this->assertEquals('assistant', $data[1]['role']);
        $this->assertEquals('これはAIからのダミーの回答です。', $data[1]['content']);
    }

    #[Test]
    public function ユーザーがAIチャットの対話履歴を削除できる(): void
    {
        // ターゲットを取得
        $target = UserAiDialogue::where('user_id', $this->normalUser->id)
            ->where('exam_code', '2099_haru_1')
            ->where('question_code', '1_1_0')
            ->first();

        $response = $this->actingAs($this->normalUser)->delete('/api/dialogues/2099_haru_1/1_1_0');
        $response->assertStatus(204);
        $this->assertDatabaseMissing('user_ai_dialogues', ['id' => $target->id]);
    }
}
