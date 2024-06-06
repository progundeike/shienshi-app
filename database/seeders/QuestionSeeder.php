<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Question;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            // 令和5年秋問1
            [
                'exam_year' => 2023,
                'exam_season' => 'aki',
                'exam_id' => 1,
                'question_id' => 1,
                'sub_question_id' => 1,
                'type' => 'radio',
                'text' => '(1) XSS脆弱性の種類を解答群の中から選び, 記号で答えよ。',
                'options' => json_encode([
                    ['label' => 'ア DOM Based XSS', 'value' => 'a'],
                    ['label' => 'イ 格納型 XSS', 'value' => 'b'],
                    ['label' => 'ウ 反射型 XSS', 'value' => 'c'],
                ]),
                'max_length' => null,
            ],
            [
                'exam_year' => 2023,
                'exam_season' => 'aki',
                'exam_id' => 1,
                'question_id' => 1,
                'sub_question_id' => 2,
                'type' => 'textarea',
                'text' => '(2) WebアプリQにおける対策を, 30字以内で答えよ。',
                'max_length' => 30,
            ],
            [
                'exam_year' => 2023,
                'exam_season' => 'aki',
                'exam_id' => 1,
                'question_id' => 2,
                'sub_question_id' => 1,
                'type' => 'textarea',
                'text' => '図3について, 入力文字数制限を超える長さのスクリプトが実行されるようにした方法を, 50字以内で答えよ。',
                'max_length' => 50,
            ],
        ];

        foreach ($questions as $question) {
            Question::create($question);
        }
    }
}
