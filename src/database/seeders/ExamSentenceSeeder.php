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
        $path = storage_path('app/exam-data/exam_sentences.json');
        if (! file_exists($path)) {
            throw new \RuntimeException("File not found: {$path}");
        }

        $examSentences = json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        $examSentences = array_map(function ($examSentence) {
            // idは自動増分なので除外
            unset($examSentence['id']);

            // タイムスタンプは更新
            $examSentence['updated_at'] = now();
            $examSentence['created_at'] = now();

            return $examSentence;
        }, $examSentences);

        // データベースに挿入
        ExamSentence::upsert(
            $examSentences,
            ['exam_code'],
            [
                'sentence',
                'purpose',
                'review_comment',
                'updated_at',
            ]);
    }
}
