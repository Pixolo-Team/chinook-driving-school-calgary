<?php
declare(strict_types=1);

/**
 * Chinook Courses Endpoint
 * Core PHP + Supabase REST API
 *
 * Accepts a single GET request and returns all course types with their
 * associated courses and features as a nested JSON structure.
 *
 * Required constants (defined below):
 * - SUPABASE_URL               – base URL of your Supabase project
 * - SUPABASE_SERVICE_ROLE_KEY  – service-role secret key
 *
 * Expected HTTP method: GET
 * Expected Content-Type: application/json
 *
 * Response body:
 * {
 *   status:      boolean
 *   status_code: number
 *   data:        array | false
 *   message:     string
 *   error:       string
 * }
 */

// ---------------------------------------------------------------------------
// Bootstrap: response headers & helper includes
// ---------------------------------------------------------------------------

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/helper/utils.php';
require_once __DIR__ . '/helper/supabase.php';

// ---------------------------------------------------------------------------
// Configuration: Supabase credentials
// ---------------------------------------------------------------------------

const SUPABASE_URL              = 'https://rwosruoldgimytqwdkwg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3b3NydW9sZGdpbXl0cXdka3dnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgzNjI2MSwiZXhwIjoyMDkwNDEyMjYxfQ.Cy9CHcQhqM1_fgPsIofIVS8ivTn50LSBEola2OgADR0';

// ---------------------------------------------------------------------------
// Step 1: Reject non-GET requests early
// ---------------------------------------------------------------------------

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(405, [
        'status'      => false,
        'status_code' => 405,
        'data'        => false,
        'message'     => 'Method Not Allowed',
        'error'       => 'Only GET requests are accepted',
    ]);
}

// ---------------------------------------------------------------------------
// Step 2: Fetch course types from Supabase
// ---------------------------------------------------------------------------

$courseTypes = supabaseSelect('course_types');

if (!$courseTypes['ok']) {
    respond(500, [
        'status'      => false,
        'status_code' => 500,
        'data'        => false,
        'message'     => 'Failed to fetch courses',
        'error'       => $courseTypes['error'] ?? 'Database error',
    ]);
}

// ---------------------------------------------------------------------------
// Step 3: Fetch courses from Supabase
// ---------------------------------------------------------------------------

$courses = supabaseSelect('courses');

if (!$courses['ok']) {
    respond(500, [
        'status'      => false,
        'status_code' => 500,
        'data'        => false,
        'message'     => 'Failed to fetch courses',
        'error'       => $courses['error'] ?? 'Database error',
    ]);
}

// ---------------------------------------------------------------------------
// Step 4: Build mapping structure keyed by course type id
// ---------------------------------------------------------------------------

$map = [];

foreach ($courseTypes['data'] as $type) {
    $map[$type['id']] = [
        'id'          => $type['id'],
        'name'        => $type['name'],
        'description' => $type['description'],
        'image'       => $type['image'],
        'courses'     => [],
    ];
}

// ---------------------------------------------------------------------------
// Step 5: Attach courses to their respective course types
// ---------------------------------------------------------------------------

foreach ($courses['data'] as $course) {
    $typeId = $course['course_type_id'];

    if (!isset($map[$typeId])) {
        continue;
    }

    $features = [];

    if (!empty($course['features'])) {
        foreach ($course['features'] as $feature) {
            $features[] = ['title' => $feature];
        }
    }

    $map[$typeId]['courses'][] = [
        'id'                  => $course['id'],
        'name'                => $course['name'],
        'course_price'        => $course['course_price'],
        'tax_amount'          => $course['tax_amount'],
        'total_amount'        => $course['total_amount'],
        'hours_in_car'        => $course['hours_in_car'],
        'hours_in_classroom'  => $course['hours_in_classroom'],
        'image'               => $course['image'],
        'features'            => $features,
    ];
}

// ---------------------------------------------------------------------------
// Step 6: Normalize map to a sequential array
// ---------------------------------------------------------------------------

$result = array_values($map);

// ---------------------------------------------------------------------------
// Step 7: Return success response
// ---------------------------------------------------------------------------

respond(200, [
    'status'      => true,
    'status_code' => 200,
    'data'        => $result,
    'message'     => 'Courses fetched successfully',
    'error'       => '',
]);
