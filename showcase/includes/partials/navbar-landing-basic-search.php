<?php
declare(strict_types=1);

/**
 * Navbar superior landing básica — mismo patrón visual que JK Hive público
 * (www/includes/layout-navbar.php): marca izquierda + buscador expandible.
 * Sin selector de idioma, sin campana/mensajes ni menú usuario (landing estática / vitrina).
 */
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$jk_brand_label = isset($jk_top_navbar_brand_label) && is_string($jk_top_navbar_brand_label) && $jk_top_navbar_brand_label !== ''
    ? $jk_top_navbar_brand_label
    : 'JK Hive';
$jk_brand_href = isset($jk_top_navbar_brand_href) && is_string($jk_top_navbar_brand_href) && $jk_top_navbar_brand_href !== ''
    ? $jk_top_navbar_brand_href
    : 'landingpage/basica/index.html';
?>
<nav class="jkhive-navbar jkhive-navbar--landing-basic-search" aria-label="<?= $h('Barra superior') ?>">
  <div class="jkhive-navbar-left">
    <h1 class="jkhive-navbar-title" onclick="window.location.href='<?= $h($jk_brand_href) ?>'" data-tooltip="<?= $h($jk_brand_label) ?>"><?= $h($jk_brand_label) ?></h1>
  </div>
  <div class="jkhive-navbar-right">
    <div class="jkhive-search-wrapper" id="searchWrapper">
      <div class="jkhive-search-expandable" id="searchExpandable">
        <div class="jkhive-search-input-row">
          <input type="text" id="searchInput" class="jkhive-search-input" placeholder="Buscar en el sitio..." autocomplete="off" />
          <button type="button" class="jkhive-search-close" id="searchCloseBtn" aria-label="<?= $h('Cerrar búsqueda') ?>" data-tooltip="<?= $h('Cerrar') ?>">×</button>
        </div>
        <div class="jkhive-search-results" id="searchResults"></div>
      </div>
      <div class="jkhive-navbar-hex-item" id="searchIcon" data-tooltip="<?= $h('Buscar') ?>" style="cursor: pointer;">
        <i class="fas fa-search"></i>
      </div>
    </div>
  </div>
</nav>
