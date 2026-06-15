<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\Support\FeatureTestCase;

class ExamControllerTest extends FeatureTestCase
{
    #[Test]
    public function 管理者が模範解答を取得できる(): void
    {
        $response = $this->actingAs($this->adminUser)->getJson("/api/admin/model-answers/{$this->testExamCode}", ['Accept' => 'application/json']);

        $response->assertStatus(200);
        $this->assertCount(3, $response->json());
    }
}
