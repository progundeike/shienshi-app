<?php

namespace Database\Seeders;

use App\Models\ModelAnswer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ModelAnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modelAnswersFilesDirectory = database_path('model-answers');
        $filePathList = File::files($modelAnswersFilesDirectory);
        foreach ($filePathList as $filePath) {
            $modelAnswers = include $filePath->getRealPath();

            foreach ($modelAnswers as $modelAnswer) {
                ModelAnswer::create($modelAnswer);
            }
        }
    }
}
