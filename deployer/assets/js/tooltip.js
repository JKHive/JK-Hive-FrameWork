/**
 * Housesitting - Tooltip (sigue al cursor)
 */

(function() {
    'use strict';

    let tooltipElement = null;
    let currentTarget = null;
    /** Si true, el tooltip se muestra a la izquierda del elemento (para íconos en el borde derecho del navbar) */
    let useTooltipLeft = false;

    /**
     * Crea el elemento tooltip
     */
    function createTooltipElement() {
        if (tooltipElement) return tooltipElement;
        
        tooltipElement = document.createElement('div');
        tooltipElement.className = 'jkhive-tooltip-following';
        tooltipElement.setAttribute('role', 'tooltip');
        tooltipElement.style.cssText = `
            opacity: 0;
            transform: translate(0, 0);
            left: 0;
            top: 0;
        `;
        document.body.appendChild(tooltipElement);
        return tooltipElement;
    }

    /**
     * Muestra el tooltip
     */
    function showTooltip(event, text, target) {
        if (!tooltipElement) {
            createTooltipElement();
        }
        
        tooltipElement.textContent = text;
        tooltipElement.style.opacity = '1';
        currentTarget = target;
        var modal = target.closest && target.closest('.jkhive-modal');
        if (modal) {
            // Dentro de un modal: en mobile el tooltip debe verse seguro. Lo metemos dentro del modal con z-index alto para que quede por encima del contenido.
            tooltipElement.style.zIndex = '99999';
            if (tooltipElement.parentNode !== modal) {
                modal.appendChild(tooltipElement);
            }
        } else {
            tooltipElement.style.zIndex = '';
            if (tooltipElement.parentNode !== document.body) {
                document.body.appendChild(tooltipElement);
            }
        }
        // Buscar: nunca tooltip a la izquierda (en mobile y desktop evita superposición con el cuadro expandible)
        var isSearch = target.id === 'searchIcon' || (target.closest && target.closest('#searchWrapper'));
        if (isSearch) {
            useTooltipLeft = false;
        } else {
            var margin = getTooltipRightMargin(target);
            var rect = target.getBoundingClientRect();
            useTooltipLeft = (rect.right > window.innerWidth - margin);
        }
        updateTooltipPosition(event);
    }

    /**
     * Devuelve el margen en px desde el borde derecho del viewport para activar "tooltip a la izquierda".
     * Si el tercer ícono desde la derecha en el navbar es el de Buscar, usamos margen reducido (solo los 2 más a la derecha);
     * si no, margen ampliado (tooltips largos no se salen).
     */
    function getTooltipRightMargin(target) {
        var navbarRight = document.querySelector('.jkhive-navbar-right');
        if (!navbarRight || !navbarRight.contains(target)) {
            return 240;
        }
        var children = Array.prototype.slice.call(navbarRight.children);
        if (children.length < 3) return 240;
        var thirdFromRight = children[children.length - 3];
        var isSearchThird = thirdFromRight && (
            thirdFromRight.id === 'searchWrapper' ||
            (thirdFromRight.querySelector && thirdFromRight.querySelector('#searchIcon'))
        );
        return isSearchThird ? 120 : 240;
    }

    /**
     * Oculta el tooltip
     */
    function hideTooltip() {
        if (tooltipElement) {
            tooltipElement.style.opacity = '0';
            tooltipElement.style.zIndex = '';
        }
        currentTarget = null;
        useTooltipLeft = false;
    }

    /**
     * Actualiza la posición del tooltip. Siempre usa la posición del cursor (event) para que siga al mouse.
     * - useTooltipLeft = false: tooltip abajo-derecha del cursor (como siempre).
     * - useTooltipLeft = true: mismo comportamiento (sigue al cursor), pero se dibuja a la izquierda
     *   del cursor (abajo-izquierda) para no salirse por la derecha. Misma offset vertical que el derecho.
     */
    function updateTooltipPosition(event) {
        if (!tooltipElement) return;
        
        var offset = 10;
        var x = event.clientX;
        var y = event.clientY;

        if (useTooltipLeft) {
            var tw = tooltipElement.offsetWidth;
            var th = tooltipElement.offsetHeight;
            // Misma lógica que el derecho pero espejado: abajo del cursor (y + offset), a la izquierda del cursor (x - tw - offset)
            var left = x - tw - offset;
            var top = y + offset;
            if (left < 8) left = 8;
            if (top + th > window.innerHeight - 8) top = window.innerHeight - th - 8;
            if (top < 8) top = 8;
            tooltipElement.style.left = left + 'px';
            tooltipElement.style.top = top + 'px';
        } else {
            tooltipElement.style.left = (x + offset) + 'px';
            tooltipElement.style.top = (y + offset) + 'px';
        }
    }

    /**
     * Maneja el mouseenter en elementos con data-tooltip
     */
    function handleMouseEnter(event) {
        const target = event.target.closest('[data-tooltip]');
        if (target && target.dataset.tooltip && target !== currentTarget) {
            showTooltip(event, target.dataset.tooltip, target);
        }
    }

    /**
     * Mousemove: solo actualizar posición del tooltip; si el cursor está sobre otro [data-tooltip], actualizar texto.
     * Ocultar solo en mouseleave (sin timers ni elementFromPoint para hide).
     */
    function handleMouseMove(event) {
        if (!currentTarget || !tooltipElement || tooltipElement.style.opacity !== '1') return;
        var under = document.elementFromPoint(event.clientX, event.clientY);
        var next = under ? under.closest('[data-tooltip]') : null;
        if (next && next.dataset.tooltip && next !== currentTarget) {
            showTooltip(event, next.dataset.tooltip, next);
        }
        updateTooltipPosition(event);
    }

    /**
     * Inicializa los tooltips en elementos con data-tooltip
     */
    function initTooltips() {
        // Función para agregar listeners a un elemento
        function attachListeners(element) {
            if (element.dataset.tooltipInitialized) return;
            element.dataset.tooltipInitialized = 'true';
            
            element.addEventListener('mouseenter', function(e) {
                if (element.dataset.tooltip) {
                    showTooltip(e, element.dataset.tooltip, element);
                }
            });
            
            element.addEventListener('mouseleave', function(e) {
                // Ocultar tooltip si el mouse sale del elemento y no entra a otro con tooltip
                const relatedTarget = e.relatedTarget;
                if (element === currentTarget) {
                    if (!relatedTarget || !relatedTarget.closest('[data-tooltip]')) {
                        hideTooltip();
                    }
                }
            });
            // Mobile: mostrar tooltip al tocar. Captura (capture: true) para que dispare aunque el dedo toque un hijo (button, icono).
            element.addEventListener('touchstart', function(e) {
                if (element.dataset.tooltip && e.touches && e.touches[0]) {
                    showTooltip({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }, element.dataset.tooltip, element);
                }
            }, { passive: true, capture: true });
        }

        // Inicializar elementos existentes
        document.querySelectorAll('[data-tooltip]').forEach(attachListeners);

        // Observer para elementos dinámicos
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Verificar el nodo mismo
                        if (node.hasAttribute && node.hasAttribute('data-tooltip')) {
                            attachListeners(node);
                        }
                        // Verificar hijos
                        const tooltipElements = node.querySelectorAll ? node.querySelectorAll('[data-tooltip]') : [];
                        tooltipElements.forEach(attachListeners);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        document.addEventListener('mousemove', handleMouseMove);

        // Mobile: touch/click fuera del elemento cierra el tooltip (mouseleave no siempre se dispara al tocar fuera)
        function handleDocumentPointer(e) {
            if (!currentTarget || !tooltipElement || tooltipElement.style.opacity !== '1') return;
            var t = e.target;
            if (t && !currentTarget.contains(t) && tooltipElement !== t && !tooltipElement.contains(t)) {
                hideTooltip();
            }
        }
        document.addEventListener('touchstart', handleDocumentPointer, { passive: true });
        document.addEventListener('click', handleDocumentPointer);
    }

    /**
     * Enlaza tooltips estilo JK Hive a elementos con [data-tooltip] dentro de un contenedor
     * (p. ej. toast creado dinámicamente). Usar después de añadir el nodo al DOM.
     */
    window.JKHiveTooltipAttach = function(container) {
        if (!container || !container.querySelectorAll) return;
        var list = container.querySelectorAll('[data-tooltip]');
        for (var i = 0; i < list.length; i++) {
            var el = list[i];
            if (el.dataset.tooltipInitialized === 'true') continue;
            el.dataset.tooltipInitialized = 'true';
            el.addEventListener('mouseenter', function(e) {
                if (this.dataset.tooltip) showTooltip(e, this.dataset.tooltip, this);
            });
            el.addEventListener('mouseleave', function(e) {
                if (this === currentTarget && (!e.relatedTarget || !e.relatedTarget.closest('[data-tooltip]'))) hideTooltip();
            });
            el.addEventListener('touchstart', function(e) {
                if (this.dataset.tooltip && e.touches && e.touches[0]) {
                    showTooltip({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }, this.dataset.tooltip, this);
                }
            }, { passive: true, capture: true });
        }
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTooltips);
    } else {
        initTooltips();
    }

})();









