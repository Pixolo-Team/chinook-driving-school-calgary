<?php
declare(strict_types=1);

/**
 * Chinook Contact Form Endpoint
 * Core PHP + Supabase REST API
 *
 * Accepts a single POST request with a JSON body describing a contact
 * form submission, validates required fields, then inserts a row into
 * the CONTACT_REQUESTS table in Supabase.
 *
 * Required constants (defined below):
 * - SUPABASE_URL               – base URL of your Supabase project
 * - SUPABASE_SERVICE_ROLE_KEY  – service-role secret key
 *
 * Expected HTTP method: POST
 * Expected Content-Type: application/json
 *
 * Request body:
 * {
 *   name:           string  (required)
 *   email:          string  (required, valid email format)
 *   contact_number: string  (required, valid contact number)
 *   query:          string  (required)
 *   reason:         string  (optional)
 * }
 *
 * Response body:
 * {
 *   status:      boolean
 *   status_code: number
 *   data:        boolean
 *   message:     string
 *   error:       string
 * }
 */

// ---------------------------------------------------------------------------
// Bootstrap: response headers & helper includes
// ---------------------------------------------------------------------------

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/helper/utils.php';
require_once __DIR__ . '/helper/supabase.php';

// ---------------------------------------------------------------------------
// Configuration: Supabase credentials and table names
// ---------------------------------------------------------------------------

const SUPABASE_URL              = 'https://rwosruoldgimytqwdkwg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3b3NydW9sZGdpbXl0cXdka3dnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgzNjI2MSwiZXhwIjoyMDkwNDEyMjYxfQ.Cy9CHcQhqM1_fgPsIofIVS8ivTn50LSBEola2OgADR0';

const CONTACT_REQUESTS_TABLE = 'contact_requests';

// ---------------------------------------------------------------------------
// Step 1: Reject non-POST requests early
// ---------------------------------------------------------------------------

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, [
        'status'      => false,
        'status_code' => 405,
        'data'        => false,
        'message'     => 'Method Not Allowed',
        'error'       => 'Only POST requests are accepted',
    ]);
}

// ---------------------------------------------------------------------------
// Step 2: Read and decode the request body
// ---------------------------------------------------------------------------

/**
 * Accept both JSON and simple form submissions.
 *
 * Supporting URL-encoded form data lets the frontend submit a "simple request",
 * which avoids a CORS preflight in browsers during local development.
 */
$contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));

if ($contentType === 'application/json' || $contentType === 'text/plain') {
    $input = getJsonInput();
} elseif ($contentType === 'application/x-www-form-urlencoded' || $contentType === 'multipart/form-data') {
    $input = $_POST;
} else {
    $rawInput = file_get_contents('php://input');
    $decodedInput = json_decode($rawInput ?: '', true);

    if (is_array($decodedInput)) {
        $input = $decodedInput;
    } elseif (!empty($_POST)) {
        $input = $_POST;
    } else {
        respond(415, [
            'status'      => false,
            'status_code' => 415,
            'data'        => false,
            'message'     => 'Unsupported Media Type',
            'error'       => 'Send JSON or form-encoded data',
        ]);
    }
}

// ---------------------------------------------------------------------------
// Step 3: Validate required fields
// ---------------------------------------------------------------------------

$errors = [];

/**
 * Validate and sanitize a field that must be a string (or null for optional fields).
 */
$readSanitizedString = static function (array $source, string $field, array &$validationErrors, bool $required = true): ?string {
    if (!array_key_exists($field, $source) || $source[$field] === null) {
        if ($required) {
            $validationErrors[] = "{$field} is required";
        }
        return null;
    }

    if (!is_string($source[$field])) {
        $validationErrors[] = "{$field} must be a string";
        return null;
    }

    $sanitized = sanitizeString($source[$field]);

    if ($required && $sanitized === null) {
        $validationErrors[] = "{$field} is required";
    }

    return $sanitized;
};

// name – required, must be a non-empty string
$name = $readSanitizedString($input, 'name', $errors);

// email – required, must be a valid email address
$email = $readSanitizedString($input, 'email', $errors);
if ($email !== null && !isValidEmail($email)) {
    $errors[] = 'email is invalid';
}

// contact_number – required, must be a non-empty string
$contactNumber = $readSanitizedString($input, 'contact_number', $errors);

// query – required, must be a non-empty string
$query = $readSanitizedString($input, 'query', $errors);

if (!empty($errors)) {
    respond(422, [
        'status'      => false,
        'status_code' => 422,
        'data'        => false,
        'message'     => 'Validation failed',
        'error'       => implode('; ', $errors),
    ]);
}

// ---------------------------------------------------------------------------
// Step 4: Collect optional fields
// ---------------------------------------------------------------------------

$reason = $readSanitizedString($input, 'reason', $errors, false) ?? '';

if (!empty($errors)) {
    respond(422, [
        'status'      => false,
        'status_code' => 422,
        'data'        => false,
        'message'     => 'Validation failed',
        'error'       => implode('; ', $errors),
    ]);
}

// ---------------------------------------------------------------------------
// Step 5: Build payload and insert into Supabase
// ---------------------------------------------------------------------------

$row = [
    'name'           => $name,
    'email'          => $email,
    'contact_number' => $contactNumber,
    'query'          => $query,
    'reason'         => $reason,
    'source'         => 'website',
    'created_at'     => (new DateTime('now', new DateTimeZone('UTC')))->format('Y-m-d\TH:i:s\Z'),
];

$result = supabaseInsert(CONTACT_REQUESTS_TABLE, $row);

if (!$result['ok']) {
    respond(500, [
        'status'      => false,
        'status_code' => 500,
        'data'        => false,
        'message'     => 'Failed to submit contact request',
        'error'       => 'Database error',
    ]);
}

// ---------------------------------------------------------------------------
// Step 6: Return success response
// ---------------------------------------------------------------------------

respond(201, [
    'status'      => true,
    'status_code' => 201,
    'data'        => true,
    'message'     => 'Contact request submitted successfully',
    'error'       => '',
]);
