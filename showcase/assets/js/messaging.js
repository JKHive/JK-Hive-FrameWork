/**
 * JK Hive - Messaging System
 * 
 * Sistema de mensajería simple y funcional tipo Gmail
 * Versión 3.0 - Reescrito desde cero
 */

class MessagingSystem {
    constructor() {
        this.currentFolder = 'inbox';
        this.currentMessage = null;
        this.folders = [];
        this.messages = [];
        this.selectedMessages = new Set();
        if (typeof HostsConfig !== 'undefined' && HostsConfig.getApiMessagesBase) {
            const b = HostsConfig.getApiMessagesBase().replace(/\/$/, '');
            this.apiBase = b + '/index.php';
            this.apiMessagesRoot = b;
        } else {
            this.apiBase = 'api/messages/index.php';
            this.apiMessagesRoot = '';
        }
        this.lastMessageCount = 0; // Rastrear último conteo de mensajes
        this.init();
    }

    /** URL absoluta o relativa al mismo origen para adjuntos */
    downloadUrl(attachmentId) {
        const id = encodeURIComponent(attachmentId);
        if (this.apiMessagesRoot) {
            return this.apiMessagesRoot + '/download.php?id=' + id;
        }
        return 'api/messages/download.php?id=' + id;
    }
    
    async init() {
        await this.loadFolders();
        await this.loadMessages(this.currentFolder);
        this.setupEventListeners();
        
        // NO hacer polling constante de mensajes
        // Solo actualizar cuando las notificaciones detecten nuevos mensajes
        this.setupNotificationListener();
        
        // No necesitamos visibilitychange para polling de mensajes
        // ya que solo actualizamos cuando hay notificaciones nuevas
    }
    
    setupNotificationListener() {
        // Rastrear el último conteo de mensajes para detectar cambios
        // Inicializar con el conteo actual si está disponible
        if (typeof window.notificationsSystem !== 'undefined' && window.notificationsSystem) {
            this.lastMessageCount = window.notificationsSystem.counts.messages || 0;
        }
        
        // Verificar cambios en notificaciones periódicamente
        // Solo actualizar la lista si hay un cambio en el conteo de mensajes
        const checkForNewMessages = () => {
            if (typeof window.notificationsSystem !== 'undefined' && window.notificationsSystem) {
                const currentCount = window.notificationsSystem.counts.messages || 0;
                
                // Solo actualizar si:
                // 1. El conteo cambió (hay nuevos mensajes o se leyeron mensajes)
                // 2. Estamos en la bandeja de entrada
                // 3. No hay un mensaje abierto
                if (currentCount !== this.lastMessageCount && this.currentFolder === 'inbox' && !this.currentMessage) {
                    // preserveSelection = true para mantener los checks seleccionados
                    this.loadMessages('inbox', true).catch(e => {
                        console.error('Error recargando mensajes desde listener de notificaciones:', e);
                    });
                }
                
                // Actualizar el último conteo conocido
                this.lastMessageCount = currentCount;
            }
        };
        
        // Verificar cada 2 segundos si hay cambios en las notificaciones
        // Esto es más eficiente que hacer polling constante de la lista de mensajes
        setInterval(checkForNewMessages, 2000);
        
        // También escuchar eventos personalizados si se disparan
        window.addEventListener('jk:new-message', () => {
            if (this.currentFolder === 'inbox' && !this.currentMessage) {
                // preserveSelection = true para mantener los checks seleccionados
                this.loadMessages('inbox', true).catch(e => {
                    console.error('Error recargando mensajes desde evento:', e);
                });
            }
        });
    }
    
    async loadFolders() {
        try {
            const response = await fetch(`${this.apiBase}?action=folders`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            // Verificar que la respuesta sea JSON válido
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Respuesta no es JSON:', text.substring(0, 200));
                throw new Error('El servidor devolvió una respuesta inválida. Por favor, recarga la página.');
            }
            
            const data = await response.json();
            if (data.success) {
                this.folders = data.data;
                this.renderFolders();
                
                // Actualizar badge de mensajes no leídos después de cargar carpetas
                this.updateUnreadBadge();
            } else {
                throw new Error(data.message || 'Error cargando carpetas');
            }
        } catch (e) {
            console.error('Error cargando carpetas:', e);
            this.showError(e.message || 'Error cargando carpetas');
        }
    }
    
    async loadMessages(folder = 'inbox', preserveSelection = false) {
        try {
            // Normalizar nombres de carpetas para comparación
            const normalizedFolder = String(folder || 'inbox').trim();
            const normalizedCurrent = String(this.currentFolder || 'inbox').trim();
            
            // Cerrar vista de mensaje si:
            // 1. Se está cambiando de carpeta, O
            // 2. Hay un mensaje abierto (incluso si es la misma carpeta)
            const isChangingFolder = normalizedCurrent !== normalizedFolder;
            const hasOpenMessage = this.currentMessage !== null;
            
            if (isChangingFolder || hasOpenMessage) {
                this.closeMessageView();
            }
            
            // SIEMPRE limpiar selecciones al cambiar de carpeta
            // preserveSelection solo aplica cuando NO se cambia de carpeta (actualizaciones automáticas de la misma carpeta)
            if (isChangingFolder) {
                this.selectedMessages.clear();
                // Ocultar toolbar de acciones en lote inmediatamente cuando se cambia de carpeta
                this.updateBulkActionsToolbar();
            }
            
            // Actualizar carpeta actual
            this.currentFolder = normalizedFolder;
            
            // Actualizar visualmente la carpeta activa (sin el botón de vaciar papelera aún)
            this.renderFolders();
            
            const response = await fetch(`${this.apiBase}?action=list&folder=${folder}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            // Verificar que la respuesta sea JSON válido
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Respuesta no es JSON:', text.substring(0, 200));
                throw new Error('El servidor devolvió una respuesta inválida. Por favor, recarga la página.');
            }
            
            const data = await response.json();
            if (data.success) {
                this.messages = data.data.messages || [];
                this.renderMessages();
                this.updateFolderTitle();
                this.updateSelectAllCheckbox();
                
                // Actualizar carpetas DESPUÉS de cargar mensajes para que el botón de vaciar papelera aparezca/desaparezca correctamente
                this.renderFolders();
                
                // Asegurar que el toolbar esté oculto si no hay selecciones (después de renderizar)
                if (this.selectedMessages.size === 0) {
                    this.updateBulkActionsToolbar();
                }
                
                // Actualizar badge de mensajes no leídos si estamos en inbox
                if (this.currentFolder === 'inbox') {
                    this.updateUnreadBadge();
                }
            } else {
                throw new Error(data.message || 'Error cargando mensajes');
            }
        } catch (e) {
            console.error('Error cargando mensajes:', e);
            this.showError('Error cargando mensajes');
        }
    }
    
    async loadMessage(messageId) {
        try {
            const response = await fetch(`${this.apiBase}?action=read&id=${messageId}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            if (data.success) {
                this.currentMessage = data.data.message;
                // Mostrar en modal hexagonal en lugar de vista lateral
                await this.showMessageModalHex(data.data);
            } else {
                throw new Error(data.message || 'Error cargando mensaje');
            }
        } catch (e) {
            console.error('Error cargando mensaje:', e);
            this.showError('Error cargando mensaje');
        }
    }
    
    renderFolders() {
        const container = document.getElementById('messagingFolders');
        if (!container) return;
        
        // Verificar si hay mensajes en papelera
        // El botón solo debe aparecer si estamos en la carpeta trash Y hay mensajes cargados
        const trashFolder = this.folders.find(f => f.slug === 'trash');
        const isInTrash = this.currentFolder === 'trash';
        const hasTrashMessages = isInTrash && this.messages && this.messages.length > 0;
        
        container.innerHTML = this.folders.map(folder => {
            const isActive = this.currentFolder === folder.slug;
            const isTrash = folder.slug === 'trash';
            
            return `
            <div class="messaging-folder ${isActive ? 'active' : ''}" 
                 onclick="messagingSystem.loadMessages('${folder.slug}')">
                <i class="${folder.icon || 'fas fa-folder'}"></i>
                <span>${this.escapeHtml(folder.name)}</span>
                ${folder.slug === 'inbox' ? `<span class="unread-badge" id="unreadBadge"></span>` : ''}
                ${isActive && isTrash && hasTrashMessages ? `
                    <div class="empty-trash-btn-small" onclick="event.stopPropagation(); if (typeof messagingSystem !== 'undefined') messagingSystem.showEmptyTrashModal();">
                        <div class="jkhive-actionbutton-small">
                            <a href="#" onclick="event.preventDefault(); return false;" style="text-decoration: none;">
                                <div class="jkhive-hex jkhive-hex-red">
                                    <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                        <i class="jkhive-hex-icon fas fa-trash-alt"></i>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        }).join('');
        
        // Actualizar badge de no leídos
        this.updateUnreadBadge();
    }
    
    renderMessages() {
        const container = document.getElementById('messagingList');
        if (!container) return;
        
        
        if (this.messages.length === 0) {
            container.innerHTML = '<div class="empty-state">No hay mensajes</div>';
            return;
        }
        
        container.innerHTML = this.messages.map(msg => {
            const chatInfo = msg.chat_info || {};
            const rootId = chatInfo.root_message_id || msg.id;
            const totalMessages = chatInfo.total_messages || 1;
            const unreadCount = chatInfo.unread_count || 0;
            const hasUnread = unreadCount > 0;
            
            const isRead = msg.is_read || msg.is_read === 1;
            const isStarred = msg.is_starred || msg.is_starred === 1;
            const fromUser = msg.from_user || {};
            const toUser = msg.to_user || {};
            const isSelected = this.selectedMessages.has(rootId);
            
            // Determinar quién es el remitente del último mensaje
            const lastFromUser = msg.from_user || {};
            
            // Verificar si el mensaje tiene adjuntos
            const hasAttachments = (msg.has_attachments === 1 || msg.has_attachments === true) || 
                                  (chatInfo.has_attachments === 1 || chatInfo.has_attachments === true) ||
                                  (msg.attachments && msg.attachments.length > 0) ||
                                  (chatInfo.attachments && chatInfo.attachments.length > 0);
            
            return `
                <div class="messaging-item ${hasUnread ? 'unread' : ''} ${isSelected ? 'selected' : ''}" 
                     data-chat-id="${rootId}"
                     data-message-id="${msg.id}">
                    <input type="checkbox" 
                           class="messaging-checkbox" 
                           data-chat-id="${rootId}"
                           ${isSelected ? 'checked' : ''}
                           onchange="messagingSystem.toggleMessageSelection(${rootId}, this.checked)"
                           onclick="event.stopPropagation();">
                    <div class="messaging-item-content" onclick="messagingSystem.loadMessage(${msg.id})">
                        <div class="messaging-item-header">
                            <span class="messaging-item-star" onclick="event.stopPropagation(); messagingSystem.toggleStar(${msg.id}, ${isStarred ? 0 : 1})">
                                <i class="fas fa-star ${isStarred ? 'starred' : ''}"></i>
                            </span>
                            <span class="messaging-item-from">${this.escapeHtml(lastFromUser.username || 'Usuario')}</span>
                            <span class="messaging-item-date">${this.formatDate(chatInfo.latest_date || msg.created_at)}</span>
                            ${hasAttachments ? '<span class="messaging-item-attachment" data-tooltip="Tiene archivos adjuntos" aria-label="Tiene archivos adjuntos"><i class="fas fa-paperclip"></i></span>' : ''}
                            ${totalMessages > 1 ? `<span class="chat-message-count">${totalMessages} mensajes</span>` : ''}
                            ${hasUnread ? `<span class="chat-unread-badge">${unreadCount}</span>` : ''}
                        </div>
                        <div class="messaging-item-subject">${this.escapeHtml(chatInfo.latest_subject || msg.subject || 'Sin asunto')}</div>
                        <div class="messaging-item-preview">${this.escapeHtml((msg.body || '').substring(0, 100))}</div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Actualizar toolbar y contador después de renderizar
        this.updateBulkActionsToolbar();
        this.updateSelectAllCheckbox();
    }
    
    renderMessageView(data) {
        const container = document.getElementById('messagingView');
        if (!container) return;
        
        const message = data.message;
        const thread = data.thread || [message];
        const attachments = data.attachments || [];
        
        const fromUser = message.from_user || {};
        const toUser = message.to_user || {};
        const ccUsers = message.cc_users || [];
        
        // Agregar clase al layout para ocultar la lista y mostrar la vista
        const layout = document.querySelector('.messaging-layout');
        if (layout) {
            layout.classList.add('showing-message');
        }
        
        container.style.display = 'flex';
        
        // Verificar permisos para reenviar (solo admin y clerk)
        const canForward = this.canForwardMessage();
        
        container.innerHTML = `
            <div class="messaging-view-header">
                <div class="jkhive-actionbutton-small">
                    <a href="#" onclick="event.preventDefault(); messagingSystem.closeMessageView(); return false;" data-tooltip="Volver" aria-label="Volver">
                        <div class="jkhive-hex jkhive-hex-honey">
                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                <i class="jkhive-hex-icon fas fa-arrow-left"></i>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="messaging-view-actions">
                    <div class="jkhive-actionbutton-small">
                        <a href="#" onclick="event.preventDefault(); messagingSystem.showReplyModalHex(${message.id}); return false;" data-tooltip="Responder" aria-label="Responder">
                            <div class="jkhive-hex jkhive-hex-cyan">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <i class="jkhive-hex-icon fas fa-reply"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                    ${canForward ? `
                    <div class="jkhive-actionbutton-small">
                        <a href="#" onclick="event.preventDefault(); messagingSystem.forwardMessage(${message.id}); return false;" data-tooltip="Reenviar" aria-label="Reenviar">
                            <div class="jkhive-hex jkhive-hex-blue">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <i class="jkhive-hex-icon fas fa-share"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                    ` : ''}
                    <div class="jkhive-actionbutton-small">
                        <a href="#" onclick="event.preventDefault(); messagingSystem.toggleStar(${message.id}, ${message.is_starred ? 0 : 1}); return false;" data-tooltip="${message.is_starred ? 'Destacado' : 'Destacar'}" aria-label="${message.is_starred ? 'Destacado' : 'Destacar'}">
                            <div class="jkhive-hex ${message.is_starred ? 'jkhive-hex-yellow' : 'jkhive-hex-honey'}">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <i class="jkhive-hex-icon fas fa-star ${message.is_starred ? 'starred' : ''}"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="jkhive-actionbutton-small">
                        <a href="#" onclick="event.preventDefault(); messagingSystem.archiveMessage(${message.id}); return false;" data-tooltip="Archivar" aria-label="Archivar">
                            <div class="jkhive-hex jkhive-hex-green">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <i class="jkhive-hex-icon fas fa-archive"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                        <div class="jkhive-actionbutton-small">
                            <a href="#" onclick="event.preventDefault(); messagingSystem.deleteMessageFromView(${message.id}); return false;" data-tooltip="${this.currentFolder === 'trash' ? 'Eliminar definitivamente' : 'Mover a papelera'}" aria-label="${this.currentFolder === 'trash' ? 'Eliminar definitivamente' : 'Mover a papelera'}">
                                <div class="jkhive-hex jkhive-hex-red">
                                    <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                        <i class="jkhive-hex-icon fas fa-trash"></i>
                                    </div>
                                </div>
                            </a>
                        </div>
                </div>
            </div>
            <div class="messaging-view-content">
                ${thread.sort((a, b) => {
                    // Ordenar cronológicamente: más antiguo primero, más reciente último
                    return new Date(a.created_at) - new Date(b.created_at);
                }).reverse().map((msg, idx) => {
                    const msgFrom = msg.from_user || {};
                    const msgTo = msg.to_user || {};
                    // El más reciente es el primero después de reverse (idx === 0)
                    const isLatest = idx === 0;
                    return `
                        <div class="messaging-thread-message ${isLatest ? 'messaging-thread-latest' : ''}">
                            <div class="messaging-thread-header">
                                <div class="messaging-thread-meta">
                                    <div>
                                        <strong>${this.escapeHtml(msgFrom.username || 'Usuario')}</strong>
                                        <span class="message-email">${this.escapeHtml(msgFrom.email || '')}</span>
                                    </div>
                                    <div>${this.formatDate(msg.created_at)}</div>
                                </div>
                                ${isLatest ? `
                                    <div class="messaging-thread-latest-badge">
                                        <i class="fas fa-circle"></i> Más reciente
                                    </div>
                                ` : ''}
                            </div>
                            <div class="messaging-thread-subject">${this.escapeHtml(msg.subject || 'Sin asunto')}</div>
                            <div class="messaging-thread-body">${this.nl2br(this.escapeHtml(msg.body || ''))}</div>
                            ${isLatest && attachments.length > 0 ? `
                                <div class="messaging-attachments">
                                    <h4>Adjuntos:</h4>
                                    ${attachments.map(att => `
                                        <div class="messaging-attachment">
                                            <i class="fas fa-paperclip"></i>
                                            <span>${this.escapeHtml(att.filename)}</span>
                                            <span class="file-size">${this.formatFileSize(att.file_size || 0)}</span>
                                            <a href="${this.downloadUrl(att.id)}" class="btn-download">Descargar</a>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            ${idx < thread.length - 1 ? '<div class="messaging-thread-separator"></div>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        // Marcar como leído
        this.markAsRead(message.id);
    }
    
    closeMessageView() {
        const container = document.getElementById('messagingView');
        if (container) {
            container.style.display = 'none';
        }
        
        // Remover clase del layout para mostrar la lista de nuevo
        const layout = document.querySelector('.messaging-layout');
        if (layout) {
            layout.classList.remove('showing-message');
        }
        
        this.currentMessage = null;
    }
    
    async sendMessage(formData) {
        try {
            const form = new FormData();
            form.append('subject', formData.subject);
            form.append('body', formData.body);
            if (formData.parent_id) form.append('parent_id', formData.parent_id);
            if (formData.to_user_id) form.append('to_user_id', formData.to_user_id);
            if (formData.cc_users && formData.cc_users.length > 0) {
                formData.cc_users.forEach(userId => form.append('cc_users[]', userId));
            }
            if (formData.create_new_chat) {
                form.append('create_new_chat', 'true');
            }
            if (formData.attachments && formData.attachments.length > 0) {
                Array.from(formData.attachments).forEach(file => {
                    form.append('attachments[]', file);
                });
            }
            
            const response = await fetch(`${this.apiBase}?action=send`, {
                method: 'POST',
                body: form
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            if (data.success) {
                // NO mostrar confirmación aquí - los métodos handleReplySubmitInModal y handleNewMessageSubmit
                // se encargan de mostrar la confirmación en el modal
                // Solo cerrar modales antiguos si existen
                this.closeModal('newMessageModal');
                this.closeModal('replyModal');
                this.closeModal('forwardModal');
                // Cerrar vista de mensaje si está abierta (especialmente si se respondió)
                this.closeMessageView();
                // Limpiar formularios
                const newForm = document.getElementById('newMessageForm');
                if (newForm) newForm.reset();
                const replyForm = document.getElementById('replyForm');
                if (replyForm) replyForm.reset();
                
                // Actualizar notificaciones inmediatamente después de enviar
                if (typeof window.notificationsSystem !== 'undefined' && window.notificationsSystem) {
                    await window.notificationsSystem.refreshNotifications();
                }
                
                // Recargar mensajes solo si no estamos en un modal hexagonal (ellos manejan su propia recarga)
                const hexModal = document.querySelector('.jkhive-modal-msgs-form[data-state="reply"], .jkhive-modal-msgs-form[data-state="compose"]');
                if (!hexModal) {
                    await this.loadMessages(this.currentFolder);
                }
            } else {
                throw new Error(data.message || data.error || 'Error enviando mensaje');
            }
        } catch (e) {
            console.error('Error enviando mensaje:', e);
            this.showError('Error enviando mensaje: ' + e.message);
        }
    }
    
    async markAsRead(messageId) {
        try {
            const form = new FormData();
            form.append('id', messageId);
            
            const response = await fetch(`${this.apiBase}?action=read`, {
                method: 'POST',
                body: form
            });
            
            if (response.ok) {
                // Actualizar notificaciones inmediatamente después de marcar como leído
                if (typeof window.notificationsSystem !== 'undefined' && window.notificationsSystem) {
                    await window.notificationsSystem.refreshNotifications();
                }
                
                // Actualizar badge de mensajes no leídos en la lengüeta de bandeja de entrada
                this.updateUnreadBadge();
            }
            
            // No recargar la lista si hay un mensaje abierto
            // Solo actualizar el estado del mensaje en la lista si está visible
            if (!this.currentMessage) {
                // Solo actualizar contador si no hay mensaje abierto
                // El contador se actualizará en la próxima carga
            }
        } catch (e) {
            console.error('Error marcando como leído:', e);
        }
    }
    
    async toggleStar(messageId, starred) {
        try {
            const form = new FormData();
            form.append('id', messageId);
            form.append('starred', starred);
            
            const response = await fetch(`${this.apiBase}?action=star`, {
                method: 'POST',
                body: form
            });
            
            if (response.ok) {
                // Solo recargar si no hay mensaje abierto o si es el mensaje actual
                if (!this.currentMessage || this.currentMessage.id === messageId) {
                    if (this.currentMessage && this.currentMessage.id === messageId) {
                        // Recargar el mensaje actual para actualizar el estado de la estrella
                        await this.loadMessage(messageId);
                    } else {
                        // Recargar la lista si no hay mensaje abierto
                        // preserveSelection = true para mantener los checks seleccionados
                        await this.loadMessages(this.currentFolder, true);
                    }
                }
            }
        } catch (e) {
            console.error('Error destacando mensaje:', e);
        }
    }
    
    reply(messageId) {
        const message = this.messages.find(m => m.id === messageId);
        if (!message) return;
        
        const replyModal = document.getElementById('replyModal');
        if (!replyModal) return;
        
        document.getElementById('replySubject').value = 'Re: ' + (message.subject || '');
        document.getElementById('replyBody').value = '';
        document.getElementById('replyParentId').value = messageId;
        
        this.openModal(replyModal);
    }
    
    updateFolderTitle() {
        const folder = this.folders.find(f => f.slug === this.currentFolder);
        const titleEl = document.getElementById('folderTitle');
        if (titleEl && folder) {
            titleEl.textContent = folder.name;
        }
    }
    
    async updateUnreadBadge() {
        const badge = document.getElementById('unreadBadge');
        if (!badge) return;
        
        try {
            // Obtener contador de mensajes no leídos desde el sistema de notificaciones
            let unreadCount = 0;
            if (typeof window.notificationsSystem !== 'undefined' && window.notificationsSystem) {
                unreadCount = window.notificationsSystem.counts.messages || 0;
            } else {
                // Si no está disponible, calcular desde los mensajes cargados
                // Contar mensajes no leídos en la lista actual
                unreadCount = this.messages.reduce((count, msg) => {
                    const chatInfo = msg.chat_info || {};
                    return count + (chatInfo.unread_count || 0);
                }, 0);
            }
            
            // Actualizar badge
            if (unreadCount > 0) {
                badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                badge.style.display = 'inline-flex';
            } else {
                badge.style.display = 'none';
            }
        } catch (e) {
            console.error('Error actualizando badge de no leídos:', e);
        }
    }
    
    toggleMessageSelection(messageId, checked) {
        if (checked) {
            this.selectedMessages.add(messageId);
        } else {
            this.selectedMessages.delete(messageId);
        }
        this.updateBulkActionsToolbar();
        this.updateSelectAllCheckbox();
    }
    
    toggleSelectAll(checked) {
        if (checked) {
            // Seleccionar todos los chats (usando root_message_id)
            this.messages.forEach(msg => {
                const chatInfo = msg.chat_info || {};
                const rootId = chatInfo.root_message_id || msg.id;
                this.selectedMessages.add(rootId);
            });
        } else {
            this.selectedMessages.clear();
        }
        this.renderMessages();
        // Asegurar que el contador se actualice después de renderizar
        this.updateBulkActionsToolbar();
        this.updateSelectAllCheckbox();
    }
    
    updateSelectAllCheckbox() {
        const selectAll = document.getElementById('selectAllMessages');
        if (selectAll) {
            // Contar chats únicos seleccionados
            const uniqueChats = new Set();
            this.messages.forEach(msg => {
                const chatInfo = msg.chat_info || {};
                const rootId = chatInfo.root_message_id || msg.id;
                uniqueChats.add(rootId);
            });
            
            const allSelected = uniqueChats.size > 0 && 
                               Array.from(uniqueChats).every(rootId => this.selectedMessages.has(rootId));
            const someSelected = this.selectedMessages.size > 0;
            selectAll.checked = allSelected;
            selectAll.indeterminate = someSelected && !allSelected;
        }
    }
    
    updateBulkActionsToolbar() {
        const toolbar = document.getElementById('bulkActionsToolbar');
        const countEl = document.getElementById('selectedCount');
        const selectedCount = this.selectedMessages.size;
        
        if (toolbar) {
            if (selectedCount > 0) {
                toolbar.style.display = 'flex';
                // Actualizar botones según la carpeta actual
                this.updateToolbarButtons(toolbar);
            } else {
                toolbar.style.display = 'none';
            }
        }
        
        if (countEl) {
            // Forzar actualización del texto del contador
            const text = `${selectedCount} seleccionado${selectedCount !== 1 ? 's' : ''}`;
            countEl.textContent = text;
            countEl.innerText = text; // Asegurar actualización en todos los navegadores
            // Asegurar que el elemento sea visible si hay selecciones
            if (selectedCount > 0) {
                countEl.style.display = 'inline';
            }
        } else {
            // Si no se encuentra el elemento, intentar buscarlo de nuevo después de un pequeño delay
            // Esto puede ocurrir si el DOM aún no está completamente renderizado
            setTimeout(() => {
                const retryCountEl = document.getElementById('selectedCount');
                if (retryCountEl) {
                    const text = `${selectedCount} seleccionado${selectedCount !== 1 ? 's' : ''}`;
                    retryCountEl.textContent = text;
                    retryCountEl.innerText = text;
                }
            }, 50);
        }
    }
    
    /**
     * Actualizar botones del toolbar según la carpeta actual
     */
    updateToolbarButtons(toolbar) {
        const folder = this.currentFolder;
        const isTrash = folder === 'trash';
        const isArchived = folder === 'archived';
        const isStarred = folder === 'starred';
        
        if (isTrash) {
            // En papelera: solo "Eliminar definitivamente" y "Restaurar"
            toolbar.innerHTML = `
                <div class="jkhive-actionbutton-small bulk-action-delete">
                    <a href="#" onclick="event.preventDefault(); if (typeof messagingSystem !== 'undefined') messagingSystem.bulkDeletePermanently(); return false;" data-tooltip="Eliminar definitivamente" aria-label="Eliminar definitivamente">
                        <div class="jkhive-hex jkhive-hex-honey">
                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                <i class="jkhive-hex-icon fas fa-trash-alt"></i>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="jkhive-actionbutton-small bulk-action-restore">
                    <a href="#" onclick="event.preventDefault(); if (typeof messagingSystem !== 'undefined') messagingSystem.bulkRestore(); return false;" data-tooltip="Restaurar" aria-label="Restaurar">
                        <div class="jkhive-hex jkhive-hex-honey">
                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                <i class="jkhive-hex-icon fas fa-undo"></i>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        } else if (isArchived) {
            // En archivados: "Mover a papelera", "Mover a bandeja de entrada", "Destacar"
            toolbar.innerHTML = `
                <div class="jkhive-actionbutton-small bulk-action-delete">
                    <a href="#" onclick="event.preventDefault(); if (typeof messagingSystem !== 'undefined') messagingSystem.bulkMoveToTrash(); return false;" data-tooltip="Mover a papelera" aria-label="Mover a papelera">
                        <div class="jkhive-hex jkhive-hex-honey">
                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                <i class="jkhive-hex-icon fas fa-trash"></i>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="jkhive-actionbutton-small bulk-action-unarchive">
                    <a href="#" onclick="event.preventDefault(); if (typeof messagingSystem !== 'undefined') messagingSystem.bulkUnarchive(); return false;" data-tooltip="Mover a bandeja de entrada" aria-label="Mover a bandeja de entrada">
                        <div class="jkhive-hex jkhive-hex-honey">
                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                <i class="jkhive-hex-icon fas fa-inbox"></i>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="jkhive-actionbutton-small bulk-action-star">
                    <a href="#" onclick="event.preventDefault(); if (typeof messagingSystem !== 'undefined') messagingSystem.bulkStar(); return false;" data-tooltip="Destacar" aria-label="Destacar">
                        <div class="jkhive-hex jkhive-hex-honey">
                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                <i class="jkhive-hex-icon fas fa-star"></i>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        } else if (isStarred) {
            // En destacados: "Mover a papelera", "Archivar", "Dejar de destacar"
            toolbar.innerHTML = `
                <div class="jkhive-actionbutton-small bulk-action-delete">
                    <a href="#" onclick="event.preventDefault(); if (typeof messagingSystem !== 'undefined') messagingSystem.bulkMoveToTrash(); return false;" data-tooltip="Mover a papelera" aria-label="Mover a papelera">
                        <div class="jkhive-hex jkhive-hex-honey">
                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                <i class="jkhive-hex-icon fas fa-trash"></i>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="jkhive-actionbutton-small bulk-action-archive">
                    <a href="#" onclick="event.preventDefault(); if (typeof messagingSystem !== 'undefined') messagingSystem.bulkArchive(); return false;" data-tooltip="Archivar" aria-label="Archivar">
                        <div class="jkhive-hex jkhive-hex-honey">
                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                <i class="jkhive-hex-icon fas fa-archive"></i>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="jkhive-actionbutton-small bulk-action-unstar">
                    <a href="#" onclick="event.preventDefault(); if (typeof messagingSystem !== 'undefined') messagingSystem.bulkUnstar(); return false;" data-tooltip="Dejar de destacar" aria-label="Dejar de destacar">
                        <div class="jkhive-hex jkhive-hex-honey">
                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                <i class="jkhive-hex-icon far fa-star"></i>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        } else {
            // En inbox y sent: "Mover a papelera", "Archivar", "Destacar"
            toolbar.innerHTML = `
                <div class="jkhive-actionbutton-small bulk-action-delete">
                    <a href="#" onclick="event.preventDefault(); if (typeof messagingSystem !== 'undefined') messagingSystem.bulkMoveToTrash(); return false;" data-tooltip="Mover a papelera" aria-label="Mover a papelera">
                        <div class="jkhive-hex jkhive-hex-honey">
                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                <i class="jkhive-hex-icon fas fa-trash"></i>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="jkhive-actionbutton-small bulk-action-archive">
                    <a href="#" onclick="event.preventDefault(); if (typeof messagingSystem !== 'undefined') messagingSystem.bulkArchive(); return false;" data-tooltip="Archivar" aria-label="Archivar">
                        <div class="jkhive-hex jkhive-hex-honey">
                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                <i class="jkhive-hex-icon fas fa-archive"></i>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="jkhive-actionbutton-small bulk-action-star">
                    <a href="#" onclick="event.preventDefault(); if (typeof messagingSystem !== 'undefined') messagingSystem.bulkStar(); return false;" data-tooltip="Destacar" aria-label="Destacar">
                        <div class="jkhive-hex jkhive-hex-honey">
                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                <i class="jkhive-hex-icon fas fa-star"></i>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        }
    }
    
    async bulkDelete() {
        const selected = Array.from(this.selectedMessages);
        if (selected.length === 0) return;
        
        if (typeof SystemMessages === 'undefined') {
            await this.bulkAction('delete', selected);
            return;
        }
        
        const systemMessages = new SystemMessages();
        const isTrash = this.currentFolder === 'trash';
        const title = isTrash ? 'Eliminar Chats Definitivamente' : 'Mover Chats a Papelera';
        const message = isTrash
            ? `¿Estás seguro de que quieres eliminar definitivamente ${selected.length} chat${selected.length !== 1 ? 's' : ''}? Esta acción no se puede deshacer.`
            : `¿Estás seguro de que quieres mover ${selected.length} chat${selected.length !== 1 ? 's' : ''} a la papelera?`;
        
        systemMessages.confirm(
            message,
            title,
            'jkhive-modal-msgs-vp',
            async (confirmed, modal) => {
                if (!confirmed) {
                    systemMessages.close(modal);
                    return;
                }
                
                try {
                    await this.bulkAction('delete', selected);
                    
                    // Actualizar el modal con el resultado
                    const successMessage = isTrash 
                        ? `${selected.length} chat${selected.length !== 1 ? 's' : ''} eliminado${selected.length !== 1 ? 's' : ''} definitivamente.`
                        : `${selected.length} chat${selected.length !== 1 ? 's' : ''} movido${selected.length !== 1 ? 's' : ''} a la papelera.`;
                    
                    systemMessages.updateModal(modal, {
                        type: 'success',
                        title: isTrash ? 'Chats Eliminados' : 'Chats Movidos',
                        message: successMessage,
                        icon: 'fas fa-check-circle',
                        buttons: [
                            { text: 'Aceptar', action: 'ok', primary: true }
                        ],
                        customClass: 'jkhive-modal-msgs-vp'
                    });
                } catch (e) {
                    console.error('Error eliminando chats:', e);
                    systemMessages.updateModal(modal, {
                        type: 'error',
                        title: 'Error',
                        message: 'Error al eliminar los chats: ' + e.message,
                        icon: 'fas fa-exclamation-circle',
                        buttons: [
                            { text: 'Aceptar', action: 'ok', primary: true }
                        ],
                        customClass: 'jkhive-modal-msgs-vp'
                    });
                }
            }
        );
    }
    
    async bulkDeletePermanently() {
        // Eliminar definitivamente desde papelera
        const selected = Array.from(this.selectedMessages);
        if (selected.length === 0) return;
        
        if (typeof SystemMessages === 'undefined') {
            await this.bulkAction('delete', selected);
            return;
        }
        
        const systemMessages = new SystemMessages();
        systemMessages.confirm(
            `¿Estás seguro de que quieres eliminar definitivamente ${selected.length} chat${selected.length !== 1 ? 's' : ''}? Esta acción no se puede deshacer.`,
            'Eliminar Chats Definitivamente',
            'jkhive-modal-msgs-e',
            async (confirmed, modal) => {
                if (!confirmed) {
                    systemMessages.close(modal);
                    return;
                }
                
                try {
                    await this.bulkAction('delete', selected);
                    
                    systemMessages.updateModal(modal, {
                        type: 'success',
                        title: 'Chats Eliminados',
                        message: `${selected.length} chat${selected.length !== 1 ? 's' : ''} eliminado${selected.length !== 1 ? 's' : ''} definitivamente.`,
                        icon: 'fas fa-check-circle',
                        buttons: [
                            { text: 'Aceptar', action: 'ok', primary: true }
                        ],
                        customClass: 'jkhive-modal-msgs-e'
                    });
                } catch (e) {
                    console.error('Error eliminando chats:', e);
                    systemMessages.updateModal(modal, {
                        type: 'error',
                        title: 'Error',
                        message: 'Error al eliminar los chats: ' + e.message,
                        icon: 'fas fa-exclamation-circle',
                        buttons: [
                            { text: 'Aceptar', action: 'ok', primary: true }
                        ],
                        customClass: 'jkhive-modal-msgs-e'
                    });
                }
            }
        );
    }
    
    async bulkMoveToTrash() {
        // Mover a papelera desde otras carpetas
        const selected = Array.from(this.selectedMessages);
        if (selected.length === 0) return;
        
        if (typeof SystemMessages === 'undefined') {
            await this.bulkAction('delete', selected);
            return;
        }
        
        const systemMessages = new SystemMessages();
        systemMessages.confirm(
            `¿Estás seguro de que quieres mover ${selected.length} chat${selected.length !== 1 ? 's' : ''} a la papelera?`,
            'Mover Chats a Papelera',
            'jkhive-modal-msgs-vp',
            async (confirmed, modal) => {
                if (!confirmed) {
                    systemMessages.close(modal);
                    return;
                }
                
                try {
                    await this.bulkAction('delete', selected);
                    
                    systemMessages.updateModal(modal, {
                        type: 'success',
                        title: 'Chats Movidos',
                        message: `${selected.length} chat${selected.length !== 1 ? 's' : ''} movido${selected.length !== 1 ? 's' : ''} a la papelera.`,
                        icon: 'fas fa-check-circle',
                        buttons: [
                            { text: 'Aceptar', action: 'ok', primary: true }
                        ],
                        customClass: 'jkhive-modal-msgs-vp'
                    });
                } catch (e) {
                    console.error('Error moviendo chats a papelera:', e);
                    systemMessages.updateModal(modal, {
                        type: 'error',
                        title: 'Error',
                        message: 'Error al mover los chats a la papelera: ' + e.message,
                        icon: 'fas fa-exclamation-circle',
                        buttons: [
                            { text: 'Aceptar', action: 'ok', primary: true }
                        ],
                        customClass: 'jkhive-modal-msgs-vp'
                    });
                }
            }
        );
    }
    
    async bulkArchive() {
        const selected = Array.from(this.selectedMessages);
        if (selected.length === 0) return;
        
        try {
            await this.bulkAction('archive', selected);
            
            // Mostrar mensaje de confirmación
            if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                systemMessages.success(
                    `Chat${selected.length !== 1 ? 's' : ''} movido${selected.length !== 1 ? 's' : ''} a Archivados.`,
                    'Chat Archivado',
                    'jkhive-msgs-alerts'
                );
            }
        } catch (e) {
            console.error('Error archivando chats:', e);
            if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                systemMessages.error('Error al archivar los chats: ' + e.message);
            }
        }
    }
    
    async bulkStar() {
        const selected = Array.from(this.selectedMessages);
        if (selected.length === 0) return;
        
        try {
            await this.bulkAction('star', selected);
            
            // Mostrar mensaje de confirmación
            if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                const isArchived = this.currentFolder === 'archived';
                const message = isArchived
                    ? `Chat${selected.length !== 1 ? 's' : ''} movido${selected.length !== 1 ? 's' : ''} a Destacados.`
                    : `Chat${selected.length !== 1 ? 's' : ''} movido${selected.length !== 1 ? 's' : ''} a Destacados.`;
                
                systemMessages.success(message, 'Chat Destacado', 'jkhive-msgs-alerts');
            }
        } catch (e) {
            console.error('Error destacando chats:', e);
            if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                systemMessages.error('Error al destacar los chats: ' + e.message);
            }
        }
    }
    
    async bulkUnstar() {
        const selected = Array.from(this.selectedMessages);
        if (selected.length === 0) return;
        
        try {
            await this.bulkAction('unstar', selected);
            
            // Mostrar mensaje de confirmación
            if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                systemMessages.success(
                    `Chat${selected.length !== 1 ? 's' : ''} sin destacar.`,
                    'Chat Actualizado',
                    'jkhive-msgs-alerts'
                );
            }
        } catch (e) {
            console.error('Error quitando destacado:', e);
            if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                systemMessages.error('Error al quitar el destacado: ' + e.message);
            }
        }
    }
    
    async bulkUnarchive() {
        const selected = Array.from(this.selectedMessages);
        if (selected.length === 0) return;
        
        try {
            await this.bulkAction('unarchive', selected);
            
            // Mostrar mensaje de confirmación
            if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                systemMessages.success(
                    `Chat${selected.length !== 1 ? 's' : ''} movido${selected.length !== 1 ? 's' : ''} a Bandeja de Entrada.`,
                    'Chat Movido',
                    'jkhive-msgs-alerts'
                );
            }
        } catch (e) {
            console.error('Error desarchivando chats:', e);
            if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                systemMessages.error('Error al mover los chats a la bandeja de entrada: ' + e.message);
            }
        }
    }
    
    async bulkRestore() {
        const selected = Array.from(this.selectedMessages);
        if (selected.length === 0) return;
        
        try {
            // Ejecutar acción de restaurar
            await this.bulkAction('restore', selected);
            
            // Mostrar mensaje de confirmación
            if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                systemMessages.success(
                    `Chat${selected.length !== 1 ? 's' : ''} restaurado${selected.length !== 1 ? 's' : ''} a Bandeja de Entrada.`,
                    'Chat Restaurado',
                    'jkhive-msgs-alerts'
                );
            }
        } catch (e) {
            console.error('Error restaurando chats:', e);
            if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                systemMessages.error('Error al restaurar los chats: ' + e.message);
            }
        }
    }
    
    async bulkMarkAsRead() {
        const selected = Array.from(this.selectedMessages);
        if (selected.length === 0) return;
        await this.bulkAction('mark_read', selected);
    }
    
    async bulkAction(action, messageIds) {
        try {
            const formData = new FormData();
            formData.append('action', action);
            formData.append('message_ids', JSON.stringify(messageIds));
            formData.append('current_folder', this.currentFolder);
            
            const response = await fetch(`${this.apiBase}?action=bulk`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            if (data.success) {
                this.selectedMessages.clear();
                
                // Cambiar a la carpeta de destino según la acción realizada
                let destinationFolder = this.currentFolder; // Por defecto, mantener la carpeta actual
                
                switch (action) {
                    case 'archive':
                        // Mover a archivados
                        destinationFolder = 'archived';
                        break;
                    case 'star':
                        // Mover a destacados
                        destinationFolder = 'starred';
                        break;
                    case 'unstar':
                        // Si estaba en destacados, volver a la carpeta anterior (inbox o archived)
                        // Si estaba en otra carpeta, quedarse ahí
                        if (this.currentFolder === 'starred') {
                            // Intentar determinar la carpeta original, por defecto inbox
                            destinationFolder = 'inbox';
                        } else {
                            // Mantener la carpeta actual si no estaba en destacados
                            destinationFolder = this.currentFolder;
                        }
                        break;
                    case 'unarchive':
                    case 'restore':
                        // Mover a bandeja de entrada
                        destinationFolder = 'inbox';
                        break;
                    case 'delete':
                        // Mover a papelera
                        destinationFolder = 'trash';
                        break;
                    default:
                        // Para otras acciones (mark_read, etc.), mantener la carpeta actual
                        destinationFolder = this.currentFolder;
                }
                
                // Cargar mensajes de la carpeta de destino
                await this.loadMessages(destinationFolder);
                
                // NO mostrar mensaje aquí - los métodos específicos (bulkDelete, bulkDeletePermanently, etc.)
                // ya manejan los mensajes con updateModal
            } else {
                throw new Error(data.message || 'Error en la acción');
            }
        } catch (e) {
            console.error('Error en acción en lote:', e);
            if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                systemMessages.error('Error en la acción');
            }
        }
    }
    
    showEmptyTrashModal() {
        if (typeof SystemMessages === 'undefined') {
            console.error('SystemMessages no está disponible');
            return;
        }
        
        const systemMessages = new SystemMessages();
        systemMessages.confirm(
            '¿Estás seguro de que quieres vaciar la papelera? Esta acción no se puede deshacer.',
            'Vaciar Papelera',
            'jkhive-modal-msgs-e',
            async (confirmed, modal) => {
                if (!confirmed) {
                    // Si canceló, simplemente cerrar el modal
                    systemMessages.close(modal);
                    return;
                }
                
                // Si confirmó, ejecutar la acción y actualizar el modal
                try {
                    const response = await fetch(`${this.apiBase}?action=empty_trash`, {
                        method: 'POST'
                    });
                    
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    
                    const data = await response.json();
                    if (data.success) {
                        // Actualizar el modal existente con el resultado
                        systemMessages.updateModal(modal, {
                            type: 'success',
                            title: 'Papelera Vaciada',
                            message: 'La papelera se ha vaciado correctamente.',
                            icon: 'fas fa-check-circle',
                            buttons: [
                                { text: 'Aceptar', action: 'ok', primary: true }
                            ],
                            customClass: 'jkhive-modal-msgs-e'
                        });
                        
                        // Recargar mensajes después de un pequeño delay para asegurar que el servidor procesó
                        setTimeout(async () => {
                            await this.loadMessages('trash');
                        }, 300);
                    } else {
                        throw new Error(data.message || 'Error vaciando papelera');
                    }
                } catch (e) {
                    console.error('Error vaciando papelera:', e);
                    // Actualizar el modal existente con el error
                    systemMessages.updateModal(modal, {
                        type: 'error',
                        title: 'Error',
                        message: 'Error vaciando papelera: ' + e.message,
                        icon: 'fas fa-exclamation-circle',
                        buttons: [
                            { text: 'Aceptar', action: 'ok', primary: true }
                        ],
                        customClass: 'jkhive-modal-msgs-e'
                    });
                }
            }
        );
    }
    
    setupEventListeners() {
        // Formulario nuevo mensaje
        const newMessageForm = document.getElementById('newMessageForm');
        if (newMessageForm) {
            newMessageForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = {
                    subject: document.getElementById('newMessageSubject').value,
                    body: document.getElementById('newMessageBody').value,
                    attachments: document.getElementById('newMessageAttachments')?.files
                };
                await this.sendMessage(formData);
            });
        }
        
        // Formulario respuesta
        const replyForm = document.getElementById('replyForm');
        if (replyForm) {
            replyForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = {
                    subject: document.getElementById('replySubject').value,
                    body: document.getElementById('replyBody').value,
                    parent_id: parseInt(document.getElementById('replyParentId').value),
                    attachments: document.getElementById('replyAttachments')?.files
                };
                await this.sendMessage(formData);
            });
        }
    }
    
    // Eliminado: No hacemos polling constante de mensajes
    // Solo actualizamos cuando las notificaciones detectan nuevos mensajes
    
    openModal(modal) {
        // Aceptar tanto elemento como ID
        const modalEl = typeof modal === 'string' ? document.getElementById(modal) : modal;
        if (modalEl) {
            modalEl.style.display = 'flex';
            modalEl.classList.add('active', 'show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal(modalIdOrElement) {
        // Aceptar tanto ID como elemento
        const modal = typeof modalIdOrElement === 'string' 
            ? document.getElementById(modalIdOrElement) 
            : modalIdOrElement;
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active', 'show');
            document.body.style.overflow = '';
        }
    }
    
    showError(message) {
        if (typeof systemMessages !== 'undefined') {
            // Usar la clase 'jkhive-msgs-alerts' para el estilo correcto de mensajería (hexágono pequeño, botones estilizados, textura SVG)
            systemMessages.error(message, 'Error', 'jkhive-msgs-alerts');
        } else {
            alert(message);
        }
    }
    
    showSuccess(message) {
        if (typeof systemMessages !== 'undefined') {
            // Usar la clase 'jkhive-msgs-alerts' para el estilo correcto de mensajería
            systemMessages.success(message, 'Éxito', 'jkhive-msgs-alerts');
        } else {
            alert(message);
        }
    }
    
    /**
     * Mostrar error en el modal actual con transición (reducir hexágono a 1/4)
     */
    showErrorInModal(modalId, errorMessage) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            this.showError(errorMessage);
            return;
        }
        
        modal.setAttribute('data-state', 'error');
        const content = modal.querySelector('.jkhive-modal-content') || modal.querySelector('.jkhive-modal-message-content');
        if (!content) {
            this.showError(errorMessage);
            return;
        }
        
        // Agregar clase para transición suave
        content.classList.add('jkhive-modal-error-transition');
        
        // Transición suave: reducir a 1/4 del tamaño
        // También reducir altura proporcionalmente para mantener aspect-ratio del hexágono
        const reducedWidth = 230.16459375;
        const reducedHeight = reducedWidth * 1.1547; // aspect-ratio del hexágono
        setTimeout(() => {
            content.style.width = reducedWidth + 'px';
            content.style.minWidth = reducedWidth + 'px';
            content.style.maxWidth = reducedWidth + 'px';
            content.style.height = reducedHeight + 'px';
            content.style.minHeight = reducedHeight + 'px';
            content.style.maxHeight = reducedHeight + 'px';
            content.style.opacity = '0';
        }, 50);
        
        setTimeout(() => {
            // Actualizar a vista de error (1/4 del tamaño)
            content.innerHTML = `
                <div class="jkhive-modal-header jkhive-modal-error-header">
                    <div class="jkhive-modal-icon jkhive-modal-error-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <h2 class="jkhive-modal-title jkhive-modal-error-title">Error</h2>
                    <p class="jkhive-modal-description jkhive-modal-error-description">${this.escapeHtml(errorMessage)}</p>
                </div>
                <div class="jkhive-modal-actions jkhive-modal-error-actions">
                    <div class="jkhive-actionbutton-small">
                        <a href="#" class="jkhive-system-modal-btn" data-action="ok" style="text-decoration: none;">
                            <div class="jkhive-hex jkhive-hex-red">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <span class="jkhive-hex-text">Aceptar</span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            `;
            
            // Event listener para botón Aceptar
            const acceptBtn = content.querySelector('.jkhive-system-modal-btn');
            if (acceptBtn) {
                acceptBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeHexModal(modalId);
                });
            }
            
            // Transición suave: fade in
            setTimeout(() => {
                content.style.opacity = '1';
            }, 50);
        }, 600);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    nl2br(text) {
        return text.replace(/\n/g, '<br>');
    }
    
    formatFileSize(bytes) {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `Hace ${minutes} min`;
        if (hours < 24) return `Hace ${hours} h`;
        if (days < 7) return `Hace ${days} d`;
        
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    /**
     * Obtener usuario actual
     */
    getCurrentUser() {
        if (typeof AuthManager !== 'undefined' && AuthManager.currentUser) {
            return AuthManager.currentUser;
        }
        return null;
    }
    
    /**
     * Verificar si el usuario puede reenviar mensajes (solo admin y clerk)
     */
    canForwardMessage() {
        try {
            if (typeof AuthManager !== 'undefined' && AuthManager.currentUser) {
                const profileLevel = AuthManager.currentUser.profile_level || 0;
                const profileSlug = AuthManager.currentUser.profile_slug || '';
                // Solo admin (nivel 3) puede reenviar, NO clerk
                return profileLevel >= 3 || profileSlug === 'administrator';
            }
        } catch (e) {
            console.error('Error verificando permisos de reenvío:', e);
        }
        return false;
    }
    
    /**
     * Verificar si es administrador
     */
    isAdmin() {
        try {
            if (typeof AuthManager !== 'undefined' && AuthManager.currentUser) {
                const profileLevel = AuthManager.currentUser.profile_level || 0;
                const profileSlug = AuthManager.currentUser.profile_slug || '';
                return profileLevel >= 3 || profileSlug === 'administrator';
            }
        } catch (e) {
            console.error('Error verificando si es admin:', e);
        }
        return false;
    }
    
    /**
     * Verificar si es clerk
     */
    isClerk() {
        try {
            if (typeof AuthManager !== 'undefined' && AuthManager.currentUser) {
                const profileLevel = AuthManager.currentUser.profile_level || 0;
                const profileSlug = AuthManager.currentUser.profile_slug || '';
                return profileLevel === 2 || profileSlug === 'clerk';
            }
        } catch (e) {
            console.error('Error verificando si es clerk:', e);
        }
        return false;
    }
    
    /**
     * Obtener lista de usuarios disponibles
     */
    async getUsers() {
        try {
            // Intentar primero el endpoint de mensajería (disponible para clerks y admins)
            let response = await fetch(`${this.apiBase}?action=get_messaging_users`, {
                method: 'GET',
                credentials: 'same-origin'
            });
            
            // JK Hive: lista de usuarios vía get_messaging_users únicamente
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Respuesta del API de usuarios:', data);
            if (data.success) {
                const users = data.data || [];
                console.log('Usuarios obtenidos:', users);
                return users;
            }
            console.warn('API de usuarios no devolvió success:', data);
            return [];
        } catch (e) {
            console.error('Error obteniendo usuarios:', e);
            return [];
        }
    }
    
    /**
     * Obtener solo el usuario administrador (para clientes que no pueden acceder a la lista completa)
     */
    async getAdministratorUser() {
        try {
            const response = await fetch(`${this.apiBase}?action=get_admin`, {
                method: 'GET',
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            if (data.success && data.data) {
                return data.data;
            }
            throw new Error(data.message || 'No se pudo obtener el administrador');
        } catch (e) {
            console.error('Error obteniendo administrador:', e);
            throw e;
        }
    }
    
    /**
     * Reenviar mensaje
     */
    async forwardMessage(messageId) {
        try {
            const message = this.messages.find(m => m.id === messageId);
            if (!message) {
                // Intentar cargar el mensaje
                const response = await fetch(`${this.apiBase}?action=read&id=${messageId}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                if (!data.success) throw new Error(data.message || 'Error cargando mensaje');
                await this.showNewMessageModalHex(data.data.message, true);
            } else {
                await this.showNewMessageModalHex(message, true);
            }
        } catch (e) {
            console.error('Error reenviando mensaje:', e);
            this.showError('Error al reenviar el mensaje');
        }
    }
    
    /**
     * Archivar mensaje desde la vista
     */
    async archiveMessage(messageId) {
        try {
            const message = this.messages.find(m => m.id === messageId);
            if (!message) {
                // Intentar cargar el mensaje
                const response = await fetch(`${this.apiBase}?action=read&id=${messageId}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                if (!data.success) throw new Error(data.message || 'Error cargando mensaje');
                message = data.data.message;
            }
            
            // Obtener el root_message_id del chat
            const chatInfo = message.chat_info || {};
            const rootId = chatInfo.root_message_id || message.root_message_id || message.id;
            
            const form = new FormData();
            form.append('message_ids', JSON.stringify([rootId]));
            form.append('action', 'archive');
            
            const response = await fetch(`${this.apiBase}?action=bulk`, {
                method: 'POST',
                body: form
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            if (data.success) {
                this.showSuccess('Chat archivado');
                this.closeMessageView();
                // Cambiar a la carpeta de destino (archivados)
                await this.loadMessages('archived');
            } else {
                throw new Error(data.message || 'Error archivando');
            }
        } catch (e) {
            console.error('Error archivando mensaje:', e);
            this.showError('Error al archivar el mensaje');
        }
    }
    
    /**
     * Eliminar mensaje desde la vista
     */
    deleteMessageFromView(messageId) {
        const isTrash = this.currentFolder === 'trash';
        const toastConfirmMsg = isTrash
            ? '¿Eliminar este chat definitivamente? Esta acción no se puede deshacer.'
            : '¿Mover este chat a la papelera?';

        if (window.JKHIVE_MESSAGES_SHOWCASE_UI && typeof showActionConfirmToast === 'function') {
            const viewModal = document.getElementById('messageViewModalHex');
            const anchor =
                viewModal &&
                viewModal.querySelector('.messaging-modal-actions-centered a[data-tooltip="Eliminar"]');
            if (anchor) {
                showActionConfirmToast({
                    message: toastConfirmMsg,
                    anchorEl: anchor,
                    positionMode: 'modal-center',
                    variant: 'delete',
                    confirmAriaLabel: isTrash ? 'Eliminar definitivamente' : 'Mover a papelera',
                    onConfirm: async () => {
                        try {
                            let msgObj = this.messages.find(m => m.id === messageId);
                            if (!msgObj) {
                                const response = await fetch(`${this.apiBase}?action=read&id=${messageId}`);
                                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                                const data = await response.json();
                                if (!data.success) throw new Error(data.message || 'Error cargando mensaje');
                                msgObj = data.data.message;
                            }
                            const chatInfo = msgObj.chat_info || {};
                            const rootId = chatInfo.root_message_id || msgObj.root_message_id || msgObj.id;
                            const form = new FormData();
                            form.append('message_ids', JSON.stringify([rootId]));
                            form.append('action', 'delete');
                            form.append('current_folder', this.currentFolder);
                            const response = await fetch(`${this.apiBase}?action=bulk`, {
                                method: 'POST',
                                body: form,
                            });
                            if (!response.ok) throw new Error(`HTTP ${response.status}`);
                            const data = await response.json();
                            if (!data.success) throw new Error(data.message || 'Error eliminando');
                            const okText = isTrash
                                ? 'Chat eliminado definitivamente.'
                                : 'Chat movido a la papelera.';
                            if (typeof toast === 'function') {
                                toast({
                                    type: 'B',
                                    state: 'success',
                                    message: okText,
                                    anchorEl: anchor,
                                });
                            }
                            this.closeHexModal('messageViewModalHex');
                            this.closeMessageView();
                            await this.loadMessages('inbox');
                        } catch (err) {
                            console.error('Error eliminando chat:', err);
                            if (typeof toast === 'function') {
                                toast({
                                    type: 'B',
                                    state: 'error',
                                    message: err.message || 'No se pudo completar la acción',
                                    anchorEl: anchor,
                                });
                            } else {
                                this.showError(err.message || 'Error al eliminar');
                            }
                        }
                    },
                });
                return;
            }
        }

        if (typeof SystemMessages === 'undefined') {
            this.performDelete(messageId);
            return;
        }

        const systemMessages = new SystemMessages();
        const title = isTrash ? 'Eliminar Chat Definitivamente' : 'Mover Chat a Papelera';
        const message = isTrash
            ? '¿Estás seguro de que quieres eliminar este chat definitivamente? Esta acción no se puede deshacer.'
            : '¿Estás seguro de que quieres mover este chat a la papelera?';
        const modalClass = isTrash ? 'jkhive-modal-msgs-e' : 'jkhive-modal-msgs-vp';
        
        systemMessages.confirm(
            message,
            title,
            modalClass,
            async (confirmed, modal) => {
                if (!confirmed) {
                    systemMessages.close(modal);
                    return;
                }
                
                try {
                    // Obtener mensaje
                    let message = this.messages.find(m => m.id === messageId);
                    if (!message) {
                        const response = await fetch(`${this.apiBase}?action=read&id=${messageId}`);
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);
                        const data = await response.json();
                        if (!data.success) throw new Error(data.message || 'Error cargando mensaje');
                        message = data.data.message;
                    }
                    
                    // Obtener el root_message_id del chat
                    const chatInfo = message.chat_info || {};
                    const rootId = chatInfo.root_message_id || message.root_message_id || message.id;
                    
                    const form = new FormData();
                    form.append('message_ids', JSON.stringify([rootId]));
                    form.append('action', 'delete');
                    form.append('current_folder', this.currentFolder);
                    
                    const response = await fetch(`${this.apiBase}?action=bulk`, {
                        method: 'POST',
                        body: form
                    });
                    
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    
                    const data = await response.json();
                    if (data.success) {
                        const successMessage = isTrash 
                            ? 'Chat eliminado definitivamente.'
                            : 'Chat movido a la papelera.';
                        
                        // Actualizar el modal con el resultado
                        systemMessages.updateModal(modal, {
                            type: 'success',
                            title: isTrash ? 'Chat Eliminado' : 'Chat Movido',
                            message: successMessage,
                            icon: 'fas fa-check-circle',
                            buttons: [
                                { text: 'Aceptar', action: 'ok', primary: true }
                            ],
                            customClass: modalClass
                        });
                        
                        // Agregar listener personalizado al botón "Aceptar" después de actualizar el modal
                        setTimeout(() => {
                            const acceptBtn = modal.querySelector('.jkhive-system-modal-btn[data-action="ok"]');
                            if (acceptBtn) {
                                // Remover listeners anteriores y agregar uno nuevo
                                const newBtn = acceptBtn.cloneNode(true);
                                acceptBtn.parentNode.replaceChild(newBtn, acceptBtn);
                                
                                newBtn.addEventListener('click', async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    
                                    // Cerrar el modal de confirmación
                                    systemMessages.close(modal);
                                    
                                    // Cerrar el modal hexagonal de visualización de mensaje si está abierto
                                    const messageViewModal = document.getElementById('messageViewModalHex');
                                    if (messageViewModal) {
                                        this.closeHexModal('messageViewModalHex');
                                    }
                                    
                                    // Cerrar también el modal antiguo si existe
                                    this.closeMessageView();
                                    
                                    // Redirigir a la bandeja de entrada y recargar mensajes
                                    await this.loadMessages('inbox');
                                });
                            }
                        }, 100);
                    } else {
                        throw new Error(data.message || 'Error eliminando');
                    }
                } catch (e) {
                    console.error('Error eliminando chat:', e);
                    systemMessages.updateModal(modal, {
                        type: 'error',
                        title: 'Error',
                        message: 'Error al eliminar el chat: ' + e.message,
                        icon: 'fas fa-exclamation-circle',
                        buttons: [
                            { text: 'Aceptar', action: 'ok', primary: true }
                        ],
                        customClass: modalClass
                    });
                }
            }
        );
    }
    
    /**
     * Mostrar confirmación de eliminación en el mismo modal con transición suave
     */
    showDeleteConfirmationInModal(modal, messageId) {
        const content = modal.querySelector('.jkhive-modal-content');
        if (!content) return;
        
        const isTrash = this.currentFolder === 'trash';
        const title = isTrash ? 'Eliminar Chat Definitivamente' : 'Mover a Papelera';
        const message = isTrash 
            ? '¿Estás seguro de que quieres eliminar este chat definitivamente? Esta acción no se puede deshacer.'
            : '¿Estás seguro de que quieres mover este chat a la papelera?';
        
        // Guardar contenido original para poder restaurarlo si cancela
        const originalContent = content.innerHTML;
        
        // Ocultar contenido inmediatamente
        content.style.opacity = '0';
        content.style.visibility = 'hidden';
        
        setTimeout(() => {
            // Calcular tamaño reducido (similar a confirmación de envío)
            const originalWidth = content.offsetWidth;
            const originalHeight = content.offsetHeight;
            const reducedWidth = originalWidth * 0.35; // 35% del tamaño original
            const reducedHeight = originalHeight * 0.35;
            
            // Cambiar contenido a confirmación
            content.innerHTML = `
                <div class="jkhive-modal-header">
                    <div class="jkhive-modal-icon" style="color: var(--jk-accent-red);">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                </div>
                <div class="jkhive-modal-body">
                    <h3 class="jkhive-modal-title">${title}</h3>
                    <p class="jkhive-modal-description">${message}</p>
                </div>
                <div class="jkhive-modal-actions jkhive-modal-success-actions" style="display: flex; gap: 1rem; justify-content: center;">
                    <div class="jkhive-actionbutton-med">
                        <a href="#" class="jkhive-delete-confirm-btn" data-action="confirm" style="text-decoration: none;">
                            <div class="jkhive-hex">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <span class="jkhive-hex-text">${isTrash ? 'Eliminar' : 'Mover a Papelera'}</span>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="jkhive-actionbutton-med">
                        <a href="#" class="jkhive-delete-cancel-btn" data-action="cancel" style="text-decoration: none;">
                            <div class="jkhive-hex">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <span class="jkhive-hex-text">Cancelar</span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            `;
            
            // Ajustar tamaño
            content.style.width = reducedWidth + 'px';
            content.style.minWidth = reducedWidth + 'px';
            content.style.maxWidth = reducedWidth + 'px';
            content.style.height = reducedHeight + 'px';
            content.style.minHeight = reducedHeight + 'px';
            content.style.maxHeight = reducedHeight + 'px';
            
            // Mostrar contenido
            setTimeout(() => {
                content.style.visibility = 'visible';
                content.style.opacity = '1';
            }, 50);
            
            // Configurar listeners
            const confirmBtn = content.querySelector('.jkhive-delete-confirm-btn');
            const cancelBtn = content.querySelector('.jkhive-delete-cancel-btn');
            
            if (confirmBtn) {
                confirmBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await this.performDeleteInModal(modal, messageId);
                });
            }
            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Restaurar contenido original
                    content.innerHTML = originalContent;
                    // Restaurar tamaño original
                    content.style.width = '';
                    content.style.minWidth = '';
                    content.style.maxWidth = '';
                    content.style.height = '';
                    content.style.minHeight = '';
                    content.style.maxHeight = '';
                    // Reconfigurar listeners del modal original
                    this.setupMessageModalListeners(modal);
                });
            }
        }, 50);
    }
    
    /**
     * Ejecutar eliminación desde el modal con transición a confirmación
     */
    async performDeleteInModal(modal, messageId) {
        try {
            const content = modal.querySelector('.jkhive-modal-content');
            if (!content) return;
            
            // Obtener mensaje
            const message = this.messages.find(m => m.id === messageId);
            if (!message) {
                const response = await fetch(`${this.apiBase}?action=read&id=${messageId}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                if (!data.success) throw new Error(data.message || 'Error cargando mensaje');
                message = data.data.message;
            }
            
            // Obtener el root_message_id del chat
            const chatInfo = message.chat_info || {};
            const rootId = chatInfo.root_message_id || message.root_message_id || message.id;
            
            const form = new FormData();
            form.append('message_ids', JSON.stringify([rootId]));
            form.append('action', 'delete');
            
            const response = await fetch(`${this.apiBase}?action=bulk`, {
                method: 'POST',
                body: form
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            if (data.success) {
                // Verificar si se eliminó definitivamente o solo se movió a papelera
                const isTrash = this.currentFolder === 'trash';
                const successMessage = isTrash ? 'Chat eliminado definitivamente' : 'Chat movido a la papelera';
                
                // Mostrar confirmación de éxito en el mismo modal
                this.showSuccessInModal(modal, successMessage);
                
                // Cambiar a la carpeta de destino según la acción
                const destinationFolder = isTrash ? this.currentFolder : 'trash';
                
                // Cerrar modal y recargar mensajes de la carpeta de destino después de un delay
                setTimeout(async () => {
                    this.closeHexModal('messageViewModalHex');
                    await this.loadMessages(destinationFolder);
                }, 2000);
            } else {
                throw new Error(data.message || 'Error eliminando');
            }
        } catch (e) {
            console.error('Error eliminando mensaje:', e);
            this.showErrorInModal(modal, 'Error al eliminar el mensaje');
        }
    }
    
    /**
     * Mostrar éxito en el modal con transición suave
     */
    showSuccessInModal(modal, message) {
        const content = modal.querySelector('.jkhive-modal-content');
        if (!content) return;
        
        // Ocultar contenido
        content.style.opacity = '0';
        content.style.visibility = 'hidden';
        
        setTimeout(() => {
            // Calcular tamaño reducido
            const originalWidth = content.offsetWidth;
            const originalHeight = content.offsetHeight;
            const reducedWidth = originalWidth * 0.35;
            const reducedHeight = originalHeight * 0.35;
            
            // Cambiar a mensaje de éxito
            content.innerHTML = `
                <div class="jkhive-modal-header">
                    <div class="jkhive-modal-icon" style="color: var(--jk-accent-green);">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
                <div class="jkhive-modal-body">
                    <h3 class="jkhive-modal-title">${message}</h3>
                </div>
                <div class="jkhive-modal-actions jkhive-modal-success-actions" style="display: flex; gap: 1rem; justify-content: center;">
                    <div class="jkhive-actionbutton-med">
                        <a href="#" class="jkhive-success-ok-btn" style="text-decoration: none;">
                            <div class="jkhive-hex">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <span class="jkhive-hex-text">Aceptar</span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            `;
            
            // Ajustar tamaño
            content.style.width = reducedWidth + 'px';
            content.style.minWidth = reducedWidth + 'px';
            content.style.maxWidth = reducedWidth + 'px';
            content.style.height = reducedHeight + 'px';
            content.style.minHeight = reducedHeight + 'px';
            content.style.maxHeight = reducedHeight + 'px';
            
            // Mostrar contenido
            setTimeout(() => {
                content.style.visibility = 'visible';
                content.style.opacity = '1';
            }, 50);
            
            // Listener para botón Aceptar
            const okBtn = content.querySelector('.jkhive-success-ok-btn');
            if (okBtn) {
                okBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeHexModal('messageViewModalHex');
                });
            }
        }, 50);
    }
    
    /**
     * Mostrar error en el modal con transición suave
     */
    showErrorInModal(modal, message) {
        const content = modal.querySelector('.jkhive-modal-content');
        if (!content) return;
        
        // Similar a showSuccessInModal pero con icono de error y color rojo
        content.style.opacity = '0';
        content.style.visibility = 'hidden';
        
        setTimeout(() => {
            const originalWidth = content.offsetWidth;
            const originalHeight = content.offsetHeight;
            const reducedWidth = originalWidth * 0.35;
            const reducedHeight = originalHeight * 0.35;
            
            content.innerHTML = `
                <div class="jkhive-modal-header">
                    <div class="jkhive-modal-icon" style="color: var(--jk-accent-red);">
                        <i class="fas fa-times-circle"></i>
                    </div>
                </div>
                <div class="jkhive-modal-body">
                    <h3 class="jkhive-modal-title">${message}</h3>
                </div>
                <div class="jkhive-modal-actions jkhive-modal-error-actions" style="display: flex; gap: 1rem; justify-content: center;">
                    <div class="jkhive-actionbutton-med">
                        <a href="#" class="jkhive-error-ok-btn" style="text-decoration: none;">
                            <div class="jkhive-hex">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <span class="jkhive-hex-text">Aceptar</span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            `;
            
            content.style.width = reducedWidth + 'px';
            content.style.minWidth = reducedWidth + 'px';
            content.style.maxWidth = reducedWidth + 'px';
            content.style.height = reducedHeight + 'px';
            content.style.minHeight = reducedHeight + 'px';
            content.style.maxHeight = reducedHeight + 'px';
            
            setTimeout(() => {
                content.style.visibility = 'visible';
                content.style.opacity = '1';
            }, 50);
            
            const okBtn = content.querySelector('.jkhive-error-ok-btn');
            if (okBtn) {
                okBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeHexModal('messageViewModalHex');
                });
            }
        }, 50);
    }
    
    /**
     * Configurar listeners del modal de mensaje (para restaurar después de cancelar)
     */
    setupMessageModalListeners(modal) {
        // Esta función se puede expandir si es necesario restaurar listeners específicos
        // Por ahora, los listeners principales están en el HTML generado
    }
    
    /**
     * Ejecutar eliminación de mensaje
     */
    async performDelete(messageId) {
        try {
            const message = this.messages.find(m => m.id === messageId);
            if (!message) {
                // Intentar cargar el mensaje
                const response = await fetch(`${this.apiBase}?action=read&id=${messageId}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                if (!data.success) throw new Error(data.message || 'Error cargando mensaje');
                message = data.data.message;
            }
            
            // Obtener el root_message_id del chat
            const chatInfo = message.chat_info || {};
            const rootId = chatInfo.root_message_id || message.root_message_id || message.id;
            
            const form = new FormData();
            form.append('message_ids', JSON.stringify([rootId]));
            form.append('action', 'delete');
            
            const response = await fetch(`${this.apiBase}?action=bulk`, {
                method: 'POST',
                body: form
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            if (data.success) {
                const message = this.currentFolder === 'trash' ? 'Chat eliminado definitivamente' : 'Chat movido a la papelera';
                this.showSuccess(message);
                this.closeMessageView();
                // Cambiar a la carpeta de destino según la acción
                const destinationFolder = this.currentFolder === 'trash' ? this.currentFolder : 'trash';
                await this.loadMessages(destinationFolder);
            } else {
                throw new Error(data.message || 'Error eliminando');
            }
        } catch (e) {
            console.error('Error eliminando mensaje:', e);
            this.showError('Error al eliminar el mensaje');
        }
    }
    
    /**
     * Cierra replyModalHex con transición jk-hive-3danimation-1 cuando la vista lectura sigue abierta detrás (showcase).
     */
    async closeReplyModalHexAnimated(modalId = 'replyModalHex') {
        const replyModal = document.getElementById(modalId);
        const viewModal = document.getElementById('messageViewModalHex');
        if (
            modalId === 'replyModalHex' &&
            window.JKHIVE_MESSAGES_SHOWCASE_UI &&
            typeof window.JKHive3dAnimation1 !== 'undefined' &&
            replyModal &&
            viewModal &&
            document.body.contains(viewModal) &&
            document.body.contains(replyModal)
        ) {
            await window.JKHive3dAnimation1.messagingCloseReply(viewModal, replyModal);
        }
        this.closeHexModal(modalId);
    }

    /**
     * Mostrar modal hexagonal para responder
     */
    async showReplyModalHex(messageId) {
        try {
            // Cargar el mensaje completo si no está disponible
            let message = this.messages.find(m => m.id === messageId);
            if (!message) {
                const response = await fetch(`${this.apiBase}?action=read&id=${messageId}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                if (!data.success) throw new Error(data.message || 'Error cargando mensaje');
                message = data.data.message;
            }
            
            // Obtener el root_message_id del mensaje actual
            const chatInfo = message.chat_info || {};
            const rootMessageId = chatInfo.root_message_id || message.root_message_id || message.id;
            
            // SIEMPRE cargar el mensaje raíz para obtener TODOS los destinatarios originales del chat
            // Esto es crítico porque el mensaje actual puede ser una respuesta que solo tiene
            // al remitente del mensaje anterior, no todos los destinatarios originales
            let rootMessage = null;
            try {
                const rootResponse = await fetch(`${this.apiBase}?action=read&id=${rootMessageId}`);
                if (rootResponse.ok) {
                    const rootData = await rootResponse.json();
                    if (rootData.success) {
                        rootMessage = rootData.data.message;
                        console.log('DEBUG: Mensaje raíz cargado:', rootMessage);
                    } else {
                        console.error('DEBUG: Error cargando mensaje raíz:', rootData.message);
                    }
                } else {
                    console.error('DEBUG: Error HTTP al cargar mensaje raíz:', rootResponse.status);
                }
            } catch (e) {
                console.error('DEBUG: Excepción al cargar mensaje raíz:', e);
            }
            
            // Usar el mensaje raíz si está disponible, sino usar el mensaje actual
            const sourceMessage = rootMessage || message;
            console.log('DEBUG: sourceMessage usado:', {
                id: sourceMessage.id,
                from_user: sourceMessage.from_user,
                to_user: sourceMessage.to_user,
                cc_users: sourceMessage.cc_users
            });
            
            // Obtener usuario actual
            const currentUser = this.getCurrentUser();
            const isAdmin = this.isAdmin();
            const isClerk = this.isClerk();
            const canAddRecipients = isAdmin || isClerk;
            
            // Solo obtener usuarios si el usuario puede agregar destinatarios (admin/clerk)
            // Los clientes no necesitan la lista de usuarios, solo los destinatarios del mensaje original
            let users = [];
            if (canAddRecipients) {
                try {
                    users = await this.getUsers();
                } catch (e) {
                    console.warn('No se pudieron obtener usuarios para el dropdown, continuando sin ellos:', e);
                    users = [];
                }
            }
            
            // Obtener TODOS los destinatarios del mensaje raíz (el mensaje original del chat)
            const originalFromUser = sourceMessage.from_user || {};
            const originalToUser = sourceMessage.to_user || {};
            const originalCcUsers = sourceMessage.cc_users || [];
            
            // DEBUG: Log para ver qué estamos recibiendo
            console.log('DEBUG showReplyModalHex:', {
                sourceMessageId: sourceMessage.id,
                rootMessageId: rootMessageId,
                originalFromUser: originalFromUser,
                originalToUser: originalToUser,
                originalCcUsers: originalCcUsers
            });
            
            // Construir lista de todos los destinatarios originales
            // En una respuesta, debemos incluir:
            // 1. El remitente original (from_user) - siempre
            // 2. Todos los destinatarios originales (to_user + cc_users) - todos
            const allOriginalRecipients = [];
            const currentUserId = currentUser ? currentUser.id : null;
            
            // Agregar el remitente original (from_user) - siempre debe estar en la respuesta
            if (originalFromUser && originalFromUser.id && originalFromUser.id !== currentUserId) {
                allOriginalRecipients.push({
                    id: originalFromUser.id,
                    name: originalFromUser.username || originalFromUser.email || 'Usuario',
                    username: originalFromUser.username || '',
                    email: originalFromUser.email || '',
                    profile_slug: originalFromUser.profile_slug || '',
                    profile_level: originalFromUser.profile_level || 0
                });
            }
            
            // Agregar destinatario principal (to_user) - excluir al usuario actual
            if (originalToUser && originalToUser.id && originalToUser.id !== currentUserId) {
                const alreadyIncluded = allOriginalRecipients.find(r => r.id === originalToUser.id);
                if (!alreadyIncluded) {
                    allOriginalRecipients.push({
                        id: originalToUser.id,
                        name: originalToUser.username || originalToUser.email || 'Usuario',
                        username: originalToUser.username || '',
                        email: originalToUser.email || '',
                        profile_slug: originalToUser.profile_slug || '',
                        profile_level: originalToUser.profile_level || 0
                    });
                }
            }
            
            // Agregar destinatarios CC - excluir al usuario actual
            if (Array.isArray(originalCcUsers) && originalCcUsers.length > 0) {
                originalCcUsers.forEach(ccUser => {
                    if (ccUser && ccUser.id && ccUser.id !== currentUserId) {
                        const alreadyIncluded = allOriginalRecipients.find(r => r.id === ccUser.id);
                        if (!alreadyIncluded) {
                            allOriginalRecipients.push({
                                id: ccUser.id,
                                name: ccUser.username || ccUser.email || 'Usuario',
                                username: ccUser.username || '',
                                email: ccUser.email || '',
                                profile_slug: ccUser.profile_slug || '',
                                profile_level: ccUser.profile_level || 0
                            });
                        }
                    }
                });
            }
            
            // Los destinatarios finales ya están filtrados (sin el usuario actual)
            const initialToUsers = allOriginalRecipients;
            
            console.log('DEBUG: Destinatarios finales para respuesta:', {
                allOriginalRecipients: allOriginalRecipients,
                currentUserId: currentUserId,
                initialToUsers: initialToUsers
            });
            
            // Guardar destinatarios originales para comparar después (necesario para detectar si se quitó al cliente)
            const originalRecipientsIds = allOriginalRecipients.map(r => r.id);
            
            // Identificar si hay un cliente y el admin en los destinatarios originales
            // Un cliente es alguien que NO es admin ni clerk
            let originalClientId = null;
            let originalAdminId = null;
            
            // Primero, verificar desde los datos del mensaje original (más confiable)
            // Verificar from_user
            if (originalFromUser && originalFromUser.id && originalFromUser.id !== currentUserId) {
                const profileSlug = originalFromUser.profile_slug || '';
                const profileLevel = originalFromUser.profile_level || 0;
                if (profileSlug === 'administrator' || profileLevel >= 3) {
                    originalAdminId = originalFromUser.id;
                } else if (profileSlug !== 'administrator' && profileLevel < 2) {
                    originalClientId = originalFromUser.id;
                }
            }
            
            // Verificar to_user
            if (originalToUser && originalToUser.id && originalToUser.id !== currentUserId) {
                const profileSlug = originalToUser.profile_slug || '';
                const profileLevel = originalToUser.profile_level || 0;
                if ((profileSlug === 'administrator' || profileLevel >= 3) && !originalAdminId) {
                    originalAdminId = originalToUser.id;
                } else if (profileSlug !== 'administrator' && profileLevel < 2 && !originalClientId) {
                    originalClientId = originalToUser.id;
                }
            }
            
            // Verificar cc_users
            if (Array.isArray(originalCcUsers) && originalCcUsers.length > 0) {
                for (const ccUser of originalCcUsers) {
                    if (ccUser && ccUser.id && ccUser.id !== currentUserId) {
                        const profileSlug = ccUser.profile_slug || '';
                        const profileLevel = ccUser.profile_level || 0;
                        if ((profileSlug === 'administrator' || profileLevel >= 3) && !originalAdminId) {
                            originalAdminId = ccUser.id;
                        } else if (profileSlug !== 'administrator' && profileLevel < 2 && !originalClientId) {
                            originalClientId = ccUser.id;
                        }
                    }
                }
            }
            
            // Si aún no encontramos el admin, buscar en el array de usuarios (fallback)
            if (!originalAdminId && users && users.length > 0) {
                for (const recipient of allOriginalRecipients) {
                    if (recipient.id === currentUserId) continue;
                    const recipientUser = users.find(u => u.id === recipient.id || u.id === parseInt(recipient.id));
                    if (recipientUser) {
                        const profileSlug = recipientUser.profile_slug || '';
                        const profileLevel = recipientUser.profile_level || 0;
                        if (profileSlug === 'administrator' || profileLevel >= 3) {
                            originalAdminId = recipient.id;
                            break;
                        }
                    }
                }
            }
            
            // Debug: Log para verificar que se guarda correctamente
            console.log('DEBUG generateRecipientsHeader: Admin ID guardado:', originalAdminId);
            
            // Crear modal con nueva estructura hexagonal
            const modalId = 'replyModalHex';
            const modal = document.createElement('div');
            modal.className = 'jkhive-modal jkhive-modal-msgs-write';
            modal.id = modalId;
            modal.setAttribute('data-state', 'reply');
            // Guardar información en el modal para uso posterior
            modal.setAttribute('data-parent-id', message.id);
            modal.setAttribute('data-original-client-id', originalClientId || '');
            modal.setAttribute('data-original-admin-id', originalAdminId || '');
            
            // Debug: Log para verificar que se guarda correctamente
            console.log('DEBUG removeRecipient: Admin ID guardado:', originalAdminId);
            
            // Obtener usuario actual (siempre es el "De")
            const currentUserName = currentUser ? (currentUser.username || currentUser.email || 'Usuario') : 'Usuario';
            
            // Pre-llenar asunto con "Re: " + asunto original
            const replySubject = 'Re: ' + (message.subject || '');
            
            modal.innerHTML = `
                <div class="jkhive-modal-overlay" onclick="event.preventDefault(); messagingSystem.closeReplyModalHexAnimated('${modalId}');"></div>
                <div class="jkhive-modal-content jkhive-modal-hex">
                    <!-- HEADER (25%) -->
                    <div class="jkhive-modal-header">
                        <!-- Parte superior: Favicon (Responder) -->
                        <div class="jkhive-modal-header-top">
                            <div class="jkhive-modal-header-icon">
                                <i class="fas fa-reply"></i>
                            </div>
                        </div>
                        <!-- Parte inferior: De/Para (Base de la pirámide - 60% altura) -->
                        <div class="jkhive-modal-header-bottom">
                            <!-- Columna "De" (40% ancho) - Ajustada al lado derecho -->
                            <div class="jkhive-modal-header-from">
                                <div class="jkhive-modal-header-from-label">De:</div>
                                <div class="jkhive-modal-header-from-user">
                                    <span class="recipient-bullet from-user">${this.escapeHtml(currentUserName)}</span>
                                </div>
                            </div>
                            <!-- Columna "Para" (60% ancho) - Ajustada al lado izquierdo, horizontal -->
                            <div class="jkhive-modal-header-to">
                                <div class="jkhive-modal-header-to-label">Para:</div>
                                ${canAddRecipients ? `
                                <div class="add-recipient-badge-wrapper">
                                    <div class="jkhive-hex-badge jkhive-hex-badge-cyan add-recipient-badge" data-tooltip="Agregar destinatario" aria-label="Agregar destinatario">
                                        <i class="fas fa-plus"></i>
                                    </div>
                                    <div id="${modalId}-recipient-dropdown" class="recipient-users-dropdown">
                                        ${this.generateRecipientCategoryMenu(modalId)}
                                    </div>
                                </div>
                                ` : ''}
                                <div class="jkhive-modal-header-to-bullets" id="${modalId}-to-bullets">
                                    ${initialToUsers.map(u => {
                                        const userName = typeof u === 'object' ? (u.name || u.username || u.email || 'Usuario') : u;
                                        const userId = typeof u === 'object' ? (u.id || null) : null;
                                        const canRemove = canAddRecipients;
                                        return `<span class="recipient-bullet" data-user-id="${userId || ''}" data-user-name="${this.escapeHtml(userName)}">
                                            ${this.escapeHtml(userName)}
                                            ${canRemove ? `<span class="remove-bullet" onclick="event.stopPropagation(); messagingSystem.removeRecipient('${modalId}', '${userId || ''}', 'to');">×</span>` : ''}
                                        </span>`;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- BODY (50%) -->
                    <div class="jkhive-modal-body">
                        <form id="replyFormHex">
                            <input type="hidden" id="replyParentIdHex" value="${message.id}">
                            <input type="hidden" id="${modalId}-to-users-input" name="to_users" value="">
                            <input type="hidden" id="${modalId}-cc-users-input" name="cc_users" value="">
                            <!-- Asunto -->
                            <div class="jkhive-modal-body-subject">
                                <input type="text" id="replySubjectHex" class="form-control" value="${this.escapeHtml(replySubject)}" required placeholder="Asunto del mensaje">
                            </div>
                            <!-- Mensaje -->
                            <div class="jkhive-modal-body-message">
                                <textarea id="replyBodyHex" class="form-control" required placeholder="Escribe tu respuesta..."></textarea>
                                <!-- Botón adjuntar y contenedor de adjuntos -->
                                <div class="jkhive-modal-body-attach">
                                    <div class="jkhive-hex-badge jkhive-hex-badge-honey attach-file-badge" data-tooltip="Adjuntar archivo" aria-label="Adjuntar archivo">
                                        <i class="fas fa-paperclip"></i>
                                    </div>
                                    <div class="jkhive-modal-body-attachments" id="${modalId}-attachments-container"></div>
                                </div>
                            </div>
                            <input type="file" id="${modalId}-attachments-input" multiple style="display: none;" accept="*/*">
                        </form>
                    </div>
                    
                    <!-- FOOTER (25%) - Estructura simplificada -->
                    <div class="jkhive-modal-footer">
                        <!-- Botones Cancelar y Aceptar - Capa superior (visibles por defecto) -->
                        <div class="jkhive-modal-footer-top">
                            <!-- Cancelar -->
                            <div class="jkhive-modal-footer-top-left">
                                <div class="jkhive-actionbutton-med">
                                    <a href="#" class="jkhive-system-modal-btn" data-action="cancel" style="text-decoration: none;">
                                        <div class="jkhive-hex jkhive-hex-honey">
                                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                                <span class="jkhive-hex-text">Cancelar</span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <!-- Aceptar/Enviar -->
                            <div class="jkhive-modal-footer-top-right">
                                <div class="jkhive-actionbutton-med">
                                    <a href="#" class="jkhive-system-modal-btn" data-action="send" style="text-decoration: none;">
                                        <div class="jkhive-hex jkhive-hex-honey">
                                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                                <span class="jkhive-hex-text">Enviar</span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <!-- Botón Salir - Capa base (oculto por defecto, centrado) -->
                        <div class="jkhive-modal-footer-bottom">
                            <div class="jkhive-actionbutton-med">
                                <a href="#" class="jkhive-system-modal-btn" data-action="exit" style="text-decoration: none;">
                                    <div class="jkhive-hex jkhive-hex-honey">
                                        <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                            <span class="jkhive-hex-text">Salir</span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Guardar usuarios en el modal para acceso posterior
            modal._messagingUsers = users;
            
            // Event listeners
            for (const btn of modal.querySelectorAll('.jkhive-system-modal-btn')) {
                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const action = btn.getAttribute('data-action');
                    if (action === 'send') {
                        await this.handleReplySubmit(modal, message.id, modalId);
                    } else {
                        await this.closeReplyModalHexAnimated(modalId);
                    }
                });
            }
            
            // Event listeners para bullets y acciones - NUEVO MODAL WRITE
            this.setupRecipientsListenersWrite(modal, modalId, users, isAdmin);
            
            // Inicializar datos de destinatarios desde los bullets iniciales
            setTimeout(() => {
                this.updateRecipientsData(modalId);
            }, 100);
            
            // Ajustar altura del textarea dinámicamente
            setTimeout(() => {
                const textarea = modal.querySelector('#replyBodyHex');
                if (textarea) {
                    const messageContainer = modal.querySelector('.jkhive-modal-body-message');
                    if (messageContainer) {
                        const containerHeight = messageContainer.offsetHeight;
                        const subjectHeight = modal.querySelector('.jkhive-modal-body-subject')?.offsetHeight || 0;
                        const attachHeight = modal.querySelector('.jkhive-modal-body-attach')?.offsetHeight || 0;
                        const availableHeight = containerHeight - subjectHeight - attachHeight - 20; // 20px de padding/margin
                        textarea.style.height = Math.max(availableHeight, 100) + 'px';
                    }
                }
            }, 100);
            
            const viewModalPref = document.getElementById('messageViewModalHex');
            if (
                window.JKHIVE_MESSAGES_SHOWCASE_UI &&
                typeof window.JKHive3dAnimation1 !== 'undefined' &&
                viewModalPref &&
                document.body.contains(viewModalPref)
            ) {
                await window.JKHive3dAnimation1.messagingOpenReply(viewModalPref, modal);
            } else {
                modal.style.display = 'flex';
                modal.classList.add('active', 'show');
                document.body.style.overflow = 'hidden';
            }
        } catch (e) {
            console.error('Error mostrando modal de respuesta:', e);
            this.showError('Error al abrir el formulario de respuesta');
        }
    }
    
    /**
     * Mostrar modal hexagonal para nuevo mensaje
     */
    async showNewMessageModalHex(prefilledMessage = null, isForward = false) {
        // Si hay un modal de mensaje abierto, cerrarlo primero
        const existingMessageModal = document.getElementById('messageViewModalHex');
        if (existingMessageModal) {
            this.closeHexModal('messageViewModalHex');
        }
        try {
            // Obtener usuario actual primero
            const currentUser = this.getCurrentUser();
            const isAdmin = this.isAdmin();
            const isClerk = this.isClerk();
            const canAddRecipients = isAdmin || isClerk;
            
            // Obtener usuarios según el tipo de usuario
            let users = [];
            let adminUser = null;
            
            if (canAddRecipients) {
                // Admin/clerk: obtener todos los usuarios para el dropdown
                try {
                    users = await this.getUsers();
                } catch (e) {
                    console.warn('No se pudieron obtener usuarios para el dropdown, continuando sin ellos:', e);
                    users = [];
                }
            } else {
                // Cliente: obtener SOLO el administrador (no necesita lista de usuarios)
                try {
                    adminUser = await this.getAdministratorUser();
                } catch (e) {
                    console.error('ERROR: No se pudo obtener el administrador para el cliente:', e);
                    // Si falla, mostrar error pero continuar (el bullet no aparecerá)
                }
            }
            
            // Obtener usuario actual (siempre es el "De")
            const currentUserName = currentUser ? (currentUser.username || currentUser.email || 'Usuario') : 'Usuario';
            
            // Para nuevo mensaje, cliente siempre envía al admin
            // Si es admin/clerk, puede seleccionar destinatario
            let initialToUsers = [];
            if (!canAddRecipients) {
                // Cliente: SIEMPRE debe tener "JK Hive" como destinatario
                if (adminUser) {
                    initialToUsers = [{
                        id: adminUser.id,
                        name: 'JK Hive' // Mostrar como "JK Hive" en vez del nombre del usuario
                    }];
                } else {
                    console.error('ERROR CRÍTICO: No se pudo encontrar el usuario administrador para el cliente');
                }
            }
            
            // Si es reenvío, pre-llenar con el contenido del mensaje original
            let prefilledSubject = '';
            let prefilledBody = '';
            if (isForward && prefilledMessage) {
                prefilledSubject = 'Fwd: ' + (prefilledMessage.subject || '');
                prefilledBody = `\n\n---------- Mensaje reenviado ----------\nDe: ${(prefilledMessage.from_user || {}).username || 'Usuario'}\nFecha: ${this.formatDate(prefilledMessage.created_at)}\nAsunto: ${prefilledMessage.subject || ''}\n\n${prefilledMessage.body || ''}\n`;
            }
            
            // Crear modal con nueva estructura
            const modalId = 'newMessageModalHex';
            const modal = document.createElement('div');
            modal.className = 'jkhive-modal jkhive-modal-msgs-write';
            modal.id = modalId;
            modal.setAttribute('data-state', 'compose'); // Estados: compose, success
            
            modal.innerHTML = `
                <div class="jkhive-modal-overlay" onclick="messagingSystem.closeHexModal('${modalId}')"></div>
                <div class="jkhive-modal-content jkhive-modal-hex">
                    <!-- HEADER (25%) -->
                    <div class="jkhive-modal-header">
                        <!-- Parte superior: Favicon -->
                        <div class="jkhive-modal-header-top">
                            <div class="jkhive-modal-header-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                        </div>
                        <!-- Parte inferior: De/Para (Base de la pirámide - 60% altura) -->
                        <div class="jkhive-modal-header-bottom">
                            <!-- Columna "De" (40% ancho) - Ajustada al lado derecho -->
                            <div class="jkhive-modal-header-from">
                                <div class="jkhive-modal-header-from-label">De:</div>
                                <div class="jkhive-modal-header-from-user">
                                    <span class="recipient-bullet from-user">${this.escapeHtml(currentUserName)}</span>
                                </div>
                            </div>
                            <!-- Columna "Para" (60% ancho) - Ajustada al lado izquierdo, horizontal -->
                            <div class="jkhive-modal-header-to">
                                <div class="jkhive-modal-header-to-label">Para:</div>
                                ${canAddRecipients ? `
                                <div class="add-recipient-badge-wrapper">
                                    <div class="jkhive-hex-badge jkhive-hex-badge-cyan add-recipient-badge" data-tooltip="Agregar destinatario" aria-label="Agregar destinatario">
                                        <i class="fas fa-plus"></i>
                                    </div>
                                    <div id="${modalId}-recipient-dropdown" class="recipient-users-dropdown">
                                        ${this.generateRecipientCategoryMenu(modalId)}
                                    </div>
                                </div>
                                ` : ''}
                                <div class="jkhive-modal-header-to-bullets" id="${modalId}-to-bullets">
                                    ${initialToUsers.map(u => {
                                        const userName = typeof u === 'object' ? (u.name || u.username || u.email || 'Usuario') : u;
                                        const userId = typeof u === 'object' ? (u.id || null) : null;
                                        const canRemove = canAddRecipients;
                                        return `<span class="recipient-bullet" data-user-id="${userId || ''}" data-user-name="${this.escapeHtml(userName)}">
                                            ${this.escapeHtml(userName)}
                                            ${canRemove ? `<span class="remove-bullet" onclick="event.stopPropagation(); messagingSystem.removeRecipient('${modalId}', '${userId || ''}', 'to');">×</span>` : ''}
                                        </span>`;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- BODY (50%) -->
                    <div class="jkhive-modal-body">
                        <form id="newMessageFormHex">
                            <input type="hidden" id="${modalId}-to-users-input" name="to_users" value="">
                            <input type="hidden" id="${modalId}-cc-users-input" name="cc_users" value="">
                            <!-- Asunto -->
                            <div class="jkhive-modal-body-subject">
                                <input type="text" id="newMessageSubjectHex" class="form-control" value="${this.escapeHtml(prefilledSubject)}" required placeholder="Asunto del mensaje">
                            </div>
                            <!-- Mensaje -->
                            <div class="jkhive-modal-body-message">
                                <textarea id="newMessageBodyHex" class="form-control" required placeholder="Escribe tu mensaje...">${this.escapeHtml(prefilledBody)}</textarea>
                                <!-- Botón adjuntar y contenedor de adjuntos -->
                                <div class="jkhive-modal-body-attach">
                                    <div class="jkhive-hex-badge jkhive-hex-badge-honey attach-file-badge" data-tooltip="Adjuntar archivo" aria-label="Adjuntar archivo">
                                        <i class="fas fa-paperclip"></i>
                                    </div>
                                    <div class="jkhive-modal-body-attachments" id="${modalId}-attachments-container"></div>
                                </div>
                            </div>
                            <input type="file" id="${modalId}-attachments-input" multiple style="display: none;" accept="*/*">
                        </form>
                    </div>
                    
                    <!-- FOOTER (25%) - Estructura simplificada -->
                    <div class="jkhive-modal-footer">
                        <!-- Botones Cancelar y Aceptar - Capa superior (visibles por defecto) -->
                        <div class="jkhive-modal-footer-top">
                            <!-- Cancelar -->
                            <div class="jkhive-modal-footer-top-left">
                                <div class="jkhive-actionbutton-med">
                                    <a href="#" class="jkhive-system-modal-btn" data-action="cancel" style="text-decoration: none;">
                                        <div class="jkhive-hex jkhive-hex-honey">
                                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                                <span class="jkhive-hex-text">Cancelar</span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <!-- Aceptar/Enviar -->
                            <div class="jkhive-modal-footer-top-right">
                                <div class="jkhive-actionbutton-med">
                                    <a href="#" class="jkhive-system-modal-btn" data-action="send" style="text-decoration: none;">
                                        <div class="jkhive-hex jkhive-hex-honey">
                                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                                <span class="jkhive-hex-text">Enviar</span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <!-- Botón Salir - Capa base (oculto por defecto, centrado) -->
                        <div class="jkhive-modal-footer-bottom">
                            <div class="jkhive-actionbutton-med">
                                <a href="#" class="jkhive-system-modal-btn" data-action="exit" style="text-decoration: none;">
                                    <div class="jkhive-hex jkhive-hex-honey">
                                        <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                            <span class="jkhive-hex-text">Salir</span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Guardar usuarios en el modal para acceso posterior
            modal._messagingUsers = users;
            
            // Event listeners
            modal.querySelectorAll('.jkhive-system-modal-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const action = btn.getAttribute('data-action');
                    if (action === 'send') {
                        await this.handleNewMessageSubmit(modal, modalId);
                    } else if (action === 'exit') {
                        this.closeHexModal(modalId);
                    } else {
                        this.closeHexModal(modalId);
                    }
                });
            });
            
            // Event listeners para bullets y acciones - NUEVO MODAL WRITE
            this.setupRecipientsListenersWrite(modal, modalId, users, isAdmin);
            
            // Inicializar datos de destinatarios desde los bullets iniciales
            setTimeout(() => {
                this.updateRecipientsData(modalId);
            }, 100);
            
            // Mostrar modal
            modal.style.display = 'flex';
            modal.classList.add('active', 'show');
            document.body.style.overflow = 'hidden';
            
            // Asegurar que el textarea se ajuste al tamaño disponible
            setTimeout(() => {
                const textarea = modal.querySelector('#newMessageBodyHex');
                if (textarea) {
                    const bodyContainer = modal.querySelector('.jkhive-modal-body-message');
                    if (bodyContainer) {
                        const availableHeight = bodyContainer.clientHeight - 50; // Espacio para el botón adjuntar
                        textarea.style.height = `${Math.max(availableHeight, 100)}px`;
                    }
                }
            }, 200);
        } catch (e) {
            console.error('Error mostrando modal de nuevo mensaje:', e);
            this.showError('Error al abrir el formulario de nuevo mensaje');
        }
    }
    
    /**
     * Generar header de destinatarios con bullets (dos columnas centradas)
     */
    generateRecipientsHeader(fromUserName, toUsers = [], canAddRecipients, isAdmin, isClerk, users, modalId, type = 'reply', originalAdminId = null) {
        const fromColumn = `
            <div class="recipient-column">
                <div class="recipient-label">De:</div>
                <div class="recipient-bullets-container">
                    <span class="recipient-bullet from-user">${this.escapeHtml(fromUserName)}</span>
                    ${type === 'reply' ? `<div id="${modalId}-subject-container"></div>` : ''}
                </div>
            </div>
        `;
        
        const toColumn = `
            <div class="recipient-column">
                <div class="recipient-label-wrapper">
                    <div class="recipient-label">Para:</div>
                    ${canAddRecipients ? `
                    <div class="jkhive-actionbutton-small add-recipient-btn-wrapper">
                        <a href="#" class="add-recipient-btn" onclick="event.preventDefault(); messagingSystem.toggleRecipientDropdown('${modalId}'); return false;" data-tooltip="Agregar destinatario" aria-label="Agregar destinatario">
                            <div class="jkhive-hex jkhive-hex-cyan">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <i class="jkhive-hex-icon fas fa-plus"></i>
                                </div>
                            </div>
                        </a>
                        <div id="${modalId}-recipient-dropdown" class="recipient-users-dropdown">
                            ${this.generateRecipientUsersList(users, modalId)}
                        </div>
                    </div>
                    ` : ''}
                </div>
                <div class="recipient-bullets-container" id="${modalId}-to-bullets">
                    ${toUsers.map(u => {
                        const userName = typeof u === 'object' ? (u.name || u.username || u.email || 'Usuario') : u;
                        const userId = typeof u === 'object' ? (u.id || null) : null;
                        
                        // Verificar si este usuario específico es administrador
                        // Primero verificar si coincide con el originalAdminId (más confiable)
                        let isAdminUser = false;
                        if (originalAdminId && userId) {
                            isAdminUser = parseInt(originalAdminId) === parseInt(userId);
                        }
                        
                        // Si no se encontró por originalAdminId, verificar directamente en el objeto del usuario
                        if (!isAdminUser && typeof u === 'object' && u) {
                            const profileSlug = u.profile_slug || '';
                            const profileLevel = u.profile_level || 0;
                            isAdminUser = profileSlug === 'administrator' || profileLevel >= 3;
                        }
                        
                        // Si aún no se encontró, buscar en el array de usuarios (fallback)
                        if (!isAdminUser && userId && users && Array.isArray(users) && users.length > 0) {
                            const userObj = users.find(us => {
                                const usId = us.id || us.user_id;
                                const targetId = parseInt(userId);
                                return parseInt(usId) === targetId;
                            });
                            if (userObj) {
                                const profileSlug = userObj.profile_slug || '';
                                const profileLevel = userObj.profile_level || 0;
                                isAdminUser = profileSlug === 'administrator' || profileLevel >= 3;
                            }
                        }
                        
                        // Determinar si se puede quitar:
                        // - Si el usuario es administrador: NADIE puede quitarlo (no mostrar "x")
                        // - Si el usuario NO es administrador: mostrar "x" si el usuario actual tiene permisos
                        const canRemove = canAddRecipients && !isAdminUser;
                        const removeButton = canRemove 
                            ? `<span class="remove-bullet" onclick="event.stopPropagation(); messagingSystem.removeRecipient('${modalId}', '${userId || ''}', 'to');">×</span>`
                            : '';
                        // Agregar atributo data-is-admin para verificación posterior
                        return `<span class="recipient-bullet" data-user-id="${userId || ''}" data-user-name="${this.escapeHtml(userName)}" data-is-admin="${isAdminUser ? '1' : '0'}">
                            ${this.escapeHtml(userName)}
                            ${removeButton}
                        </span>`;
                    }).join('')}
                </div>
                <div class="messaging-form-actions-compact">
                    <div class="jkhive-actionbutton-small">
                        <a href="#" class="attach-file-btn" data-tooltip="Adjuntar archivo" aria-label="Adjuntar archivo">
                            <div class="jkhive-hex jkhive-hex-honey">
                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                    <i class="jkhive-hex-icon fas fa-paperclip"></i>
                                </div>
                            </div>
                        </a>
                    </div>
                    ${canAddRecipients ? `
                        <div class="jkhive-actionbutton-small cc-users-dropdown-wrapper">
                            <a href="#" class="add-cc-btn" onclick="event.preventDefault(); messagingSystem.toggleCcDropdown('${modalId}'); return false;" data-tooltip="Agregar CC" aria-label="Agregar CC">
                                <div class="jkhive-hex jkhive-hex-honey">
                                    <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                        <i class="jkhive-hex-icon fas fa-user-plus"></i>
                                    </div>
                                </div>
                            </a>
                            <div id="${modalId}-cc-dropdown" class="cc-users-dropdown">
                                ${this.generateCcUsersList(users, modalId)}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        return fromColumn + toColumn;
    }
    
    /**
     * Generar menú de categorías (JK Hive / Clientes)
     */
    generateRecipientCategoryMenu(modalId) {
        return `
            <div class="recipient-category-menu">
                <div class="recipient-category-item" data-category="jkhive" data-modal-id="${modalId}">
                    <i class="fas fa-users"></i>
                    JK Hive
                </div>
                <div class="recipient-category-item" data-category="clientes" data-modal-id="${modalId}">
                    <i class="fas fa-user-tie"></i>
                    Clientes
                </div>
            </div>
        `;
    }
    
    /**
     * Mostrar usuarios por categoría seleccionada
     */
    showRecipientUsersByCategory(modalId, category) {
        // Obtener el array de usuarios del contexto del modal
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error('Modal no encontrado:', modalId);
            return;
        }
        
        // Obtener usuarios guardados en el modal
        const users = modal._messagingUsers || [];
        
        if (users.length === 0) {
            console.warn('No hay usuarios disponibles en el modal');
            const dropdown = document.querySelector(`#${modalId}-recipient-dropdown`);
            if (dropdown) {
                dropdown.innerHTML = `
                    <div class="recipient-user-item" style="padding: 0.75rem 1rem; color: var(--jk-text-secondary, rgba(255, 255, 255, 0.5)); text-align: center;">
                        No hay usuarios disponibles
                    </div>
                    <div class="recipient-back-item" data-modal-id="${modalId}">
                        <i class="fas fa-arrow-left"></i>
                        Volver
                    </div>
                `;
                // Agregar listener al botón volver
                const backItem = dropdown.querySelector('.recipient-back-item');
                if (backItem) {
                    backItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.showRecipientCategoryMenu(modalId);
                    });
                }
            }
            return;
        }
        
        this.renderRecipientUsersList(modalId, users, category);
    }
    
    /**
     * Renderizar lista de usuarios filtrados por categoría
     */
    renderRecipientUsersList(modalId, users, category) {
        const currentUser = this.getCurrentUser();
        const currentUserId = currentUser ? currentUser.id : null;
        
        // Obtener usuarios ya agregados en "Para"
        const toBulletsContainer = document.querySelector(`#${modalId}-to-bullets`);
        const addedUserIds = new Set();
        if (toBulletsContainer) {
            toBulletsContainer.querySelectorAll('.recipient-bullet[data-user-id]').forEach(bullet => {
                const userId = bullet.getAttribute('data-user-id');
                if (userId) addedUserIds.add(parseInt(userId));
            });
        }
        
        // Filtrar usuarios según categoría
        let filteredUsers = users.filter(u => {
            // Excluir usuario actual
            if (u.id === currentUserId) {
                return false;
            }
            
            // Excluir usuarios ya agregados en "Para"
            if (addedUserIds.has(u.id)) {
                return false;
            }
            
            // Filtrar por categoría
            const profileSlug = u.profile_slug || '';
            const profileLevel = u.profile_level || 0;
            
            if (category === 'jkhive') {
                // JK Hive: administradores y colaboradores (internos)
                // Administradores: profileLevel >= 3 o profile_slug === 'administrator'
                // Colaboradores: profileLevel === 2 o profile_slug === 'clerk'
                // Asegurar que incluya tanto administradores como clerks
                const isAdministrator = profileSlug === 'administrator' || profileLevel >= 3;
                const isClerk = profileSlug === 'clerk' || profileLevel === 2;
                return isAdministrator || isClerk;
            } else if (category === 'clientes') {
                // Clientes: profileLevel < 2 y no es administrator ni clerk
                return (profileLevel < 2 && profileSlug !== 'administrator' && profileSlug !== 'clerk');
            }
            
            return false;
        });
        
        const dropdown = document.querySelector(`#${modalId}-recipient-dropdown`);
        if (!dropdown) return;
        
        // Guardar categoría actual en el dropdown
        dropdown.setAttribute('data-current-category', category);
        
        if (filteredUsers.length === 0) {
            dropdown.innerHTML = `
                <div class="recipient-user-item" style="padding: 0.75rem 1rem; color: var(--jk-text-secondary, rgba(255, 255, 255, 0.5)); text-align: center; font-size: 0.75rem;">
                    No hay usuarios disponibles en esta categoría
                </div>
                <div class="recipient-back-item" data-modal-id="${modalId}">
                    <i class="fas fa-arrow-left"></i>
                    Volver
                </div>
            `;
            // Agregar listener al botón volver
            const backItem = dropdown.querySelector('.recipient-back-item');
            if (backItem) {
                backItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showRecipientCategoryMenu(modalId);
                });
            }
            return;
        }
        
        const usersHtml = filteredUsers.map(u => {
            const userName = u.name || u.username || u.email || 'Usuario';
            const escapedUserName = this.escapeHtml(userName);
            const escapedEmail = u.email ? this.escapeHtml(u.email) : '';
            const userDisplay = escapedEmail ? `${escapedUserName} <span style="color: var(--jk-text-secondary, rgba(255, 255, 255, 0.5)); font-size: 0.85rem;">(${escapedEmail})</span>` : escapedUserName;
            return `
                <div class="recipient-user-item" data-user-id="${u.id}" data-user-name="${escapedUserName.replace(/'/g, "\\'")}" data-modal-id="${modalId}">
                    ${userDisplay}
                </div>
            `;
        }).join('');
        
        dropdown.innerHTML = usersHtml + `
            <div class="recipient-back-item" data-modal-id="${modalId}">
                <i class="fas fa-arrow-left"></i>
                Volver
            </div>
        `;
        
        // Agregar listeners a los items de usuario y al botón volver
        dropdown.querySelectorAll('.recipient-user-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const userId = item.getAttribute('data-user-id');
                const userName = item.getAttribute('data-user-name');
                this.addRecipientUser(modalId, userId, userName);
            });
        });
        
        const backItem = dropdown.querySelector('.recipient-back-item');
        if (backItem) {
            backItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showRecipientCategoryMenu(modalId);
            });
        }
    }
    
    /**
     * Mostrar menú de categorías (volver atrás)
     */
    showRecipientCategoryMenu(modalId) {
        const dropdown = document.querySelector(`#${modalId}-recipient-dropdown`);
        if (dropdown) {
            dropdown.innerHTML = this.generateRecipientCategoryMenu(modalId);
            // Limpiar categoría actual
            dropdown.removeAttribute('data-current-category');
            
            // Agregar listeners a los items de categoría
            dropdown.querySelectorAll('.recipient-category-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const category = item.getAttribute('data-category');
                    const itemModalId = item.getAttribute('data-modal-id');
                    if (category && itemModalId) {
                        this.showRecipientUsersByCategory(itemModalId, category);
                    }
                });
            });
        }
    }
    
    /**
     * Generar lista de usuarios para destinatarios principales (mantener para compatibilidad)
     */
    generateRecipientUsersList(users, modalId) {
        // Guardar usuarios en el modal para acceso posterior
        const modal = document.getElementById(modalId);
        if (modal) {
            modal._messagingUsers = users;
        }
        
        // Retornar el menú de categorías en lugar de la lista directa
        return this.generateRecipientCategoryMenu(modalId);
    }
    
    /**
     * Generar lista de usuarios para CC
     */
    generateCcUsersList(users, modalId) {
        const currentUser = this.getCurrentUser();
        const currentUserId = currentUser ? currentUser.id : null;
        
        // Obtener usuarios ya agregados en "Para"
        const toBulletsContainer = document.querySelector(`#${modalId}-to-bullets`);
        const addedUserIds = new Set();
        if (toBulletsContainer) {
            toBulletsContainer.querySelectorAll('.recipient-bullet[data-user-id]').forEach(bullet => {
                const userId = bullet.getAttribute('data-user-id');
                if (userId) addedUserIds.add(parseInt(userId));
            });
        }
        
        console.log('Usuarios recibidos para filtrar:', users);
        console.log('Usuario actual ID:', currentUserId);
        console.log('IDs de usuarios ya agregados:', Array.from(addedUserIds));
        
        // Filtrar usuarios: excluir usuario actual, admin (siempre está en todos los mensajes), y ya agregados
        const availableUsers = users.filter(u => {
            // Excluir usuario actual
            if (u.id === currentUserId) {
                console.log('Excluyendo usuario actual:', u.username || u.email);
                return false;
            }
            
            // Excluir admin (siempre está en todos los mensajes, no se muestra en CC)
            const profileSlug = u.profile_slug || '';
            const profileLevel = u.profile_level || 0;
            if (profileSlug === 'administrator' || profileLevel >= 3) {
                console.log('Excluyendo admin:', u.username || u.email);
                return false;
            }
            
            // Excluir usuarios ya agregados en "Para"
            if (addedUserIds.has(u.id)) {
                console.log('Excluyendo usuario ya agregado:', u.username || u.email);
                return false;
            }
            
            console.log('Usuario disponible para CC:', u.username || u.email);
            return true;
        });
        
        console.log('Usuarios disponibles después de filtrar:', availableUsers);
        
        if (availableUsers.length === 0) {
            return '<div class="cc-user-item" style="padding: 1rem; text-align: center; color: var(--jk-text-secondary);">No hay usuarios disponibles</div>';
        }
        
        return availableUsers.map(u => {
            const userName = u.username || u.email || 'Usuario';
            const isDisabled = addedUserIds.has(u.id);
            return `<div class="cc-user-item ${isDisabled ? 'disabled' : ''}" data-user-id="${u.id}" data-user-name="${this.escapeHtml(userName)}" onclick="if (!this.classList.contains('disabled')) messagingSystem.addCcUser('${modalId}', ${u.id}, '${this.escapeHtml(userName)}');">
                ${this.escapeHtml(userName)}
            </div>`;
        }).join('');
    }
    
    /**
     * Generar HTML del formulario de respuesta
     */
    generateReplyFormHtml(message, canAddRecipients, isAdmin, users, modalId) {
        const subject = 'Re: ' + (message.subject || '');
        
        return `
            <form id="replyFormHex">
                <input type="hidden" id="replyParentIdHex" value="${message.id}">
                <input type="hidden" id="${modalId}-to-users-input" name="to_users" value="">
                <input type="hidden" id="${modalId}-cc-users-input" name="cc_users" value="">
                ${subject ? `
                    <div class="messaging-subject-compact" style="display: none;">
                        <span class="subject-label">Asunto:</span>
                        <span class="subject-text">${this.escapeHtml(subject)}</span>
                    </div>
                ` : ''}
                <div class="form-group">
                    <label for="replyBodyHex" class="form-label">Mensaje</label>
                    <textarea id="replyBodyHex" class="form-control" rows="8" required placeholder="Escribe tu respuesta..."></textarea>
                </div>
                <input type="file" id="${modalId}-attachments-input" multiple style="display: none;" accept="*/*">
                <div id="${modalId}-attachments-container" class="attachments-bullets-container"></div>
            </form>
        `;
    }
    
    /**
     * Generar HTML del formulario de nuevo mensaje (compacto)
     */
    generateNewMessageFormHtml(canAddRecipients, isAdmin, users, prefilledSubject = '', prefilledBody = '', modalId) {
        return `
            <form id="newMessageFormHex">
                <input type="hidden" id="${modalId}-to-users-input" name="to_users" value="">
                <input type="hidden" id="${modalId}-cc-users-input" name="cc_users" value="">
                ${canAddRecipients ? `
                    <div class="form-group">
                        <label for="newMessageSubjectHex" class="form-label">Asunto</label>
                        <input type="text" id="newMessageSubjectHex" class="form-control" value="${this.escapeHtml(prefilledSubject)}" required placeholder="Asunto del mensaje">
                    </div>
                ` : ''}
                <div class="form-group">
                    <label for="newMessageBodyHex" class="form-label">Mensaje</label>
                    <textarea id="newMessageBodyHex" class="form-control" rows="8" required placeholder="Escribe tu mensaje...">${this.escapeHtml(prefilledBody)}</textarea>
                </div>
                <input type="file" id="${modalId}-attachments-input" multiple style="display: none;" accept="*/*">
                <div id="${modalId}-attachments-container" class="attachments-bullets-container"></div>
            </form>
        `;
    }
    
    /**
     * Configurar listeners para bullets de destinatarios y acciones - NUEVO MODAL WRITE
     */
    setupRecipientsListenersWrite(modal, modalId, users, isAdmin) {
        // Remover bullets al hacer clic en X
        modal.querySelectorAll('.remove-bullet').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const bullet = btn.closest('.recipient-bullet');
                if (bullet) {
                    const userId = bullet.getAttribute('data-user-id');
                    this.removeRecipient(modalId, userId, 'to');
                }
            });
        });
        
        // Botón de adjuntar archivos - nuevo badge hexagonal
        const attachBadge = modal.querySelector('.attach-file-badge');
        const attachmentsInput = modal.querySelector(`#${modalId}-attachments-input`);
        const attachmentsContainer = modal.querySelector(`#${modalId}-attachments-container`);
        
        if (attachBadge && attachmentsInput) {
            attachBadge.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                attachmentsInput.click();
            });
            
            attachmentsInput.addEventListener('change', (e) => {
                e.stopPropagation();
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                    // Verificar archivos nuevos (que no estén ya en los bullets)
                    const existingFiles = new Set();
                    if (attachmentsContainer) {
                        attachmentsContainer.querySelectorAll('.attachment-bullet').forEach(bullet => {
                            existingFiles.add(bullet.getAttribute('data-file-name'));
                        });
                    }
                    
                    files.forEach(file => {
                        // Solo agregar si no existe ya
                        if (!existingFiles.has(file.name)) {
                            this.addAttachmentBullet(modalId, file);
                        }
                    });
                }
            });
        }
        
        // Badge de agregar destinatario
        const addRecipientBadge = modal.querySelector('.add-recipient-badge');
        const recipientDropdown = modal.querySelector(`#${modalId}-recipient-dropdown`);
        
        if (addRecipientBadge && recipientDropdown) {
            // Función para posicionar el dropdown de forma fija
            const positionDropdown = () => {
                if (recipientDropdown.classList.contains('show')) {
                    const badgeRect = addRecipientBadge.getBoundingClientRect();
                    recipientDropdown.style.top = `${badgeRect.bottom + window.scrollY + 8}px`;
                    recipientDropdown.style.left = `${badgeRect.left + window.scrollX}px`;
                }
            };
            
            // Toggle dropdown al hacer clic en el badge
            addRecipientBadge.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                recipientDropdown.classList.toggle('show');
                if (recipientDropdown.classList.contains('show')) {
                    positionDropdown();
                    // Reposicionar en scroll y resize
                    window.addEventListener('scroll', positionDropdown, true);
                    window.addEventListener('resize', positionDropdown);
                    recipientDropdown._positionHandlers = {
                        scroll: positionDropdown,
                        resize: positionDropdown
                    };
                } else {
                    // Remover listeners cuando se cierra
                    if (recipientDropdown._positionHandlers) {
                        window.removeEventListener('scroll', recipientDropdown._positionHandlers.scroll, true);
                        window.removeEventListener('resize', recipientDropdown._positionHandlers.resize);
                        delete recipientDropdown._positionHandlers;
                    }
                }
            });
            
            // También agregar listener al wrapper por si acaso
            const badgeWrapper = modal.querySelector('.add-recipient-badge-wrapper');
            if (badgeWrapper) {
                badgeWrapper.addEventListener('click', (e) => {
                    // Solo si el click es en el badge o wrapper, no en el dropdown
                    if (e.target.closest('.add-recipient-badge') || e.target === badgeWrapper) {
                        e.preventDefault();
                        e.stopPropagation();
                        recipientDropdown.classList.toggle('show');
                        if (recipientDropdown.classList.contains('show')) {
                            positionDropdown();
                            window.addEventListener('scroll', positionDropdown, true);
                            window.addEventListener('resize', positionDropdown);
                            recipientDropdown._positionHandlers = {
                                scroll: positionDropdown,
                                resize: positionDropdown
                            };
                        } else {
                            if (recipientDropdown._positionHandlers) {
                                window.removeEventListener('scroll', recipientDropdown._positionHandlers.scroll, true);
                                window.removeEventListener('resize', recipientDropdown._positionHandlers.resize);
                                delete recipientDropdown._positionHandlers;
                            }
                        }
                    }
                });
            }
            
            // Cerrar dropdown al hacer clic fuera
            const closeDropdownHandler = (e) => {
                if (!recipientDropdown.contains(e.target) && 
                    !addRecipientBadge.contains(e.target) && 
                    !badgeWrapper?.contains(e.target)) {
                    recipientDropdown.classList.remove('show');
                    // Remover listeners cuando se cierra
                    if (recipientDropdown._positionHandlers) {
                        window.removeEventListener('scroll', recipientDropdown._positionHandlers.scroll, true);
                        window.removeEventListener('resize', recipientDropdown._positionHandlers.resize);
                        delete recipientDropdown._positionHandlers;
                    }
                }
            };
            
            // Agregar listener temporal que se removerá cuando se cierre el modal
            document.addEventListener('click', closeDropdownHandler);
            
            // Guardar referencia para poder removerlo después
            modal._closeDropdownHandler = closeDropdownHandler;
        } else {
            console.warn('No se encontró addRecipientBadge o recipientDropdown:', { addRecipientBadge, recipientDropdown });
        }
        
        // Configurar listeners iniciales para el menú de categorías
        if (recipientDropdown) {
            // Función para configurar listeners de categorías
            const setupCategoryListeners = () => {
                recipientDropdown.querySelectorAll('.recipient-category-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const category = item.getAttribute('data-category');
                        const itemModalId = item.getAttribute('data-modal-id');
                        if (category && itemModalId) {
                            this.showRecipientUsersByCategory(itemModalId, category);
                        }
                    });
                });
            };
            
            // Configurar listeners iniciales después de que el DOM esté listo
            setTimeout(setupCategoryListeners, 100);
        }
        
        // Remover adjuntos
        if (attachmentsContainer) {
            attachmentsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-attachment')) {
                    e.preventDefault();
                    const bullet = e.target.closest('.attachment-bullet');
                    if (bullet) {
                        const fileName = bullet.getAttribute('data-file-name');
                        this.removeAttachment(modalId, fileName);
                    }
                }
            });
        }
    }
    
    /**
     * Configurar listeners para bullets de destinatarios y acciones
     */
    setupRecipientsListeners(modal, modalId, users, isAdmin) {
        // Remover bullets al hacer clic en X
        modal.querySelectorAll('.remove-bullet').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const bullet = btn.closest('.recipient-bullet');
                if (bullet) {
                    const userId = bullet.getAttribute('data-user-id');
                    this.removeRecipient(modalId, userId, 'to');
                }
            });
        });
        
        // Botón de adjuntar archivos
        const attachBtn = modal.querySelector('.attach-file-btn');
        const attachmentsInput = modal.querySelector(`#${modalId}-attachments-input`);
        const attachmentsContainer = modal.querySelector(`#${modalId}-attachments-container`);
        
        if (attachBtn && attachmentsInput) {
            attachBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // NO limpiar el valor del input aquí - solo abrir el diálogo
                attachmentsInput.click();
            });
            
            attachmentsInput.addEventListener('change', (e) => {
                e.stopPropagation();
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                    // Verificar archivos nuevos (que no estén ya en los bullets)
                    const existingFiles = new Set();
                    const container = document.querySelector(`#${modalId}-attachments-container`);
                    if (container) {
                        container.querySelectorAll('.attachment-bullet').forEach(bullet => {
                            existingFiles.add(bullet.getAttribute('data-file-name'));
                        });
                    }
                    
                    files.forEach(file => {
                        // Solo agregar si no existe ya
                        if (!existingFiles.has(file.name)) {
                            this.addAttachmentBullet(modalId, file);
                        }
                    });
                }
            });
        }
        
        // Agregar CC - Dropdown personalizado
        // Botón de agregar destinatario
        const addRecipientBtn = modal.querySelector('.add-recipient-btn');
        const recipientDropdown = modal.querySelector(`#${modalId}-recipient-dropdown`);
        
        if (addRecipientBtn && recipientDropdown) {
            // Cerrar dropdown al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!recipientDropdown.contains(e.target) && !addRecipientBtn.contains(e.target)) {
                    recipientDropdown.classList.remove('show');
                }
            });
        }
        
        // Botón de agregar CC
        const addCcBtn = modal.querySelector('.add-cc-btn');
        const ccDropdown = modal.querySelector(`#${modalId}-cc-dropdown`);
        
        if (addCcBtn && ccDropdown) {
            // Cerrar dropdown al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (!ccDropdown.contains(e.target) && !addCcBtn.contains(e.target)) {
                    ccDropdown.classList.remove('show');
                }
            });
        }
        
        // Remover adjuntos
        if (attachmentsContainer) {
            attachmentsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-attachment')) {
                    e.preventDefault();
                    const bullet = e.target.closest('.attachment-bullet');
                    if (bullet) {
                        const fileName = bullet.getAttribute('data-file-name');
                        this.removeAttachment(modalId, fileName);
                    }
                }
            });
        }
    }
    
    /**
     * Agregar bullet de adjunto
     */
    addAttachmentBullet(modalId, file) {
        const container = document.querySelector(`#${modalId}-attachments-container`);
        if (!container) return;
        
        const bullet = document.createElement('div');
        bullet.className = 'attachment-bullet';
        bullet.setAttribute('data-file-name', file.name);
        bullet.innerHTML = `
            <i class="fas fa-paperclip"></i>
            <span>${this.escapeHtml(file.name)}</span>
            <span class="remove-attachment">×</span>
        `;
        
        container.appendChild(bullet);
        
        // Si el contenedor está dentro del nuevo modal write, asegurar que se vea
        const modal = document.getElementById(modalId);
        if (modal && modal.classList.contains('jkhive-modal-msgs-write')) {
            // El contenedor ya está posicionado correctamente en el CSS
        }
    }
    
    /**
     * Remover bullet de adjunto
     */
    removeAttachment(modalId, fileName) {
        const container = document.querySelector(`#${modalId}-attachments-container`);
        if (!container) return;
        
        const bullet = container.querySelector(`.attachment-bullet[data-file-name="${this.escapeHtml(fileName)}"]`);
        if (bullet) {
            bullet.remove();
            
            // Actualizar el input de archivos
            const input = document.querySelector(`#${modalId}-attachments-input`);
            if (input) {
                const dt = new DataTransfer();
                Array.from(input.files).forEach(file => {
                    if (file.name !== fileName) {
                        dt.items.add(file);
                    }
                });
                input.files = dt.files;
            }
        }
    }
    
    /**
     * Toggle dropdown de CC
     */
    toggleRecipientDropdown(modalId) {
        const dropdown = document.querySelector(`#${modalId}-recipient-dropdown`);
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }
    
    toggleCcDropdown(modalId) {
        const dropdown = document.querySelector(`#${modalId}-cc-dropdown`);
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }
    
    /**
     * Agregar usuario como destinatario principal
     */
    addRecipientUser(modalId, userId, userName) {
        // Agregar como bullet en "Para"
        const toBulletsContainer = document.querySelector(`#${modalId}-to-bullets`);
        if (toBulletsContainer) {
            // Verificar si ya existe
            const existing = toBulletsContainer.querySelector(`.recipient-bullet[data-user-id="${userId}"]`);
            if (existing) return;
            
            const bullet = document.createElement('span');
            bullet.className = 'recipient-bullet';
            bullet.setAttribute('data-user-id', userId);
            bullet.setAttribute('data-user-name', userName);
            bullet.innerHTML = `
                ${this.escapeHtml(userName)}
                <span class="remove-bullet" onclick="event.stopPropagation(); messagingSystem.removeRecipient('${modalId}', '${userId}', 'to');">×</span>
            `;
            
            toBulletsContainer.appendChild(bullet);
        }
        
        // Actualizar datos
        this.updateRecipientsData(modalId);
        
        // Actualizar la lista de usuarios en la categoría actual si está abierta
        // Esto actualizará la lista para remover el usuario agregado
        const dropdown = document.querySelector(`#${modalId}-recipient-dropdown`);
        if (dropdown) {
            const currentCategory = dropdown.getAttribute('data-current-category');
            if (currentCategory) {
                const modal = document.getElementById(modalId);
                if (modal && modal._messagingUsers) {
                    // Actualizar la lista para reflejar que el usuario ya fue agregado
                    this.renderRecipientUsersList(modalId, modal._messagingUsers, currentCategory);
                }
            } else {
                // Si no hay categoría actual, volver al menú de categorías
                this.showRecipientCategoryMenu(modalId);
            }
        }
    }
    
    /**
     * Agregar usuario a CC
     */
    addCcUser(modalId, userId, userName) {
        // Agregar como bullet en "Para"
        const toBulletsContainer = document.querySelector(`#${modalId}-to-bullets`);
        if (toBulletsContainer) {
            // Verificar si ya existe
            const existing = toBulletsContainer.querySelector(`.recipient-bullet[data-user-id="${userId}"]`);
            if (existing) return;
            
            const bullet = document.createElement('span');
            bullet.className = 'recipient-bullet';
            bullet.setAttribute('data-user-id', userId);
            bullet.setAttribute('data-user-name', userName);
            bullet.innerHTML = `
                ${this.escapeHtml(userName)}
                <span class="remove-bullet" onclick="event.stopPropagation(); messagingSystem.removeRecipient('${modalId}', '${userId}', 'to');">×</span>
            `;
            
            toBulletsContainer.appendChild(bullet);
        }
        
        // Actualizar datos
        this.updateRecipientsData(modalId);
        
        // Cerrar dropdown
        this.toggleCcDropdown(modalId);
        
        // Actualizar estado del dropdown (deshabilitar usuario agregado)
        const dropdown = document.querySelector(`#${modalId}-cc-dropdown`);
        if (dropdown) {
            const userItem = dropdown.querySelector(`.cc-user-item[data-user-id="${userId}"]`);
            if (userItem) {
                userItem.classList.add('disabled');
            }
        }
    }
    
    /**
     * Remover destinatario
     */
    removeRecipient(modalId, userId, type) {
        // Verificar si el usuario que se intenta quitar es administrador
        // NADIE puede quitar al administrador de los destinatarios
        if (type === 'to' && userId) {
            // Obtener el bullet del usuario
            const bullet = document.querySelector(`#${modalId}-to-bullets .recipient-bullet[data-user-id="${userId}"]`);
            if (bullet) {
                // Verificar primero el atributo data-is-admin (más rápido y confiable)
                const isAdmin = bullet.getAttribute('data-is-admin') === '1';
                if (isAdmin) {
                    // Es el administrador: BLOQUEAR
                    this.showError('No puedes quitar al administrador de los destinatarios');
                    return;
                }
                
                // Verificar también por el ID del admin guardado en el modal (backup)
                const modal = document.getElementById(modalId);
                if (modal) {
                    const originalAdminId = modal.getAttribute('data-original-admin-id');
                    if (originalAdminId && originalAdminId !== '' && parseInt(originalAdminId) === parseInt(userId)) {
                        // Es el administrador: BLOQUEAR
                        this.showError('No puedes quitar al administrador de los destinatarios');
                        return;
                    }
                }
            }
        }
        
        const container = document.querySelector(`#${modalId}-${type}-bullets`);
        if (container) {
            const bullet = container.querySelector(`.recipient-bullet[data-user-id="${userId}"]`);
            if (bullet) {
                bullet.remove();
                
                // Actualizar datos
                this.updateRecipientsData(modalId);
                
                // Habilitar usuario en dropdown de CC si estaba deshabilitado
                const ccDropdown = document.querySelector(`#${modalId}-cc-dropdown`);
                if (ccDropdown) {
                    const ccUserItem = ccDropdown.querySelector(`.cc-user-item[data-user-id="${userId}"]`);
                    if (ccUserItem) {
                        ccUserItem.classList.remove('disabled');
                    }
                }
                
                // Habilitar usuario en dropdown de destinatarios principales si estaba deshabilitado
                const recipientDropdown = document.querySelector(`#${modalId}-recipient-dropdown`);
                if (recipientDropdown) {
                    const recipientUserItem = recipientDropdown.querySelector(`.recipient-user-item[data-user-id="${userId}"]`);
                    if (recipientUserItem) {
                        recipientUserItem.classList.remove('disabled');
                        recipientUserItem.style.opacity = '1';
                        recipientUserItem.style.cursor = 'pointer';
                    }
                }
            }
        }
    }
    
    /**
     * Actualizar datos de destinatarios desde los bullets
     */
    updateRecipientsData(modalId) {
        const toBulletsContainer = document.querySelector(`#${modalId}-to-bullets`);
        const toUsersInput = document.querySelector(`#${modalId}-to-users-input`);
        
        if (toBulletsContainer && toUsersInput) {
            const bullets = toBulletsContainer.querySelectorAll('.recipient-bullet[data-user-id]');
            const toUsers = Array.from(bullets).map(bullet => {
                const userId = bullet.getAttribute('data-user-id');
                const userName = bullet.getAttribute('data-user-name');
                return { id: parseInt(userId), name: userName };
            });
            
            toUsersInput.value = JSON.stringify(toUsers);
        }
    }
    
    /**
     * Manejar envío de respuesta
     */
    async handleReplySubmit(modal, parentId, modalId) {
        try {
            const body = document.getElementById('replyBodyHex').value.trim();
            if (!body) {
                this.showError('El mensaje no puede estar vacío');
                return;
            }
            
            // Obtener destinatarios desde los bullets
            const toUsersInput = document.querySelector(`#${modalId}-to-users-input`);
            const toUsers = toUsersInput ? JSON.parse(toUsersInput.value || '[]') : [];
            
            if (toUsers.length === 0) {
                this.showError('Debes seleccionar al menos un destinatario');
                return;
            }
            
            // El primer destinatario es el principal
            const toUserId = toUsers[0].id;
            
            // Obtener adjuntos del input
            const attachmentsInput = document.getElementById(`${modalId}-attachments-input`);
            const attachments = attachmentsInput?.files || [];
            
            // Obtener asunto del input del modal (puede haber sido modificado por el usuario)
            const subjectInput = document.getElementById('replySubjectHex');
            const subject = subjectInput ? subjectInput.value.trim() : (() => {
                // Fallback: obtener asunto del mensaje original
                const parentMessage = this.messages.find(m => m.id === parentId);
                return parentMessage ? ('Re: ' + (parentMessage.subject || '')) : 'Re: Mensaje';
            })();
            
            // Detectar si se quitó al cliente (para crear nuevo chat)
            // Solo aplica si el usuario es clerk (puede modificar destinatarios)
            const originalClientId = modal.getAttribute('data-original-client-id');
            const currentUser = this.getCurrentUser();
            const isClerk = this.isClerk();
            let createNewChat = false;
            
            if (isClerk && originalClientId && originalClientId !== '') {
                // Verificar si el cliente original ya no está en los destinatarios
                const clientStillIncluded = toUsers.some(u => u.id === parseInt(originalClientId));
                if (!clientStillIncluded) {
                    // Se quitó al cliente, crear nuevo chat
                    createNewChat = true;
                }
            }
            
            const formData = {
                subject: subject,
                body: body,
                parent_id: parentId,
                to_user_id: toUserId,
                cc_users: toUsers.slice(1).map(u => u.id), // Resto como CC
                attachments: attachments,
                create_new_chat: createNewChat // Flag para crear nuevo chat
            };
            
            await this.sendMessage(formData);

            const sendAnchor = modal.querySelector('.jkhive-system-modal-btn[data-action="send"]');
            const messageViewModal = document.getElementById('messageViewModalHex');
            const replyEl = document.getElementById(modalId);

            if (typeof toast === 'function' && window.JKHIVE_MESSAGES_SHOWCASE_UI && sendAnchor) {
                toast({
                    type: 'B',
                    state: 'success',
                    message: 'Mensaje enviado correctamente',
                    anchorEl: sendAnchor,
                });
            } else if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                systemMessages.success('Mensaje enviado correctamente', 'Mensaje Enviado', 'jkhive-msgs-alerts');
            }

            if (
                window.JKHIVE_MESSAGES_SHOWCASE_UI &&
                typeof window.JKHive3dAnimation1 !== 'undefined' &&
                messageViewModal &&
                replyEl
            ) {
                await window.JKHive3dAnimation1.messagingDismissSent(messageViewModal, replyEl);
            }

            this.closeHexModal(modalId);

            if (document.getElementById('messageViewModalHex')) {
                this.closeHexModal('messageViewModalHex');
            }

            await this.loadMessages('inbox');
        } catch (e) {
            console.error('Error enviando respuesta:', e);
            this.showError('Error al enviar la respuesta');
        }
    }
    
    /**
     * Manejar envío de nuevo mensaje
     */
    async handleNewMessageSubmit(modal, modalId) {
        try {
            const body = document.getElementById('newMessageBodyHex').value.trim();
            if (!body) {
                this.showError('El mensaje no puede estar vacío');
                return;
            }
            
            // Obtener destinatarios desde los bullets
            const toUsersInput = document.querySelector(`#${modalId}-to-users-input`);
            const toUsers = toUsersInput ? JSON.parse(toUsersInput.value || '[]') : [];
            
            if (toUsers.length === 0) {
                this.showError('Debes seleccionar al menos un destinatario');
                return;
            }
            
            // El primer destinatario es el principal
            const toUserId = toUsers[0].id;
            
            // Obtener asunto (si el usuario puede editarlo)
            const subjectInput = document.getElementById('newMessageSubjectHex');
            const subject = subjectInput ? subjectInput.value.trim() : '';
            
            // Obtener adjuntos del input
            const attachmentsInput = document.getElementById(`${modalId}-attachments-input`);
            const attachments = attachmentsInput?.files || [];
            
            const formData = {
                subject: subject,
                body: body,
                to_user_id: toUserId,
                cc_users: toUsers.slice(1).map(u => u.id), // Resto como CC
                attachments: attachments
            };
            
            // Enviar mensaje
            await this.sendMessage(formData);
            
            // Cerrar el modal de nuevo mensaje
            this.closeHexModal(modalId);

            const sendBtn = modal.querySelector('.jkhive-system-modal-btn[data-action="send"]');
            if (typeof toast === 'function' && window.JKHIVE_MESSAGES_SHOWCASE_UI && sendBtn) {
                toast({
                    type: 'B',
                    state: 'success',
                    message: 'Tu mensaje se ha enviado correctamente',
                    anchorEl: sendBtn,
                });
            } else if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                systemMessages.success('Tu mensaje se ha enviado correctamente', 'Mensaje Enviado', 'jkhive-msgs-alerts');
            }

            // Recargar mensajes
            await this.loadMessages(this.currentFolder);
        } catch (e) {
            console.error('Error enviando nuevo mensaje:', e);
            // Mostrar error usando SystemMessages
            if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                systemMessages.error('Error al enviar el mensaje: ' + (e.message || 'Error desconocido'));
            } else {
                this.showError('Error al enviar el mensaje: ' + (e.message || 'Error desconocido'));
            }
        }
    }
    
    /**
     * Cerrar modal hexagonal
     */
    closeHexModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            // Limpiar listeners del dropdown si existen
            if (modal._closeDropdownHandler) {
                document.removeEventListener('click', modal._closeDropdownHandler);
                delete modal._closeDropdownHandler;
            }
            
            // Limpiar listeners de posicionamiento del dropdown
            const recipientDropdown = modal.querySelector(`#${modalId}-recipient-dropdown`);
            if (recipientDropdown && recipientDropdown._positionHandlers) {
                window.removeEventListener('scroll', recipientDropdown._positionHandlers.scroll, true);
                window.removeEventListener('resize', recipientDropdown._positionHandlers.resize);
                delete recipientDropdown._positionHandlers;
            }
            
            modal.style.display = 'none';
            modal.classList.remove('active', 'show');
            document.body.style.overflow = '';
            // Remover del DOM después de un delay para permitir animaciones
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
    }
    
    /**
     * Mostrar mensaje en modal hexagonal
     */
    async showMessageModalHex(data) {
        try {
            const message = data.message;
            const thread = data.thread || [message];
            const attachments = data.attachments || [];
            
            const canForward = this.canForwardMessage();
            const modalId = 'messageViewModalHex';
            
            // Remover modal existente si hay uno
            const existingModal = document.getElementById(modalId);
            if (existingModal) {
                existingModal.remove();
            }
            
            // Crear modal
            const modal = document.createElement('div');
            modal.className = 'jkhive-modal jkhive-modal-msgs-form jkhive-modal-message-view';
            modal.id = modalId;
            modal.setAttribute('data-message-id', message.id);
            modal.setAttribute('data-state', 'view'); // Estados: view, reply, success
            
            // Obtener el asunto original del mensaje raíz (sin "Re:")
            const rootMessageId = (message.chat_info || {}).root_message_id || message.root_message_id || message.id;
            const rootId = rootMessageId; // Usar el mismo rootId para ambas cosas
            
            // Ordenar hilo cronológicamente
            const sortedThread = thread.sort((a, b) => {
                return new Date(a.created_at) - new Date(b.created_at);
            }).reverse();
            
            let originalSubject = 'Sin asunto';
            
            // Buscar el mensaje raíz en el thread
            const rootMessage = thread.find(m => m.id === rootMessageId);
            if (rootMessage && rootMessage.subject) {
                originalSubject = rootMessage.subject;
            } else if (message.subject) {
                // Si no se encuentra el raíz, usar el asunto del mensaje actual
                originalSubject = message.subject;
            }
            
            // Remover "Re:" del asunto si existe (puede aparecer en respuestas)
            originalSubject = originalSubject.replace(/^Re:\s*/i, '').trim();
            
            modal.innerHTML = `
                <div class="jkhive-modal-overlay" onclick="messagingSystem.closeHexModal('${modalId}')"></div>
                <div class="jkhive-modal-content jkhive-modal-hex jkhive-modal-message-content">
                    <div class="jkhive-modal-header">
                        <div class="jkhive-modal-icon" style="color: var(--jk-accent-cyan);">
                            <i class="fas fa-envelope-open"></i>
                        </div>
                    </div>
                    <div class="messaging-modal-actions-centered">
                        <div class="jkhive-actionbutton-small">
                            <a href="#" onclick="event.preventDefault(); messagingSystem.toggleStar(${message.id}, ${message.is_starred ? 0 : 1}); return false;" data-tooltip="${message.is_starred ? 'Destacado' : 'Destacar'}" aria-label="${message.is_starred ? 'Destacado' : 'Destacar'}">
                                <div class="jkhive-hex">
                                    <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                        <i class="jkhive-hex-icon fas fa-star ${message.is_starred ? 'starred' : ''}"></i>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="jkhive-actionbutton-small">
                            <a href="#" onclick="event.preventDefault(); messagingSystem.archiveMessage(${message.id}); return false;" data-tooltip="Archivar" aria-label="Archivar">
                                <div class="jkhive-hex">
                                    <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                        <i class="jkhive-hex-icon fas fa-archive"></i>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="jkhive-actionbutton-small">
                            <a href="#" onclick="event.preventDefault(); messagingSystem.deleteMessageFromView(${message.id}); return false;" data-tooltip="Eliminar" aria-label="Eliminar">
                                <div class="jkhive-hex">
                                    <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                        <i class="jkhive-hex-icon fas fa-trash"></i>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="messaging-modal-thread">
                        ${sortedThread.map((msg, idx) => {
                            const msgFrom = msg.from_user || {};
                            const msgTo = msg.to_user || {};
                            const ccUsers = msg.cc_users || [];
                            const isLatest = idx === 0;
                            
                            // Combinar destinatarios: to_user + cc_users
                            const allRecipients = [];
                            if (msgTo && msgTo.username) {
                                allRecipients.push(msgTo);
                            }
                            if (ccUsers && ccUsers.length > 0) {
                                allRecipients.push(...ccUsers);
                            }
                            
                            return `
                                <div class="messaging-thread-message ${isLatest ? 'messaging-thread-latest' : ''}">
                                    ${isLatest ? `
                                        <div class="messaging-thread-latest-container">
                                            <!-- Membrete del mensaje (20% alto, 100% ancho) -->
                                            <div class="messaging-thread-membrete">
                                                <!-- Sección 1: Asunto (20% ancho) -->
                                                <div class="membrete-section membrete-section-subject">
                                                    <div class="membrete-content">
                                                        ${this.escapeHtml(originalSubject)}
                                                    </div>
                                                </div>
                                                <!-- Sección 2: "Más reciente" (20% ancho) -->
                                                <div class="membrete-section membrete-section-badge">
                                                    <div class="membrete-content">
                                                        <div class="messaging-thread-latest-badge">
                                                            <i class="fas fa-circle"></i> Más reciente
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- Sección 3: "De:" + usuario (20% ancho) -->
                                                <div class="membrete-section membrete-section-from">
                                                    <div class="membrete-content">
                                                        <span class="recipient-label">De:</span>
                                                        <span class="recipient-bullet from-user">
                                                            ${this.escapeHtml(msgFrom.username || 'Usuario')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <!-- Sección 4-5: "Para:" + bullets (40% ancho combinado) -->
                                                <div class="membrete-section membrete-section-to">
                                                    <div class="membrete-content">
                                                        <span class="recipient-label">Para:</span>
                                                        <div class="recipient-bullets-container">
                                                            ${allRecipients.map(recipient => `
                                                                <span class="recipient-bullet">
                                                                    ${this.escapeHtml(recipient.username || 'Usuario')}
                                                                </span>
                                                            `).join('')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- Cuerpo del mensaje (70% alto, 100% ancho) -->
                                            <div class="messaging-thread-latest-body">
                                                <div class="messaging-thread-body">${this.nl2br(this.escapeHtml(msg.body || ''))}</div>
                                                ${msg.attachments && msg.attachments.length > 0 ? `
                                                    <div class="messaging-thread-attachments">
                                                        <div class="messaging-attachments-label">
                                                            <i class="fas fa-paperclip"></i> Archivos adjuntos:
                                                        </div>
                                                        <div class="messaging-attachments-list">
                                                            ${msg.attachments.map(att => `
                                                                <div class="messaging-attachment">
                                                                    <a href="${this.downloadUrl(att.id)}" target="_blank" class="messaging-attachment-link">
                                                                        <i class="fas fa-file"></i>
                                                                        <span>${this.escapeHtml(att.filename)}</span>
                                                                        ${att.file_size ? `<span class="messaging-attachment-size">(${this.formatFileSize(att.file_size)})</span>` : ''}
                                                                    </a>
                                                                </div>
                                                            `).join('')}
                                                        </div>
                                                    </div>
                                                ` : ''}
                                            </div>
                                            <!-- Botones de acción (10% alto, 100% ancho, alineados a la derecha) -->
                                            <div class="messaging-thread-latest-actions">
                                                ${canForward ? `
                                                    <div class="jkhive-actionbutton-small">
                                                        <a href="#" onclick="event.preventDefault(); messagingSystem.forwardMessage(${message.id}); return false;" data-tooltip="Reenviar" aria-label="Reenviar">
                                                            <div class="jkhive-hex">
                                                                <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                                                    <i class="jkhive-hex-icon fas fa-share-alt"></i>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                ` : ''}
                                                <div class="jkhive-actionbutton-small">
                                                    <a href="#" onclick="event.preventDefault(); messagingSystem.showReplyModalHex(${message.id}); return false;" data-tooltip="Responder" aria-label="Responder">
                                                        <div class="jkhive-hex">
                                                            <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                                                <i class="jkhive-hex-icon fas fa-reply"></i>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ` : `
                                        <div class="messaging-thread-header">
                                            <div class="messaging-thread-meta">
                                                <div>
                                                    <strong>${this.escapeHtml(msgFrom.username || 'Usuario')}</strong>
                                                    <span class="message-email">${this.escapeHtml(msgFrom.email || '')}</span>
                                                </div>
                                                <div>${this.formatDate(msg.created_at)}</div>
                                            </div>
                                        </div>
                                    `}
                                    ${!isLatest ? `<div class="messaging-thread-subject">${this.escapeHtml(msg.subject || 'Sin asunto')}</div>` : ''}
                                    ${!isLatest ? `<div class="messaging-thread-body">${this.nl2br(this.escapeHtml(msg.body || ''))}</div>` : ''}
                                    ${!isLatest && msg.attachments && msg.attachments.length > 0 ? `
                                        <div class="messaging-thread-attachments">
                                            <div class="messaging-attachments-label">
                                                <i class="fas fa-paperclip"></i> Archivos adjuntos:
                                            </div>
                                            <div class="messaging-attachments-list">
                                                ${msg.attachments.map(att => `
                                                    <div class="messaging-attachment">
                                                        <a href="${this.downloadUrl(att.id)}" target="_blank" class="messaging-attachment-link">
                                                            <i class="fas fa-file"></i>
                                                            <span>${this.escapeHtml(att.filename)}</span>
                                                            ${att.file_size ? `<span class="messaging-attachment-size">(${this.formatFileSize(att.file_size)})</span>` : ''}
                                                        </a>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                    ${!isLatest && idx < sortedThread.length - 1 ? '<div class="messaging-thread-separator"></div>' : ''}
                                </div>
                            `;
                        }).join('')}
                        <div class="messaging-modal-footer-spacer"></div>
                    </div>
                    <div class="messaging-modal-footer">
                        <div class="jkhive-actionbutton-med">
                            <a href="#" onclick="event.preventDefault(); messagingSystem.closeHexModal('${modalId}'); return false;" data-tooltip="Salir" aria-label="Salir" style="text-decoration: none;">
                                <div class="jkhive-hex jkhive-hex-honey">
                                    <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                        <span class="jkhive-hex-text">Salir</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Mostrar modal con animación
            setTimeout(() => {
                modal.style.display = 'flex';
                modal.classList.add('active', 'show');
                document.body.style.overflow = 'hidden';
            }, 10);
            
            // Marcar TODOS los mensajes del thread como leídos
            // Esto asegura que todas las notificaciones se actualicen correctamente
            for (const msg of thread) {
                if (msg.id) {
                    await this.markAsRead(msg.id);
                }
            }
            
            // Actualizar el unread_count en la lista de mensajes para este chat
            // Esto actualizará el badge del chat individual
            const messageInList = this.messages.find(m => {
                const mRootId = (m.chat_info || {}).root_message_id || m.root_message_id || m.id;
                return mRootId === rootId;
            });
            
            if (messageInList && messageInList.chat_info) {
                // Actualizar unread_count a 0 ya que todos los mensajes del thread fueron marcados como leídos
                messageInList.chat_info.unread_count = 0;
                // Volver a renderizar los mensajes para actualizar el badge
                this.renderMessages();
            }
        } catch (e) {
            console.error('Error mostrando modal de mensaje:', e);
            this.showError('Error al mostrar el mensaje');
        }
    }
    
    /**
     * Mostrar formulario de respuesta dentro del modal existente
     */
    async showReplyInModal(modalId, messageId) {
        try {
            const modal = document.getElementById(modalId);
            if (!modal) {
                // Si no existe el modal, crear uno nuevo
                await this.showReplyModalHex(messageId);
                return;
            }
            
            // Cambiar estado del modal
            modal.setAttribute('data-state', 'reply');
            
            // Obtener el mensaje original
            let message = this.messages.find(m => m.id === messageId);
            if (!message) {
                const response = await fetch(`${this.apiBase}?action=read&id=${messageId}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                if (!data.success) throw new Error(data.message || 'Error cargando mensaje');
                message = data.data.message;
            }
            
            // Obtener el root_message_id del mensaje actual
            const chatInfo = message.chat_info || {};
            const rootMessageId = chatInfo.root_message_id || message.root_message_id || message.id;
            
            // SIEMPRE cargar el mensaje raíz para obtener TODOS los destinatarios originales del chat
            let rootMessage = null;
            try {
                const rootResponse = await fetch(`${this.apiBase}?action=read&id=${rootMessageId}`);
                if (rootResponse.ok) {
                    const rootData = await rootResponse.json();
                    if (rootData.success) {
                        rootMessage = rootData.data.message;
                    }
                }
            } catch (e) {
                console.error('Error cargando mensaje raíz:', e);
            }
            
            // Usar el mensaje raíz si está disponible, sino usar el mensaje actual
            const sourceMessage = rootMessage || message;
            
            // Obtener usuario actual
            const currentUser = this.getCurrentUser();
            const isAdmin = this.isAdmin();
            const isClerk = this.isClerk();
            const canAddRecipients = isAdmin || isClerk;
            
            // Solo obtener usuarios si el usuario puede agregar destinatarios (admin/clerk)
            let users = [];
            if (canAddRecipients) {
                try {
                    users = await this.getUsers();
                } catch (e) {
                    console.warn('No se pudieron obtener usuarios para el dropdown, continuando sin ellos:', e);
                    users = [];
                }
            }
            
            // Obtener usuario actual (siempre es el "De")
            const currentUserName = currentUser ? (currentUser.username || currentUser.email || 'Usuario') : 'Usuario';
            
            // Obtener TODOS los destinatarios del mensaje raíz (el mensaje original del chat)
            const originalFromUser = sourceMessage.from_user || {};
            const originalToUser = sourceMessage.to_user || {};
            const originalCcUsers = sourceMessage.cc_users || [];
            const currentUserId = currentUser ? currentUser.id : null;
            
            // Construir lista de todos los destinatarios originales
            const allOriginalRecipients = [];
            
            // Agregar el remitente original (from_user) - siempre debe estar en la respuesta
            if (originalFromUser && originalFromUser.id && originalFromUser.id !== currentUserId) {
                allOriginalRecipients.push({
                    id: originalFromUser.id,
                    name: originalFromUser.username || originalFromUser.email || 'Usuario',
                    username: originalFromUser.username || '',
                    email: originalFromUser.email || '',
                    profile_slug: originalFromUser.profile_slug || '',
                    profile_level: originalFromUser.profile_level || 0
                });
            }
            
            // Agregar destinatario principal (to_user) - excluir al usuario actual
            if (originalToUser && originalToUser.id && originalToUser.id !== currentUserId) {
                const alreadyIncluded = allOriginalRecipients.find(r => r.id === originalToUser.id);
                if (!alreadyIncluded) {
                    allOriginalRecipients.push({
                        id: originalToUser.id,
                        name: originalToUser.username || originalToUser.email || 'Usuario',
                        username: originalToUser.username || '',
                        email: originalToUser.email || '',
                        profile_slug: originalToUser.profile_slug || '',
                        profile_level: originalToUser.profile_level || 0
                    });
                }
            }
            
            // Agregar destinatarios CC - excluir al usuario actual
            if (Array.isArray(originalCcUsers) && originalCcUsers.length > 0) {
                originalCcUsers.forEach(ccUser => {
                    if (ccUser && ccUser.id && ccUser.id !== currentUserId) {
                        const alreadyIncluded = allOriginalRecipients.find(r => r.id === ccUser.id);
                        if (!alreadyIncluded) {
                            allOriginalRecipients.push({
                                id: ccUser.id,
                                name: ccUser.username || ccUser.email || 'Usuario',
                                username: ccUser.username || '',
                                email: ccUser.email || '',
                                profile_slug: ccUser.profile_slug || '',
                                profile_level: ccUser.profile_level || 0
                            });
                        }
                    }
                });
            }
            
            // Los destinatarios finales ya están filtrados (sin el usuario actual)
            const initialToUsers = allOriginalRecipients;
            
            // Identificar el administrador en los destinatarios originales
            // Primero, verificar desde los datos del mensaje original (más confiable)
            let originalAdminId = null;
            
            // Verificar from_user
            if (originalFromUser && originalFromUser.id && originalFromUser.id !== currentUserId) {
                const profileSlug = originalFromUser.profile_slug || '';
                const profileLevel = originalFromUser.profile_level || 0;
                if (profileSlug === 'administrator' || profileLevel >= 3) {
                    originalAdminId = originalFromUser.id;
                }
            }
            
            // Verificar to_user
            if (!originalAdminId && originalToUser && originalToUser.id && originalToUser.id !== currentUserId) {
                const profileSlug = originalToUser.profile_slug || '';
                const profileLevel = originalToUser.profile_level || 0;
                if (profileSlug === 'administrator' || profileLevel >= 3) {
                    originalAdminId = originalToUser.id;
                }
            }
            
            // Verificar cc_users
            if (!originalAdminId && Array.isArray(originalCcUsers) && originalCcUsers.length > 0) {
                for (const ccUser of originalCcUsers) {
                    if (ccUser && ccUser.id && ccUser.id !== currentUserId) {
                        const profileSlug = ccUser.profile_slug || '';
                        const profileLevel = ccUser.profile_level || 0;
                        if (profileSlug === 'administrator' || profileLevel >= 3) {
                            originalAdminId = ccUser.id;
                            break;
                        }
                    }
                }
            }
            
            // Si aún no encontramos el admin, buscar en el array de usuarios (fallback)
            if (!originalAdminId && users && users.length > 0) {
                for (const recipient of allOriginalRecipients) {
                    if (recipient.id === currentUserId) continue;
                    const recipientUser = users.find(u => u.id === recipient.id || u.id === parseInt(recipient.id));
                    if (recipientUser) {
                        const profileSlug = recipientUser.profile_slug || '';
                        const profileLevel = recipientUser.profile_level || 0;
                        if (profileSlug === 'administrator' || profileLevel >= 3) {
                            originalAdminId = recipient.id;
                            break;
                        }
                    }
                }
            }
            
            // Guardar originalAdminId en el modal para uso posterior
            modal.setAttribute('data-original-admin-id', originalAdminId || '');
            
            // Obtener el contenido del modal
            const content = modal.querySelector('.jkhive-modal-message-content');
            if (!content) return;
            
            // Transición suave: fade out
            content.style.opacity = '0';
            content.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                // Actualizar contenido
                content.innerHTML = `
                    <div class="jkhive-modal-header">
                        <div class="jkhive-modal-icon" style="color: var(--jk-accent-cyan);">
                            <i class="fas fa-reply"></i>
                        </div>
                    </div>
                    <div class="jkhive-modal-header-compact">
                        ${this.generateRecipientsHeader(currentUserName, initialToUsers, canAddRecipients, isAdmin, isClerk, users, modalId, 'reply', originalAdminId)}
                    </div>
                    ${this.generateReplyFormHtml(message, canAddRecipients, isAdmin, users, modalId)}
                    <div class="jkhive-modal-actions">
                        <div class="jkhive-actionbutton-med">
                            <a href="#" class="jkhive-system-modal-btn" data-action="cancel" style="text-decoration: none;">
                                <div class="jkhive-hex jkhive-hex-honey">
                                    <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                        <span class="jkhive-hex-text">Cancelar</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="jkhive-actionbutton-med">
                            <a href="#" class="jkhive-system-modal-btn" data-action="send" style="text-decoration: none;">
                                <div class="jkhive-hex jkhive-hex-honey">
                                    <div class="jkhive-hex-content jkhive-hex-content-editorial">
                                        <span class="jkhive-hex-text">Enviar</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                `;
                
                // Mover el asunto a la columna "De" si es una respuesta
                setTimeout(() => {
                    const subjectContainer = modal.querySelector(`#${modalId}-subject-container`);
                    const subjectInForm = modal.querySelector('.messaging-subject-compact');
                    if (subjectContainer && subjectInForm) {
                        subjectContainer.appendChild(subjectInForm);
                    }
                }, 100);
                
                // Event listeners
                content.querySelectorAll('.jkhive-system-modal-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.preventDefault();
                        const action = btn.getAttribute('data-action');
                        if (action === 'send') {
                            await this.handleReplySubmitInModal(modal, message.id, modalId);
                        } else {
                            // Volver a la vista del mensaje
                            await this.showMessageModalHex({ message: message, thread: [message], attachments: [] });
                        }
                    });
                });
                
                // Event listeners para bullets y acciones
                this.setupRecipientsListeners(modal, modalId, users, isAdmin);
                
                // Inicializar datos de destinatarios
                setTimeout(() => {
                    this.updateRecipientsData(modalId);
                }, 100);
                
                // Transición suave: fade in
                setTimeout(() => {
                    content.style.opacity = '1';
                    content.style.transform = 'scale(1)';
                }, 50);
            }, 300);
        } catch (e) {
            console.error('Error mostrando formulario de respuesta en modal:', e);
            this.showError('Error al abrir el formulario de respuesta');
        }
    }
    
    /**
     * Manejar envío de respuesta dentro del modal (con transición a confirmación)
     */
    async handleReplySubmitInModal(modal, parentId, modalId) {
        try {
            const body = document.getElementById('replyBodyHex').value.trim();
            if (!body) {
                this.showError('El mensaje no puede estar vacío');
                return;
            }
            
            // Obtener destinatarios desde los bullets
            const toUsersInput = document.querySelector(`#${modalId}-to-users-input`);
            const toUsers = toUsersInput ? JSON.parse(toUsersInput.value || '[]') : [];
            
            if (toUsers.length === 0) {
                this.showError('Debes seleccionar al menos un destinatario');
                return;
            }
            
            // El primer destinatario es el principal
            const toUserId = toUsers[0].id;
            
            // Obtener adjuntos del input
            const attachmentsInput = document.getElementById(`${modalId}-attachments-input`);
            const attachments = attachmentsInput?.files || [];
            
            // Obtener asunto del mensaje original
            const parentMessage = this.messages.find(m => m.id === parentId);
            const subject = parentMessage ? ('Re: ' + (parentMessage.subject || '')) : 'Re: Mensaje';
            
            const formData = {
                subject: subject,
                body: body,
                parent_id: parentId,
                to_user_id: toUserId,
                cc_users: toUsers.slice(1).map(u => u.id),
                attachments: attachments
            };
            
            // Enviar mensaje
            await this.sendMessage(formData);

            const sendBtn = modal.querySelector('.jkhive-system-modal-btn[data-action="send"]');
            if (typeof toast === 'function' && window.JKHIVE_MESSAGES_SHOWCASE_UI && sendBtn) {
                toast({
                    type: 'B',
                    state: 'success',
                    message: 'Mensaje enviado correctamente',
                    anchorEl: sendBtn,
                });
            } else if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                systemMessages.success('Tu mensaje se ha enviado correctamente', 'Mensaje Enviado', 'jkhive-msgs-alerts');
            }

            this.closeHexModal(modalId);

            const messageViewModal = document.getElementById('messageViewModalHex');
            if (messageViewModal) {
                this.closeHexModal('messageViewModalHex');
            }

            await this.loadMessages(this.currentFolder);
        } catch (e) {
            console.error('Error enviando respuesta:', e);
            // Mostrar error usando SystemMessages
            if (typeof SystemMessages !== 'undefined') {
                const systemMessages = new SystemMessages();
                systemMessages.error('Error al enviar la respuesta: ' + (e.message || 'Error desconocido'));
            } else {
                this.showError('Error al enviar la respuesta: ' + (e.message || 'Error desconocido'));
            }
        }
    }
}

// Solo en páginas con bandeja (evita fetch 401 en todo el CRM)
let messagingSystem;
function jkhiveInitMessagingSystem() {
    if (!document.getElementById('messagingFolders')) {
        return;
    }
    messagingSystem = new MessagingSystem();
    window.messagingSystem = messagingSystem;
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', jkhiveInitMessagingSystem);
} else {
    jkhiveInitMessagingSystem();
}


