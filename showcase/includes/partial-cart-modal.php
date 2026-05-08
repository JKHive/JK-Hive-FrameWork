<?php declare(strict_types=1); ?>
<div id="cartModal" class="jkhive-modal jkhive-message-modal" style="display:none;" aria-hidden="true">
  <div class="jkhive-modal-overlay" onclick="if(window.shoppingCart)shoppingCart.closeCart();"></div>
  <div class="jkhive-modal-content jkhive-modal-hex jkhive-modal-cart jkfw-showcase-hex-simple" role="dialog" aria-modal="true" aria-label="Carrito">
    <button type="button" class="jkhive-modal-close" onclick="shoppingCart.closeCart()" aria-label="Cerrar carrito">&times;</button>
    <div id="cartContent"></div>
  </div>
</div>
