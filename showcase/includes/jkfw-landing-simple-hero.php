<?php
declare(strict_types=1);

$jk_landing_simple_hero_title = isset($jk_landing_simple_hero_title) ? (string) $jk_landing_simple_hero_title : 'Landing básica';
$jk_landing_simple_hero_subtitle = isset($jk_landing_simple_hero_subtitle) ? (string) $jk_landing_simple_hero_subtitle : '';
$jk_landing_simple_hero_id = isset($jk_landing_simple_hero_id) && $jk_landing_simple_hero_id !== ''
    ? (string) $jk_landing_simple_hero_id
    : 'jkfw-landing-simple-hero-title';

$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
<section class="hero-section jkfw-landing-basic-hero jkhive-surface-panel-honeycomb-sm" aria-labelledby="<?= $h($jk_landing_simple_hero_id) ?>">
  <div class="jkfw-landing-basic-hero-logo">
    <a href="demo-landing-simple.php" class="jkhive-hero-logo-link" data-tooltip="Home landing básica" aria-label="Home landing básica">
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
  <h1 id="<?= $h($jk_landing_simple_hero_id) ?>" class="jkfw-landing-basic-hero-title"><?= $h($jk_landing_simple_hero_title) ?></h1>
  <?php if ($jk_landing_simple_hero_subtitle !== '') : ?>
  <p class="jkfw-landing-basic-hero-subtitle"><?= $h($jk_landing_simple_hero_subtitle) ?></p>
  <?php endif; ?>
</section>
