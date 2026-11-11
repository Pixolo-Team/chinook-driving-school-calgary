<?php
declare(strict_types=1);

/**
 * Minimal enrollment confirmation mailer for the Chinook PHP backend.
 *
 * Supports SMTP delivery using environment variables and falls back to PHP's
 * native mail() transport when SMTP is not configured.
 */

/**
 * Send the enrollment confirmation email to the student.
 *
 * @param array       $input        Validated enrollment payload.
 * @param string|null $enrollmentId Created enrollment UUID.
 *
 * @param string $deliveryMode Human-readable delivery mode for logging (for example: immediate or deferred).
 *
 * @return array{sent: bool, transport: string, error: string|null}
 */
function sendEnrollmentConfirmationEmail(array $input, ?string $enrollmentId = null, string $deliveryMode = 'immediate'): array
{
    $recipientEmail = sanitizeString((string)($input['student_email'] ?? ''));
    if ($recipientEmail === null || !isValidEmail($recipientEmail)) {
        error_log(buildMailLogPrefix('Enrollment confirmation email', $deliveryMode) . ' not sent: student email address is missing or invalid');
        return [
            'sent' => false,
            'transport' => 'none',
            'error' => 'Student email address is missing or invalid',
        ];
    }

    $sender = getMailerSender();
    if ($sender === null) {
        error_log(buildMailLogPrefix('Enrollment confirmation email', $deliveryMode) . ' not sent: sender email is not configured');
        return [
            'sent' => false,
            'transport' => 'none',
            'error' => 'SMTP_FROM_EMAIL, SMTP_FROM, or MAIL_FROM_EMAIL is not configured',
        ];
    }

    return deliverMailMessage(
        [
            'from_email' => $sender['email'],
            'from_name' => $sender['name'],
            'to_email' => $recipientEmail,
            'subject' => 'Your Chinook enrollment confirmation',
            'html' => buildEnrollmentConfirmationHtml(),
            'text' => buildEnrollmentConfirmationText(),
        ],
        buildMailLogPrefix('Enrollment confirmation email', $deliveryMode)
    );
}

/**
 * Send the enrollment notification email to the admin inbox.
 *
 * @param array       $input        Validated enrollment payload.
 * @param string|null $enrollmentId Created enrollment UUID.
 *
 * @param string $deliveryMode Human-readable delivery mode for logging (for example: immediate or deferred).
 *
 * @return array{sent: bool, transport: string, error: string|null}
 */
function sendEnrollmentAdminNotificationEmail(array $input, ?string $enrollmentId = null, string $deliveryMode = 'immediate'): array
{
    // Admin notifications use a separate recipient so the student confirmation flow stays unchanged.
    $recipientEmail = sanitizeString(getMailerConfigValue('ENROLLMENT_NOTIFICATION_EMAIL'));
    if ($recipientEmail === null || !isValidEmail($recipientEmail)) {
        error_log(buildMailLogPrefix('Enrollment admin notification email', $deliveryMode) . ' not sent: ENROLLMENT_NOTIFICATION_EMAIL is missing or invalid');
        return [
            'sent' => false,
            'transport' => 'none',
            'error' => 'ENROLLMENT_NOTIFICATION_EMAIL is missing or invalid',
        ];
    }

    $sender = getMailerSender();
    if ($sender === null) {
        error_log(buildMailLogPrefix('Enrollment admin notification email', $deliveryMode) . ' not sent: sender email is not configured');
        return [
            'sent' => false,
            'transport' => 'none',
            'error' => 'SMTP_FROM_EMAIL, SMTP_FROM, or MAIL_FROM_EMAIL is not configured',
        ];
    }

    $ccEmails = getConfiguredEmailList('ENROLLMENT_NOTIFICATION_CC');
    if ($ccEmails === null) {
        error_log(buildMailLogPrefix('Enrollment admin notification email', $deliveryMode) . ' not sent: ENROLLMENT_NOTIFICATION_CC contains an invalid email address');
        return [
            'sent' => false,
            'transport' => 'none',
            'error' => 'ENROLLMENT_NOTIFICATION_CC contains an invalid email address',
        ];
    }

    return deliverMailMessage(
        [
            'from_email' => $sender['email'],
            'from_name' => $sender['name'],
            'to_email' => $recipientEmail,
            'cc_emails' => $ccEmails,
            'subject' => buildEnrollmentAdminNotificationSubject($input, $enrollmentId),
            'html' => buildEnrollmentAdminNotificationHtml($input, $enrollmentId),
            'text' => buildEnrollmentAdminNotificationText($input, $enrollmentId),
            'reply_to_email' => sanitizeString((string)($input['student_email'] ?? '')),
            'reply_to_name' => buildStudentFullName($input),
        ],
        buildMailLogPrefix('Enrollment admin notification email', $deliveryMode)
    );
}

/**
 * Build a consistent log prefix for mail delivery attempts.
 */
function buildMailLogPrefix(string $mailType, string $deliveryMode = 'immediate'): string
{
    return $mailType . ' [' . strtolower(trim($deliveryMode)) . ']';
}

/**
 * Build the enrollment confirmation email HTML.
 */
function buildEnrollmentConfirmationHtml(): string
{
    return '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Chinook Enrollment Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,sans-serif;color:#102a43;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#f4f7fb;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:640px;max-width:640px;background-color:#ffffff;border:1px solid #d9e2ec;border-radius:16px;">
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 18px 0;font-size:16px;line-height:24px;">Hello,</p>
              <p style="margin:0 0 18px 0;font-size:16px;line-height:24px;">Thank you for enrolling with Chinook Driving School Calgary.</p>
              <p style="margin:0 0 18px 0;font-size:16px;line-height:24px;">We have received your enrollment request and will reach out to you with a confirmation shortly.</p>
              <p style="margin:0 0 18px 0;font-size:16px;line-height:24px;">Once received, please call our office.</p>
              <p style="margin:24px 0 0 0;font-size:16px;line-height:24px;">Best Regards,</p>
              <p style="margin:4px 0 0 0;font-size:16px;line-height:24px;">Chinook Driving School Calgary</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';
}

/**
 * Build a plain text alternative for the email.
 */
function buildEnrollmentConfirmationText(): string
{
    return implode("\n", [
        'Hello,',
        'Thank you for enrolling with Chinook Driving Academy.',
        'We have received your enrollment request and will reach out to you with a confirmation shortly.',
        'Once received, please call our office.',
        '',
        'Best Regards,',
        'Chinook Driving Academy',
    ]);
}

/**
 * Build the admin notification subject line.
 */
function buildEnrollmentAdminNotificationSubject(array $input, ?string $enrollmentId = null): string
{
    $studentName = buildStudentFullName($input);

    return 'New enrollment: ' . $studentName;
}

/**
 * Build the admin notification email HTML.
 */
function buildEnrollmentAdminNotificationHtml(array $input, ?string $enrollmentId = null): string
{
    $sections = buildEnrollmentAdminSummarySections($input, $enrollmentId);
    $htmlSections = [];

    foreach ($sections as $sectionTitle => $rows) {
        $htmlRows = '';
        foreach ($rows as $label => $value) {
            $htmlRows .= '<tr>'
                . '<td style="padding:8px 12px;border:1px solid #d9e2ec;background-color:#f8fbff;font-weight:600;vertical-align:top;width:220px;">'
                . escapeHtml($label)
                . '</td>'
                . '<td style="padding:8px 12px;border:1px solid #d9e2ec;vertical-align:top;">'
                . nl2br(escapeHtml($value))
                . '</td>'
                . '</tr>';
        }

        $htmlSections[] = '<h2 style="margin:0 0 12px 0;font-size:18px;line-height:26px;color:#102a43;">'
            . escapeHtml($sectionTitle)
            . '</h2>'
            . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;margin:0 0 24px 0;">'
            . $htmlRows
            . '</table>';
    }

    return '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>New Chinook Enrollment</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,sans-serif;color:#102a43;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#f4f7fb;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="720" cellpadding="0" cellspacing="0" border="0" style="width:720px;max-width:720px;background-color:#ffffff;border:1px solid #d9e2ec;border-radius:16px;">
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px 0;font-size:24px;line-height:32px;">New enrollment received</h1>
              <p style="margin:0 0 24px 0;font-size:16px;line-height:24px;">A new enrollment has been submitted through the Chinook Driving School Calgary website.</p>'
              . implode('', $htmlSections) .
            '<p style="margin:24px 0 0 0;font-size:14px;line-height:22px;color:#486581;"></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';
}

/**
 * Build the admin notification plain text email.
 */
function buildEnrollmentAdminNotificationText(array $input, ?string $enrollmentId = null): string
{
    $lines = [
        'New enrollment received',
        'A new enrollment has been submitted through the Chinook Driving School Calgary website.',
        '',
    ];

    foreach (buildEnrollmentAdminSummarySections($input, $enrollmentId) as $sectionTitle => $rows) {
        $lines[] = $sectionTitle;
        $lines[] = str_repeat('-', strlen($sectionTitle));

        foreach ($rows as $label => $value) {
            $normalizedValue = str_replace("\n", '; ', $value);
            $lines[] = $label . ': ' . $normalizedValue;
        }

        $lines[] = '';
    }

    $lines[] = 'Sensitive payment data has been intentionally excluded from this notification.';

    return implode("\n", $lines);
}

/**
 * Read mailer settings from config.php or environment variables.
 */
function getMailerConfigValue(string $key): string
{
    if (function_exists('chinookConfig')) {
        return (string) (chinookConfig($key, '') ?? '');
    }

    $envValue = getenv($key);
    return $envValue === false ? '' : (string) $envValue;
}

/**
 * Resolve the configured sender mailbox.
 *
 * @return array{email: string, name: string}|null
 */
function getMailerSender(): ?array
{
    $fromEmail = getMailerConfigValue('SMTP_FROM_EMAIL')
        ?: getMailerConfigValue('SMTP_FROM')
        ?: getMailerConfigValue('MAIL_FROM_EMAIL')
        ?: '';
    $fromName = getMailerConfigValue('SMTP_FROM_NAME')
        ?: getMailerConfigValue('MAIL_FROM_NAME')
        ?: 'Chinook Driving School Calgary';

    if ($fromEmail === '') {
        return null;
    }

    return [
        'email' => $fromEmail,
        'name' => $fromName,
    ];
}

/**
 * Read a comma-separated config value as a validated email list.
 *
 * @return array<int, string>|null Null means at least one entry was invalid.
 */
function getConfiguredEmailList(string $key): ?array
{
    $rawValue = sanitizeString(getMailerConfigValue($key));
    if ($rawValue === null) {
        return [];
    }

    $emails = [];
    foreach (explode(',', $rawValue) as $part) {
        $email = sanitizeString($part);
        if ($email === null) {
            continue;
        }

        if (!isValidEmail($email)) {
            return null;
        }

        $emails[] = $email;
    }

    return array_values(array_unique($emails));
}

/**
 * Send an email through SMTP when configured, then fall back to PHP mail().
 *
 * @param array{
 *   from_email: string,
 *   from_name: string,
 *   to_email: string,
 *   cc_emails?: array<int, string>,
 *   subject: string,
 *   html: string,
 *   text: string,
 *   reply_to_email?: string|null,
 *   reply_to_name?: string|null
 * } $message
 *
 * @return array{sent: bool, transport: string, error: string|null}
 */
function deliverMailMessage(array $message, string $logContext): array
{
    $smtpHost = trim((string)(getMailerConfigValue('SMTP_HOST') ?: ''));

    if ($smtpHost !== '') {
        sendHtmlMailViaSmtp(
            [
                'host' => $smtpHost,
                'port' => (int)(getMailerConfigValue('SMTP_PORT') ?: 587),
                'username' => (string)(getMailerConfigValue('SMTP_USER') ?: ''),
                'password' => (string)(getMailerConfigValue('SMTP_PASS') ?: ''),
                'secure' => strtolower(trim((string)(getMailerConfigValue('SMTP_SECURE') ?: 'tls'))),
                'timeout' => (int)(getMailerConfigValue('SMTP_TIMEOUT') ?: 15),
            ],
            $message
        );

        return [
            'sent' => true,
            'transport' => 'smtp',
            'error' => null,
        ];
    }

    $mailParts = buildMailMessageParts(
        (string)$message['from_email'],
        (string)$message['from_name'],
        generateMultipartAlternativeBody((string)$message['html'], (string)$message['text']),
        (string)$message['to_email'],
        (string)$message['subject'],
        isset($message['cc_emails']) && is_array($message['cc_emails']) ? $message['cc_emails'] : [],
        isset($message['reply_to_email']) ? sanitizeString((string)$message['reply_to_email']) : null,
        isset($message['reply_to_name']) ? sanitizeString((string)$message['reply_to_name']) : null
    );
    $headers = $mailParts['headers'];
    $body = $mailParts['body'];

    $mailSent = mail(
        (string)$message['to_email'],
        encodeMimeHeader((string)$message['subject']),
        $body,
        implode("\r\n", $headers)
    );

    if (!$mailSent) {
        error_log($logContext . ' failed via PHP mail()');
    }

    return [
        'sent' => $mailSent,
        'transport' => 'mail',
        'error' => $mailSent ? null : 'PHP mail() returned false',
    ];
}

/**
 * Build the admin notification sections shown in HTML and text versions.
 *
 * @return array<string, array<string, string>>
 */
function buildEnrollmentAdminSummarySections(array $input, ?string $enrollmentId = null): array
{
    $studentName = buildStudentFullName($input);
    $studentAddressParts = array_values(array_filter([
        sanitizeString((string)($input['student_address'] ?? '')),
        joinNonEmpty(', ', [
            sanitizeString((string)($input['student_city'] ?? '')),
            sanitizeString((string)($input['student_state'] ?? '')),
            sanitizeString((string)($input['student_postal_code'] ?? '')),
        ]),
    ]));
    $courseSummaries = formatCourseSummaries($input);

    $sections = [
        'Enrollment' => [
            'Session Type' => formatEnrollmentSessionType($input['session_type'] ?? null),
            'Selected Course(s)' => $courseSummaries,
        ],
        'Student Details' => [
            'Student Name' => $studentName,
            'Email' => sanitizeString((string)($input['student_email'] ?? '')) ?? 'Not provided',
            'Phone' => sanitizeString((string)($input['student_mobile_phone_number'] ?? '')) ?? 'Not provided',
            'Address' => count($studentAddressParts) > 0 ? implode("\n", $studentAddressParts) : 'Not provided',
            'Pickup / Drop Off Address' => sanitizeString((string)($input['student_pickup_dropoff_address'] ?? '')) ?? 'Not provided',
            'School Attended' => sanitizeString((string)($input['student_school_attended'] ?? '')) ?? 'Not provided',
        ],
    ];

    $isMinor = isEnrollmentMinor($input);
    if ($isMinor) {
        $sections['Parent / Guardian'] = [
            'Parent Name' => sanitizeString((string)($input['parent_full_name'] ?? '')) ?? 'Not provided',
            'Parent Email' => sanitizeString((string)($input['parent_email'] ?? '')) ?? 'Not provided',
            'Parent Phone' => sanitizeString((string)($input['parent_contact_number'] ?? '')) ?? 'Not provided',
        ];
    }

    return $sections;
}

/**
 * Build a display-ready student full name.
 */
function buildStudentFullName(array $input): string
{
    $nameParts = array_values(array_filter([
        sanitizeString((string)($input['student_first_name'] ?? '')),
        sanitizeString((string)($input['student_middle_name'] ?? '')),
        sanitizeString((string)($input['student_last_name'] ?? '')),
    ]));

    return count($nameParts) > 0 ? implode(' ', $nameParts) : 'Unknown Student';
}

/**
 * Convert the enrollment course payload into a readable summary.
 */
function formatCourseSummaries(array $input): string
{
    $courses = [];

    if (is_array($input['courses'] ?? null) && count($input['courses']) > 0) {
        $courses = $input['courses'];
    } elseif (is_array($input['course'] ?? null)) {
        $courses = [$input['course']];
    }

    $summaries = [];
    foreach ($courses as $course) {
        if (!is_array($course)) {
            continue;
        }

        $courseName = sanitizeString((string)($course['name'] ?? ''));
        $price = formatCurrencyValue($course['total_amount'] ?? null);

        $summaryParts = [];
        if ($courseName !== null) {
            $summaryParts[] = $courseName;
        } else {
            $summaryParts[] = 'Unnamed course';
        }

        $summaryParts[] = 'Amount: ' . $price;
        $summaries[] = implode(' | ', $summaryParts);
    }

    return count($summaries) > 0 ? implode("\n", $summaries) : 'Not provided';
}

/**
 * Convert machine-readable session type values into a human-friendly label.
 */
function formatEnrollmentSessionType(mixed $sessionType): string
{
    if (!is_string($sessionType)) {
        return 'Not provided';
    }

    $sanitizedSessionType = sanitizeString($sessionType);
    if ($sanitizedSessionType === null) {
        return 'Not provided';
    }

    return ucwords(str_replace('_', ' ', $sanitizedSessionType));
}

/**
 * Format availability slots into a readable multiline string.
 */
function formatAvailabilityTimeSlots(array $timeSlots): string
{
    $formattedSlots = [];

    foreach ($timeSlots as $timeSlot) {
        if (is_array($timeSlot)) {
            $startTime = sanitizeString((string)($timeSlot['start_time'] ?? ''));
            $endTime = sanitizeString((string)($timeSlot['end_time'] ?? ''));

            if ($startTime !== null && $endTime !== null) {
                $formattedSlots[] = $startTime . ' - ' . $endTime;
            }
        } elseif (is_string($timeSlot)) {
            $sanitizedSlot = sanitizeString($timeSlot);
            if ($sanitizedSlot !== null) {
                $formattedSlots[] = $sanitizedSlot;
            }
        }
    }

    return count($formattedSlots) > 0 ? implode("\n", $formattedSlots) : 'Not provided';
}

/**
 * Format a list of strings into a comma-separated value.
 */
function formatStringList(array $values): string
{
    $sanitizedValues = [];

    foreach ($values as $value) {
        if (!is_string($value)) {
            continue;
        }

        $sanitizedValue = sanitizeString($value);
        if ($sanitizedValue !== null) {
            $sanitizedValues[] = $sanitizedValue;
        }
    }

    return count($sanitizedValues) > 0 ? implode(', ', $sanitizedValues) : 'Not provided';
}

/**
 * Format currency-like values for email display.
 */
function formatCurrencyValue(mixed $amount): string
{
    if ($amount === null || $amount === '') {
        return 'Not provided';
    }

    if (!is_numeric($amount)) {
        return (string)$amount;
    }

    return '$' . number_format((float)$amount, 2);
}

/**
 * Join only the non-empty strings from a list.
 */
function joinNonEmpty(string $separator, array $values): ?string
{
    $sanitizedValues = array_values(array_filter($values, static fn ($value): bool => is_string($value) && $value !== ''));

    if (count($sanitizedValues) === 0) {
        return null;
    }

    return implode($separator, $sanitizedValues);
}

/**
 * Determine whether the student is a minor using the submitted payload.
 */
function isEnrollmentMinor(array $input): bool
{
    $dateOfBirth = sanitizeString((string)($input['student_date_of_birth'] ?? ''));
    if ($dateOfBirth === null) {
        return false;
    }

    try {
        $today = new DateTimeImmutable('today', new DateTimeZone('UTC'));
        $birthDate = new DateTimeImmutable($dateOfBirth, new DateTimeZone('UTC'));
    } catch (Throwable) {
        return false;
    }

    return $birthDate->diff($today)->y < 18;
}

/**
 * Escape HTML content for email output.
 */
function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Deliver an HTML email via SMTP.
 *
 * @param array $smtpConfig SMTP settings.
 * @param array $message    Message payload.
 */
function sendHtmlMailViaSmtp(array $smtpConfig, array $message): void
{
    $host = (string)($smtpConfig['host'] ?? '');
    $port = (int)($smtpConfig['port'] ?? 587);
    $secure = strtolower((string)($smtpConfig['secure'] ?? 'tls'));
    $timeout = (int)($smtpConfig['timeout'] ?? 15);
    $remoteHost = $secure === 'ssl' ? 'ssl://' . $host : $host;

    $socket = @stream_socket_client(
        $remoteHost . ':' . $port,
        $errorCode,
        $errorMessage,
        $timeout,
        STREAM_CLIENT_CONNECT
    );

    if (!is_resource($socket)) {
        throw new RuntimeException('SMTP connection failed: ' . $errorMessage . ' (' . $errorCode . ')');
    }

    stream_set_timeout($socket, $timeout);

    try {
        expectSmtpResponse($socket, [220]);
        writeSmtpCommand($socket, 'EHLO localhost');
        expectSmtpResponse($socket, [250]);

        if ($secure === 'tls') {
            writeSmtpCommand($socket, 'STARTTLS');
            expectSmtpResponse($socket, [220]);

            $cryptoEnabled = stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            if ($cryptoEnabled !== true) {
                throw new RuntimeException('Unable to enable SMTP TLS encryption');
            }

            writeSmtpCommand($socket, 'EHLO localhost');
            expectSmtpResponse($socket, [250]);
        }

        $username = (string)($smtpConfig['username'] ?? '');
        $password = (string)($smtpConfig['password'] ?? '');
        if ($username !== '' || $password !== '') {
            writeSmtpCommand($socket, 'AUTH LOGIN');
            expectSmtpResponse($socket, [334]);
            writeSmtpCommand($socket, base64_encode($username));
            expectSmtpResponse($socket, [334]);
            writeSmtpCommand($socket, base64_encode($password));
            expectSmtpResponse($socket, [235]);
        }

        writeSmtpCommand($socket, 'MAIL FROM:<' . $message['from_email'] . '>');
        expectSmtpResponse($socket, [250]);
        writeSmtpCommand($socket, 'RCPT TO:<' . $message['to_email'] . '>');
        expectSmtpResponse($socket, [250, 251]);
        foreach (($message['cc_emails'] ?? []) as $ccEmail) {
            writeSmtpCommand($socket, 'RCPT TO:<' . $ccEmail . '>');
            expectSmtpResponse($socket, [250, 251]);
        }
        writeSmtpCommand($socket, 'DATA');
        expectSmtpResponse($socket, [354]);

        $mailParts = buildMailMessageParts(
            (string)$message['from_email'],
            (string)$message['from_name'],
            generateMultipartAlternativeBody((string)$message['html'], (string)$message['text']),
            (string)$message['to_email'],
            (string)$message['subject'],
            isset($message['cc_emails']) && is_array($message['cc_emails']) ? $message['cc_emails'] : [],
            isset($message['reply_to_email']) ? (string)$message['reply_to_email'] : null,
            isset($message['reply_to_name']) ? (string)$message['reply_to_name'] : null
        );

        $payload = implode("\r\n", $mailParts['headers']) . "\r\n\r\n" . $mailParts['body'];
        $payload = preg_replace("/\r\n\./", "\r\n..", (string)$payload);
        fwrite($socket, $payload . "\r\n.\r\n");
        expectSmtpResponse($socket, [250]);

        writeSmtpCommand($socket, 'QUIT');
        expectSmtpResponse($socket, [221]);
    } finally {
        fclose($socket);
    }
}

/**
 * Build RFC-822 style mail headers.
 *
 * @return array{headers: array<int, string>, body: string}
 */
function buildMailMessageParts(
    string $fromEmail,
    string $fromName,
    string $body,
    ?string $toEmail = null,
    ?string $subject = null,
    array $ccEmails = [],
    ?string $replyToEmail = null,
    ?string $replyToName = null
): array {
    $boundary = 'chinook-' . bin2hex(random_bytes(12));
    $messageId = buildMessageId($fromEmail);
    $headers = [
        'Date: ' . gmdate('D, d M Y H:i:s O'),
        'MIME-Version: 1.0',
        'Message-ID: <' . $messageId . '>',
        'From: ' . formatMailbox($fromEmail, $fromName),
        'Reply-To: ' . formatMailbox($replyToEmail ?? $fromEmail, $replyToName ?? $fromName),
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
        'X-Mailer: Chinook PHP Mailer',
    ];

    if ($toEmail !== null) {
        $headers[] = 'To: ' . $toEmail;
    }

    if (count($ccEmails) > 0) {
        $headers[] = 'Cc: ' . implode(', ', $ccEmails);
    }

    if ($subject !== null) {
        $headers[] = 'Subject: ' . encodeMimeHeader($subject);
    }

    return [
        'headers' => $headers,
        'body' => str_replace('[[BOUNDARY]]', $boundary, $body),
    ];
}

/**
 * Create a multipart body that includes both text and HTML versions.
 */
function generateMultipartAlternativeBody(string $html, string $text): string
{
    $safeText = quoted_printable_encode(str_replace(["\r\n", "\r"], "\n", $text));
    $safeHtml = quoted_printable_encode(str_replace(["\r\n", "\r"], "\n", $html));

    return '--[[BOUNDARY]]' . "\r\n"
        . 'Content-Type: text/plain; charset=UTF-8' . "\r\n"
        . 'Content-Transfer-Encoding: quoted-printable' . "\r\n\r\n"
        . $safeText . "\r\n\r\n"
        . '--[[BOUNDARY]]' . "\r\n"
        . 'Content-Type: text/html; charset=UTF-8' . "\r\n"
        . 'Content-Transfer-Encoding: quoted-printable' . "\r\n\r\n"
        . $safeHtml . "\r\n\r\n"
        . '--[[BOUNDARY]]--';
}

/**
 * Encode a header value for UTF-8 safety.
 */
function encodeMimeHeader(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

/**
 * Format a mailbox as "Display Name <email@example.com>".
 */
function formatMailbox(string $email, string $name): string
{
    return encodeMimeHeader($name) . ' <' . $email . '>';
}

/**
 * Build a stable-looking Message-ID using the sender domain when possible.
 */
function buildMessageId(string $fromEmail): string
{
    $domain = 'localhost';
    $atPosition = strrpos($fromEmail, '@');

    if ($atPosition !== false) {
        $candidateDomain = substr($fromEmail, $atPosition + 1);
        if ($candidateDomain !== '') {
            $domain = $candidateDomain;
        }
    }

    return bin2hex(random_bytes(16)) . '@' . $domain;
}

/**
 * Write a single SMTP command.
 */
function writeSmtpCommand($socket, string $command): void
{
    fwrite($socket, $command . "\r\n");
}

/**
 * Read and validate the next SMTP response.
 */
function expectSmtpResponse($socket, array $expectedCodes): string
{
    $response = readSmtpResponse($socket);
    $statusCode = (int)substr($response, 0, 3);

    if (!in_array($statusCode, $expectedCodes, true)) {
        throw new RuntimeException('Unexpected SMTP response: ' . trim($response));
    }

    return $response;
}

/**
 * Read a complete SMTP response, including multiline replies.
 */
function readSmtpResponse($socket): string
{
    $response = '';

    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;

        if (strlen($line) < 4 || $line[3] !== '-') {
            break;
        }
    }

    if ($response === '') {
        throw new RuntimeException('Empty SMTP response');
    }

    return $response;
}
