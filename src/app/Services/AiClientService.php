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

    // lunaより高いモデルは検討外
    private const PRICES = [
        'gpt-5-nano' => ['in' => 0.05, 'cached_in' => 0.005, 'out' => 0.40],
        'gpt-5-mini' => ['in' => 0.25, 'cached_in' => 0.025, 'out' => 2.00],
        'gpt-5.4-nano' => ['in' => 0.20, 'cached_in' => 0.02, 'out' => 1.25],
        'gpt-5.6-luna' => ['in' => 0.20, 'cached_in' => 0.02, 'out' => 1.20], // Response APIが必須
    ];

    protected string $model;

    public function __construct()
    {
        $model = config('openai.model', 'gpt-5-nano');

        if (! is_string($model) || ! isset(self::PRICES[$model])) {
            throw new InvalidArgumentException('Unsupported OpenAI model: '.var_export($model, true));
        }

        $this->model = $model;
    }

    public function generateText(array $prompt): string
    {
        $lastStatus = 'unknown';
        $lastException = null;

        for ($attempt = 1; $attempt <= self::MAX_RETRIES; $attempt++) {
            $lastException = null;

            try {
                $result = OpenAI::responses()->create([
                    'model' => $this->model,
                    'input' => $prompt,
                    'store' => false,
                ]);
                // トークンコストを一時的にデバッグ
                $this->debugTokenCostsForResponseApi($result);

                $lastStatus = $result->status;
                if ($lastStatus === 'completed' && is_string($result->outputText) && trim($result->outputText) !== '') {
                    return $result->outputText;
                }

                Log::warning('OpenAI returned unexpected status', [
                    'status' => $lastStatus,
                    'attempt' => $attempt,
                ]);
            } catch (Throwable $e) {
                $lastException = $e;

                Log::warning('OpenAI request attempt failed', [
                    'attempt' => $attempt,
                    'exception' => get_class($e),
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

        throw new AiResponseException('Unexpected status: '.$lastStatus);
    }

    public function generateStructuredOutput(array $prompt, array $schema): string
    {
        $lastStatus = 'unknown';
        $lastException = null;

        for ($attempt = 1; $attempt <= self::MAX_RETRIES; $attempt++) {
            $lastException = null;
            try {
                $result = OpenAI::responses()->create([
                    'model' => $this->model,
                    'input' => $prompt,
                    'store' => false,
                    'text' => [
                        'format' => [
                            'type' => 'json_schema',
                            'name' => 'answer_evaluations',
                            'schema' => $schema,
                            'strict' => true,
                        ],
                    ],
                ]);

                // モデル比較用に一時的にデバッグ
                Log::debug('structured output result', [
                    'model' => $this->model,
                    'result' => $result,
                ]);

                // トークンコストを一時的にデバッグ
                $this->debugTokenCostsForResponseApi($result);

                $lastStatus = $result->status;
                if ($lastStatus === 'completed' && is_string($result->outputText) && $result->outputText !== '') {
                    return $result->outputText;
                }

                Log::warning('OpenAI returned unexpected status', [
                    'status' => $lastStatus,
                    'attempt' => $attempt,
                ]);
            } catch (Throwable $e) {
                $lastException = $e;

                Log::warning('OpenAI request attempt failed', [
                    'attempt' => $attempt,
                    'exception' => get_class($e),
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

        throw new AiResponseException('Unexpected status: '.$lastStatus);
    }

    private function debugTokenCostsForResponseApi(object $result): void
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

            $inputTokens = (int) ($usage->inputTokens ?? 0);
            $outputTokens = (int) ($usage->outputTokens ?? 0);
            $cachedTokens = (int) ($usage->inputTokensDetails->cachedTokens ?? 0);
            $nonCached = max(0, $inputTokens - $cachedTokens);

            // 単価は100万トークン当たりなので、最後に100万で割ってドルにする
            $costUsd = (($nonCached * $price['in']) + ($cachedTokens * $price['cached_in']) + ($outputTokens * $price['out'])) / 1_000_000;
            $costJpy = $costUsd * self::USD_TO_JPY;

            Log::info('openai_cost', [
                'api' => 'responses',
                'model' => $this->model,
                'input_tokens' => $inputTokens,
                'output_tokens' => $outputTokens,
                'cached_tokens' => $cachedTokens,
                'jpy' => $costJpy,
            ]);
        } catch (Throwable $e) {
            Log::error('Failed to log token costs', ['exception' => $e]);
        }
    }
}
