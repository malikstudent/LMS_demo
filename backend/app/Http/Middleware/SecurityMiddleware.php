<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;

class SecurityMiddleware
{
    /**
     * Handle an incoming request with security checks
     */
    public function handle(Request $request, Closure $next)
    {
        // Rate limiting by IP
        $key = 'security_attempts:' . $request->ip();
        
        if (RateLimiter::tooManyAttempts($key, 10)) { // 10 attempts per minute
            return response()->json([
                'message' => 'Too many requests. Please try again later.',
                'error' => 'RATE_LIMITED'
            ], 429);
        }

        RateLimiter::hit($key, 60); // 1 minute window

        // Input sanitization and validation
        $this->sanitizeInput($request);

        // Block common attack patterns
        if ($this->detectMaliciousInput($request)) {
            // Log security incident
            logger()->warning('Security threat detected', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl(),
                'payload' => $request->all()
            ]);

            return response()->json([
                'message' => 'Invalid request detected.',
                'error' => 'SECURITY_VIOLATION'
            ], 400);
        }

        return $next($request);
    }

    /**
     * Sanitize request input
     */
    private function sanitizeInput(Request $request)
    {
        $input = $request->all();
        
        array_walk_recursive($input, function (&$value) {
            if (is_string($value)) {
                // Remove potential XSS
                $value = strip_tags($value);
                $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
            }
        });

        $request->replace($input);
    }

    /**
     * Detect malicious input patterns
     */
    private function detectMaliciousInput(Request $request): bool
    {
        $input = json_encode($request->all());
        
        // SQL Injection patterns
        $sqlPatterns = [
            '/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i',
            '/(\b(OR|AND)\s+\d+\s*=\s*\d+)/i',
            '/[\'"][\s]*;[\s]*--/',
            '/\bunion\b.*\bselect\b/i',
            '/\b(exec|execute)\s*\(/i'
        ];

        // XSS patterns
        $xssPatterns = [
            '/<script[^>]*>.*?<\/script>/i',
            '/javascript:/i',
            '/on\w+\s*=/i',
            '/<iframe[^>]*>/i',
            '/expression\s*\(/i'
        ];

        // Directory traversal
        $traversalPatterns = [
            '/\.\.\//',
            '/\.\.\\\\/',
            '/\.\.\%2f/i',
            '/\.\.\%5c/i'
        ];

        $allPatterns = array_merge($sqlPatterns, $xssPatterns, $traversalPatterns);

        foreach ($allPatterns as $pattern) {
            if (preg_match($pattern, $input)) {
                return true;
            }
        }

        return false;
    }
}