<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Log;
use App\Models\ExamSentence;
use App\Models\UserAnswer;
use App\Models\ModelAnswer;
use App\Models\Question;
use App\Http\Controllers\ExamController;
use Illuminate\Support\Facades\Auth;

class AIController extends Controller
{
    const USD_TO_JPY = 156.0;
    // protected $model = 'gpt-4o';
    protected $model = 'gpt-3.5-turbo-0125';
    // protected string $model = 'gpt-4o-mini';

    public function chat(array $prompt)
    {
        $retryCount = 0;
        $maxRetries = 3;
        $result = null;

        do {
            $result = OpenAI::chat()->create([
                'model' => $this->model,
                'messages' => $prompt,
            ]);
            Log::debug(print_r($result, true));
            $this->debugTokenCosts($result->usage->promptTokens, $result->usage->completionTokens);

            $retryCount++;
        } while ($result->choices[0]->finishReason !== 'stop' && $retryCount < $maxRetries);

        if ($result->choices[0]->finishReason !== 'stop') {
            Log::error('finishReason :' . $result->choices[0]->finishReason);
            return [];
        }

        return $result;
    }

    public function useFunctionCall(array $prompt, array $functionParameter)
    {
        $retryCount = 0;
        $maxRetries = 3;
        $result = null;

        do {
            $result = OpenAI::chat()->create([
                'model' => $this->model,
                'messages' => $prompt,
                'functions' => [
                    $functionParameter
                ],
                'function_call' => 'auto',
            ]);
            Log::debug(print_r($result, true));
            $this->debugTokenCosts($result->usage->promptTokens, $result->usage->completionTokens);

            $retryCount++;
        } while ($result->choices[0]->finishReason !== 'function_call' && $retryCount < $maxRetries);

        if ($result->choices[0]->finishReason !== 'function_call') {
            Log::error('finishReason :' . $result->choices[0]->finishReason);
            return [];
        }

        return $result;
    }

    private function debugTokenCosts(int $promptTokens, int $completionTokens): void
    {
        // apiの料金を場合分する
        // cost: $/1M tokens
        if (in_array($this->model, ['gpt-3.5-turbo', 'gpt-3.5-turbo-0125'])) {
            $promptCostPerMillion = 0.5;
            $completionCostPerMillion = 1.5;
        } elseif ($this->model === 'gpt-4o') {
            $promptCostPerMillion = 5;
            $completionCostPerMillion = 15;
        } elseif ($this->model === 'gpt-4o-mini') {
            $promptCostPerMillion = 0.15;
            $completionCostPerMillion = 0.6;
        } else {
            return;
        }

        // 計算する処理
        $promptCost = ($promptTokens / 1_000_000) * $promptCostPerMillion;
        $completionCost = ($completionTokens / 1_000_000) * $completionCostPerMillion;
        $totalCost = $promptCost + $completionCost;
        $costs = self::USD_TO_JPY * $totalCost;

        Log::debug('total costs: ¥' . $costs);
        return;
    }
}
