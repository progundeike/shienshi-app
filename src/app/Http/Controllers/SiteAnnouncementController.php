<?php

namespace App\Http\Controllers;

use App\Models\SiteAnnouncement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class SiteAnnouncementController extends Controller
{
    private const HEADER_NOTICE_LEAD_HOURS = 24;

    public function show(): JsonResponse
    {
        $announcement = SiteAnnouncement::find(1);
        $now = now();

        $enabled = (bool) $announcement?->is_active;

        $headerVisible = $enabled
            && $announcement->maintenance_start_at !== null
            && $announcement->maintenance_start_at->copy()->subHours(self::HEADER_NOTICE_LEAD_HOURS)->lte($now);

        return response()->json([
            'top_visible' => $enabled,
            'header_visible' => $headerVisible,

            // 非公開の文面は返さない
            'message' => $enabled ? $announcement->message : null,
        ])->header('Cache-Control', 'no-store');
    }

    public function edit(): JsonResponse
    {
        $this->authorize('manage', SiteAnnouncement::class);

        $announcement = SiteAnnouncement::find(1);

        return response()->json([
            'message' => $announcement->message ?? '',
            'is_active' => $announcement->is_active ?? false,

            // 管理画面の datetime-local 入力欄向けに、日本時間で返す
            'maintenance_start_at' => $announcement?->maintenance_start_at
                ?->copy()
                ->setTimezone('Asia/Tokyo')
                ->format('Y-m-d\TH:i'),
        ])->header('Cache-Control', 'no-store');
    }

    public function update(Request $request): JsonResponse
    {
        $this->authorize('manage', SiteAnnouncement::class);

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
            'is_active' => ['required', 'boolean'],

            'maintenance_start_at' => [
                'present',
                'required_if:is_active,true',
                'nullable',
                'date_format:Y-m-d\TH:i',
            ],
        ]);

        // 入力日時を日本時間として解釈し、
        // アプリのタイムゾーンに合わせたDB保存形式へ変換する
        if ($validated['maintenance_start_at'] !== null) {
            $validated['maintenance_start_at'] = Carbon::createFromFormat(
                '!Y-m-d\TH:i',
                $validated['maintenance_start_at'],
                'Asia/Tokyo',
            )
                ->setTimezone(config('app.timezone'))
                ->format('Y-m-d H:i:s');
        }

        SiteAnnouncement::upsert(
            [
                [
                    'id' => 1,
                    ...$validated,
                ],
            ],
            ['id'],
            [
                'message',
                'is_active',
                'maintenance_start_at',
            ],
        );

        return response()->json([
            'message' => '告知を保存しました。',
        ]);
    }
}
