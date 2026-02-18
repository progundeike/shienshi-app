<?php

namespace App\Policies;

use App\Models\Inquiry;
use App\Models\User;

class InquiryPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function viewAny(User $user): bool
    {
        return (bool) $user->isAdmin();
    }

    /**
     * Determine whether the user can create models.
     */
    // public function create(User $user): bool
    // {
    //     //
    // }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Inquiry $inquiry): bool
    {
        return (bool) $user->isAdmin();
    }
}
