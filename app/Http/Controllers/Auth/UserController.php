<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function getUserInfo(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            return response()->json(new UserResource($user));
        } else {
            return response()->json(null);
        }
    }

    public function deleteUser(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        if ($user) {

            // ログアウト
            Auth::guard('web')->logout();

            // ユーザー削除
            $user->delete();

            // セッションの無効化
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json(['message' => 'User deleted'], 200);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }
}
