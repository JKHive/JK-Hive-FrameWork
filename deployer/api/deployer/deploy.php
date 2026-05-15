<?php
declare(strict_types=1);

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
    $deployRoot = dirname(__DIR__, 2);
    $zipPath = tempnam(sys_get_temp_dir(), 'jkfw');
    $zip = new ZipArchive();
    if ($zip->open($zipPath, ZipArchive::OVERWRITE) !== true) {
        http_response_code(500);
        header('Content-Type: text/plain; charset=UTF-8');
        echo 'No se pudo crear el ZIP';

        exit;
    }

    jkfw_deploy_add_landing_basica_to_zip($zip, $deployRoot, $theme, $hTheme);
    $zip->close();

    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="' . rawurlencode('jkhive-landingpage-basica-' . $theme . '.zip') . '"');
    header('Content-Length: ' . (string) filesize($zipPath));
    readfile($zipPath);
    unlink($zipPath);

    exit;
}

$baseName = preg_replace('/\.php$/', '', $demo);
$zipPath = tempnam(sys_get_temp_dir(), 'jkfw');
$zip = new ZipArchive();
if ($zip->open($zipPath, ZipArchive::OVERWRITE) !== true) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'No se pudo crear el ZIP';

    exit;
}

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

function jkfw_deploy_add_landing_basica_to_zip(ZipArchive $zip, string $deployRoot, string $theme, string $themeEsc): void
{
    $zipRoot = 'jkhive-landingpage-basica/';
    $basicaDir = $deployRoot . DIRECTORY_SEPARATOR . 'landingpage' . DIRECTORY_SEPARATOR . 'basica';
    $assetsDir = $deployRoot . DIRECTORY_SEPARATOR . 'assets';

    $bake = static function (string $raw) use ($themeEsc): string {
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
        $zip->addFromString($zipRoot . $fn, $bake($raw));
    }

    if (! is_dir($assetsDir)) {
        return;
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($assetsDir, FilesystemIterator::SKIP_DOTS)
    );
    foreach ($iterator as $f) {
        if (! $f->isFile()) {
            continue;
        }
        $sub = substr($f->getPathname(), strlen($assetsDir) + 1);
        $zipPathInner = $zipRoot . 'assets/' . str_replace('\\', '/', $sub);
        $zip->addFile($f->getPathname(), $zipPathInner);
    }

    $localCss = $basicaDir . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'css' . DIRECTORY_SEPARATOR . 'jklp-basic-local.css';
    if (is_readable($localCss)) {
        $zip->addFromString($zipRoot . 'assets/css/jklp-basic-local.css', (string) file_get_contents($localCss));
    }

    $localGalCss = $basicaDir . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'css' . DIRECTORY_SEPARATOR . 'jklp-galleries.css';
    if (is_readable($localGalCss)) {
        $zip->addFromString($zipRoot . 'assets/css/jklp-galleries.css', (string) file_get_contents($localGalCss));
    }

    $localGalJs = $basicaDir . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'js' . DIRECTORY_SEPARATOR . 'jklp-galleries.js';
    if (is_readable($localGalJs)) {
        $zip->addFromString($zipRoot . 'assets/js/jklp-galleries.js', (string) file_get_contents($localGalJs));
    }

    $localContact = $basicaDir . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'js' . DIRECTORY_SEPARATOR . 'jklp-contact.js';
    if (is_readable($localContact)) {
        $zip->addFromString($zipRoot . 'assets/js/jklp-contact.js', (string) file_get_contents($localContact));
    }
}
