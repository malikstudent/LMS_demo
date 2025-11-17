<?php

namespace App\Http\Controllers\Api;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController
{
    public function checkin(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
        ]);

        $user = Auth::user();

        // Record attendance for today
        $attendance = Attendance::updateOrCreate(
            [
                'user_id' => $user->id,
                'class_id' => $validated['class_id'],
                'date' => now()->toDateString(),
            ],
            [
                'status' => 'present',
            ]
        );

        return response()->json([
            'message' => 'Check-in successful',
            'attendance' => [
                'id' => $attendance->id,
                'student_id' => $user->student_id,
                'date' => $attendance->date,
                'status' => $attendance->status,
                'created_at' => $attendance->created_at,
            ],
        ]);
    }

    public function myAttendance(Request $request)
    {
        $user = Auth::user();

        $attendances = Attendance::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($attendance) {
                return [
                    'id' => $attendance->id,
                    'class_id' => $attendance->class_id,
                    'date' => $attendance->date,
                    'status' => $attendance->status,
                ];
            });

        // Calculate attendance stats
        $total = $attendances->count();
        $present = $attendances->where('status', 'present')->count();
        $absent = $attendances->where('status', 'absent')->count();
        $late = $attendances->where('status', 'late')->count();

        $rate = $total > 0 ? round(($present / $total) * 100, 2) : 0;

        return response()->json([
            'attendances' => $attendances,
            'stats' => [
                'total' => $total,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'attendance_rate' => $rate,
            ],
        ]);
    }
}
