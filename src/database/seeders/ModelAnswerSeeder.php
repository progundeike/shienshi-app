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
        $path = database_path('seeders/data/model_answers.json');
        if (! file_exists($path)) {
            $this->command->error("File not found: {$path}");
        }

        $modelAnswers = json_decode(file_get_contents($path), true);

        $modelAnswers = array_map(function ($modelAnswer) {
            // optionsはJSON文字列へ
            if (isset($modelAnswer['options'])) {
                $modelAnswer['options'] = json_encode($modelAnswer['options'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }

            // idは自動増分なので除外
            unset($modelAnswer['id']);

            // タイムスタンプは更新
            $modelAnswer['created_at'] = now();
            $modelAnswer['updated_at'] = now();

            return $modelAnswer;
        }, $modelAnswers);

        // データベースに挿入
        ModelAnswer::upsert($modelAnswers, ['exam_code', 'question_code']);
        $this->command->info('Inserted '.count($modelAnswers).' records into the database.');
    }
}
