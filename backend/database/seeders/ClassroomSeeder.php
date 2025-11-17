<?php

namespace Database\Seeders;

use App\Models\Classroom;
use Illuminate\Database\Seeder;

class ClassroomSeeder extends Seeder
{
    public function run(): void
    {
        $classes = [
            ['name' => 'Kelas X A', 'year' => '2024'],
            ['name' => 'Kelas X B', 'year' => '2024'],
            ['name' => 'Kelas XI A', 'year' => '2024'],
        ];

        foreach ($classes as $class) {
            Classroom::firstOrCreate($class);
        }
    }
}
