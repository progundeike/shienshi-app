<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'username' => [
                'required',
                'string',
                'min:1',
                'max:50',
                'regex:/^[a-z0-9_]+$/',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        // ユーザーを作成
        $user = User::create([
            'username' => (string) Str::of($input['username'])->trim(),
            'password' => Hash::make($input['password']),
        ]);

        return $user;
    }
}
