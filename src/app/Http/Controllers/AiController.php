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

use OpenAI\Responses\Chat\CreateResponse;
use OpenAI\Responses\Chat\CreateResponseChoice;
use OpenAI\Responses\Chat\CreateResponseMessage;
use OpenAI\Responses\Chat\CreateResponseFunctionCall;
use OpenAI\Responses\Chat\CreateResponseUsage;

class AiController extends Controller
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

        $dummyJson = <<<'Json'
{
  "id":"chatcmpl-BvxZ8G2dKAZqRHdB9sEFna4uKE818",
  "object":"chat.completion",
  "created":1753153366,
  "model":"gpt-3.5-turbo-0125",
  "choices":[
    {
      "index":0,
      "message":{
        "role":"assistant",
        "content":null,
        "function_call":{
          "name":"reviewUserAnswer",
          "arguments":"{\"evaluations\":[{\"questionNumber\":1,\"subQuestionNumber\":1,\"rating\":\"×\",\"comment\":\"正解は「イ」です。...\"}]}"
        }
      },
      "finish_reason":"function_call"
    }
  ],
  "usage":{
    "prompt_tokens":4134,
    "completion_tokens":424,
    "total_tokens":4558
  }
}
Json;

        do {
            $result = OpenAI::chat()->create([
                'model' => $this->model,
                'messages' => $prompt,
                'functions' => [
                    $functionParameter
                ],
                'function_call' => 'auto',
            ]);

            // コスト削減のため、取得したresultを出力する
            // $data = json_decode($dummyJson, true);
            // // $result = CreateResponse::from($data, null);
            // OpenAI::fake([
            //     CreateResponse::fake()
            // ]);

            Log::debug('AiController result', $result->toArray());
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
