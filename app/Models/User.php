<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'username',
        'nickname',
        'password',
        'email',
        'auth_provider',
        'auth_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        // ユーザー登録時にランダムなIDを生成
        static::creating(function ($user) {
            do {
                $user->id = $user->random();
            } while (User::find($user->id) || $user->id == 0);
        });
    }

    // ユーザーIDをランダムに生成
    private function random($length = 8)
    {
        return substr(str_shuffle('1234567890'), 0, $length);
    }
}
