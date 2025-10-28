<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $normalUser;

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
    }

    #[Test]
    public function 管理者がログインできる(): void
    {
        $response = $this->post('/api/login', [
            'username' => 'TestAdminUser',
            'password' => 'password',
        ]);
        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertEquals('TestAdminUser', $responseData['username']);
        $this->assertEquals(true, $responseData['isAdmin']);
    }

    #[Test]
    public function 一般ユーザーがログインできる(): void
    {
        $response = $this->post('/api/login', [
            'username' => 'NewTestUser',
            'password' => 'password',
        ]);
        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertEquals('NewTestUser', $responseData['username']);
        $this->assertEquals(false, $responseData['isAdmin']);
    }

    #[Test]
    public function ユーザー情報を取得できる(): void
    {
        $response = $this->actingAs($this->normalUser)->get('/api/user');
        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertEquals('NewTestUser', $responseData['username']);
        $this->assertEquals(false, $responseData['isAdmin']);
    }
}
