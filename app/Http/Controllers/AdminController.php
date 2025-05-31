<?php

namespace App\Http\Controllers;

use App\Models\ExamSentence;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    public function updateExamQuestions(Request $request): JsonResponse
    {
        // 管理者権限を持つユーザーのみがアクセスできるようにする
        $user = auth()->user();
        if (!$user || !$user instanceof \App\Models\User || !$user->isAdmin()) {
            Log::warning('Unauthorized access attempt by user ID: ' . ($user ? $user->id : 'null'));
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // リクエストのバリデーション
        $request->validate([
            'year' => 'required|integer',
            'season' => 'required|in:haru,aki',
            'section' => 'required|integer',
            'questionNumber' => 'required|integer|max:20',
            'subQuestionNumber' => 'required|integer|max:20',
            'smallQuestionNumber' => 'nullable|integer|max:20',
            'text' => 'required|string|max:1000',
            'type' => 'required|string|in:textarea,radio,checkbox,input',
            'options' => 'nullable|array',
            'maxLength' => 'nullable|integer|max:5000',
        ]);

        // バリデーションが成功した場合、データを取得
        $data = $request->only([
            'year',
            'season',
            'section',
            'questionNumber',
            'subQuestionNumber',
            'smallQuestionNumber',
            'text',
            'type',
            'options',
            'maxLength',
        ]);

        // 試験問題の更新処理を実行
        try {
            // ここで試験問題の更新ロジックを実装
            Question::UpdateOrCreate(
                [
                    'year' => $data['year'],
                    'season' => $data['season'],
                    'section' => $data['section'],
                    'question_number' => $data['questionNumber'],
                    'sub_question_number' => $data['subQuestionNumber'],
                    'small_question_number' => $data['smallQuestionNumber'] ?? 0,
                ],
                [
                    'text' => $data['text'],
                    'type' => $data['type'],
                    'options' => $data['options'] ?? null,
                    'max_length' => $data['maxLength'] ?? null,
                ]
            );
            Log::info('Exam question updated successfully by user ID: ' . $user->id);

            return response()->json(['message' => 'Exam question updated successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to update exam question: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update exam question'], 500);
        }
    }

    // examSentenceを返す
    public function fetchExamSentence(string $year, string $season, string $section): JsonResponse
    {
        // 管理者権限を持つユーザーのみがアクセスできるようにする
        $user = auth()->user();
        if (!$user || !$user instanceof \App\Models\User || !$user->isAdmin()) {
            Log::warning('Unauthorized access attempt by user ID: ' . ($user ? $user->id : 'null'));
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // 試験文の取得
        try {
            $examSentence = ExamSentence::where('year', $year)
                ->where('season', $season)
                ->where('section', $section)
                ->first();

            if (!$examSentence) {
                return response()->json(['error' => 'Exam sentences not found'], 404);
            }

            return response()->json([
                'sentence' => $examSentence->sentence,
                'purpose' => $examSentence->purpose,
                'reviewComment' => $examSentence->review_comment,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch exam sentences: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch exam sentences'], 500);
        }
    }
    // examSentenceを更新する
}
