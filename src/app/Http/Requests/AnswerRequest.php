<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            'year' => 'required|integer|between:2010,2099',
            'season' => 'required|in:haru,aki',
            'section' => 'required|integer|between:1,5',
            'answers' => 'required|array',
            'answers.*.questionCode' => 'required|string',
            'answers.*.user_text' => 'string|nullable|max:300',
        ];
    }

    protected function prepareForValidation()
    {
        $items = $this->input('answers', []);

        // answersの配列を回して、idを振り直す
        $formatted = [];
        foreach ($items as $item) {
            $content = $item['content'] ?? null;

            // $textが配列の場合はカンマ区切りに変換
            if (is_array($content)) {
                $content = implode(',', $content);
            }

            if ($content === false) {
                $content = null;
            }

            $formatted[] = [
                'questionCode' => (string) $item['questionCode'],
                'user_text' => $content,
            ];
        }

        $this->merge([
            'year' => (int) $this->input('year'),
            'season' => $this->input('season'),
            'section' => (int) $this->input('section'),
            'answers' => $formatted,
        ]);
    }
}
