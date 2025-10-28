<?php

namespace Tests\Feature;

use App\Models\ExamSentence;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
            'exam_code' => '2099_haru_1',
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

    #[Test]
    public function 管理者がexamSentenceを更新できる(): void
    {
        $data = [
            'year' => 2099,
            'season' => 'haru',
            'section' => 1,
            'sentence' => 'Updated exam sentence.',
        ];

        $response = $this->actingAs($this->adminUser)->put('/api/admin/sentence', $data, ['Accept' => 'application/json']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('exam_sentences', [
            'exam_code' => '2099_haru_1',
            'sentence' => 'Updated exam sentence.',
        ]);
    }

    #[Test]
    public function 一般ユーザーがexamSentenceを更新できない(): void
    {
        $data = [
            'year' => 2099,
            'season' => 'haru',
            'section' => 1,
            'sentence' => 'Updated exam sentence.',
        ];

        $response = $this->actingAs($this->normalUser)->put('/api/admin/sentence', $data, ['Accept' => 'application/json']);

        $response->assertStatus(403);
        $this->assertDatabaseHas('exam_sentences', [
            'exam_code' => '2099_haru_1',
            'sentence' => 'This is a sample exam sentence for testing purposes.',
        ]);
    }

    #[Test]
    public function 管理者がpurposeを更新できる(): void
    {
        $data = [
            'year' => 2099,
            'season' => 'haru',
            'section' => 1,
            'purpose' => 'Updated purpose for testing.',
        ];

        $response = $this->actingAs($this->adminUser)->put('/api/admin/sentence', $data, ['Accept' => 'application/json']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('exam_sentences', [
            'exam_code' => '2099_haru_1',
            'purpose' => 'Updated purpose for testing.',
        ]);
    }

    #[Test]
    public function 一般ユーザーがpurposeを更新できない(): void
    {
        $data = [
            'year' => 2099,
            'season' => 'haru',
            'section' => 1,
            'purpose' => 'Updated purpose for testing.',
        ];

        $response = $this->actingAs($this->normalUser)->put('/api/admin/sentence', $data, ['Accept' => 'application/json']);

        $response->assertStatus(403);
        $this->assertDatabaseHas('exam_sentences', [
            'exam_code' => '2099_haru_1',
            'purpose' => 'This is a sample purpose for testing.',
        ]);
    }

    #[Test]
    public function 管理者がreviewCommentを更新できる(): void
    {
        $data = [
            'year' => 2099,
            'season' => 'haru',
            'section' => 1,
            'reviewComment' => 'Updated review comment for testing.',
        ];

        $response = $this->actingAs($this->adminUser)->put('/api/admin/sentence', $data, ['Accept' => 'application/json']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('exam_sentences', [
            'exam_code' => '2099_haru_1',
            'review_comment' => 'Updated review comment for testing.',
        ]);
    }

    #[Test]
    public function 一般ユーザーがreviewCommentを更新できない(): void
    {
        $data = [
            'year' => 2099,
            'season' => 'haru',
            'section' => 1,
            'reviewComment' => 'Updated review comment for testing.',
        ];

        $response = $this->actingAs($this->normalUser)->put('/api/admin/sentence', $data, ['Accept' => 'application/json']);

        $response->assertStatus(403);
        $this->assertDatabaseHas('exam_sentences', [
            'exam_code' => '2099_haru_1',
            'review_comment' => 'This is a sample review comment for testing.',
        ]);
    }

    #[Test]
    public function 管理者が問題を編集できる(): void
    {
        $data = [
            'year' => 2099,
            'season' => 'haru',
            'section' => 1,
            'questionNumber' => 1,
            'subQuestionNumber' => 1,
            'smallQuestionNumber' => null,
            'text' => 'This is a sample question text for testing',
            'type' => 'input',
            'options' => null,
            'maxLength' => 30,
        ];

        $response = $this->actingAs($this->adminUser)->post('/api/admin/question', $data, ['Accept' => 'application/json']);
        $response->assertStatus(201);
        $this->assertDatabaseHas('questions', [
            'exam_code' => '2099_haru_1',
            'question_number' => 1,
            'sub_question_number' => 1,
            'small_question_number' => 0,
            'text' => 'This is a sample question text for testing',
            'type' => 'input',
            'options' => null,
            'max_length' => 30,
        ]);
    }
}
