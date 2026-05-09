<?php
declare(strict_types=1);

/**
 * Apertura de superficie panal MEDIUM aprobada (mismo contrato que showcase/index.php):
 *   .jkfw-launcher-hive-main.jkfw-launcher-hive-main--embed
 *     > section.jkhive-section-dashboard
 *       [> h2.jkfw-launcher-section-heading opcional]
 *
 * Variables opcionales:
 * - $jkfw_surface_id (string): id en el wrapper (p. ej. ancla #landing-gallery).
 * - $jkfw_heading_id (string): id para aria-labelledby (obligatorio si hay h2; si no hay h2, debe existir en la página, p. ej. el h1 de la vista).
 * - $jkfw_heading_text (string): si no vacío, se imprime h2.canónico; si vacío, no h2 (título viene fuera).
 */
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$jkfw_surface_id = isset($jkfw_surface_id) ? trim((string) $jkfw_surface_id) : '';
$surfaceIdAttr = $jkfw_surface_id !== '' ? ' id="' . $h($jkfw_surface_id) . '"' : '';
$jkfw_heading_id = isset($jkfw_heading_id) ? trim((string) $jkfw_heading_id) : 'jkfw-medium-hex-gallery-h';
$jkfw_heading_text = isset($jkfw_heading_text) ? trim((string) $jkfw_heading_text) : '';
?>
<div class="jkfw-launcher-hive-main jkfw-launcher-hive-main--embed"<?= $surfaceIdAttr ?>>
  <section class="jkfw-launcher-section jkhive-section-dashboard" aria-labelledby="<?= $h($jkfw_heading_id) ?>">
<?php if ($jkfw_heading_text !== '') : ?>
    <h2 id="<?= $h($jkfw_heading_id) ?>" class="jkhive-section-title sm jkfw-launcher-section-heading"><?= $h($jkfw_heading_text) ?></h2>
<?php endif; ?>
