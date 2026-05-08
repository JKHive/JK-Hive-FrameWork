<?php
declare(strict_types=1);

require_once __DIR__ . '/jkfw-config.php';

/**
 * Ítem tipo galería hex (launcher / demos locales).
 *
 * @return string HTML
 */
function jkfw_launcher_hex_link(string $href, string $iconClass, string $title, string $hint = '', string $size = 'jkhive-itemgallery-med', string $skin = 'jkhive-hex-cyan-item'): string
{
    $h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $openLabel = $h('Abrir: ' . $title);

    return '<div class="jkfw-launcher-hexlink jkfw-launcher-hex-with-cta ' . $h($size) . '" role="group" aria-label="' . $h($title) . '">' .
        '<div class="jkhive-hex ' . $h($skin) . '">' .
          '<div class="jkhive-hex-content jkhive-hex-content-editorial jkhive-hex-item">' .
            '<div class="jkhive-hex-item-head">' .
              '<div class="jkhive-hex-item-head-tip"></div>' .
              '<div class="jkhive-hex-item-head-main">' .
                '<i class="jkhive-hex-gallery-icon ' . $h($iconClass) . '"></i>' .
              '</div>' .
            '</div>' .
            '<div class="jkhive-hex-item-body">' .
              '<div class="jkhive-hex-item-body-scroll">' .
                '<div class="jkfw-launcher-hex-body-copy">' .
                  '<div class="jkhive-hex-gallery-title">' . $h($title) . '</div>' .
                  '<div class="jkhive-hex-gallery-subtitle">' . $h($hint) . '</div>' .
                '</div>' .
              '</div>' .
            '</div>' .
            '<div class="jkhive-hex-item-foot jkfw-launcher-hex-foot-cta">' .
              '<div class="jkhive-hex-item-foot-main">' .
                '<div class="jkfw-btn-scope jkfw-jkhive-cta-sm-slot">' .
                  '<div class="jkhive-admoptions-bttn jkhive-bttn-sm jkhive-btn-anim-shake jkfw-jkhive-cta-sm" data-tooltip="' . $openLabel . '">' .
                    '<a href="' . $h($href) . '" class="jkhive-bttn-inner" aria-label="' . $openLabel . '">' .
                      '<div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-door-open" aria-hidden="true"></i></div></div>' .
                    '</a>' .
                  '</div>' .
                '</div>' .
              '</div>' .
              '<div class="jkhive-hex-item-foot-tip"></div>' .
            '</div>' .
          '</div>' .
        '</div>' .
      '</div>';
}

/**
 * Landing básica: sin enlace global; solo `jkhive-btn-hex-h` internos.
 *
 * @param array<string,string> $themeLabels
 */
function jkfw_launcher_landing_basic_theme_hex(array $themeLabels, string $activeTheme): string
{
    $h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $themeLinks = '';
    $ti = 0;
    foreach (jkfw_valid_theme_slugs() as $tid) {
        ++$ti;
        $lab = $themeLabels[$tid] ?? $tid;
        $spinAlt = ($ti % 2 === 0) ? ' jkhive-btn-hex-h--spin-rev' : '';
        $tip = $h('Tema: ' . $lab);
        $themeLinks .=
            '<a class="jkhive-btn-hex-h jkhive-btn-hex-h--fixed' . $spinAlt . '" href="demo-landing-simple.php?theme=' . $h($tid) . '" data-tooltip="' . $tip . '">' .
            '<span class="jkhive-btn-hex-h__inner" aria-hidden="true"></span>' .
            '<span class="jkhive-btn-hex-h__spin">' .
            '<i class="jkhive-btn-hex-h__icon fas fa-palette" aria-hidden="true"></i>' .
            '<span class="jkhive-btn-hex-h__label">' . $h($lab) . '</span></span></a>';
    }

    return
      '<div class="jkfw-launcher-hexlink jkhive-itemgallery-med jkfw-launcher-landing-card">' .
        '<div class="jkhive-hex jkhive-hex-cyan-item">' .
          '<div class="jkhive-hex-content jkhive-hex-content-editorial jkhive-hex-item">' .
            '<div class="jkhive-hex-item-head">' .
              '<div class="jkhive-hex-item-head-tip"></div>' .
              '<div class="jkhive-hex-item-head-main">' .
                '<i class="jkhive-hex-gallery-icon fas fa-leaf"></i>' .
              '</div>' .
            '</div>' .
            '<div class="jkhive-hex-item-body">' .
              '<div class="jkhive-hex-item-body-scroll">' .
                '<div class="jkfw-launcher-hex-body-copy">' .
                  '<div class="jkhive-hex-gallery-title">Landing básica</div>' .
                  '<div class="jkhive-hex-gallery-subtitle">Home/About/Galería/Contacto, responsive, html5+php+js.</div>' .
                '</div>' .
                '<div class="jkfw-btn-scope jkfw-theme-hexh-wrap">' . $themeLinks . '</div>' .
              '</div>' .
            '</div>' .
            '<div class="jkhive-hex-item-foot jkfw-launcher-hex-foot-empty" aria-hidden="true">' .
              '<div class="jkhive-hex-item-foot-main"></div>' .
              '<div class="jkhive-hex-item-foot-tip"></div>' .
            '</div>' .
          '</div>' .
        '</div>' .
      '</div>';
}

/** Botón tema horizontal estático (p. ej. panel admin landing pro). */
function jkfw_admin_theme_horizontal_link(string $slug, string $label, bool $active): string
{
    $h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $ac = $active ? ' is-active' : '';
    $tip = $h('Tema: ' . $label);

    return '<a class="jkhive-btn-hex-h jkhive-btn-hex-h--fixed' . $ac . '" href="demo-landing-advanced.php?theme=' . $h($slug) . '" data-tooltip="' . $tip . '">' .
        '<span class="jkhive-btn-hex-h__inner" aria-hidden="true"></span>' .
        '<span class="jkhive-btn-hex-h__spin">' .
        '<i class="jkhive-btn-hex-h__icon fas fa-palette" aria-hidden="true"></i>' .
        '<span class="jkhive-btn-hex-h__label">' . $h($label) . '</span></span></a>';
}
