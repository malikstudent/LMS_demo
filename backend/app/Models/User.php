<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'student_id',
        'profile',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'profile' => 'json',
    ];

    public function classes()
    {
        return $this->belongsToMany(Classroom::class, 'class_user')
                    ->withPivot('role_in_class')
                    ->withTimestamps();
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class, 'student_id');
    }

    public function assignmentsAsTeacher()
    {
        return $this->hasMany(Assignment::class, 'teacher_id');
    }

    public function grades()
    {
        return $this->hasMany(Grade::class, 'graded_by');
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isTeacher()
    {
        return $this->role === 'guru';
    }

    public function isStudent()
    {
        return $this->role === 'siswa';
    }
}
