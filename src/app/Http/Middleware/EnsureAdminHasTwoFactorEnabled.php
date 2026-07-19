<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminHasTwoFactorEnabled
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user?->is_admin && ! $user->two_factor_confirmed_at) {
            return response()->json([
                'message' => '管理者は二要素認証が必要です',
                'code' => 'ADMIN_TWO_FACTOR_REQUIRED',
            ], 403);
        }

        return $next($request);
    }
}
