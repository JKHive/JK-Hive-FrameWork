<?php
declare(strict_types=1);

/** @var mixed $jk_navbar_hex_nav */
$jk_navbar_hex_nav = isset($jk_navbar_hex_nav) && is_array($jk_navbar_hex_nav) ? $jk_navbar_hex_nav : [];

if ($jk_navbar_hex_nav === []) {
    return;
}

$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
<div class="jkfw-navbar-hex-cluster" role="navigation" aria-label="Secciones landing">
<?php foreach ($jk_navbar_hex_nav as $row) :
    $href = isset($row['href']) ? (string) $row['href'] : '#';
    $icon = isset($row['icon']) ? (string) $row['icon'] : 'fas fa-circle';
    $tip = isset($row['tooltip']) ? (string) $row['tooltip'] : '';
    $icls = isset($row['item_class']) ? trim((string) $row['item_class']) : '';
    ?>
  <a href="<?= $h($href) ?>" class="jkhive-navbar-hex-item<?= $icls !== '' ? ' ' . $h($icls) : '' ?>" data-tooltip="<?= $h($tip) ?>" aria-label="<?= $h($tip) ?>"><i class="<?= $h($icon) ?>" aria-hidden="true"></i></a>
<?php endforeach ?>
</div>
