<?php
declare(strict_types=1);

/**
 * Descarga ZIP provisional con manifiesto del demo (paquete mínimo por tier: en desarrollo).
 * Solo super admin (sesión showcase).
 */

require_once dirname(__DIR__, 2) . '/includes/jkfw-config.php';

if (! jkfw_shell_is_super_admin()) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Forbidden';

    exit;
}

$demo = isset($_GET['demo']) ? (string) $_GET['demo'] : '';
$demo = basename($demo);
if ($demo === '' || ! in_array($demo, jkfw_showcase_deploy_demo_pages(), true)) {
    http_response_code(400);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Bad request';

    exit;
}

if (! class_exists('ZipArchive')) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'ZipArchive no disponible en este servidor';

    exit;
}

$baseName = preg_replace('/\.php$/', '', $demo);
$readme = <<<TXT
JK Hive Framework — paquete deploy (preview)
Demo origen: {$demo}

Este ZIP es un marcador de posición: la selección de archivos mínimos por nivel
(básico / estándar / avanzado) se completará en el generador de paquetes.

No incluye todavía la matriz de recortes por tier.
TXT;

$zipPath = tempnam(sys_get_temp_dir(), 'jkfw');
$zip = new ZipArchive();
if ($zip->open($zipPath, ZipArchive::OVERWRITE) !== true) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'No se pudo crear el ZIP';

    exit;
}

$zip->addFromString('README-DEPLOY.txt', $readme);
$zip->addFromString(
    'manifest.json',
    json_encode(['demo' => $demo, 'generated' => gmdate('c')], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n"
);
$zip->close();

header('Content-Type: application/zip');
header('Content-Disposition: attachment; filename="' . rawurlencode($baseName) . '-jkfw-deploy.zip"');
header('Content-Length: ' . (string) filesize($zipPath));
readfile($zipPath);
unlink($zipPath);
