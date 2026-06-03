<?php
// Verify an AppotaPay IPN / redirect callback and decode the transaction. No dependencies.
//
//   require 'verify-ipn.php';
//   [$ok, $payload] = verify_appotapay_callback(['data' => $data, 'signature' => $signature], $secretKey);

/**
 * @return array{0: bool, 1: array|null}  [ok, payload]
 */
function verify_appotapay_callback(array $body, string $secretKey): array
{
    $data = $body['data'] ?? null;
    $signature = $body['signature'] ?? null;
    if (!is_string($data) || !is_string($signature)) {
        return [false, null];
    }

    // Sign the RAW data string, exactly as received.
    $expected = hash_hmac('sha256', $data, $secretKey);
    if (!hash_equals($expected, $signature)) { // constant-time
        return [false, null];
    }

    $payload = json_decode(base64_decode($data), true);
    return [true, $payload];
}

// --- Example raw IPN handler -------------------------------------------------
// $body = json_decode(file_get_contents('php://input'), true);
// [$ok, $payload] = verify_appotapay_callback($body, getenv('APPOTAPAY_SECRET_KEY'));
// if (!$ok) { http_response_code(400); echo json_encode(['status' => 'invalid signature']); exit; }
// $t = $payload['transaction'];
// if ($t['status'] === 'success' && (int)$t['orderAmount'] === expected_amount($payload['partnerReference']['order']['id'])) {
//     fulfill_once($payload['partnerReference']['order']['id']); // idempotent!
// }
// http_response_code(200);
// echo json_encode(['status' => 'ok']); // always ack so retries stop

// --- CLI smoke test: echo '{"data":"...","signature":"..."}' | php verify-ipn.php
if (PHP_SAPI === 'cli' && realpath($argv[0]) === __FILE__) {
    $body = json_decode(file_get_contents('php://stdin'), true);
    [$ok, $payload] = verify_appotapay_callback($body, getenv('APPOTAPAY_SECRET_KEY') ?: '');
    echo json_encode(['ok' => $ok, 'payload' => $payload], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
    exit($ok ? 0 : 1);
}
