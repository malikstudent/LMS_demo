<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create demo admin
        User::factory()->admin()->create([
            'name' => 'Administrator',
            'email' => 'admin@lms.local',
            'password' => bcrypt('password'), // Simple demo password
        ]);

        // Create demo teacher
        User::factory()->guru()->create([
            'name' => 'Demo Teacher',
            'email' => 'teacher@lms.local',
            'password' => bcrypt('password'), // Simple demo password
        ]);

        // Create demo student
        User::factory()->siswa()->create([
            'name' => 'Demo Student',
            'email' => 'student@lms.local',
            'password' => bcrypt('password'), // Simple demo password
        ]);

        // Create additional random users
        for ($i = 0; $i < 2; $i++) {
            User::factory()->guru()->create([
                'email' => fake()->unique()->safeEmail(),
                'password' => bcrypt('password'),
            ]);
        }

        for ($i = 0; $i < 15; $i++) {
            User::factory()->siswa()->create([
                'email' => fake()->unique()->safeEmail(),
                'password' => bcrypt('password'),
            ]);
        }
    }
}
