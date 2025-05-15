<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Question;
use Illuminate\Support\Facades\File;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $examQuestionsDirectory = database_path('exam-questions');
        $filePathList = File::allFiles($examQuestionsDirectory);
        foreach ($filePathList as $filePath) {
            $examQuestions = include $filePath->getRealPath();

            foreach ($examQuestions as $question) {
                Question::create($question);
            }
        }
    }
}
