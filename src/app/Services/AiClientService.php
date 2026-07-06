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

    private const MAX_RETRIES = 3;

    private const RETRY_SLEEP_SECONDS = 1;

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
        $lastFinishReason = 'unknown';
        $lastException = null;

        for ($attempt = 1; $attempt <= self::MAX_RETRIES; $attempt++) {
            try {
                $result = OpenAI::chat()->create([
                    'model' => $this->model,
                    'messages' => $prompt,
                ]);

                // トークンコストを一時的にデバッグ
                $this->debugTokenCostsForChatApi($result);

                $finishReason = $result->choices[0]->finishReason ?? 'unknown';
                $lastFinishReason = $finishReason;

                if ($finishReason === 'stop') {
                    return $result;
                }

                Log::warning('OpenAI returned unexpected finishReason', [
                    'finish_reason' => $lastFinishReason,
                    'attempt' => $attempt,
                ]);
            } catch (Throwable $e) {
                $lastException = $e;

                Log::warning('OpenAI request attempt failed', [
                    'attempt' => $attempt,
                    'exception' => $e::class,
                    'error' => $e->getMessage(),
                ]);
            }

            if ($attempt < self::MAX_RETRIES) {
                sleep(self::RETRY_SLEEP_SECONDS); // 指定された秒数待ってリトライ
            }
        }

        if ($lastException !== null) {
            throw new AiResponseException('OpenAI request failed', 0, $lastException);
        }

        throw new AiResponseException('Unexpected finishReason: '.$lastFinishReason);
    }

    public function useFunctionCall(array $prompt, array $functionParameter): string
    {
        // if (config('services.openai.simulate_error')) {
        //     sleep(20);
        //     throw new AiResponseException('Simulated OpenAI error');
        // }

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

                $this->debugTokenCostsForChatApi($result);

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

        $arguments = $result->choices[0]->message->functionCall?->arguments;

        if (! is_string($arguments) || $arguments === '') {
            throw new AiResponseException('AI function call arguments are missing');
        }

        return $arguments;
    }

    private function debugTokenCostsForChatApi(object $result): void
    {
        try {

            if (! isset($result->usage)) {
                Log::info('No usage data available for token cost calculation');

                return;
            }

            if (! isset(self::PRICES[$this->model])) {
                throw new InvalidArgumentException("Unknown model pricing: {$this->model}");
            }

            $usage = $result->usage;
            $price = self::PRICES[$this->model];

            $inputTokens = (int) ($usage->promptTokens ?? 0);
            $outputTokens = (int) ($usage->completionTokens ?? 0);
            $cachedTokens = (int) ($usage->promptTokensDetails->cachedTokens ?? 0);

            $nonCached = max(0, $inputTokens - $cachedTokens);

            // 単価は100万トークン当たりなので、最後に100万で割ってドルにする
            $costUsd = (($nonCached * $price['in']) + ($cachedTokens * $price['cached_in']) + ($outputTokens * $price['out'])) / 1_000_000;
            $costJpy = $costUsd * self::USD_TO_JPY;

            Log::info('openai_cost', ['jpy' => $costJpy]);
        } catch (Throwable $e) {
            Log::error('Failed to log token costs', ['exception' => $e]);
        }
    }
}
