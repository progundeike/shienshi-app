<?php

namespace Tests\Feature;

use App\Exceptions\AiRequestInProgressException;
use App\Exceptions\AiResponseException;
use App\Http\Controllers\AiController;
use Illuminate\Contracts\Cache\Lock;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use OpenAI\Laravel\Facades\OpenAI;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AiControllerTest extends TestCase
{
    #[Test]
    public function lock取得失敗時は例外を投げる(): void
    {
        Auth::shouldReceive('id')->once()->andReturn(1);

        $lock = $this->mock(Lock::class);
        $lock->shouldReceive('get')->once()->andReturn(false);
        $lock->shouldReceive('release')->never();

        Cache::shouldReceive('lock')
            ->once()
            ->with('openai:user:1', 120)
            ->andReturn($lock);

        $controller = new AiController();

        $this->expectException(AiRequestInProgressException::class);
        $this->expectExceptionMessage('Another request is in progress. Please try again later.');

        $controller->chat([
            ['role' => 'user', 'content' => 'test'],
        ]);
    }

    #[Test]
    public function chat成功時はロックを解放する(): void
    {
        Auth::shouldReceive('id')->once()->andReturn(1);

        $lock = $this->mock(Lock::class);
        $lock->shouldReceive('get')->once()->andReturn(true);
        $lock->shouldReceive('release')->once();

        Cache::shouldReceive('lock')
            ->once()
            ->with('openai:user:1', 120)
            ->andReturn($lock);

        OpenAI::swap(new class
        {
            public function chat(): object
            {
                return new class
                {
                    public function create(array $payload): object
                    {
                        return (object) [
                            'choices' => [
                                (object) ['finishReason' => 'stop'],
                            ],
                            'usage' => (object) [],
                        ];
                    }
                };
            }
        });

        $controller = new AiController();
        $result = $controller->chat([
            ['role' => 'user', 'content' => 'test'],
        ]);

        $this->assertSame('stop', $result->choices[0]->finishReason);
    }

    #[Test]
    public function chat失敗時でもロックを解放する(): void
    {
        Auth::shouldReceive('id')->once()->andReturn(1);

        $lock = $this->mock(Lock::class);
        $lock->shouldReceive('get')->once()->andReturn(true);
        $lock->shouldReceive('release')->once();

        Cache::shouldReceive('lock')
            ->once()
            ->with('openai:user:1', 120)
            ->andReturn($lock);

        OpenAI::swap(new class
        {
            public function chat(): object
            {
                return new class
                {
                    public function create(array $payload): never
                    {
                        throw new \RuntimeException('openai failed');
                    }
                };
            }
        });

        $controller = new AiController();

        $this->expectException(AiResponseException::class);
        $this->expectExceptionMessage('OpenAI request failed');

        $controller->chat([
            ['role' => 'user', 'content' => 'test'],
        ]);
    }
}
