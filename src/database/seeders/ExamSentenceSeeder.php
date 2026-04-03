<?php

namespace Database\Seeders;

use App\Models\ExamSentence;
use Illuminate\Database\Seeder;

class ExamSentenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = database_path('seeders/data/exam_sentences.json');
        if (! file_exists($path)) {
            $this->command->error("File not found: {$path}");
        }

        $examSentences = json_decode(file_get_contents($path), true);

        $examSentences = array_map(function ($examSentence) {
            // optionsはJSON文字列へ
            if (isset($examSentence['options'])) {
                $examSentence['options'] = json_encode($examSentence['options'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }

            // idは自動増分なので除外
            unset($examSentence['id']);

            // タイムスタンプは更新
            $examSentence['created_at'] = now();
            $examSentence['updated_at'] = now();

            return $examSentence;
        }, $examSentences);

        // データベースに挿入
        ExamSentence::upsert($examSentences, ['exam_code']);
        $this->command->info('Inserted ' . count($examSentences) . ' records into the database.');
    }
}
