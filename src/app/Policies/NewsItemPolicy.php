<?php

namespace App\Policies;

use App\Models\NewsItem;
use App\Models\User;

class NewsItemPolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return (bool) $user->isAdmin();
    }

    public function update(User $user, NewsItem $newsItem): bool
    {
        return (bool) $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, NewsItem $newsItem): bool
    {
        return (bool) $user->isAdmin();
    }
}
