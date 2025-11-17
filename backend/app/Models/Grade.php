<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'submission_id',
        'score',
        'graded_by',
        'graded_at',
    ];

    protected $casts = [
        'graded_at' => 'datetime',
    ];

    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    public function gradedBy()
    {
        return $this->belongsTo(User::class, 'graded_by');
    }
}
