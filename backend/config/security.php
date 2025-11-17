<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Security Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains security settings for the LMS application
    |
    */

    'rate_limiting' => [
        'login_attempts' => [
            'max_attempts' => 3,
            'decay_minutes' => 30,
        ],
        'api_requests' => [
            'max_attempts' => 60,
            'decay_minutes' => 1,
        ],
        'security_violations' => [
            'max_attempts' => 5,
            'decay_minutes' => 60,
        ],
    ],

    'input_validation' => [
        'max_string_length' => 1000,
        'allowed_file_types' => ['pdf', 'doc', 'docx', 'jpg', 'png', 'gif'],
        'max_file_size' => 10240, // 10MB in KB
    ],

    'security_headers' => [
        'x_frame_options' => 'DENY',
        'x_content_type_options' => 'nosniff',
        'x_xss_protection' => '1; mode=block',
        'referrer_policy' => 'strict-origin-when-cross-origin',
        'content_security_policy' => "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
    ],

    'logging' => [
        'log_failed_logins' => true,
        'log_security_violations' => true,
        'log_suspicious_activity' => true,
        'retention_days' => 90,
    ],

    'demo_mode' => [
        'enabled' => env('DEMO_MODE', false),
        'credentials_visible' => false, // Never show credentials in UI
        'reset_interval_hours' => 24, // Reset demo data every 24 hours
    ],

    'password_policy' => [
        'min_length' => 8,
        'require_uppercase' => true,
        'require_lowercase' => true,
        'require_numbers' => true,
        'require_symbols' => false,
    ],
];