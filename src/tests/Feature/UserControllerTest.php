<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\Support\FeatureTestCase;

class UserControllerTest extends FeatureTestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected User $normalUser;

    protected string $xsrfToken = '';

    #[Test]
    public function 管理者がログインできる(): void
    {
        $response = $this->postJson('/api/login', [
            'username' => 'test_admin_user',
            'password' => 'adminPassword',
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
            'username' => 'test_normal_user',
            'password' => 'normalPassword',
        ]);
        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertEquals('test_normal_user', $responseData['username']);
        $this->assertEquals(false, $responseData['isAdmin']);
    }

    #[Test]
    public function ユーザー情報を取得できる(): void
    {
        $response = $this->actingAs($this->normalUser)->get('/api/user');
        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertEquals('test_normal_user', $responseData['username']);
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
