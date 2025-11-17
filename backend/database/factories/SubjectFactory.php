<?php

namespace Database\Factories;

use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubjectFactory extends Factory
{
    protected $model = Subject::class;

    public function definition(): array
    {
        $subjects = ['Matematika', 'Bahasa Indonesia', 'IPA', 'IPS'];
        return [
            'name' => fake()->randomElement($subjects),
        ];
    }
}
