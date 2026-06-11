<?php

namespace App\Services;

use App\Exceptions\AiRequestInProgressException;
use Closure;
use Illuminate\Contracts\Cache\LockProvider;
use Illuminate\Support\Facades\Cache;

class AiExecutionLockService
{
    private const TTL_SECONDS = 180;

    public function __construct(private readonly string $store = 'redis') {}

    public function run(string $key, Closure $callback): mixed
    {
        $store = Cache::store($this->store)->getStore();
        $startedAt = microtime(true);

        if (! $store instanceof LockProvider) {
            throw new \RuntimeException("The cache store '{$this->store}' does not support locking.");
        }

        $lock = $store->lock($key, self::TTL_SECONDS);

        if (! $lock->get()) {
            throw new AiRequestInProgressException('already_processing');
        }
        try {
            $result = $callback();
            $elapsed = microtime(true) - $startedAt;

            if ($elapsed > self::TTL_SECONDS) {
                throw new AiRequestInProgressException('ttl_exceeded');
            }

            return $result;
        } finally {
            optional($lock)->release();
        }
    }

    public function isProcessing(string $key): bool
    {
        return Cache::store($this->store)->has($key);
    }

    public function keyForAiQuestion(int $userId, string $examCode, string $questionCode): string
    {
        return "ai_question_processing:{$userId}:{$examCode}_{$questionCode}";
    }

    public function keyForAnswer(int $userId, string $examCode): string
    {
        return "ai_answer_processing:{$userId}:{$examCode}";
    }
}
