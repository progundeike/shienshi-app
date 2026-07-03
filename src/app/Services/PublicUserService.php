<?php

namespace App\Services;

use App\Models\User;

class PublicUserService
{
    private const PUBLIC_USERNAME = 'public_user';

    public function isPublicUser(User $user): bool
    {
        return $user->username === self::PUBLIC_USERNAME;
    }
}
