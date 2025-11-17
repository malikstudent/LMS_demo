<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;

    protected $table = 'classes';

    protected $fillable = [
        'name',
        'year',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'class_user')
                    ->withPivot('role_in_class')
                    ->withTimestamps();
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'class_subject', 'class_id', 'subject_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'class_id');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'class_id');
    }
}
