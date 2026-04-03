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
        $path = database_path('seeders/data/questions.json');
        if (! file_exists($path)) {
            $this->command->error("File not found: {$path}");
        }

        $questions = json_decode(file_get_contents($path), true);

        $questions = array_map(function ($question) {
            // optionsはJSON文字列へ
            if (isset($question['options'])) {
                $question['options'] = json_encode($question['options'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }

            // idは自動増分なので除外
            unset($question['id']);

            // タイムスタンプは更新
            $question['created_at'] = now();
            $question['updated_at'] = now();

            return $question;
        }, $questions);

        // データベースに挿入
        Question::upsert($questions, ['exam_code', 'question_number', 'sub_question_number', 'small_question_number']);
        $this->command->info('Inserted ' . count($questions) . ' records into the database.');
    }
}
