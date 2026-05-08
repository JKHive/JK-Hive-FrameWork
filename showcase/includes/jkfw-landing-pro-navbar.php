<?php
declare(strict_types=1);

/**
 * Navbar superior: ítems hex (menú rápido landing pro).
 * Cada página fija `$jk_landing_pro_nav_active` en: home | about | gallery | contact
 */
$key = isset($jk_landing_pro_nav_active) ? (string) $jk_landing_pro_nav_active : '';
$jk_navbar_hex_nav = [
    ['href' => 'demo-landing-advanced.php', 'icon' => 'fas fa-house', 'tooltip' => 'Home', 'slug' => 'home'],
    ['href' => 'demo-landing-advanced-about.php', 'icon' => 'fas fa-id-card', 'tooltip' => 'About', 'slug' => 'about'],
    ['href' => 'demo-landing-advanced-gallery.php', 'icon' => 'fas fa-images', 'tooltip' => 'Galería', 'slug' => 'gallery'],
    ['href' => 'demo-landing-advanced-contact.php', 'icon' => 'fas fa-envelope', 'tooltip' => 'Contacto', 'slug' => 'contact'],
];

foreach ($jk_navbar_hex_nav as $i => $row) {
    $slug = (string) ($row['slug'] ?? '');
    if ($key !== '' && $slug === $key) {
        $jk_navbar_hex_nav[$i]['item_class'] = 'is-active';
    }
}
