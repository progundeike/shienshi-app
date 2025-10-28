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

        // テスト用の模範解答を作成
        DB::table('model_answers')->insert([
            [
                'exam_code' => '2099_haru_1',
                'question_code' => '1_1_0',
                'text' => '模範解答1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'exam_code' => '2099_haru_1',
                'question_code' => '1_2_1',
                'text' => '模範解答2',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'exam_code' => '2099_haru_1',
                'question_code' => '1_2_2',
                'text' => '模範解答3',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    #[Test]
    public function 模範解答をまとめて取得できる(): void
    {
        $response = $this->actingAs($this->adminUser)->getJson('/api/admin/model-answers/2099-haru-1', ['Accept' => 'application/json']);

        $response->assertStatus(200);
        $this->assertCount(3, $response->json());
    }
}
