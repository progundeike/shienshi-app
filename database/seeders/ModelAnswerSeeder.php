<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ModelAnswer;

class ModelAnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modelAnswers = [
            // 令和5年秋問1
            [
                'exam_year' => 2023,
                'exam_season' => 'aki',
                'exam_id' => 1,
                'question_id' => 1,
                'sub_question_id' => 1,
                'text' => 'イ',
            ],
            [
                'exam_year' => 2023,
                'exam_season' => 'aki',
                'exam_id' => 1,
                'question_id' => 1,
                'sub_question_id' => 2,
                'text' => 'レビュータイトルを出力する前にエスケープ処理を施す。',
            ],
            [
                'exam_year' => 2023,
                'exam_season' => 'aki',
                'exam_id' => 1,
                'question_id' => 2,
                'sub_question_id' => 0,
                'text' => 'HTMLがコメントアウトされ一つのスクリプトになるような投稿を複数回に分けて行った。',
            ],
            [
                'exam_year' => 2023,
                'exam_season' => 'aki',
                'exam_id' => 1,
                'question_id' => 3,
                'sub_question_id' => 1,
                'text' => 'XHRのレスポンスから取得したトークンとともに, アイコン画像としてセッションIDをアップロードする。',
            ],
            [
                'exam_year' => 2023,
                'exam_season' => 'aki',
                'exam_id' => 1,
                'question_id' => 3,
                'sub_question_id' => 2,
                'text' => '会員のアイコン画像をダウンロードして, そこからセッションIDの文字列を取り出す。',
            ],
            [
                'exam_year' => 2023,
                'exam_season' => 'aki',
                'exam_id' => 1,
                'question_id' => 3,
                'sub_question_id' => 3,
                'text' => 'ページVにアクセスした会員になりすまして, WebアプリQの機能を使う。',
            ],
            [
                'exam_year' => 2023,
                'exam_season' => 'aki',
                'exam_id' => 1,
                'question_id' => 4,
                'sub_question_id' => 0,
                'text' => 'スクリプトから別ドメインのURLに対してcookieが送られない仕組み',
            ],
        ];

        foreach ($modelAnswers as $modelAnswer) {
            ModelAnswer::create($modelAnswer);
        }
    }
}
