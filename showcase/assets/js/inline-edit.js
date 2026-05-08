/**
 * JK Lubs - Edición en línea en tablas
 * Mismo patrón visual que admin productos: .jkhive-inline-edit-wrap + control + .jkhive-inline-save-ticket (✓).
 */

class InlineEditor {
    constructor(config = {}) {
        this.items = config.items || [];
        this.apiEndpoint = config.apiEndpoint || '';
        this.fields = config.fields || [];
        this.itemsArrayName = config.itemsArrayName || 'items';
        this.itemIdField = config.itemIdField || 'id';
    }

    /**
     * Hacer campo editable
     */
    makeEditable(element, itemId, field, fieldType = 'text', options = {}) {
        if (element.classList.contains('editing')) return;

        const item = this.items.find(i => i[this.itemIdField] == itemId);
        if (!item) return;

        const originalHTML = element.innerHTML;
        element.dataset.originalHtml = originalHTML;
        element.classList.add('editing');

        let currentValue = item[field] || '';

        if (fieldType === 'select' && options.values) {
            this._createSelectEditor(element, itemId, field, currentValue, options);
        } else if (fieldType === 'number') {
            this._createNumberEditor(element, itemId, field, currentValue, options);
        } else {
            this._createTextEditor(element, itemId, field, currentValue, options);
        }
    }

    _createSaveTicket(ariaLabel) {
        const ticket = document.createElement('button');
        ticket.type = 'button';
        ticket.className = 'jkhive-inline-save-ticket';
        ticket.setAttribute('data-tooltip', 'Guardar');
        ticket.setAttribute('aria-label', ariaLabel || 'Guardar');
        ticket.innerHTML = '&#10003;';
        return ticket;
    }

    _createTextEditor(element, itemId, field, currentValue, options) {
        const input = document.createElement('input');
        input.type = options.inputType || 'text';
        input.className = 'jkhive-inline-input';
        input.value = currentValue;
        input.placeholder = options.placeholder || '';

        const wrap = document.createElement('div');
        wrap.className = 'jkhive-inline-edit-wrap';
        const ticket = this._createSaveTicket('Guardar cambios');

        let isHandlingKeydown = false;

        input.onblur = () => {
            setTimeout(() => {
                if (isHandlingKeydown) {
                    isHandlingKeydown = false;
                    return;
                }
                if (!element.classList.contains('editing')) return;
                const ae = document.activeElement;
                if (ae && element.contains(ae)) return;
                const newValue = input.value.trim();
                if (newValue !== currentValue) {
                    this.saveField(itemId, field, newValue, element);
                } else {
                    this.cancelEdit(element, itemId, field);
                }
            }, 150);
        };

        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                isHandlingKeydown = true;
                const newValue = input.value.trim();
                if (newValue !== currentValue) {
                    input.blur();
                    this.saveField(itemId, field, newValue, element);
                } else {
                    input.blur();
                    this.cancelEdit(element, itemId, field);
                }
            } else if (e.key === 'Escape') {
                isHandlingKeydown = true;
                input.blur();
                this.cancelEdit(element, itemId, field);
            }
        };

        ticket.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isHandlingKeydown = true;
            const newValue = input.value.trim();
            if (newValue !== currentValue) {
                this.saveField(itemId, field, newValue, element);
            } else {
                this.cancelEdit(element, itemId, field);
            }
            setTimeout(() => { isHandlingKeydown = false; }, 0);
        });

        element.innerHTML = '';
        wrap.appendChild(input);
        wrap.appendChild(ticket);
        element.appendChild(wrap);
        input.focus();
        input.select();
    }

    _createNumberEditor(element, itemId, field, currentValue, options) {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'jkhive-inline-input';
        input.step = options.step || '1';
        input.min = options.min !== undefined ? options.min : '';
        input.max = options.max !== undefined ? options.max : '';
        input.value = currentValue;

        const wrap = document.createElement('div');
        wrap.className = 'jkhive-inline-edit-wrap';
        const ticket = this._createSaveTicket('Guardar cambios');

        let isHandlingKeydown = false;

        const toNum = (v) => (options.isFloat ? parseFloat(v) : parseInt(v, 10));

        input.onblur = () => {
            setTimeout(() => {
                if (isHandlingKeydown) {
                    isHandlingKeydown = false;
                    return;
                }
                if (!element.classList.contains('editing')) return;
                const ae = document.activeElement;
                if (ae && element.contains(ae)) return;
                const newValue = input.value.trim();
                if (newValue !== currentValue) {
                    this.saveField(itemId, field, toNum(newValue), element);
                } else {
                    this.cancelEdit(element, itemId, field);
                }
            }, 150);
        };

        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                isHandlingKeydown = true;
                const newValue = input.value.trim();
                if (newValue !== currentValue) {
                    input.blur();
                    this.saveField(itemId, field, toNum(newValue), element);
                } else {
                    input.blur();
                    this.cancelEdit(element, itemId, field);
                }
            } else if (e.key === 'Escape') {
                isHandlingKeydown = true;
                input.blur();
                this.cancelEdit(element, itemId, field);
            }
        };

        ticket.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isHandlingKeydown = true;
            const newValue = input.value.trim();
            if (newValue !== currentValue) {
                this.saveField(itemId, field, toNum(newValue), element);
            } else {
                this.cancelEdit(element, itemId, field);
            }
            setTimeout(() => { isHandlingKeydown = false; }, 0);
        });

        element.innerHTML = '';
        wrap.appendChild(input);
        wrap.appendChild(ticket);
        element.appendChild(wrap);
        input.focus();
        input.select();
    }

    _createSelectEditor(element, itemId, field, currentValue, options) {
        const select = document.createElement('select');
        select.className = 'jkhive-inline-select';

        if (options.values && Array.isArray(options.values)) {
            options.values.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label || opt.value;
                option.selected = opt.value == currentValue;
                select.appendChild(option);
            });
        }

        const wrap = document.createElement('div');
        wrap.className = 'jkhive-inline-edit-wrap';
        const ticket = this._createSaveTicket('Guardar cambios');

        let isHandlingKeydown = false;

        select.onblur = () => {
            setTimeout(() => {
                if (isHandlingKeydown) {
                    isHandlingKeydown = false;
                    return;
                }
                if (!element.classList.contains('editing')) return;
                const ae = document.activeElement;
                if (ae && element.contains(ae)) return;
                const newValue = select.value;
                if (newValue !== currentValue) {
                    this.saveField(itemId, field, newValue, element);
                } else {
                    this.cancelEdit(element, itemId, field);
                }
            }, 150);
        };

        select.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                isHandlingKeydown = true;
                const newValue = select.value;
                if (newValue !== currentValue) {
                    select.blur();
                    this.saveField(itemId, field, newValue, element);
                } else {
                    select.blur();
                    this.cancelEdit(element, itemId, field);
                }
            } else if (e.key === 'Escape') {
                isHandlingKeydown = true;
                select.blur();
                this.cancelEdit(element, itemId, field);
            }
        };

        ticket.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isHandlingKeydown = true;
            const newValue = select.value;
            if (newValue !== currentValue) {
                this.saveField(itemId, field, newValue, element);
            } else {
                this.cancelEdit(element, itemId, field);
            }
            setTimeout(() => { isHandlingKeydown = false; }, 0);
        });

        element.innerHTML = '';
        wrap.appendChild(select);
        wrap.appendChild(ticket);
        element.appendChild(wrap);
        select.focus();
    }

    async saveField(itemId, field, value, element) {
        if (element.classList.contains('saving')) return;

        const item = this.items.find(i => i[this.itemIdField] == itemId);
        if (!item) return;

        element.classList.add('saving');

        const originalValue = item[field];
        if (String(value) === String(originalValue)) {
            element.classList.remove('editing', 'saving');
            if (element.dataset.originalHtml) {
                element.innerHTML = element.dataset.originalHtml;
                delete element.dataset.originalHtml;
            }
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
            const requestData = {
                csrf_token: csrfToken,
                id: itemId,
                [field]: value
            };

            const response = await fetch(`${this.apiEndpoint}?id=${itemId}`, {
                method: 'PUT',
                headers: {
                    'X-CSRF-Token': csrfToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData),
                credentials: 'same-origin'
            });

            const data = await response.json();

            if (data.success) {
                item[field] = value;
                element.classList.remove('editing', 'saving');

                this._updateDisplay(element, item, field, value);

                if (typeof systemMessages !== 'undefined') {
                    systemMessages.success('Campo actualizado exitosamente', 'Éxito');
                }

                if (this.onSave && typeof this.onSave === 'function') {
                    this.onSave(itemId, field, value);
                }
            } else {
                throw new Error(data.error || 'Error al guardar');
            }
        } catch (error) {
            element.classList.remove('editing', 'saving');
            this.cancelEdit(element, itemId, field);
            if (typeof systemMessages !== 'undefined') {
                systemMessages.error(error.message, 'Error al guardar');
            }
        }
    }

    _updateDisplay(element, item, field, value) {
        const fieldConfig = this.fields.find(f => f.name === field);

        if (fieldConfig && fieldConfig.displayFormat) {
            element.innerHTML = fieldConfig.displayFormat(item, value);
        } else {
            element.textContent = value || '-';
        }
    }

    cancelEdit(element, itemId, field) {
        element.classList.remove('editing', 'saving');

        if (element.dataset.originalHtml) {
            element.innerHTML = element.dataset.originalHtml;
            delete element.dataset.originalHtml;
            return;
        }

        const item = this.items.find(i => i[this.itemIdField] == itemId);
        if (item) {
            const fieldConfig = this.fields.find(f => f.name === field);
            if (fieldConfig && fieldConfig.displayFormat) {
                element.innerHTML = fieldConfig.displayFormat(item, item[field]);
            } else {
                element.textContent = item[field] || '-';
            }
        }
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.InlineEditor = InlineEditor;
