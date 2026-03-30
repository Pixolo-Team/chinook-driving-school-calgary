<?php
declare(strict_types=1);

/**
 * Input-validation helpers for the Chinook enrollment backend.
 *
 * Provides the allowed-value constants for every enum field and the
 * requireField() helper used to accumulate missing-field errors before
 * the main entry point decides whether to reject the request.
 *
 * Depends on the utility functions defined in helper/utils.php.
 */

// ---------------------------------------------------------------------------
// Allowed enum values
// Update these constants to match the exact values stored in the database.
// ---------------------------------------------------------------------------

/** @var string[] Valid values for the session_type field. */
const ALLOWED_SESSION_TYPES = ['CURRENT_SESSION', 'NEXT_SESSION', 'FUTURE_SESSION'];

/** @var string[] Valid values for the license_status field. */
const ALLOWED_LICENSE_STATUSES = ['none', 'learning', 'permanent'];

/** @var string[] Valid Canadian province/territory codes for license_issuing_region. */
const ALLOWED_LICENSE_REGIONS = ['AB', 'BC', 'SK', 'MB', 'ON', 'QC', 'NS', 'NB', 'PE', 'NL', 'NT', 'NU', 'YT', 'OTHER'];

/** @var string[] Valid values for the license_type field. */
const ALLOWED_LICENSE_TYPES = ['CLASS_7', 'CLASS_5_GDL', 'CLASS_5', 'OTHER'];

/** @var string[] Valid values for the payment_method field. */
const ALLOWED_PAYMENT_METHODS = ['CREDIT_CARD', 'DEBIT_CARD', 'INTERAC_E_TRANSFER', 'PAY_IN_PERSON'];

/** @var string[] Valid day-of-week labels for availability_days_of_week entries. */
const ALLOWED_DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

/**
 * Assert that a required field is present and non-empty in the input array.
 *
 * When the field is missing, null, or an empty string, an entry is added to
 * the $errors array using $key as the key and $message (or a default phrase)
 * as the value. Multiple calls accumulate errors so the caller can report all
 * problems in a single response.
 *
 * @param array       $data    The decoded request payload to inspect.
 * @param string      $key     The field name / dot-notation path to validate.
 * @param array       &$errors Reference to the errors accumulator array.
 * @param string|null $message Optional custom error message; defaults to "{$key} is required".
 *
 * @return void
 */
function requireField(array $data, string $key, array &$errors, string $message = null): void
{
    if (!array_key_exists($key, $data) || $data[$key] === null || $data[$key] === '') {
        $errors[$key] = $message ?? ($key . ' is required');
    }
}
