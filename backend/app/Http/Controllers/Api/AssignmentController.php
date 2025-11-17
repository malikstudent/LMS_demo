<?php

namespace App\Http\Controllers\Api;

use App\Models\Assignment;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AssignmentController
{
    public function listByClass($classId)
    {
        $class = Classroom::findOrFail($classId);

        $assignments = $class->assignments()
            ->with('teacher')
            ->orderBy('due_date', 'desc')
            ->get()
            ->map(function ($assignment) {
                return [
                    'id' => $assignment->id,
                    'title' => $assignment->title,
                    'description' => $assignment->description,
                    'file_path' => $assignment->file_path,
                    'due_date' => $assignment->due_date,
                    'teacher' => [
                        'id' => $assignment->teacher->id,
                        'name' => $assignment->teacher->name,
                    ],
                ];
            });

        return response()->json($assignments);
    }

    public function store(Request $request, $classId)
    {
        $user = Auth::user();

        // Check if user is teacher
        if ($user->role !== 'guru') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|file|max:10240',
            'due_date' => 'required|date',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('assignments', 'public');
        }

        $assignment = Assignment::create([
            'teacher_id' => $user->id,
            'class_id' => $classId,
            'subject_id' => $validated['subject_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'file_path' => $filePath,
            'due_date' => $validated['due_date'],
        ]);

        return response()->json([
            'id' => $assignment->id,
            'title' => $assignment->title,
            'description' => $assignment->description,
            'file_path' => $assignment->file_path,
            'due_date' => $assignment->due_date,
        ], 201);
    }

    public function submit(Request $request, $assignmentId)
    {
        $user = Auth::user();

        if ($user->role !== 'siswa') {
            return response()->json(['message' => 'Only students can submit'], 403);
        }

        $validated = $request->validate([
            'file' => 'required|file|max:10240',
        ]);

        $filePath = $request->file('file')->store('assignments', 'public');

        $submission = Submission::updateOrCreate(
            [
                'assignment_id' => $assignmentId,
                'student_id' => $user->id,
            ],
            [
                'file_path' => $filePath,
                'submitted_at' => now(),
            ]
        );

        return response()->json([
            'id' => $submission->id,
            'assignment_id' => $submission->assignment_id,
            'submitted_at' => $submission->submitted_at,
            'score' => $submission->score,
        ]);
    }

    public function grade(Request $request, $submissionId)
    {
        $user = Auth::user();

        if ($user->role !== 'guru') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'score' => 'required|integer|min:0|max:100',
            'feedback' => 'nullable|string',
        ]);

        $submission = Submission::findOrFail($submissionId);

        $submission->update([
            'score' => $validated['score'],
            'feedback' => $validated['feedback'],
        ]);

        // Create or update grade
        $submission->grade()->updateOrCreate(
            ['submission_id' => $submission->id],
            [
                'score' => $validated['score'],
                'graded_by' => $user->id,
                'graded_at' => now(),
            ]
        );

        return response()->json([
            'id' => $submission->id,
            'score' => $submission->score,
            'feedback' => $submission->feedback,
        ]);
    }
}
