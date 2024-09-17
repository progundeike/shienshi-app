<?php

namespace Database\Seeders;

use App\Models\ExamSentence;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ExamSentenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $examSentenceFilesDirectory = database_path('exam-sentences');
        $filePathList = File::files($examSentenceFilesDirectory);
        foreach ($filePathList as $filePath) {
            $examSentence = include $filePath->getRealPath();
            ExamSentence::create($examSentence);
        }
    }
}
