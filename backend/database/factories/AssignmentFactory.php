<?php

namespace Database\Factories;

use App\Models\Assignment;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssignmentFactory extends Factory
{
    protected $model = Assignment::class;

    public function definition(): array
    {
        return [
            'teacher_id' => User::factory()->guru(),
            'class_id' => Classroom::factory(),
            'subject_id' => Subject::factory(),
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'file_path' => null,
            'due_date' => now()->addDays(7),
        ];
    }
}
