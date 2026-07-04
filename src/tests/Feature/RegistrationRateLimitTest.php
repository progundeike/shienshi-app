<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\RateLimiter;
use PHPUnit\Framework\Attributes\Test;
use Tests\Feature\Support\FeatureTestCase;

class RegistrationRateLimitTest extends FeatureTestCase
{
    private const TEST_IP = '192.0.2.1';

    protected function setUp(): void
    {
        parent::setUp();
        RateLimiter::clear('register:'.self::TEST_IP);
    }

    protected function tearDown(): void
    {
        RateLimiter::clear('register:'.self::TEST_IP);
        parent::tearDown();
    }

    #[Test]
    public function 同一ipからの登録試行を1時間に5回までに制限する(): void
    {
        $input = [
            'username' => 'invalid user',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        for ($i = 0; $i < 5; $i++) {
            $this
                ->withServerVariables(['REMOTE_ADDR' => self::TEST_IP])
                ->postJson('/api/register', $input)
                ->assertStatus(422);
        }

        $this->withServerVariables(['REMOTE_ADDR' => self::TEST_IP])
            ->postJson('/api/register', $input)
            ->assertStatus(429)
            ->assertJsonPath(
                'message',
                '登録回数の上限に達しました。時間をおいて再度お試しください。'
            )
            ->assertHeader('Retry-After');
    }
}
