<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('inquiry', function (Request $request) {
            return Limit::perMinutes(30, 10);
        });

        RateLimiter::for('ai-answer', function (Request $request) {
            $userId = $request->user()->id;

            return [
                Limit::perMinutes(10, 3)
                    ->by("ai-answer:10-minutes:{$userId}"),

                Limit::perDay(20)
                    ->by("ai-answer:daily:{$userId}"),
            ];
        });

        RateLimiter::for('ai-chat', function (Request $request) {
            $userId = $request->user()->id;

            return [
                Limit::perMinutes(10, 5)
                    ->by("ai-chat:10-minutes:{$userId}"),

                Limit::perDay(30)
                    ->by("ai-chat:daily:{$userId}"),
            ];
        });
    }
}
