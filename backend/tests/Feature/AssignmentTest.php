<?php

namespace Tests\Feature;

use App\Models\Assignment;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AssignmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_can_create_assignment(): void
    {
        Storage::fake('public');

        $teacher = User::factory()->guru()->create();
        $class = Classroom::factory()->create();
        $subject = Subject::factory()->create();

        $token = $teacher->createToken('api-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson("/api/classes/{$class->id}/assignments", [
            'subject_id' => $subject->id,
            'title' => 'Test Assignment',
            'description' => 'This is a test assignment',
            'file' => UploadedFile::fake()->create('document.pdf', 100),
            'due_date' => now()->addDays(7)->toDateTimeString(),
        ]);

        $response->assertStatus(201)
                ->assertJsonStructure(['id', 'title', 'due_date']);

        $this->assertDatabaseHas('assignments', [
            'title' => 'Test Assignment',
            'teacher_id' => $teacher->id,
        ]);
    }

    public function test_student_can_submit_assignment(): void
    {
        Storage::fake('public');

        $student = User::factory()->siswa()->create();
        $assignment = Assignment::factory()->create();

        $token = $student->createToken('api-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson("/api/assignments/{$assignment->id}/submit", [
            'file' => UploadedFile::fake()->create('submission.pdf', 100),
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure(['id', 'assignment_id', 'submitted_at']);

        $this->assertDatabaseHas('submissions', [
            'assignment_id' => $assignment->id,
            'student_id' => $student->id,
        ]);
    }

    public function test_teacher_can_grade_submission(): void
    {
        $teacher = User::factory()->guru()->create();
        $student = User::factory()->siswa()->create();
        $assignment = Assignment::factory()->create(['teacher_id' => $teacher->id]);
        $submission = \App\Models\Submission::factory()->create([
            'assignment_id' => $assignment->id,
            'student_id' => $student->id,
        ]);

        $token = $teacher->createToken('api-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson("/api/submissions/{$submission->id}/grade", [
            'score' => 85,
            'feedback' => 'Great work!',
        ]);

        $response->assertStatus(200)
                ->assertJson(['score' => 85]);

        $this->assertDatabaseHas('submissions', [
            'id' => $submission->id,
            'score' => 85,
        ]);
    }
}
