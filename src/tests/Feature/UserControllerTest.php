<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected User $normalUser;

    protected string $xsrfToken = '';

    // protected $baseUrl = 'http://127.0.0.4';

    /**
     * テストのセットアップ
     */
    protected function setUp(): void
    {
        parent::setUp();

        // 初期データをシード
        $this->seed();

        // テスト用管理者ユーザーを作成
        $this->adminUser = User::factory()->create([
            // 'username' => 'test_admin_user',
            'username' => 'test_admin_user',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);

        // テスト用一般ユーザーを作成
        $this->normalUser = User::factory()->create([
            'username' => 'new_test_user',
            'password' => Hash::make('password'),
            'is_admin' => false,
        ]);
    }

    #[Test]
    public function 管理者がログインできる(): void
    {
        $response = $this->postJson('/api/login', [
            'username' => 'test_admin_user',
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertEquals('test_admin_user', $responseData['username']);
        $this->assertEquals(true, $responseData['isAdmin']);
    }

    #[Test]
    public function 一般ユーザーがログインできる(): void
    {
        $response = $this->postJson('/api/login', [
            'username' => 'new_test_user',
            'password' => 'password',
        ]);
        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertEquals('new_test_user', $responseData['username']);
        $this->assertEquals(false, $responseData['isAdmin']);
    }

    #[Test]
    public function ユーザー情報を取得できる(): void
    {
        $response = $this->actingAs($this->normalUser)->get('/api/user');
        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertEquals('new_test_user', $responseData['username']);
        $this->assertEquals(false, $responseData['isAdmin']);
    }

    #[Test]
    public function ユーザー登録ができる(): void
    {
        $response = $this->postJson('/api/register', [
            'username' => 'new_user',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(201);
        $responseData = $response->json();
        $this->assertEquals('new_user', $responseData['username']);
        $this->assertEquals(false, $responseData['isAdmin']);
    }

    #[Test]
    public function パスワード再入力を誤るとユーザー登録ができない(): void
    {
        $response = $this->postJson('/api/register', [
            'username' => 'new_user2',
            'password' => 'password',
            'password_confirmation' => 'wrong_password',
        ]);

        $response->assertStatus(422);
    }
}
