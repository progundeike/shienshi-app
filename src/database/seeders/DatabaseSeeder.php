<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UserSeeder::class);
        $this->call(ExamSentenceSeeder::class);
        $this->call(QuestionSeeder::class);
        $this->call(ModelAnswerSeeder::class);
        $this->call(NewsItemSeeder::class);
    }
}
