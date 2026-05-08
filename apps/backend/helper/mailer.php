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
    $htmlBody = buildEnrollmentConfirmationHtml();
    $textBody = buildEnrollmentConfirmationText();

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
