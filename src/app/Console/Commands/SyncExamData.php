<?php

namespace App\Console\Commands;

use App\Models\ModelAnswer;
use App\Models\Question;
use Database\Seeders\ExamSentenceSeeder;
use Database\Seeders\ModelAnswerSeeder;
use Database\Seeders\QuestionSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncExamData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'exam-data:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        DB::transaction(function () {
            // 追加・更新
            app(ExamSentenceSeeder::class)->run();
            app(QuestionSeeder::class)->run();
            app(ModelAnswerSeeder::class)->run();

            // Jsonを読み込む
            $path = storage_path('app/exam-data');
            $examSentences = json_decode(
                file_get_contents("{$path}/exam_sentences.json"),
                true,
                512,
                JSON_THROW_ON_ERROR
            );

            $modelAnswers = json_decode(
                file_get_contents("{$path}/model_answers.json"),
                true,
                512,
                JSON_THROW_ON_ERROR
            );

            $questions = json_decode(
                file_get_contents("{$path}/questions.json"),
                true,
                512,
                JSON_THROW_ON_ERROR
            );

            // Jsonに存在しないデータを削除
            $this->deleteRemovedModelAnswers($modelAnswers);
            $this->deleteRemovedQuestions($questions);
            $this->deleteRemovedExamSentences($examSentences);
        });

        $this->info('Exam data sync completed successfully.');

        return self::SUCCESS;
    }

    private function deleteRemovedExamSentences(array $examSentences): void
    {
        $examCodes = collect($examSentences)
            ->pluck('exam_code')
            ->toArray();

        if (empty($examCodes)) {
            throw new \RuntimeException('No exam codes found in the json data.');
        }

        $deletedCount = DB::table('exam_sentences')
            ->whereNotIn('exam_code', $examCodes)
            ->delete();

        $this->info("Deleted {$deletedCount} removed exam sentences.");
    }

    private function deleteRemovedQuestions(array $questions): void
    {
        if (empty($questions)) {
            throw new \RuntimeException('No question codes found in the json data.');
        }

        $questionKeys = collect($questions)
            ->map(function (array $question): string {
                return "{$question['exam_code']}:{$question['question_code']}";
            })
            ->toArray();

        // DBには存在するが、JSONには存在しないデータを取得
        $questionsToDelete = Question::query()
            ->get(['exam_code', 'question_code'])
            ->filter(
                function (Question $question) use ($questionKeys): bool {
                    return ! in_array("{$question->exam_code}:{$question->question_code}", $questionKeys, true);
                }
            );

        foreach ($questionsToDelete as $question) {
            Question::query()
                ->where('exam_code', $question->exam_code)
                ->where('question_code', $question->question_code)
                ->delete();
        }

        $this->info("Deleted {$questionsToDelete->count()} removed questions.");
    }

    private function deleteRemovedModelAnswers(array $modelAnswers): void
    {
        if (empty($modelAnswers)) {
            throw new \RuntimeException('No model answers found in the json data.');
        }

        $modelAnswerKeys = collect($modelAnswers)
            ->map(function (array $modelAnswer): string {
                return "{$modelAnswer['exam_code']}:{$modelAnswer['question_code']}";
            })
            ->toArray();

        // DBには存在するが、JSONには存在しないデータを取得
        $modelAnswersToDelete = ModelAnswer::query()
            ->get(['exam_code', 'question_code'])
            ->filter(
                function ($modelAnswer) use ($modelAnswerKeys): bool {
                    return ! in_array("{$modelAnswer->exam_code}:{$modelAnswer->question_code}", $modelAnswerKeys, true);
                }
            );

        foreach ($modelAnswersToDelete as $modelAnswer) {
            ModelAnswer::query()
                ->where('exam_code', $modelAnswer->exam_code)
                ->where('question_code', $modelAnswer->question_code)
                ->delete();
        }

        $this->info("Deleted {$modelAnswersToDelete->count()} removed model answers.");
    }
}
