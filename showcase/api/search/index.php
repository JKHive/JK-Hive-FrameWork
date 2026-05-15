<?php
declare(strict_types=1);

/**
 * Búsqueda landing básica (navbar expandible).
 * Respuesta compatible con assets/js/jkhive-navbar.js SearchSystem.
 */
header('Content-Type: application/json; charset=utf-8');

$q = isset($_GET['q']) ? trim((string) $_GET['q']) : '';
if (mb_strlen($q) < 2) {
    echo json_encode(['success' => true, 'data' => ['products' => [], 'services' => [], 'books' => []]], JSON_UNESCAPED_UNICODE);
    exit;
}

/** @var list<array{title:string,subtitle:string,url:string,icon:string,context:string,hay:string}> $rows */
$rows = [
    [
        'title' => 'Landing básica CANON',
        'subtitle' => 'Home (demo PHP)',
        'url' => 'demo-landing-simple.php',
        'icon' => 'fa-house',
        'context' => 'Landing',
        'hay' => 'landing básica canon home inicio servicios destacados noticias clientes ventajas carrusel',
    ],
    [
        'title' => 'About — Quiénes somos',
        'subtitle' => 'Demo PHP',
        'url' => 'demo-landing-simple-about.php',
        'icon' => 'fa-id-badge',
        'context' => 'Landing',
        'hay' => 'about sobre nosotros institucional quiénes somos misión',
    ],
    [
        'title' => 'Contacto',
        'subtitle' => 'Demo PHP',
        'url' => 'demo-landing-simple-contact.php',
        'icon' => 'fa-envelope',
        'context' => 'Landing',
        'hay' => 'contacto formulario email mensaje ubicación teléfono',
    ],
    [
        'title' => 'Galería',
        'subtitle' => 'Demo PHP → HTML',
        'url' => 'demo-landing-simple-gallery.php',
        'icon' => 'fa-images',
        'context' => 'Landing',
        'hay' => 'galería fotos imágenes portfolio vitrina',
    ],
    [
        'title' => 'Landing básica CANON',
        'subtitle' => 'Home (HTML estático)',
        'url' => 'landingpage/basica/index.html',
        'icon' => 'fa-house',
        'context' => 'Estático',
        'hay' => 'landing básica canon home inicio servicios destacados noticias clientes ventajas carrusel',
    ],
    [
        'title' => 'About — Quiénes somos',
        'subtitle' => 'HTML estático',
        'url' => 'landingpage/basica/about.html',
        'icon' => 'fa-id-badge',
        'context' => 'Estático',
        'hay' => 'about sobre nosotros institucional quiénes somos misión',
    ],
    [
        'title' => 'Contacto',
        'subtitle' => 'HTML estático',
        'url' => 'landingpage/basica/contact.html',
        'icon' => 'fa-envelope',
        'context' => 'Estático',
        'hay' => 'contacto formulario email mensaje ubicación teléfono',
    ],
    [
        'title' => 'Galería',
        'subtitle' => 'HTML estático',
        'url' => 'landingpage/basica/gallery.html',
        'icon' => 'fa-images',
        'context' => 'Estático',
        'hay' => 'galería fotos imágenes portfolio vitrina',
    ],
];

$services = [];
foreach ($rows as $r) {
    if (mb_stripos($r['hay'], $q, 0, 'UTF-8') === false
        && mb_stripos($r['title'], $q, 0, 'UTF-8') === false
        && mb_stripos($r['subtitle'], $q, 0, 'UTF-8') === false) {
        continue;
    }
    $services[] = [
        'id' => count($services) + 1,
        'title' => $r['title'],
        'subtitle' => $r['subtitle'],
        'url' => $r['url'],
        'icon' => $r['icon'],
        'context' => $r['context'],
    ];
}

echo json_encode([
    'success' => true,
    'data' => [
        'products' => [],
        'services' => $services,
        'books' => [],
    ],
], JSON_UNESCAPED_UNICODE);
