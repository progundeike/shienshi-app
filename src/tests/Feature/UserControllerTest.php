<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\Support\FeatureTestCase;

class UserControllerTest extends FeatureTestCase
{
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

    #[Test]
    public function ユーザー削除ができる(): void
    {
        $response = $this->actingAs($this->normalUser)->deleteJson('/api/user', [
            'password' => 'normalPassword',
        ]);
        $response->assertStatus(200);
    }

    #[Test]
    public function パブリックユーザーは削除できない(): void
    {
        /** @var User $publicUser */
        $publicUser = User::where('username', 'public_user')->first();

        $response = $this->actingAs($publicUser)->deleteJson('/api/user', [
            'password' => 'password',
        ]);
        $response->assertStatus(403);
    }

    #[Test]
    public function パブリックユーザーはパスワード変更できない(): void
    {
        /** @var User $publicUser */
        $publicUser = User::where('username', 'public_user')->first();

        $response = $this->actingAs($publicUser)->putJson('/api/user/password', [
            'current_password' => 'password',
            'new_password' => 'newPassword',
            'new_password_confirmation' => 'newPassword',
        ]);
        $response->assertStatus(403);
    }

    #[Test]
    public function パスワード変更ができる(): void
    {
        $response = $this->actingAs($this->normalUser)->putJson('/api/user/password', [
            'current_password' => 'normalPassword',
            'new_password' => 'newPassword',
            'new_password_confirmation' => 'newPassword',

        ]);
        $response->assertStatus(200);

        $this->normalUser->refresh();

        $this->assertTrue(Hash::check('newPassword', $this->normalUser->password));
    }
}
