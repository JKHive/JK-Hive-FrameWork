<?php
declare(strict_types=1);
$jk_main_extra_class = isset($jk_main_extra_class) ? trim((string) $jk_main_extra_class) : '';
$jk_main_class = trim('jkhive-main-content ' . $jk_main_extra_class);
$hMain = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
  <main class="<?= $hMain($jk_main_class) ?>" id="main-content">
    <div class="jkhive-content-wrap">
      <div class="jkhive-page-container">
