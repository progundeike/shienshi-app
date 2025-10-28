<?php

namespace App\Console\Commands;

use App\Models\ExamSentence;
use App\Models\ModelAnswer;
use App\Models\Question;
use DragonCode\Contracts\Cashier\Resources\Model;
use Illuminate\Console\Command;

class ExportExamDataJson extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'export:exam-data {--path=database/seeders/data}';

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
        $path = base_path($this->option('path'));
        $questions = Question::orderBy('id')->get();
        $examSentences = ExamSentence::orderBy('exam_code')->get();
        $modelAnswers = ModelAnswer::orderBy('id')->get();

        $data = [
            'questions' => $questions->toArray(),
            'exam_sentences' => $examSentences->toArray(),
            'model_answers' => $modelAnswers->toArray(),
        ];

        foreach ($data as $table => $items) {
            $filePath = "{$path}/{$table}.json";
            $json = json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

            if (false === file_put_contents($filePath, $json)) {
                $this->error("Failed to write to {$filePath}");
                continue;
            }

            $this->info("Exported {$table}:" . count($items) . "records to {$filePath}");
        }

        return;
    }
}
