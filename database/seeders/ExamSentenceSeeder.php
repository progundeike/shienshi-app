<?php

namespace Database\Seeders;

use App\Models\ExamSentence;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class ExamSentenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $examSentenceFilesDirectory = database_path('exam-sentences');
        $filePathList = File::allFiles($examSentenceFilesDirectory);

        foreach ($filePathList as $filePath) {
            // ファイル名にsampleが含まれている場合はスキップ
            if (str_contains($filePath->getFilename(), 'sample')) {
                continue;
            }

            $examSentence = include $filePath->getPathname();
            ExamSentence::create($examSentence);
        }
    }
}
