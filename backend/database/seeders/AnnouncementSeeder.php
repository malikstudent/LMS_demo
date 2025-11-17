<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $announcements = [
            [
                'title' => 'Pengumuman UTS 2024',
                'body' => 'Ujian Tengah Semester akan dilaksanakan pada bulan Oktober 2024',
                'type' => 'schedule',
                'start_at' => now()->addDays(5),
                'end_at' => now()->addDays(30),
                'meta' => ['schedule_type' => 'UTS'],
            ],
            [
                'title' => 'Pengumuman UAS 2024',
                'body' => 'Ujian Akhir Semester akan dilaksanakan pada bulan Desember 2024',
                'type' => 'schedule',
                'start_at' => now()->addDays(60),
                'end_at' => now()->addDays(90),
                'meta' => ['schedule_type' => 'UAS'],
            ],
            [
                'title' => 'Libur Sekolah',
                'body' => 'Sekolah libur untuk perayaan hari raya',
                'type' => 'info',
                'start_at' => now()->addDays(15),
                'end_at' => now()->addDays(20),
                'meta' => null,
            ],
        ];

        foreach ($announcements as $announcement) {
            Announcement::create($announcement);
        }
    }
}
