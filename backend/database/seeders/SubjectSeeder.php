<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = [
            'Matematika',
            'Bahasa Indonesia',
            'IPA',
            'IPS',
        ];

        foreach ($subjects as $subject) {
            Subject::firstOrCreate(['name' => $subject]);
        }
    }
}
