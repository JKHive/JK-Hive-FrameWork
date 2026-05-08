<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/jkfw-config.php';

jkfw_shell_logout();
session_write_close();

header('Location: login.php?loggedout=1');
