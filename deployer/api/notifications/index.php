<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

require_once dirname(__DIR__, 2) . '/includes/jkfw-config.php');

if (! jkfw_shell_session_logged_in()) {
    http_response_code(401);
    echo json_encode(
        ['success' => false, 'message' => 'No autenticado en showcase shell'],
        JSON_UNESCAPED_UNICODE
    );
    return;
}

$msgUnread = getMockUnreadMessagesEstimate();

$purchases = 0;
$donations = 0;
$users = 0;
$total = $msgUnread + $purchases + $donations + $users;

echo json_encode(
    [
        'success' => true,
        'data' => [
            'messages_unread' => $msgUnread,
            'purchases_new' => $purchases,
            'donations_new' => $donations,
            'users_new' => $users,
            'total' => $total,
        ],
    ],
    JSON_UNESCAPED_UNICODE
);

/**
 * Bandeja demo: al menos un hilo no leído para que la campana muestre actividad en sync con messaging mock.
 *
 * @return int
 */
function getMockUnreadMessagesEstimate(): int
{
    return 1;
}
