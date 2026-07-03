<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Notifications\SlackNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class InquiryController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Inquiry::class);

        $inquiries = Inquiry::latest()->get();

        return response()->json($inquiries);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],

            'opened_at' => ['required', 'integer'], // honneypot
            'company' => ['nullable', 'string', 'max:255'], // honeypot
        ]);

        // honeypotのチェック
        $now = time();
        if (($now - $validated['opened_at']) < 1) { // フォームが開かれてから1秒未満で送信された場合はスパムとみなす
            return response()->json(['message' => 'ok'], 201); // honeypot用レスポンス
        }
        if (! empty($validated['company'])) {
            return response()->json(['message' => 'ok'], 201); // honeypot用レスポンス
        }

        $inquiryData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'message' => $validated['message'],
        ];
        $inquiry = new Inquiry($inquiryData);
        $inquiry->user_id = $request->user()?->id;
        $inquiry->save();

        try {
            Notification::route('slack', config('services.slack.webhook_url'))
                ->notify(new SlackNotification(
                    "新しいお問い合わせがありました。 \n管理画面で内容を確認してください。"
                ));
        } catch (\Exception $e) {
            Log::error('Error occurred while sending Slack notification: '.$e->getMessage());
        }

        return response()->json(['message' => 'ok'], 201);
    }

    public function destroy(Inquiry $inquiry)
    {
        $this->authorize('delete', $inquiry);
        $inquiry->delete();

        return response()->noContent();
    }
}
