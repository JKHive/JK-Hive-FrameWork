/**
 * Housesitting - API Client (panel)
 */

(function() {
    'use strict';

    const ApiClient = {
        baseUrl: (typeof HostsConfig !== 'undefined' && HostsConfig.getCrmUrlPath) ? HostsConfig.getCrmUrlPath('api') : '/crm/api',
        
        /**
         * Realizar petición a la API
         */
        request: async function(endpoint, options = {}) {
            const url = `${this.baseUrl}/${endpoint}`;
            const config = {
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                credentials: 'same-origin', // Incluir cookies de sesión
                ...options
            };
            
            // Agregar CSRF token si existe
            const csrfToken = this.getCsrfToken();
            if (csrfToken) {
                config.headers['X-CSRF-Token'] = csrfToken;
            }
            
            // Agregar body si existe
            if (options.body && typeof options.body === 'object') {
                config.body = JSON.stringify(options.body);
            }
            
            try {
                const response = await fetch(url, config);
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || data.message || 'Error en la petición');
                }
                
                return data;
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        },
        
        /**
         * Obtener CSRF token
         */
        getCsrfToken: function() {
            const meta = document.querySelector('meta[name="csrf-token"]');
            return meta ? meta.getAttribute('content') : null;
        },
        
        /**
         * GET request
         */
        get: function(endpoint, params = {}) {
            const queryString = new URLSearchParams(params).toString();
            const url = queryString ? `${endpoint}?${queryString}` : endpoint;
            return this.request(url, { method: 'GET' });
        },
        
        /**
         * POST request
         */
        post: function(endpoint, data = {}) {
            return this.request(endpoint, {
                method: 'POST',
                body: data
            });
        },
        
        /**
         * PUT request
         */
        put: function(endpoint, data = {}) {
            return this.request(endpoint, {
                method: 'PUT',
                body: data
            });
        },
        
        /**
         * DELETE request
         */
        delete: function(endpoint) {
            return this.request(endpoint, {
                method: 'DELETE'
            });
        },
        
        // Métodos específicos para cada recurso
        
        // Admin - Pages
        pages: {
            getAll: (params) => ApiClient.get('admin/pages.php', params),
            getById: (id) => ApiClient.get('admin/pages.php', { id }),
            create: (data) => ApiClient.post('admin/pages.php', data),
            update: (id, data) => ApiClient.put(`admin/pages.php?id=${id}`, data),
            delete: (id) => ApiClient.delete(`admin/pages.php?id=${id}`)
        },
        
        // Admin - Components
        components: {
            getAll: (params) => ApiClient.get('admin/components.php', params),
            getById: (id) => ApiClient.get('admin/components.php', { id }),
            create: (data) => ApiClient.post('admin/components.php', data),
            update: (id, data) => ApiClient.put(`admin/components.php?id=${id}`, data),
            delete: (id) => ApiClient.delete(`admin/components.php?id=${id}`)
        },
        
        // Admin - Products
        products: {
            getAll: (params) => ApiClient.get('admin/products.php', params),
            getById: (id) => ApiClient.get('admin/products.php', { id }),
            create: (data) => ApiClient.post('admin/products.php', data),
            update: (id, data) => ApiClient.put(`admin/products.php?id=${id}`, data),
            delete: (id) => ApiClient.delete(`admin/products.php?id=${id}`)
        },
        
        // Admin - Services
        services: {
            getAll: (params) => ApiClient.get('admin/services.php', params),
            getById: (id) => ApiClient.get('admin/services.php', { id }),
            create: (data) => ApiClient.post('admin/services.php', data),
            update: (id, data) => ApiClient.put(`admin/services.php?id=${id}`, data),
            delete: (id) => ApiClient.delete(`admin/services.php?id=${id}`)
        },
        
        // Admin - Branches
        branches: {
            getAll: () => ApiClient.get('admin/branches.php')
        }
    };
    
    // Exponer globalmente
    window.ApiClient = ApiClient;
})();



































