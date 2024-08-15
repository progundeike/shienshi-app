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
            'year' => 'required|integer',
            'season' => 'required|string',
            'section' => 'required|integer',
            'answers' => 'required|array',
            'answers.*.questionNumber' => 'required|integer',
            'answers.*.subQuestionNumber' => 'required|integer',
            'answers.*.user_text' => 'string|nullable',
        ];
    }

    protected function prepareForValidation()
    {
        $answers = $this->input('answerInputs')['answer'];
        // answersの配列を回して、idを振り直す
        $formattedAnswers = [];
        foreach ($answers as $answerId => $text) {
            // answerIdは'1-2'のような形式で送られてくる
            list($questionNumber, $subQuestionNumber) = explode('-', $answerId);
            $formattedAnswers[] = [
                'questionNumber' => (int) $questionNumber,
                'subQuestionNumber' => (int) $subQuestionNumber,
                'user_text' => $text,
            ];
        };

        $this->merge([
            'year' => $this->input('year'),
            'season' => $this->input('season'),
            'answers' => $formattedAnswers,
        ]);
    }
}
