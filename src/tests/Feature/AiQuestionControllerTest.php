<?php

namespace Tests\Feature;

use App\Models\UserAiDialogue;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\Support\FeatureTestCase;

class AiQuestionControllerTest extends FeatureTestCase
{
    #[Test]
    public function ユーザーがAIチャットの対話履歴を取得できる(): void
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
    public function ユーザーがAIチャットの対話履歴を削除できる(): void
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
}
