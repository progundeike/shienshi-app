<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamSentence extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'exam_code',
        'sentence',
        'purpose',
        'review_comment',
    ];

    protected $primaryKey = 'exam_code';
    public $incrementing = false;
    protected $keyType = 'string';
}
