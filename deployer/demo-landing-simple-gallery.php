<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/jkfw-config.php';

$theme = jkfw_theme_resolve();
header(
    'Location: landingpage/basica/gallery.html?theme=' . rawurlencode($theme),
    true,
    302
);
exit;
