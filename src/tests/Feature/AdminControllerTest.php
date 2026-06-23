<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\Support\FeatureTestCase;

class AdminControllerTest extends FeatureTestCase
{
    #[Test]
    public function 管理者がexamSentenceを取得できる(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/api/admin/sentence/2099-haru-1');

        $response->assertStatus(200);
        $this->assertEquals('テスト用の問題文です', $response['sentence']);
        $this->assertEquals('テスト用の出題趣旨です', $response['purpose']);
        $this->assertEquals('テスト用の採点講評です', $response['reviewComment']);
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
            'season' => $this->testExamSeason,
            'section' => $this->testExamSection,
            'sentence' => 'Updated exam sentence.',
        ];

        $response = $this->actingAs($this->adminUser)->put('/api/admin/sentence', $data, ['Accept' => 'application/json']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('exam_sentences', [
            'exam_code' => $this->testExamCode,
            'sentence' => 'Updated exam sentence.',
        ]);
    }

    #[Test]
    public function 一般ユーザーがexamSentenceを更新できない(): void
    {
        $data = [
            'year' => 2099,
            'season' => $this->testExamSeason,
            'section' => $this->testExamSection,
            'sentence' => '一般ユーザーの修正案',
        ];

        $response = $this->actingAs($this->normalUser)->put('/api/admin/sentence', $data, ['Accept' => 'application/json']);

        $response->assertStatus(403);
        $this->assertDatabaseHas('exam_sentences', [
            'exam_code' => $this->testExamCode,
            'sentence' => 'テスト用の問題文です',
        ]);
    }

    #[Test]
    public function 管理者がpurposeを更新できる(): void
    {
        $data = [
            'year' => 2099,
            'season' => $this->testExamSeason,
            'section' => $this->testExamSection,
            'purpose' => '管理者が修正した新しい出題趣旨',
        ];

        $response = $this->actingAs($this->adminUser)->put('/api/admin/sentence', $data, ['Accept' => 'application/json']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('exam_sentences', [
            'exam_code' => $this->testExamCode,
            'purpose' => '管理者が修正した新しい出題趣旨',
        ]);
    }

    #[Test]
    public function 一般ユーザーがpurposeを更新できない(): void
    {
        $data = [
            'year' => 2099,
            'season' => $this->testExamSeason,
            'section' => $this->testExamSection,
            'purpose' => '一般ユーザーが修正した新しい出題趣旨',
        ];

        $response = $this->actingAs($this->normalUser)->put('/api/admin/sentence', $data, ['Accept' => 'application/json']);

        $response->assertStatus(403);
        $this->assertDatabaseHas('exam_sentences', [
            'exam_code' => $this->testExamCode,
            'purpose' => 'テスト用の出題趣旨です',
        ]);
    }

    #[Test]
    public function 管理者がreviewCommentを更新できる(): void
    {
        $data = [
            'year' => 2099,
            'season' => $this->testExamSeason,
            'section' => $this->testExamSection,
            'reviewComment' => '管理者が修正した新しい採点講評',
        ];

        $response = $this->actingAs($this->adminUser)->put('/api/admin/sentence', $data, ['Accept' => 'application/json']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('exam_sentences', [
            'exam_code' => $this->testExamCode,
            'review_comment' => '管理者が修正した新しい採点講評',
        ]);
    }

    #[Test]
    public function 一般ユーザーがreviewCommentを更新できない(): void
    {
        $data = [
            'year' => 2099,
            'season' => $this->testExamSeason,
            'section' => $this->testExamSection,
            'reviewComment' => '一般ユーザーが修正した新しい採点講評',
        ];

        $response = $this->actingAs($this->normalUser)->put('/api/admin/sentence', $data, ['Accept' => 'application/json']);

        $response->assertStatus(403);
        $this->assertDatabaseHas('exam_sentences', [
            'exam_code' => $this->testExamCode,
            'review_comment' => 'テスト用の採点講評です',
        ]);
    }

    #[Test]
    public function 管理者が問題を編集できる(): void
    {
        $data = [
            'examCode' => $this->testExamCode,
            'questionNumber' => 1,
            'subQuestionNumber' => 3,
            'smallQuestionNumber' => 0,
            'text' => '追加の問題',
            'textForAi' => 'This is a message for AI',
            'type' => 'input',
            'options' => null,
            'maxLength' => 30,
        ];

        $response = $this->actingAs($this->adminUser)->post('/api/admin/question', $data, ['Accept' => 'application/json']);
        $response->assertStatus(201);
        $this->assertDatabaseHas('questions', [
            'exam_code' => $this->testExamCode,
            'question_code' => '1_3_0',
            'text' => '追加の問題',
            'text_for_ai' => 'This is a message for AI',
            'type' => 'input',
            'options' => null,
            'max_length' => 30,
        ]);
    }
}
