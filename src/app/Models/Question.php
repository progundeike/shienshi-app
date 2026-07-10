<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

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

    public function examSentence(): BelongsTo
    {
        return $this->belongsTo(ExamSentence::class, 'exam_code', 'exam_code');
    }

    public function modelAnswer(): HasOne
    {
        return $this->hasOne(ModelAnswer::class, 'question_code', 'question_code')
            ->whereColumn('model_answers.exam_code', 'questions.exam_code');
    }

    public function userAnswers(): HasMany
    {
        return $this->hasMany(UserAnswer::class, 'question_code', 'question_code')
            ->whereColumn('user_answers.exam_code', 'questions.exam_code');
    }

    public function userAiDialogues(): HasMany
    {
        return $this->hasMany(UserAiDialogue::class, 'question_code', 'question_code')
            ->whereColumn('user_ai_dialogues.exam_code', 'questions.exam_code');
    }
}
