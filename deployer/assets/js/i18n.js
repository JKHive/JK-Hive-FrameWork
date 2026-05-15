/*!
 * JK Portal - Internationalization (i18n)
 * Multi-language support system
 */

(function() {
  'use strict';

  // ========================================
  // TRANSLATION DICTIONARY
  // ========================================
  
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
    }
  };

  // ========================================
  // I18N CLASS
  // ========================================
  
  class I18n {
    constructor() {
      this.currentLanguage = this.detectLanguage();
      this.init();
    }
    
    /**
     * Detect browser language or load saved preference
     */
    detectLanguage() {
      // Check saved preference
      const savedLang = localStorage.getItem('jkhive-language');
      const validLangs = ['es', 'en', 'it', 'de'];
      if (savedLang && validLangs.includes(savedLang)) {
        return savedLang;
      }
      
      // Detect from browser
      const browserLang = (navigator.language || navigator.userLanguage).toLowerCase();
      
      if (browserLang.startsWith('es')) return 'es';
      if (browserLang.startsWith('it')) return 'it';
      if (browserLang.startsWith('de')) return 'de';
      
      // Default to English
      return 'en';
    }
    
    /**
     * Initialize i18n system
     */
    init() {
      this.setLanguage(this.currentLanguage);
      this.setupLanguageSwitchers();
      if (window.JKUtils && window.JKUtils.Logger) {
        window.JKUtils.Logger.log(`🌐 Language initialized: ${this.currentLanguage}`);
      } else if (window.JK_DEBUG) console.log(`🌐 Language initialized: ${this.currentLanguage}`);
    }
    
    /**
     * Get translation by key
     */
    t(key) {
      const lang = translations[this.currentLanguage];
      return lang[key] || key;
    }
    
    /**
     * Set language
     */
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
      
      // Trigger custom event
      document.dispatchEvent(new CustomEvent('language-changed', {
        detail: { language: lang }
      }));
    }
    
    /**
     * Update all content with translations
     */
    updateContent() {
      // Update elements with data-i18n attribute
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        const translation = this.t(key);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          // Preserve HTML if element has data-i18n-html
          if (element.dataset.i18nHtml !== undefined) {
            element.innerHTML = translation;
          } else {
            element.textContent = translation;
          }
        }
      });
    }
    
    /**
     * Setup language switcher buttons
     */
    setupLanguageSwitchers() {
      // Old style switchers (buttons)
      const switchers = document.querySelectorAll('[data-lang-switch]');
      
      switchers.forEach(switcher => {
        switcher.addEventListener('click', (e) => {
          e.preventDefault();
          const lang = switcher.dataset.langSwitch;
          this.setLanguage(lang);
        });
      });
      
      // New hexagonal vortex selector
      this.setupHexagonalSelector();
    }
    
    /**
     * Setup hexagonal language selector with vortex effect
     */
    setupHexagonalSelector() {
      const selector = document.querySelector('.jkhive-lang-selector');
      if (!selector) {
        if (window.JK_DEBUG) console.warn('Language selector not found');
        return;
      }
      
      const container = selector.querySelector('.jkhive-lang-hex-container');
      const hexagons = selector.querySelectorAll('.jkhive-lang-hex');
      
      if (window.JK_DEBUG) console.log('Language selector initialized with', hexagons.length, 'languages');
      
      // Función para cerrar todos los demás menús del navbar (excepto este)
      const closeAllOtherNavbarDropdowns = () => {
        // Cerrar menú de usuario
        const userDropdown = document.getElementById('userMenuDropdown');
        if (userDropdown) userDropdown.classList.remove('active');
        
        // Cerrar menú de notificaciones
        const notifDropdown = document.getElementById('notificationDropdown');
        if (notifDropdown) {
          notifDropdown.style.display = 'none';
          notifDropdown.classList.remove('active');
        }
        const notifSelector = document.querySelector('.jkhive-notif-selector.open');
        if (notifSelector) notifSelector.classList.remove('open');
        
        // Cerrar menú del carrito (si existe en CRM)
        const cartDropdown = document.getElementById('cartDropdown');
        if (cartDropdown) {
          cartDropdown.style.display = 'none';
          cartDropdown.classList.remove('active');
        }
        
        // Cerrar instancias si existen
        if (typeof notificationsSystem !== 'undefined' && notificationsSystem) {
          notificationsSystem.close();
        }
        if (typeof shoppingCart !== 'undefined' && shoppingCart) {
          shoppingCart.closeCartDropdown();
        }
      };
      
      // Click on container to toggle
      selector.addEventListener('click', (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation(); // Prevenir que otros listeners interfieran
        
        // If clicking on a non-active hexagon, change language
        const clickedHex = e.target.closest('.jkhive-lang-hex');
        if (clickedHex && !clickedHex.classList.contains('active')) {
          const lang = clickedHex.dataset.lang;
          if (window.JK_DEBUG) console.log('Changing language to:', lang);
          this.setLanguage(lang);
          // Close selector
          setTimeout(() => {
            selector.classList.remove('open');
          }, 300);
        } else {
          // Guardar el estado ANTES de cerrar otros menús
          const wasOpen = selector.classList.contains('open');
          // Cerrar todos los demás menús antes de abrir/cerrar este
          closeAllOtherNavbarDropdowns();
          // Usar requestAnimationFrame para asegurar que el toggle se ejecute después de cerrar otros menús
          requestAnimationFrame(() => {
            // Toggle basado en el estado guardado
            if (wasOpen) {
              selector.classList.remove('open');
            } else {
              selector.classList.add('open');
            }
            if (window.JK_DEBUG) console.log('Language selector toggled:', !wasOpen ? 'open' : 'closed');
          });
        }
      });
      
      // Close when clicking outside (pero NO si el click es en otro toggle del navbar)
      document.addEventListener('click', (e) => {
        // No cerrar si el click es en otro toggle del navbar (dejar que ese toggle maneje su propio estado)
        const clickedInNotifSelector = e.target.closest('.jkhive-notif-selector');
        const clickedInUserMenuToggle = e.target.closest('#userMenuToggle');
        const clickedInUserMenu = e.target.closest('#userMenuDropdown') || e.target.closest('[id*="userMenu"]');
        const isNavbarToggle = clickedInNotifSelector || clickedInUserMenuToggle || clickedInUserMenu;
        
        if (!selector.contains(e.target) && selector.classList.contains('open') && !isNavbarToggle) {
          selector.classList.remove('open');
          if (window.JK_DEBUG) console.log('Language selector closed (click outside)');
        }
      });
      
      // Close on ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && selector.classList.contains('open')) {
          selector.classList.remove('open');
          if (window.JK_DEBUG) console.log('Language selector closed (ESC key)');
        }
      });
    }
    
    /**
     * Update active state on language switchers
     */
    updateActiveSwitcher() {
      // Update old style switchers
      document.querySelectorAll('[data-lang-switch]').forEach(switcher => {
        const lang = switcher.dataset.langSwitch;
        if (lang === this.currentLanguage) {
          switcher.classList.add('active');
        } else {
          switcher.classList.remove('active');
        }
      });
      
      // Update hexagonal selector
      document.querySelectorAll('.jkhive-lang-hex').forEach(hex => {
        const lang = hex.dataset.lang;
        if (lang === this.currentLanguage) {
          hex.classList.add('active');
        } else {
          hex.classList.remove('active');
        }
      });
    }
    
    /**
     * Get current language
     */
    getCurrentLanguage() {
      return this.currentLanguage;
    }
  }

  // ========================================
  // INITIALIZE AND EXPORT
  // ========================================
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
  } else {
    initI18n();
  }
  
  function initI18n() {
    window.i18n = new I18n();
  }

})();



