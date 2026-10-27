<?php
declare(strict_types=1);

/**
 * CLI diagnostic for the enrollment confirmation mailer.
 *
 * Usage: php mail-test.php you@example.com
 *
 * Runs the exact production mail path and prints the transport result,
 * including the SMTP error when delivery fails.
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require_once __DIR__ . '/helper/utils.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helper/mailer.php';

$recipient = $argv[1] ?? '';

if (!isValidEmail($recipient)) {
    fwrite(STDERR, "Usage: php mail-test.php you@example.com\n");
    exit(1);
}

try {
    $result = sendEnrollmentConfirmationEmail(['student_email' => $recipient]);
} catch (Throwable $throwable) {
    fwrite(STDERR, 'Mailer threw: ' . $throwable->getMessage() . PHP_EOL);
    exit(1);
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), PHP_EOL;

exit($result['sent'] ? 0 : 1);
