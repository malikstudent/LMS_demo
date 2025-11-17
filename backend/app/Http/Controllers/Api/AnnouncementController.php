<?php

namespace App\Http\Controllers\Api;

use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController
{
    public function index()
    {
        $announcements = Announcement::where('start_at', '<=', now())
            ->where('end_at', '>=', now())
            ->orderBy('start_at', 'desc')
            ->get();

        return response()->json($announcements);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after:start_at',
            'type' => 'required|string',
            'meta' => 'nullable|array',
        ]);

        $announcement = Announcement::create($validated);

        return response()->json($announcement, 201);
    }
}
