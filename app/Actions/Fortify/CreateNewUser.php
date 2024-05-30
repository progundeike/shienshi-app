<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
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
                'min:8',
                'max:50',
                'regex:/^[A-Za-z_0-9]+$/',
                Rule::unique(User::class)
            ],
            'nickname' => [
                'required',
                'string',
                'max:15'
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        return User::create([
            'username' => (string) Str::of($input['username'])->trim(),
            'nickname' => (string) Str::of($input['nickname'])->trim(),
            'password' => Hash::make($input['password']),
            'auth_provider' => 'password'
        ]);
    }
}
