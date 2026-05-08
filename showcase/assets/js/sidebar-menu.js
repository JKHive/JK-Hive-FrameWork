/**
 * Dynamic Menu Loader - CRM
 * Carga el menú desde includes/sidebar-menu.php (con permisos dinámicos)
 * y marca automáticamente la página activa
 * 
 * El menú se genera dinámicamente según el perfil del usuario:
 * - Usuarios normales: Solo MSGS y PROFILE
 * - Clerk/Admin: Todos los items según su nivel
 * 
 * MANTIENE LA POSICIÓN DEL SCROLL: El menú preserva su posición de scroll
 * al navegar entre páginas para una mejor experiencia de usuario.
 */

(function() {
  'use strict';

  // Constantes
  const STORAGE_KEY = 'crm_sidebar_scroll_position';

  // Obtener el elemento del sidebar
  function getSidebarElement() {
    // Buscar por ID primero, luego por clase
    return document.getElementById('jkhive-sidebar') || document.querySelector('.jkhive-sidebar');
  }

  // Guardar posición del scroll del sidebar
  function saveSidebarScrollPosition() {
    const sidebar = getSidebarElement();
    if (sidebar) {
      sessionStorage.setItem(STORAGE_KEY, sidebar.scrollTop.toString());
    }
  }

  // Restaurar posición del scroll del sidebar de forma instantánea
  function restoreSidebarScrollPosition() {
    const savedPosition = sessionStorage.getItem(STORAGE_KEY);
    const sidebar = getSidebarElement();
    
    if (!sidebar) return;
    
    // Restaurar posición ANTES de que el sidebar sea visible en la pantalla
    // Esto se hace inmediatamente cuando se inserta el HTML
    if (savedPosition !== null) {
      sidebar.scrollTop = parseInt(savedPosition, 10);
    }
    
    // Usar múltiples frames para asegurar que el scroll se aplique ANTES del renderizado visual
    requestAnimationFrame(() => {
      if (savedPosition !== null) {
        sidebar.scrollTop = parseInt(savedPosition, 10);
      }
      
      // Asegurar que la posición se mantenga incluso después del layout
      requestAnimationFrame(() => {
        if (savedPosition !== null) {
          sidebar.scrollTop = parseInt(savedPosition, 10);
        }
        
        // Verificar que el item activo esté visible (solo si no hay posición guardada)
        if (savedPosition === null) {
          ensureActiveItemVisible();
        }
      });
    });
  }

  // Asegurar que el item activo esté visible en el viewport (sin animación para evitar saltos)
  function ensureActiveItemVisible() {
    const sidebar = getSidebarElement();
    if (!sidebar) return;
    
    const activeItem = sidebar.querySelector('.jkhive-nav-item.active');
    if (!activeItem) return;
    
    // Calcular la posición del item relativa al sidebar
    const sidebarTop = sidebar.getBoundingClientRect().top;
    const itemTop = activeItem.getBoundingClientRect().top;
    const sidebarScrollTop = sidebar.scrollTop;
    
    // Calcular si el item está fuera del viewport
    const itemRelativeTop = itemTop - sidebarTop;
    const sidebarHeight = sidebar.clientHeight;
    
    // Si el item está fuera del viewport, ajustar el scroll
    if (itemRelativeTop < 0) {
      // El item está arriba del viewport
      sidebar.scrollTop = sidebarScrollTop + itemRelativeTop - 20;
    } else if (itemRelativeTop + activeItem.offsetHeight > sidebarHeight) {
      // El item está abajo del viewport
      sidebar.scrollTop = sidebarScrollTop + (itemRelativeTop + activeItem.offsetHeight - sidebarHeight) + 20;
    }
  }


  /* === LÓGICA DE SUBMENÚ IDÉNTICA A sidebar-menu-website.js === */
  function unwrapSubmenuRows(submenu) {
    const rows = submenu.querySelectorAll('.jkhive-submenu-row-wrap');
    rows.forEach(row => {
      while (row.firstChild) submenu.appendChild(row.firstChild);
      row.remove();
    });
  }

  function rowOverlapsSidebarItem(rowIndex, navItem, itemH, gap) {
    if (!navItem) return false;
    const sidebar = navItem.closest('.jkhive-sidebar') || navItem.closest('#jkhive-sidebar');
    if (!sidebar) return false;
    const navItems = sidebar.querySelectorAll('.jkhive-nav-item');
    if (!navItems.length) return false;
    const submenuTop = navItem.getBoundingClientRect().top + navItem.getBoundingClientRect().height / 2 - itemH / 2;
    const marginTop = gap - Math.round(itemH / 4) - 5;
    const rowCenterY = submenuTop + (rowIndex + 0.5) * itemH + rowIndex * marginTop;
    for (let i = 0; i < navItems.length; i++) {
      const r = navItems[i].getBoundingClientRect();
      if (rowCenterY >= r.top && rowCenterY <= r.bottom) return true;
    }
    return false;
  }

  function wrapSubmenuOverflow(submenu, maxWidth, navItem) {
    unwrapSubmenuRows(submenu);
    const items = [].slice.call(submenu.querySelectorAll(':scope > .jkhive-submenu-item'));
    const itemW = window.innerWidth <= 768 ? 60 : 85;
    const gap = 3;
    const unit = itemW + gap;
    const itemH = itemW * 1.1547;
    const maxFit = Math.max(1, Math.floor(maxWidth / unit));
    let rowCaps;
    if (window.innerWidth <= 768) {
      const firstRowCap = Math.min(7, maxFit);
      const restRowCap = Math.max(1, Math.min(5, maxFit - 1));
      rowCaps = [firstRowCap];
      for (let r = 1; r < 20; r++) rowCaps.push(restRowCap);
    } else {
      rowCaps = [maxFit];
      for (let r = 1; r < 20; r++) rowCaps.push(maxFit);
    }
    const firstRowCap = rowCaps[0];
    if (items.length <= firstRowCap) return;
    const overflow = items.slice(firstRowCap);
    overflow.forEach(it => it.remove());
    let start = 0;
    for (let r = 1; r < rowCaps.length && start < overflow.length; r++) {
      const cap = rowCaps[r];
      const rowItems = overflow.slice(start, start + cap);
      start += rowItems.length;
      if (rowItems.length === 0) break;
      const wrap = document.createElement('div');
      wrap.className = 'jkhive-submenu-row-wrap';
      const prevCap = (r <= 2) ? rowCaps[0] : rowCaps[1];
      let padLeft = (prevCap - rowItems.length) * unit;
      if (padLeft < 0) padLeft = 0;
      const shiftLeft = itemW / 2;
      let targetLeft = (r % 2 === 1) ? padLeft - shiftLeft : padLeft;
      if (window.innerWidth <= 768 && !rowOverlapsSidebarItem(r, navItem, itemH, gap)) targetLeft += itemW;
      if (targetLeft >= 0) { padLeft = targetLeft; } else { padLeft = 0; }
      const marginTop = gap - Math.round(itemH / 4) - 5;
      let style = 'flex-basis:100%;width:100%;min-width:100%;display:flex;flex-direction:row;justify-content:flex-start;align-items:center;gap:' + gap + 'px;flex-shrink:0;padding-left:' + padLeft + 'px;';
      if (targetLeft < 0) style += 'margin-left:' + targetLeft + 'px;';
      wrap.style.cssText = style;
      wrap.style.setProperty('margin-top', marginTop + 'px', 'important');
      rowItems.forEach(it => wrap.appendChild(it));
      submenu.appendChild(wrap);
    }
  }

  function positionSubmenu(navItem) {
    const submenu = getSubmenu(navItem);
    if (!submenu) return;
    if (submenu.parentElement !== document.body) {
      submenu._parentNavItem = navItem;
      document.body.appendChild(submenu);
    }
    const rect = navItem.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;
    const gap = isMobile ? 2 : 3.5; /* doc: toggle-submenú mobile 2px, desktop 3.5px */
    const maxW = Math.max(200, window.innerWidth - (rect.right + gap) - 16);
    const rowH = (isMobile ? 60 : 85) * 1.1547;
    const pad = isMobile ? 0 : 15; /* desktop: evita recorte al scale(1.05) en hover (doc RESTORE) */
    const totalH = rowH + pad * 2;
    submenu.style.setProperty('position', 'fixed', 'important');
    submenu.style.setProperty('left', (rect.right + gap) + 'px', 'important');
    submenu.style.setProperty('top', (rect.top + rect.height / 2) + 'px', 'important');
    submenu.style.setProperty('transform', 'translateY(' + (-totalH / 2) + 'px)', 'important'); /* centrado incluyendo padding */
    if (pad > 0) submenu.style.setProperty('padding', pad + 'px 0', 'important');
    submenu.style.setProperty('z-index', '999999', 'important');
    submenu.style.setProperty('display', 'flex', 'important');
    submenu.style.setProperty('flex-direction', 'row', 'important');
    submenu.style.setProperty('flex-wrap', 'wrap', 'important');
    submenu.style.setProperty('align-items', 'center', 'important');
    submenu.style.setProperty('align-content', 'center', 'important');
    submenu.style.setProperty('gap', '3px', 'important');
    submenu.style.setProperty('max-width', maxW + 'px', 'important');
    submenu.style.setProperty('opacity', '1', 'important');
    submenu.style.setProperty('visibility', 'visible', 'important');
    submenu.style.setProperty('pointer-events', 'all', 'important');
    wrapSubmenuOverflow(submenu, maxW, navItem);
    if (window.innerWidth <= 768) {
      submenu.style.setProperty('max-height', 'calc(100vh - 2rem)', 'important');
      const hasMultipleRows = submenu.querySelector('.jkhive-submenu-row-wrap');
      submenu.style.setProperty('overflow-y', hasMultipleRows ? 'auto' : 'hidden', 'important');
      submenu.style.setProperty('overflow-x', 'hidden', 'important');
    } else {
      submenu.style.removeProperty('max-height');
      submenu.style.removeProperty('overflow-y');
      submenu.style.removeProperty('overflow-x');
      submenu.style.setProperty('overflow', 'visible', 'important'); /* evita recorte en hover scale (doc housesitting) */
    }
  }

  function restoreSubmenu(navItem) {
    const submenu = getSubmenu(navItem);
    if (!submenu || submenu.parentElement !== document.body) return;
    unwrapSubmenuRows(submenu);
    navItem.appendChild(submenu);
    submenu.style.cssText = '';
    delete submenu._parentNavItem;
  }

  function isCurrentPageInSubmenu(navItem) {
    const submenu = getSubmenu(navItem);
    if (!submenu) return false;
    const currentPage = getCurrentPage();
    return !!submenu.querySelector('.jkhive-submenu-item[data-page="' + currentPage + '"]');
  }

  // Función para obtener el submenú (puede estar en navItem o en body)
  function getSubmenu(navItem) {
    if (!navItem) return null;
    
    // Primero buscar en el navItem
    let submenu = navItem.querySelector('.jkhive-submenu-horizontal');
    
    // Si no está en el navItem, buscarlo en el body
    if (!submenu) {
      const bodySubmenus = document.body.querySelectorAll('.jkhive-submenu-horizontal');
      for (let sm of bodySubmenus) {
        if (sm._parentNavItem === navItem) {
          submenu = sm;
          break;
        }
      }
    }
    
    return submenu;
  }

  /** Ítem activo del submenú (DOM en navItem o en body si el panel está abierto). */
  function findActiveSubmenuItemInParent(parentNavItem) {
    if (!parentNavItem) return null;
    const submenu = getSubmenu(parentNavItem);
    if (submenu) {
      const a = submenu.querySelector('.jkhive-submenu-item.active');
      if (a) return a;
    }
    return parentNavItem.querySelector('.jkhive-submenu-item.active');
  }

  /** Clases jkhive-submenu-current-* en el padre (para CSS flip + animación). */
  function refreshSubmenuCurrentClasses(root) {
    const el = root && root.querySelectorAll ? root : document;
    el.querySelectorAll('.jkhive-nav-item-submenu').forEach(function(parent) {
      Array.from(parent.classList).filter(function(c) { return c.indexOf('jkhive-submenu-current-') === 0; })
        .forEach(function(c) { parent.classList.remove(c); });
      const activeChild = findActiveSubmenuItemInParent(parent);
      if (activeChild) {
        const page = activeChild.getAttribute('data-page');
        if (page) parent.classList.add('jkhive-submenu-current-' + page);
      }
    });
  }

  /** Cara trasera del toggle: copia genérica del .jkhive-hex-icon del hijo activo (cualquier data-page). */
  function syncSubmenuToggleBackIcons(root) {
    const el = root && root.querySelectorAll ? root : document;
    el.querySelectorAll('.jkhive-nav-item-submenu').forEach(function(parent) {
      var slot = parent.querySelector('.jkhive-submenu-toggle-back-slot');
      if (!slot) return;
      slot.innerHTML = '';
      var activeChild = findActiveSubmenuItemInParent(parent);
      if (!activeChild) return;
      var srcIcon = activeChild.querySelector('.jkhive-hex-icon');
      if (!srcIcon) return;
      var clone = document.createElement('i');
      clone.className = srcIcon.className;
      clone.setAttribute('aria-hidden', 'true');
      slot.appendChild(clone);
    });
  }

  /** Toggle: jkhive-submenu-expanded = abierto. active = página actual (styling). Igual que web. */
  function toggleSubmenu(navItem) {
    if (!navItem) return;
    const submenu = getSubmenu(navItem);
    const isExpanded = navItem.classList.contains('jkhive-submenu-expanded');

    if (isExpanded) {
      navItem.classList.remove('jkhive-submenu-expanded');
      if (!isCurrentPageInSubmenu(navItem)) navItem.classList.remove('active');
      if (submenu) {
        submenu.classList.remove('active');
        submenu.style.setProperty('opacity', '0', 'important');
        submenu.style.setProperty('visibility', 'hidden', 'important');
        submenu.style.setProperty('pointer-events', 'none', 'important');
        submenu.style.setProperty('display', 'none', 'important');
        restoreSubmenu(navItem);
        if (submenu._repositionHandler) {
          window.removeEventListener('scroll', submenu._repositionHandler, true);
          window.removeEventListener('resize', submenu._repositionHandler);
        }
      }
      return;
    }

    closeAllSubmenus();
    if (!submenu) return;
    if (submenu.parentElement !== document.body) {
      submenu._parentNavItem = navItem;
      document.body.appendChild(submenu);
    }
    navItem.classList.add('active');
    navItem.classList.add('jkhive-submenu-expanded');
    submenu.classList.add('active');
    positionSubmenu(navItem);
    void submenu.offsetHeight;
    const handler = function() {
      if (navItem.classList.contains('jkhive-submenu-expanded')) positionSubmenu(navItem);
    };
    submenu._repositionHandler = handler;
    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
  }

  function closeAllSubmenus() {
    document.querySelectorAll('.jkhive-nav-item-submenu').forEach(item => {
      const submenu = getSubmenu(item);
      if (!submenu || !submenu.classList.contains('active')) return;
      item.classList.remove('jkhive-submenu-expanded');
      if (!isCurrentPageInSubmenu(item)) item.classList.remove('active');
      submenu.classList.remove('active');
      submenu.style.setProperty('opacity', '0', 'important');
      submenu.style.setProperty('visibility', 'hidden', 'important');
      submenu.style.setProperty('pointer-events', 'none', 'important');
      submenu.style.setProperty('display', 'none', 'important');
      restoreSubmenu(item);
      if (submenu._repositionHandler) {
        window.removeEventListener('scroll', submenu._repositionHandler, true);
        window.removeEventListener('resize', submenu._repositionHandler);
      }
    });
    document.body.querySelectorAll('.jkhive-submenu-horizontal').forEach(submenu => {
      if (submenu.classList.contains('active') || submenu.style.display !== 'none') {
        submenu.classList.remove('active');
        submenu.style.setProperty('opacity', '0', 'important');
        submenu.style.setProperty('visibility', 'hidden', 'important');
        submenu.style.setProperty('pointer-events', 'none', 'important');
        submenu.style.setProperty('display', 'none', 'important');
        const parent = submenu._parentNavItem;
        if (parent) {
          parent.classList.remove('jkhive-submenu-expanded');
          if (!isCurrentPageInSubmenu(parent)) parent.classList.remove('active');
          restoreSubmenu(parent);
        }
        if (submenu._repositionHandler) {
          window.removeEventListener('scroll', submenu._repositionHandler, true);
          window.removeEventListener('resize', submenu._repositionHandler);
        }
      }
    });
  }

  // Función para cerrar todos los submenús del navbar superior
  function closeAllNavbarDropdowns() {
    // Cerrar menú de usuario
    const userDropdown = document.getElementById('userMenuDropdown');
    if (userDropdown) {
      userDropdown.classList.remove('active');
    }
    
    // Cerrar selector de idiomas
    const langSelector = document.querySelector('.jkhive-lang-selector');
    if (langSelector) {
      langSelector.classList.remove('open');
    }
    
    // Cerrar selector de notificaciones (si tiene clase open o active)
    const notifSelector = document.querySelector('.jkhive-notif-selector');
    if (notifSelector) {
      const wasOpen = notifSelector.classList.contains('open') || notifSelector.classList.contains('active');
      notifSelector.classList.remove('open', 'active');
      // También cerrar el contenedor de hexágonos si está abierto
      const container = notifSelector.querySelector('.jkhive-notif-hex-container');
      if (container) {
        container.classList.remove('open', 'active');
      }
    }
    
    // Cerrar menú del carrito (si existe en CRM)
    const cartDropdown = document.getElementById('cartDropdown');
    if (cartDropdown) {
      cartDropdown.style.display = 'none';
      cartDropdown.classList.remove('active');
    }
    
    // Cerrar instancias si existen
    if (typeof shoppingCart !== 'undefined' && shoppingCart && shoppingCart.closeCartDropdown) {
      shoppingCart.closeCartDropdown();
    }
  }

  // Variable para rastrear si ya se agregó el listener del sidebar
  let sidebarClickListenerAdded = false;

  // Agregar listeners a los enlaces del menú para guardar la posición antes de navegar
  function attachScrollPositionListeners() {
    const sidebar = getSidebarElement();
    if (!sidebar) {
      console.error('Sidebar no encontrado en attachScrollPositionListeners');
      return;
    }

    // Solo agregar el listener una vez
    if (sidebarClickListenerAdded) return;
    sidebarClickListenerAdded = true;

    // Agregar listener a todos los enlaces del menú (usar event delegation con captura para asegurar que se ejecute primero)
    // Usar captura (true) para asegurar que se ejecute antes que otros listeners
    sidebar.addEventListener('click', function(e) {
      // Cerrar todos los submenús del navbar superior cuando se hace click en el sidebar
      // Hacerlo PRIMERO antes de cualquier otra lógica
      closeAllNavbarDropdowns();
      
      // PRIMERO: Verificar si es click en un toggle de submenú
      let toggleLink = e.target.closest('.jkhive-submenu-toggle');
      
      // Si no se encuentra, verificar si el target está dentro de un nav-item-submenu
      if (!toggleLink) {
        const navItem = e.target.closest('.jkhive-nav-item-submenu');
        if (navItem) {
          toggleLink = navItem.querySelector('.jkhive-submenu-toggle');
          // Si el click es directamente en el nav-item-submenu o en su contenido, también activarlo
          if (!toggleLink && (e.target === navItem || navItem.contains(e.target))) {
            toggleLink = navItem.querySelector('a.jkhive-submenu-toggle');
          }
        }
      }
      
      if (toggleLink) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const navItem = toggleLink.closest('.jkhive-nav-item-submenu');
        if (navItem) toggleSubmenu(navItem);
        return false;
      }
      
      const link = e.target.closest('a[href]');
      
      // Si es un enlace dentro del submenú, no hacer nada más
      if (link && link.closest('.jkhive-submenu-horizontal')) {
        return;
      }
      
      if (!link) return;
      
      // Solo interceptar enlaces que no sean externos y que no sean el logo
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !link.closest('.jkhive-sidebar-logo')) {
        // Guardar la posición antes de navegar
        saveSidebarScrollPosition();
      }
    }, true); // Usar fase de captura para ejecutarse antes que otros listeners
  }

  // Agregar listener global para cerrar submenús al hacer click fuera
  function setupOutsideClickListener() {
    // Solo agregar una vez usando una marca en el documento
    if (document._jkhiveOutsideClickSetup) return;
    document._jkhiveOutsideClickSetup = true;

    // Usar setTimeout para asegurar que se ejecute después de que el DOM esté completamente cargado
    setTimeout(function() {
      document.addEventListener('click', function(e) {
        const sidebar = getSidebarElement();
        if (!sidebar) return;

        // Verificar si el click es dentro del sidebar o del submenú
        const clickedInSidebar = sidebar.contains(e.target);
        const clickedInSubmenu = e.target.closest('.jkhive-submenu-horizontal');
        const clickedOnToggle = e.target.closest('.jkhive-submenu-toggle');
        
        // Si no es dentro del sidebar ni del submenú, y no es el toggle, cerrar todos los submenús
        if (!clickedInSidebar && !clickedInSubmenu && !clickedOnToggle) {
          closeAllSubmenus();
        }
      }, true); // Usar fase de captura para que se ejecute antes
    }, 0);
  }

  // Detectar la página actual (debe coincidir con data-page del sidebar PHP en JK Hive)
  function getCurrentPage() {
    const path = window.location.pathname || '';
    let page = path.split('/').pop().replace('.php', '') || 'index';

    if (path.includes('/admin/')) {
      const adminPage = path.split('/admin/').pop().replace('.php', '');
      const adminMap = {
        'content': 'admin-content',
        'index-home': 'admin-index-home',
        'portfolio': 'admin-portfolio',
        'contact-page': 'admin-contact-page',
        'about': 'admin-about-page',
        'messages': 'admin-messages',
        'audit': 'admin-audit',
        'pedidos': 'admin-pedidos',
        'productos': 'admin-productos',
        'reportes': 'reportes',
        'configuracion': 'config',
        'carga-masiva': 'carga-masiva'
      };
      const pageMap = {
        'profile': 'profile',
        'dashboard': 'dashboard'
      };
      return adminMap[adminPage] || pageMap[adminPage] || adminPage;
    }

    const jkhivePublicPages = ['index', 'about', 'portfolio', 'contact', 'login', 'ecosistema-en-construccion'];
    if (jkhivePublicPages.indexOf(page) !== -1) {
      return page;
    }

    const pageMap = {
      'index': 'home',
      'pedidos': 'pedidos',
      'ventas': 'ventas',
      'clientes': 'clientes',
      'productos': 'productos',
      'notificaciones': 'notificaciones',
      'my-activity': 'activity',
      'messages': 'messages',
      'profile': 'profile',
      'dashboard': 'dashboard',
      'reportes': 'reportes',
      'configuracion': 'config',
      'usuarios': 'usuarios'
    };

    return pageMap[page] || page;
  }

  // Ruta al menú: desde raíz = includes/..., desde admin/ = ../includes/...
  function getMenuPath() {
    const path = window.location.pathname || '';
    if (path.indexOf('/admin/') !== -1) return '../includes/sidebar-menu.php';
    return 'includes/sidebar-menu.php';
  }


  // Cargar el menú o inicializar si ya está presente
  function loadMenu() {
    const menuContainer = document.getElementById('jkhive-sidebar-container');
    if (!menuContainer) {
      console.error('Container #jkhive-sidebar-container no encontrado');
      return;
    }

    // Si el menú ya está insertado por PHP, simplemente inicializarlo
    if (menuContainer.querySelector('.jkhive-sidebar')) {
      initMenuLogic(menuContainer);
      return;
    }

    // Fallback: Fetch del menú si no se cargó por PHP
    fetch(getMenuPath())
      .then(response => {
        if (!response.ok) throw new Error('Error cargando el menú: ' + response.status);
        return response.text();
      })
      .then(html => {
        menuContainer.innerHTML = html;
        initMenuLogic(menuContainer);
      })
      .catch(error => {
        console.error('Error al cargar el menú:', error);
      });
  }

  function initMenuLogic(menuContainer) {
        // Obtener posición guardada
        const savedScrollPosition = sessionStorage.getItem(STORAGE_KEY);
        
        // Cerrar todos los submenús antes de continuar
        closeAllSubmenus();
        
        // Obtener el sidebar
        const sidebar = getSidebarElement();
        
        // Restaurar posición INMEDIATAMENTE
        if (sidebar && savedScrollPosition !== null) {
          sidebar.scrollTop = parseInt(savedScrollPosition, 10);
        }

        // Marcar la página activa automáticamente
        const currentPage = getCurrentPage();
        const menuItems = menuContainer.querySelectorAll('.jkhive-nav-item[data-page]');
        
        // Primero, verificar si la página actual pertenece a un submenú
        const submenuItems = menuContainer.querySelectorAll('.jkhive-submenu-item[data-page]');
        let foundInSubmenu = false;
        
        submenuItems.forEach(item => {
          const itemPage = item.getAttribute('data-page');
          if (itemPage === currentPage) {
            item.classList.add('active');
            foundInSubmenu = true;
            // Marcar el item padre del submenú como activo y clase para flip del icono trasero
            const parentNavItem = item.closest('.jkhive-nav-item-submenu');
            if (parentNavItem) {
              parentNavItem.classList.add('active');
            }
          } else {
            item.classList.remove('active');
          }
        });
        refreshSubmenuCurrentClasses(menuContainer);
        syncSubmenuToggleBackIcons(menuContainer);
        
        // Limpiar todos los items activos del menú principal (excepto padres de submenú con hijo activo)
        menuItems.forEach(item => {
          if (item.classList.contains('jkhive-nav-item-submenu') && item.querySelector('.jkhive-submenu-item.active')) {
            return; // Mantener active en el padre cuyo hijo está en la página actual
          }
          item.classList.remove('active');
        });
        
        // Marcar items del menú principal (incl. home cuando no está en submenú)
        menuItems.forEach(item => {
          const itemPage = item.getAttribute('data-page');
          if (item.classList.contains('jkhive-nav-item-submenu')) {
            return; // Los padres de submenú ya fueron marcados en submenuItems
          }
          if (itemPage === currentPage) {
            item.classList.add('active');
          }
        });

        // Restaurar posición del scroll de forma más precisa después de marcar activos
        restoreSidebarScrollPosition();

        // Agregar listeners para mantener posición del scroll
        // Usar setTimeout para asegurar que el DOM esté completamente renderizado
        setTimeout(function() {
          attachScrollPositionListeners();
          const toggles = menuContainer.querySelectorAll('.jkhive-submenu-toggle');
          toggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              const navItem = toggle.closest('.jkhive-nav-item-submenu');
              if (navItem) toggleSubmenu(navItem);
              return false;
            }, true);
          });
        }, 0);

        // Disparar evento de menú cargado
        window.dispatchEvent(new CustomEvent('menuLoaded'));
  }

  // API pública para compatibilidad con código existente
  window.SidebarMenu = {
    load: function() {
      return new Promise((resolve, reject) => {
        const menuContainer = document.getElementById('jkhive-sidebar-container');
        if (!menuContainer) {
          reject(new Error('Container no encontrado'));
          return;
        }

        if (menuContainer.querySelector('.jkhive-sidebar')) {
          initMenuLogic(menuContainer);
          resolve();
          return;
        }

        fetch(getMenuPath())
          .then(response => {
            if (!response.ok) throw new Error('Error cargando el menú: ' + response.status);
            return response.text();
          })
          .then(html => {
            menuContainer.innerHTML = html;
            initMenuLogic(menuContainer);
            resolve();
          })
          .catch(error => {
            console.error('Error al cargar el menú:', error);
            reject(error);
          });
      });
    },
    
    setActive: function(pageName) {
      // Primero, cerrar todos los submenús abiertos
      closeAllSubmenus();
      
      // Limpiar todos los items activos
      document.querySelectorAll('.jkhive-nav-item.active').forEach(item => {
        item.classList.remove('active');
      });
      document.querySelectorAll('.jkhive-submenu-item.active').forEach(item => {
        item.classList.remove('active');
      });
      
      // Primero, verificar si pertenece a un submenú
      const submenuItems = document.querySelectorAll('.jkhive-submenu-item[data-page]');
      let foundInSubmenu = false;
      
      submenuItems.forEach(item => {
        if (item.getAttribute('data-page') === pageName) {
          item.classList.add('active');
          foundInSubmenu = true;
          const parentNavItem = item.closest('.jkhive-nav-item-submenu');
          if (parentNavItem) {
            parentNavItem.classList.add('active');
          }
        }
      });

      refreshSubmenuCurrentClasses(document);
      syncSubmenuToggleBackIcons(document);
      
      // Si no se encontró en el submenú, buscar en el menú principal
      if (!foundInSubmenu) {
        const menuItems = document.querySelectorAll('.jkhive-nav-item[data-page]');
        menuItems.forEach(item => {
          // Saltar items del submenú padre
          if (item.classList.contains('jkhive-nav-item-submenu')) {
            return;
          }
          if (item.getAttribute('data-page') === pageName) {
            item.classList.add('active');
          }
        });
      }
    },
    
    loadMenu: function(pageName) {
      // Si se especifica una página, cargar y marcar como activa
      if (pageName) {
        this.load().then(() => {
          this.setActive(pageName);
        });
      } else {
        // Si no, usar la función interna que detecta automáticamente
        loadMenu();
      }
    }
  };

  // Agregar listener global para cerrar submenús al hacer click fuera
  // NO usar fase de captura para evitar interferir con los toggles del navbar
  setTimeout(function() {
    document.addEventListener('click', function(e) {
      const sidebar = getSidebarElement();
      if (!sidebar) return;

      // Verificar si el click es dentro del sidebar o del submenú
      const clickedInSidebar = sidebar.contains(e.target);
      const clickedInSubmenu = e.target.closest('.jkhive-submenu-horizontal');
      const clickedOnToggle = e.target.closest('.jkhive-submenu-toggle');
      
      // Verificar si el click es en elementos del menú superior derecho
      // Buscar navbar-right que contiene todos los elementos del menú superior
      const navbarRight = e.target.closest('.jkhive-navbar-right');
      const clickedInNavbar = e.target.closest('.jkhive-navbar');
      const clickedInLangSelector = e.target.closest('.jkhive-lang-selector');
      const clickedInNotifSelector = e.target.closest('.jkhive-notif-selector');
      const clickedInUserMenu = e.target.closest('#userMenuDropdown') || e.target.closest('[id*="userMenu"]');
      const clickedInUserMenuToggle = e.target.closest('#userMenuToggle');
      const clickedInNavbarHex = e.target.closest('.jkhive-navbar-hex-item') || e.target.closest('.jkhive-navbar-hex-wrapper');
      
      // NO cerrar submenú lateral si el click es en un toggle del navbar (dejar que los toggles manejen su propio estado)
      const isNavbarToggle = clickedInLangSelector || clickedInNotifSelector || clickedInUserMenuToggle;
      
      // Cerrar submenú lateral si:
      // 1. El click es en el navbar-right PERO NO en un toggle (para no interferir con los toggles)
      // 2. El click es en elementos específicos del navbar superior PERO NO en toggles
      // 3. El click NO es dentro del sidebar, submenú, ni toggle
      const isNavbarRightClick = !!navbarRight && !isNavbarToggle;
      const isNavbarElementClick = (clickedInNavbar || clickedInUserMenu || clickedInNavbarHex) && !isNavbarToggle;
      const isOutsideSidebar = !clickedInSidebar && !clickedInSubmenu && !clickedOnToggle;
      
      if (isNavbarRightClick || isNavbarElementClick) {
        closeAllSubmenus();
      } else if (isOutsideSidebar) {
        closeAllSubmenus();
      }
    }); // NO usar fase de captura para evitar interferir con los toggles
  }, 100);

  // Cargar el menú automáticamente cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMenu);
  } else {
    loadMenu();
  }
})();
