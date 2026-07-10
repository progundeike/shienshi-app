<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAnswer extends Model
{
    use HasFactory;

    // 複合主キーの設定
    protected $primaryKey = "複合主キー['user_id', exam_code', 'question_code']";

    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'exam_code',
        'question_code',
        'user_text',
        'ai_rating',
        'ai_text',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_code', 'question_code')
            ->whereColumn('user_answers.exam_code', 'questions.exam_code');
    }
}
