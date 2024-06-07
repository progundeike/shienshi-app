<?php

namespace Database\Seeders;

use App\Models\ExamSentence;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExamSentenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $examSentence = include database_path('exam-sentences/2023_aki_1.php');

        ExamSentence::create($examSentence);
    }
}
