<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController
{
    public function login(Request $request)
    {
        // Enhanced validation with security rules
        $validated = $request->validate([
            'email' => 'required|email|max:255|regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',
            'password' => 'required|string|min:6|max:255',
        ]);

        // Rate limiting per email
        $emailKey = 'login_attempts:' . $validated['email'];
        if (\Illuminate\Support\Facades\RateLimiter::tooManyAttempts($emailKey, 3)) {
            \Illuminate\Support\Facades\Log::warning('Account login rate limited', [
                'email' => $validated['email'],
                'ip' => $request->ip()
            ]);
            
            return response()->json([
                'message' => 'Too many login attempts for this account. Please try again in 30 minutes.',
                'error' => 'ACCOUNT_RATE_LIMITED'
            ], 429);
        }

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            // Hit rate limiter on failed attempt
            \Illuminate\Support\Facades\RateLimiter::hit($emailKey, 1800); // 30 minutes
            
            \Illuminate\Support\Facades\Log::warning('Failed login attempt', [
                'email' => $validated['email'],
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);
            
            return response()->json([
                'message' => 'Invalid credentials',
                'error' => 'INVALID_CREDENTIALS'
            ], 401);
        }

        // Clear rate limiting on successful login
        \Illuminate\Support\Facades\RateLimiter::clear($emailKey);
        
        // Log successful login
        \Illuminate\Support\Facades\Log::info('Successful login', [
            'user_id' => $user->id,
            'email' => $user->email,
            'ip' => $request->ip()
        ]);

        $token = $user->createToken('secure-api-token', ['*'], now()->addHours(24))->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'student_id' => $user->student_id,
            ],
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'student_id' => $user->student_id,
        ]);
    }
}
