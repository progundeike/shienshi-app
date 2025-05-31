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

class AdminControllerTest extends TestCase
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

        // テスト用データベースをシード
        ExamSentence::factory()->create([
            'year' => 2099,
            'season' => 'haru',
            'section' => 1,
            'sentence' => 'This is a sample exam sentence for testing purposes.',
            'purpose' => 'This is a sample purpose for testing.',
            'review_comment' => 'This is a sample review comment for testing.',
        ]);
    }

    #[Test]
    public function 管理者がexamSentenceを取得できる(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/api/admin/sentence/2099-haru-1');

        $response->assertStatus(200);
        $this->assertEquals('This is a sample exam sentence for testing purposes.', $response['sentence']);
        $this->assertEquals('This is a sample purpose for testing.', $response['purpose']);
        $this->assertEquals('This is a sample review comment for testing.', $response['reviewComment']);
    }

    #[Test]
    public function 一般ユーザーがexamSentenceを取得できない(): void
    {
        $response = $this->actingAs($this->normalUser)->get('/api/admin/sentence/2099-haru-1');

        $response->assertStatus(403);
    }
}
