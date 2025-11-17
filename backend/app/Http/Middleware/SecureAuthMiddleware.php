<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;

class SecureAuthMiddleware
{
    /**
     * Handle an incoming request with enhanced authentication security
     */
    public function handle(Request $request, Closure $next, ...$guards)
    {
        $ip = $request->ip();
        $userAgent = $request->userAgent();
        
        // Rate limiting for authentication attempts
        $authKey = 'auth_attempts:' . $ip;
        
        if (RateLimiter::tooManyAttempts($authKey, 5)) { // 5 attempts per 15 minutes
            logger()->warning('Authentication rate limit exceeded', [
                'ip' => $ip,
                'user_agent' => $userAgent
            ]);
            
            return response()->json([
                'message' => 'Too many login attempts. Please try again in 15 minutes.',
                'error' => 'AUTH_RATE_LIMITED'
            ], 429);
        }

        // Check for suspicious user agents
        if ($this->isSuspiciousUserAgent($userAgent)) {
            logger()->warning('Suspicious user agent detected', [
                'ip' => $ip,
                'user_agent' => $userAgent
            ]);
            
            return response()->json([
                'message' => 'Access denied.',
                'error' => 'SUSPICIOUS_CLIENT'
            ], 403);
        }

        // Validate authentication
        $this->authenticate($request, $guards);
        
        // Log successful authentication
        if (Auth::check()) {
            logger()->info('Successful authentication', [
                'user_id' => Auth::id(),
                'email' => Auth::user()->email,
                'ip' => $ip,
                'user_agent' => substr($userAgent, 0, 100)
            ]);
        }

        return $next($request);
    }

    /**
     * Determine if the user is logged in to any of the given guards
     */
    protected function authenticate($request, array $guards)
    {
        if (empty($guards)) {
            $guards = [null];
        }

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                return Auth::shouldUse($guard);
            }
        }

        // Hit rate limiter on failed auth
        $authKey = 'auth_attempts:' . $request->ip();
        RateLimiter::hit($authKey, 900); // 15 minutes

        logger()->warning('Authentication failed', [
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'url' => $request->fullUrl()
        ]);

        throw new \Illuminate\Auth\AuthenticationException('Unauthenticated.', $guards);
    }

    /**
     * Check for suspicious user agents (bots, scanners, etc.)
     */
    private function isSuspiciousUserAgent(?string $userAgent): bool
    {
        if (empty($userAgent)) {
            return true;
        }

        $suspiciousPatterns = [
            '/bot/i',
            '/crawler/i',
            '/spider/i',
            '/scanner/i',
            '/sqlmap/i',
            '/nmap/i',
            '/nikto/i',
            '/burp/i',
            '/w3af/i',
            '/owasp/i'
        ];

        foreach ($suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $userAgent)) {
                return true;
            }
        }

        return false;
    }
}