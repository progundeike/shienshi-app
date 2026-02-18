<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getUserInfo(Request $request)
    {
        return response()->json(new UserResource($request->user()));
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
