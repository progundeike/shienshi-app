<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class AnswerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'userId' => 'integer|nullable',
            'examYear' => 'required|integer',
            'examSeason' => 'required|string',
            'answers' => 'required|array',
            'answers.*.questionId' => 'required|integer',
            'answers.*.subQuestionId' => 'required|integer',
            'answers.*.text' => 'string|nullable',
        ];
    }

    protected function prepareForValidation()
    {
        // 答案提出はログインユーザーのみ許可
        $userId = Auth::id();

        $answers = $this->input('answerInputs')['answer'];
        // answersの配列を回して、idを振り直す
        $formattedAnswers = [];
        foreach ($answers as $answerId => $text) {
            // answerIdは'1-2'のような形式で送られてくる
            list($questionId, $subQuestionId) = explode('-', $answerId);
            $formattedAnswers[] = [
                'questionId' => (int) $questionId,
                'subQuestionId' => (int) $subQuestionId,
                'text' => $text,
            ];
        };

        $this->merge([
            'userId' => $userId,
            'examYear' => $this->input('year'),
            'examSeason' => $this->input('season'),
            'answers' => $formattedAnswers,
        ]);
    }
}
