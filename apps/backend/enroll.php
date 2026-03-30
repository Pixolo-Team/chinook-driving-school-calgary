<?php
declare(strict_types=1);

/**
 * Chinook Enrollment Endpoint
 * Core PHP + Supabase REST API
 *
 * Accepts a single POST request with a JSON body describing a new student
 * enrollment, validates every field, then persists the data across five
 * Supabase tables in sequence.  On any database error the code attempts a
 * best-effort rollback in reverse-insertion order.
 *
 * Required constants (defined below):
 * - SUPABASE_URL               – base URL of your Supabase project
 * - SUPABASE_SERVICE_ROLE_KEY  – service-role secret key
 *
 * Expected HTTP method: POST
 * Expected Content-Type: application/json
 */

// ---------------------------------------------------------------------------
// Bootstrap: response headers & helper includes
// ---------------------------------------------------------------------------

header('Content-Type: application/json');

require_once __DIR__ . '/helper/utils.php';
require_once __DIR__ . '/helper/supabase.php';
require_once __DIR__ . '/helper/validation.php';

// ---------------------------------------------------------------------------
// Configuration: Supabase credentials and table names
// ---------------------------------------------------------------------------

const SUPABASE_URL              = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'YOUR_SUPABASE_SERVICE_ROLE_KEY';

const STUDENTS_TABLE           = 'students';
const ENROLLMENTS_TABLE        = 'enrollments';
const PAYMENTS_TABLE           = 'payments';
const CARD_INFORMATION_TABLE   = 'card_information';
const AVAILABILITY_SLOTS_TABLE = 'availability_slots';

// ---------------------------------------------------------------------------
// Step 1: Reject non-POST requests early
// ---------------------------------------------------------------------------

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['success' => false, 'message' => 'Method Not Allowed']);
}

// ---------------------------------------------------------------------------
// Step 2: Read and decode the JSON request body
// ---------------------------------------------------------------------------

$input  = getJsonInput();
$errors = [];

// ---------------------------------------------------------------------------
// Step 3: Validate that all top-level required fields are present
// ---------------------------------------------------------------------------

requireField($input, 'session_type',                  $errors);
requireField($input, 'course',                        $errors);
requireField($input, 'student_first_name',            $errors);
requireField($input, 'student_last_name',             $errors);
requireField($input, 'student_address',               $errors);
requireField($input, 'student_city',                  $errors);
requireField($input, 'student_state',                 $errors);
requireField($input, 'student_postal_code',           $errors);
requireField($input, 'student_email',                 $errors);
requireField($input, 'student_mobile_phone_number',   $errors);
requireField($input, 'student_date_of_birth',         $errors);
requireField($input, 'license_status',                $errors);
requireField($input, 'driving_experience',            $errors);
requireField($input, 'availability_date',             $errors);
requireField($input, 'avilability_time_slots',        $errors);
requireField($input, 'availability_days_of_week',     $errors);
requireField($input, 'payment_method',                $errors);
requireField($input, 'amount',                        $errors);
requireField($input, 'did_agree_conditions',          $errors, 'did_agree_conditions is required');

// ---------------------------------------------------------------------------
// Step 4: Validate the nested course object and its numeric amounts
// ---------------------------------------------------------------------------

if (!isset($errors['course'])) {
    if (!is_array($input['course'])) {
        $errors['course'] = 'course must be an object';
    } else {
        $course = $input['course'];

        // Ensure all four course amount fields are present and numeric
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

        // Verify that course_price + tax_amount equals total_amount (rounded to 2 dp)
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

// ---------------------------------------------------------------------------
// Step 5: Validate email addresses and date fields
// ---------------------------------------------------------------------------

// Student email must be a valid RFC-5321 address
if (isset($input['student_email']) && !isValidEmail($input['student_email'])) {
    $errors['student_email'] = 'student_email is invalid';
}

// Parent email is optional, but must be valid when supplied
if (isset($input['parent_email']) && $input['parent_email'] !== null && $input['parent_email'] !== '' && !isValidEmail($input['parent_email'])) {
    $errors['parent_email'] = 'parent_email is invalid';
}

// Date fields must use strict Y-m-d format
if (isset($input['student_date_of_birth']) && !isValidDate($input['student_date_of_birth'])) {
    $errors['student_date_of_birth'] = 'student_date_of_birth must be in Y-m-d format';
}

if (isset($input['availability_date']) && !isValidDate($input['availability_date'])) {
    $errors['availability_date'] = 'availability_date must be in Y-m-d format';
}

if (isset($input['expiry_date']) && $input['expiry_date'] !== null && $input['expiry_date'] !== '' && !isValidDate($input['expiry_date'])) {
    $errors['expiry_date'] = 'expiry_date must be in Y-m-d format';
}

// ---------------------------------------------------------------------------
// Step 6: Validate enum fields against their allowed value sets
// ---------------------------------------------------------------------------

if (isset($input['session_type']) && !in_array($input['session_type'], ALLOWED_SESSION_TYPES, true)) {
    $errors['session_type'] = 'Invalid session_type';
}

if (isset($input['license_status']) && !in_array($input['license_status'], ALLOWED_LICENSE_STATUSES, true)) {
    $errors['license_status'] = 'Invalid license_status';
}

if (isset($input['payment_method']) && !in_array($input['payment_method'], ALLOWED_PAYMENT_METHODS, true)) {
    $errors['payment_method'] = 'Invalid payment_method';
}

// Validate each day in the availability_days_of_week array
if (!isset($errors['availability_days_of_week'])) {
    if (!is_array($input['availability_days_of_week']) || count($input['availability_days_of_week']) === 0) {
        $errors['availability_days_of_week'] = 'availability_days_of_week must be a non-empty array';
    } else {
        foreach ($input['availability_days_of_week'] as $index => $day) {
            if (!in_array($day, ALLOWED_DAYS_OF_WEEK, true)) {
                $errors["availability_days_of_week.$index"] = 'Invalid day value';
            }
        }
    }
}

// Validate each time slot object within avilability_time_slots
if (!isset($errors['avilability_time_slots'])) {
    if (!is_array($input['avilability_time_slots']) || count($input['avilability_time_slots']) === 0) {
        $errors['avilability_time_slots'] = 'avilability_time_slots must be a non-empty array';
    } else {
        foreach ($input['avilability_time_slots'] as $index => $slot) {
            if (!is_array($slot)) {
                $errors["avilability_time_slots.$index"] = 'Each time slot must be an object';
                continue;
            }

            // Both start_time and end_time must match HH:MM or HH:MM:SS
            if (!isset($slot['start_time']) || !preg_match('/^\d{2}:\d{2}(:\d{2})?$/', (string)$slot['start_time'])) {
                $errors["avilability_time_slots.$index.start_time"] = 'start_time must be HH:MM or HH:MM:SS';
            }

            if (!isset($slot['end_time']) || !preg_match('/^\d{2}:\d{2}(:\d{2})?$/', (string)$slot['end_time'])) {
                $errors["avilability_time_slots.$index.end_time"] = 'end_time must be HH:MM or HH:MM:SS';
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Step 7: Additional validation for minor students (age < 18)
// ---------------------------------------------------------------------------

$isMinor = false;
if (isset($input['student_date_of_birth']) && isValidDate($input['student_date_of_birth'])) {
    $isMinor = calculateAge($input['student_date_of_birth']) < 18;
}

if ($isMinor) {
    // Parent details are mandatory when the student is under 18
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

// ---------------------------------------------------------------------------
// Step 8: Validate license details when the student already holds a license
// ---------------------------------------------------------------------------

$hasLicense = isset($input['license_status']) && $input['license_status'] !== 'NO_LICENSE_YET';

if ($hasLicense) {
    // License number, region, type, and both dates are required
    if (!isNonEmptyString($input['license_number'] ?? null)) {
        $errors['license_number'] = 'license_number is required when license_status is not NO_LICENSE_YET';
    }

    if (!isNonEmptyString($input['license_issuing_region'] ?? null) || !in_array($input['license_issuing_region'], ALLOWED_LICENSE_REGIONS, true)) {
        $errors['license_issuing_region'] = 'Valid license_issuing_region is required';
    }

    if (!isNonEmptyString($input['license_type'] ?? null) || !in_array($input['license_type'], ALLOWED_LICENSE_TYPES, true)) {
        $errors['license_type'] = 'Valid license_type is required';
    }

    if (!isNonEmptyString($input['license_issue_date'] ?? null) || !isValidDate($input['license_issue_date'])) {
        $errors['license_issue_date'] = 'license_issue_date is required and must be Y-m-d';
    }

    if (!isNonEmptyString($input['license_expiry_date'] ?? null) || !isValidDate($input['license_expiry_date'])) {
        $errors['license_expiry_date'] = 'license_expiry_date is required and must be Y-m-d';
    }
}

// ---------------------------------------------------------------------------
// Step 9: Validate payment amount and card details
// ---------------------------------------------------------------------------

// The top-level amount must match the course total
$courseTotal = isset($input['course']['total_amount']) ? (float)$input['course']['total_amount'] : null;
$inputAmount = isset($input['amount'])                 ? (float)$input['amount']                 : null;

if ($courseTotal !== null && $inputAmount !== null && round($courseTotal, 2) !== round($inputAmount, 2)) {
    $errors['amount'] = 'amount must equal course.total_amount';
}

// Card fields are required only for CREDIT_CARD and DEBIT_CARD payments
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

// The student must have explicitly agreed to the enrollment conditions
if (!isset($input['did_agree_conditions']) || $input['did_agree_conditions'] !== true) {
    $errors['did_agree_conditions'] = 'User must agree to conditions';
}

// ---------------------------------------------------------------------------
// Step 10: Return all accumulated validation errors (if any)
// ---------------------------------------------------------------------------

if (!empty($errors)) {
    respond(422, [
        'success' => false,
        'message' => 'Validation failed',
        'errors'  => $errors,
    ]);
}

// ---------------------------------------------------------------------------
// Step 11: Build the database row payloads from the validated input
// ---------------------------------------------------------------------------

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
    'student_id'           => null, // filled after student insert
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
    'enrollment_id'  => null, // filled after enrollment insert
    'payment_method' => $input['payment_method'],
    'amount'         => (float)$input['amount'],
    'status'         => 'PENDING',
];

// Build card info row only when the payment method requires it
$cardInfoRow = null;
if ($requiresCard) {
    $cardInfoRow = [
        'name_on_card'  => sanitizeString($input['name_on_card']),
        'card_number'   => preg_replace('/\D/', '', (string)$input['card_number']),
        'expiry_date'   => $input['expiry_date'],
        'enrollment_id' => null, // filled after enrollment insert
    ];
}

$availabilityRow = [
    'enrollment_id' => null, // filled after enrollment insert
    'start_date'    => $input['availability_date'],
    'days_of_week'  => $input['availability_days_of_week'],
    'time_slots'    => $input['avilability_time_slots'],
];

// ---------------------------------------------------------------------------
// Step 12: Insert rows in dependency order; roll back on any failure
// Note: This is not a true atomic transaction over the REST API.
//       On failure the code attempts a best-effort rollback in reverse order.
// ---------------------------------------------------------------------------

$studentId      = null;
$enrollmentId   = null;
$paymentId      = null;
$cardInfoId     = null;
$availabilityId = null;

try {
    // Insert the student record first so we have a student_id for downstream rows
    $studentInsert = supabaseInsert(STUDENTS_TABLE, $studentRow);
    if (!$studentInsert['ok'] || empty($studentInsert['data'][0]['id'])) {
        throw new RuntimeException('Failed to insert student: ' . $studentInsert['error']);
    }
    $studentId = (string)$studentInsert['data'][0]['id'];

    // Insert the enrollment, linking it to the new student
    $enrollmentRow['student_id'] = $studentId;
    $enrollmentInsert = supabaseInsert(ENROLLMENTS_TABLE, $enrollmentRow);
    if (!$enrollmentInsert['ok'] || empty($enrollmentInsert['data'][0]['id'])) {
        throw new RuntimeException('Failed to insert enrollment: ' . $enrollmentInsert['error']);
    }
    $enrollmentId = (string)$enrollmentInsert['data'][0]['id'];

    // Insert the payment record, linked to the enrollment
    $paymentRow['enrollment_id'] = $enrollmentId;
    $paymentInsert = supabaseInsert(PAYMENTS_TABLE, $paymentRow);
    if (!$paymentInsert['ok'] || empty($paymentInsert['data'][0]['id'])) {
        throw new RuntimeException('Failed to insert payment: ' . $paymentInsert['error']);
    }
    $paymentId = (string)$paymentInsert['data'][0]['id'];

    // Insert card information only when the payment method requires it
    if ($cardInfoRow !== null) {
        $cardInfoRow['enrollment_id'] = $enrollmentId;
        $cardInsert = supabaseInsert(CARD_INFORMATION_TABLE, $cardInfoRow);
        if (!$cardInsert['ok'] || empty($cardInsert['data'][0]['id'])) {
            throw new RuntimeException('Failed to insert card information: ' . $cardInsert['error']);
        }
        $cardInfoId = (string)$cardInsert['data'][0]['id'];
    }

    // Insert the availability slots, linked to the enrollment
    $availabilityRow['enrollment_id'] = $enrollmentId;
    $availabilityInsert = supabaseInsert(AVAILABILITY_SLOTS_TABLE, $availabilityRow);
    if (!$availabilityInsert['ok'] || empty($availabilityInsert['data'][0]['id'])) {
        throw new RuntimeException('Failed to insert availability slots: ' . $availabilityInsert['error']);
    }
    $availabilityId = (string)$availabilityInsert['data'][0]['id'];

    // All inserts succeeded – return the IDs of the created records
    respond(201, [
        'success' => true,
        'message' => 'Enrollment created successfully',
        'data'    => [
            'student_id'          => $studentId,
            'enrollment_id'       => $enrollmentId,
            'payment_id'          => $paymentId,
            'card_information_id' => $cardInfoId,
            'availability_id'     => $availabilityId,
        ],
    ]);

} catch (Throwable $e) {
    // ---------------------------------------------------------------------------
    // Best-effort rollback: delete already-inserted rows in reverse order
    // ---------------------------------------------------------------------------
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
        'error'   => $e->getMessage(),
    ]);
}
