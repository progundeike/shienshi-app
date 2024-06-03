<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function getUserInfo(Request $request)
    {
        Log::debug('getUserInfo');
        $user = Auth::user();
        if ($user) {
            return response()->json(new UserResource($user));
        } else {
            return response()->json(null);
        }
    }
}
