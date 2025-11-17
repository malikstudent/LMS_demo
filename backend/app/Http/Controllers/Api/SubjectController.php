<?php

namespace App\Http\Controllers\Api;

use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController
{
    public function index()
    {
        $subjects = Subject::all();

        return response()->json($subjects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:subjects',
        ]);

        $subject = Subject::create($validated);

        return response()->json($subject, 201);
    }
}
