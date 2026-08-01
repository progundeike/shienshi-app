<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = storage_path('app/exam-data/questions.json');
        if (! file_exists($path)) {
            throw new \RuntimeException("File not found: {$path}");
        }

        $questions = json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        $questions = array_map(function ($question) {
            // optionsはJSON文字列へ
            if (isset($question['options'])) {
                $question['options'] = json_encode($question['options'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }

            // タイムスタンプは更新
            $question['created_at'] = now();
            $question['updated_at'] = now();

            return $question;
        }, $questions);

        // データベースに挿入
        Question::upsert($questions, ['exam_code', 'question_code']);
    }
}
