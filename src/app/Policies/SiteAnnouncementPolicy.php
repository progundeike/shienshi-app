<?php

namespace App\Policies;

use App\Models\User;

class SiteAnnouncementPolicy
{
    public function manage(User $user): bool
    {
        return $user->isAdmin();
    }
}
