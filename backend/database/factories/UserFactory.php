<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'siswa',
            'student_id' => null,
            'profile' => null,
            'remember_token' => Str::random(10),
        ];
    }

    public function admin(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'admin',
                'student_id' => null,
            ];
        });
    }

    public function guru(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'guru',
                'student_id' => null,
            ];
        });
    }

    public function siswa(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'siswa',
                'student_id' => 'S-' . date('Y') . '-' . Str::random(8),
            ];
        });
    }
}
