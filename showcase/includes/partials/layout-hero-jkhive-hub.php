<?php
declare(strict_types=1);
/** Hero JK Hive hub + barra colapsada + animación satélites (assets: hero-collapse, hero-honeycomb-bar-jkhive, jkhive-hub-hero-animation). */
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$jk_hero_title = $jk_hero_title ?? 'JK Hive Framework';
$jk_hero_tagline = $jk_hero_tagline ?? 'Showcase oficial: grilla, tooltips, toasts, tablas admin hex y modales.';
$jk_hero_ring = $jk_hero_ring ?? [
    ['order' => 0, 'href' => 'users.php', 'tip' => 'Usuarios', 'icon' => 'fas fa-users'],
    ['order' => 1, 'href' => 'products.php', 'tip' => 'Productos', 'icon' => 'fas fa-box'],
    ['order' => 2, 'href' => 'messaging.php', 'tip' => 'Mensajería', 'icon' => 'fas fa-comments'],
    ['order' => 3, 'href' => 'about.php', 'tip' => 'About', 'icon' => 'fas fa-info-circle'],
    ['order' => 4, 'href' => 'contact.php', 'tip' => 'Contacto', 'icon' => 'fas fa-envelope'],
    ['order' => 5, 'href' => 'index.php', 'tip' => 'Inicio', 'icon' => 'fas fa-home'],
];
?>
        <section id="inicio" class="hero-section hero-jkhive-hub jkhive-hub-hero-anim-enabled" aria-label="Cabecera JK Hive">
          <div class="hero-inner hero-jkhive-inner-stack">
            <h1 class="hero-title hero-jkhive-hero-name"><?= $h($jk_hero_title) ?></h1>
            <div class="hero-jkhive-hub-cluster">
              <div class="hero-logo-wrapper">
                <a
                  href="index.php"
                  class="jkhive-hero-logo-link"
                  data-tooltip="Inicio showcase"
                  style="text-decoration:none;color:inherit;pointer-events:auto;display:inline-flex;align-items:center;justify-content:center;"
                  aria-label="Inicio showcase"
                >
                  <div class="jkhive-editorial-hero-logo">
                    <div class="jkhive-hex jkhive-hex-jkhive-face">
                      <div class="jkhive-hex-content">
                        <div class="jkhive-logo-editorial-head">
                          <div class="jkhive-logo-main jkhive-logo-main-jkhive">JK</div>
                          <div class="jkhive-logo-divider jkhive-logo-divider-jkhive"></div>
                        </div>
                        <div class="jkhive-logo-sub jkhive-logo-sub-jkhive">HIVE</div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
<?php foreach ($jk_hero_ring as $ring) :
    $o = (int) ($ring['order'] ?? 0);
    $href = $h((string) ($ring['href'] ?? '#'));
    $tip = $h((string) ($ring['tip'] ?? ''));
    $icon = $h((string) ($ring['icon'] ?? 'fas fa-circle'));
    ?>
              <div class="jkhive-bttn-big hero-hub-ring-item" data-hub-order="<?= $o ?>">
                <a href="<?= $href ?>" data-tooltip="<?= $tip ?>">
                  <div class="jkhive-hex">
                    <div class="jkhive-hex-content jkhive-hex-content-editorial">
                      <i class="jkhive-hex-icon <?= $icon ?>"></i>
                    </div>
                  </div>
                </a>
              </div>
<?php endforeach; ?>
            </div>
            <p class="hero-subtitle hero-jkhive-hero-tagline"><?= $h($jk_hero_tagline) ?></p>
          </div>
        </section>
        <div id="hero-spacer" class="hero-collapse-spacer" aria-hidden="true"></div>
