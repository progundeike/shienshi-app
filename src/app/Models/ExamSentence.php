<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamSentence extends Model
{
    use HasFactory;

    protected $primaryKey = 'exam_code';

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'exam_code',
        'sentence',
        'purpose',
        'review_comment',
    ];

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class, 'exam_code', 'exam_code');
    }

    public function submittedExams(): HasMany
    {
        return $this->hasMany(SubmittedExam::class, 'exam_code', 'exam_code');
    }
}
