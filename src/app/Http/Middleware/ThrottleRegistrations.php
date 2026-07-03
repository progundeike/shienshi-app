<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\RateLimiter;

class ThrottleRegistrations
{
    private const MAX_ATTEMPTS = 5;
    private const DECAY_SECONDS = 3600; // 1時間

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Fortifyのユーザー登録だけを制限する
        if (! $request->isMethod('POST') || ! $request->is('api/register')) {
            return $next($request);
        }

        $key = sprintf('register:%s', $request->ip());

        if (RateLimiter::tooManyAttempts($key, self::MAX_ATTEMPTS)) {
            $retryAfter = RateLimiter::availableIn($key);
            return response()->json([
                'message' => '登録回数の上限に達しました。時間をおいて再度お試しください。',
                'retry_after' => $retryAfter,
            ], 429)->withHeaders(
                [
                    'Retry-After' => $retryAfter,
                    'X-RateLimit-Limit' => (string) self::MAX_ATTEMPTS,
                    'X-RateLimit-Remaining' => (string) RateLimiter::remaining($key, self::MAX_ATTEMPTS)
                ]
            );
        }

        // 登録の成否に関わらず、登録リクエストを1回として記録する
        RateLimiter::hit($key, self::DECAY_SECONDS);

        $response = $next($request);

        return $response->withHeaders([
            'X-RateLimit-Limit' => (string) self::MAX_ATTEMPTS,
            'X-RateLimit-Remaining' => (string) RateLimiter::remaining($key, self::MAX_ATTEMPTS),
        ]);
    }
}
