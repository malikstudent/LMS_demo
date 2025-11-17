<?php

namespace Database\Seeders;

use App\Models\Classroom;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassUserSeeder extends Seeder
{
    public function run(): void
    {
        $gurus = User::where('role', 'guru')->get();
        $siswa = User::where('role', 'siswa')->get();
        $classes = Classroom::all();

        // Assign teachers to classes
        foreach ($gurus as $guru) {
            $selectedClasses = $classes->random(min(2, $classes->count()));
            foreach ($selectedClasses as $class) {
                DB::table('class_user')->insert([
                    'class_id' => $class->id,
                    'user_id' => $guru->id,
                    'role_in_class' => 'teacher',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Assign students to classes
        foreach ($siswa as $student) {
            $selectedClasses = $classes->random(min(2, $classes->count()));
            foreach ($selectedClasses as $class) {
                DB::table('class_user')->insert([
                    'class_id' => $class->id,
                    'user_id' => $student->id,
                    'role_in_class' => 'student',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
