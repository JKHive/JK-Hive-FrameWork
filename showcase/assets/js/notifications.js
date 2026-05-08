/**
 * HouseSitting - Notificaciones (navbar)
 * 
 * Sistema de notificaciones hexagonal (IDÉNTICO al selector de idiomas)
 * Muestra: Mensajes, Compras, Donaciones, Usuarios nuevos
 */

class NotificationsSystem {
    constructor() {
        this.apiBase = (typeof HostsConfig !== 'undefined' && HostsConfig.getApiNotificationsBase)
            ? HostsConfig.getApiNotificationsBase().replace(/\/$/, '')
            : (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrl
                ? HostsConfig.getCrmUrl() + '/api/notifications'
                : 'api/notifications');
        this.counts = {
            messages: 0,
            purchases: 0,
            donations: 0,
            users: 0,
            total: 0
        };
        this.pollInterval = null;
        this.currentInterval = 3000; // Intervalo actual en ms
        this.isPolling = false;
        this.abortController = null; // Para cancelar requests pendientes
        this.init(); // Llamar init() igual que i18n
    }
    
    async init() {
        // Configurar el selector hexagonal PRIMERO (igual que i18n hace setupHexagonalSelector en init)
        this.setupHexagonalSelector();
        
        // Cargar notificaciones después (no bloquea la inicialización del selector)
        this.loadNotifications().catch(e => console.error('Error loading notifications:', e));
        
        // Iniciar polling - NUNCA se detiene, incluso cuando la pestaña está inactiva
        this.startPolling();
        
        // Ajustar intervalo según visibilidad, pero NUNCA detener el polling
        // Cuando está visible: polling cada 3 segundos (más rápido)
        // Cuando está oculta: polling cada 10 segundos (más lento, pero sigue funcionando)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pestaña oculta: reducir frecuencia pero seguir funcionando
                this.adjustPollingInterval(10000); // 10 segundos cuando está oculta
            } else {
                // Pestaña visible: máxima frecuencia
                this.adjustPollingInterval(3000); // 3 segundos cuando está visible
                // Cargar inmediatamente cuando vuelve a estar visible
                this.loadNotifications().catch(e => console.error('Error loading notifications:', e));
            }
        });
        
        // Iniciar con intervalo rápido (pestaña visible por defecto)
        this.adjustPollingInterval(3000);
    }
    
    async loadNotifications(signal = null) {
        let timeoutId = null;
        try {
            // Verificar si el usuario está autenticado antes de intentar cargar notificaciones
            // Si no está autenticado, no intentar cargar (evitar errores 401 repetitivos)
            let isAuthenticated = false;
            
            // Intentar obtener el estado de autenticación desde AuthManager si está disponible
            if (typeof window.AuthManager !== 'undefined' && window.AuthManager.isAuthenticated !== undefined) {
                isAuthenticated = window.AuthManager.isAuthenticated;
            } else if (typeof window.authManager !== 'undefined' && window.authManager.isAuthenticated !== undefined) {
                isAuthenticated = window.authManager.isAuthenticated;
            } else {
                // Si AuthManager no está disponible, verificar directamente con la API
                try {
                    const authStatusUrl = (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath)
                        ? HostsConfig.getCrmUrlPath('api/auth/status.php')
                        : (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath ? HostsConfig.getCrmUrlPath('api/auth/status.php') : 'api/auth/status.php');
                    
                    const authResponse = await fetch(authStatusUrl, {
                        method: 'GET',
                        credentials: 'same-origin',
                        cache: 'no-cache'
                    });
                    
                    if (authResponse.ok) {
                        const authData = await authResponse.json();
                        isAuthenticated = authData.success && authData.authenticated === true;
                    }
                } catch (e) {
                    // Si falla la verificación, asumir que no está autenticado
                    isAuthenticated = false;
                }
            }
            
            // Si no está autenticado, no intentar cargar notificaciones
            if (!isAuthenticated) {
                // Resetear contadores y ocultar badges
                this.counts = {
                    messages: 0,
                    purchases: 0,
                    donations: 0,
                    users: 0,
                    total: 0
                };
                this.updateBadge();
                this.updateHexCounts();
                return; // Salir silenciosamente sin error
            }
            
            // Obtener timestamps de última vista (usar localStorage para persistir entre pestañas)
            let lastViewedPurchases = localStorage.getItem('jk_last_viewed_purchases');
            let lastViewedDonations = localStorage.getItem('jk_last_viewed_donations');
            let lastViewedUsers = localStorage.getItem('jk_last_viewed_users');
            
            // Si no hay timestamp guardado, inicializarlo con la fecha/hora actual
            // Esto evita mostrar notificaciones históricas la primera vez que se carga
            const now = new Date().toISOString();
            if (!lastViewedPurchases) {
                localStorage.setItem('jk_last_viewed_purchases', now);
                lastViewedPurchases = now;
            }
            if (!lastViewedDonations) {
                localStorage.setItem('jk_last_viewed_donations', now);
                lastViewedDonations = now;
            }
            if (!lastViewedUsers) {
                localStorage.setItem('jk_last_viewed_users', now);
                lastViewedUsers = now;
            }
            
            // Construir URL con parámetros
            const url = new URL(`${this.apiBase}/index.php`, window.location.origin);
            if (lastViewedPurchases) url.searchParams.append('last_viewed_purchases', lastViewedPurchases);
            if (lastViewedDonations) url.searchParams.append('last_viewed_donations', lastViewedDonations);
            if (lastViewedUsers) url.searchParams.append('last_viewed_users', lastViewedUsers);
            
            // Agregar timestamp para evitar caché
            url.searchParams.append('_t', Date.now());
            
            // Configurar fetch con timeout y signal para cancelación
            const fetchOptions = {
                method: 'GET',
                credentials: 'same-origin',
                cache: 'no-cache',
                signal: signal
            };
            
            // Timeout de 8 segundos para evitar requests colgados
            timeoutId = setTimeout(() => {
                if (this.abortController) {
                    this.abortController.abort();
                }
            }, 8000);
            
            const response = await fetch(url.toString(), fetchOptions);
            clearTimeout(timeoutId);
            timeoutId = null;
            
            // Si recibimos 401, el usuario no está autenticado - manejar silenciosamente
            if (response.status === 401) {
                this.counts = {
                    messages: 0,
                    purchases: 0,
                    donations: 0,
                    users: 0,
                    total: 0
                };
                this.updateBadge();
                this.updateHexCounts();
                return; // Salir silenciosamente sin error
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                const previousMessagesCount = this.counts.messages || 0;
                this.counts = {
                    messages: data.data.messages_unread || 0,
                    purchases: data.data.purchases_new || 0,
                    donations: data.data.donations_new || 0,
                    users: data.data.users_new || 0,
                    total: data.data.total || 0
                };
                
                this.updateBadge();
                this.updateHexCounts();
                
                // Si hay nuevos mensajes y estamos en la página de mensajería, actualizar inmediatamente
                if (this.counts.messages > previousMessagesCount && typeof window.messagingSystem !== 'undefined') {
                    // Verificar si estamos en la página de mensajería
                    const isMessagesPage = window.location.pathname.includes('messages.php');
                    if (isMessagesPage && window.messagingSystem) {
                        // Si estamos en la bandeja de entrada, recargar inmediatamente
                        if (window.messagingSystem.currentFolder === 'inbox') {
                            window.messagingSystem.loadMessages('inbox').catch(e => {
                                console.error('Error recargando mensajes después de notificación:', e);
                            });
                        }
                    }
                }
            }
        } catch (e) {
            // Ignorar errores de abort, timeout o 401 (no autenticado)
            if (e.name !== 'AbortError' && e.name !== 'TimeoutError') {
                // Solo mostrar error si no es un 401 (no autenticado)
                if (!e.message || !e.message.includes('401')) {
                    console.error('Error cargando notificaciones:', e);
                }
                // Si hay error, resetear contadores
                this.counts = {
                    messages: 0,
                    purchases: 0,
                    donations: 0,
                    users: 0,
                    total: 0
                };
                this.updateBadge();
                this.updateHexCounts();
            }
        } finally {
            // Limpiar timeout si aún está activo
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    }
    
    /**
     * Setup hexagonal notification selector (IDÉNTICO al selector de idiomas)
     */
    setupHexagonalSelector() {
        const selector = document.querySelector('.jkhive-notif-selector');
        if (!selector) {
            console.warn('Notification selector not found');
            return;
        }
        
        const container = selector.querySelector('.jkhive-notif-hex-container');
        const hexagons = selector.querySelectorAll('.jkhive-notif-hex');
        
        console.log('Notification selector found:', selector);
        console.log('Container found:', container);
        console.log('Hexagons found:', hexagons.length);
        
        if (!container) {
            console.error('Notification hex container not found!');
            return;
        }
        
        if (hexagons.length === 0) {
            console.error('No notification hexagons found!');
            return;
        }
        
        // Función para cerrar todos los demás menús del navbar (excepto este)
        const closeAllOtherNavbarDropdowns = () => {
            // Cerrar menú de usuario
            const userDropdown = document.getElementById('userMenuDropdown');
            if (userDropdown) userDropdown.classList.remove('active');
            
            // Cerrar selector de idiomas
            const langSelector = document.querySelector('.jkhive-lang-selector');
            if (langSelector) langSelector.classList.remove('open');
            
            // Cerrar menú del carrito (si existe en CRM)
            const cartDropdown = document.getElementById('cartDropdown');
            if (cartDropdown) {
                cartDropdown.style.display = 'none';
                cartDropdown.classList.remove('active');
            }
            
            // Cerrar instancias si existen
            if (typeof shoppingCart !== 'undefined' && shoppingCart) {
                shoppingCart.closeCartDropdown();
            }
        };
        
        // Click on container to toggle (IDÉNTICO al selector de idiomas)
        selector.addEventListener('click', (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation(); // Prevenir que otros listeners interfieran
            
            // If clicking on a non-main hexagon, handle navigation
            const clickedHex = e.target.closest('.jkhive-notif-hex');
            if (clickedHex && !clickedHex.classList.contains('jkhive-notif-main')) {
                const type = clickedHex.dataset.notifType;
                const link = this.getNotificationLink(type);
                
                // Marcar timestamp de última vista para compras, donaciones y usuarios (usar localStorage para persistir entre pestañas)
                if (type === 'purchases' && this.counts.purchases > 0) {
                    localStorage.setItem('jk_last_viewed_purchases', new Date().toISOString());
                    this.counts.purchases = 0;
                    this.counts.total = this.counts.messages + this.counts.purchases + this.counts.donations + this.counts.users;
                    this.updateBadge();
                    this.updateHexCounts();
                } else if (type === 'donations' && this.counts.donations > 0) {
                    localStorage.setItem('jk_last_viewed_donations', new Date().toISOString());
                    this.counts.donations = 0;
                    this.counts.total = this.counts.messages + this.counts.purchases + this.counts.donations + this.counts.users;
                    this.updateBadge();
                    this.updateHexCounts();
                } else if (type === 'users' && this.counts.users > 0) {
                    localStorage.setItem('jk_last_viewed_users', new Date().toISOString());
                    this.counts.users = 0;
                    this.counts.total = this.counts.messages + this.counts.purchases + this.counts.donations + this.counts.users;
                    this.updateBadge();
                    this.updateHexCounts();
                }
                
                // Navegar al enlace
                if (link && link !== '#') {
                    this.close();
                    setTimeout(() => {
                        window.location.href = link;
                    }, 200);
                } else {
                    // Cerrar después de un delay
                    setTimeout(() => {
                        this.close();
                    }, 300);
                }
            } else {
                // Guardar el estado ANTES de cerrar otros menús
                const wasOpen = selector.classList.contains('open');
                console.log('Toggle notificaciones - estado actual:', wasOpen ? 'abierto' : 'cerrado');
                
                // Cerrar otros menús del navbar ANTES de hacer toggle
                closeAllOtherNavbarDropdowns();
                
                // Usar requestAnimationFrame para asegurar que el toggle se ejecute después de cerrar otros menús
                requestAnimationFrame(() => {
                    // Hacer toggle basado en el estado guardado (no el actual, porque closeAllOtherNavbarDropdowns puede haberlo afectado)
                    if (wasOpen) {
                        selector.classList.remove('open');
                        console.log('Cerrando selector de notificaciones');
                    } else {
                        selector.classList.add('open');
                        console.log('Abriendo selector de notificaciones');
                        // Verificar que los hexágonos estén visibles
                        setTimeout(() => {
                            const visibleHexes = selector.querySelectorAll('.jkhive-notif-hex:not(.jkhive-notif-main)');
                            console.log('Hexágonos visibles después de abrir:', visibleHexes.length);
                            visibleHexes.forEach((hex, idx) => {
                                console.log(`Hex ${idx}:`, {
                                    type: hex.dataset.notifType,
                                    opacity: window.getComputedStyle(hex).opacity,
                                    transform: window.getComputedStyle(hex).transform,
                                    visibility: window.getComputedStyle(hex).visibility,
                                    display: window.getComputedStyle(hex).display,
                                    top: window.getComputedStyle(hex).top,
                                    left: window.getComputedStyle(hex).left,
                                    zIndex: window.getComputedStyle(hex).zIndex
                                });
                            });
                        }, 100);
                    }
                });
            }
        });
        
        // Close when clicking outside (pero NO si el click es en otro toggle del navbar)
        document.addEventListener('click', (e) => {
            // No cerrar si el click es en otro toggle del navbar (dejar que ese toggle maneje su propio estado)
            const clickedInLangSelector = e.target.closest('.jkhive-lang-selector');
            const clickedInUserMenuToggle = e.target.closest('#userMenuToggle');
            const clickedInUserMenu = e.target.closest('#userMenuDropdown') || e.target.closest('[id*="userMenu"]');
            const isNavbarToggle = clickedInLangSelector || clickedInUserMenuToggle || clickedInUserMenu;
            
            if (!selector.contains(e.target) && selector.classList.contains('open') && !isNavbarToggle) {
                selector.classList.remove('open');
                console.log('Notification selector closed (click outside)');
            }
        });
        
        // Close on ESC key (IDÉNTICO al selector de idiomas)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && selector.classList.contains('open')) {
                selector.classList.remove('open');
                console.log('Notification selector closed (ESC key)');
            }
        });
    }
    
    getNotificationLink(type) {
        const baseUrl = (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrl)
            ? HostsConfig.getCrmUrl()
            : '/crm';
        
        switch(type) {
            case 'messages':
                return `${baseUrl}/messages.php`;
            case 'purchases':
                return `${baseUrl}/admin/purchases.php`;
            case 'donations':
                return `${baseUrl}/admin/donations.php`;
            case 'users':
                return `${baseUrl}/admin/users.php`;
            default:
                return '#';
        }
    }
    
    updateBadge() {
        // Actualizar badge en el hexágono principal (badge está fuera del hexágono)
        const selector = document.querySelector('.jkhive-notif-selector');
        if (selector) {
            const container = selector.querySelector('.jkhive-notif-hex-container');
            if (container) {
                let badge = container.querySelector('.jkhive-notif-badge-main') || 
                           document.getElementById('notificationsBadge');
                
                if (this.counts.total > 0) {
                    if (!badge) {
                        badge = document.createElement('span');
                        badge.className = 'jkhive-notification-badge jkhive-notif-badge-main';
                        badge.id = 'notificationsBadge';
                        container.appendChild(badge);
                    }
                    badge.textContent = this.counts.total > 99 ? '99+' : this.counts.total;
                    badge.style.display = 'flex';
                } else {
                    if (badge) {
                        badge.style.display = 'none';
                    }
                }
            }
        }
    }
    
    updateHexCounts() {
        const selector = document.querySelector('.jkhive-notif-selector');
        if (!selector) return;
        
        const container = selector.querySelector('.jkhive-notif-hex-container');
        if (!container) return;
        
        const types = ['messages', 'purchases', 'donations', 'users'];
        
        types.forEach(type => {
            let count = 0;
            
            switch(type) {
                case 'messages':
                    count = this.counts.messages;
                    break;
                case 'purchases':
                    count = this.counts.purchases;
                    break;
                case 'donations':
                    count = this.counts.donations;
                    break;
                case 'users':
                    count = this.counts.users;
                    break;
            }
            
            // Buscar badge existente en el container (no en el hexágono)
            let badge = container.querySelector(`.jkhive-notif-badge[data-notif-type="${type}"]`);
            
            if (count > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'notif-count-badge jkhive-notif-badge';
                    badge.setAttribute('data-notif-type', type);
                    container.appendChild(badge);
                }
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.display = 'flex';
            } else {
                if (badge) {
                    badge.style.display = 'none';
                }
            }
        });
    }
    
    open() {
        const selector = document.querySelector('.jkhive-notif-selector');
        if (selector) {
            selector.classList.add('open');
        }
    }
    
    close() {
        const selector = document.querySelector('.jkhive-notif-selector');
        if (selector) {
            selector.classList.remove('open');
        }
    }
    
    startPolling() {
        // Solo iniciar si no está ya corriendo
        if (this.pollInterval) {
            return;
        }
        // Intervalo inicial: 3 segundos (se ajustará según visibilidad)
        this.pollInterval = setInterval(async () => {
            if (!this.isPolling) {
                await this.checkForNewNotifications();
            }
        }, 3000);
    }
    
    /**
     * Ajustar intervalo de polling sin detenerlo
     * Permite cambiar la frecuencia según la visibilidad de la pestaña
     */
    adjustPollingInterval(newInterval) {
        // Si el intervalo es el mismo, no hacer nada
        if (this.currentInterval === newInterval) {
            return;
        }
        
        // Guardar el nuevo intervalo
        this.currentInterval = newInterval;
        
        // Detener el intervalo actual
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
        
        // Iniciar nuevo intervalo con la nueva frecuencia
        this.pollInterval = setInterval(async () => {
            if (!this.isPolling) {
                await this.checkForNewNotifications();
            }
        }, newInterval);
    }
    
    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
            this.currentInterval = null;
        }
    }
    
    async checkForNewNotifications() {
        if (this.isPolling) return;
        
        // Verificar si el usuario está autenticado antes de intentar cargar
        let isAuthenticated = false;
        if (typeof window.AuthManager !== 'undefined' && window.AuthManager.isAuthenticated !== undefined) {
            isAuthenticated = window.AuthManager.isAuthenticated;
        } else if (typeof window.authManager !== 'undefined' && window.authManager.isAuthenticated !== undefined) {
            isAuthenticated = window.authManager.isAuthenticated;
        }
        
        // Si no está autenticado, no intentar cargar notificaciones
        if (!isAuthenticated) {
            return;
        }
        
        try {
            this.isPolling = true;
            
            // Usar AbortController para cancelar requests si hay uno pendiente
            if (this.abortController) {
                this.abortController.abort();
            }
            this.abortController = new AbortController();
            
            await this.loadNotifications(this.abortController.signal);
        } catch (e) {
            // Ignorar errores de abort o 401 (no autenticado)
            if (e.name !== 'AbortError' && (!e.message || !e.message.includes('401'))) {
                console.error('Error verificando notificaciones:', e);
            }
        } finally {
            this.isPolling = false;
        }
    }
    
    /**
     * Método público para refrescar notificaciones manualmente
     * Útil cuando se envía un mensaje o se marca como leído
     */
    async refreshNotifications() {
        try {
            await this.loadNotifications();
        } catch (e) {
            console.error('Error refrescando notificaciones:', e);
        }
    }
    
    // Método para actualizar el contador de mensajes cuando se abre uno
    decrementMessageCount() {
        if (this.counts.messages > 0) {
            this.counts.messages--;
            this.counts.total = this.counts.messages + this.counts.purchases + this.counts.donations + this.counts.users;
            this.updateBadge();
            this.updateHexCounts();
        }
    }
}

// Inicializar sistema de notificaciones
let notificationsSystem;

// Función de inicialización (igual que i18n)
function initNotifications() {
    notificationsSystem = new NotificationsSystem();
    window.notificationsSystem = notificationsSystem;
}

// Wait for DOM to be ready (igual que i18n)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotifications);
} else {
    initNotifications();
}
