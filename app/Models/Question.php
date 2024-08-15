<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'year',
        'season',
        'section,',
        'question_number',
        'sub_question_number',
        'type',
        'text',
        'options',
        'max_length',
    ];
}
