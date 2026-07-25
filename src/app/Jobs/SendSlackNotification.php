<?php

namespace App\Jobs;

use App\Notifications\SlackNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class SendSlackNotification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(private readonly string $message) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Notification::route(
                'slack',
                config('services.slack.webhook_url')
            )->notify(new SlackNotification($this->message));
        } catch (\Throwable $e) {
            Log::error('Slack notification failed.', ['exception' => $e]);
        }
    }
}
