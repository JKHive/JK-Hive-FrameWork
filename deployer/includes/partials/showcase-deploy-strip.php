<?php
declare(strict_types=1);

if (! jkfw_showcase_is_deploy_demo_page() || ! jkfw_shell_is_super_admin()) {
    return;
}

require_once __DIR__ . '/../jkfw-launcher-blocks.php';

$jk_deploy_demo = basename((string) ($_SERVER['SCRIPT_NAME'] ?? ''));
$t_deploy = jkfw_theme_resolve();
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$wDeploy = jkfw_btn_hex_h_width_style('Deploy');
$deployHref = 'api/deployer/deploy.php?demo=' . rawurlencode($jk_deploy_demo) . '&theme=' . rawurlencode($t_deploy);
?>
        <div class="jkfw-showcase-deploy-wrap" role="region" aria-label="Paquete deploy demo">
          <a class="jkhive-btn-hex-h jkhive-btn-hex-h--fixed jkfw-showcase-deploy-btn" href="<?= $h($deployHref) ?>" style="<?= $h($wDeploy) ?>" data-tooltip="<?= $h('Descargar paquete ZIP (tema ' . $t_deploy . ')') ?>"><span class="jkhive-btn-hex-h__inner" aria-hidden="true"></span><span class="jkhive-btn-hex-h__spin"><i class="jkhive-btn-hex-h__icon fas fa-file-archive" aria-hidden="true"></i><span class="jkhive-btn-hex-h__label"><?= $h('Deploy') ?></span></span></a>
        </div>
