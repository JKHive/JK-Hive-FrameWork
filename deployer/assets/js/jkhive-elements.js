/**
 * Housesitting - Elementos UI (hex select, etc.)
 *
 * Funcionalidad JavaScript para elementos reutilizables
 * Individualizados, autónomos e inmunes a otros scripts
 *
 * ELEMENTOS INCLUIDOS:
 * - Hexagonal Select Component (HexSelect)
 */

/**
 * Hexagonal Select Component
 *
 * Componente personalizado de select con forma hexagonal
 * Reemplaza los select nativos con un dropdown hexagonal personalizado
 */

class HexSelect {
    constructor(selectElement) {
        this.originalSelect = selectElement;
        this.isOpen = false;
        this.selectedIndex = selectElement.selectedIndex;
        this.options = Array.from(selectElement.options);

        this.init();
    }

    init() {
        // Limpiar cualquier instancia anterior si existe
        const existingWrapper = this.originalSelect.parentNode.querySelector('.jkhive-hex-select-wrapper');
        if (existingWrapper) {
            existingWrapper.remove();
        }

        // Obtener estilos del select original para heredarlos
        const computedStyle = window.getComputedStyle(this.originalSelect);
        const maxWidth = this.originalSelect.style.maxWidth || computedStyle.maxWidth;
        const width = this.originalSelect.style.width || computedStyle.width;
        const margin = this.originalSelect.style.margin || computedStyle.margin;

        // Crear el wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'jkhive-hex-select-wrapper';
        this.wrapper.style.position = 'relative';

        // Heredar max-width, width y margin del select original
        if (maxWidth && maxWidth !== 'none' && maxWidth !== '0px') {
            this.wrapper.style.maxWidth = maxWidth;
        }
        if (width && width !== 'auto' && width !== '100%') {
            this.wrapper.style.width = width;
        }
        if (margin && margin !== '0px') {
            this.wrapper.style.margin = margin;
        }

        // Crear el botón del select
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.className = 'jkhive-hex-select-button';
        this.button.setAttribute('aria-haspopup', 'listbox');
        this.button.setAttribute('aria-expanded', 'false');
        this.button.disabled = this.originalSelect.disabled;
        this.updateButtonText();

        // Crear el dropdown
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'jkhive-hex-select-dropdown';
        this.dropdown.setAttribute('role', 'listbox');
        this.dropdown.style.display = 'none';

        // Limpiar cualquier contenido previo del dropdown (por si acaso)
        this.dropdown.innerHTML = '';

        // Crear las opciones directamente en el dropdown
        this.createOptionsElements();

        // Eventos
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!this.button.disabled) {
                this.toggle();
            }
        });

        // Cerrar al hacer clic fuera
        this.handleClickOutside = (e) => {
            // Si el dropdown está en el body (modal), verificar tanto el wrapper como el dropdown
            const isClickInWrapper = this.wrapper.contains(e.target);
            const isClickInDropdown = this.dropdown.contains(e.target);
            // También verificar si el clic fue en el botón
            const isClickInButton = this.button.contains(e.target);
            if (!isClickInWrapper && !isClickInDropdown && !isClickInButton) {
                this.close();
            }
        };
        document.addEventListener('click', this.handleClickOutside);

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Navegación con teclado
        this.button.addEventListener('keydown', (e) => {
            if (this.button.disabled) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.open();
                this.focusNext();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.open();
                this.focusPrevious();
            }
        });

        // Reemplazar el select original - OCULTAR con !important para evitar conflictos
        this.originalSelect.style.setProperty('display', 'none', 'important');
        this.originalSelect.setAttribute('aria-hidden', 'true');
        this.wrapper.appendChild(this.button);
        this.wrapper.appendChild(this.dropdown);
        this.originalSelect.parentNode.insertBefore(this.wrapper, this.originalSelect);
        this.originalSelect.parentNode.appendChild(this.originalSelect); // Mantener el select original para formularios

        // Verificar si estamos dentro de un modal y guardar referencia al modal
        this.isInModal = this.wrapper.closest('.jkhive-modal') !== null;
        if (this.isInModal) {
            this.modalContainer = this.wrapper.closest('.jkhive-modal');
        }
    }

    createOptionsElements() {
        // Limpiar opciones anteriores
        this.dropdown.innerHTML = '';
        this.optionElements = [];

        // Asegurar que options esté actualizado desde el select original
        this.options = Array.from(this.originalSelect.options);

        // Validar que hay opciones
        if (!this.options || this.options.length === 0) {
            console.warn('HexSelect: No hay opciones en el select original');
            return;
        }

        // Crear elementos de opciones
        this.options.forEach((option, index) => {
            if (option.value === '' || option.disabled) return; // Saltar opciones vacías o deshabilitadas

            const optionElement = document.createElement('div');
            optionElement.className = 'jkhive-hex-select-option';
            optionElement.setAttribute('role', 'option');
            optionElement.setAttribute('data-value', option.value);
            optionElement.setAttribute('data-index', index);
            optionElement.textContent = option.text;

            // No agregar clase 'selected' inicialmente - todas las opciones se ven igual
            // Solo marcaremos visualmente cuando se seleccione, pero sin destacar permanentemente

            optionElement.addEventListener('click', () => this.selectOption(index));
            this.dropdown.appendChild(optionElement);
            this.optionElements.push(optionElement);
        });

        // Validar que se crearon opciones
        if (this.optionElements.length === 0) {
            console.warn('HexSelect: No se crearon opciones válidas');
        }
    }

    updateButtonText() {
        // Actualizar índice seleccionado desde el select original
        this.selectedIndex = this.originalSelect.selectedIndex;
        // Asegurar que options esté actualizado
        this.options = Array.from(this.originalSelect.options);
        // Validar que el índice esté dentro del rango
        if (this.selectedIndex >= 0 && this.selectedIndex < this.options.length) {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption) {
                this.button.textContent = selectedOption.text;
                return;
            }
        }
        // Si no hay opción seleccionada válida
        this.button.textContent = this.originalSelect.getAttribute('placeholder') || 'Seleccionar...';
    }

    // Método para actualizar las opciones cuando se agregan dinámicamente
    refreshOptions() {
        this.createOptionsElements();
        // Actualizar el texto del botón
        this.updateButtonText();
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (this.isOpen || this.button.disabled) return;

        // Verificar que las opciones estén creadas ANTES de abrir
        if (!this.optionElements || this.optionElements.length === 0) {
            console.warn('HexSelect: No hay opciones, recreando...');
            this.createOptionsElements();
            // Si aún no hay opciones, no abrir
            if (!this.optionElements || this.optionElements.length === 0) {
                console.error('HexSelect: No se pudieron crear opciones');
                return;
            }
        }

        this.isOpen = true;
        this.button.setAttribute('aria-expanded', 'true');
        this.button.classList.add('open');
        this.wrapper.classList.add('open');

        // Asegurar que el dropdown esté en el wrapper (para modales y páginas normales)
        if (this.dropdown.parentNode !== this.wrapper) {
            this.wrapper.appendChild(this.dropdown);
        }

        // Mostrar el dropdown - el CSS maneja el posicionamiento
        this.dropdown.style.display = 'block';

        // Calcular altura máxima para dropdowns dentro de modales (solo desktop)
        requestAnimationFrame(() => {
            // Detectar si estamos en desktop (ancho >= 768px)
            const isDesktop = window.innerWidth >= 768;

            if (isDesktop) {
                // Buscar si estamos dentro de un modal
                const modal = this.wrapper.closest('.jkhive-modal');
                if (modal) {
                    const modalBody = modal.querySelector('.jkhive-modal-body');
                    const modalContent = modal.querySelector('.jkhive-modal-content');

                    if (modalBody && modalContent) {
                        // Obtener posiciones relativas al viewport
                        const buttonRect = this.button.getBoundingClientRect();
                        const modalBodyRect = modalBody.getBoundingClientRect();
                        const modalContentRect = modalContent.getBoundingClientRect();

                        // Calcular el espacio visible desde el botón hasta el final visible del modal body
                        // Usar el menor entre el final del modal body y el final del modal content visible
                        const modalBodyBottom = Math.min(modalBodyRect.bottom, modalContentRect.bottom);
                        const spaceBelow = modalBodyBottom - buttonRect.bottom;

                        // Espacio mínimo para mostrar al menos una opción (aprox 50px)
                        // Restar padding del dropdown (8px gap + 16px de margen seguro)
                        const maxHeight = Math.max(50, spaceBelow - 24);

                        // Aplicar altura máxima usando setProperty con !important para sobrescribir CSS
                        // Si el espacio es muy limitado, usar el calculado
                        // Si hay mucho espacio, limitar a 300px máximo
                        const finalMaxHeight = Math.min(maxHeight, 300);
                        this.dropdown.style.setProperty('max-height', `${finalMaxHeight}px`, 'important');
                        this.dropdown.style.setProperty('overflow-y', 'auto', 'important');

                        console.log('HexSelect - Espacio calculado:', {
                            spaceBelow,
                            maxHeight: finalMaxHeight,
                            buttonBottom: buttonRect.bottom,
                            modalBodyBottom,
                            modalContentBottom: modalContentRect.bottom
                        });
                    }
                }
            } else {
                // En mobile, no limitar la altura - remover el max-height forzado
                this.dropdown.style.removeProperty('max-height');
            }

            // Scroll a la opción seleccionada (si existe)
            if (this.optionElements && this.optionElements.length > 0) {
                // Asegurar que selectedIndex esté dentro del rango válido
                const validIndex = Math.max(0, Math.min(this.selectedIndex, this.optionElements.length - 1));
                if (this.optionElements[validIndex]) {
                    this.optionElements[validIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            }
        });

        // Con position: absolute, el dropdown se mueve automáticamente con el scroll del modal
        // No necesitamos listeners adicionales
    }

    close() {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.dropdown.style.display = 'none';
        this.dropdown.style.transform = '';

        this.button.setAttribute('aria-expanded', 'false');
        this.button.classList.remove('open');
        this.wrapper.classList.remove('open');
    }

    // Método para limpiar cuando se destruye la instancia
    destroy() {
        // Cerrar si está abierto
        if (this.isOpen) {
            this.close();
        }
        // Remover listeners
        if (this.handleClickOutside) {
            document.removeEventListener('click', this.handleClickOutside);
        }
        // No hay listeners adicionales que remover
        // Remover del DOM
        if (this.wrapper && this.wrapper.parentNode) {
            this.wrapper.parentNode.removeChild(this.wrapper);
        }
    }

    selectOption(index) {
        if (!this.optionElements || this.optionElements.length === 0) {
            console.error('HexSelect: optionElements no está inicializado');
            return;
        }

        this.selectedIndex = index;
        this.originalSelect.selectedIndex = index;

        // Actualizar UI - remover 'selected' de todas, no destacar ninguna permanentemente
        this.optionElements.forEach((el, i) => {
            el.classList.remove('selected');
        });

        this.updateButtonText();
        this.close();

        // Disparar evento change en el select original
        const changeEvent = new Event('change', { bubbles: true });
        this.originalSelect.dispatchEvent(changeEvent);
    }

    focusNext() {
        if (!this.optionElements || this.optionElements.length === 0) return;
        const currentIndex = this.optionElements.findIndex(el => el.classList.contains('focused') || el.classList.contains('selected'));
        const nextIndex = currentIndex < this.optionElements.length - 1 ? currentIndex + 1 : 0;
        this.focusOption(nextIndex);
    }

    focusPrevious() {
        if (!this.optionElements || this.optionElements.length === 0) return;
        const currentIndex = this.optionElements.findIndex(el => el.classList.contains('focused') || el.classList.contains('selected'));
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.optionElements.length - 1;
        this.focusOption(prevIndex);
    }

    focusOption(index) {
        if (!this.optionElements || this.optionElements.length === 0) return;
        this.optionElements.forEach((el, i) => {
            if (i === index) {
                el.classList.add('focused');
                el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                el.classList.remove('focused');
                el.classList.remove('selected'); // Asegurar que no quede marcado
            }
        });
    }

    getValue() {
        return this.originalSelect.value;
    }

    setValue(value) {
        // Asegurar que options esté actualizado
        this.options = Array.from(this.originalSelect.options);
        const index = this.options.findIndex(opt => opt.value === value);
        if (index !== -1) {
            // Asegurar que las opciones estén creadas antes de seleccionar
            if (!this.optionElements || this.optionElements.length === 0) {
                this.createOptionsElements();
            }
            this.selectOption(index);
        }
    }
}

// Inicializar todos los selects con clase jkhive-hex-select
document.addEventListener('DOMContentLoaded', function() {
    initAllHexSelects();
});

// Función para inicializar todos los hex-selects
function initAllHexSelects() {
    const selects = document.querySelectorAll('select.jkhive-hex-select');
    selects.forEach(select => {
        // Ignorar selects marcados para inicialización diferida
        if (select.dataset.hexSelectLazy === 'true') {
            return;
        }

        // Verificar que el select tenga opciones válidas (más de solo la opción vacía por defecto)
        const options = Array.from(select.options);
        const validOptions = options.filter(opt => opt.value !== '');
        if (validOptions.length === 0) {
            // No inicializar si no hay opciones válidas
            return;
        }

        // Verificar que el select esté visible (no display: none)
        const computedStyle = window.getComputedStyle(select);
        if (computedStyle.display === 'none' && !select.closest('.jkhive-modal[style*="display: none"]')) {
            // Si está oculto pero no es porque el modal está cerrado, puede que esté dentro de un modal cerrado
            // Intentar inicializarlo de todas formas
        }

        // Si ya existe una instancia, destruirla primero para evitar duplicados
        if (select.hexSelectInstance) {
            try {
                if (select.hexSelectInstance.destroy) {
                    select.hexSelectInstance.destroy();
                }
            } catch(e) {}
            const wrapper = select.parentNode.querySelector('.jkhive-hex-select-wrapper');
            if (wrapper) {
                wrapper.remove();
            }
            select.hexSelectInstance = null;
        }

        // Crear nueva instancia
        try {
            const instance = new HexSelect(select);
            select.hexSelectInstance = instance; // Guardar referencia
        } catch(e) {
            console.error('Error inicializando HexSelect:', e, select);
        }
    });
}

// Re-inicializar después de cambios dinámicos en el DOM
// IMPORTANTE: Ignorar cambios dentro de dropdowns ya inicializados para evitar duplicaciones
if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Ignorar cambios dentro de dropdowns ya inicializados
            if (mutation.target && mutation.target.closest) {
                const closestWrapper = mutation.target.closest('.jkhive-hex-select-wrapper');
                if (closestWrapper) {
                    // Este cambio está dentro de un hex-select ya inicializado, ignorarlo
                    return;
                }
            }

            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Ignorar si el nodo está dentro de un hex-select ya inicializado
                        if (node.closest && node.closest('.jkhive-hex-select-wrapper')) {
                            return;
                        }

                        // Buscar selects en el nodo y sus hijos
                        const newSelects = node.querySelectorAll ? node.querySelectorAll('select.jkhive-hex-select') : [];
                        newSelects.forEach(select => {
                            // Verificar que no esté dentro de un wrapper ya inicializado
                            if (!select.closest('.jkhive-hex-select-wrapper') && !select.hexSelectInstance) {
                                // Usar requestAnimationFrame para asegurar que el DOM esté completamente renderizado
                                requestAnimationFrame(() => {
                                    if (!select.hexSelectInstance) {
                                        const instance = new HexSelect(select);
                                        select.hexSelectInstance = instance;
                                    }
                                });
                            }
                        });
                        // Si el nodo mismo es un select
                        if (node.tagName === 'SELECT' && node.classList.contains('jkhive-hex-select') && !node.hexSelectInstance) {
                            requestAnimationFrame(() => {
                                if (!node.hexSelectInstance) {
                                    const instance = new HexSelect(node);
                                    node.hexSelectInstance = instance;
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Función para inicializar manualmente
window.initHexSelect = function(selectElement) {
    if (selectElement && selectElement.tagName === 'SELECT') {
        if (!selectElement.hexSelectInstance) {
            const instance = new HexSelect(selectElement);
            selectElement.hexSelectInstance = instance;
            return instance;
        }
        return selectElement.hexSelectInstance;
    }
    return null;
};

// Función para inicializar todos los hex-selects (disponible globalmente)
window.initAllHexSelects = initAllHexSelects;

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HexSelect;
}

/**
 * Hexagonal Gallery Select Component
 *
 * Componente selector hexagonal con galería expandible (estilo ebooks.html)
 * Reemplaza los select nativos con una galería hexagonal tipo panal
 */

class HexGallerySelect {
    constructor(selectElement) {
        this.originalSelect = selectElement;
        this.container = null;
        this.trigger = null;
        this.gallery = null;
        this.textDisplay = null;
        this.selectedValue = selectElement.value;
        // Extraer solo el número del texto (ej: "Pequeño (8/fila)" -> "8")
        const fullText = selectElement.options[selectElement.selectedIndex]?.text || 'Seleccionar...';
        this.selectedLabel = this.extractNumber(fullText);
        this.isSmall = selectElement.classList.contains('jkhive-hex-select-small');
        
        // Guardar referencia de la instancia en el elemento select
        selectElement.hexGallerySelectInstance = this;
        
        this.init();
    }
    
    extractNumber(text) {
        // Extraer el número del texto, ej: "Pequeño (8/fila)" -> "8"
        const match = text.match(/(\d+)/);
        return match ? match[1] : text;
    }

    init() {
        // Ocultar completamente el select original
        this.originalSelect.style.setProperty('display', 'none', 'important');
        this.originalSelect.style.setProperty('visibility', 'hidden', 'important');
        this.originalSelect.style.setProperty('opacity', '0', 'important');
        this.originalSelect.style.setProperty('position', 'absolute', 'important');
        this.originalSelect.style.setProperty('width', '0', 'important');
        this.originalSelect.style.setProperty('height', '0', 'important');
        this.originalSelect.style.setProperty('border', 'none', 'important');
        this.originalSelect.style.setProperty('background', 'transparent', 'important');
        this.originalSelect.setAttribute('aria-hidden', 'true');

        // Crear contenedor principal
        this.container = document.createElement('div');
        this.container.className = 'jkhive-hex-select' + (this.isSmall ? ' jkhive-hex-select-small' : '');
        this.container.id = this.originalSelect.id ? `${this.originalSelect.id}-hex-select` : null;
        // Agregar atributo de datos para facilitar la búsqueda
        if (this.originalSelect.id) {
            this.container.setAttribute('data-original-select-id', this.originalSelect.id);
        }
        if (this.originalSelect.name) {
            this.container.setAttribute('data-original-select-name', this.originalSelect.name);
        }

        // Crear trigger (hexágono inicial)
        this.trigger = document.createElement('div');
        this.trigger.className = 'jkhive-hex-select-trigger';
        this.trigger.id = this.originalSelect.id ? `${this.originalSelect.id}-hex-trigger` : null;
        
        const hex = document.createElement('div');
        hex.className = 'jkhive-hex-select-hex';
        
        const content = document.createElement('div');
        content.className = 'jkhive-hex-select-content';
        
        this.textDisplay = document.createElement('span');
        this.textDisplay.className = 'jkhive-hex-select-text';
        this.textDisplay.textContent = this.selectedLabel;
        
        content.appendChild(this.textDisplay);
        hex.appendChild(content);
        this.trigger.appendChild(hex);

        // Crear dropdown (galería hexagonal)
        const dropdown = document.createElement('div');
        dropdown.className = 'jkhive-hex-select-dropdown';
        dropdown.id = this.originalSelect.id ? `${this.originalSelect.id}-hex-dropdown` : null;
        
        this.gallery = document.createElement('div');
        this.gallery.className = 'jkhive-hex-select-gallery';
        this.gallery.id = this.originalSelect.id ? `${this.originalSelect.id}-hex-gallery` : null;
        
        dropdown.appendChild(this.gallery);
        
        this.container.appendChild(this.trigger);
        this.container.appendChild(dropdown);

        // Insertar después del select original
        this.originalSelect.parentNode.insertBefore(this.container, this.originalSelect.nextSibling);

        // Asegurar que la referencia de la instancia esté guardada
        this.originalSelect.hexGallerySelectInstance = this;

        // Inicializar eventos
        this.setupEvents();
        
        // Renderizar opciones
        this.renderOptions();
        
        // Aplicar estado inicial disabled si es necesario
        if (this.originalSelect.disabled) {
            this.updateDisabledState();
        }
    }

    setupEvents() {
        // Click en el trigger para toggle
        this.trigger.addEventListener('click', (e) => {
            // Verificar estado disabled antes de procesar el click
            this.updateDisabledState();
            
            // No abrir si el select está deshabilitado
            if (this.originalSelect.disabled || this.container.classList.contains('disabled')) {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                return;
            }
            
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();
            
            const wasOpen = this.container.classList.contains('open');
            
            if (wasOpen) {
                // Si está abierto y se hace clic en el toggle, seleccionar el mismo item y bloquear
                const currentValue = this.originalSelect.value;
                
                // Cerrar primero
                this.close();
                
                // BLOQUEAR INMEDIATAMENTE
                this.originalSelect.disabled = true;
                this.originalSelect.setAttribute('disabled', 'disabled');
                
                // Aplicar estilos de disabled INMEDIATAMENTE
                this.container.classList.add('disabled');
                if (this.trigger) {
                    this.trigger.style.cssText = 'opacity: 0.5 !important; cursor: not-allowed !important; pointer-events: none !important;';
                }
                if (this.container.querySelector('.jkhive-hex-select-hex')) {
                    this.container.querySelector('.jkhive-hex-select-hex').style.cssText = 'opacity: 0.5 !important; pointer-events: none !important; cursor: not-allowed !important;';
                }
                
                // Forzar reflow
                void this.container.offsetWidth;
                
                // Actualizar estado
                this.updateDisabledState();
                
                // Disparar evento change para que el código externo muestre el botón refresh
                const changeEvent = new Event('change', { bubbles: true, cancelable: true });
                this.originalSelect.dispatchEvent(changeEvent);
            } else {
                this.open();
            }
        });

        // Click en los items de la galería
        this.gallery.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();
            
            const clickedItem = e.target.closest('.jkhive-hex-select-item');
            if (clickedItem) {
                const value = clickedItem.getAttribute('data-value');
                if (value !== null) {
                    // BLOQUEAR INMEDIATAMENTE antes de seleccionar
                    this.originalSelect.disabled = true;
                    this.originalSelect.setAttribute('disabled', 'disabled');
                    
                    // Aplicar estilos de disabled INMEDIATAMENTE
                    this.container.classList.add('disabled');
                    if (this.trigger) {
                        this.trigger.style.cssText = 'opacity: 0.5 !important; cursor: not-allowed !important; pointer-events: none !important;';
                    }
                    if (this.container.querySelector('.jkhive-hex-select-hex')) {
                        this.container.querySelector('.jkhive-hex-select-hex').style.cssText = 'opacity: 0.5 !important; pointer-events: none !important; cursor: not-allowed !important;';
                    }
                    
                    // Forzar reflow
                    void this.container.offsetWidth;
                    
                    // Ahora seleccionar la opción
                    this.selectOption(value);
                }
            }
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target) && !this.trigger.contains(e.target)) {
                if (this.container.classList.contains('open')) {
                    this.close();
                }
            }
        }, true);

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.container.classList.contains('open')) {
                this.close();
            }
        });

        // Sincronizar cambios en el select original
        this.originalSelect.addEventListener('change', () => {
            this.selectedValue = this.originalSelect.value;
            const fullText = this.originalSelect.options[this.originalSelect.selectedIndex]?.text || 'Seleccionar...';
            this.selectedLabel = this.extractNumber(fullText);
            this.textDisplay.textContent = this.selectedLabel;
            this.renderOptions();
        });
        
        // Función para actualizar el estado disabled
        const updateDisabledState = () => {
            const isDisabled = this.originalSelect.disabled || this.originalSelect.hasAttribute('disabled');
            if (isDisabled) {
                this.container.classList.add('disabled');
                if (this.trigger) {
                    this.trigger.style.setProperty('opacity', '0.5', 'important');
                    this.trigger.style.setProperty('cursor', 'not-allowed', 'important');
                    this.trigger.style.setProperty('pointer-events', 'none', 'important');
                }
                if (this.container.classList.contains('open')) {
                    this.close();
                }
            } else {
                this.container.classList.remove('disabled');
                if (this.trigger) {
                    this.trigger.style.removeProperty('opacity');
                    this.trigger.style.removeProperty('cursor');
                    this.trigger.style.removeProperty('pointer-events');
                }
            }
        };
        
        // Observar cambios en el atributo disabled
        const observer = new MutationObserver(() => {
            updateDisabledState();
        });
        
        observer.observe(this.originalSelect, {
            attributes: true,
            attributeFilter: ['disabled']
        });
        
        // Verificar periódicamente el estado disabled (fallback más agresivo)
        // PERO solo si NO está deshabilitado (para evitar interferencias)
        const checkInterval = setInterval(() => {
            // Si ya está deshabilitado, NO hacer nada (evitar interferencias)
            if (this.container.classList.contains('disabled')) {
                return;
            }
            
            // Solo actualizar si el estado realmente cambió Y no está deshabilitado
            const currentDisabled = this.originalSelect.disabled || this.originalSelect.hasAttribute('disabled');
            const containerHasDisabled = this.container.classList.contains('disabled');
            
            // Si el estado cambió, actualizar
            if (currentDisabled !== containerHasDisabled) {
                updateDisabledState();
            }
        }, 50); // Verificar cada 50ms para respuesta más rápida
        
        // Guardar el intervalo para poder limpiarlo si es necesario
        this.disabledCheckInterval = checkInterval;
        
        // Guardar la función para poder llamarla externamente
        this.updateDisabledState = updateDisabledState;
        
        // Método público para forzar deshabilitación
        this.forceDisable = () => {
            this.originalSelect.disabled = true;
            this.originalSelect.setAttribute('disabled', 'disabled');
            updateDisabledState();
        };
        
        // Aplicar estado inicial
        updateDisabledState();
    }

    open() {
        if (this.container.classList.contains('open')) return;
        
        // Verificar estado disabled ANTES de cualquier otra cosa
        const isDisabled = this.originalSelect.disabled || this.originalSelect.hasAttribute('disabled') || this.container.classList.contains('disabled');
        
        if (isDisabled) {
            // Forzar actualización del estado
            this.updateDisabledState();
            return;
        }
        
        // Asegurar que las opciones estén renderizadas
        if (this.gallery.children.length === 0) {
            this.renderOptions();
        }
        
        // Calcular dimensiones ANTES de abrir
        if (this.calculateDropdownDimensions) {
            this.calculateDropdownDimensions();
        }
        
        // Agregar clase 'open' - esto activará el CSS que cambia el color a cyan
        this.container.classList.add('open');
        void this.container.offsetWidth; // Forzar reflow para que el CSS se aplique
        
        // Asegurar que los items se muestren y estén correctamente posicionados
        requestAnimationFrame(() => {
            const allItems = this.gallery.querySelectorAll('.jkhive-hex-select-item');
            if (allItems.length === 0) {
                console.warn('HexGallerySelect: No hay items para mostrar');
                return;
            }
            
            allItems.forEach((item) => {
                // Asegurar que las posiciones estén establecidas
                const left = item.style.left || item.getAttribute('data-left') || '0px';
                const top = item.style.top || item.getAttribute('data-top') || '0px';
                
                item.style.setProperty('left', left, 'important');
                item.style.setProperty('top', top, 'important');
                item.style.setProperty('opacity', '1', 'important');
                item.style.setProperty('visibility', 'visible', 'important');
                item.style.setProperty('display', 'block', 'important');
                item.style.setProperty('transform', 'scale(1) rotateY(0deg) translateZ(0)', 'important');
                item.style.setProperty('pointer-events', 'all', 'important');
                item.style.setProperty('position', 'absolute', 'important');
            });
            
            // Recalcular dimensiones después de mostrar items
            if (this.calculateDropdownDimensions) {
                this.calculateDropdownDimensions();
            }
        });
    }

    close() {
        if (!this.container.classList.contains('open')) return;
        
        // Remover clase 'open' - esto activará el CSS :not(.open) que restaura el color amarillo miel
        this.container.classList.remove('open');
        
        // Forzar reflow para que el CSS :not(.open) se aplique inmediatamente
        void this.container.offsetWidth;
        
        // Ocultar items
        const allItems = this.gallery.querySelectorAll('.jkhive-hex-select-item');
        allItems.forEach(item => {
            item.style.setProperty('opacity', '0', 'important');
            item.style.setProperty('visibility', 'hidden', 'important');
            item.style.setProperty('pointer-events', 'none', 'important');
            item.style.setProperty('transform', 'scale(0) translateZ(0)', 'important');
        });
        
        // Ocultar dropdown
        const dropdown = this.container.querySelector('.jkhive-hex-select-dropdown');
        if (dropdown) {
            dropdown.style.setProperty('width', '0', 'important');
            dropdown.style.setProperty('height', this.isSmall ? 'calc(45px * 1.1547)' : 'calc(60px * 1.1547)', 'important');
            dropdown.style.setProperty('pointer-events', 'none', 'important');
            dropdown.style.setProperty('overflow', 'hidden', 'important');
        }
    }

    selectOption(value) {
        // Cerrar PRIMERO (esto restaurará el color amarillo miel)
        this.close();
        
        // Actualizar select original
        this.originalSelect.value = value;
        this.selectedValue = value;
        const fullText = Array.from(this.originalSelect.options).find(opt => opt.value === value)?.text || 'Seleccionar...';
        this.selectedLabel = this.extractNumber(fullText);
        this.textDisplay.textContent = this.selectedLabel;
        
        // Re-renderizar opciones
        this.renderOptions();
        
        // BLOQUEAR el select INMEDIATAMENTE - PRIMERO
        this.originalSelect.disabled = true;
        this.originalSelect.setAttribute('disabled', 'disabled');
        
        // Forzar reflow ANTES de aplicar estilos
        void this.originalSelect.offsetWidth;
        
        // Forzar actualización del estado disabled del componente hexagonal INMEDIATAMENTE
        // Aplicar estilos directamente con máxima prioridad
        this.container.classList.add('disabled');
        
        const trigger = this.trigger;
        const hex = this.container.querySelector('.jkhive-hex-select-hex');
        
        if (trigger) {
            trigger.style.cssText = 'opacity: 0.5 !important; cursor: not-allowed !important; pointer-events: none !important;';
        }
        
        if (hex) {
            hex.style.cssText = 'opacity: 0.5 !important; pointer-events: none !important; cursor: not-allowed !important;';
        }
        
        // Forzar reflow después de aplicar estilos
        void this.container.offsetWidth;
        void this.trigger?.offsetWidth;
        
        // Llamar a updateDisabledState para sincronización (pero los estilos ya están aplicados)
        this.updateDisabledState();
        
        // Disparar evento change para que el código externo pueda manejar el bloqueo
        // (mostrar botón refresh, etc.) - SIN setTimeout para que sea inmediato
        const changeEvent = new Event('change', { bubbles: true, cancelable: true });
        this.originalSelect.dispatchEvent(changeEvent);
    }

    renderOptions() {
        this.gallery.innerHTML = '';
        
        const options = Array.from(this.originalSelect.options);
        const validOptions = options.filter(opt => opt.value !== '' && opt.value !== this.selectedValue);
        
        if (validOptions.length === 0) {
            return;
        }

        // Constantes para el cálculo de posiciones - Responsive
        const getHexWidth = () => {
            if (this.isSmall) {
                if (window.innerWidth <= 576) return 35;
                if (window.innerWidth <= 768) return 40;
                return 45;
            }
            if (window.innerWidth <= 576) return 40;
            if (window.innerWidth <= 768) return 45;
            if (window.innerWidth <= 992) return 50;
            return 60;
        };
        
        const hexWidth = getHexWidth();
        const hexHeight = hexWidth * 1.1547;
        const gap = 1.5; // Gap de 1.5px entre items y entre toggle y primer item
        
        // Para solo 3 opciones, mostrarlas en una sola fila horizontal
        let currentIndex = 0;
        let globalAnimationIndex = 0;
        
        validOptions.forEach((option, index) => {
            const item = document.createElement('div');
            item.className = 'jkhive-hex-select-item';
            item.setAttribute('data-value', option.value);
            item.setAttribute('data-index', index);
            
            // Posición horizontal simple: una fila
            const left = (hexWidth + gap) * index;
            const top = 0;
            
                // Extraer solo el número del texto de la opción
                const optionNumber = this.extractNumber(option.text);
                
                item.innerHTML = `
                    <div class="jkhive-hex-select-item-hex">
                        <div class="jkhive-hex-select-item-content">
                            <span class="jkhive-hex-select-item-text">${this.escapeHtml(optionNumber)}</span>
                        </div>
                    </div>
                `;
            
            item.style.setProperty('left', `${left}px`, 'important');
            item.style.setProperty('top', `${top}px`, 'important');
            item.style.setProperty('position', 'absolute', 'important');
            item.setAttribute('data-left', `${left}px`);
            item.setAttribute('data-top', `${top}px`);
            item.style.animationDelay = `${globalAnimationIndex * 0.05}s`;
            item.style.zIndex = `${10 + globalAnimationIndex}`;
            
            this.gallery.appendChild(item);
            globalAnimationIndex++;
        });
        
        // Función para calcular dimensiones del dropdown
        this.calculateDropdownDimensions = () => {
            const allItems = this.gallery.querySelectorAll('.jkhive-hex-select-item');
            if (allItems.length === 0) return;
            
            let maxRight = 0;
            let maxBottom = 0;
            
            allItems.forEach((item) => {
                const left = parseFloat(item.style.left) || 0;
                const top = parseFloat(item.style.top) || 0;
                const right = left + hexWidth;
                const bottom = top + hexHeight;
                
                if (right > maxRight) maxRight = right;
                if (bottom > maxBottom) maxBottom = bottom;
            });
            
            if (maxRight > 0 && maxBottom > 0) {
                const dropdown = this.container.querySelector('.jkhive-hex-select-dropdown');
                if (dropdown) {
                    // Ancho mínimo para mostrar todas las opciones
                    const finalWidth = Math.max(maxRight + 20, 200);
                    const finalHeight = maxBottom + 20;
                    
                    dropdown.style.setProperty('width', `${finalWidth}px`, 'important');
                    dropdown.style.setProperty('min-width', `${finalWidth}px`, 'important');
                    dropdown.style.setProperty('height', `${finalHeight}px`, 'important');
                    dropdown.style.setProperty('min-height', `${finalHeight}px`, 'important');
                    dropdown.style.setProperty('overflow', 'visible', 'important');
                    dropdown.style.setProperty('overflow-x', 'visible', 'important');
                    dropdown.style.setProperty('overflow-y', 'visible', 'important');
                    dropdown.style.setProperty('-ms-overflow-style', 'none', 'important');
                    dropdown.style.setProperty('scrollbar-width', 'none', 'important');
                    
                    this.gallery.style.setProperty('width', `${finalWidth}px`, 'important');
                    this.gallery.style.setProperty('height', `${finalHeight}px`, 'important');
                    this.gallery.style.setProperty('overflow', 'visible', 'important');
                    this.gallery.style.setProperty('overflow-x', 'visible', 'important');
                    this.gallery.style.setProperty('overflow-y', 'visible', 'important');
                }
            }
        };
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.originalSelect.style.removeProperty('display');
        this.originalSelect.removeAttribute('aria-hidden');
    }
}

// Inicializar todos los selects con clase jkhive-hex-select-gallery
function initAllHexGallerySelects() {
    const selects = document.querySelectorAll('select.jkhive-hex-select-gallery');
    selects.forEach(select => {
        // Verificar que el select tenga opciones válidas
        const options = Array.from(select.options);
        const validOptions = options.filter(opt => opt.value !== '');
        if (validOptions.length === 0) {
            return;
        }

        if (select.hexGallerySelectInstance) {
            try {
                if (select.hexGallerySelectInstance.destroy) {
                    select.hexGallerySelectInstance.destroy();
                }
            } catch(e) {
                console.error('Error destruyendo instancia anterior:', e);
            }
            select.hexGallerySelectInstance = null;
        }

        try {
            const instance = new HexGallerySelect(select);
            select.hexGallerySelectInstance = instance;
        } catch(e) {
            console.error('Error inicializando HexGallerySelect:', e, select);
        }
    });
}

// Inicializar al cargar el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initAllHexGallerySelects();
    });
} else {
    // DOM ya está listo
    initAllHexGallerySelects();
}

// Re-inicializar después de cambios dinámicos en el DOM
if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        const newSelects = node.querySelectorAll ? node.querySelectorAll('select.jkhive-hex-select-gallery') : [];
                        newSelects.forEach(select => {
                            if (!select.hexGallerySelectInstance) {
                                requestAnimationFrame(() => {
                                    if (!select.hexGallerySelectInstance) {
                                        const instance = new HexGallerySelect(select);
                                        select.hexGallerySelectInstance = instance;
                                    }
                                });
                            }
                        });
                        if (node.tagName === 'SELECT' && node.classList.contains('jkhive-hex-select-gallery') && !node.hexGallerySelectInstance) {
                            requestAnimationFrame(() => {
                                if (!node.hexGallerySelectInstance) {
                                    const instance = new HexGallerySelect(node);
                                    node.hexGallerySelectInstance = instance;
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Función para inicializar manualmente
window.initHexGallerySelect = function(selectElement) {
    if (selectElement && selectElement.tagName === 'SELECT') {
        if (!selectElement.hexGallerySelectInstance) {
            const instance = new HexGallerySelect(selectElement);
            selectElement.hexGallerySelectInstance = instance;
            return instance;
        }
        return selectElement.hexGallerySelectInstance;
    }
    return null;
};

// Función para inicializar todos los hex-gallery-selects (disponible globalmente)
window.initAllHexGallerySelects = initAllHexGallerySelects;

