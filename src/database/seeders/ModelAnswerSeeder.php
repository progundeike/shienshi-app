<?php

namespace Database\Seeders;

use App\Models\ModelAnswer;
use Illuminate\Database\Seeder;

class ModelAnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = storage_path('app/exam-data/model_answers.json');
        if (! file_exists($path)) {
            throw new \RuntimeException("File not found: {$path}");
        }

        $modelAnswers = json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        $modelAnswers = array_map(function ($modelAnswer) {
            // idは自動増分なので除外
            unset($modelAnswer['id']);

            // タイムスタンプは更新
            $modelAnswer['created_at'] = now();
            $modelAnswer['updated_at'] = now();

            return $modelAnswer;
        }, $modelAnswers);

        // データベースに挿入
        ModelAnswer::upsert($modelAnswers, ['exam_code', 'question_code']);
    }
}
