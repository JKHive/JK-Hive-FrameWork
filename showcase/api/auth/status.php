<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

require_once dirname(__DIR__, 2) . '/includes/jkfw-config.php';

$payload = [
    'success' => true,
    'authenticated' => jkfw_shell_session_logged_in(),
    'user' => null,
];

if ($payload['authenticated']) {
    $payload['user'] = [
        'id' => 42,
        'username' => 'Visita Showcase',
        'email' => 'demo@jkhive.local',
        'profile_slug' => 'administrator',
        'profile_level' => 3,
        'profile_name' => 'Administrador demo',
    ];
} else {
    $payload['user'] = [
        'profile_slug' => 'guest',
        'username' => 'Invitado',
        'profile_name' => 'Invitado',
        'unique_id' => '00000000-0000-0000-0000-000000000001',
    ];
}

echo json_encode($payload, JSON_UNESCAPED_UNICODE);
