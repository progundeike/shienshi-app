<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ExamControllerTest extends TestCase
{
    use RefreshDatabase;

    // protected $baseUrl = 'http://127.0.0.4';

    public function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    #[Test]
    public function 設問を取得できる(): void
    {
        DB::enableQueryLog();
        $response = $this->get('/api/questions/2023-aki-1');

        // 期待するデータ
        $expectedFilePath = database_path('/exam-questions/question_2023_aki_1.php');
        $expectedData = require $expectedFilePath;

        $response->assertStatus(200);
        $responseData = $response->json();
        $this->assertEquals($expectedData[0]['year'], $responseData[0]['year']);
        $this->assertEquals($expectedData[0]['season'], $responseData[0]['season']);
        $this->assertEquals($expectedData[0]['section'], $responseData[0]['section']);
        $this->assertEquals($expectedData[0]['type'], $responseData[0]['type']);
    }

    #[Test]
    public function 設問を取得できない(): void
    {
        $response = $this->get('/api/questions/wrong-url-1');
        $response->assertStatus(404);
    }
}
