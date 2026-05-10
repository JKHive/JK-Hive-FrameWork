<?php
declare(strict_types=1);

require_once __DIR__ . '/jkfw-config.php';

$jk_main_extra_class = isset($jk_main_extra_class) ? trim((string) $jk_main_extra_class) : '';
$jk_main_class = trim('jkhive-main-content ' . $jk_main_extra_class);
$hMain = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
  <main class="<?= $hMain($jk_main_class) ?>" id="main-content">
    <?php require __DIR__ . '/partials/showcase-deploy-strip.php'; ?>
    <div class="jkhive-content-wrap">
      <div class="jkhive-page-container">
