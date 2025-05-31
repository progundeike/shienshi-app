<?php

namespace Tests\Feature;

use App\Models\ExamSentence;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ExamControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $normalUser;

    // protected $baseUrl = 'http://127.0.0.4';

    public function setUp(): void
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

    // #[Test]
    // public function 設問を取得できない(): void
    // {
    //     $response = $this->get('/api/questions/wrong-url-1');
    //     $response->assertStatus(404);
    // }
}
