<?php

namespace Database\Seeders;

use App\Models\Classroom;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed subjects
        $this->call(SubjectSeeder::class);

        // Seed classes
        $this->call(ClassroomSeeder::class);

        // Seed users
        $this->call(UserSeeder::class);

        // Seed class assignments
        $this->call(ClassUserSeeder::class);

        // Seed announcements
        $this->call(AnnouncementSeeder::class);
    }
}
