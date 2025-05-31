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
        $filePathList = File::allFiles($modelAnswersFilesDirectory);
        foreach ($filePathList as $filePath) {
            // ファイル名にsampleが含まれている場合はスキップ
            if (str_contains($filePath->getFilename(), 'sample')) {
                continue;
            }

            $modelAnswers = include $filePath->getRealPath();
            foreach ($modelAnswers as $modelAnswer) {
                ModelAnswer::create($modelAnswer);
            }
        }
    }
}
