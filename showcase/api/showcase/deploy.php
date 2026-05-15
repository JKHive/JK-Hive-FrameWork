<?php
declare(strict_types=1);

/**
 * Descarga ZIP del demo. Landing básica: sitio estático con tema horneado + assets completos.
 * Otros demos: manifiesto placeholder (en evolución).
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

$theme = isset($_GET['theme']) ? trim((string) $_GET['theme']) : jkfw_theme_resolve();
if (! in_array($theme, jkfw_valid_theme_slugs(), true)) {
    $theme = 'canonical';
}

$hTheme = htmlspecialchars($theme, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

if ($demo === 'demo-landing-simple.php') {
    $showcaseRoot = dirname(__DIR__, 2);
    $zipPath = tempnam(sys_get_temp_dir(), 'jkfw');
    $zip = new ZipArchive();
    if ($zip->open($zipPath, ZipArchive::OVERWRITE) !== true) {
        http_response_code(500);
        header('Content-Type: text/plain; charset=UTF-8');
        echo 'No se pudo crear el ZIP';

        exit;
    }

    jkfw_deploy_add_landing_basica_to_zip($zip, $showcaseRoot, $theme, $hTheme);
    $zip->addFromString(
        'README-JKLP-BASICA.txt',
        "JK Hive — landing básica (exportación)\nTema horneado: {$theme}\n\nAbre index.html desde un servidor HTTP local (las rutas son relativas a esta carpeta).\n"
    );
    $zip->close();

    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="' . rawurlencode('jklp-basica-' . $theme . '-jkfw.zip') . '"');
    header('Content-Length: ' . (string) filesize($zipPath));
    readfile($zipPath);
    unlink($zipPath);

    exit;
}

$baseName = preg_replace('/\.php$/', '', $demo);
$readme = <<<TXT
JK Hive Framework — paquete deploy (preview)
Demo origen: {$demo}

Este ZIP es un marcador de posición: la selección de archivos mínimos por nivel
(básico / estándar / avanzado) se completará en el generador de paquetes.

Tema solicitado (referencia): {$theme}
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
    json_encode(['demo' => $demo, 'theme' => $theme, 'generated' => gmdate('c')], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n"
);
$zip->close();

header('Content-Type: application/zip');
header('Content-Disposition: attachment; filename="' . rawurlencode($baseName) . '-jkfw-deploy.zip"');
header('Content-Length: ' . (string) filesize($zipPath));
readfile($zipPath);
unlink($zipPath);

/**
 * @param ZipArchive $zip
 */
function jkfw_deploy_add_landing_basica_to_zip($zip, string $showcaseRoot, string $theme, string $themeEsc): void
{
    $basicaDir = $showcaseRoot . DIRECTORY_SEPARATOR . 'landingpage' . DIRECTORY_SEPARATOR . 'basica';
    $assetsDir = $showcaseRoot . DIRECTORY_SEPARATOR . 'assets';

    $bake = static function (string $raw) use ($theme, $themeEsc): string {
        $raw = preg_replace('#<script[^>]*jklp-theme\.js[^>]*>\s*</script>#i', '', $raw);
        $raw = str_replace('../../assets/', 'assets/', $raw);
        $raw = preg_replace('/data-jkfw-theme="[^"]*"/i', 'data-jkfw-theme="' . $themeEsc . '"', $raw, 1);
        $raw = preg_replace_callback(
            '/<body\s+class="([^"]*)"/i',
            static function (array $m) use ($themeEsc): string {
                $cls = trim((string) preg_replace('/\bjkfw-theme-[a-z0-9_-]+\b/i', '', $m[1]));

                return '<body class="' . trim($cls . ' jkfw-theme-' . $themeEsc) . '"';
            },
            $raw,
            1
        );

        return $raw;
    };

    foreach (['index.html', 'about.html', 'gallery.html', 'contact.html'] as $fn) {
        $path = $basicaDir . DIRECTORY_SEPARATOR . $fn;
        if (! is_readable($path)) {
            continue;
        }
        $raw = (string) file_get_contents($path);
        $zip->addFromString($fn, $bake($raw));
    }

    if (! is_dir($assetsDir)) {
        return;
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($assetsDir, FilesystemIterator::SKIP_DOTS)
    );
    foreach ($iterator as $f) {
        /** @var SplFileInfo $f */
        if (! $f->isFile()) {
            continue;
        }
        $sub = substr($f->getPathname(), strlen($assetsDir) + 1);
        $zipPathInner = 'assets/' . str_replace('\\', '/', $sub);
        $zip->addFile($f->getPathname(), $zipPathInner);
    }

    $localCss = $basicaDir . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'css' . DIRECTORY_SEPARATOR . 'jklp-basic-local.css';
    if (is_readable($localCss)) {
        $zip->addFromString('assets/css/jklp-basic-local.css', (string) file_get_contents($localCss));
    }

    $localGalCss = $basicaDir . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'css' . DIRECTORY_SEPARATOR . 'jklp-galleries.css';
    if (is_readable($localGalCss)) {
        $zip->addFromString('assets/css/jklp-galleries.css', (string) file_get_contents($localGalCss));
    }

    $localGalJs = $basicaDir . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'js' . DIRECTORY_SEPARATOR . 'jklp-galleries.js';
    if (is_readable($localGalJs)) {
        $zip->addFromString('assets/js/jklp-galleries.js', (string) file_get_contents($localGalJs));
    }

    $localContact = $basicaDir . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'js' . DIRECTORY_SEPARATOR . 'jklp-contact.js';
    if (is_readable($localContact)) {
        $zip->addFromString('assets/js/jklp-contact.js', (string) file_get_contents($localContact));
    }
}
