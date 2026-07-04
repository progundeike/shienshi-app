<?php

namespace Tests\Feature;

use App\Models\Inquiry;
use Illuminate\Support\Facades\Notification;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\Support\FeatureTestCase;

class InquiryControllerTest extends FeatureTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Notification::fake(); // 通知をモックして実際の通知が送信されないようにする
        $this->withoutExceptionHandling();

        $this->createTestInquiry();
    }

    private function createTestInquiry(): void
    {
        // テスト用の問い合わせを作成
        Inquiry::insert([
            [
                'user_id' => null,
                'name' => 'テストユーザー1',
                'email' => null,
                'message' => 'テスト用のお問い合わせ1です。',
            ],
            [
                'user_id' => $this->normalUser->id,
                'name' => 'テストユーザー2',
                'email' => 'email@test.com',
                'message' => 'テスト用のお問い合わせ2です。',
            ],
        ]);
    }

    #[Test]
    public function ログインユーザーが問い合わせを送れる(): void
    {
        // normalUserのIDを取得
        $userId = $this->normalUser->id;

        // 投稿内容
        $inquiry = [
            'name' => 'テストユーザー1',
            'email' => null,
            'message' => 'テスト用のお問い合わせ1です。',
            'opened_at' => time() - 10, // honeypot用のフィールド
            'company' => '', // honeypot用のフィールド
        ];

        $response = $this->actingAs($this->normalUser)->postJson('/api/inquiry', $inquiry);

        // 投稿内容がDBにあるか確認
        $this->assertDatabaseHas('inquiries', [
            'user_id' => $userId,
            'name' => 'テストユーザー1',
            'email' => null,
            'message' => 'テスト用のお問い合わせ1です。',
        ]);
        $response->assertJson(['message' => 'ok']);
    }

    #[Test]
    public function ゲストユーザーが問い合わせを送れる(): void
    {
        // 投稿内容
        $inquiry = [
            'name' => 'ゲストユーザー',
            'email' => 'test@email.com',
            'message' => 'テスト用のお問い合わせ1です。',
            'opened_at' => time() - 10, // honeypot用のフィールド
            'company' => '', // honeypot用のフィールド
        ];

        $response = $this->postJson('/api/inquiry', $inquiry);

        // 投稿内容がDBにあるか確認
        $this->assertDatabaseHas('inquiries', [
            'user_id' => null,
            'name' => 'ゲストユーザー',
            'email' => 'test@email.com',
            'message' => 'テスト用のお問い合わせ1です。',
        ]);
        $response->assertJson(['message' => 'ok']);
    }

    #[Test]
    public function 管理者が問い合わせを取得できる(): void
    {
        $response = $this->actingAs($this->adminUser)->getJson('/api/admin/inquiry', ['Accept' => 'application/json']);
        $response->assertStatus(200);
        $this->assertCount(2, $response->json());
    }

    #[Test]
    public function 一般ユーザーが問い合わせを取得できない(): void
    {
        $response = $this->actingAs($this->normalUser)->getJson('/api/admin/inquiry', ['Accept' => 'application/json']);
        $response->assertStatus(403);
    }

    #[Test]
    public function 管理者が問い合わせを削除できる(): void
    {
        $target = Inquiry::query()->latest('id')->first();
        $response = $this->actingAs($this->adminUser)->deleteJson("/api/admin/inquiry/{$target->id}", ['Accept' => 'application/json']);
        $response->assertNoContent();
        $this->assertDatabaseMissing('inquiries', ['id' => $target->id]);
    }

    #[Test]
    public function 一般ユーザーが問い合わせを削除できない(): void
    {
        $target = Inquiry::query()->latest('id')->first();
        $response = $this->actingAs($this->normalUser)->deleteJson("/api/admin/inquiry/{$target->id}", ['Accept' => 'application/json']);
        $response->assertStatus(403);
        $this->assertDatabaseHas('inquiries', ['id' => $target->id]);
    }
}
