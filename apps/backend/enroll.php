<?php
declare(strict_types=1);

/**
 * Chinook Enrollment Endpoint
 * Core PHP + Supabase REST API
 *
 * Required env/config:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 *
 * Expected method:
 * - POST
 */

header('Content-Type: application/json');

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'YOUR_SUPABASE_SERVICE_ROLE_KEY';

// Table Names
const STUDENTS_TABLE = 'students';
const ENROLLMENTS_TABLE = 'enrollments';
const PAYMENTS_TABLE = 'payments';
const CARD_INFORMATION_TABLE = 'card_information';
const AVAILABILITY_SLOTS_TABLE = 'availability_slots';

/**
 * ===== Utility functions =====
 */

function respond(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonInput(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        respond(400, ['success' => false, 'message' => 'Empty request body']);
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        respond(400, ['success' => false, 'message' => 'Invalid JSON body']);
    }

    return $decoded;
}

function isNonEmptyString($value): bool
{
    return is_string($value) && trim($value) !== '';
}

function sanitizeString(?string $value): ?string
{
    if ($value === null) {
        return null;
    }
    $value = trim($value);
    return $value === '' ? null : $value;
}

function isValidEmail(?string $email): bool
{
    return is_string($email) && filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function isValidDate(?string $date): bool
{
    if (!is_string($date) || trim($date) === '') {
        return false;
    }

    $dt = DateTime::createFromFormat('Y-m-d', $date);
    return $dt && $dt->format('Y-m-d') === $date;
}

function calculateAge(string $dateOfBirth): int
{
    $dob = new DateTime($dateOfBirth);
    $today = new DateTime('today');
    return (int)$dob->diff($today)->y;
}

function normalizePhone(?string $phone): ?string
{
    if ($phone === null) {
        return null;
    }

    $trimmed = trim($phone);
    if ($trimmed === '') {
        return null;
    }

    return preg_replace('/\s+/', ' ', $trimmed);
}

function isValidAmount($value): bool
{
    return is_numeric($value) && (float)$value >= 0;
}

function isValidCardNumber(?string $cardNumber): bool
{
    if (!is_string($cardNumber)) {
        return false;
    }

    $digits = preg_replace('/\D/', '', $cardNumber);
    return strlen($digits) >= 12 && strlen($digits) <= 19;
}

function supabaseRequest(
    string $method,
    string $endpoint,
    ?array $body = null,
    array $extraHeaders = []
): array {
    $url = rtrim(SUPABASE_URL, '/') . $endpoint;

    $headers = array_merge([
        'apikey: ' . SUPABASE_SERVICE_ROLE_KEY,
        'Authorization: Bearer ' . SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type: application/json',
    ], $extraHeaders);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    }

    $responseBody = curl_exec($ch);
    $curlError = curl_error($ch);
    $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($curlError) {
        return [
            'ok' => false,
            'status' => 500,
            'data' => null,
            'error' => 'cURL error: ' . $curlError
        ];
    }

    $decoded = null;
    if ($responseBody !== '' && $responseBody !== null) {
        $decoded = json_decode($responseBody, true);
    }

    $ok = $httpCode >= 200 && $httpCode < 300;

    return [
        'ok' => $ok,
        'status' => $httpCode,
        'data' => $decoded,
        'raw' => $responseBody,
        'error' => $ok ? null : ($decoded['message'] ?? $decoded['hint'] ?? $responseBody ?? 'Supabase request failed')
    ];
}

function supabaseInsert(string $table, array $row): array
{
    $endpoint = '/rest/v1/' . $table;
    return supabaseRequest(
        'POST',
        $endpoint,
        $row,
        ['Prefer: return=representation']
    );
}

function supabaseDeleteById(string $table, string $id): void
{
    $endpoint = '/rest/v1/' . $table . '?id=eq.' . rawurlencode($id);
    supabaseRequest('DELETE', $endpoint, null, ['Prefer: return=minimal']);
}

function requireField(array $data, string $key, array &$errors, string $message = null): void
{
    if (!array_key_exists($key, $data) || $data[$key] === null || $data[$key] === '') {
        $errors[$key] = $message ?? ($key . ' is required');
    }
}

/**
 * ===== Request validation =====
 */

$input = getJsonInput();
$errors = [];

/**
 * Top-level required fields
 */
requireField($input, 'session_type', $errors);
requireField($input, 'course', $errors);
requireField($input, 'student_first_name', $errors);
requireField($input, 'student_last_name', $errors);
requireField($input, 'student_address', $errors);
requireField($input, 'student_city', $errors);
requireField($input, 'student_state', $errors);
requireField($input, 'student_postal_code', $errors);
requireField($input, 'student_email', $errors);
requireField($input, 'student_mobile_phone_number', $errors);
requireField($input, 'student_date_of_birth', $errors);
requireField($input, 'license_status', $errors);
requireField($input, 'driving_experience', $errors);
requireField($input, 'availability_date', $errors);
requireField($input, 'avilability_time_slots', $errors);
requireField($input, 'availability_days_of_week', $errors);
requireField($input, 'payment_method', $errors);
requireField($input, 'amount', $errors);
requireField($input, 'did_agree_conditions', $errors, 'did_agree_conditions is required');

/**
 * Course validation
 */
if (!isset($errors['course'])) {
    if (!is_array($input['course'])) {
        $errors['course'] = 'course must be an object';
    } else {
        $course = $input['course'];
        if (!isset($course['course_id']) || !is_numeric($course['course_id'])) {
            $errors['course.course_id'] = 'course.course_id is required and must be numeric';
        }
        if (!isset($course['course_price']) || !isValidAmount($course['course_price'])) {
            $errors['course.course_price'] = 'course.course_price is required and must be a non-negative number';
        }
        if (!isset($course['tax_amount']) || !isValidAmount($course['tax_amount'])) {
            $errors['course.tax_amount'] = 'course.tax_amount is required and must be a non-negative number';
        }
        if (!isset($course['total_amount']) || !isValidAmount($course['total_amount'])) {
            $errors['course.total_amount'] = 'course.total_amount is required and must be a non-negative number';
        }

        if (
            isset($course['course_price'], $course['tax_amount'], $course['total_amount']) &&
            is_numeric($course['course_price']) &&
            is_numeric($course['tax_amount']) &&
            is_numeric($course['total_amount'])
        ) {
            $expectedTotal = round((float)$course['course_price'] + (float)$course['tax_amount'], 2);
            $providedTotal = round((float)$course['total_amount'], 2);

            if ($expectedTotal !== $providedTotal) {
                $errors['course.total_amount'] = 'course.total_amount must equal course_price + tax_amount';
            }
        }
    }
}

/**
 * Simple type/format validation
 */
if (isset($input['student_email']) && !isValidEmail($input['student_email'])) {
    $errors['student_email'] = 'student_email is invalid';
}

if (isset($input['parent_email']) && $input['parent_email'] !== null && $input['parent_email'] !== '' && !isValidEmail($input['parent_email'])) {
    $errors['parent_email'] = 'parent_email is invalid';
}

if (isset($input['student_date_of_birth']) && !isValidDate($input['student_date_of_birth'])) {
    $errors['student_date_of_birth'] = 'student_date_of_birth must be in Y-m-d format';
}

if (isset($input['availability_date']) && !isValidDate($input['availability_date'])) {
    $errors['availability_date'] = 'availability_date must be in Y-m-d format';
}

if (isset($input['expiry_date']) && $input['expiry_date'] !== null && $input['expiry_date'] !== '' && !isValidDate($input['expiry_date'])) {
    $errors['expiry_date'] = 'expiry_date must be in Y-m-d format';
}

/**
 * Enum validation
 * Replace these allowed values with your exact DB enum values.
 */
$allowedSessionTypes = ['CURRENT_SESSION', 'NEXT_SESSION', 'FUTURE_SESSION'];
$allowedLicenseStatuses = ['NO_LICENSE_YET', 'LEARNER', 'CLASS_5', 'FULLY_LICENSED', 'OTHER'];
$allowedLicenseRegions = ['AB', 'BC', 'SK', 'MB', 'ON', 'QC', 'NS', 'NB', 'PE', 'NL', 'NT', 'NU', 'YT', 'OTHER'];
$allowedLicenseTypes = ['CLASS_7', 'CLASS_5_GDL', 'CLASS_5', 'OTHER'];
$allowedPaymentMethods = ['CREDIT_CARD', 'DEBIT_CARD', 'INTERAC_E_TRANSFER', 'PAY_IN_PERSON'];
$allowedDaysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

if (isset($input['session_type']) && !in_array($input['session_type'], $allowedSessionTypes, true)) {
    $errors['session_type'] = 'Invalid session_type';
}

if (isset($input['license_status']) && !in_array($input['license_status'], $allowedLicenseStatuses, true)) {
    $errors['license_status'] = 'Invalid license_status';
}

if (isset($input['payment_method']) && !in_array($input['payment_method'], $allowedPaymentMethods, true)) {
    $errors['payment_method'] = 'Invalid payment_method';
}

if (!isset($errors['availability_days_of_week'])) {
    if (!is_array($input['availability_days_of_week']) || count($input['availability_days_of_week']) === 0) {
        $errors['availability_days_of_week'] = 'availability_days_of_week must be a non-empty array';
    } else {
        foreach ($input['availability_days_of_week'] as $index => $day) {
            if (!in_array($day, $allowedDaysOfWeek, true)) {
                $errors["availability_days_of_week.$index"] = 'Invalid day value';
            }
        }
    }
}

if (!isset($errors['avilability_time_slots'])) {
    if (!is_array($input['avilability_time_slots']) || count($input['avilability_time_slots']) === 0) {
        $errors['avilability_time_slots'] = 'avilability_time_slots must be a non-empty array';
    } else {
        foreach ($input['avilability_time_slots'] as $index => $slot) {
            if (!is_array($slot)) {
                $errors["avilability_time_slots.$index"] = 'Each time slot must be an object';
                continue;
            }

            if (!isset($slot['start_time']) || !preg_match('/^\d{2}:\d{2}(:\d{2})?$/', (string)$slot['start_time'])) {
                $errors["avilability_time_slots.$index.start_time"] = 'start_time must be HH:MM or HH:MM:SS';
            }

            if (!isset($slot['end_time']) || !preg_match('/^\d{2}:\d{2}(:\d{2})?$/', (string)$slot['end_time'])) {
                $errors["avilability_time_slots.$index.end_time"] = 'end_time must be HH:MM or HH:MM:SS';
            }
        }
    }
}

/**
 * Minor / parent validation
 */
$isMinor = false;
if (isset($input['student_date_of_birth']) && isValidDate($input['student_date_of_birth'])) {
    $isMinor = calculateAge($input['student_date_of_birth']) < 18;
}

if ($isMinor) {
    if (!isNonEmptyString($input['parent_full_name'] ?? null)) {
        $errors['parent_full_name'] = 'parent_full_name is required for minors';
    }
    if (!isNonEmptyString($input['parent_contact_number'] ?? null)) {
        $errors['parent_contact_number'] = 'parent_contact_number is required for minors';
    }
    if (!isNonEmptyString($input['parent_email'] ?? null) || !isValidEmail($input['parent_email'])) {
        $errors['parent_email'] = 'Valid parent_email is required for minors';
    }
}

/**
 * License validation
 * Only required if license_status !== NO_LICENSE_YET
 */
$hasLicense = isset($input['license_status']) && $input['license_status'] !== 'NO_LICENSE_YET';

if ($hasLicense) {
    if (!isNonEmptyString($input['license_number'] ?? null)) {
        $errors['license_number'] = 'license_number is required when license_status is not NO_LICENSE_YET';
    }

    if (!isNonEmptyString($input['license_issuing_region'] ?? null) || !in_array($input['license_issuing_region'], $allowedLicenseRegions, true)) {
        $errors['license_issuing_region'] = 'Valid license_issuing_region is required';
    }

    if (!isNonEmptyString($input['license_type'] ?? null) || !in_array($input['license_type'], $allowedLicenseTypes, true)) {
        $errors['license_type'] = 'Valid license_type is required';
    }

    if (!isNonEmptyString($input['license_issue_date'] ?? null) || !isValidDate($input['license_issue_date'])) {
        $errors['license_issue_date'] = 'license_issue_date is required and must be Y-m-d';
    }

    if (!isNonEmptyString($input['license_expiry_date'] ?? null) || !isValidDate($input['license_expiry_date'])) {
        $errors['license_expiry_date'] = 'license_expiry_date is required and must be Y-m-d';
    }
}

/**
 * Payment validation
 */
$courseTotal = isset($input['course']['total_amount']) ? (float)$input['course']['total_amount'] : null;
$inputAmount = isset($input['amount']) ? (float)$input['amount'] : null;

if ($courseTotal !== null && $inputAmount !== null && round($courseTotal, 2) !== round($inputAmount, 2)) {
    $errors['amount'] = 'amount must equal course.total_amount';
}

$requiresCard = isset($input['payment_method']) && in_array($input['payment_method'], ['CREDIT_CARD', 'DEBIT_CARD'], true);

if ($requiresCard) {
    if (!isNonEmptyString($input['name_on_card'] ?? null)) {
        $errors['name_on_card'] = 'name_on_card is required for card payments';
    }

    if (!isNonEmptyString($input['card_number'] ?? null) || !isValidCardNumber((string)$input['card_number'])) {
        $errors['card_number'] = 'Valid card_number is required for card payments';
    }

    if (!isNonEmptyString($input['expiry_date'] ?? null) || !isValidDate($input['expiry_date'])) {
        $errors['expiry_date'] = 'expiry_date is required for card payments and must be Y-m-d';
    }
}

if (!isset($input['did_agree_conditions']) || $input['did_agree_conditions'] !== true) {
    $errors['did_agree_conditions'] = 'User must agree to conditions';
}

if (!empty($errors)) {
    respond(422, [
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $errors
    ]);
}

/**
 * ===== Build rows =====
 */

$studentRow = [
    'first_name'            => sanitizeString($input['student_first_name']),
    'last_name'             => sanitizeString($input['student_last_name']),
    'address'               => sanitizeString($input['student_address']),
    'city'                  => sanitizeString($input['student_city']),
    'state'                 => sanitizeString($input['student_state']),
    'postal_code'           => sanitizeString($input['student_postal_code']),
    'email'                 => sanitizeString($input['student_email']),
    'mobile_phone_number'   => normalizePhone($input['student_mobile_phone_number']),
    'parent_full_name'      => sanitizeString($input['parent_full_name'] ?? null),
    'parent_email'          => sanitizeString($input['parent_email'] ?? null),
    'parent_contact_number' => normalizePhone($input['parent_contact_number'] ?? null),
    'is_minor'              => $isMinor,
    'date_of_birth'         => $input['student_date_of_birth'],
    'license_status'        => $input['license_status'],
    'license_number'        => $hasLicense ? sanitizeString($input['license_number'] ?? null) : null,
    'license_issue_region'  => $hasLicense ? sanitizeString($input['license_issuing_region'] ?? null) : null,
    'license_type'          => $hasLicense ? sanitizeString($input['license_type'] ?? null) : null,
    'license_expiry_date'   => $hasLicense ? ($input['license_expiry_date'] ?? null) : null,
    'license_issue_date'    => $hasLicense ? ($input['license_issue_date'] ?? null) : null,
    'driving_experience'    => sanitizeString($input['driving_experience']),
];

$enrollmentRow = [
    'student_id'           => null,
    'course_id'            => (int)$input['course']['course_id'],
    'session_type'         => $input['session_type'],
    'course_price'         => (float)$input['course']['course_price'],
    'tax_amount'           => (float)$input['course']['tax_amount'],
    'total_payable'        => (float)$input['course']['total_amount'],
    'amount_paid'          => 0,
    'enrollment_status'    => 'LEAD',
    'payment_status'       => 'PENDING',
    'did_agree_conditions' => true,
];

$paymentRow = [
    'enrollment_id' => null,
    'payment_method' => $input['payment_method'],
    'amount' => (float)$input['amount'],
    'status' => 'PENDING',
];

$cardInfoRow = null;
if ($requiresCard) {
    $cardInfoRow = [
        'name_on_card' => sanitizeString($input['name_on_card']),
        'card_number'  => preg_replace('/\D/', '', (string)$input['card_number']),
        'expiry_date'  => $input['expiry_date'],
        'enrollment_id'=> null,
    ];
}

$availabilityRow = [
    'enrollment_id' => null,
    'start_date'    => $input['availability_date'],
    'days_of_week'  => $input['availability_days_of_week'],
    'time_slots'    => $input['avilability_time_slots'],
];

/**
 * ===== Insert in required order =====
 * Note: This is not a true DB transaction when using REST.
 * On failure, the code attempts best-effort rollback.
 */

$studentId = null;
$enrollmentId = null;
$paymentId = null;
$cardInfoId = null;
$availabilityId = null;

try {
    // 1) STUDENTS
    $studentInsert = supabaseInsert(STUDENTS_TABLE, $studentRow);
    if (!$studentInsert['ok'] || empty($studentInsert['data'][0]['id'])) {
        throw new RuntimeException('Failed to insert student: ' . $studentInsert['error']);
    }
    $studentId = (string)$studentInsert['data'][0]['id'];

    // 2) ENROLLMENTS
    $enrollmentRow['student_id'] = $studentId;
    $enrollmentInsert = supabaseInsert(ENROLLMENTS_TABLE, $enrollmentRow);
    if (!$enrollmentInsert['ok'] || empty($enrollmentInsert['data'][0]['id'])) {
        throw new RuntimeException('Failed to insert enrollment: ' . $enrollmentInsert['error']);
    }
    $enrollmentId = (string)$enrollmentInsert['data'][0]['id'];

    // 3) PAYMENTS
    $paymentRow['enrollment_id'] = $enrollmentId;
    $paymentInsert = supabaseInsert(PAYMENTS_TABLE, $paymentRow);
    if (!$paymentInsert['ok'] || empty($paymentInsert['data'][0]['id'])) {
        throw new RuntimeException('Failed to insert payment: ' . $paymentInsert['error']);
    }
    $paymentId = (string)$paymentInsert['data'][0]['id'];

    // 4) CARD_INFORMATION if applicable
    if ($cardInfoRow !== null) {
        $cardInfoRow['enrollment_id'] = $enrollmentId;
        $cardInsert = supabaseInsert(CARD_INFORMATION_TABLE, $cardInfoRow);
        if (!$cardInsert['ok'] || empty($cardInsert['data'][0]['id'])) {
            throw new RuntimeException('Failed to insert card information: ' . $cardInsert['error']);
        }
        $cardInfoId = (string)$cardInsert['data'][0]['id'];
    }

    // 5) AVAILABILITY_SLOTS
    $availabilityRow['enrollment_id'] = $enrollmentId;
    $availabilityInsert = supabaseInsert(AVAILABILITY_SLOTS_TABLE, $availabilityRow);
    if (!$availabilityInsert['ok'] || empty($availabilityInsert['data'][0]['id'])) {
        throw new RuntimeException('Failed to insert availability slots: ' . $availabilityInsert['error']);
    }
    $availabilityId = (string)$availabilityInsert['data'][0]['id'];

    respond(201, [
        'success' => true,
        'message' => 'Enrollment created successfully',
        'data' => [
            'student_id' => $studentId,
            'enrollment_id' => $enrollmentId,
            'payment_id' => $paymentId,
            'card_information_id' => $cardInfoId,
            'availability_id' => $availabilityId,
        ]
    ]);

} catch (Throwable $e) {
    // Best-effort rollback in reverse order
    if ($availabilityId !== null) {
        supabaseDeleteById(AVAILABILITY_SLOTS_TABLE, $availabilityId);
    }
    if ($cardInfoId !== null) {
        supabaseDeleteById(CARD_INFORMATION_TABLE, $cardInfoId);
    }
    if ($paymentId !== null) {
        supabaseDeleteById(PAYMENTS_TABLE, $paymentId);
    }
    if ($enrollmentId !== null) {
        supabaseDeleteById(ENROLLMENTS_TABLE, $enrollmentId);
    }
    if ($studentId !== null) {
        supabaseDeleteById(STUDENTS_TABLE, $studentId);
    }

    respond(500, [
        'success' => false,
        'message' => 'Enrollment creation failed',
        'error' => $e->getMessage()
    ]);
}