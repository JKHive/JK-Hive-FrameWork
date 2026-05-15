<?php
declare(strict_types=1);

$jk_landing_simple_nav_active = isset($jk_landing_simple_nav_active) ? (string) $jk_landing_simple_nav_active : 'home';
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$jkSimpleNavItems = [
    ['id' => 'home', 'href' => 'landingpage/basica/index.html', 'tip' => 'Home', 'icon' => 'fas fa-house'],
    ['id' => 'about', 'href' => 'landingpage/basica/about.html', 'tip' => 'About', 'icon' => 'fas fa-id-badge'],
    ['id' => 'gallery', 'href' => 'landingpage/basica/gallery.html', 'tip' => 'Galería', 'icon' => 'fas fa-images'],
    ['id' => 'contact', 'href' => 'landingpage/basica/contact.html', 'tip' => 'Contacto', 'icon' => 'fas fa-envelope'],
];
?>
<div id="jkhive-sidebar-container">
  <div id="jkhive-logo-square" class="jkhive-logo-square">
    <div class="jkhive-sidebar-logo">
      <a href="landingpage/basica/index.html" data-tooltip="Home">
        <div class="jkhive-hex jkhive-hex-jkhive-face">
          <div class="jkhive-hex-content">
            <div class="jkhive-logo-editorial-head">
              <div class="jkhive-logo-main jkhive-logo-main-jkhive">JK</div>
              <div class="jkhive-logo-divider jkhive-logo-divider-jkhive"></div>
            </div>
            <div class="jkhive-logo-sub jkhive-logo-sub-jkhive">HIVE</div>
          </div>
        </div>
      </a>
    </div>
  </div>
  <aside id="jkhive-sidebar" class="jkhive-sidebar">
    <nav class="jkhive-nav-items">
      <?php foreach ($jkSimpleNavItems as $it) :
          $active = $it['id'] === $jk_landing_simple_nav_active ? 'active' : '';
          ?>
      <div class="jkhive-nav-item <?= $h($active) ?>">
        <a href="<?= $h($it['href']) ?>" data-tooltip="<?= $h($it['tip']) ?>">
          <div class="jkhive-hex">
            <div class="jkhive-hex-content jkhive-hex-content-editorial">
              <i class="jkhive-hex-icon <?= $h((string) $it['icon']) ?>"></i>
            </div>
          </div>
        </a>
      </div>
      <?php endforeach; ?>
    </nav>
  </aside>
</div>
