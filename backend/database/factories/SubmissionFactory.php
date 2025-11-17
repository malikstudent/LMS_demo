<?php

namespace Database\Factories;

use App\Models\Assignment;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubmissionFactory extends Factory
{
    protected $model = Submission::class;

    public function definition(): array
    {
        return [
            'assignment_id' => Assignment::factory(),
            'student_id' => User::factory()->siswa(),
            'file_path' => 'assignments/submission-' . uniqid() . '.pdf',
            'submitted_at' => now(),
            'score' => null,
            'feedback' => null,
        ];
    }

    public function graded(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'score' => fake()->numberBetween(60, 100),
                'feedback' => fake()->sentence(),
            ];
        });
    }
}
