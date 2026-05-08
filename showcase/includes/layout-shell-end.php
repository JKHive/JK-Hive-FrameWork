<?php
declare(strict_types=1);

require __DIR__ . '/layout-main-close.php';
require __DIR__ . '/layout-footer.php';
if (empty($jk_hide_demo_modal)) {
    require __DIR__ . '/layout-modal.php';
}
if (! empty($jk_demo_auth)) {
    require __DIR__ . '/demo-auth-modal.php';
}
if (! empty($jk_cart_modal)) {
    require __DIR__ . '/partial-cart-modal.php';
}
if (! empty($jk_crud_modal)) {
    require __DIR__ . '/layout-crud-modal.php';
}
require __DIR__ . '/layout-scripts.php';
