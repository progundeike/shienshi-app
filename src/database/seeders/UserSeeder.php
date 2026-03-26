<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $username = config('app.initial_admin_name');
        $password = config('app.initial_admin_password');

        if (!$username || !$password) {
            throw new \RuntimeException('Initial admin credentials are not set.');
        }

        // 初期データの挿入
        User::updateOrCreate(
            ['username' => $username],
            [
                'password' => Hash::make($password),
                'email_verified_at' => null,
                'is_admin' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
