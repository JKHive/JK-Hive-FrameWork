<?php
declare(strict_types=1);

require_once __DIR__ . '/jkfw-config.php';

if (! empty($jk_hide_sidebar)) {
    return;
}

$jk_nav = $jk_nav ?? 'home';

$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$items = jkfw_sidebar_items();
?>
  <div id="jkhive-sidebar-container">
    <div id="jkhive-logo-square" class="jkhive-logo-square">
      <div class="jkhive-sidebar-logo">
        <a href="index.php" data-tooltip="Inicio showcase">
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
        <?php foreach ($items as $it) :
            $active = ($it['id'] === $jk_nav) ? 'active' : '';
            ?>
        <div class="jkhive-nav-item <?= $active ?>">
          <a href="<?= $h($it['href']) ?>" data-tooltip="<?= $h($it['tooltip']) ?>">
            <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><i class="jkhive-hex-icon <?= $h($it['icon']) ?>"></i></div></div>
          </a>
        </div>
        <?php endforeach; ?>
      </nav>
    </aside>
  </div>
