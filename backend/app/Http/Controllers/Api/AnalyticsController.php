<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;

class AnalyticsController
{
    public function studentScores($studentId)
    {
        $student = User::findOrFail($studentId);

        if ($student->role !== 'siswa') {
            return response()->json(['message' => 'Invalid student'], 400);
        }

        $scores = $student->submissions()
            ->with('assignment')
            ->get()
            ->map(function ($submission) {
                return [
                    'assignment' => $submission->assignment->title,
                    'score' => $submission->score,
                    'submitted_at' => $submission->submitted_at,
                ];
            });

        $average = $student->submissions()->whereNotNull('score')->average('score') ?? 0;

        return response()->json([
            'student_id' => $student->id,
            'student_name' => $student->name,
            'average_score' => round($average, 2),
            'scores' => $scores,
        ]);
    }

    public function classAttendance($classId)
    {
        $class = \App\Models\Classroom::findOrFail($classId);

        $attendanceData = $class->attendances()
            ->groupBy('user_id')
            ->with('user')
            ->get()
            ->map(function ($userAttendances) {
                $total = $userAttendances->count();
                $present = $userAttendances->where('status', 'present')->count();
                return [
                    'student_name' => $userAttendances->first()->user->name,
                    'total' => $total,
                    'present' => $present,
                    'rate' => $total > 0 ? round(($present / $total) * 100, 2) : 0,
                ];
            });

        return response()->json([
            'class_id' => $class->id,
            'class_name' => $class->name,
            'data' => $attendanceData,
        ]);
    }
}
