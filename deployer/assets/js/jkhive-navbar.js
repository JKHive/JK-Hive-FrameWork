/**
 * JK Hive - Navbar JavaScript (Unified)
 * 
 * Este archivo contiene TODO el JavaScript relacionado con el navbar superior:
 * - Sistema de internacionalización (i18n) - Selector de idiomas
 * - Sistema de notificaciones - Selector de notificaciones
 * - Sistema de búsqueda global
 * - Gestión de autenticación y menú de usuario
 * 
 * IMPORTANTE: Este archivo es completamente independiente y aislado
 * de otros scripts del sistema para evitar conflictos.
 */

(function() {
  'use strict';

  // ========================================
  // TRANSLATION DICTIONARY (i18n)
  // ========================================
  
  /**
   * Función centralizada para cerrar el menú de usuario
   * Fuerza un reflow del navegador para asegurar que el CSS se actualice correctamente
   */
  const closeUserMenu = () => {
    const userDropdown = document.getElementById('userMenuDropdown');
    const userMenuContainer = document.getElementById('userMenuContainer');
    
    if (userDropdown) {
      userDropdown.classList.remove('active');
    }
    
    if (userMenuContainer) {
      const userWrapper = userMenuContainer.querySelector('.jkhive-user-menu-wrapper');
      if (userWrapper) {
        userWrapper.classList.remove('active');
        // Forzar reflow para asegurar que el CSS se actualice
        void userWrapper.offsetHeight;
      }
    }
  };

  const translations = {
    es: {
      // Navigation
      nav_home: 'Inicio',
      nav_about: 'Sobre Mí',
      nav_portfolio: 'Portafolio',
      nav_services: 'Servicios',
      nav_products: 'Productos',
      nav_tools: 'Herramientas',
      nav_contact: 'Contacto',
      
      // CRM
      crm_home: 'Home',
      crm_messages: 'Mensajes',
      crm_profile: 'Perfil',
      crm_logout: 'Cerrar Sesión',
      crm_search: 'Buscar',
      crm_notifications: 'Notificaciones',
      crm_back_to_web: 'Volver a la página web',
      
      // Common
      learn_more: 'Más Información',
      try_now: 'Probar Ahora',
      get_started: 'Comenzar',
      free: 'Gratis',
      popular: 'Popular',
      new: 'Nuevo',
      coming_soon: 'Próximamente',
      // Admin tables (column headers; width adapts to text per language)
      admin_table_estado: 'Estado',
      admin_table_acciones: 'Acciones',
    },
    
    en: {
      // Navigation
      nav_home: 'Home',
      nav_about: 'About Me',
      nav_portfolio: 'Portfolio',
      nav_services: 'Services',
      nav_products: 'Products',
      nav_tools: 'Tools',
      nav_contact: 'Contact',
      
      // CRM
      crm_home: 'Home',
      crm_messages: 'Messages',
      crm_profile: 'Profile',
      crm_logout: 'Log Out',
      crm_search: 'Search',
      crm_notifications: 'Notifications',
      crm_back_to_web: 'Back to website',
      
      // Common
      learn_more: 'Learn More',
      get_started: 'Get Started',
      free: 'Free',
      popular: 'Popular',
      new: 'New',
      coming_soon: 'Coming Soon',
      admin_table_estado: 'Status',
      admin_table_acciones: 'Actions',
    },
    
    it: {
      // Navigation
      nav_home: 'Home',
      nav_about: 'Chi Sono',
      nav_portfolio: 'Portfolio',
      nav_services: 'Servizi',
      nav_products: 'Prodotti',
      nav_tools: 'Strumenti',
      nav_contact: 'Contatto',
      
      // CRM
      crm_home: 'Home',
      crm_messages: 'Messaggi',
      crm_profile: 'Profilo',
      crm_logout: 'Esci',
      crm_search: 'Cerca',
      crm_notifications: 'Notifiche',
      crm_back_to_web: 'Torna al sito web',
      
      // Common
      learn_more: 'Scopri di Più',
      get_started: 'Inizia',
      free: 'Gratis',
      popular: 'Popolare',
      new: 'Nuovo',
      coming_soon: 'Prossimamente',
      admin_table_estado: 'Stato',
      admin_table_acciones: 'Azioni',
    },
    
    de: {
      // Navigation
      nav_home: 'Startseite',
      nav_about: 'Über Mich',
      nav_portfolio: 'Portfolio',
      nav_services: 'Dienstleistungen',
      nav_products: 'Produkte',
      nav_tools: 'Werkzeuge',
      nav_contact: 'Kontakt',
      
      // CRM
      crm_home: 'Home',
      crm_messages: 'Nachrichten',
      crm_profile: 'Profil',
      crm_logout: 'Abmelden',
      crm_search: 'Suchen',
      crm_notifications: 'Benachrichtigungen',
      crm_back_to_web: 'Zurück zur Website',
      
      // Common
      learn_more: 'Mehr Erfahren',
      get_started: 'Loslegen',
      free: 'Kostenlos',
      popular: 'Beliebt',
      new: 'Neu',
      coming_soon: 'Demnächst',
      admin_table_estado: 'Status',
      admin_table_acciones: 'Aktionen',
    }
  };

  // Merge website translations (index, about, contact) if loaded
  if (typeof window !== 'undefined' && window.WEBSITE_TRANSLATIONS) {
    ['es', 'en', 'it', 'de'].forEach(function(lang) {
      if (window.WEBSITE_TRANSLATIONS[lang]) {
        Object.assign(translations[lang], window.WEBSITE_TRANSLATIONS[lang]);
      }
    });
  }

  // ========================================
  // I18N CLASS (Language Selector)
  // ========================================
  
  class I18n {
    constructor() {
      this.currentLanguage = this.detectLanguage();
      this.init();
    }
    
    detectLanguage() {
      const savedLang = localStorage.getItem('jkhive-language');
      const validLangs = ['es', 'en', 'it', 'de'];
      if (savedLang && validLangs.includes(savedLang)) {
        return savedLang;
      }
      
      const browserLang = (navigator.language || navigator.userLanguage).toLowerCase();
      
      if (browserLang.startsWith('es')) return 'es';
      if (browserLang.startsWith('it')) return 'it';
      if (browserLang.startsWith('de')) return 'de';
      
      return 'en';
    }
    
    init() {
      this.setLanguage(this.currentLanguage);
      this.setupLanguageSwitchers();
      if (window.JKUtils && window.JKUtils.Logger) {
        window.JKUtils.Logger.log(`🌐 Language initialized: ${this.currentLanguage}`);
      } else if (window.JK_DEBUG) console.log(`🌐 Language initialized: ${this.currentLanguage}`);
    }
    
    t(key) {
      const lang = translations[this.currentLanguage];
      return lang[key] || key;
    }
    
    setLanguage(lang) {
      const validLangs = ['es', 'en', 'it', 'de'];
      if (!validLangs.includes(lang)) {
        if (window.JK_DEBUG) console.warn(`Invalid language: ${lang}. Using 'en' as fallback.`);
        lang = 'en';
      }
      
      this.currentLanguage = lang;
      localStorage.setItem('jkhive-language', lang);
      document.documentElement.lang = lang;
      
      this.updateContent();
      this.updateActiveSwitcher();
      
      document.dispatchEvent(new CustomEvent('language-changed', {
        detail: { language: lang }
      }));
    }
    
    updateContent() {
      var self = this;
      document.querySelectorAll('[data-i18n]').forEach(function(element) {
        var key = element.dataset.i18n;
        var translation = self.t(key);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          if (element.dataset.i18nHtml !== undefined) {
            element.innerHTML = translation;
          } else {
            element.textContent = translation;
          }
        }
      });
      document.querySelectorAll('[data-i18n-tooltip]').forEach(function(element) {
        var key = element.dataset.i18nTooltip;
        if (key) element.setAttribute('data-tooltip', self.t(key));
      });
      if (document.body.dataset.i18nDoctitle) {
        document.title = self.t(document.body.dataset.i18nDoctitle);
      }
    }
    
    setupLanguageSwitchers() {
      const switchers = document.querySelectorAll('[data-lang-switch]');
      
      switchers.forEach(switcher => {
        switcher.addEventListener('click', (e) => {
          e.preventDefault();
          const lang = switcher.dataset.langSwitch;
          this.setLanguage(lang);
        });
      });
      
      this.setupHexagonalSelector();
    }
    
    setupHexagonalSelector() {
      const maxAttempts = 50;
      let attempts = 0;
      const trySetup = () => {
        const selector = document.querySelector('.jkhive-lang-selector');
        if (!selector) {
          attempts += 1;
          if (attempts < maxAttempts) {
            if (window.JK_DEBUG) console.warn('Language selector not found, retrying...');
            setTimeout(trySetup, 200);
          }
          return;
        }
      
      const container = selector.querySelector('.jkhive-lang-hex-container');
      const hexagons = selector.querySelectorAll('.jkhive-lang-hex');
      
      if (window.JK_DEBUG) console.log('Language selector initialized with', hexagons.length, 'languages');
      
      const closeAllOtherNavbarDropdowns = () => {
        // Usar función centralizada para cerrar menú de usuario
        closeUserMenu();
        
        const notifDropdown = document.getElementById('notificationDropdown');
        if (notifDropdown) {
          notifDropdown.style.display = 'none';
          notifDropdown.classList.remove('active');
        }
        const notifSelector = document.querySelector('.jkhive-notif-selector.open');
        if (notifSelector) notifSelector.classList.remove('open');
        
        const cartDropdown = document.getElementById('cartDropdown');
        if (cartDropdown) {
          cartDropdown.style.display = 'none';
          cartDropdown.classList.remove('active');
        }
        
        if (typeof window.notificationsSystem !== 'undefined' && window.notificationsSystem) {
          window.notificationsSystem.close();
        }
        if (typeof window.shoppingCart !== 'undefined' && window.shoppingCart) {
          window.shoppingCart.closeCartDropdown();
        }
      };
      
      selector.addEventListener('click', (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        const clickedHex = e.target.closest('.jkhive-lang-hex');
        if (clickedHex && !clickedHex.classList.contains('active')) {
          const lang = clickedHex.dataset.lang;
          if (window.JK_DEBUG) console.log('Changing language to:', lang);
          this.setLanguage(lang);
          setTimeout(() => {
            selector.classList.remove('open');
          }, 300);
        } else {
          const wasOpen = selector.classList.contains('open');
          closeAllOtherNavbarDropdowns();
          requestAnimationFrame(() => {
            if (wasOpen) {
              selector.classList.remove('open');
            } else {
              selector.classList.add('open');
            }
            if (window.JK_DEBUG) console.log('Language selector toggled:', !wasOpen ? 'open' : 'closed');
          });
        }
      });
      
      document.addEventListener('click', (e) => {
        const clickedInNotifSelector = e.target.closest('.jkhive-notif-selector');
        const clickedInUserMenuToggle = e.target.closest('#userMenuToggle');
        const clickedInUserMenu = e.target.closest('#userMenuDropdown') || e.target.closest('[id*="userMenu"]');
        const isNavbarToggle = clickedInNotifSelector || clickedInUserMenuToggle || clickedInUserMenu;
        
        if (!selector.contains(e.target) && selector.classList.contains('open') && !isNavbarToggle) {
          selector.classList.remove('open');
          if (window.JK_DEBUG) console.log('Language selector closed (click outside)');
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && selector.classList.contains('open')) {
          selector.classList.remove('open');
          if (window.JK_DEBUG) console.log('Language selector closed (ESC key)');
        }
      });
      };
      trySetup();
    }
    
    updateActiveSwitcher() {
      document.querySelectorAll('[data-lang-switch]').forEach(switcher => {
        const lang = switcher.dataset.langSwitch;
        if (lang === this.currentLanguage) {
          switcher.classList.add('active');
        } else {
          switcher.classList.remove('active');
        }
      });
      
      document.querySelectorAll('.jkhive-lang-hex').forEach(hex => {
        const lang = hex.dataset.lang;
        if (lang === this.currentLanguage) {
          hex.classList.add('active');
        } else {
          hex.classList.remove('active');
        }
      });
    }
    
    getCurrentLanguage() {
      return this.currentLanguage;
    }
  }

  // ========================================
  // NOTIFICATIONS SYSTEM
  // ========================================
  
  class NotificationsSystem {
    constructor() {
      this.apiBase = (typeof HostsConfig !== 'undefined' && HostsConfig.getApiNotificationsBase)
        ? HostsConfig.getApiNotificationsBase().replace(/\/$/, '')
        : ((typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrl)
          ? HostsConfig.getCrmUrl() + '/api/notifications'
          : '/crm/api/notifications');
      this.counts = {
        messages: 0,
        purchases: 0,
        donations: 0,
        users: 0,
        total: 0
      };
      this.pollInterval = null;
      this.currentInterval = 3000;
      this.isPolling = false;
      this.abortController = null;
      this.init();
    }
    
    async init() {
      this.setupHexagonalSelector();
      this.loadNotifications().catch(e => console.error('Error loading notifications:', e));
      this.startPolling();
      
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.adjustPollingInterval(10000);
        } else {
          this.adjustPollingInterval(3000);
          this.loadNotifications().catch(e => console.error('Error loading notifications:', e));
        }
      });
      
      this.adjustPollingInterval(3000);
    }
    
    async loadNotifications(signal = null) {
      let timeoutId = null;
      try {
        let isAuthenticated = false;
        
        if (typeof window.AuthManager !== 'undefined' && window.AuthManager.isAuthenticated !== undefined) {
          isAuthenticated = window.AuthManager.isAuthenticated;
        } else if (typeof window.authManager !== 'undefined' && window.authManager.isAuthenticated !== undefined) {
          isAuthenticated = window.authManager.isAuthenticated;
        } else {
          try {
            const authStatusUrl = (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath)
              ? HostsConfig.getCrmUrlPath('api/auth/status.php')
              : '/crm/api/auth/status.php';
            
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
            isAuthenticated = false;
          }
        }
        
        if (!isAuthenticated) {
          this.counts = {
            messages: 0,
            purchases: 0,
            donations: 0,
            users: 0,
            total: 0
          };
          this.updateBadge();
          this.updateHexCounts();
          return;
        }
        
        let lastViewedPurchases = localStorage.getItem('jk_last_viewed_purchases');
        let lastViewedDonations = localStorage.getItem('jk_last_viewed_donations');
        let lastViewedUsers = localStorage.getItem('jk_last_viewed_users');
        
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
        
        const url = new URL(`${this.apiBase}/index.php`, window.location.origin);
        if (lastViewedPurchases) url.searchParams.append('last_viewed_purchases', lastViewedPurchases);
        if (lastViewedDonations) url.searchParams.append('last_viewed_donations', lastViewedDonations);
        if (lastViewedUsers) url.searchParams.append('last_viewed_users', lastViewedUsers);
        
        url.searchParams.append('_t', Date.now());
        
        const fetchOptions = {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-cache',
          signal: signal
        };
        
        timeoutId = setTimeout(() => {
          if (this.abortController) {
            this.abortController.abort();
          }
        }, 8000);
        
        const response = await fetch(url.toString(), fetchOptions);
        clearTimeout(timeoutId);
        timeoutId = null;
        
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
          return;
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
          
          if (this.counts.messages > previousMessagesCount && typeof window.messagingSystem !== 'undefined') {
            const isMessagesPage = window.location.pathname.includes('messages.php');
            if (isMessagesPage && window.messagingSystem) {
              if (window.messagingSystem.currentFolder === 'inbox') {
                window.messagingSystem.loadMessages('inbox').catch(e => {
                  console.error('Error recargando mensajes después de notificación:', e);
                });
              }
            }
          }
        }
      } catch (e) {
        if (e.name !== 'AbortError' && e.name !== 'TimeoutError') {
          if (!e.message || !e.message.includes('401')) {
            console.error('Error cargando notificaciones:', e);
          }
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
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    }
    
    setupHexagonalSelector() {
      const maxAttempts = 50;
      let attempts = 0;
      const trySetup = () => {
        const selector = document.querySelector('.jkhive-notif-selector');
        if (!selector) {
          attempts += 1;
          if (attempts < maxAttempts) {
            setTimeout(trySetup, 200);
          } else if (window.JK_DEBUG) {
            console.warn('Notification selector (.jkhive-notif-selector) not found; skipping notification UI setup.');
          }
          return;
        }
      
      const container = selector.querySelector('.jkhive-notif-hex-container');
      const hexagons = selector.querySelectorAll('.jkhive-notif-hex');
      
      if (window.JK_DEBUG) {
        console.log('Notification selector found:', selector);
        console.log('Container found:', container);
        console.log('Hexagons found:', hexagons.length);
      }
      
      if (!container) {
        if (window.JK_DEBUG) console.error('Notification hex container not found!');
        return;
      }
      
      if (hexagons.length === 0) {
        if (window.JK_DEBUG) console.error('No notification hexagons found!');
        return;
      }
      
      const closeAllOtherNavbarDropdowns = () => {
        // Usar función centralizada para cerrar menú de usuario
        closeUserMenu();
        
        const langSelector = document.querySelector('.jkhive-lang-selector');
        if (langSelector) langSelector.classList.remove('open');
        
        const cartDropdown = document.getElementById('cartDropdown');
        if (cartDropdown) {
          cartDropdown.style.display = 'none';
          cartDropdown.classList.remove('active');
        }
        
        if (typeof window.shoppingCart !== 'undefined' && window.shoppingCart) {
          window.shoppingCart.closeCartDropdown();
        }
      };
      
      selector.addEventListener('click', (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        const clickedHex = e.target.closest('.jkhive-notif-hex');
        if (clickedHex && !clickedHex.classList.contains('jkhive-notif-main')) {
          const type = clickedHex.dataset.notifType;
          const link = this.getNotificationLink(type);
          
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
          
          if (link && link !== '#') {
            this.close();
            setTimeout(() => {
              window.location.href = link;
            }, 200);
          } else {
            setTimeout(() => {
              this.close();
            }, 300);
          }
        } else {
          const wasOpen = selector.classList.contains('open');
          if (window.JK_DEBUG) console.log('Toggle notificaciones - estado actual:', wasOpen ? 'abierto' : 'cerrado');
          
          closeAllOtherNavbarDropdowns();
          
          requestAnimationFrame(() => {
            if (wasOpen) {
              selector.classList.remove('open');
              if (window.JK_DEBUG) console.log('Cerrando selector de notificaciones');
            } else {
              selector.classList.add('open');
              if (window.JK_DEBUG) console.log('Abriendo selector de notificaciones');
              setTimeout(() => {
                const visibleHexes = selector.querySelectorAll('.jkhive-notif-hex:not(.jkhive-notif-main)');
                if (window.JK_DEBUG) console.log('Hexágonos visibles después de abrir:', visibleHexes.length);
              }, 100);
            }
          });
        }
      });
      
      document.addEventListener('click', (e) => {
        const clickedInLangSelector = e.target.closest('.jkhive-lang-selector');
        const clickedInUserMenuToggle = e.target.closest('#userMenuToggle');
        const clickedInUserMenu = e.target.closest('#userMenuDropdown') || e.target.closest('[id*="userMenu"]');
        const isNavbarToggle = clickedInLangSelector || clickedInUserMenuToggle || clickedInUserMenu;
        
        if (!selector.contains(e.target) && selector.classList.contains('open') && !isNavbarToggle) {
          selector.classList.remove('open');
          if (window.JK_DEBUG) console.log('Notification selector closed (click outside)');
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && selector.classList.contains('open')) {
          selector.classList.remove('open');
          if (window.JK_DEBUG) console.log('Notification selector closed (ESC key)');
        }
      });
      };
      trySetup();
    }
    
    getNotificationLink(type) {
      const isHousesitting = window.location.pathname.includes('/housesitting');
      const crmPath = (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath)
        ? (p) => HostsConfig.getCrmUrlPath(p)
        : (p) => p;
      const baseUrl = (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrl)
        ? HostsConfig.getCrmUrl()
        : '';
      const housesittingBase = (typeof HostsConfig !== 'undefined' && HostsConfig.getHousesittingUrl)
        ? HostsConfig.getHousesittingUrl()
        : '/housesitting';

      switch (type) {
        case 'messages':
          if (typeof window.JKHIVE_MESSAGES_INBOX_URL === 'string' && window.JKHIVE_MESSAGES_INBOX_URL) {
            return window.JKHIVE_MESSAGES_INBOX_URL;
          }
          if (isHousesitting) {
            return `${housesittingBase}/messages.php`;
          }
          return crmPath('admin/messages.php');
        case 'purchases':
          if (isHousesitting) {
            return `${housesittingBase}/notificaciones.php`;
          }
          return baseUrl ? `${baseUrl}/admin/purchases.php` : crmPath('dashboard.php');
        case 'donations':
          if (isHousesitting) {
            return `${housesittingBase}/notificaciones.php`;
          }
          return baseUrl ? `${baseUrl}/admin/donations.php` : crmPath('dashboard.php');
        case 'users':
          if (isHousesitting) {
            return `${housesittingBase}/notificaciones.php`;
          }
          return crmPath('dashboard.php');
        default:
          return '#';
      }
    }
    
    updateBadge() {
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
      
      /* JK Hive: solo hex de mensajes en el DOM (layout-navbar / jkhive-navbar) */
      const types = ['messages'];
      
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
      if (this.pollInterval) {
        return;
      }
      this.pollInterval = setInterval(async () => {
        if (!this.isPolling) {
          await this.checkForNewNotifications();
        }
      }, 3000);
    }
    
    adjustPollingInterval(newInterval) {
      if (this.currentInterval === newInterval) {
        return;
      }
      
      this.currentInterval = newInterval;
      
      if (this.pollInterval) {
        clearInterval(this.pollInterval);
        this.pollInterval = null;
      }
      
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
      
      let isAuthenticated = false;
      if (typeof window.AuthManager !== 'undefined' && window.AuthManager.isAuthenticated !== undefined) {
        isAuthenticated = window.AuthManager.isAuthenticated;
      } else if (typeof window.authManager !== 'undefined' && window.authManager.isAuthenticated !== undefined) {
        isAuthenticated = window.authManager.isAuthenticated;
      }
      
      if (!isAuthenticated) {
        return;
      }
      
      try {
        this.isPolling = true;
        
        if (this.abortController) {
          this.abortController.abort();
        }
        this.abortController = new AbortController();
        
        await this.loadNotifications(this.abortController.signal);
      } catch (e) {
        if (e.name !== 'AbortError' && (!e.message || !e.message.includes('401'))) {
          console.error('Error verificando notificaciones:', e);
        }
      } finally {
        this.isPolling = false;
      }
    }
    
    async refreshNotifications() {
      try {
        await this.loadNotifications();
      } catch (e) {
        console.error('Error refrescando notificaciones:', e);
      }
    }
    
    decrementMessageCount() {
      if (this.counts.messages > 0) {
        this.counts.messages--;
        this.counts.total = this.counts.messages;
        this.updateBadge();
        this.updateHexCounts();
      }
    }
  }

  // ========================================
  // SEARCH SYSTEM - Buscador expandible (estilo House Sitting, sin modal)
  // 1er clic despliega input a la izquierda del ícono, 2do clic o Enter busca
  // ========================================
  
  class SearchSystem {
    constructor() {
      this.apiBase = (typeof HostsConfig !== 'undefined' && HostsConfig.getWebUrl)
        ? HostsConfig.getWebUrl() + '/api/search'
        : '/api/search';
      this.wrapper = null;
      this.input = null;
      this.resultsEl = null;
      this.isExpanded = false;
      this._searchTimeout = null;
      this.init();
    }
    
    init() {
      this.setupEventListeners();
    }
    
    getElements() {
      this.wrapper = document.getElementById('searchWrapper');
      this.input = document.getElementById('searchInput');
      this.resultsEl = document.getElementById('searchResults');
      return !!(this.wrapper && this.input && this.resultsEl);
    }
    
    expand() {
      if (!this.getElements()) return;
      this.closeAllNavbarDropdowns();
      this.wrapper.classList.add('expanded');
      this.isExpanded = true;
      this.input.focus();
      this.resultsEl.innerHTML = '';
      this.wrapper.classList.remove('has-results');
    }
    
    collapse() {
      if (this.wrapper) {
        this.wrapper.classList.remove('expanded', 'has-results');
        this.isExpanded = false;
        if (this.input) this.input.value = '';
        if (this.resultsEl) this.resultsEl.innerHTML = '';
      }
    }
    
    toggle() {
      if (!this.getElements()) return;
      if (this.isExpanded) {
        const query = this.input.value.trim();
        if (query.length >= 2) {
          this.performSearch(query);
        } else {
          this.close();
        }
      } else {
        this.expand();
      }
    }
    
    async performSearch(query) {
      if (!this.getElements() || !query || query.length < 2) return;
      
      this.resultsEl.innerHTML = '<div class="search-loading"><i class="fas fa-spinner fa-spin"></i> Buscando...</div>';
      this.wrapper.classList.add('has-results');
      
      try {
        const url = this.apiBase + '/index.php?q=' + encodeURIComponent(query);
        const response = await fetch(url, { credentials: 'same-origin' });
        const data = await response.json();
        
        if (data.success && data.data) {
          this.renderResults(data.data, query);
        } else {
          this.resultsEl.innerHTML = '<div class="search-empty"><i class="fas fa-exclamation-triangle"></i> Error al buscar</div>';
        }
      } catch (e) {
        console.error('Error en búsqueda:', e);
        this.resultsEl.innerHTML = '<div class="search-empty"><i class="fas fa-exclamation-triangle"></i> Error de conexión</div>';
      }
    }
    
    renderResults(data, query) {
      if (!this.resultsEl) return;
      
      const webUrl = (typeof HostsConfig !== 'undefined' && HostsConfig.getWebUrl) ? HostsConfig.getWebUrl() : '';
      const flat = [];
      if (data.products && data.products.length) {
        data.products.forEach(p => {
          const u = (p.url && String(p.url).trim()) ? String(p.url).trim() : (webUrl + '/productos.php?id=' + (p.id || ''));
          flat.push({ url: u, title: p.title || 'Sin título', icon: p.icon || 'fa-box', context: p.context || 'Producto' });
        });
      }
      if (data.services && data.services.length) {
        data.services.forEach(s => {
          const u = (s.url && String(s.url).trim()) ? String(s.url).trim() : (webUrl + '/productos.php?servicio=' + (s.id || ''));
          flat.push({ url: u, title: s.title || 'Sin título', icon: s.icon || 'fa-cogs', context: s.context || 'Servicio' });
        });
      }
      if (data.books && data.books.length) {
        data.books.forEach(b => {
          flat.push({ url: webUrl + '/ebooks.html?id=' + (b.id || ''), title: b.title || 'Sin título', icon: 'fa-book', context: 'Libro' });
        });
      }
      
      if (flat.length === 0) {
        this.resultsEl.innerHTML = '<div class="search-empty"><i class="fas fa-search"></i> Sin resultados para "<strong>' + this.escapeHtml(query) + '</strong>"</div>';
        return;
      }
      
      let html = '';
      flat.forEach(r => {
        html += '<a href="' + this.escapeHtml(r.url) + '" class="jkhive-search-result-item"><i class="fas ' + this.escapeHtml(r.icon) + '"></i><span class="result-title">' + this.escapeHtml(r.title) + '</span><span class="result-context">' + this.escapeHtml(r.context) + '</span></a>';
      });
      this.resultsEl.innerHTML = html;
    }
    
    closeAllNavbarDropdowns() {
      const langSelector = document.querySelector('.jkhive-lang-selector');
      if (langSelector) langSelector.classList.remove('open');
      if (typeof closeUserMenu === 'function') closeUserMenu();
      const notifDropdown = document.getElementById('notificationDropdown');
      if (notifDropdown) { notifDropdown.style.display = 'none'; notifDropdown.classList.remove('active'); }
      const notifSelector = document.querySelector('.jkhive-notif-selector.open');
      if (notifSelector) notifSelector.classList.remove('open');
      if (typeof window.notificationsSystem !== 'undefined' && window.notificationsSystem) {
        window.notificationsSystem.close();
      }
    }
    
    open() {
      if (!this.getElements()) return;
      if (!this.isExpanded) this.expand();
      else this.toggle();
    }
    
    close() {
      this.collapse();
    }
    
    setupEventListeners() {
      const setup = () => {
        if (!this.getElements()) return;
        const searchIcon = document.getElementById('searchIcon');
        if (!searchIcon || searchIcon.dataset.searchBound) return;
        searchIcon.dataset.searchBound = '1';
        searchIcon.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggle();
        });
        this.input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const q = this.input.value.trim();
            if (q.length >= 2) this.performSearch(q);
            else this.close();
          } else if (e.key === 'Escape') {
            this.close();
          }
        });
        this.input.addEventListener('input', () => {
          clearTimeout(this._searchTimeout);
          const q = this.input.value.trim();
          if (q.length < 2) {
            this.resultsEl.innerHTML = '';
            this.wrapper.classList.remove('has-results');
            return;
          }
          this._searchTimeout = setTimeout(() => this.performSearch(q), 300);
        });
        const closeBtn = document.getElementById('searchCloseBtn');
        if (closeBtn && !closeBtn.dataset.searchBound) {
          closeBtn.dataset.searchBound = '1';
          closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.close();
          });
        }
        if (!this._docClickBound) {
          this._docClickBound = true;
          document.addEventListener('click', (e) => {
            if (this.isExpanded && this.wrapper && !this.wrapper.contains(e.target)) {
              this.close();
            }
          });
        }
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
      } else {
        setup();
      }
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          this.open();
        }
      });
    }
    
    escapeHtml(text) {
      if (text == null) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // ========================================
  // AUTH MANAGER (Navbar User Menu Only)
  // ========================================

  /**
   * Navegación explícita al login desde el menú usuario (invitado / vitrina).
   * Fase captura: evita que listeners en burbuja (p. ej. tooltips u otros) cancelen el <a>.
   * Respeta Ctrl/meta/shift/alt y clic no primario para abrir en pestaña nueva cuando el navegador lo permita.
   */
  function bindNavbarPublicLoginLink(container) {
    if (!container) return;
    const link = container.querySelector('#publicWebLoginLink');
    if (!link || link.dataset.jkhiveLoginNavBound === '1') return;
    link.dataset.jkhiveLoginNavBound = '1';
    link.addEventListener('click', function(e) {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (typeof e.button === 'number' && e.button !== 0) return;
      const href = link.getAttribute('href');
      if (!href || href === '#' || /^\s*javascript:/i.test(href)) return;
      e.preventDefault();
      window.location.assign(href);
    }, true);
  }

  /** Ruta absoluta en el mismo origen (la define PHP desde hosts.php; evita localhost vs 127.0.0.1 y subcarpetas mal detectadas). */
  function getAuthStatusFetchUrl() {
    const raw = typeof window.JKHIVE_AUTH_STATUS_URL === 'string' ? window.JKHIVE_AUTH_STATUS_URL.trim() : '';
    if (raw) {
      if (/^https?:\/\//i.test(raw)) {
        try {
          const ua = new URL(raw);
          if (ua.origin === window.location.origin) {
            return ua.pathname + (ua.search || '');
          }
        } catch (eSkip) {
          /* noop */
        }
      } else {
        try {
          const ub = new URL(raw, window.location.href);
          return ub.pathname + (ub.search || '');
        } catch (eSkip2) {
          /* noop */
        }
      }
    }
    if (typeof window.JKHIVE_AUTH_STATUS_URL === 'string' && window.JKHIVE_AUTH_STATUS_URL.charAt(0) === '/') {
      return window.JKHIVE_AUTH_STATUS_URL;
    }
    const segs = window.location.pathname.split('/').filter(Boolean);
    const wwwIdx = segs.indexOf('www');
    if (wwwIdx !== -1) {
      return '/' + segs.slice(0, wwwIdx + 1).join('/') + '/api/auth/status.php';
    }
    if (typeof HostsConfig !== 'undefined' && typeof HostsConfig.getApiAuthBase === 'function') {
      try {
        const abs = HostsConfig.getApiAuthBase() + '/status.php';
        const u = new URL(abs, window.location.href);
        if (u.origin === window.location.origin) {
          return u.pathname + (u.search || '');
        }
      } catch (e) { /* noop */ }
    }
    return 'api/auth/status.php';
  }
  
  const AuthManager = {
    isAuthenticated: false,
    currentUser: null,

    init: async function() {
      if (document.body && document.body.classList.contains('jkfw-landing-basic-no-auth-nav')) {
        return;
      }
      await this.checkAuthStatus();
      this.updateUserMenu();
      this.attachEventListeners();
    },

    checkAuthStatus: async function() {
      const ssr = window.JKHIVE_SSR_AUTH;
      const applySsrIfLoggedIn = () => {
        if (ssr && ssr.authenticated === true && ssr.user && ssr.user.id) {
          this.isAuthenticated = true;
          this.currentUser = ssr.user;
          return true;
        }
        return false;
      };

      let data = null;
      try {
        const apiUrl = getAuthStatusFetchUrl();
        const response = await fetch(apiUrl, {
          method: 'GET',
          credentials: 'same-origin',
          cache: 'no-cache',
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          data = await response.json();
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }

      if (data && data.success) {
        if (data.authenticated && data.user) {
          this.isAuthenticated = true;
          this.currentUser = data.user;
          return;
        }
        if (data.user) {
          if (!data.authenticated && applySsrIfLoggedIn()) {
            return;
          }
          this.isAuthenticated = false;
          this.currentUser = data.user;
          return;
        }
      }

      if (applySsrIfLoggedIn()) {
        return;
      }

      this.isAuthenticated = false;
      this.currentUser = null;

      if (data && !data.success) {
        const isInCrm = window.location.pathname.includes('/crm/');
        if (isInCrm) {
          if (typeof HostsConfig === 'undefined' || !HostsConfig.getWebUrl) {
            console.error('ERROR: HostsConfig no está disponible.');
            return;
          }
          window.location.href = HostsConfig.getWebUrl();
        }
        return;
      }

      if (!data || !data.success) {
        const isInCrm = window.location.pathname.includes('/crm/');
        if (isInCrm && !(ssr && ssr.authenticated)) {
          const loginUrl = (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath)
            ? HostsConfig.getCrmUrlPath('login.php')
            : 'login.php';
          window.location.href = loginUrl + '?redirect=' + encodeURIComponent(window.location.pathname);
        }
      }
    },

    updateUserMenu: function() {
      const userMenuContainer = document.getElementById('userMenuContainer');
      if (!userMenuContainer) return;

      userMenuContainer.innerHTML = '';

      const noPublicRegister = window.JKHIVE_NO_PUBLIC_REGISTER === true ||
        document.body.classList.contains('jkhive-public-vitrina');

      if (this.isAuthenticated && this.currentUser) {
        const isInCrm = window.location.pathname.includes('/crm/') || window.location.pathname.startsWith('/crm');
        const showcaseDash = typeof window.JKHIVE_SHOWCASE_DASHBOARD_URL === 'string' && window.JKHIVE_SHOWCASE_DASHBOARD_URL;
        const showcaseProf = typeof window.JKHIVE_SHOWCASE_PROFILE_URL === 'string' && window.JKHIVE_SHOWCASE_PROFILE_URL;
        const dashboardUrl = showcaseDash ? showcaseDash : ((typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath) ? HostsConfig.getCrmUrlPath('dashboard.php') : 'dashboard.php');
        const profileUrl = showcaseProf ? showcaseProf : (isInCrm ? 'profile.php' : ((typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath) ? HostsConfig.getCrmUrlPath('profile.php') : 'profile.php'));
        let navLinks = `
              <a href="${dashboardUrl}" class="jkhive-user-menu-item" style="display: flex;">
                <i class="fas fa-th-large"></i>
                <span>Panel</span>
              </a>`;
        navLinks += `
              <a href="${profileUrl}" class="jkhive-user-menu-item" style="display: flex;">
                <i class="fas fa-user-edit"></i>
                <span>Editar perfil</span>
              </a>
              <a href="#" class="jkhive-user-menu-item" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i>
                <span>Cerrar sesión</span>
              </a>`;

        userMenuContainer.innerHTML = `
          <div class="jkhive-user-menu-wrapper">
            <div class="jkhive-navbar-hex-item" id="userMenuToggle" data-tooltip="Mi cuenta" style="cursor: pointer;" role="button" tabindex="0" aria-label="Mi cuenta">
              <i class="fas fa-user"></i>
            </div>
            <div class="jkhive-user-menu-dropdown" id="userMenuDropdown">
              <div class="jkhive-user-menu-header">
                <div class="user-name">${this.escapeHtml(this.currentUser.username || 'Usuario')}</div>
                <div class="user-email">${this.escapeHtml(this.currentUser.email || '')}</div>
                <div class="user-profile">${this.escapeHtml(this.currentUser.profile_name || '')}</div>
              </div>${navLinks}
            </div>
          </div>
        `;
        if (typeof window.JKHiveTooltipAttach === 'function') window.JKHiveTooltipAttach(userMenuContainer);

        const closeAllDropdowns = () => {
          // Cerrar selector de idiomas de manera explícita
          const langSelector = document.querySelector('.jkhive-lang-selector');
          if (langSelector && langSelector.classList.contains('open')) {
            langSelector.classList.remove('open');
            // Forzar reflow para asegurar que el CSS se actualice
            void langSelector.offsetHeight;
          }
          
          // Usar función centralizada para cerrar menú de usuario
          closeUserMenu();
          
          const notifDropdown = document.getElementById('notificationDropdown');
          if (notifDropdown) {
            notifDropdown.style.display = 'none';
            notifDropdown.classList.remove('active');
          }
          const notifSelector = document.querySelector('.jkhive-notif-selector.open');
          if (notifSelector) {
            notifSelector.classList.remove('open');
            // Forzar reflow para asegurar que el CSS se actualice
            void notifSelector.offsetHeight;
          }
          
          if (typeof window.notificationsSystem !== 'undefined' && window.notificationsSystem) {
            window.notificationsSystem.close();
          }
        };

        const toggle = document.getElementById('userMenuToggle');
        const dropdown = document.getElementById('userMenuDropdown');
        const wrapper = userMenuContainer.querySelector('.jkhive-user-menu-wrapper');
        if (toggle && dropdown && wrapper) {
          // Bandera para evitar que el listener de "click outside" se dispare inmediatamente después de abrir
          let justOpened = false;
          
          toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            const wasActive = dropdown.classList.contains('active');
            
            // Cerrar todos los otros menús primero
            closeAllDropdowns();
            
            // Esperar un frame para asegurar que los otros menús se cierren completamente
            requestAnimationFrame(() => {
              // Esperar un pequeño delay adicional para que las animaciones de cierre terminen
              setTimeout(() => {
                if (!wasActive) {
                  dropdown.classList.add('active');
                  wrapper.classList.add('active');
                  // Marcar que acabamos de abrir el menú
                  justOpened = true;
                  // Resetear la bandera después de un delay para permitir que el listener funcione normalmente
                  setTimeout(() => {
                    justOpened = false;
                  }, 100); // 100ms de gracia después de abrir
                } else {
                  // Usar función centralizada para cerrar menú de usuario
                  closeUserMenu();
                }
              }, 50); // 50ms de delay para asegurar que otros menús se cierren
            });
          });

          document.addEventListener('click', (e) => {
            // No cerrar si acabamos de abrir el menú
            if (justOpened) {
              return;
            }
            
            const clickedInLangSelector = e.target.closest('.jkhive-lang-selector');
            const clickedInNotifSelector = e.target.closest('.jkhive-notif-selector');
            const clickedInUserMenuToggle = e.target.closest('#userMenuToggle');
            const isNavbarToggle = clickedInLangSelector || clickedInNotifSelector || clickedInUserMenuToggle;
            
            if (!userMenuContainer.contains(e.target) && !isNavbarToggle) {
              // Usar función centralizada para cerrar menú de usuario
              closeUserMenu();
            }
          });
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
          });
        }
      } else if (this.currentUser && this.currentUser.profile_slug === 'guest') {
        const isInCrm = window.location.pathname.includes('/crm/');
        
        const loginUrlLegacy = isInCrm 
          ? 'login.php?logout=1' 
          : (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath) 
            ? HostsConfig.getCrmUrlPath('login.php') + '?logout=1'
            : 'http://crm.jkhive.work/login.php?logout=1';
        const registerUrl = isInCrm
          ? 'register.php'
          : (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath)
            ? HostsConfig.getCrmUrlPath('register.php')
            : 'http://crm.jkhive.work/register.php';

        let loginHrefGuest = loginUrlLegacy;
        if (noPublicRegister) {
          const baseLogin = isInCrm
            ? 'login.php'
            : (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath)
              ? HostsConfig.getCrmUrlPath('login.php')
              : 'http://crm.jkhive.work/login.php';
          const crmLogin = (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath)
            ? HostsConfig.getCrmUrlPath('login.php')
            : baseLogin;
          const redir = encodeURIComponent(
            window.location.pathname + window.location.search + window.location.hash
          );
          loginHrefGuest = `${crmLogin}?redirect=${redir}`;
        }

        userMenuContainer.innerHTML = `
          <div class="jkhive-user-menu-wrapper">
            <div class="jkhive-navbar-hex-item" id="userMenuToggle" data-tooltip="Mi cuenta" style="cursor: pointer;" role="button" tabindex="0" aria-label="Mi cuenta">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="jkhive-user-menu-dropdown" id="userMenuDropdown">
              <div class="jkhive-user-menu-header">
                <div class="user-name">${this.escapeHtml(this.currentUser.username || 'Invitado')}</div>
                <div class="user-profile">${this.escapeHtml(this.currentUser.profile_name || 'Usuario Desconocido')}</div>
                <div class="user-email" style="font-size: 0.75rem; color: var(--jk-metal-medium);">
                  ID: ${this.escapeHtml(this.currentUser.unique_id ? this.currentUser.unique_id.substring(0, 8) + '...' : 'N/A')}
                </div>
              </div>
              <a href="${loginHrefGuest}" class="jkhive-user-menu-item" id="publicWebLoginLink">
                <i class="fas fa-key"></i>
                <span>Iniciar Sesión</span>
              </a>${noPublicRegister ? '' : `
              <a href="${registerUrl}" class="jkhive-user-menu-item">
                <i class="fas fa-user-plus"></i>
                <span>Registrarse</span>
              </a>`}
            </div>
          </div>
        `;
        if (typeof window.JKHiveTooltipAttach === 'function') window.JKHiveTooltipAttach(userMenuContainer);
        bindNavbarPublicLoginLink(userMenuContainer);

        const closeAllDropdowns = () => {
          // Cerrar selector de idiomas de manera explícita
          const langSelector = document.querySelector('.jkhive-lang-selector');
          if (langSelector && langSelector.classList.contains('open')) {
            langSelector.classList.remove('open');
            // Forzar reflow para asegurar que el CSS se actualice
            void langSelector.offsetHeight;
          }
          
          // Usar función centralizada para cerrar menú de usuario
          closeUserMenu();
          
          const notifDropdown = document.getElementById('notificationDropdown');
          if (notifDropdown) {
            notifDropdown.style.display = 'none';
            notifDropdown.classList.remove('active');
          }
          const notifSelector = document.querySelector('.jkhive-notif-selector.open');
          if (notifSelector) {
            notifSelector.classList.remove('open');
            // Forzar reflow para asegurar que el CSS se actualice
            void notifSelector.offsetHeight;
          }
          
          if (typeof window.notificationsSystem !== 'undefined' && window.notificationsSystem) {
            window.notificationsSystem.close();
          }
        };

        const toggle = document.getElementById('userMenuToggle');
        const dropdown = document.getElementById('userMenuDropdown');
        const wrapper = userMenuContainer.querySelector('.jkhive-user-menu-wrapper');
        if (toggle && dropdown && wrapper) {
          // Bandera para evitar que el listener de "click outside" se dispare inmediatamente después de abrir
          let justOpened = false;
          
          toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            const wasActive = dropdown.classList.contains('active');
            
            // Cerrar todos los otros menús primero
            closeAllDropdowns();
            
            // Esperar un frame para asegurar que los otros menús se cierren completamente
            requestAnimationFrame(() => {
              // Esperar un pequeño delay adicional para que las animaciones de cierre terminen
              setTimeout(() => {
                if (!wasActive) {
                  dropdown.classList.add('active');
                  wrapper.classList.add('active');
                  // Marcar que acabamos de abrir el menú
                  justOpened = true;
                  // Resetear la bandera después de un delay para permitir que el listener funcione normalmente
                  setTimeout(() => {
                    justOpened = false;
                  }, 100); // 100ms de gracia después de abrir
                } else {
                  // Usar función centralizada para cerrar menú de usuario
                  closeUserMenu();
                }
              }, 50); // 50ms de delay para asegurar que otros menús se cierren
            });
          });

          document.addEventListener('click', (e) => {
            // No cerrar si acabamos de abrir el menú
            if (justOpened) {
              return;
            }
            
            const clickedInLangSelector = e.target.closest('.jkhive-lang-selector');
            const clickedInNotifSelector = e.target.closest('.jkhive-notif-selector');
            const clickedInUserMenuToggle = e.target.closest('#userMenuToggle');
            const isNavbarToggle = clickedInLangSelector || clickedInNotifSelector || clickedInUserMenuToggle;
            
            if (!userMenuContainer.contains(e.target) && !isNavbarToggle) {
              // Usar función centralizada para cerrar menú de usuario
              closeUserMenu();
            }
          });
        }
      } else {
        // Visitante sin sesión: Lubs = Ingresar + Registrarse; Hive (bandera / vitrina) = solo login al CRM con redirect
        const isInCrm = window.location.pathname.includes('/crm/');
        const loginUrl = isInCrm
          ? (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath) ? HostsConfig.getCrmUrlPath('login.php') : 'login.php'
          : (typeof HostsConfig !== 'undefined' && HostsConfig.getWebUrlPath) ? HostsConfig.getWebUrlPath('login.php') : 'login.php';
        const registerUrl = isInCrm
          ? ((typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath) ? HostsConfig.getCrmUrlPath('register.php') : 'register.php')
          : ((typeof HostsConfig !== 'undefined' && HostsConfig.getWebUrlPath) ? HostsConfig.getWebUrlPath('registro.php') : 'registro.php');

        const redirHive = encodeURIComponent(
          window.location.pathname + window.location.search + window.location.hash
        );
        const crmLoginOnly = (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath)
          ? HostsConfig.getCrmUrlPath('login.php')
          : 'login.php';
        const loginHrefHive = `${crmLoginOnly}?redirect=${redirHive}`;

        userMenuContainer.innerHTML = noPublicRegister ? `
          <div class="jkhive-user-menu-wrapper">
            <div class="jkhive-navbar-hex-item" id="userMenuToggle" data-tooltip="Mi cuenta" style="cursor: pointer;" role="button" tabindex="0" aria-label="Mi cuenta">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="jkhive-user-menu-dropdown" id="userMenuDropdown">
              <div class="jkhive-user-menu-header">
                <div class="user-name">Invitado</div>
                <div class="user-profile">Invitado</div>
                <div class="user-email" style="font-size: 0.75rem; color: var(--jk-metal-medium);">
                  ID: N/A
                </div>
              </div>
              <a href="${loginHrefHive}" class="jkhive-user-menu-item" id="publicWebLoginLink">
                <i class="fas fa-key"></i>
                <span>Iniciar Sesión</span>
              </a>
            </div>
          </div>` : `
          <div class="jkhive-user-menu-wrapper">
            <div class="jkhive-navbar-hex-item" id="userMenuToggle" data-tooltip="Ingresar" style="cursor: pointer;" role="button" tabindex="0" aria-label="Ingresar">
              <i class="fas fa-user"></i>
            </div>
            <div class="jkhive-user-menu-dropdown" id="userMenuDropdown">
              <div class="jkhive-user-menu-header">
                <div class="user-name">Visita</div>
                <div class="user-email" style="font-size: 0.75rem; color: var(--jk-metal-medium);">Inicia sesión o regístrate</div>
              </div>
              <a href="${loginUrl}" class="jkhive-user-menu-item" id="publicWebLoginLink">
                <i class="fas fa-sign-in-alt"></i>
                <span>Ingresar</span>
              </a>
              <a href="${registerUrl}" class="jkhive-user-menu-item">
                <i class="fas fa-user-plus"></i>
                <span>Registrarse</span>
              </a>
            </div>
          </div>
        `;
        if (typeof window.JKHiveTooltipAttach === 'function') window.JKHiveTooltipAttach(userMenuContainer);
        bindNavbarPublicLoginLink(userMenuContainer);

        const closeAllDropdowns = () => {
          const langSelector = document.querySelector('.jkhive-lang-selector');
          if (langSelector && langSelector.classList.contains('open')) {
            langSelector.classList.remove('open');
            void langSelector.offsetHeight;
          }
          closeUserMenu();
          const notifDropdown = document.getElementById('notificationDropdown');
          if (notifDropdown) {
            notifDropdown.style.display = 'none';
            notifDropdown.classList.remove('active');
          }
          const notifSelector = document.querySelector('.jkhive-notif-selector.open');
          if (notifSelector) {
            notifSelector.classList.remove('open');
            void notifSelector.offsetHeight;
          }
          if (typeof window.notificationsSystem !== 'undefined' && window.notificationsSystem) {
            window.notificationsSystem.close();
          }
        };

        const toggle = document.getElementById('userMenuToggle');
        const dropdown = document.getElementById('userMenuDropdown');
        const wrapper = userMenuContainer.querySelector('.jkhive-user-menu-wrapper');
        if (toggle && dropdown && wrapper) {
          let justOpened = false;
          toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            const wasActive = dropdown.classList.contains('active');
            closeAllDropdowns();
            requestAnimationFrame(() => {
              setTimeout(() => {
                if (!wasActive) {
                  dropdown.classList.add('active');
                  wrapper.classList.add('active');
                  justOpened = true;
                  setTimeout(() => { justOpened = false; }, 100);
                } else {
                  closeUserMenu();
                }
              }, 50);
            });
          });
          document.addEventListener('click', (e) => {
            if (justOpened) return;
            const clickedInLangSelector = e.target.closest('.jkhive-lang-selector');
            const clickedInNotifSelector = e.target.closest('.jkhive-notif-selector');
            const clickedInUserMenuToggle = e.target.closest('#userMenuToggle');
            const isNavbarToggle = clickedInLangSelector || clickedInNotifSelector || clickedInUserMenuToggle;
            if (!userMenuContainer.contains(e.target) && !isNavbarToggle) {
              closeUserMenu();
            }
          });
        }
      }
      
      userMenuContainer.classList.add('ready');
    },

    logout: async function() {
      if (window.JKHIVE_SHOWCASE_SHELL === true) {
        if (typeof HostsConfig !== 'undefined' && typeof HostsConfig.getCrmUrlPath === 'function') {
          window.location.href = HostsConfig.getCrmUrlPath('logout.php');
        } else {
          window.location.href = 'logout.php';
        }
        return;
      }

      try {
        const apiUrl = (typeof HostsConfig !== 'undefined' && HostsConfig.getApiAuthBase) 
          ? HostsConfig.getApiAuthBase() + '/logout.php'
          : 'http://crm.jkhive.work/api/auth/logout.php';
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        
        if (data.success) {
          this.isAuthenticated = false;
          this.currentUser = null;
          
          if (typeof HostsConfig === 'undefined' || !HostsConfig.getWebUrlPath) {
            console.error('ERROR: HostsConfig no está disponible. Verifica que hosts-config.js se cargue antes de auth.js');
            window.location.href = 'index.php';
            return;
          }
          window.location.href = HostsConfig.getWebUrlPath('index.php');
        } else {
          alert('Error al cerrar sesión');
        }
      } catch (error) {
        console.error('Logout error:', error);
        alert('Error al cerrar sesión');
      }
    },

    attachEventListeners: function() {
      if (window._jkhiveNavbarAuthPollStarted) {
        return;
      }
      window._jkhiveNavbarAuthPollStarted = true;
      setInterval(async () => {
        await this.checkAuthStatus();
        this.updateUserMenu();
      }, 300000);
    },

    escapeHtml: function(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  };

  // ========================================
  // INITIALIZATION
  // ========================================
  
  function initI18n() {
    window.i18n = new I18n();
  }

  function initNotifications() {
    /* Sitio público (layout-navbar.php): no hay campana hex; evitar polling y bucle de reintentos */
    if (!document.querySelector('.jkhive-notif-selector')) {
      window.notificationsSystem = null;
      return;
    }
    window.notificationsSystem = new NotificationsSystem();
  }

  function initSearch() {
    window.searchSystem = new SearchSystem();
  }

  async function initializeAuth() {
    if (document.body && document.body.classList.contains('jkfw-landing-basic-no-auth-nav')) {
      return;
    }
    const checkNavbar = setInterval(async () => {
      const userMenuContainer = document.getElementById('userMenuContainer');
      if (userMenuContainer) {
        clearInterval(checkNavbar);
        await AuthManager.init();
      }
    }, 100);

    setTimeout(async () => {
      clearInterval(checkNavbar);
      await AuthManager.init();
    }, 5000);
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initI18n();
      initNotifications();
      initSearch();
      initializeAuth();
    });
  } else {
    initI18n();
    initNotifications();
    initSearch();
    initializeAuth();
  }

  // Also listen for navbar loaded event
  window.addEventListener('navbarLoaded', async () => {
    if (document.body && document.body.classList.contains('jkfw-landing-basic-no-auth-nav')) {
      return;
    }
    setTimeout(async () => await AuthManager.init(), 100);
  });
 
  // Export globally
  window.AuthManager = AuthManager;

  window.addEventListener('pageshow', function(ev) {
    if (document.body && document.body.classList.contains('jkfw-landing-basic-no-auth-nav')) {
      return;
    }
    if (ev.persisted && window.AuthManager && typeof window.AuthManager.init === 'function') {
      window.AuthManager.init();
    }
  });
})();

// ========================================
// GLOBAL HANDLER: ICONO CARRITO NAVBAR
// ========================================
// Maneja el clic en el icono del carrito en el navbar (páginas públicas + CRM),
// usando siempre el mismo patrón:
// - Si hay instancia de shoppingCart:
//   - Carrito vacío  -> toast Tipo A "Carrito vacío"
//   - Carrito con ítems:
//       * Si existe #cartModal en la página -> abrir modal
//       * Si NO existe #cartModal          -> ir a checkout.php
// - Si no hay shoppingCart (fallback): usar localStorage + showCartEmptyMessage
window.handleGlobalCartClick = function() {
  var checkoutUrl = (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath)
    ? HostsConfig.getCrmUrlPath('checkout.php')
    : 'checkout.php';

  try {
    if (window.shoppingCart) {
      var hasModal = !!document.getElementById('cartModal');
      var items = Array.isArray(window.shoppingCart.cart) ? window.shoppingCart.cart : [];

      if (items.length === 0) {
        if (typeof window.showCartEmptyMessage === 'function') {
          window.showCartEmptyMessage({ autoCloseMs: 3500 });
        }
        return;
      }

      if (hasModal) {
        window.shoppingCart.openCart();
        return;
      }

      window.location.href = checkoutUrl;
      return;
    }
  } catch (e) {
    console.error(e);
  }

  // Fallback absoluto si por alguna razón no existe shoppingCart
  try {
    var key =
      window.shoppingCart && window.shoppingCart.storageKey
        ? window.shoppingCart.storageKey
        : window.JKFW_CART_STORAGE_KEY || 'krauss_shopping_cart';
    var c = JSON.parse(localStorage.getItem(key) || '[]');
    if (c.length > 0) {
      window.location.href = checkoutUrl;
    } else if (typeof window.showCartEmptyMessage === 'function') {
      window.showCartEmptyMessage({ autoCloseMs: 3500 });
    }
  } catch (e) {
    if (typeof window.showCartEmptyMessage === 'function') {
      window.showCartEmptyMessage({ autoCloseMs: 3500 });
    }
  }
};

