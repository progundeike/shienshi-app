<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteAnnouncement extends Model
{
    protected $fillable = [
        'message',
        'is_active',
        'maintenance_start_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'maintenance_start_at' => 'datetime',
    ];
}
