<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SubjectController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Attendance
    Route::post('/attendance/checkin', [AttendanceController::class, 'checkin']);
    Route::get('/attendance/my', [AttendanceController::class, 'myAttendance']);

    // Subjects
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::post('/subjects', [SubjectController::class, 'store']);

    // Announcements
    Route::get('/announcements', [AnnouncementController::class, 'index']);
    Route::post('/announcements', [AnnouncementController::class, 'store']);

    // Assignments
    Route::get('/classes/{classId}/assignments', [AssignmentController::class, 'listByClass']);
    Route::post('/classes/{classId}/assignments', [AssignmentController::class, 'store']);
    Route::post('/assignments/{assignmentId}/submit', [AssignmentController::class, 'submit']);
    Route::post('/submissions/{submissionId}/grade', [AssignmentController::class, 'grade']);

    // Analytics
    Route::get('/analytics/student/{studentId}/scores', [AnalyticsController::class, 'studentScores']);
    Route::get('/analytics/class/{classId}/attendance', [AnalyticsController::class, 'classAttendance']);

    // Admin
    Route::middleware('role:admin')->group(function () {
        // User Management
        Route::get('/admin/users', [AdminController::class, 'listUsers']);
        Route::post('/admin/users', [AdminController::class, 'createUser']);
        Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
        
        // Class Management
        Route::get('/admin/classes', [AdminController::class, 'listClasses']);
        Route::post('/admin/classes', [AdminController::class, 'createClass']);
        Route::put('/admin/classes/{id}', [AdminController::class, 'updateClass']);
        Route::delete('/admin/classes/{id}', [AdminController::class, 'deleteClass']);
        
        // Subject Management (allow admin to manage subjects)
        Route::put('/subjects/{id}', [SubjectController::class, 'update']);
        Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);
        
        // Announcement Management (allow admin to manage all announcements)
        Route::put('/announcements/{id}', [AnnouncementController::class, 'update']);
        Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);
        
        // Reports
        Route::get('/admin/reports/attendance', [AdminController::class, 'attendanceReport']);
        Route::get('/admin/reports/grades', [AdminController::class, 'gradeReport']);
        Route::get('/admin/dashboard/stats', [AdminController::class, 'dashboardStats']);
        
        // CSV Exports
        Route::get('/admin/export/users', [AdminController::class, 'exportUsers']);
        Route::get('/admin/export/classes', [AdminController::class, 'exportClasses']);
        Route::get('/admin/export/attendance', [AdminController::class, 'exportAttendance']);
        Route::get('/admin/export/grades', [AdminController::class, 'exportGrades']);
    });
});
