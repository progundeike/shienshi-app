<?php

namespace App\Console\Commands;

use App\Models\ExamSentence;
use App\Models\ModelAnswer;
use App\Models\Question;
use Illuminate\Console\Command;

class ExportExamDataJson extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'exam-data:export';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Export table to a JSON file.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $path = storage_path('app/exam-data');
        $questions = Question::orderBy('exam_code')->orderBy('question_code')->get();
        $examSentences = ExamSentence::orderBy('exam_code')->get();
        $modelAnswers = ModelAnswer::orderBy('exam_code')->orderBy('question_code')->get();

        $data = [
            'questions' => $questions->toArray(),
            'exam_sentences' => $examSentences->toArray(),
            'model_answers' => $modelAnswers->toArray(),
        ];

        foreach ($data as $table => $items) {
            $filePath = "{$path}/{$table}.json";
            $json = json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

            if (file_put_contents($filePath, $json) === false) {
                $this->error("Failed to write to {$filePath}");

                continue;
            }

            $this->info("Exported {$table}:".count($items)."records to {$filePath}");
        }
    }
}
