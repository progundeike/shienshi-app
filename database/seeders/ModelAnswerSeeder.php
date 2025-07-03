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
        $path = database_path('seeders/data/model_answers.json');
        if (!file_exists($path)) {
            $this->command->error("File not found: {$path}");
        }

        $questions = json_decode(file_get_contents($path), true);

        // optionsはJSON文字列へ, idは自動増分なので除外、タイムスタンプも除外
        $questions = array_map(function ($question) {
            if (isset($question['options'])) {
                $question['options'] = json_encode($question['options'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
            unset($question['id'], $question['created_at'], $question['updated_at']);
            return $question;
        }, $questions);

        // データベースに挿入
        ModelAnswer::insert($questions);
        $this->command->info("Inserted " . count($questions) . " records into the database.");
        // $modelAnswersFilesDirectory = database_path('model-answers');
        // $filePathList = File::allFiles($modelAnswersFilesDirectory);
        // foreach ($filePathList as $filePath) {
        //     // ファイル名にsampleが含まれている場合はスキップ
        //     if (str_contains($filePath->getFilename(), 'sample')) {
        //         continue;
        //     }

        //     $modelAnswers = include $filePath->getRealPath();
        //     foreach ($modelAnswers as $modelAnswer) {
        //         ModelAnswer::create($modelAnswer);
        //     }
        // }
    }
}
