<?php

namespace App\Services;

use App\Exceptions\AiResponseException;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use OpenAI\Laravel\Facades\OpenAI;
use Throwable;

class AiClientService
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

    public function chat(array $prompt)
    {
        $retryCount = 0;
        $maxRetries = 3;
        $result = null;

        // TODO: finishReasonだけで判定しているが、普通に接続がタイムアウトなどが考慮されていない
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
            Log::error('OpenAI request failed', ['error' => $e->getMessage()]);
            throw new AiResponseException('OpenAI request failed', 0, $e);
        }

        $finishReason = 'unknown';
        if (isset($result->choices[0]->finishReason)) {
            $finishReason = $result->choices[0]->finishReason;
        }

        if ($finishReason !== 'stop') {
            throw new AiResponseException('Unexpected finishReason: '.$finishReason);
        }

        return $result;
    }

    public function useFunctionCall(array $prompt, array $functionParameter)
    {
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
            Log::error('OpenAI request failed', ['exception' => $e]);
            throw new AiResponseException('OpenAI request failed', 0, $e);
        }

        $finishReason = 'unknown';
        if (isset($result->choices[0]->finishReason)) {
            $finishReason = $result->choices[0]->finishReason;
        }

        if ($finishReason !== 'function_call') {
            throw new AiResponseException('Unexpected finishReason: '.$finishReason);
        }

        return $result;
    }

    private function debugTokenCosts(object $usage): void
    {
        Log::debug('run debugTokenCosts');
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
