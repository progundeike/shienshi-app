<?php

namespace App\Http\Controllers;

use App\Exceptions\AiRequestInProgressException;
use App\Exceptions\AiResponseException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use OpenAI\Laravel\Facades\OpenAI;
use Throwable;

class AiController extends Controller
{
    private const USD_TO_JPY = 156.0;

    private const PRICES = [
        'gpt-5-nano' => ['in' => 0.05, 'cached_in' => 0.01, 'out' => 0.40],
        'gpt-5-mini' => ['in' => 0.25, 'cached_in' => 0.03, 'out' => 2.00],
        'gpt-4o-mini' => ['in' => 1.1, 'cached_in' => 0.28, 'out' => 4.40],
    ];

    protected $model = 'gpt-5-nano';
    // protected $model = 'gpt-5-mini';
    // protected string $model = 'gpt-4o-mini';

    private function withUserLock(callable $callback)
    {
        $userId = Auth::id();
        if (! $userId) {
            throw new AiResponseException('User not authenticated');
        }

        $lock = Cache::lock("openai:user:{$userId}", 120); // 120秒のロック

        if (! $lock->get()) {
            throw new AiRequestInProgressException('Another request is in progress. Please try again later.');
        }

        try {
            return $callback();
        } finally {
            $lock->release();
        }
    }

    public function chat(array $prompt)
    {
        return $this->withUserLock(function () use ($prompt) {

            $retryCount = 0;
            $maxRetries = 3;
            $result = null;

            try {
                do {
                    $result = OpenAI::chat()->create([
                        'model' => $this->model,
                        'messages' => $prompt,
                    ]);
                    $this->debugTokenCosts($result->usage);

                    $retryCount++;
                } while ($result->choices[0]->finishReason !== 'stop' && $retryCount < $maxRetries);
            } catch (Throwable $e) {
                throw new AiResponseException('OpenAI request failed', 0, $e);
            }

            $finishReason = 'unknown';
            if ($result && isset($result->choices[0]->finishReason)) {
                $finishReason = $result->choices[0]->finishReason;
            }

            if (! $result || $finishReason !== 'stop') {
                throw new AiResponseException('Unexpected finishReason: '.$finishReason);
            }

            return $result;
        });
    }

    public function useFunctionCall(array $prompt, array $functionParameter)
    {
        return $this->withUserLock(function () use ($prompt, $functionParameter) {
            $retryCount = 0;
            $maxRetries = 3;
            $result = null;

            try {
                do {
                    $result = OpenAI::chat()->create([
                        'model' => $this->model,
                        'messages' => $prompt,
                        'functions' => [
                            $functionParameter,
                        ],
                        'function_call' => ['name' => $functionParameter['name']],
                    ]);

                    $retryCount++;
                } while ($result->choices[0]->finishReason !== 'function_call' && $retryCount < $maxRetries);
            } catch (Throwable $e) {
                throw new AiResponseException('OpenAI request failed', 0, $e);
            }

            $finishReason = 'unknown';
            if ($result && isset($result->choices[0]->finishReason)) {
                $finishReason = $result->choices[0]->finishReason;
            }

            if (! $result || $finishReason !== 'function_call') {
                throw new AiResponseException('Unexpected finishReason: '.$finishReason);
            }

            return $result;
        });
    }

    private function debugTokenCosts(object $usage): void
    {
        $usage = (array) $usage;

        if (! isset(self::PRICES[$this->model])) {
            throw new InvalidArgumentException("Unknown model pricing: {$this->model}");
        }

        $price = self::PRICES[$this->model];

        $inputTokens = (int) ($usage['inputTokens'] ?? $usage['promptTokens'] ?? 0);
        $outputTokens = (int) ($usage['outputTokens'] ?? $usage['completionTokens'] ?? 0);

        $cachedTokens = 0;
        if (isset($usage['inputTokensDetails']['cachedTokens'])) {
            $cachedTokens = (int) $usage['inputTokensDetails']['cachedTokens'];
        } elseif (isset($usage['promptTokensDetails']['cachedTokens'])) {
            $cachedTokens = (int) $usage['promptTokensDetails']['cachedTokens'];
        }

        $nonCached = max(0, $inputTokens - $cachedTokens);

        // 単価は100万トークン当たりなので、最後に100万で割ってドルにする
        $costUsd = (($nonCached * $price['in']) + ($cachedTokens * $price['cached_in']) + ($outputTokens * $price['out'])) / 1_000_000;
        $costJpy = $costUsd * self::USD_TO_JPY;

        Log::debug('openai_cost', ['jpy' => $costJpy]);
    }
}
