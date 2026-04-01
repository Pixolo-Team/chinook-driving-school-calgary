<?php
declare(strict_types=1);

/**
 * General-purpose utility helpers for the Chinook enrollment backend.
 *
 * Provides response formatting, JSON input parsing, string/date/email/phone
 * validation, sanitization, and age calculation.
 */

/**
 * Send a JSON response with the given HTTP status code and terminate execution.
 *
 * @param int   $statusCode HTTP status code to send (e.g. 200, 400, 422, 500).
 * @param array $payload    Associative array that will be JSON-encoded as the response body.
 *
 * @return void  This function never returns; it calls exit after writing the response.
 */
function respond(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Read and decode the raw JSON request body from php://input.
 *
 * Responds with HTTP 400 and terminates if the body is empty or not valid JSON.
 *
 * @return array Decoded JSON body as an associative array.
 */
function getJsonInput(): array
{
    // Read raw POST body
    $raw = file_get_contents('php://input');
    if (!$raw) {
        respond(400, ['success' => false, 'message' => 'Empty request body']);
    }

    // Decode JSON and ensure it is an associative array
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        respond(400, ['success' => false, 'message' => 'Invalid JSON body']);
    }

    return $decoded;
}

/**
 * Check whether a value is a non-empty string (after trimming whitespace).
 *
 * @param mixed $value The value to test.
 *
 * @return bool True if $value is a string with at least one non-whitespace character.
 */
function isNonEmptyString($value): bool
{
    return is_string($value) && trim($value) !== '';
}

/**
 * Trim a string value and return null when the result is empty.
 *
 * @param string|null $value The raw string value, or null.
 *
 * @return string|null The trimmed string, or null if the input was null or whitespace-only.
 */
function sanitizeString(?string $value): ?string
{
    if ($value === null) {
        return null;
    }

    // Trim surrounding whitespace; treat blank strings as absent
    $value = trim($value);
    return $value === '' ? null : $value;
}

/**
 * Validate that the given value is a syntactically correct email address.
 *
 * @param string|null $email The email address to validate.
 *
 * @return bool True if $email passes PHP's FILTER_VALIDATE_EMAIL check.
 */
function isValidEmail(?string $email): bool
{
    return is_string($email) && filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate that a string represents a calendar date in Y-m-d format.
 *
 * Ensures the value is not only parseable but also round-trips back to the
 * same string (e.g. "2024-02-30" would be rejected).
 *
 * @param string|null $date The date string to validate.
 *
 * @return bool True if the string is a valid Y-m-d date.
 */
function isValidDate(?string $date): bool
{
    if (!is_string($date) || trim($date) === '') {
        return false;
    }

    // Create from format and verify the string round-trips to confirm a real date
    $dt = DateTime::createFromFormat('Y-m-d', $date);
    return $dt && $dt->format('Y-m-d') === $date;
}

/**
 * Calculate the age (in whole years) for a given date-of-birth string.
 *
 * @param string $dateOfBirth Date of birth in any format accepted by DateTime (e.g. Y-m-d).
 *
 * @return int Age in completed years relative to today.
 */
function calculateAge(string $dateOfBirth): int
{
    $dob   = new DateTime($dateOfBirth);
    $today = new DateTime('today');
    return (int)$dob->diff($today)->y;
}

/**
 * Normalize a phone number string by collapsing internal whitespace.
 *
 * Returns null for null or whitespace-only inputs so callers can store a
 * clean nullable value.
 *
 * @param string|null $phone Raw phone number string.
 *
 * @return string|null Whitespace-normalized phone number, or null if absent.
 */
function normalizePhone(?string $phone): ?string
{
    if ($phone === null) {
        return null;
    }

    // Remove leading/trailing whitespace first
    $trimmed = trim($phone);
    if ($trimmed === '') {
        return null;
    }

    // Collapse any internal whitespace sequences to a single space
    return preg_replace('/\s+/', ' ', $trimmed);
}

/**
 * Check whether a value is a valid non-negative numeric amount.
 *
 * Accepts integers, floats, and numeric strings.
 *
 * @param mixed $value The value to test.
 *
 * @return bool True if the value is numeric and greater than or equal to zero.
 */
function isValidAmount($value): bool
{
    return is_numeric($value) && (float)$value >= 0;
}

/**
 * Validate a credit/debit card number by stripping non-digits and checking length.
 *
 * Accepts card numbers between 12 and 19 digits (covers most card networks).
 *
 * @param string|null $cardNumber The card number to validate (may contain spaces/dashes).
 *
 * @return bool True if the digit-only representation is between 12 and 19 characters long.
 */
function isValidCardNumber(?string $cardNumber): bool
{
    if (!is_string($cardNumber)) {
        return false;
    }

    // Strip all non-digit characters then check digit length
    $digits = preg_replace('/\D/', '', $cardNumber);
    return strlen($digits) >= 12 && strlen($digits) <= 19;
}
