<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Support\Facades\Auth;

abstract class Controller
{
    use AuthorizesRequests, ValidatesRequests;

    protected function currentUserId(): int
    {
        $userId = Auth::id();

        if ($userId === null) {
            abort(401, 'Unauthorized');
        }

        return (int) $userId;
    }
}
