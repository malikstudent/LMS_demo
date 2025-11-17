<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function classes()
    {
        return $this->belongsToMany(Classroom::class, 'class_subject');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'subject_id');
    }
}
