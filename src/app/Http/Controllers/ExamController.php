<?php

namespace App\Http\Controllers;

use App\Models\SubmittedExam;
use App\Services\ExamDataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

// 試験問題に関する情報を提供するコントローラ
class ExamController extends Controller
{
    public function __construct(private readonly ExamDataService $examDataService)
    {
    }

    // 設問をjson形式で取得して、httpレスポンスを返す
    // ログイン済みで、答案提出済みの場合は、添削画面を表示する
    public function getExamQuestionsJson(string $examCode): JsonResponse
    {
        try {
            $questions = $this->examDataService->fetchExamQuestionsForPublic($examCode);

            // questionsが取得できない場合は404エラーを返す
            if (! $questions) {
                return response()->json(['error' => 'Questions not found'], 404);
            }

            return response()->json($questions);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return response()->json(['error' => 'Failed to get questions'], 500);
        }
    }

    // 提出済みの試験一覧を取得する
    public function fetchSubmittedExams()
    {
        $userId = $this->currentUserId();
        $fetchedSubmittedAnswers = SubmittedExam::where('user_id', $userId)
            ->orderBy('exam_code', 'desc')
            ->get();

        $submittedAnswers = $fetchedSubmittedAnswers->map(function ($exam) {
            [$year, $season, $section] = explode('_', $exam->exam_code);
            $year = (int) $year;
            $section = (int) $section;

            $submittedExam = [
                'year' => $year,
                'season' => $season,
                'section' => $section,
            ];

            // seasonを日本語に変換
            if ($season === 'haru') {
                $submittedExam['season_japanese'] = '春期';
            } elseif ($season === 'aki') {
                $submittedExam['season_japanese'] = '秋期';
            } else {
                // 例外
                $submittedExam['season_japanese'] = '未登録';
                Log::error('Unknown season: '.$submittedExam['season']);
            }

            // sectionを問いに変換。2023年までは午後I, 午後Ⅱに分ける
            if ($year >= 2023) {
                // sectionをそのまま問いに変換
                $submittedExam['section_converted'] = '問'.$section;
            } else {
                // sectionを午前、午後に分類
                if ($section < 4) {
                    $submittedExam['section_converted'] = '午後I 問'.$section;
                } elseif ($section === 4) {
                    $submittedExam['section_converted'] = '午後Ⅱ 問1';
                } elseif ($section === 5) {
                    $submittedExam['section_converted'] = '午後Ⅱ 問2';
                } else {
                    // 例外
                    $submittedExam['section_converted'] = '未登録';
                    Log::error('Unknown section: '.$submittedExam['section']);
                }
            }

            return $submittedExam;
        });

        return response()->json($submittedAnswers, 200);
    }

    // 試験のPDFファイルの存在確認
    public function checkFileExists(string $year, string $season, string $section): JsonResponse
    {
        // validation
        $validator = Validator::make(
            compact('year', 'season', 'section'),
            [
                'year' => ['required', 'regex:/^20\d{2}$/'],
                'season' => ['required', 'in:haru,aki'],
                'section' => ['required', 'in:1,2,3,4,5'],
            ]
        );

        if ($validator->fails()) {
            return response()->json(['error' => 'Invalid parameters'], 422);
        }

        $examCode = $year.'_'.$season.'_'.$section;

        $filePath = storage_path('app/public/pdf/'.$year.'/'.$examCode.'.pdf');

        if (! file_exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        return response()->json([
            'message' => 'File exists',
        ], 200);
    }

    // 出題趣旨、採点講評を返す
    public function getPurposeAndReviewComment(string $examCode): JsonResponse
    {
        try {
            $purposeAndReviewComment = $this->examDataService->fetchPurposeAndReviewComment($examCode);

            return response()->json([
                'purpose' => $purposeAndReviewComment['purpose'],
                'reviewComment' => $purposeAndReviewComment['reviewComment'],
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return response()->json(['error' => '採点講評, 出題趣旨の取得に失敗しました'], 500);
        }
    }
}
