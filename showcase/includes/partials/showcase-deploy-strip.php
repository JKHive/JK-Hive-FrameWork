<?php
declare(strict_types=1);

if (! jkfw_showcase_is_deploy_demo_page() || ! jkfw_shell_is_super_admin()) {
    return;
}

$jk_deploy_demo = basename((string) ($_SERVER['SCRIPT_NAME'] ?? ''));
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
        <div class="jkfw-showcase-deploy-strip" role="region" aria-label="Paquete deploy demo">
          <a class="jkfw-showcase-deploy-btn jkhive-admoptions-bttn jkhive-bttn-sm" href="api/showcase/deploy.php?demo=<?= $h($jk_deploy_demo) ?>">Deploy</a>
        </div>
