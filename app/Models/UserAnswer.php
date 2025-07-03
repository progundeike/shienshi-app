<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAnswer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'exam_code',
        'user_id',
        'question_number',
        'sub_question_number',
        'small_question_number',
        'user_text',
        'ai_rating',
        'ai_text',
    ];
}
