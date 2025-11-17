<?php

namespace App\Http\Controllers\Api;

use App\Models\Classroom;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController
{
    public function listUsers()
    {
        $users = User::all()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'student_id' => $user->student_id,
                ];
            });

        return response()->json($users);
    }

    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:admin,guru,siswa',
        ]);

        $student_id = null;
        if ($validated['role'] === 'siswa') {
            $lastStudent = User::where('role', 'siswa')
                ->orderBy('id', 'desc')
                ->first();
            $number = $lastStudent ? intval(substr($lastStudent->student_id, -4)) + 1 : 1;
            $student_id = 'S-2025-' . str_pad($number, 4, '0', STR_PAD_LEFT);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
            'student_id' => $student_id,
        ]);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'student_id' => $user->student_id,
        ], 201);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|in:admin,guru,siswa',
        ]);

        $user->update($validated);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }

    public function attendanceReport(Request $request)
    {
        $classId = $request->query('class');
        $from = $request->query('from');
        $to = $request->query('to');

        $query = \App\Models\Attendance::query();

        if ($classId) {
            $query->where('class_id', $classId);
        }

        if ($from) {
            $query->where('date', '>=', $from);
        }

        if ($to) {
            $query->where('date', '<=', $to);
        }

        $attendances = $query->with('user')->get()
            ->groupBy('user_id')
            ->map(function ($userAttendances) {
                $total = $userAttendances->count();
                $present = $userAttendances->where('status', 'present')->count();
                return [
                    'student_name' => $userAttendances->first()->user->name,
                    'total_records' => $total,
                    'present' => $present,
                    'rate' => $total > 0 ? round(($present / $total) * 100, 2) : 0,
                ];
            });

        return response()->json($attendances);
    }

    // Class Management Methods
    public function listClasses()
    {
        $classes = Classroom::with('subjects')->get()
            ->map(function ($class) {
                return [
                    'id' => $class->id,
                    'name' => $class->name,
                    'teacher' => $class->teacher,
                    'subjects_count' => $class->subjects->count(),
                    'subjects' => $class->subjects->pluck('name'),
                ];
            });

        return response()->json($classes);
    }

    public function createClass(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'teacher' => 'required|string|max:255',
        ]);

        $class = Classroom::create($validated);

        return response()->json([
            'id' => $class->id,
            'name' => $class->name,
            'teacher' => $class->teacher,
        ], 201);
    }

    public function updateClass(Request $request, $id)
    {
        $class = Classroom::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'teacher' => 'sometimes|string|max:255',
        ]);

        $class->update($validated);

        return response()->json([
            'id' => $class->id,
            'name' => $class->name,
            'teacher' => $class->teacher,
        ]);
    }

    public function deleteClass($id)
    {
        $class = Classroom::findOrFail($id);
        $class->delete();

        return response()->json(['message' => 'Class deleted']);
    }

    // Dashboard Stats
    public function dashboardStats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_classes' => Classroom::count(),
            'total_students' => User::where('role', 'siswa')->count(),
            'total_teachers' => User::where('role', 'guru')->count(),
        ]);
    }

    // Export Methods
    public function exportUsers()
    {
        $users = User::all();
        
        $csv = "ID,Name,Email,Role,Student ID\n";
        foreach ($users as $user) {
            $csv .= "{$user->id},{$user->name},{$user->email},{$user->role},{$user->student_id}\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="users.csv"',
        ]);
    }

    public function exportClasses()
    {
        $classes = Classroom::all();
        
        $csv = "ID,Name,Teacher\n";
        foreach ($classes as $class) {
            $csv .= "{$class->id},{$class->name},{$class->teacher}\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="classes.csv"',
        ]);
    }

    public function exportAttendance()
    {
        $attendances = \App\Models\Attendance::with('user')->get();
        
        $csv = "ID,Student Name,Date,Status\n";
        foreach ($attendances as $attendance) {
            $csv .= "{$attendance->id},{$attendance->user->name},{$attendance->date},{$attendance->status}\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="attendance.csv"',
        ]);
    }

    public function exportGrades()
    {
        $grades = \App\Models\Grade::with(['user', 'assignment'])->get();
        
        $csv = "ID,Student Name,Assignment,Grade,Date\n";
        foreach ($grades as $grade) {
            $csv .= "{$grade->id},{$grade->user->name},{$grade->assignment->title},{$grade->grade},{$grade->created_at}\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="grades.csv"',
        ]);
    }

    public function gradeReport()
    {
        $grades = \App\Models\Grade::with(['user', 'assignment'])->get()
            ->groupBy('user_id')
            ->map(function ($userGrades) {
                $total = $userGrades->count();
                $average = $userGrades->avg('grade');
                return [
                    'student_name' => $userGrades->first()->user->name,
                    'total_assignments' => $total,
                    'average_grade' => $average ? round($average, 2) : 0,
                    'grades' => $userGrades->map(function($grade) {
                        return [
                            'assignment' => $grade->assignment->title,
                            'grade' => $grade->grade,
                            'date' => $grade->created_at->format('Y-m-d'),
                        ];
                    }),
                ];
            });

        return response()->json($grades);
    }
}
