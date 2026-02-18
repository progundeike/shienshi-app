<?php

namespace Tests\Feature;

use App\Models\Inquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class InquiryControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected User $normalUser;

    public function setUp(): void
    {
        parent::setUp();
        $this->withoutExceptionHandling();

        // 初期データをシード
        $this->seed();

        // テスト用管理者ユーザーを作成
        $this->adminUser = User::factory()->create([
            'username' => 'TestAdminUser',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);

        // テスト用一般ユーザーを作成
        $this->normalUser = User::factory()->create([
            'username' => 'NewTestUser',
            'password' => Hash::make('password'),
            'is_admin' => false,
        ]);

        // テスト用の模範解答を作成
        DB::table('inquiries')->insert([
            [
                'user_id' => null,
                'name' => 'テストユーザー1',
                'email' => null,
                'message' => 'テスト用のお問い合わせです。',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $this->normalUser->id,
                'name' => 'テストユーザー2',
                'email' => 'email@test.com',
                'message' => 'テスト用のお問い合わせです。2',
                'created_at' => now(),
                'updated_at' => now(),
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
            'message' => 'テスト用のお問い合わせです。',
        ];

        $response = $this->actingAs($this->normalUser)->postJson('/api/inquiry', $inquiry);

        // 投稿内容がDBにあるか確認
        $this->assertDatabaseHas('inquiries', [
            'user_id' => $userId,
            'name' => 'テストユーザー1',
            'email' => null,
            'message' => 'テスト用のお問い合わせです。',
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
            'message' => 'テスト用のお問い合わせです。',
        ];

        $response = $this->postJson('/api/inquiry', $inquiry);

        // 投稿内容がDBにあるか確認
        $this->assertDatabaseHas('inquiries', [
            'user_id' => null,
            'name' => 'ゲストユーザー',
            'email' => 'test@email.com',
            'message' => 'テスト用のお問い合わせです。',
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
