<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Laravel\Fortify\Contracts\UpdatesUserPasswords;

class UpdateUserPassword implements UpdatesUserPasswords
{
    use PasswordValidationRules;

    /**
     * Validate and update the user's password.
     *
     * @param  array<string, string>  $input
     */
    public function update(User $user, array $input): void
    {
        // new_passwordとnew_password_confirmationが一致しているかチェック

        Validator::make($input, [
            'current_password' => ['required', 'string', 'current_password:web'],
            'new_password' => $this->passwordRules(),
        ], [
            'current_password.current_password' => __('入力されたパスワードは、現在のパスワードと異なります。'),
        ])->validateWithBag('updatePassword');

        $user->forceFill([
            'password' => Hash::make($input['new_password']),
        ])->save();

        // 再ログイン
        session()->invalidate();
        session()->regenerateToken();
        Auth::login($user);
        session()->regenerate();
    }
}
