<?php
declare(strict_types=1);
$jk_hub_hero = ! empty($jk_hub_hero);
?>
  <script src="assets/js/hosts-config.js"></script>
  <script src="assets/js/navbar-loader.js"></script>
  <script src="assets/js/jkhive-navbar.js"></script>
  <script src="assets/js/jkhive-toasts.js"></script>
  <script src="assets/js/jk-hive-toast-api.js"></script>
  <script src="assets/js/error-handler.js"></script>
  <script src="assets/js/tooltip.js"></script>
  <script src="assets/js/jkhive-elements.js"></script>
  <script src="assets/js/jkhive-hex-gallery-framework.js"></script>
<?php if ($jk_hub_hero) : ?>
  <script src="assets/js/hero-collapse.js"></script>
  <script src="assets/js/hero-honeycomb-bar-jkhive.js"></script>
  <script src="assets/js/jkhive-hub-hero-animation.js"></script>
<?php endif; ?>
<?php if (! empty($jk_gallery_catalog_js)) : ?>
  <script src="assets/js/jkhive-gallery-catalog.js"></script>
<?php endif; ?>
  <script src="assets/js/showcase-interactions.js"></script>
<?php if (! empty($jk_shopping_cart)) : ?>
  <script src="assets/js/shopping-cart.js"></script>
<?php endif; ?>
<?php if (! empty($jk_footer_inline_script)) : ?>
<script><?= $jk_footer_inline_script ?></script>
<?php endif; ?>
  <script src="assets/js/jkfw-showcase-admin.js"></script>
<?php if (! empty($jk_demo_auth)) : ?>
  <script src="assets/js/jkfw-demo-auth.js"></script>
<?php endif; ?>
<?php if (! empty($jk_crud_modal)) : ?>
  <script src="assets/js/jkfw-crud-demo.js"></script>
<?php endif; ?>
<?php if (! empty($jk_messaging_full)) : ?>
  <script src="assets/js/jkhive-modals.js"></script>
  <script src="assets/js/jkfw-messaging-api-mock.js"></script>
  <script src="assets/js/jk-hive-3danimation-1.js"></script>
  <script src="assets/js/messaging.js"></script>
<?php endif; ?>
</body>
</html>
