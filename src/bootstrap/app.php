<?php

use App\Exceptions\PublicUserOperationException;
use App\Http\Middleware\EnsureAdminHasTwoFactorEnabled;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();

        $middleware->redirectGuestsTo(function (Request $request) {
            if ($request->is('api/*')) {
                return null; // APIリクエストの場合はリダイレクトしない
            }

            return '/login';
        });

        // 管理者権限用のミドルウェアを追加
        $middleware->alias([
            'admin' => EnsureUserIsAdmin::class,
            'admin.2fa' => EnsureAdminHasTwoFactorEnabled::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->dontReport([
            PublicUserOperationException::class,
        ]);

        $exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
            return $request->is('api/*') || $request->expectsJson();
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }

            return null;
        });

        $exceptions->render(function (PublicUserOperationException $exception, Request $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => $exception->getMessage(),
                    'code' => 'PUBLIC_USER_OPERATION_FORBIDDEN',
                ], 403);
            }

            return back()
                ->withErrors(['public_user' => $exception->getMessage()])
                ->withInput();
        });
    })->create();
