<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ExamSentence>
 */
class ExamSentenceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $year = $this->faker->numberBetween(2000, 2029);
        $season = $this->faker->randomElement(['haru', 'aki']);
        $section = $this->faker->numberBetween(1, 4);

        return [
            'exam_code' => $year.'_'.$season.'_'.$section,
            'sentence' => $this->faker->text(200),
            'purpose' => $this->faker->text(100),
            'review_comment' => $this->faker->text(100),
        ];
    }
}
