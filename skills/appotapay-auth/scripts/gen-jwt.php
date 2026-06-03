<?php
// Generate an AppotaPay X-APPOTAPAY-AUTH JWT (HS256).
//   composer require firebase/php-jwt
//   APPOTAPAY_PARTNER_CODE=... APPOTAPAY_API_KEY=... APPOTAPAY_SECRET_KEY=... php gen-jwt.php

require __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;

/**
 * Build the signed JWT for the X-APPOTAPAY-AUTH header.
 */
function build_appotapay_jwt(string $partnerCode, string $apiKey, string $secretKey, int $ttlSeconds = 300): string
{
    if ($partnerCode === '' || $apiKey === '' || $secretKey === '') {
        throw new InvalidArgumentException('partnerCode, apiKey and secretKey are required');
    }
    $now = time();
    $payload = [
        'iss'     => $partnerCode,
        'jti'     => $apiKey . '-' . $now,
        'api_key' => $apiKey,
        'exp'     => $now + $ttlSeconds,
    ];
    // 4th arg = kid (null), 5th arg = extra header fields.
    return JWT::encode($payload, $secretKey, 'HS256', null, ['cty' => 'appotapay-api;v=1']);
}

if (PHP_SAPI === 'cli' && realpath($argv[0]) === __FILE__) {
    echo build_appotapay_jwt(
        getenv('APPOTAPAY_PARTNER_CODE') ?: '',
        getenv('APPOTAPAY_API_KEY') ?: '',
        getenv('APPOTAPAY_SECRET_KEY') ?: ''
    ) . PHP_EOL;
}
