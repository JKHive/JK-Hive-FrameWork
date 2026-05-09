/**
 * Housesitting - Búsqueda global (panel)
 */

class SearchSystem {
    constructor() {
        this.apiBase = (typeof HostsConfig !== 'undefined' && HostsConfig.getWebUrl)
            ? HostsConfig.getWebUrl() + '/api/search'
            : '/api/search';
        this.searchModal = null;
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.createSearchModal();
        this.setupEventListeners();
    }
    
    createSearchModal() {
        // Verificar si el modal ya existe
        if (document.getElementById('searchModal')) {
            this.searchModal = document.getElementById('searchModal');
            return;
        }
        
        // Crear modal de búsqueda HEXAGONAL
        const modalHtml = `
            <div id="searchModal" class="jkhive-modal" style="display: none;">
                <div class="jkhive-modal-overlay" onclick="searchSystem.close()"></div>
                <div class="jkhive-modal-content jkhive-modal-hex">
                    <div class="jkhive-modal-header">
                        <div class="jkhive-modal-icon">
                            <i class="fas fa-search" style="color: var(--jk-primary-blue-light);"></i>
                        </div>
                        <h2 class="jkhive-modal-title">Buscar</h2>
                    </div>
                    <div class="jkhive-modal-body">
                        <div class="search-input-container" style="margin-bottom: 20px;">
                            <input type="text" id="searchInput" class="form-control" placeholder="Buscar productos, servicios, libros..." autocomplete="off" style="width: 100%; padding: 12px; font-size: 1.1rem; background: var(--jk-tech-dark); border: 2px solid var(--jk-primary-blue); color: var(--jk-metal-light); border-radius: 8px;">
                        </div>
                        <div id="searchResults" class="search-results" style="max-height: 500px; overflow-y: auto;"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.searchModal = document.getElementById('searchModal');
        
        // Configurar input de búsqueda
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                document.getElementById('searchResults').innerHTML = '<p style="text-align: center; color: var(--jk-metal-medium); padding: 20px;"><i class="fas fa-info-circle" style="margin-right: 0.5rem;"></i>Escribe al menos 2 caracteres para buscar</p>';
                return;
            }
            
            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
        
        // Cerrar al hacer clic fuera del modal
        this.searchModal?.addEventListener('click', (e) => {
            if (e.target.classList.contains('jkhive-modal-overlay')) {
                this.close();
            }
        });
    }
    
    async performSearch(query) {
        const resultsContainer = document.getElementById('searchResults');
        resultsContainer.innerHTML = '<p style="text-align: center; color: var(--jk-metal-light); padding: 20px;"><i class="fas fa-spinner fa-spin"></i> Buscando...</p>';
        
        try {
            const response = await fetch(`${this.apiBase}/index.php?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success) {
                this.renderResults(data.data, query);
            } else {
                resultsContainer.innerHTML = '<p style="text-align: center; color: var(--jk-accent-red); padding: 20px;">Error al realizar la búsqueda</p>';
            }
        } catch (e) {
            console.error('Error en búsqueda:', e);
            resultsContainer.innerHTML = '<p style="text-align: center; color: var(--jk-accent-red); padding: 20px;">Error al realizar la búsqueda</p>';
        }
    }
    
    renderResults(results, query) {
        const resultsContainer = document.getElementById('searchResults');
        
        if (results.total === 0) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div class="jkhive-modal-icon" style="font-size: 3rem; color: var(--jk-metal-medium); margin-bottom: 15px;">
                        <i class="fas fa-search"></i>
                    </div>
                    <p style="color: var(--jk-metal-medium); font-size: 1rem;">No se encontraron resultados para "<strong style="color: var(--jk-metal-light);">${this.escapeHtml(query)}</strong>"</p>
                    <p style="color: var(--jk-metal); font-size: 0.85rem; margin-top: 10px;">Intenta con otros términos de búsqueda o verifica que los datos estén cargados en el sistema.</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        const webUrl = (typeof HostsConfig !== 'undefined' && HostsConfig.getWebUrl) ? HostsConfig.getWebUrl() : '';
        
        // Productos
        if (results.products && results.products.length > 0) {
            html += '<div class="search-section"><h3><i class="fas fa-box"></i> Productos</h3><div class="search-items">';
            results.products.forEach(product => {
                html += `
                    <div class="search-item" onclick="window.location.href='${webUrl}/products.html?id=${product.id}'">
                        <div class="search-item-icon"><i class="fas fa-box"></i></div>
                        <div class="search-item-content">
                            <div class="search-item-title">${this.escapeHtml(product.title || 'Sin título')}</div>
                            <div class="search-item-subtitle">${this.escapeHtml((product.subtitle || product.description || '').substring(0, 100))}${(product.subtitle || product.description || '').length > 100 ? '...' : ''}</div>
                        </div>
                    </div>
                `;
            });
            html += '</div></div>';
        }
        
        // Servicios
        if (results.services && results.services.length > 0) {
            html += '<div class="search-section"><h3><i class="fas fa-cogs"></i> Servicios</h3><div class="search-items">';
            results.services.forEach(service => {
                html += `
                    <div class="search-item" onclick="window.location.href='${webUrl}/services.html?id=${service.id}'">
                        <div class="search-item-icon"><i class="fas fa-cogs"></i></div>
                        <div class="search-item-content">
                            <div class="search-item-title">${this.escapeHtml(service.title || 'Sin título')}</div>
                            <div class="search-item-subtitle">${this.escapeHtml((service.subtitle || service.description || '').substring(0, 100))}${(service.subtitle || service.description || '').length > 100 ? '...' : ''}</div>
                        </div>
                    </div>
                `;
            });
            html += '</div></div>';
        }
        
        // Libros
        if (results.books && results.books.length > 0) {
            html += '<div class="search-section"><h3><i class="fas fa-book"></i> Libros</h3><div class="search-items">';
            results.books.forEach(book => {
                html += `
                    <div class="search-item" onclick="window.location.href='${webUrl}/ebooks.html?id=${book.id}'">
                        <div class="search-item-icon"><i class="fas fa-book"></i></div>
                        <div class="search-item-content">
                            <div class="search-item-title">${this.escapeHtml(book.title || 'Sin título')}</div>
                            <div class="search-item-subtitle">${this.escapeHtml((book.subtitle || book.description || '').substring(0, 100))}${(book.subtitle || book.description || '').length > 100 ? '...' : ''}</div>
                        </div>
                    </div>
                `;
            });
            html += '</div></div>';
        }
        
        resultsContainer.innerHTML = html;
    }
    
    open() {
        // Cerrar todos los menús desplegables del navbar antes de abrir el modal
        this.closeAllNavbarDropdowns();
        
        if (this.searchModal) {
            this.searchModal.style.display = 'flex';
            this.searchModal.classList.add('active', 'show');
            document.body.style.overflow = 'hidden';
            this.isOpen = true;
            
            // Enfocar el input después de un pequeño delay
            setTimeout(() => {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 100);
        }
    }
    
    closeAllNavbarDropdowns() {
        // Cerrar selector de idiomas
        const langSelector = document.querySelector('.jkhive-lang-selector');
        if (langSelector) langSelector.classList.remove('open');
        
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
        
        // Cerrar instancia de notificaciones si existe
        if (typeof notificationsSystem !== 'undefined' && notificationsSystem) {
            notificationsSystem.close();
        }
    }
    
    close() {
        if (this.searchModal) {
            this.searchModal.style.display = 'none';
            this.searchModal.classList.remove('active', 'show');
            document.body.style.overflow = '';
            this.isOpen = false;
            
            // Limpiar resultados
            const searchInput = document.getElementById('searchInput');
            const searchResults = document.getElementById('searchResults');
            if (searchInput) searchInput.value = '';
            if (searchResults) searchResults.innerHTML = '';
        }
    }
    
    setupEventListeners() {
        // Buscar el ícono de búsqueda en el navbar
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                const searchIcon = document.getElementById('searchIcon');
                if (searchIcon && !searchIcon.onclick) {
                    searchIcon.addEventListener('click', () => {
                        this.open();
                    });
                }
            }, 500);
        });
        
        // Atajo de teclado: Ctrl+K o Cmd+K para abrir búsqueda
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.open();
            }
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar sistema de búsqueda
let searchSystem;
document.addEventListener('DOMContentLoaded', () => {
    searchSystem = new SearchSystem();
});

// Exportar globalmente
window.searchSystem = searchSystem;

