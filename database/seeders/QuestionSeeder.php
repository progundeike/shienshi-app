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
        $path = database_path('seeders/data/questions.json');
        if (!file_exists($path)) {
            $this->command->error("File not found: {$path}");
        }

        $questions = json_decode(file_get_contents($path), true);

        $questions = array_map(function ($question) {
            // optionsはJSON文字列へ
            if (isset($question['options'])) {
                $question['options'] = json_encode($question['options'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }

            // idは自動増分なので除外
            unset($question['id']);

            // タイムスタンプは更新
            $question['created_at'] = now();
            $question['updated_at'] = now();

            return $question;
        }, $questions);

        // データベースに挿入
        Question::insert($questions);
        $this->command->info("Inserted " . count($questions) . " records into the database.");

        // $examQuestionsDirectory = database_path('exam-questions');
        // $filePathList = File::allFiles($examQuestionsDirectory);
        // foreach ($filePathList as $filePath) {
        //     // ファイル名にsampleが含まれている場合はスキップ
        //     if (str_contains($filePath->getFilename(), 'sample')) {
        //         continue;
        //     }

        //     $examQuestions = include $filePath->getRealPath();
        //     foreach ($examQuestions as $question) {
        //         Question::create($question);
        //     }
        // }
    }
}
