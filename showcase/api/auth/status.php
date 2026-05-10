<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

require_once dirname(__DIR__, 2) . '/includes/jkfw-config.php';

$ssr = jkfw_shell_ssr_auth_payload();

$payload = [
    'success' => true,
    'authenticated' => $ssr['authenticated'],
    'user' => null,
];

if ($ssr['authenticated']) {
    /** @var array<string, mixed> $u */
    $u = $ssr['user'];
    $payload['user'] = [
        'id' => $u['id'] ?? 42,
        'username' => $u['username'] ?? '',
        'email' => $u['email'] ?? '',
        'profile_slug' => $u['profile_slug'] ?? 'administrator',
        'profile_level' => (int) ($u['profile_level'] ?? 0),
        'profile_name' => $u['profile_name'] ?? '',
        'is_super_admin' => ! empty($u['is_super_admin']),
    ];
} else {
    /** @var array<string, mixed> $u */
    $u = $ssr['user'];
    $payload['user'] = [
        'profile_slug' => $u['profile_slug'] ?? 'guest',
        'username' => $u['username'] ?? 'Invitado',
        'profile_name' => $u['profile_name'] ?? 'Invitado',
        'unique_id' => $u['unique_id'] ?? '00000000-0000-0000-0000-000000000001',
        'profile_level' => (int) ($u['profile_level'] ?? 0),
        'is_super_admin' => ! empty($u['is_super_admin']),
    ];
}

echo json_encode($payload, JSON_UNESCAPED_UNICODE);
