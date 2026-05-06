<?php
declare(strict_types=1);

$jk_nav = 'standalone';
$jk_page_title = 'Landing pública básica — JK Hive';
$jk_breadcrumb = '';
$jk_body_class = 'jkhive-showcase-body jkfw-landing-simple-body';
$jk_hide_top_navbar = true;
$jk_hide_demo_modal = true;
$jk_main_extra_class = 'jkfw-main-fullbleed';
$jk_extra_css = '<link rel="stylesheet" href="assets/css/jkfw-launcher.css">' . "\n";

require __DIR__ . '/includes/layout-head.php';
require __DIR__ . '/includes/layout-main-open.php';
$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>

        <section class="jkfw-landing-simple-hero" aria-labelledby="jkfw-ls-h1">
          <div class="jkfw-landing-simple-hero__inner">
            <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" aria-hidden="true">
              <span class="jkhive-bttn-inner" style="pointer-events:none;">
                <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-cubes"></i></div></div>
              </span>
            </div>
            <h1 id="jkfw-ls-h1" class="jkfw-landing-simple-hero__title"><?= $h('Soluciones digitales con identidad hexagonal') ?></h1>
            <p class="jkfw-landing-simple-lead">
              <?= $h('Ejemplo de landing pública mínima: sólo mensaje, propuesta de valor y llamadas a la acción. Sin barra superior de aplicación ni módulos de administración.') ?>
            </p>
            <p class="jkfw-landing-simple-lorem">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula urna non ligula posuere, vitae iaculis velit feugiat.
            </p>
            <div style="display:flex;flex-wrap:wrap;gap:0.85rem;margin-top:1.25rem;justify-content:center;">
              <a href="demo-landing-advanced.php" class="jkhive-btn-hex jkhive-btn-hex-primary" style="text-decoration:none;"><?= $h('Ver versión completa') ?></a>
              <a href="index.php" class="jkhive-btn-hex" style="text-decoration:none;"><?= $h('Volver al selector') ?></a>
            </div>
          </div>
        </section>

        <section class="jkfw-landing-simple-band" aria-label="Bloques de servicio">
          <div class="jkfw-landing-simple-band__grid">
            <article class="jkfw-landing-simple-card">
              <h2 class="jkfw-landing-simple-card__t"><?= $h('Experiencia de marca') ?></h2>
              <p class="jkfw-landing-simple-card__p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce efficitur facilisis magna non commodo.</p>
            </article>
            <article class="jkfw-landing-simple-card">
              <h2 class="jkfw-landing-simple-card__t"><?= $h('Productos y servicios') ?></h2>
              <p class="jkfw-landing-simple-card__p">Párrafo genérico de relleno. Aquí iría el detalle comercial real del proyecto que montes con el framework.</p>
            </article>
            <article class="jkfw-landing-simple-card">
              <h2 class="jkfw-landing-simple-card__t"><?= $h('Contacto') ?></h2>
              <p class="jkfw-landing-simple-card__p">Texto placeholder. En un sitio real enlazarías a un formulario o a canales de atención.</p>
            </article>
          </div>
        </section>

<?php
require __DIR__ . '/includes/layout-main-close.php';
require __DIR__ . '/includes/layout-footer.php';
require __DIR__ . '/includes/layout-scripts.php';
