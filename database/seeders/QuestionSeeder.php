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
                'text' => <<<EOF
                この攻撃で使われた XSS 脆弱性について答えよ。

                (1) XSS脆弱性の種類を解答群の中から選び, 記号で答えよ
                EOF,
                'options' => json_encode([
                    ['label' => 'ア DOM Based XSS', 'value' => 'ア'],
                    ['label' => 'イ 格納型 XSS', 'value' => 'イ'],
                    ['label' => 'ウ 反射型 XSS', 'value' => 'ウ'],
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
            [
                'exam_year' => 2023,
                'exam_season' => 'aki',
                'exam_id' => 1,
                'question_id' => 3,
                'sub_question_id' => 1,
                'type' => 'textarea',
                'text' => <<<EOF
                図4のスクリプトについて答えよ。
                
                (1) 図4の6~20行目の処理の内容を, 60字以内で答えよ。
                EOF,
                'max_length' => 60,
            ],
            [
                'exam_year' => 2023,
                'exam_season' => 'aki',
                'exam_id' => 1,
                'question_id' => 3,
                'sub_question_id' => 2,
                'type' => 'textarea',
                'text' => '(2) 攻撃者は, 図4のスクリプトによってアップロードされた情報をどのようにして取得できるか。取得する方法を, 50字以内で答えよ。',
                'max_length' => 50,
            ],
            [
                'exam_year' => 2023,
                'exam_season' => 'aki',
                'exam_id' => 1,
                'question_id' => 3,
                'sub_question_id' => 3,
                'type' => 'textarea',
                'text' => '(3) 攻撃者が(2)で取得した情報を使うことによってできることを, 40字以内で答えよ。',
                'max_length' => 40,
            ],
            [
                'exam_year' => 2023,
                'exam_season' => 'aki',
                'exam_id' => 1,
                'question_id' => 4,
                'sub_question_id' => 1,
                'type' => 'textarea',
                'text' => '仮に, 攻撃者が用意したドメインのサイトに図4と同じスクリプトを含むHTMLを準備し, そのサイトにWebアプリQのログイン済み会員がアクセスしたとしても, Web ブラウザの仕組みによって攻撃は成功しない。この仕組みを, 40字以内で答えよ。',
                'max_length' => 40,
            ],
        ];

        foreach ($questions as $question) {
            Question::create($question);
        }
    }
}
