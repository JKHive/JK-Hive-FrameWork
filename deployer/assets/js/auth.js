/**
 * HouseSitting - Auth (frontend)
 * 
 * Gestión de autenticación en el frontend
 * Actualización dinámica del menú de usuario
 * 
 * Web: "Panel" → index.php. CRM: "Perfil" → profile.php
 */

(function() {
    'use strict';

    const AuthManager = {
        // Estado de autenticación
        isAuthenticated: false,
        currentUser: null,

        /**
         * Inicializar el sistema de autenticación
         */
        init: async function() {
            await this.checkAuthStatus();
            this.updateUserMenu();
            this.attachEventListeners();
        },

        /**
         * Verificar estado de autenticación
         */
        checkAuthStatus: async function() {
            try {
                // Verificar que HostsConfig esté disponible
                let apiUrl;
                if (typeof HostsConfig !== 'undefined' && typeof HostsConfig.getApiAuthBase === 'function') {
                    apiUrl = HostsConfig.getApiAuthBase() + '/status.php';
                } else {
                    console.warn('HostsConfig no está disponible. Usando URL relativa.');
                    // Usar URL relativa como fallback
                    apiUrl = '../api/auth/status.php';
                }
                
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    credentials: 'same-origin',
                    cache: 'no-cache'
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.success) {
                    if (data.authenticated) {
                        this.isAuthenticated = true;
                        this.currentUser = data.user;
                    } else if (data.user) {
                        // Usuario guest con información
                        this.isAuthenticated = false;
                        this.currentUser = data.user;
                    } else {
                        this.isAuthenticated = false;
                        this.currentUser = null;
                        const isInCrm = (window.location.pathname.includes('/crm/') || window.location.pathname.includes('housesitting'));
                        if (isInCrm) {
                            const loginUrl = (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath) 
                                ? HostsConfig.getCrmUrlPath('login.php')
                                : 'login.php';
                            window.location.href = loginUrl + '?redirect=' + encodeURIComponent(window.location.pathname);
                        }
                    }
                } else {
                    this.isAuthenticated = false;
                    this.currentUser = null;
                    const isInCrm = (window.location.pathname.includes('/crm/') || window.location.pathname.includes('housesitting'));
                    if (isInCrm) {
                        const homeUrl = (typeof HostsConfig !== 'undefined' && HostsConfig.getWebUrlPath) ? HostsConfig.getWebUrlPath('index.php') : 'index.php';
                        window.location.href = homeUrl;
                    }
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                this.isAuthenticated = false;
                this.currentUser = null;
            }
        },

        /**
         * Actualizar menú de usuario en el navbar
         */
        updateUserMenu: function() {
            const userMenuContainer = document.getElementById('userMenuContainer');
            if (!userMenuContainer) return;
            
            // Remover contenido placeholder si existe y hacer visible el contenedor
            userMenuContainer.innerHTML = '';

            const noPublicRegister = window.JKHIVE_NO_PUBLIC_REGISTER === true ||
                document.body.classList.contains('jkhive-public-vitrina');

            if (this.isAuthenticated && this.currentUser) {
                // Verificar si es administrador (profile_slug === 'administrator' o profile_level >= 3)
                const isAdmin = this.currentUser.profile_slug === 'administrator' || 
                               (this.currentUser.profile_level && this.currentUser.profile_level >= 3);
                
                // Determinar si estamos en web pública o CRM
                const isInCrm = (window.location.pathname.includes('/crm/') || window.location.pathname.includes('housesitting')) || window.location.pathname.startsWith('/crm');
                
                // Web pública: "Panel" → index.php. CRM: "Perfil" → profile.php
                let menuUrl, menuLabel, menuIcon;
                if (isInCrm) {
                    menuUrl = 'profile.php';
                    menuLabel = 'Perfil';
                    menuIcon = 'fa-user-circle';
                } else {
                    if (typeof HostsConfig === 'undefined' || !HostsConfig.getCrmUrlPath) {
                        console.error('ERROR: HostsConfig no está disponible. Verifica que hosts-config.js se cargue antes de auth.js');
                        menuUrl = '#';
                    } else {
                        menuUrl = HostsConfig.getCrmUrlPath('dashboard.php');
                    }
                    menuLabel = 'Panel';
                    menuIcon = 'fa-th-large';
                }
                
                // Usuario autenticado - mostrar menú de usuario
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
                            </div>
                            <a href="${menuUrl}" class="jkhive-user-menu-item" id="profileLinkBtn" style="display: flex;">
                                <i class="fas ${menuIcon}"></i>
                                <span>${menuLabel}</span>
                            </a>
                            <a href="#" class="jkhive-user-menu-item" id="logoutBtn">
                                <i class="fas fa-sign-out-alt"></i>
                                <span>Cerrar Sesión</span>
                            </a>
                        </div>
                    </div>
                `;

                // Función para cerrar todos los menús desplegables
                const closeAllDropdowns = () => {
                    // Cerrar selector de idiomas
                    const langSelector = document.querySelector('.jkhive-lang-selector');
                    if (langSelector) langSelector.classList.remove('open');
                    
                    // Cerrar menú de usuario
                    const userDropdown = document.getElementById('userMenuDropdown');
                    if (userDropdown) userDropdown.classList.remove('active');
                    const userWrapper = userMenuContainer.querySelector('.jkhive-user-menu-wrapper');
                    if (userWrapper) userWrapper.classList.remove('active'); // Remover clase del wrapper
                    
                    // Cerrar menú de notificaciones
                    const notifDropdown = document.getElementById('notificationDropdown');
                    if (notifDropdown) {
                        notifDropdown.style.display = 'none';
                        notifDropdown.classList.remove('active');
                    }
                    const notifSelector = document.querySelector('.jkhive-notif-selector.open');
                    if (notifSelector) notifSelector.classList.remove('open');
                    
                    // Cerrar instancia de notificaciones si existe
                    if (typeof notificationsSystem !== 'undefined' && notificationsSystem) {
                        notificationsSystem.close();
                    }
                };

                // Attach toggle event
                const toggle = document.getElementById('userMenuToggle');
                const dropdown = document.getElementById('userMenuDropdown');
                const wrapper = userMenuContainer.querySelector('.jkhive-user-menu-wrapper');
                if (toggle && dropdown && wrapper) {
                    toggle.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.stopImmediatePropagation(); // Prevenir que otros listeners interfieran
                        const wasActive = dropdown.classList.contains('active');
                        closeAllDropdowns();
                        // Usar requestAnimationFrame para asegurar que el toggle se ejecute después de cerrar otros menús
                        requestAnimationFrame(() => {
                            if (!wasActive) {
                                dropdown.classList.add('active');
                                wrapper.classList.add('active'); // Agregar clase al wrapper para el estilo cyan
                            } else {
                                dropdown.classList.remove('active');
                                wrapper.classList.remove('active');
                            }
                        });
                    });

                    // Cerrar al hacer click fuera (pero NO si el click es en otro toggle del navbar)
                    document.addEventListener('click', (e) => {
                        // No cerrar si el click es en otro toggle del navbar (dejar que ese toggle maneje su propio estado)
                        const clickedInLangSelector = e.target.closest('.jkhive-lang-selector');
                        const clickedInNotifSelector = e.target.closest('.jkhive-notif-selector');
                        const isNavbarToggle = clickedInLangSelector || clickedInNotifSelector;
                        
                        if (!userMenuContainer.contains(e.target) && !isNavbarToggle) {
                            // Remover ambas clases para asegurar que el estilo vuelva al amarillo miel
                            dropdown.classList.remove('active');
                            wrapper.classList.remove('active');
                            // Forzar un reflow para asegurar que el CSS se actualice
                            void wrapper.offsetHeight;
                        }
                    });
                }

                // Attach profile link event
                const profileLinkBtn = document.getElementById('profileLinkBtn');
                if (profileLinkBtn) {
                    profileLinkBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        let finalUrl;
                        if (isInCrm) {
                            finalUrl = 'profile.php';
                        } else {
                            if (typeof HostsConfig === 'undefined' || !HostsConfig.getCrmUrlPath) {
                                console.error('ERROR: HostsConfig no está disponible. Verifica que hosts-config.js se cargue antes de auth.js');
                                return;
                            }
                            finalUrl = HostsConfig.getCrmUrlPath('dashboard.php');
                        }
                        window.location.href = finalUrl;
                    });
                }

                // Attach logout event
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.logout();
                    });
                }
            } else if (this.currentUser && this.currentUser.profile_slug === 'guest') {
                // Usuario guest - mostrar información del invitado
                const isInCrm = (window.location.pathname.includes('/crm/') || window.location.pathname.includes('housesitting'));
                
                const loginUrl = isInCrm 
                    ? 'login.php' 
                    : (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath) 
                        ? HostsConfig.getCrmUrlPath('login.php') 
                        : (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath ? HostsConfig.getCrmUrlPath('login.php') : 'login.php');
                const registerUrl = isInCrm 
                    ? 'register.php' 
                    : (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath) 
                        ? HostsConfig.getCrmUrlPath('register.php') 
                        : (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath ? HostsConfig.getCrmUrlPath('register.php') : 'register.php');

                const crmLogin = (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath)
                    ? HostsConfig.getCrmUrlPath('login.php')
                    : loginUrl;
                const redir = encodeURIComponent(
                    window.location.pathname + window.location.search + window.location.hash
                );
                const loginHref = noPublicRegister ? `${crmLogin}?redirect=${redir}` : loginUrl;
                
                userMenuContainer.innerHTML = `
                    <div class="jkhive-user-menu-wrapper">
                        <div class="jkhive-navbar-hex-item" id="userMenuToggle" data-tooltip="Invitado" style="cursor: pointer;" role="button" tabindex="0" aria-label="Menú de invitado">
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
                            <a href="${loginHref}" class="jkhive-user-menu-item">
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

                // Función para cerrar todos los menús desplegables
                const closeAllDropdowns = () => {
                    // Cerrar selector de idiomas
                    const langSelector = document.querySelector('.jkhive-lang-selector');
                    if (langSelector) langSelector.classList.remove('open');
                    
                    // Cerrar menú de usuario
                    const userDropdown = document.getElementById('userMenuDropdown');
                    if (userDropdown) userDropdown.classList.remove('active');
                    const userWrapper = userMenuContainer.querySelector('.jkhive-user-menu-wrapper');
                    if (userWrapper) userWrapper.classList.remove('active'); // Remover clase del wrapper
                    
                    // Cerrar menú de notificaciones
                    const notifDropdown = document.getElementById('notificationDropdown');
                    if (notifDropdown) {
                        notifDropdown.style.display = 'none';
                        notifDropdown.classList.remove('active');
                    }
                    const notifSelector = document.querySelector('.jkhive-notif-selector.open');
                    if (notifSelector) notifSelector.classList.remove('open');
                    
                    // Cerrar instancia de notificaciones si existe
                    if (typeof notificationsSystem !== 'undefined' && notificationsSystem) {
                        notificationsSystem.close();
                    }
                };

                // Attach toggle event
                const toggle = document.getElementById('userMenuToggle');
                const dropdown = document.getElementById('userMenuDropdown');
                const wrapper = userMenuContainer.querySelector('.jkhive-user-menu-wrapper');
                if (toggle && dropdown && wrapper) {
                    toggle.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.stopImmediatePropagation(); // Prevenir que otros listeners interfieran
                        const wasActive = dropdown.classList.contains('active');
                        closeAllDropdowns();
                        // Usar requestAnimationFrame para asegurar que el toggle se ejecute después de cerrar otros menús
                        requestAnimationFrame(() => {
                            if (!wasActive) {
                                dropdown.classList.add('active');
                                wrapper.classList.add('active'); // Agregar clase al wrapper para el estilo cyan
                            } else {
                                dropdown.classList.remove('active');
                                wrapper.classList.remove('active');
                            }
                        });
                    });

                    // Cerrar al hacer click fuera (pero NO si el click es en otro toggle del navbar)
                    document.addEventListener('click', (e) => {
                        // No cerrar si el click es en otro toggle del navbar (dejar que ese toggle maneje su propio estado)
                        const clickedInLangSelector = e.target.closest('.jkhive-lang-selector');
                        const clickedInNotifSelector = e.target.closest('.jkhive-notif-selector');
                        const isNavbarToggle = clickedInLangSelector || clickedInNotifSelector;
                        
                        if (!userMenuContainer.contains(e.target) && !isNavbarToggle) {
                            // Remover ambas clases para asegurar que el estilo vuelva al amarillo miel
                            dropdown.classList.remove('active');
                            wrapper.classList.remove('active');
                            // Forzar un reflow para asegurar que el CSS se actualice
                            void wrapper.offsetHeight;
                        }
                    });
                }
            } else {
                const isInCrm = (window.location.pathname.includes('/crm/') || window.location.pathname.includes('housesitting'));
                
                const loginUrl = isInCrm 
                    ? 'login.php' 
                    : (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath) 
                        ? HostsConfig.getCrmUrlPath('login.php') 
                        : (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath ? HostsConfig.getCrmUrlPath('login.php') : 'login.php');
                const registerUrl = isInCrm 
                    ? 'register.php' 
                    : (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath) 
                        ? HostsConfig.getCrmUrlPath('register.php') 
                        : (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath ? HostsConfig.getCrmUrlPath('register.php') : 'register.php');
                const crmLogin = (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath)
                    ? HostsConfig.getCrmUrlPath('login.php')
                    : loginUrl;
                const redir = encodeURIComponent(
                    window.location.pathname + window.location.search + window.location.hash
                );
                const loginHref = `${crmLogin}?redirect=${redir}`;
                
                userMenuContainer.innerHTML = noPublicRegister ? `
                    <div class="jkhive-navbar-hex-item" onclick="window.location.href='${loginHref}'" data-tooltip="Iniciar sesión" style="cursor: pointer;" role="link" tabindex="0" aria-label="Iniciar sesión">
                        <i class="fas fa-key"></i>
                    </div>
                ` : `
                    <div style="display: flex; gap: 2px;">
                        <div class="jkhive-navbar-hex-item" onclick="window.location.href='${loginUrl}'" data-tooltip="Iniciar sesión" style="cursor: pointer;" role="link" tabindex="0" aria-label="Iniciar sesión">
                            <i class="fas fa-key"></i>
                        </div>
                        <div class="jkhive-navbar-hex-item" onclick="window.location.href='${registerUrl}'" data-tooltip="Registrarse" style="cursor: pointer;" role="link" tabindex="0" aria-label="Registrarse">
                            <i class="fas fa-user-plus"></i>
                        </div>
                    </div>
                `;
            }
            
            // Hacer visible el contenedor después de actualizar el menú
            userMenuContainer.classList.add('ready');
        },

        /**
         * Cerrar sesión
         */
        logout: async function() {
            try {
                const apiUrl = (typeof HostsConfig !== 'undefined' && HostsConfig.getApiAuthBase) 
                    ? HostsConfig.getApiAuthBase() + '/logout.php'
                    : (typeof HostsConfig !== 'undefined' && HostsConfig.getApiAuthBase ? HostsConfig.getApiAuthBase() + '/logout.php' : 'api/auth/logout.php');
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
                    
                    const homeUrl = (typeof HostsConfig !== 'undefined' && HostsConfig.getWebUrlPath) ? HostsConfig.getWebUrlPath('index.php') : 'index.php';
                    window.location.href = homeUrl;
                } else {
                    alert('Error al cerrar sesión');
                }
            } catch (error) {
                console.error('Logout error:', error);
                alert('Error al cerrar sesión');
            }
        },

        /**
         * Attach event listeners
         */
        attachEventListeners: function() {
            // Verificar estado periódicamente (cada 5 minutos)
            setInterval(() => {
                this.checkAuthStatus();
            }, 300000);
        },

        /**
         * Escapar HTML para prevenir XSS
         */
        escapeHtml: function(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    };

    /**
     * Inicializar cuando el navbar esté cargado
     */
    async function initializeAuth() {
        // Esperar a que el navbar esté cargado
        const checkNavbar = setInterval(async () => {
            const userMenuContainer = document.getElementById('userMenuContainer');
            if (userMenuContainer) {
                clearInterval(checkNavbar);
                await AuthManager.init();
            }
        }, 100);

        // Timeout de seguridad (5 segundos)
        setTimeout(async () => {
            clearInterval(checkNavbar);
            // Intentar inicializar de todas formas
            await AuthManager.init();
        }, 5000);
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAuth);
    } else {
        initializeAuth();
    }

    // También escuchar el evento de navbar cargado
    window.addEventListener('navbarLoaded', async () => {
        setTimeout(async () => await AuthManager.init(), 100);
    });

    // Exponer globalmente
    window.AuthManager = AuthManager;
})();

