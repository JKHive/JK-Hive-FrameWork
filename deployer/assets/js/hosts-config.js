/**
 * Hosts para el showcase estático del monorepo JK-Hive-FrameWork.
 * Sustituye la lógica de entorno de jkhive para que WEB_URL/CRM_URL apunten
 * al directorio del showcase (misma carpeta que index.html).
 * API: mismas firmas que el hosts-config de jkhive (los fetch pueden fallar sin backend).
 */
if (typeof window.HostsConfig === 'undefined') {

var ENVIRONMENT = 'showcase';

(function () {
  var sc = document.currentScript;
  var base = '';
  if (sc && sc.src) {
    base = sc.src.replace(/\/assets\/js\/hosts-config\.js(\?.*)?$/i, '');
  } else if (typeof window !== 'undefined' && window.location) {
    base = window.location.href.replace(/\/[^/]*$/, '');
  }
  base = (base || '').replace(/\/$/, '');

  var HostsConfig = {
    WEB_URL: base,
    CRM_URL: base,
    API_AUTH_BASE: base + '/api/auth',
    API_MESSAGES_BASE: base + '/api/messages',
    API_NOTIFICATIONS_BASE: base + '/api/notifications',
    API_SEARCH_BASE: base + '/api/site'
  };

  HostsConfig.getWebUrl = function () { return this.WEB_URL; };
  HostsConfig.getCrmUrl = function () { return this.CRM_URL; };
  HostsConfig.getApiAuthBase = function () { return this.API_AUTH_BASE; };
  HostsConfig.getApiMessagesBase = function () { return this.API_MESSAGES_BASE; };
  HostsConfig.getApiNotificationsBase = function () { return this.API_NOTIFICATIONS_BASE; };
  HostsConfig.getApiSearchBase = function () { return this.API_SEARCH_BASE; };

  HostsConfig.getCrmUrlPath = function (path) {
    path = (path || '').toString().trim().replace(/^\//, '');
    return base + (path ? '/' + path : '');
  };

  HostsConfig.getWebUrlPath = function (path) {
    path = (path || '').replace(/^\//, '');
    return base + (path ? '/' + path : '');
  };

  HostsConfig.getHousesittingUrl = function () {
    return base;
  };

  HostsConfig.getSupportTicketApiUrls = function () {
    return [
      this.getCrmUrlPath('api/ticket-soporte-public.php'),
      this.getCrmUrlPath('api/ticket-soporte.php')
    ];
  };

  HostsConfig.getEnvironment = function () { return ENVIRONMENT; };

  window.HostsConfig = HostsConfig;
})();

}
