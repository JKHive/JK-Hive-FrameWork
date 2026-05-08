<?php
declare(strict_types=1);

/* Tema solo para esta página (opcional). Alternativa: ?theme=aurora en la URL (persistente en sesión).
 * Valores: canonical | aurora | cobalt | ember — ver jkfw-themes.css y docs/JK_HIVE_FRAMEWORK_CONTRACT.md
 */
// $jk_color_scheme = 'ember';

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

        <section id="home" class="jkfw-landing-simple-hero" aria-labelledby="jkfw-ls-h1">
          <div class="jkfw-landing-simple-hero__inner">
            <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" aria-hidden="true">
              <span class="jkhive-bttn-inner" style="pointer-events:none;">
                <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-cubes"></i></div></div>
              </span>
            </div>
            <h1 id="jkfw-ls-h1" class="jkfw-landing-simple-hero__title"><?= $h('Soluciones digitales con identidad hexagonal') ?></h1>
            <nav class="jkfw-landing-nav" aria-label="Secciones landing">
              <a href="demo-landing-simple.php" data-tooltip="Home">Home</a>
              <a href="demo-landing-simple-about.php" data-tooltip="About">About</a>
              <a href="demo-landing-simple-gallery.php" data-tooltip="Galería">Galería</a>
              <a href="demo-landing-simple-contact.php" data-tooltip="Contáctanos">Contáctanos</a>
            </nav>
            <p class="jkfw-landing-simple-lead">
              <?= $h('Ejemplo de landing pública mínima: sólo mensaje, propuesta de valor y llamadas a la acción. Sin barra superior de aplicación ni módulos de administración.') ?>
            </p>
            <p class="jkfw-landing-simple-lorem">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula urna non ligula posuere, vitae iaculis velit feugiat.
            </p>
            <div style="display:flex;flex-wrap:wrap;gap:0.85rem;margin-top:1.25rem;justify-content:center;">
              <div class="jkhive-actionbutton-med">
                <a href="demo-landing-advanced.php" data-tooltip="Ver versión autoadministrable" style="text-decoration:none;">
                  <div class="jkhive-hex jkhive-hex-honey"><div class="jkhive-hex-content jkhive-hex-content-editorial"><span class="jkhive-hex-text">Versión pro</span></div></div>
                </a>
              </div>
              <div class="jkhive-actionbutton-med">
                <a href="index.php" data-tooltip="Volver al selector" style="text-decoration:none;">
                  <div class="jkhive-hex jkhive-hex-honey"><div class="jkhive-hex-content jkhive-hex-content-editorial"><span class="jkhive-hex-text">Selector</span></div></div>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" class="jkfw-landing-simple-band" aria-label="Bloques de servicio">
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

        <section id="gallery" class="jkfw-landing-simple-band" aria-label="Galería de servicios">
          <div class="jkfw-launcher-grid">
            <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="Servicio branding"><span class="jkhive-bttn-inner"><div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-pen-ruler"></i></div></div></span></div>
            <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="Servicio desarrollo"><span class="jkhive-bttn-inner"><div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-code"></i></div></div></span></div>
            <div class="jkhive-admoptions-bttn jkhive-bttn-med-big" data-tooltip="Servicio integración"><span class="jkhive-bttn-inner"><div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-plug"></i></div></div></span></div>
          </div>
        </section>

        <section id="contact" class="jkfw-landing-simple-band" aria-label="Contacto landing">
          <div class="jkfw-landing-simple-band__grid">
            <article class="jkfw-landing-simple-card">
              <h2 class="jkfw-landing-simple-card__t"><?= $h('Contáctanos') ?></h2>
              <p class="jkfw-landing-simple-card__p">Formulario demo disponible en el módulo general.</p>
              <p style="margin-top:0.6rem;"><a href="contact.php" style="color:var(--jk-primary-blue-light);"><?= $h('Ir al formulario') ?></a></p>
            </article>
          </div>
        </section>

<?php
require __DIR__ . '/includes/layout-main-close.php';
require __DIR__ . '/includes/layout-footer.php';
require __DIR__ . '/includes/layout-scripts.php';
