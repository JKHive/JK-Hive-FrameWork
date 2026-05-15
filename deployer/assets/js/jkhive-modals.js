/**
 * Housesitting - Modales unificados
 *
 * Consolida toda la funcionalidad de modales en un solo archivo independiente
 * 
 * Incluye:
 * - ModalManager: Gestor universal de modales (libros, productos, servicios, portfolio, experiencias)
 * - SystemMessages: Sistema de mensajes del sistema (info, success, error, warning, confirm)
 * - Funciones auxiliares comunes
 * - Event listeners globales
 */

// ========================================
// UTILIDADES COMUNES
// ========================================

/**
 * Escapar HTML para inserción segura
 */
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Decodificar entidades HTML
 */
function decodeHtml(str) {
    if (!str) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
}

// ========================================
// MODAL MANAGER - Gestor Universal de Modales
// ========================================

class ModalManager {
    constructor() {
        this.activeModal = null;
        this.init();
    }

    // Initialize event listeners
    init() {
        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal();
            }
        });
    }

    // Attach event listeners to add-to-cart buttons
    attachCartButtonListeners() {
        const cartButtons = document.querySelectorAll('.add-to-cart-btn');
        cartButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const item = {
                    id: btn.getAttribute('data-item-id'),
                    type: btn.getAttribute('data-item-type'),
                    name: decodeHtml(btn.getAttribute('data-item-name') || ''),
                    price: parseFloat(btn.getAttribute('data-item-price')) || 0,
                    icon: decodeHtml(btn.getAttribute('data-item-icon') || ''),
                    category: decodeHtml(btn.getAttribute('data-item-category') || ''),
                    description: decodeHtml(btn.getAttribute('data-item-description') || '')
                };
                
                if (typeof shoppingCart !== 'undefined' && shoppingCart && shoppingCart.addToCart) {
                    shoppingCart.addToCart(item);
                }
                
                if (btn.getAttribute('data-close-modal') === 'true') {
                    this.closeModal();
                }
                
                return false;
            });
        });
    }

    // Open modal with data
    openModal(type, id, data) {
        // Close any existing modal first
        this.closeModal();

        // Generate modal HTML based on type
        let modalHTML = '';
        
        switch(type) {
            case 'book':
                modalHTML = this.generateBookModal(id, data);
                break;
            case 'product':
                modalHTML = this.generateProductModal(id, data);
                break;
            case 'service':
                modalHTML = this.generateServiceModal(id, data);
                break;
            case 'portfolio':
                modalHTML = this.generatePortfolioModal(id, data);
                break;
            case 'experience':
                modalHTML = this.generateExperienceModal(id, data);
                break;
            default:
                if (window.JK_DEBUG) console.error('Unknown modal type:', type);
                return;
        }

        // Create modal container if doesn't exist
        let modalsContainer = document.getElementById('modalsContainer');
        if (!modalsContainer) {
            modalsContainer = document.createElement('div');
            modalsContainer.id = 'modalsContainer';
            document.body.appendChild(modalsContainer);
        }

        // Insert modal
        modalsContainer.innerHTML = modalHTML;
        this.activeModal = { type, id };

        // Attach event listeners for add-to-cart buttons
        this.attachCartButtonListeners();

        // Show modal with animation
        const modal = document.querySelector('.jkhive-modal.show');
        if (modal) {
            setTimeout(() => modal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
        }
    }

    // Close active modal
    closeModal() {
        const modal = document.querySelector('.jkhive-modal.show, .jkhive-modal.active');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
                this.activeModal = null;
            }, 300);
        }
    }

    // Generate Book Modal
    generateBookModal(bookId, book) {
        const actionButtons = book.available ? `
            <div class="jkhive-actionbutton-small">
                <a href="#" class="add-to-cart-btn" 
                   data-item-id="${bookId}" 
                   data-item-type="book" 
                   data-item-name="${escapeHtml(book.title)}" 
                   data-item-price="${book.price}" 
                   data-item-icon="${escapeHtml(book.icon)}" 
                   data-item-category="${escapeHtml(book.subtitle)}" 
                   data-item-description=""
                   data-close-modal="true"
                   data-tooltip="Añadir al Carrito">
                    <div class="jkhive-hex jkhive-hex-honey">
                        <div class="jkhive-hex-content jkhive-hex-content-editorial">
                            <i class="jkhive-hex-icon fas fa-shopping-cart"></i>
                        </div>
                    </div>
                </a>
            </div>
        ` : '';

        return `
            <div class="jkhive-modal show" id="modal-${bookId}">
                <div class="jkhive-modal-overlay" onclick="modalManager.closeModal()"></div>
                <div class="jkhive-modal-content jkhive-modal-hex">
                    <button class="jkhive-modal-close" onclick="modalManager.closeModal()">&times;</button>
                    
                    <div class="jkhive-modal-header">
                        <div class="jkhive-modal-icon">${book.icon}</div>
                        <h2 class="jkhive-modal-title">${book.title}</h2>
                        <h3 class="jkhive-modal-company">${book.subtitle}</h3>
                    </div>
                    
                    <div class="jkhive-modal-body">
                        <p class="jkhive-modal-description">${book.description}</p>
                        
                        <h4 class="jkhive-modal-subtitle">Contenido:</h4>
                        <ul class="jkhive-modal-list">
                            ${book.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        
                        <div class="row g-3 mt-3">
                            <div class="col-md-4"><strong>Precio:</strong> ${book.price > 0 ? `$${book.price}` : 'Gratis'}</div>
                            <div class="col-md-4"><strong>Páginas:</strong> ${book.pages}</div>
                            <div class="col-md-4"><strong>Formato:</strong> ${book.format}</div>
                        </div>
                        
                        ${!book.available ? `<div class="alert alert-info mt-3"><i class="fas fa-info-circle me-2"></i>${book.status}</div>` : ''}
                        
                        <div class="text-center mt-4" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                            ${actionButtons}
                            <div class="jkhive-actionbutton-small">
                                <a href="contact.html" data-tooltip="Contacto">
                                    <div class="jkhive-hex jkhive-hex-honey">
                                        <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                            <i class="jkhive-hex-icon fas fa-envelope"></i>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Generate Product Modal
    generateProductModal(productId, product) {
        const featuresHTML = product.features.map(feature => 
            `<li class="jkhive-modal-feature">✓ ${feature}</li>`
        ).join('');

        let actionButtonsHTML = '';
        if (product.isFree) {
            actionButtonsHTML = `
                <div class="jkhive-modal-actions" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <div class="jkhive-actionbutton-small">
                        <a href="${product.demoUrl}" data-tooltip="Ir a Herramienta">
                            <div class="jkhive-hex jkhive-hex-honey">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <i class="jkhive-hex-icon fas fa-rocket"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="jkhive-actionbutton-small">
                        <a href="contact.html?product=${encodeURIComponent(product.title)}" data-tooltip="Contacto">
                            <div class="jkhive-hex jkhive-hex-honey">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <i class="jkhive-hex-icon fas fa-envelope"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            `;
        } else if (product.available) {
            actionButtonsHTML = `
                <div class="jkhive-modal-actions" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <div class="jkhive-actionbutton-small">
                        <a href="${product.demoUrl}" target="_blank" data-tooltip="Ver Demo">
                            <div class="jkhive-hex jkhive-hex-honey">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <i class="jkhive-hex-icon fas fa-rocket"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="jkhive-actionbutton-small">
                        <a href="#" class="add-to-cart-btn" 
                           data-item-id="${productId}" 
                           data-item-type="product" 
                           data-item-name="${escapeHtml(product.title)}" 
                           data-item-price="0" 
                           data-item-icon="${escapeHtml(product.icon)}" 
                           data-item-category="${escapeHtml(product.subtitle)}" 
                           data-item-description="Cotización personalizada"
                           data-tooltip="Agregar al Carrito">
                            <div class="jkhive-hex jkhive-hex-honey">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <i class="jkhive-hex-icon fas fa-shopping-cart"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="jkhive-actionbutton-small">
                        <a href="contact.html?product=${encodeURIComponent(product.title)}" data-tooltip="Contacto">
                            <div class="jkhive-hex jkhive-hex-honey">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <i class="jkhive-hex-icon fas fa-envelope"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            `;
        } else {
            actionButtonsHTML = `
                <div class="jkhive-modal-actions" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <div class="jkhive-actionbutton-small">
                        <a href="#" class="add-to-cart-btn" 
                           data-item-id="${productId}" 
                           data-item-type="product" 
                           data-item-name="${escapeHtml(product.title)}" 
                           data-item-price="0" 
                           data-item-icon="${escapeHtml(product.icon)}" 
                           data-item-category="${escapeHtml(product.subtitle)}" 
                           data-item-description="Cotización personalizada"
                           data-tooltip="Agregar al Carrito">
                            <div class="jkhive-hex jkhive-hex-honey">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <i class="jkhive-hex-icon fas fa-shopping-cart"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="jkhive-actionbutton-small">
                        <a href="contact.html?product=${encodeURIComponent(product.title)}" data-tooltip="Consultar Disponibilidad">
                            <div class="jkhive-hex jkhive-hex-honey">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <i class="jkhive-hex-icon fas fa-envelope"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            `;
        }

        return `
            <div class="jkhive-modal show active" id="modal-${productId}">
                <div class="jkhive-modal-overlay" onclick="modalManager.closeModal()"></div>
                <div class="jkhive-modal-content jkhive-modal-hex">
                    <button class="jkhive-modal-close" onclick="modalManager.closeModal()">&times;</button>
                    
                    <div class="jkhive-modal-header">
                        <div class="jkhive-modal-icon">${product.icon}</div>
                        <h2 class="jkhive-modal-title">${product.title}</h2>
                        <p class="jkhive-modal-subtitle">${product.subtitle}</p>
                    </div>
                    
                    <div class="jkhive-modal-body">
                        <p class="jkhive-modal-description">${product.description}</p>
                        
                        <h3 class="jkhive-modal-section-title">Características Principales:</h3>
                        <ul class="jkhive-modal-features">${featuresHTML}</ul>
                        
                        <div class="jkhive-modal-deployment">
                            <strong>📦 Implementación:</strong> ${product.deployment}
                        </div>
                    </div>
                    
                    ${actionButtonsHTML}
                </div>
            </div>
        `;
    }

    // Generate Service Modal
    generateServiceModal(serviceId, service) {
        let modalHTML = `
            <div class="jkhive-modal show" id="modal-${serviceId}">
                <div class="jkhive-modal-overlay" onclick="modalManager.closeModal()"></div>
                <div class="jkhive-modal-content jkhive-modal-hex">
                    <button class="jkhive-modal-close" onclick="modalManager.closeModal()">&times;</button>
                    
                    <div class="jkhive-modal-header">
                        <div class="jkhive-modal-icon">${service.icon}</div>
                        <h2 class="jkhive-modal-title">${service.title}</h2>
                        <h3 class="jkhive-modal-company">${service.subtitle}</h3>
                    </div>
                    
                    <div class="jkhive-modal-body">
                        <p class="jkhive-modal-description">${service.description}</p>
                        
                        <h4 class="jkhive-modal-subtitle">Características Principales:</h4>
                        <ul class="jkhive-modal-list">
                            ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        
                        <h4 class="jkhive-modal-subtitle">Tecnologías:</h4>
                        <div class="tech-tags mb-3">
                            ${service.technologies.map(tech => `<span class="badge bg-secondary me-2">${tech}</span>`).join('')}
                        </div>
        `;

        if (service.certification) {
            modalHTML += `
                        <h4 class="jkhive-modal-subtitle">Certificación Profesional:</h4>
                        <p><i class="fas fa-certificate me-2 text-info"></i>${service.certification}</p>
            `;
        }

        if (service.deployment) {
            modalHTML += `
                        <h4 class="jkhive-modal-subtitle">Despliegue:</h4>
                        <p>${service.deployment}</p>
            `;
        }

        if (service.clientType) {
            modalHTML += `
                        <h4 class="jkhive-modal-subtitle">Tipo de Cliente Ideal:</h4>
                        <p>${service.clientType}</p>
            `;
        }

        modalHTML += `
                        <div class="text-center mt-4" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                            <div class="jkhive-actionbutton-small">
                                <a href="portfolio.html" data-tooltip="Ver Portafolio">
                                    <div class="jkhive-hex jkhive-hex-honey">
                                        <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                            <i class="jkhive-hex-icon fas fa-briefcase"></i>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div class="jkhive-actionbutton-small">
                                <a href="contact.html?service=${encodeURIComponent(service.title)}" data-tooltip="Contacto">
                                    <div class="jkhive-hex jkhive-hex-honey">
                                        <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                            <i class="jkhive-hex-icon fas fa-envelope"></i>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return modalHTML;
    }

    // Generate Portfolio Modal
    generatePortfolioModal(projectId, project) {
        let modalHTML = `
            <div class="jkhive-modal show" id="modal-${projectId}">
                <div class="jkhive-modal-overlay" onclick="modalManager.closeModal()"></div>
                <div class="jkhive-modal-content jkhive-modal-hex">
                    <button class="jkhive-modal-close" onclick="modalManager.closeModal()">&times;</button>
                    
                    <div class="jkhive-modal-header">
                        <div class="jkhive-modal-icon">${project.icon}</div>
                        <h2 class="jkhive-modal-title">${project.title}</h2>
                        <h3 class="jkhive-modal-company">${project.subtitle}</h3>
                        <p class="jkhive-modal-period">${project.period}</p>
                    </div>
                    
                    <div class="jkhive-modal-body">
                        <p class="jkhive-modal-description">${project.description}</p>
                        
                        ${project.history ? `<p class="jkhive-modal-description">${project.history}</p>` : ''}
                        
                        <h4 class="jkhive-modal-subtitle">Características Principales:</h4>
                        <ul class="jkhive-modal-list">
                            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        
                        <h4 class="jkhive-modal-subtitle">Tecnologías Utilizadas:</h4>
                        <div class="tech-tags mb-3">
                            ${project.technologies.map(tech => `<span class="badge bg-secondary me-2">${tech}</span>`).join('')}
                        </div>
                        
                        ${project.deployment ? `
                        <h4 class="jkhive-modal-subtitle">Despliegue:</h4>
                        <p>${project.deployment}</p>
                        ` : ''}
                        
                        ${project.methodology ? `
                        <h4 class="jkhive-modal-subtitle">Metodología:</h4>
                        <p>${project.methodology}</p>
                        ` : ''}
                        
                        ${project.clientType ? `
                        <h4 class="jkhive-modal-subtitle">Tipo de Cliente Ideal:</h4>
                        <p>${project.clientType}</p>
                        ` : ''}
                        
                        <div class="text-center mt-4" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                            ${project.productPage ? `
                            <div class="jkhive-actionbutton-small">
                                <a href="webs.html" data-tooltip="Ver en JK WebS">
                                    <div class="jkhive-hex jkhive-hex-honey">
                                        <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                            <i class="jkhive-hex-icon fas fa-globe"></i>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            ` : ''}
                            <div class="jkhive-actionbutton-small">
                                <a href="contact.html?project=${encodeURIComponent(project.title)}" data-tooltip="Contactar">
                                    <div class="jkhive-hex jkhive-hex-honey">
                                        <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                            <i class="jkhive-hex-icon fas fa-envelope"></i>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return modalHTML;
    }

    // Generate Experience Modal
    generateExperienceModal(experienceId, experience) {
        const achievements = Array.isArray(experience.achievements) ? experience.achievements : [];
        const achievementsBlock = achievements.length
            ? `<h4 class="jkhive-modal-subtitle">Logros principales</h4>
                        <ul class="jkhive-modal-list">
                            ${achievements.map(achievement => `<li>${escapeHtml(achievement)}</li>`).join('')}
                        </ul>`
            : '';
        const techs = Array.isArray(experience.technologies) && experience.technologies.length
            ? `<h4 class="jkhive-modal-subtitle">Habilidades</h4>
                        <div class="tech-tags jkhive-tech-tags mb-3">
                            ${experience.technologies.map(tech => `<span class="jkhive-skill-chip">${escapeHtml(tech)}</span>`).join('')}
                        </div>`
            : '';

        let modalHTML = `
            <div class="jkhive-modal show" id="modal-${experienceId}" role="dialog" aria-modal="true" aria-labelledby="jkhive-exp-modal-title-${experienceId}">
                <div class="jkhive-modal-overlay" onclick="modalManager.closeModal()"></div>
                <div class="jkhive-modal-content jkhive-modal-hex jkhive-modal-form-admin jkhive-modal-experience">
                    <div class="jkhive-modal-header">
                        <button type="button" class="jkhive-modal-close" onclick="modalManager.closeModal()" aria-label="Cerrar">&times;</button>
                        <div class="jkhive-modal-experience-header-stack">
                            <div class="jkhive-modal-icon">${experience.icon}</div>
                            <h2 class="jkhive-modal-title" id="jkhive-exp-modal-title-${experienceId}">${escapeHtml(experience.title)}</h2>
                            <h3 class="jkhive-modal-company">${escapeHtml(experience.company)}</h3>
                            <p class="jkhive-modal-period">${escapeHtml(experience.period)}${experience.location ? ' • ' + escapeHtml(experience.location) : ''}</p>
                        </div>
                    </div>
                    <div class="jkhive-modal-body">
                        <div class="jkhive-modal-body-content jkhive-modal-experience-body">
                            <div class="jkhive-modal-description jkhive-modal-description--html">${experience.description}</div>
                            ${achievementsBlock}
                            ${techs}
                        </div>
                    </div>
                    <div class="jkhive-modal-footer jkhive-modal-admin-footer">
                        <div class="jkhive-modal-admin-footer-honeycomb">
                            <div class="jkhive-modal-admin-footer-row2">
                                <div class="jkhive-bttn-med jkhive-bttn-modal-exit jkhive-btn-cart-exit" data-tooltip="Salir">
                                    <button type="button" onclick="modalManager.closeModal()" aria-label="Salir">
                                        <div class="jkhive-hex"><div class="jkhive-hex-content jkhive-hex-content-editorial"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.1rem" height="1.1rem" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg></div></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return modalHTML;
    }
}

// ========================================
// SYSTEM MESSAGES - Sistema de Mensajes del Sistema
// ========================================

// Evitar redeclaración de la clase
if (typeof SystemMessages === 'undefined') {
    window.SystemMessages = class SystemMessages {
        constructor() {
            this.modalContainer = null;
            this.currentModal = null;
            this.resolveCurrent = null;
            this.onButtonClick = null;
            // Solo inicializar si document.body está disponible
            if (document.body) {
                this.init();
            } else {
                // Si no está disponible, esperar a que el DOM esté listo
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => this.init());
                } else {
                    // Si ya está cargado pero body no está disponible, intentar de nuevo
                    setTimeout(() => {
                        if (document.body) {
                            this.init();
                        }
                    }, 100);
                }
            }
        }
        
        init() {
            // Verificar que document.body esté disponible
            if (!document.body) {
                console.warn('SystemMessages: document.body no está disponible, reintentando...');
                setTimeout(() => this.init(), 100);
                return;
            }
            
            // Crear contenedor de modal si no existe
            if (!document.getElementById('jkhive-system-modal-container')) {
                const container = document.createElement('div');
                container.id = 'jkhive-system-modal-container';
                document.body.appendChild(container);
                this.modalContainer = container;
            } else {
                this.modalContainer = document.getElementById('jkhive-system-modal-container');
            }
        }
        
        /**
         * Mostrar mensaje de información
         */
        info(message, title = 'Información', customClass = '') {
            // Si no se especifica customClass, usar jkhive-modals-alert con clase de tipo
            const finalClass = customClass || 'jkhive-modals-alert jkhive-modals-alert-info';
            return this.show({
                type: 'info',
                title: title,
                message: message,
                icon: 'fas fa-info-circle',
                buttons: [{ text: 'Aceptar', action: 'ok', primary: true }],
                customClass: finalClass
            });
        }
        
        /**
         * Mostrar mensaje de éxito
         */
        success(message, title = 'Éxito', customClass = '') {
            // Si no se especifica customClass, usar jkhive-modals-alert con clase de tipo
            const finalClass = customClass || 'jkhive-modals-alert jkhive-modals-alert-success';
            return this.show({
                type: 'success',
                title: title,
                message: message,
                icon: 'fas fa-check-circle',
                buttons: [{ text: 'Aceptar', action: 'ok', primary: true }],
                customClass: finalClass
            });
        }
        
        /**
         * Mostrar mensaje de error
         */
        error(message, title = 'Error', customClass = '') {
            // Si no se especifica customClass, usar jkhive-modals-alert con clase de tipo
            const finalClass = customClass || 'jkhive-modals-alert jkhive-modals-alert-error';
            return this.show({
                type: 'error',
                title: title,
                message: message,
                icon: 'fas fa-exclamation-circle',
                buttons: [{ text: 'Aceptar', action: 'ok', primary: true }],
                customClass: finalClass
            });
        }
        
        /**
         * Mostrar mensaje de advertencia
         */
        warning(message, title = 'Advertencia', customClass = '') {
            // Si no se especifica customClass, usar jkhive-modals-alert con clase de tipo
            const finalClass = customClass || 'jkhive-modals-alert jkhive-modals-alert-warning';
            return this.show({
                type: 'warning',
                title: title,
                message: message,
                icon: 'fas fa-exclamation-triangle',
                buttons: [{ text: 'Aceptar', action: 'ok', primary: true }],
                customClass: finalClass
            });
        }
        
        /**
         * Mostrar mensaje de confirmación
         * @param {Function} onConfirm - Callback opcional que se ejecuta cuando se confirma (recibe: confirmed, modal)
         */
        confirm(message, title = 'Confirmar', customClass = '', onConfirm = null) {
            if (onConfirm) {
                // Si hay callback, guardarlo para usarlo en lugar de cerrar el modal
                this.onButtonClick = onConfirm;
            }
            // Si no se especifica customClass, usar jkhive-modals-alert con clase de tipo
            const finalClass = customClass || 'jkhive-modals-alert jkhive-modals-alert-info';
            return this.show({
                type: 'confirm',
                title: title,
                message: message,
                icon: 'fas fa-question-circle',
                buttons: [
                    { text: 'Cancelar', action: 'cancel', primary: false },
                    { text: 'Aceptar', action: 'ok', primary: true }
                ],
                customClass: finalClass
            });
        }
        
        /**
         * Actualizar contenido de un modal existente sin cerrarlo
         */
        updateModal(modal, options) {
            if (!modal) return;
            
            const {
                type = 'info',
                title = 'Mensaje',
                message = '',
                icon = 'fas fa-info-circle',
                buttons = [{ text: 'Aceptar', action: 'ok', primary: true }],
                customClass = ''
            } = options;
            
            // Colores según tipo
            const colors = {
                info: 'var(--jk-primary-blue)',
                success: 'var(--jk-secondary-green)',
                error: 'var(--jk-accent-red, #dc3545)',
                warning: 'var(--jk-accent-honey)',
                confirm: 'var(--jk-primary-blue)'
            };
            
            const iconColor = colors[type] || colors.info;
            
            // Obtener elementos del modal
            const content = modal.querySelector('.jkhive-modal-content');
            const header = modal.querySelector('.jkhive-modal-header');
            const body = modal.querySelector('.jkhive-modal-body');
            const actions = modal.querySelector('.jkhive-modal-actions');
            
            if (!content) return;
            
            // Transición suave: ocultar contenido primero
            content.style.opacity = '0';
            content.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                // Actualizar contenido
                if (header) {
                    const iconEl = header.querySelector('.jkhive-modal-icon');
                    const titleEl = header.querySelector('.jkhive-modal-title');
                    if (iconEl) {
                        iconEl.style.color = iconColor;
                        iconEl.innerHTML = `<i class="${icon}"></i>`;
                    }
                    if (titleEl) {
                        titleEl.textContent = title;
                    }
                }
                
                if (body) {
                    body.innerHTML = `<p class="jkhive-modal-description">${message}</p>`;
                }
                
                // Mostrar contenido con transición
                content.style.opacity = '1';
            }, 150);
            
            if (actions) {
                // Limpiar listeners anteriores
                actions.querySelectorAll('.jkhive-system-modal-btn').forEach(btn => {
                    const newBtn = btn.cloneNode(true);
                    btn.parentNode.replaceChild(newBtn, btn);
                });
                
                // Actualizar botones
                const isMessagingOrAlert = customClass.includes('jkhive-modal-msgs-vp') || 
                                          customClass.includes('jkhive-modal-msgs-e') || 
                                          customClass.includes('jkhive-msgs-alerts') ||
                                          customClass.includes('jkhive-modals-alert');
                const actionButtonClass = isMessagingOrAlert
                    ? 'jkhive-actionbutton-med jkhive-actionbutton-msgs'
                    : 'jkhive-actionbutton-med';
                
                actions.innerHTML = buttons.map((btn) => {
                    if (btn.primary) {
                        return `
                            <div class="${actionButtonClass}">
                                <a href="#" class="jkhive-system-modal-btn" data-action="${btn.action}" data-primary="true" style="text-decoration: none;">
                                    <div class="jkhive-hex jkhive-hex-honey">
                                        <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                            <span class="jkhive-hex-text">${escapeHtml(btn.text)}</span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        `;
                    } else {
                        return `
                            <div class="${actionButtonClass}">
                                <a href="#" class="jkhive-system-modal-btn" data-action="${btn.action}" style="text-decoration: none;">
                                    <div class="jkhive-hex">
                                        <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                            <span class="jkhive-hex-text">${escapeHtml(btn.text)}</span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        `;
                    }
                }).join('');
                
                // Aplicar estilos inline para modales de mensajería
                if (customClass === 'jkhive-modal-msgs-vp' || customClass === 'jkhive-modal-msgs-e' || customClass === 'jkhive-msgs-alerts') {
                    actions.style.cssText = 'display: block !important; text-align: center !important; margin: 0 auto !important; padding: 0 !important; width: 100% !important; font-size: 0 !important; letter-spacing: 0 !important; word-spacing: 0 !important;';
                    
                    const actionButtons = actions.querySelectorAll('.jkhive-actionbutton-msgs');
                    actionButtons.forEach((btn, index) => {
                        if (index === actionButtons.length - 1) {
                            btn.style.setProperty('margin-right', '0', 'important');
                        } else {
                            btn.style.setProperty('margin-right', '1px', 'important');
                        }
                        btn.style.setProperty('margin', '0', 'important');
                        btn.style.setProperty('padding', '0', 'important');
                        btn.style.setProperty('display', 'inline-block', 'important');
                        btn.style.setProperty('vertical-align', 'middle', 'important');
                        btn.style.setProperty('min-width', '110px', 'important');
                        btn.style.setProperty('transform', 'scale(0.9)', 'important');
                    });
                }
                
                // Agregar event listeners a los nuevos botones
                actions.querySelectorAll('.jkhive-system-modal-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const action = btn.dataset.action;
                        // Cerrar el modal
                        this.close(modal);
                        // Limpiar callbacks
                        this.onButtonClick = null;
                        if (this.resolveCurrent) {
                            this.resolveCurrent(action === 'ok');
                            this.resolveCurrent = null;
                        }
                    });
                });
                
                // Actualizar event listener del overlay para que también cierre cuando hay resultado
                const overlay = modal.querySelector('.jkhive-modal-overlay');
                if (overlay) {
                    // Remover listeners anteriores
                    const newOverlay = overlay.cloneNode(true);
                    overlay.parentNode.replaceChild(newOverlay, overlay);
                    // Agregar nuevo listener
                    newOverlay.addEventListener('click', () => {
                        if (this.onButtonClick) {
                            // Si hay callback personalizado, llamarlo con confirmed = false
                            const callback = this.onButtonClick;
                            this.onButtonClick = null;
                            callback(false, modal);
                        } else {
                            // Sin callback: cerrar normalmente
                            this.close(modal);
                        }
                        if (this.resolveCurrent) {
                            this.resolveCurrent(false);
                            this.resolveCurrent = null;
                        }
                    });
                }
            }
        }
        
        /**
         * Mostrar modal personalizado usando el sistema de modales existente
         */
        show(options) {
            return new Promise((resolve) => {
                // Limpiar modales anteriores antes de crear uno nuevo
                this.closeAllModals();
                
                const {
                    type = 'info',
                    title = 'Mensaje',
                    message = '',
                    icon = 'fas fa-info-circle',
                    buttons = [{ text: 'Aceptar', action: 'ok', primary: true }],
                    customClass = ''
                } = options;
                
                // Colores según tipo
                const colors = {
                    info: 'var(--jk-primary-blue)',
                    success: 'var(--jk-secondary-green)',
                    error: 'var(--jk-accent-red, #dc3545)',
                    warning: 'var(--jk-accent-honey)',
                    confirm: 'var(--jk-primary-blue)'
                };
                
                const iconColor = colors[type] || colors.info;
                
                // Si es un modal de alerta (jkhive-modals-alert), el CSS manejará el color del icono
                const isAlertModal = customClass.includes('jkhive-modals-alert');
                const iconStyle = isAlertModal ? '' : `style="color: ${iconColor};"`;
                
                // Crear modal usando la estructura existente
                const modal = document.createElement('div');
                modal.className = 'jkhive-modal' + (customClass ? ' ' + customClass : '');
                modal.id = 'jkhive-system-modal-' + Date.now();
                
                modal.innerHTML = `
                    <div class="jkhive-modal-overlay"></div>
                    <div class="jkhive-modal-content jkhive-modal-hex">
                        <div class="jkhive-modal-header">
                            <div class="jkhive-modal-icon" ${iconStyle}>
                                <i class="${icon}"></i>
                            </div>
                            <h3 class="jkhive-modal-title">${escapeHtml(title)}</h3>
                        </div>
                        <div class="jkhive-modal-body">
                            <p class="jkhive-modal-description">${message}</p>
                        </div>
                        <div class="jkhive-modal-actions">
                            ${buttons.map((btn, index) => {
                                // Agregar clase específica para modales de mensajería y alertas
                                const isMessagingOrAlert = customClass.includes('jkhive-modal-msgs-vp') || 
                                                          customClass.includes('jkhive-modal-msgs-e') || 
                                                          customClass.includes('jkhive-msgs-alerts') ||
                                                          customClass.includes('jkhive-modals-alert');
                                const actionButtonClass = isMessagingOrAlert
                                    ? 'jkhive-actionbutton-med jkhive-actionbutton-msgs'
                                    : 'jkhive-actionbutton-med';
                                
                                if (btn.primary) {
                                    return `
                                        <div class="${actionButtonClass}">
                                            <a href="#" class="jkhive-system-modal-btn" data-action="${btn.action}" data-primary="true" style="text-decoration: none;">
                                                <div class="jkhive-hex jkhive-hex-honey">
                                                    <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                                        <span class="jkhive-hex-text">${escapeHtml(btn.text)}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    `;
                                } else {
                                    return `
                                        <div class="${actionButtonClass}">
                                            <a href="#" class="jkhive-system-modal-btn" data-action="${btn.action}" style="text-decoration: none;">
                                                <div class="jkhive-hex">
                                                    <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                                        <span class="jkhive-hex-text">${escapeHtml(btn.text)}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    `;
                                }
                            }).join('')}
                        </div>
                    </div>
                `;
                
                // Asegurar que el contenedor existe
                if (!this.modalContainer) {
                    this.init();
                }
                
                this.modalContainer.appendChild(modal);
                
                // APLICAR ESTILOS INLINE DIRECTAMENTE PARA MODALES DE MENSAJERÍA Y ALERTAS
                const isMessagingOrAlert = customClass.includes('jkhive-modal-msgs-vp') || 
                                          customClass.includes('jkhive-modal-msgs-e') || 
                                          customClass.includes('jkhive-msgs-alerts') ||
                                          customClass.includes('jkhive-modals-alert');
                if (isMessagingOrAlert) {
                    // Aplicar estilos al overlay para modales de alertas
                    if (customClass.includes('jkhive-msgs-alerts') || customClass.includes('jkhive-modals-alert')) {
                        const overlay = modal.querySelector('.jkhive-modal-overlay');
                        if (overlay) {
                            overlay.style.setProperty('background', 'rgba(244, 196, 48, 0.8)', 'important');
                            overlay.style.setProperty('backdrop-filter', 'blur(10px)', 'important');
                            overlay.style.setProperty('position', 'absolute', 'important');
                            overlay.style.setProperty('inset', '0', 'important');
                            overlay.style.setProperty('display', 'block', 'important');
                            overlay.style.setProperty('visibility', 'visible', 'important');
                            overlay.style.setProperty('opacity', '1', 'important');
                            overlay.style.setProperty('z-index', '10000', 'important');
                            overlay.style.setProperty('pointer-events', 'auto', 'important');
                            overlay.style.setProperty('cursor', 'pointer', 'important');
                            
                            // Crear ::before para textura SVG
                            const beforeStyle = document.createElement('style');
                            beforeStyle.textContent = `
                                #${modal.id} .jkhive-modal-overlay::before {
                                    content: '' !important;
                                    position: absolute !important;
                                    inset: 0 !important;
                                    background-image: url('../img/honeycomb-pattern.svg') !important;
                                    background-size: 32px 55px !important;
                                    background-repeat: repeat !important;
                                    background-position: 0 0 !important;
                                    pointer-events: none !important;
                                    z-index: 1 !important;
                                    opacity: 1 !important;
                                    filter: brightness(0) contrast(40) !important;
                                }
                                #${modal.id} .jkhive-modal-overlay::after {
                                    content: '' !important;
                                    position: absolute !important;
                                    inset: 0 !important;
                                    background-image: url('../img/honeycomb-pattern.svg') !important;
                                    background-size: 32px 55px !important;
                                    background-repeat: repeat !important;
                                    background-position: 16px 28px !important;
                                    pointer-events: none !important;
                                    z-index: 1 !important;
                                    opacity: 1 !important;
                                    filter: brightness(0) contrast(40) !important;
                                }
                            `;
                            document.head.appendChild(beforeStyle);
                        }
                        
                        // Aplicar estilos al contenido hexagonal
                        const content = modal.querySelector('.jkhive-modal-content.jkhive-modal-hex');
                        if (content) {
                            content.style.setProperty('max-width', '306.886125px', 'important');
                            content.style.setProperty('width', '306.886125px', 'important');
                            content.style.setProperty('min-width', '306.886125px', 'important');
                            content.style.setProperty('aspect-ratio', '1 / 1.1547', 'important');
                            content.style.setProperty('clip-path', 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', 'important');
                            content.style.setProperty('background', 'linear-gradient(135deg, var(--jk-tech-darker) 0%, var(--jk-tech-dark) 50%, var(--jk-primary-blue-darker) 100%)', 'important');
                            content.style.setProperty('border', '3px solid var(--jk-accent-cyan)', 'important');
                            content.style.setProperty('border-radius', '0', 'important');
                            content.style.setProperty('padding', '1.5rem 1.75rem', 'important');
                            content.style.setProperty('position', 'relative', 'important');
                            content.style.setProperty('z-index', '10001', 'important');
                            content.style.setProperty('overflow', 'hidden', 'important');
                            content.style.setProperty('display', 'flex', 'important');
                            content.style.setProperty('flex-direction', 'column', 'important');
                            content.style.setProperty('margin', 'auto', 'important');
                            content.style.setProperty('pointer-events', 'auto', 'important');
                            content.style.setProperty('box-shadow', '0 20px 60px rgba(14, 165, 233, 0.4), inset 0 0 60px rgba(14, 165, 233, 0.1)', 'important');
                            content.style.setProperty('visibility', 'visible', 'important');
                            content.style.setProperty('opacity', '1', 'important');
                            
                            // Crear ::before para borde hexagonal
                            const contentBeforeStyle = document.createElement('style');
                            contentBeforeStyle.textContent = `
                                #${modal.id} .jkhive-modal-content.jkhive-modal-hex::before {
                                    content: '' !important;
                                    position: absolute !important;
                                    inset: -4px !important;
                                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%) !important;
                                    background: linear-gradient(135deg, var(--jk-accent-cyan), var(--jk-primary-blue-light)) !important;
                                    z-index: -1 !important;
                                    opacity: 0.3 !important;
                                    pointer-events: none !important;
                                }
                            `;
                            document.head.appendChild(contentBeforeStyle);
                        }
                    }
                    const actionsContainer = modal.querySelector('.jkhive-modal-actions');
                    if (actionsContainer) {
                        actionsContainer.style.cssText = 'display: block !important; text-align: center !important; margin: 0 auto !important; padding: 0 !important; width: 100% !important; font-size: 0 !important; letter-spacing: 0 !important; word-spacing: 0 !important;';
                        
                        const actionButtons = actionsContainer.querySelectorAll('.jkhive-actionbutton-msgs');
                        actionButtons.forEach((btn, index) => {
                            // FORZAR separación de exactamente 1px usando margin-right
                            if (index === actionButtons.length - 1) {
                                // Último botón sin margen derecho
                                btn.style.setProperty('margin', '0', 'important');
                                btn.style.setProperty('margin-right', '0', 'important');
                            } else {
                                // Botones con EXACTAMENTE 1px de separación (mínima posible)
                                btn.style.setProperty('margin', '0', 'important');
                                btn.style.setProperty('margin-right', '1px', 'important');
                            }
                            btn.style.setProperty('padding', '0', 'important');
                            btn.style.setProperty('display', 'inline-block', 'important');
                            btn.style.setProperty('vertical-align', 'middle', 'important');
                            btn.style.setProperty('min-width', '110px', 'important');
                            btn.style.setProperty('transform', 'scale(0.9)', 'important');
                            btn.style.setProperty('letter-spacing', '0', 'important');
                            btn.style.setProperty('word-spacing', '0', 'important');
                            btn.style.setProperty('float', 'none', 'important');
                            btn.style.setProperty('position', 'relative', 'important');
                            
                            const link = btn.querySelector('a');
                            if (link) {
                                link.style.setProperty('margin', '0', 'important');
                                link.style.setProperty('padding', '0', 'important');
                                link.style.setProperty('display', 'block', 'important');
                                link.style.setProperty('text-align', 'center', 'important');
                                link.style.setProperty('width', '100%', 'important');
                                link.style.setProperty('text-decoration', 'none', 'important');
                                link.style.setProperty('font-size', '1rem', 'important');
                            }
                            
                            const hex = btn.querySelector('.jkhive-hex');
                            if (hex) {
                                hex.style.setProperty('margin', '0 auto', 'important');
                                hex.style.setProperty('display', 'block', 'important');
                            }
                        });
                    }
                }
                
                // Guardar resolver y modal actual para poder actualizarlo
                this.currentModal = modal;
                this.resolveCurrent = (value) => {
                    resolve(value);
                    this.resolveCurrent = null;
                    this.currentModal = null;
                };
                
                // Mostrar modal inmediatamente después de agregarlo al DOM
                // Forzar reflow primero
                void modal.offsetHeight;
                
                // Agregar clases para mostrar el modal
                modal.classList.add('show', 'active');
                document.body.style.overflow = 'hidden';
                
                // Aplicar estilos inline directamente al modal para asegurar que se muestre
                modal.style.setProperty('display', 'flex', 'important');
                modal.style.setProperty('position', 'fixed', 'important');
                modal.style.setProperty('inset', '0', 'important');
                modal.style.setProperty('justify-content', 'center', 'important');
                modal.style.setProperty('align-items', 'center', 'important');
                modal.style.setProperty('opacity', '1', 'important');
                modal.style.setProperty('z-index', '10001', 'important');
                modal.style.setProperty('visibility', 'visible', 'important');
                
                // Asegurar que se muestre usando requestAnimationFrame para forzar el renderizado
                requestAnimationFrame(() => {
                    modal.classList.add('show', 'active');
                    // Forzar reflow para asegurar que el navegador procese el cambio
                    void modal.offsetHeight;
                    // Verificar que el modal esté visible
                    if (getComputedStyle(modal).display === 'none') {
                        modal.style.setProperty('display', 'flex', 'important');
                    }
                    // Aplicar estilos nuevamente para asegurar
                    modal.style.setProperty('display', 'flex', 'important');
                    modal.style.setProperty('opacity', '1', 'important');
                    modal.style.setProperty('visibility', 'visible', 'important');
                });
                
                // Buscar botón primario (Aceptar) para Enter
                const primaryButton = modal.querySelector('.jkhive-system-modal-btn[data-primary="true"]');
                
                // Event listeners para botones
                modal.querySelectorAll('.jkhive-system-modal-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const action = btn.dataset.action;
                        // Solo cerrar si no hay un callback personalizado
                        if (!this.onButtonClick) {
                            this.close(modal);
                            resolve(action === 'ok');
                            document.removeEventListener('keydown', enterHandler);
                            document.removeEventListener('keydown', escHandler);
                        } else {
                            // Llamar callback personalizado (para confirmaciones que se actualizan)
                            const callback = this.onButtonClick;
                            this.onButtonClick = null;
                            callback(action === 'ok', modal);
                        }
                    });
                });
                
                // Cerrar al hacer clic en overlay
                modal.querySelector('.jkhive-modal-overlay').addEventListener('click', () => {
                    if (!this.onButtonClick) {
                        // Sin callback personalizado: cerrar normalmente
                        this.close(modal);
                        resolve(false);
                        document.removeEventListener('keydown', enterHandler);
                        document.removeEventListener('keydown', escHandler);
                    } else {
                        // Con callback personalizado: llamar callback con confirmed = false (cancelar)
                        const callback = this.onButtonClick;
                        this.onButtonClick = null;
                        callback(false, modal);
                        // También resolver la promesa
                        resolve(false);
                        document.removeEventListener('keydown', enterHandler);
                        document.removeEventListener('keydown', escHandler);
                    }
                });
                
                // Enter para aceptar (botón primario)
                const enterHandler = (e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
                        e.preventDefault();
                        if (primaryButton) {
                            primaryButton.click();
                        }
                    }
                };
                
                // Cerrar con ESC
                const escHandler = (e) => {
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        this.close(modal);
                        resolve(false);
                        document.removeEventListener('keydown', enterHandler);
                        document.removeEventListener('keydown', escHandler);
                    }
                };
                
                document.addEventListener('keydown', enterHandler);
                document.addEventListener('keydown', escHandler);
            });
        }
        
        /**
         * Cerrar todos los modales del sistema
         */
        closeAllModals() {
            if (this.modalContainer) {
                const existingModals = this.modalContainer.querySelectorAll('.jkhive-modal');
                existingModals.forEach(modal => {
                    modal.classList.remove('show', 'active');
                    modal.style.display = 'none';
                    if (modal.parentNode) {
                        modal.parentNode.removeChild(modal);
                    }
                });
            }
            document.body.style.overflow = '';
        }
        
        /**
         * Cerrar modal
         */
        close(modal) {
            if (modal) {
                modal.classList.remove('show', 'active');
                modal.style.display = 'none';
                document.body.style.overflow = '';
                setTimeout(() => {
                    if (modal.parentNode) {
                        modal.parentNode.removeChild(modal);
                    }
                }, 300);
            }
        }
        
        /**
         * Escapar HTML
         */
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    };
}

// ========================================
// INSTANCIAS GLOBALES
// ========================================

// Crear instancia global de ModalManager solo si no existe
if (typeof modalManager === 'undefined') {
    window.modalManager = new ModalManager();
}

// Instancia global de SystemMessages - crear cuando el DOM esté listo
function initializeSystemMessages() {
    if (typeof window.SystemMessages !== 'undefined' && typeof systemMessages === 'undefined') {
        window.systemMessages = new window.SystemMessages();
    } else if (typeof window.SystemMessages === 'undefined') {
        // Si SystemMessages aún no está disponible, esperar un poco más
        setTimeout(initializeSystemMessages, 50);
    }
}

// Intentar inicializar inmediatamente si el DOM está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSystemMessages);
} else {
    // DOM ya está listo, inicializar inmediatamente
    initializeSystemMessages();
}

// ========================================
// FUNCIONES GLOBALES DE COMPATIBILIDAD
// ========================================

// Funciones globales para backward compatibility con ModalManager
function openBookModal(id) {
    if (typeof booksModalData !== 'undefined' && booksModalData[id]) {
        modalManager.openModal('book', id, booksModalData[id]);
    }
}

function openProductModal(id) {
    if (typeof productsData !== 'undefined' && productsData[id]) {
        modalManager.openModal('product', id, productsData[id]);
    }
}

function openServicesModal(id) {
    if (typeof servicesData !== 'undefined' && servicesData[id]) {
        modalManager.openModal('service', id, servicesData[id]);
    }
}

function openExperienceModal(id) {
    if (typeof experiencesData !== 'undefined' && experiencesData[id]) {
        modalManager.openModal('experience', id, experiencesData[id]);
    }
}

// Close functions (backward compatibility)
function closeBookModal() { 
    if (typeof modalManager !== 'undefined') {
        modalManager.closeModal(); 
    }
}

function closeProductModal() { 
    if (typeof modalManager !== 'undefined') {
        modalManager.closeModal(); 
    }
}

function closeServicesModal() { 
    if (typeof modalManager !== 'undefined') {
        modalManager.closeModal(); 
    }
}

function closePortfolioModal() { 
    if (typeof modalManager !== 'undefined') {
        modalManager.closeModal(); 
    }
}

function closeExperienceModal() { 
    if (typeof modalManager !== 'undefined') {
        modalManager.closeModal(); 
    }
}

