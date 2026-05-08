// Universal Shopping Cart Handler with localStorage
// Supports: Products for JK Lubs

class ShoppingCart {
  constructor() {
    this.storageKey =
      typeof window !== 'undefined' && window.JKFW_CART_STORAGE_KEY
        ? String(window.JKFW_CART_STORAGE_KEY)
        : 'krauss_shopping_cart';
    this.cart = this.loadCart();
    this.init();
  }

  getCheckoutUrl() {
    if (typeof window !== 'undefined' && window.JKFW_CHECKOUT_URL) {
      return String(window.JKFW_CHECKOUT_URL);
    }
    return 'checkout.php';
  }

  // Load cart from localStorage
  loadCart() {
    const savedCart = localStorage.getItem(this.storageKey);
    return savedCart ? JSON.parse(savedCart) : [];
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
    this.updateCartBadge();
    if (window.JKHiveCatalogStock && typeof window.JKHiveCatalogStock.updateAll === 'function') {
      try {
        window.JKHiveCatalogStock.updateAll();
      } catch (e) {
        // noop: la galería de productos puede no estar presente en todas las páginas
      }
    }
  }

  // Add item to cart. options: { silent: true } para no mostrar notificación (p. ej. cuando se usa toast tipo B).
  addToCart(item, options) {
    // item structure: { id, type, name, price, icon, description, category, quantity }
    // type: 'product'
    const silent = options && options.silent;

    // Validate required fields
    if (!item || !item.id || !item.type) {
      console.error('Invalid item data:', item);
      if (!silent) this.showNotification('Error: Datos del item inválidos');
      return false;
    }

    // Normalize values for comparison (ensure strings)
    const itemId = String(item.id).trim();
    const itemType = String(item.type).trim();
    
    // Check if item already exists
    const existingIndex = this.cart.findIndex(cartItem => {
      const cartItemId = String(cartItem.id || '').trim();
      const cartItemType = String(cartItem.type || '').trim();
      return cartItemId === itemId && cartItemType === itemType;
    });

    if (existingIndex === -1) {
      this.cart.push({
        id: itemId,
        type: itemType,
        name: item.name || 'Sin nombre',
        price: parseFloat(item.price) || 0,
        icon: item.icon || '📦',
        description: item.description || '',
        category: item.category || '',
        quantity: item.quantity || 1,
        addedAt: new Date().toISOString()
      });
      this.saveCart();
      if (!silent) this.showNotification(`${item.name || 'Item'} añadido al carrito ✓`);
      return true;
    } else {
      // If exists, increment quantity
      this.cart[existingIndex].quantity = (this.cart[existingIndex].quantity || 1) + (item.quantity || 1);
      this.saveCart();
      if (!silent) this.showNotification(`Cantidad de ${item.name || 'Item'} actualizada ✓`);
      return true;
    }
  }

  // Remove item from cart. Si se pasa ev, se muestra toast tipo B sobre el botón eliminar (por encima del modal).
  removeFromCart(id, type, ev) {
    var anchorEl = (ev && ev.target && ev.target.closest && ev.target.closest('.jkhive-bttn-cart-delete')) ? ev.target.closest('.jkhive-bttn-cart-delete') : null;
    if (typeof showToastInline === 'function' && anchorEl) {
      showToastInline({
        type: 'success',
        message: 'Producto eliminado del carrito',
        anchorEl: anchorEl,
        autoCloseMs: 2200,
        appendTo: document.body,
        zIndex: 2147483647
      });
    } else {
      this.showNotification('Item eliminado del carrito');
    }
    this.cart = this.cart.filter(item => !(item.id === id && item.type === type));
    this.saveCart();
    var cartModal = document.getElementById('cartModal');
    if (cartModal && cartModal.classList.contains('active')) {
      this.renderCartModal();
    }
  }

  // Update item quantity
  updateQuantity(id, type, newQuantity) {
    const qty = parseInt(newQuantity);
    if (isNaN(qty) || qty <= 0) {
      this.removeFromCart(id, type);
      return;
    }

    const index = this.cart.findIndex(item => item.id === id && item.type === type);
    if (index !== -1) {
      this.cart[index].quantity = qty;
      this.saveCart();
      
      // Refresh cart modal if open
      const cartModal = document.getElementById('cartModal');
      if (cartModal && cartModal.classList.contains('active')) {
        this.renderCartModal();
      }
    }
  }

  // Clear cart. Si el carrito ya está vacío: toast tipo B "Carrito vacío" (rojo) sobre el botón. Si tiene ítems: vacía y toast "Carrito vaciado" (éxito). Responsive/mobile: toast en body con z-index máximo.
  clearCart(ev) {
    var anchorEl = (ev && ev.target && ev.target.closest && ev.target.closest('.jkhive-bttn-med')) ? ev.target.closest('.jkhive-bttn-med') : null;
    var cartModal = document.getElementById('cartModal');
    var toastOpts = { anchorEl: anchorEl, autoCloseMs: 2500, appendTo: document.body, zIndex: 2147483647 };

    if (this.cart.length === 0) {
      if (typeof showToastInline === 'function' && anchorEl) {
        showToastInline({ type: 'error', message: 'Carrito vacío', ...toastOpts });
      } else {
        this.showNotification('Carrito vacío');
      }
      return;
    }

    if (typeof showToastInline === 'function' && anchorEl) {
      showToastInline({ type: 'success', message: 'Carrito vaciado', ...toastOpts });
    } else {
      this.showNotification('Carrito vaciado');
    }
    this.cart = [];
    this.saveCart();
    if (cartModal && cartModal.classList.contains('active')) {
      this.renderCartModal();
    }
  }

  /**
   * Proceder al pago: si el carrito está vacío, muestra toast tipo B "Carrito vacío" sobre el botón y no navega.
   * Si hay ítems, permite la navegación a checkout.php.
   */
  proceedToCheckout(ev) {
    if (this.cart.length === 0) {
      if (ev) ev.preventDefault();
      var anchorEl = (ev && ev.target && ev.target.closest && ev.target.closest('.jkhive-bttn-med')) ? ev.target.closest('.jkhive-bttn-med') : null;
      if (typeof showToastInline === 'function' && anchorEl) {
        showToastInline({
          type: 'error',
          message: 'Carrito vacío',
          anchorEl: anchorEl,
          autoCloseMs: 2500,
          appendTo: document.body,
          zIndex: 2147483647
        });
      }
      return false;
    }
    if (typeof window !== 'undefined' && window.JKFW_DEMO_CHECKOUT_TOAST) {
      if (ev) ev.preventDefault();
      if (typeof window.toast === 'function') {
        window.toast({
          type: 'A',
          state: 'success',
          message: 'Pedido demo registrado (sin pago ni backend). Gracias por probar JK Hive.',
          autoCloseMs: 4500,
        });
      }
      this.closeCart();
      return false;
    }
    return true;
  }

  // Update cart badge on all pages
  updateCartBadge() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      // Calculate total quantity, not just number of items
      const totalQuantity = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      if (totalQuantity > 0) {
        cartCount.textContent = totalQuantity;
        cartCount.style.display = 'flex';
      } else {
        cartCount.style.display = 'none';
      }
    }
  }

  // Toggle cart modal
  toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;

    if (cartModal.classList.contains('active')) {
      this.closeCart();
    } else {
      this.openCart();
    }
  }

  // Open cart modal (si está vacío: toast tipo A "Carrito vacío", no se abre el modal)
  openCart() {
    if (this.cart.length === 0) {
      if (typeof showCartEmptyMessage === 'function') {
        showCartEmptyMessage({ autoCloseMs: 3500 });
      }
      return;
    }

    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;

    this.renderCartModal();
    // En mobile (y desktop) asegurar que el modal sea el último hijo de body para ganar stacking sobre galería/hero/sidebar.
    if (cartModal.parentNode === document.body) {
      document.body.appendChild(cartModal);
    }
    cartModal.style.display = 'flex';
    document.body.classList.add('jkhive-cart-modal-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      cartModal.classList.add('active');
    }, 10);
  }

  // Close cart modal
  closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;

    cartModal.classList.remove('active');
    document.body.classList.remove('jkhive-cart-modal-open');
    setTimeout(() => {
      cartModal.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }

  // Get type label in Spanish
  getTypeLabel(type) {
    const labels = {
      'product': 'Producto'
    };
    return labels[type] || 'Item';
  }

  // Get type icon
  getTypeIcon(type) {
    const icons = {
      'product': '🛢️'
    };
    return icons[type] || '📦';
  }

  /**
   * Render cart modal content.
   * Regla del modal hex: HEADER = encabezado (icono, título, resumen). BODY = contenido (listado/tabla). FOOTER = botones. SIEMPRE.
   */
  renderCartModal() {
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;

    const cartIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" aria-hidden="true"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>';

    if (this.cart.length === 0) {
      /* Header: icono + título + resumen. Body: solo contenido (mensaje). Footer: solo botones. */
      cartContent.innerHTML = `
        <div class="jkhive-modal-header">
          <div class="jkhive-modal-header-top">
            <div class="jkhive-modal-cart-icon-wrap">${cartIconSvg}</div>
          </div>
          <div class="jkhive-modal-header-bottom">
            <h2 class="jkhive-modal-title jkhive-modal-cart-title">Carrito de compras</h2>
            <p class="jkhive-modal-cart-count">0 unidades · 0 producto(s)</p>
          </div>
        </div>
        <div class="jkhive-modal-body">
          <div class="jkhive-modal-body-content jkhive-modal-cart-list">
            <p style="text-align:center; color: var(--jk-metal); font-size: 0.9rem; padding: 1.5rem;">Tu carrito está vacío</p>
          </div>
        </div>
        <div class="jkhive-modal-footer jkhive-modal-cart-footer">
          <div class="jkhive-modal-cart-footer-honeycomb">
            <div class="jkhive-modal-cart-footer-row1">
              <div class="jkhive-bttn-med jkhive-btn-anim-inverseclock" data-tooltip="Vaciar carrito"><button type="button" onclick="shoppingCart.clearCart(event)" aria-label="Vaciar carrito"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1.1rem" height="1.1rem"><path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.3 14.8 22.2 14.8H463.5z"/></svg></div></div></button></div>
              <div class="jkhive-bttn-med jkhive-btn-anim-coindouble" data-tooltip="Proceder al pago"><button type="button" onclick="shoppingCart.proceedToCheckout(event)" aria-label="Proceder al pago"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" width="1.1rem" height="1.1rem"><path d="M64 32C28.7 32 0 60.7 0 96v32H576V96c0-35.3-28.7-64-64-64H64zM0 224v192c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V224H0zM64 384H512c17.7 0 32-14.3 32-32V288H32v64c0 17.7 14.3 32 32 32z"/></svg></div></div></button></div>
            </div>
            <div class="jkhive-modal-cart-footer-row2">
              <div class="jkhive-bttn-med jkhive-btn-anim-inverseclock jkhive-btn-cart-exit" data-tooltip="Salir"><button type="button" onclick="shoppingCart.closeCart()" aria-label="Salir"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.1rem" height="1.1rem" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg></div></div></button></div>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const totalUnits = this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const productCount = this.cart.length;
    let total = 0;

    let cartHTML = `
      <div class="jkhive-modal-header">
        <div class="jkhive-modal-header-top">
          <div class="jkhive-modal-cart-icon-wrap">${cartIconSvg}</div>
        </div>
        <div class="jkhive-modal-header-bottom">
          <h2 class="jkhive-modal-title jkhive-modal-cart-title">Carrito de compras</h2>
          <p class="jkhive-modal-cart-count">${totalUnits} unidad(es) · ${productCount} producto(s)</p>
        </div>
      </div>
      <div class="jkhive-modal-body">
        <div class="jkhive-modal-body-content jkhive-modal-cart-list">
    `;
    this.cart.forEach(item => {
      const itemTotal = item.price * (item.quantity || 1);
      total += itemTotal;
      cartHTML += this.renderCartItem(item);
    });
    cartHTML += `
        </div>
        <div class="jkhive-modal-cart-total">
          Total: <span>$${total.toLocaleString('es-CL')}</span>
        </div>
      </div>
      <div class="jkhive-modal-footer jkhive-modal-cart-footer">
        <div class="jkhive-modal-cart-footer-honeycomb">
          <div class="jkhive-modal-cart-footer-row1">
            <div class="jkhive-bttn-med jkhive-btn-anim-inverseclock" data-tooltip="Vaciar carrito"><button type="button" onclick="shoppingCart.clearCart(event)" aria-label="Vaciar carrito"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="1.1rem" height="1.1rem" aria-hidden="true"><path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.3 14.8 22.2 14.8H463.5z"/></svg></div></div></button></div>
            <a href="${this.getCheckoutUrl()}" class="jkhive-bttn-med jkhive-btn-anim-coindouble" data-tooltip="Proceder al pago" aria-label="Proceder al pago" onclick="return shoppingCart.proceedToCheckout(event)"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" width="1.1rem" height="1.1rem" aria-hidden="true"><path d="M64 32C28.7 32 0 60.7 0 96v32H576V96c0-35.3-28.7-64-64-64H64zM0 224v192c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V224H0zM64 384H512c17.7 0 32-14.3 32-32V288H32v64c0 17.7 14.3 32 32 32z"/></svg></div></div></a>
          </div>
          <div class="jkhive-modal-cart-footer-row2">
            <div class="jkhive-bttn-med jkhive-btn-anim-inverseclock jkhive-btn-cart-exit" data-tooltip="Salir"><button type="button" onclick="shoppingCart.closeCart()" aria-label="Salir"><div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.1rem" height="1.1rem" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg></div></div></button></div>
          </div>
        </div>
      </div>
    `;

    cartContent.innerHTML = cartHTML;
  }

  // Render individual cart item (compact, botón papelera jkhive-bttn-item + SVG + shake)
  renderCartItem(item) {
    const priceDisplay = item.price > 0 ? `$${item.price.toLocaleString('es-CL')}` : 'Consultar';
    const quantity = item.quantity || 1;
    const itemTotal = item.price > 0 ? `$${(item.price * quantity).toLocaleString('es-CL')}` : '';
    const trashSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="0.9rem" height="0.9rem" aria-hidden="true"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>';
    
    return `
      <div class="cart-item">
        <div>
          <span style="font-size: 1.25rem; flex-shrink: 0;">${item.icon}</span>
          <div style="flex: 1; min-width: 0;">
            <h4>${this.escapeHtml(item.name)}</h4>
            ${item.category ? `<p style="color: var(--jk-metal);">${this.escapeHtml(item.category)}</p>` : ''}
          </div>
          <div class="cart-item-qty" style="flex-shrink: 0;">
            <button type="button" onclick="shoppingCart.updateQuantity('${this.escapeHtml(String(item.id))}', '${this.escapeHtml(String(item.type))}', ${quantity - 1})" aria-label="Menos">−</button>
            <span>${quantity}</span>
            <button type="button" onclick="shoppingCart.updateQuantity('${this.escapeHtml(String(item.id))}', '${this.escapeHtml(String(item.type))}', ${quantity + 1})" aria-label="Más">+</button>
          </div>
          <div class="cart-item-price" style="flex-shrink: 0;">
            <p class="unit">${priceDisplay} c/u</p>
            <p class="total">${itemTotal}</p>
          </div>
        </div>
        <button type="button" class="jkhive-bttn-tbl jkhive-btn-anim-shake jkhive-bttn-cart-delete" onclick="shoppingCart.removeFromCart('${this.escapeHtml(String(item.id))}', '${this.escapeHtml(String(item.type))}', event)" data-tooltip="Eliminar" aria-label="Eliminar">
          <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial">${trashSvg}</div></div>
        </button>
      </div>
    `;
  }

  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Show notification
  showNotification(message) {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.jkhive-notification');
    existingNotifications.forEach(notif => {
      notif.remove();
    });

    const notification = document.createElement('div');
    notification.className = 'jkhive-notification';
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: linear-gradient(135deg, var(--jk-primary-blue-dark), var(--jk-primary-blue));
      color: var(--jk-metal-light);
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: var(--jk-shadow-lg), var(--jk-glow-blue);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      border: 2px solid var(--jk-primary-blue-light);
      max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 2500);
  }

  // Initialize cart on page load
  init() {
    this.updateCartBadge();
    
    // Close cart on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCart();
      }
    });

    // Make cart icon clickable if exists
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
      cartIcon.style.cursor = 'pointer';
    }
  }

  // Get cart summary for contact page
  getCartSummary() {
    if (this.cart.length === 0) return 'Carrito vacío';

    let summary = 'Items en el carrito:\n\n';
    let total = 0;

    summary += '💼 PRODUCTOS:\n';
    this.cart.forEach(item => {
      const quantity = item.quantity || 1;
      const itemTotal = item.price * quantity;
      summary += `  - ${item.name} (x${quantity})${item.price > 0 ? ` ($${itemTotal.toLocaleString('es-CL')})` : ' (Consultar)'}\n`;
      total += itemTotal;
    });
    summary += '\n';

    summary += `\nTOTAL REFERENCIAL: $${total.toLocaleString('es-CL')}`;
    return summary;
  }
}

// Create global cart instance (expuesto en window para JKHiveCatalogStock y otros)
const shoppingCart = new ShoppingCart();
window.shoppingCart = shoppingCart;

// Global function for onclick handlers (backward compatibility).
// Si se pasa anchorEl (p. ej. el botón), se muestra toast tipo B "Producto agregado" (verde) sobre él y no la notificación clásica.
function addToCart(itemIdOrObject, type = 'product', anchorEl) {
  if (typeof itemIdOrObject === 'object') {
    var added = shoppingCart.addToCart(itemIdOrObject, { silent: !!anchorEl });
    if (added && anchorEl && typeof showToastInline === 'function') {
      showToastInline({ type: 'success', message: 'Producto agregado', anchorEl: anchorEl, autoCloseMs: 2500 });
    }
  }
}

function toggleCart() {
  shoppingCart.toggleCart();
}

// CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .cart-section {
    margin-bottom: 2rem;
  }

  .cart-section:last-of-type {
    margin-bottom: 0;
  }
`;
document.head.appendChild(style);
