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
        'exam_year',
        'exam_season',
        'exam_id,',
        'question_id',
        'sub_question_id',
        'type',
        'text',
        'options',
        'max_length',
    ];
}
