<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\PublicUserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function __construct(
        private readonly PublicUserService $publicUserService,
    ) {}

    public function getUserInfo(Request $request)
    {
        return response()->json(new UserResource($request->user()));
    }

    public function deleteUser(Request $request)
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (! $user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // パブリックユーザーは削除不可
        if ($this->publicUserService->isPublicUser($user)) {
            throw new \App\Exceptions\PublicUserOperationException();
        }

        // パスワード検証
        $request->validate([
            'password' => [
                'required',
                'string',
                'current_password:web',
            ],
        ]);

        // ログアウト
        Auth::guard('web')->logout();

        // ユーザー削除
        $user->delete();

        // セッションの無効化
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'User deleted'], 200);
    }
}
