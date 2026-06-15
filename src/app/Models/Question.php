<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    // 複合主キーの設定
    protected $primaryKey = "複合主キー['exam_code', 'question_code']";

    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'exam_code',
        'question_code',
        'type',
        'text',
        'options',
        'max_length',
        'text_for_ai',
    ];

    protected $casts = ['options' => 'array'];
}
