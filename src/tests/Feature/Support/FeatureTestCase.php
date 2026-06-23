<?php

namespace Tests\Feature\Support;

use App\Models\ExamSentence;
use App\Models\ModelAnswer;
use App\Models\Question;
use App\Models\User;
use App\Models\UserAiDialogue;
use App\Models\UserAnswer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

abstract class FeatureTestCase extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected User $normalUser;

    protected string $testExamCode = '2099_haru_1';

    protected int $testExamYear = 2099;

    protected string $testExamSeason = 'haru';

    protected int $testExamSection = 1;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();

        $this->adminUser = User::factory()->create([
            'username' => 'test_admin_user',
            'password' => Hash::make('adminPassword'),
            'is_admin' => true,
        ]);

        $this->normalUser = User::factory()->create([
            'username' => 'test_normal_user',
            'password' => Hash::make('normalPassword'),
            'is_admin' => false,
        ]);

        $this->createTestExamSentence();
        $this->createTestQuestions();
        $this->createTestModelAnswers();
        $this->createTestUserAnswers();
        $this->createTestUserAiDialogue();
    }

    protected function createTestExamSentence(): void
    {
        ExamSentence::updateOrCreate(
            ['exam_code' => $this->testExamCode],
            [
                'sentence' => 'テスト用の問題文です',
                'purpose' => 'テスト用の出題趣旨です',
                'review_comment' => 'テスト用の採点講評です',
            ]
        );
    }

    protected function createTestQuestions(): void
    {
        $questions = [
            [
                'exam_code' => $this->testExamCode,
                'question_code' => '1_1_0',
                'text' => 'テスト問題1',
                'text_for_ai' => 'テスト問題1',
                'type' => 'textarea',
                'options' => null,
                'max_length' => null,
            ],
            [
                'exam_code' => $this->testExamCode,
                'question_code' => '1_2_1',
                'text' => 'テスト問題2',
                'text_for_ai' => 'テスト問題2',
                'type' => 'input',
                'options' => null,
                'max_length' => 20,
            ],
            [
                'exam_code' => $this->testExamCode,
                'question_code' => '1_2_2',
                'text' => 'テスト問題3',
                'text_for_ai' => 'テスト問題3',
                'type' => 'checkbox',
                'options' => [
                    ['label' => '1', 'value' => '1'],
                    ['label' => '2', 'value' => '2'],
                    ['label' => '3', 'value' => '3'],
                ],
                'max_length' => null,
            ],
        ];

        foreach ($questions as $question) {
            Question::updateOrCreate(
                [
                    'exam_code' => $this->testExamCode,
                    'question_code' => $question['question_code'],
                ],
                [
                    'text' => $question['text'],
                    'text_for_ai' => $question['text_for_ai'],
                    'type' => $question['type'],
                    'options' => $question['options'],
                    'max_length' => $question['max_length'],
                ]
            );
        }
    }

    protected function createTestModelAnswers(): void
    {
        $modelAnswers = [
            [
                'exam_code' => $this->testExamCode,
                'question_code' => '1_1_0',
                'text' => '模範解答1',
            ],
            [
                'exam_code' => $this->testExamCode,
                'question_code' => '1_2_1',
                'text' => '模範解答2',
            ],
            [
                'exam_code' => $this->testExamCode,
                'question_code' => '1_2_2',
                'text' => '模範解答チェックボックス,1,2,3',

            ],
        ];

        foreach ($modelAnswers as $modelAnswer) {
            ModelAnswer::updateOrCreate(
                [
                    'exam_code' => $this->testExamCode,
                    'question_code' => $modelAnswer['question_code'],
                ],
                [
                    'text' => $modelAnswer['text'],
                ]
            );
        }
    }

    protected function createTestUserAnswers(): void
    {
        $userAnswers = [
            [
                'user_id' => $this->normalUser->id,
                'exam_code' => $this->testExamCode,
                'question_code' => '1_1_0',
                'user_text' => 'ユーザー解答1',
                'ai_rating' => '◯',
                'ai_text' => 'これはAIの添削結果のサンプル1です',
            ],
            [
                'user_id' => $this->normalUser->id,
                'exam_code' => $this->testExamCode,
                'question_code' => '1_2_1',
                'user_text' => 'ユーザー解答2',
                'ai_rating' => '×',
                'ai_text' => 'これはAIの添削結果のサンプル2です',
            ],
            [
                'user_id' => $this->normalUser->id,
                'exam_code' => $this->testExamCode,
                'question_code' => '1_2_2',
                'user_text' => '1,2',
                'ai_rating' => '×',
                'ai_text' => 'これはAIの添削結果のサンプル3です',
            ],
        ];

        foreach ($userAnswers as $userAnswer) {
            UserAnswer::where('user_id', $userAnswer['user_id'])
                ->where('exam_code', $userAnswer['exam_code'])
                ->where('question_code', $userAnswer['question_code'])
                ->delete();

            $answer = new UserAnswer([
                'exam_code' => $userAnswer['exam_code'],
                'question_code' => $userAnswer['question_code'],
                'user_text' => $userAnswer['user_text'],
                'ai_rating' => $userAnswer['ai_rating'],
                'ai_text' => $userAnswer['ai_text'],
            ]);

            $answer->user_id = $this->normalUser->id;
            $answer->save();
        }
    }

    protected function createTestUserAiDialogue()
    {
        $dialogues = [
            [
                'exam_code' => '2099_haru_1',
                'question_code' => '1_1_0',
                'user_question' => 'これはユーザーが投稿したAIへの質問のサンプル1です。',
                'ai_answer' => 'これはAIからのダミーの回答1です。',
            ],
            [
                'exam_code' => '2099_haru_1',
                'question_code' => '1_1_0',
                'user_question' => 'これはユーザーが投稿したAIへの質問のサンプル2です。',
                'ai_answer' => 'これはAIからのダミーの回答2です。',
            ],
        ];

        foreach ($dialogues as $dialogue) {
            $userAiDialogue = new UserAiDialogue(
                [
                    'exam_code' => $dialogue['exam_code'],
                    'question_code' => $dialogue['question_code'],
                    'user_question' => $dialogue['user_question'],
                    'ai_answer' => $dialogue['ai_answer'],
                ]
            );

            $userAiDialogue->user_id = $this->normalUser->id;
            $userAiDialogue->save();
        }
    }
}
