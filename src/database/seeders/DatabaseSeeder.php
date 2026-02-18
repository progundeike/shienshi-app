<?php

namespace Database\Seeders;

use App\Models\NewsItem;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(QuestionSeeder::class);
        $this->call(ModelAnswerSeeder::class);
        $this->call(ExamSentenceSeeder::class);

        NewsItem::factory()->count(10)->create();
    }
}
