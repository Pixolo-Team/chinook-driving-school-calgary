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
 * @return array{sent: bool, transport: string, error: string|null}
 */
function sendEnrollmentConfirmationEmail(array $input, ?string $enrollmentId = null): array
{
    $recipientEmail = sanitizeString((string)($input['student_email'] ?? ''));
    if ($recipientEmail === null || !isValidEmail($recipientEmail)) {
        return [
            'sent' => false,
            'transport' => 'none',
            'error' => 'Student email address is missing or invalid',
        ];
    }

    $fromEmail = getMailerConfigValue('SMTP_FROM_EMAIL')
        ?: getMailerConfigValue('SMTP_FROM')
        ?: getMailerConfigValue('MAIL_FROM_EMAIL')
        ?: '';
    $fromName = getMailerConfigValue('SMTP_FROM_NAME')
        ?: getMailerConfigValue('MAIL_FROM_NAME')
        ?: 'Chinook Driving School Calgary';

    if ($fromEmail === '') {
        return [
            'sent' => false,
            'transport' => 'none',
            'error' => 'SMTP_FROM_EMAIL, SMTP_FROM, or MAIL_FROM_EMAIL is not configured',
        ];
    }

    $subject = 'Your Chinook enrollment confirmation';
    $htmlBody = buildEnrollmentConfirmationHtml($input, $enrollmentId);
    $textBody = buildEnrollmentConfirmationText($input, $enrollmentId);

    $smtpHost = trim((string)(getMailerConfigValue('SMTP_HOST') ?: ''));
    if ($smtpHost !== '') {
        try {
            sendHtmlMailViaSmtp(
                [
                    'host' => $smtpHost,
                    'port' => (int)(getMailerConfigValue('SMTP_PORT') ?: 587),
                    'username' => (string)(getMailerConfigValue('SMTP_USER') ?: ''),
                    'password' => (string)(getMailerConfigValue('SMTP_PASS') ?: ''),
                    'secure' => strtolower(trim((string)(getMailerConfigValue('SMTP_SECURE') ?: 'tls'))),
                    'timeout' => (int)(getMailerConfigValue('SMTP_TIMEOUT') ?: 15),
                ],
                [
                    'from_email' => $fromEmail,
                    'from_name' => $fromName,
                    'to_email' => $recipientEmail,
                    'subject' => $subject,
                    'html' => $htmlBody,
                    'text' => $textBody,
                ]
            );

            return [
                'sent' => true,
                'transport' => 'smtp',
                'error' => null,
            ];
        } catch (Throwable $throwable) {
            error_log('Enrollment confirmation email failed over SMTP: ' . $throwable->getMessage());
        }
    }

    $mailParts = buildMailMessageParts($fromEmail, $fromName, generateMultipartAlternativeBody($htmlBody, $textBody));
    $headers = $mailParts['headers'];
    $message = $mailParts['body'];

    $mailSent = mail(
        $recipientEmail,
        encodeMimeHeader($subject),
        $message,
        implode("\r\n", $headers)
    );

    return [
        'sent' => $mailSent,
        'transport' => 'mail',
        'error' => $mailSent ? null : 'PHP mail() returned false',
    ];
}

/**
 * Send a notification email for a contact inquiry.
 *
 * @param array $input Validated inquiry payload.
 *
 * @return array{sent: bool, transport: string, error: string|null}
 */
function sendInquiryNotificationEmail(array $input): array
{
    $fromEmail = getMailerConfigValue('SMTP_FROM_EMAIL')
        ?: getMailerConfigValue('SMTP_FROM')
        ?: getMailerConfigValue('MAIL_FROM_EMAIL')
        ?: '';
    $fromName = getMailerConfigValue('SMTP_FROM_NAME')
        ?: getMailerConfigValue('MAIL_FROM_NAME')
        ?: 'Chinook Driving School Calgary';
    $toEmail = getMailerConfigValue('INQUIRY_NOTIFICATION_EMAIL')
        ?: getMailerConfigValue('CONTACT_NOTIFICATION_EMAIL')
        ?: $fromEmail;

    if ($fromEmail === '') {
        return [
            'sent' => false,
            'transport' => 'none',
            'error' => 'SMTP_FROM_EMAIL, SMTP_FROM, or MAIL_FROM_EMAIL is not configured',
        ];
    }

    if ($toEmail === '') {
        return [
            'sent' => false,
            'transport' => 'none',
            'error' => 'INQUIRY_NOTIFICATION_EMAIL, CONTACT_NOTIFICATION_EMAIL, or sender email is not configured',
        ];
    }

    if (!isValidEmail($toEmail)) {
        return [
            'sent' => false,
            'transport' => 'none',
            'error' => 'Notification email address is invalid',
        ];
    }

    $replyToEmail = sanitizeString((string)($input['email'] ?? '')) ?: $fromEmail;
    if (!isValidEmail($replyToEmail)) {
        $replyToEmail = $fromEmail;
    }

    $replyToName = sanitizeString((string)($input['name'] ?? '')) ?: $fromName;
    $subject = 'New Chinook website inquiry';
    $htmlBody = buildInquiryNotificationHtml($input);
    $textBody = buildInquiryNotificationText($input);

    $smtpHost = trim((string)(getMailerConfigValue('SMTP_HOST') ?: ''));
    if ($smtpHost !== '') {
        try {
            sendHtmlMailViaSmtp(
                [
                    'host' => $smtpHost,
                    'port' => (int)(getMailerConfigValue('SMTP_PORT') ?: 587),
                    'username' => (string)(getMailerConfigValue('SMTP_USER') ?: ''),
                    'password' => (string)(getMailerConfigValue('SMTP_PASS') ?: ''),
                    'secure' => strtolower(trim((string)(getMailerConfigValue('SMTP_SECURE') ?: 'tls'))),
                    'timeout' => (int)(getMailerConfigValue('SMTP_TIMEOUT') ?: 15),
                ],
                [
                    'from_email' => $fromEmail,
                    'from_name' => $fromName,
                    'reply_to_email' => $replyToEmail,
                    'reply_to_name' => $replyToName,
                    'to_email' => $toEmail,
                    'subject' => $subject,
                    'html' => $htmlBody,
                    'text' => $textBody,
                ]
            );

            return [
                'sent' => true,
                'transport' => 'smtp',
                'error' => null,
            ];
        } catch (Throwable $throwable) {
            error_log('Inquiry notification email failed over SMTP: ' . $throwable->getMessage());
        }
    }

    $mailParts = buildMailMessageParts(
        $fromEmail,
        $fromName,
        generateMultipartAlternativeBody($htmlBody, $textBody),
        $toEmail,
        $subject,
        $replyToEmail,
        $replyToName
    );

    $mailSent = mail(
        $toEmail,
        encodeMimeHeader($subject),
        $mailParts['body'],
        implode("\r\n", $mailParts['headers'])
    );

    return [
        'sent' => $mailSent,
        'transport' => 'mail',
        'error' => $mailSent ? null : 'PHP mail() returned false',
    ];
}

/**
 * Build the enrollment confirmation email HTML.
 */
function buildEnrollmentConfirmationHtml(array $input, ?string $enrollmentId = null): string
{
    $studentName = formatStudentFullName($input);
    $courses = normalizeEnrollmentCourses($input);
    $availabilityDate = formatDisplayDate($input['availability_date'] ?? null);
    $availabilityDays = formatAvailabilityDays($input['availability_days_of_week'] ?? null);
    $availabilityWindows = formatAvailabilityTimeSlots($input['avilability_time_slots'] ?? null);
    $sessionType = formatSessionTypeLabel($input['session_type'] ?? null);
    $year = gmdate('Y');

    $courseCards = '';
    foreach ($courses as $courseItem) {
        $courseName = escapeHtml((string)($courseItem['name'] ?? 'Selected Course'));
        $coursePrice = formatCurrency($courseItem['course_price'] ?? 0);
        $courseTax = formatCurrency($courseItem['tax_amount'] ?? 0);
        $courseTotal = formatCurrency($courseItem['total_amount'] ?? 0);
        $courseCards .= '
          <tr>
            <td style="padding:0 0 12px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #d9e2ec;border-radius:14px;background-color:#ffffff;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px 0;font-size:18px;line-height:26px;font-weight:700;color:#102a43;">' . $courseName . '</p>
                    <p style="margin:0;font-size:14px;line-height:22px;color:#486581;">Course: ' . $coursePrice . ' &nbsp;|&nbsp; GST: ' . $courseTax . ' &nbsp;|&nbsp; Total: ' . $courseTotal . '</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>';
    }

    $summaryRows = buildEmailSummaryRows([
        'Enrollment ID' => $enrollmentId ?? 'Pending assignment',
        'Session Type' => $sessionType,
        'Preferred Start Date' => $availabilityDate,
        'Preferred Days' => $availabilityDays,
        'Preferred Time Windows' => $availabilityWindows,
        'Amount Received in Form' => formatCurrency($input['amount'] ?? 0),
    ]);

    return '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Chinook Enrollment Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fb;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background-color:#f4f7fb;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:640px;max-width:640px;background-color:#ffffff;border:1px solid #d9e2ec;border-radius:22px;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 24px 32px;background:linear-gradient(135deg,#0b1f33 0%,#1b4d8c 100%);">
              <p style="margin:0 0 10px 0;font-size:12px;line-height:18px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#bcccdc;">Chinook Driving School Calgary</p>
              <h1 style="margin:0;font-size:32px;line-height:40px;font-weight:700;color:#ffffff;">Enrollment received</h1>
              <p style="margin:12px 0 0 0;font-size:16px;line-height:26px;color:#d9e2ec;">Thanks ' . escapeHtml($studentName) . '. We have your enrollment details and our team will follow up with next steps shortly.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <p style="margin:0 0 14px 0;font-size:13px;line-height:20px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#486581;">Courses selected</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' . $courseCards . '</table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 8px 32px;">
              <p style="margin:0 0 14px 0;font-size:13px;line-height:20px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#486581;">Availability details</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #d9e2ec;border-radius:14px;background-color:#f8fbff;">
                <tr>
                  <td style="padding:18px 20px;">' . $summaryRows . '</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 32px 32px;">
              <p style="margin:0 0 10px 0;font-size:15px;line-height:24px;color:#243b53;">If you need to update your availability or have questions about your course, reply to our team at <a href="mailto:chinookdriving@gmail.com" style="color:#1d4ed8;text-decoration:none;font-weight:700;">chinookdriving@gmail.com</a>.</p>
              <p style="margin:0;font-size:12px;line-height:20px;color:#7b8794;">This is a confirmation of the information submitted through the enrollment form. © ' . $year . ' Chinook Driving School Calgary.</p>
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
function buildEnrollmentConfirmationText(array $input, ?string $enrollmentId = null): string
{
    $lines = [
        'Chinook Driving School Calgary',
        '',
        'Enrollment received for ' . formatStudentFullName($input),
        'Enrollment ID: ' . ($enrollmentId ?? 'Pending assignment'),
        'Session Type: ' . formatSessionTypeLabel($input['session_type'] ?? null),
        'Preferred Start Date: ' . formatDisplayDate($input['availability_date'] ?? null),
        'Preferred Days: ' . formatAvailabilityDays($input['availability_days_of_week'] ?? null),
        'Preferred Time Windows: ' . formatAvailabilityTimeSlots($input['avilability_time_slots'] ?? null),
        '',
        'Courses Selected:',
    ];

    foreach (normalizeEnrollmentCourses($input) as $courseItem) {
        $lines[] = '- ' . (string)($courseItem['name'] ?? 'Selected Course')
            . ' | Course: ' . formatCurrency($courseItem['course_price'] ?? 0)
            . ' | GST: ' . formatCurrency($courseItem['tax_amount'] ?? 0)
            . ' | Total: ' . formatCurrency($courseItem['total_amount'] ?? 0);
    }

    $lines[] = '';
    $lines[] = 'Amount Received in Form: ' . formatCurrency($input['amount'] ?? 0);
    $lines[] = '';
    $lines[] = 'Questions? Email chinookdriving@gmail.com';

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
 * Build the inquiry notification email HTML.
 */
function buildInquiryNotificationHtml(array $input): string
{
    $name = escapeHtml((string)($input['name'] ?? 'Not provided'));
    $email = escapeHtml((string)($input['email'] ?? 'Not provided'));
    $contactNumber = escapeHtml((string)($input['contact_number'] ?? 'Not provided'));
    $reason = escapeHtml((string)($input['reason'] ?? ''));
    $query = nl2br(escapeHtml((string)($input['query'] ?? '')));
    $submittedAt = gmdate('Y-m-d H:i:s') . ' UTC';

    return '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Chinook Inquiry</title>
</head>
<body style="margin:0;padding:24px;background-color:#f4f7fb;font-family:Arial,sans-serif;color:#102a43;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:640px;max-width:640px;background:#ffffff;border:1px solid #d9e2ec;border-radius:16px;">
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid #d9e2ec;background:#0b1f33;color:#ffffff;">
              <h1 style="margin:0;font-size:28px;line-height:36px;">New website inquiry</h1>
              <p style="margin:10px 0 0 0;font-size:14px;line-height:22px;color:#d9e2ec;">A visitor submitted the Chinook contact form.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px;">
              <p style="margin:0 0 12px 0;font-size:14px;line-height:22px;"><strong>Name:</strong> ' . $name . '</p>
              <p style="margin:0 0 12px 0;font-size:14px;line-height:22px;"><strong>Email:</strong> ' . $email . '</p>
              <p style="margin:0 0 12px 0;font-size:14px;line-height:22px;"><strong>Phone:</strong> ' . $contactNumber . '</p>
              <p style="margin:0 0 12px 0;font-size:14px;line-height:22px;"><strong>Reason:</strong> ' . ($reason !== '' ? $reason : 'Not provided') . '</p>
              <p style="margin:0 0 12px 0;font-size:14px;line-height:22px;"><strong>Submitted:</strong> ' . escapeHtml($submittedAt) . '</p>
              <div style="margin-top:18px;padding:16px;border:1px solid #d9e2ec;border-radius:12px;background:#f8fbff;">
                <p style="margin:0 0 8px 0;font-size:13px;line-height:20px;font-weight:700;text-transform:uppercase;color:#486581;">Message</p>
                <p style="margin:0;font-size:14px;line-height:24px;color:#243b53;">' . ($query !== '' ? $query : 'No message provided.') . '</p>
              </div>
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
 * Build the inquiry notification email text body.
 */
function buildInquiryNotificationText(array $input): string
{
    $lines = [
        'New website inquiry',
        '',
        'Name: ' . ((string)($input['name'] ?? 'Not provided')),
        'Email: ' . ((string)($input['email'] ?? 'Not provided')),
        'Phone: ' . ((string)($input['contact_number'] ?? 'Not provided')),
        'Reason: ' . ((string)($input['reason'] ?? 'Not provided')),
        'Submitted: ' . gmdate('Y-m-d H:i:s') . ' UTC',
        '',
        'Message:',
        ((string)($input['query'] ?? 'No message provided.')),
    ];

    return implode("\n", $lines);
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
        writeSmtpCommand($socket, 'DATA');
        expectSmtpResponse($socket, [354]);

        $mailParts = buildMailMessageParts(
            (string)$message['from_email'],
            (string)$message['from_name'],
            generateMultipartAlternativeBody((string)$message['html'], (string)$message['text']),
            (string)$message['to_email'],
            (string)$message['subject'],
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
    ?string $replyToEmail = null,
    ?string $replyToName = null
): array {
    $boundary = 'chinook-' . bin2hex(random_bytes(12));
    $headers = [
        'MIME-Version: 1.0',
        'From: ' . formatMailbox($fromEmail, $fromName),
        'Reply-To: ' . formatMailbox($replyToEmail ?? $fromEmail, $replyToName ?? $fromName),
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];

    if ($toEmail !== null) {
        $headers[] = 'To: ' . $toEmail;
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
 * Normalize the selected courses into a guaranteed non-empty list.
 *
 * @return array<int, array<string, mixed>>
 */
function normalizeEnrollmentCourses(array $input): array
{
    if (isset($input['courses']) && is_array($input['courses']) && count($input['courses']) > 0) {
        return $input['courses'];
    }

    if (isset($input['course']) && is_array($input['course'])) {
        return [$input['course']];
    }

    return [];
}

/**
 * Build summary rows for the email details card.
 */
function buildEmailSummaryRows(array $rows): string
{
    $html = '';
    foreach ($rows as $label => $value) {
        $html .= '
          <p style="margin:0 0 10px 0;font-size:14px;line-height:22px;color:#243b53;">
            <span style="display:inline-block;min-width:170px;font-weight:700;color:#102a43;">' . escapeHtml((string)$label) . ':</span>
            <span style="color:#486581;">' . escapeHtml((string)$value) . '</span>
          </p>';
    }

    return $html;
}

/**
 * Format the session type for human-friendly display.
 */
function formatSessionTypeLabel($value): string
{
    $normalizedValue = (string)$value;

    if ($normalizedValue === 'in_person') {
        return 'In Person';
    }

    if ($normalizedValue === 'online') {
        return 'Online';
    }

    if ($normalizedValue === 'not_applicable') {
        return 'Not Applicable';
    }

    return 'Not provided';
}

/**
 * Format the student name for display.
 */
function formatStudentFullName(array $input): string
{
    $parts = array_filter([
        sanitizeString((string)($input['student_first_name'] ?? '')),
        sanitizeString((string)($input['student_middle_name'] ?? '')),
        sanitizeString((string)($input['student_last_name'] ?? '')),
    ]);

    return count($parts) > 0 ? implode(' ', $parts) : 'there';
}

/**
 * Format a monetary amount in CAD style.
 */
function formatCurrency($amount): string
{
    return '$' . number_format((float)$amount, 2);
}

/**
 * Format a Y-m-d date for email display.
 */
function formatDisplayDate($date): string
{
    if (!is_string($date) || trim($date) === '' || !isValidDate(trim($date))) {
        return 'Not provided';
    }

    $dateObject = DateTime::createFromFormat('Y-m-d', trim($date));
    return $dateObject instanceof DateTime ? $dateObject->format('F j, Y') : trim($date);
}

/**
 * Format availability days for email display.
 */
function formatAvailabilityDays($days): string
{
    if (!is_array($days) || count($days) === 0) {
        return 'Not provided';
    }

    $labels = array_map(static function ($day): string {
        return ucfirst((string)$day);
    }, $days);

    return implode(', ', $labels);
}

/**
 * Format the submitted time slot objects for email display.
 */
function formatAvailabilityTimeSlots($slots): string
{
    if (!is_array($slots) || count($slots) === 0) {
        return 'Not provided';
    }

    $formattedSlots = [];
    foreach ($slots as $slot) {
        if (!is_array($slot)) {
            continue;
        }

        $startTime = formatClockTime($slot['start_time'] ?? null);
        $endTime = formatClockTime($slot['end_time'] ?? null);
        $formattedSlots[] = $startTime . ' - ' . $endTime;
    }

    return count($formattedSlots) > 0 ? implode(', ', $formattedSlots) : 'Not provided';
}

/**
 * Format an HH:MM style value to a 12-hour clock string.
 */
function formatClockTime($value): string
{
    if (!is_string($value) || trim($value) === '') {
        return 'Not provided';
    }

    $normalizedValue = trim($value);
    $dateTime = DateTime::createFromFormat('H:i:s', $normalizedValue)
        ?: DateTime::createFromFormat('H:i', $normalizedValue);

    return $dateTime instanceof DateTime ? $dateTime->format('g:i A') : $normalizedValue;
}

/**
 * Escape user-controlled values for safe HTML output.
 */
function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
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
