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
     * @var list<string>
     */
    protected $fillable = [
        'exam_code',
        'question_number',
        'sub_question_number',
        'small_question_number',
        'type',
        'text',
        'options',
        'max_length',
        'text_for_ai',
    ];

    protected $casts = ['options' => 'array'];
}
