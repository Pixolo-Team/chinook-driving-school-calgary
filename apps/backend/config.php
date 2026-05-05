<?php
declare(strict_types=1);

/**
 * Backend configuration for Chinook PHP endpoints.
 *
 * Keep this file safe to commit. Put real secrets in:
 * - apps/backend/config.local.php
 * - or server environment variables
 */

$chinookConfig = [
    'SMTP_HOST' => '',
    'SMTP_PORT' => '587',
    'SMTP_USER' => '',
    'SMTP_PASS' => '',
    'SMTP_SECURE' => 'tls',
    'SMTP_TIMEOUT' => '15',
    'SMTP_FROM_EMAIL' => 'chinook@pixolotechnologies.com',
    'SMTP_FROM_NAME' => 'Chinook Driving School Calgary',
    'SMTP_FROM' => 'Chinook Driving School Calgary',
    'SMTP_FROM_EMAIL' => 'chinook@pixolotechnologies.com',
    'MAIL_FROM_NAME' => 'Chinook Driving School Calgary',
    'INQUIRY_NOTIFICATION_EMAIL' => '',
    'CONTACT_NOTIFICATION_EMAIL' => '',
];

$localConfigPath = __DIR__ . '/config.local.php';
if (is_file($localConfigPath)) {
    $localConfig = require $localConfigPath;
    if (is_array($localConfig)) {
        $chinookConfig = array_merge($chinookConfig, $localConfig);
    }
}

foreach (array_keys($chinookConfig) as $configKey) {
    $envValue = getenv($configKey);
    if ($envValue !== false && $envValue !== '') {
        $chinookConfig[$configKey] = $envValue;
    }
}

function chinookConfig(string $key, mixed $default = null): mixed
{
    global $chinookConfig;

    if (isset($chinookConfig[$key]) && $chinookConfig[$key] !== '') {
        return $chinookConfig[$key];
    }

    return $default;
}

if (!defined('SUPABASE_URL')) {
    define('SUPABASE_URL', (string) chinookConfig('SUPABASE_URL', ''));
}

if (!defined('SUPABASE_SERVICE_ROLE_KEY')) {
    define('SUPABASE_SERVICE_ROLE_KEY', (string) chinookConfig('SUPABASE_SERVICE_ROLE_KEY', ''));
}
