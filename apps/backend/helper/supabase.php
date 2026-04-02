<?php
declare(strict_types=1);

/**
 * Supabase REST API helpers for the Chinook enrollment backend.
 *
 * Provides low-level HTTP request handling (via cURL) as well as convenience
 * wrappers for inserting and deleting rows through the Supabase PostgREST API.
 *
 * Depends on the SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY constants being
 * defined before this file is included.
 */

/**
 * Execute an HTTP request against the Supabase REST API.
 *
 * Builds the full URL from the SUPABASE_URL constant, attaches the required
 * authentication headers, and returns a normalized result array so callers
 * always receive a consistent structure regardless of success or failure.
 *
 * @param string      $method       HTTP method (GET, POST, PATCH, DELETE, …).
 * @param string      $endpoint     Path relative to SUPABASE_URL (e.g. "/rest/v1/students").
 * @param array|null  $body         Optional associative array to JSON-encode as the request body.
 * @param string[]    $extraHeaders Additional HTTP headers to merge with the default auth headers.
 *
 * @return array{ok: bool, status: int, data: mixed, raw: string|null, error: string|null}
 *   Normalized response:
 *   - ok     – true when HTTP status is 2xx.
 *   - status – raw HTTP status code.
 *   - data   – JSON-decoded response body, or null.
 *   - raw    – raw response body string.
 *   - error  – human-readable error message, or null on success.
 */
function supabaseRequest(
    string $method,
    string $endpoint,
    ?array $body = null,
    array $extraHeaders = []
): array {
    // Build the full endpoint URL
    $url = rtrim(SUPABASE_URL, '/') . $endpoint;

    // Merge default authentication headers with any caller-supplied extras
    $headers = array_merge([
        'apikey: ' . SUPABASE_SERVICE_ROLE_KEY,
        'Authorization: Bearer ' . SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type: application/json',
    ], $extraHeaders);

    // Configure cURL handle
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    // Attach JSON body when provided
    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    }

    // Execute the request and capture response details
    $responseBody = curl_exec($ch);
    $curlError    = curl_error($ch);
    $httpCode     = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Return early with an error envelope when cURL itself failed
    if ($curlError) {
        return [
            'ok'     => false,
            'status' => 500,
            'data'   => null,
            'raw'    => null,
            'error'  => 'cURL error: ' . $curlError,
        ];
    }

    // Decode the JSON response body when present
    $decoded = null;
    if ($responseBody !== '' && $responseBody !== null) {
        $decoded = json_decode($responseBody, true);
    }

    $ok = $httpCode >= 200 && $httpCode < 300;

    return [
        'ok'     => $ok,
        'status' => $httpCode,
        'data'   => $decoded,
        'raw'    => $responseBody,
        'error'  => $ok ? null : ($decoded['message'] ?? $decoded['hint'] ?? $responseBody ?? 'Supabase request failed'),
    ];
}

/**
 * Insert a single row into a Supabase table and return the created record.
 *
 * Uses the "Prefer: return=representation" header so Supabase responds with
 * the full inserted row (including server-generated values such as `id`).
 *
 * @param string $table Name of the target database table.
 * @param array  $row   Associative array of column-name → value pairs to insert.
 *
 * @return array Normalized response from {@see supabaseRequest()}.
 */
function supabaseInsert(string $table, array $row): array
{
    // Build the PostgREST REST endpoint for the target table
    $endpoint = '/rest/v1/' . $table;

    return supabaseRequest(
        'POST',
        $endpoint,
        $row,
        ['Prefer: return=representation']
    );
}

/**
 * Delete a single row by its primary key from a Supabase table.
 *
 * Silently discards the Supabase response; intended for best-effort rollback
 * operations where failure can be tolerated.
 *
 * @param string $table Name of the target database table.
 * @param string $id    The UUID (or other string primary key) of the row to delete.
 *
 * @return void
 */
function supabaseDeleteById(string $table, string $id): void
{
    // Build a PostgREST equality filter on the id column
    $endpoint = '/rest/v1/' . $table . '?id=eq.' . rawurlencode($id);
    supabaseRequest('DELETE', $endpoint, null, ['Prefer: return=minimal']);
}
