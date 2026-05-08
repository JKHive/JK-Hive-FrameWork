/**
 * Showcase: mensajería API en memoria (JSON compatible con CRM `messaging.js`).
 * Flag: window.JKHIVE_MESSAGES_SHOWCASE === true (inyectado en messaging.php antes de cargar este archivo).
 */
(function () {
  'use strict';

  if (!window.JKHIVE_MESSAGES_SHOWCASE) return;

  var origFetch = window.fetch.bind(window);

  var DEMO_USER = window.JKHIVE_MSG_DEMO_USER || {
    id: 42,
    username: 'Visita Demo',
    email: 'demo@jk.local',
    profile_slug: 'administrator',
    profile_level: 3,
  };

  var U_SOPORTE = {
    id: 7,
    username: 'Equipo Soporte JK',
    email: 'soporte@demo.local',
    profile_slug: 'clerk',
    profile_level: 2,
  };

  function iso(ts) {
    return new Date(ts).toISOString();
  }

  var state = { nextId: 600, threads: {} };

  function ensureSeed() {
    if (Object.keys(state.threads).length > 0) return;
    var now = Date.now();
    state.threads['101'] = {
      folder: 'inbox',
      messages: [
        {
          id: 101,
          subject: 'Centro JK Hive showcase',
          body:
            'Mensaje de demostración. Respondé desde el CRM hex modal; la transición responde con jk-hive-3danimation-1.',
          created_at: iso(now - 86400000),
          is_read: 0,
          is_starred: 0,
          from_user: U_SOPORTE,
          to_user: DEMO_USER,
          cc_users: [],
          attachments: [],
        },
      ],
    };
    state.threads['102'] = {
      folder: 'inbox',
      messages: [
        {
          id: 102,
          subject: 'Componentes y dashboard',
          body: 'KPIs demo y métricas en gráficos hex abajo.',
          created_at: iso(now - 3600000),
          is_read: 1,
          is_starred: 0,
          from_user: U_SOPORTE,
          to_user: DEMO_USER,
          cc_users: [],
          attachments: [],
        },
      ],
    };
  }

  function buildChatInfo(tid, t) {
    var latest = t.messages[t.messages.length - 1];
    var unread = t.messages.reduce(function (acc, m) {
      return acc + (m.is_read === 0 || m.is_read === false ? 1 : 0);
    }, 0);
    var attach = t.messages.some(function (m) {
      return Array.isArray(m.attachments) && m.attachments.length > 0;
    })
      ? 1
      : 0;
    return {
      root_message_id: Number(tid),
      total_messages: t.messages.length,
      unread_count: unread,
      latest_date: latest.created_at,
      latest_subject: latest.subject,
      has_attachments: attach,
      attachments: latest.attachments,
    };
  }

  function listRow(tid, t) {
    var latest = t.messages[t.messages.length - 1];
    var row = JSON.parse(JSON.stringify(latest));
    row.chat_info = buildChatInfo(tid, t);
    return row;
  }

  function foldersResponse() {
    ensureSeed();
    return {
      success: true,
      data: [
        { slug: 'inbox', name: 'Bandeja de entrada', icon: 'fas fa-inbox' },
        { slug: 'sent', name: 'Enviados', icon: 'fas fa-paper-plane' },
        { slug: 'starred', name: 'Destacados', icon: 'fas fa-star' },
        { slug: 'archived', name: 'Archivados', icon: 'fas fa-archive' },
        { slug: 'trash', name: 'Papelera', icon: 'fas fa-trash' },
      ],
    };
  }

  function listMessages(folderSlug) {
    ensureSeed();
    var out = [];
    Object.keys(state.threads).forEach(function (tid) {
      var t = state.threads[tid];
      if (!t || t.folder !== folderSlug) return;
      var row = listRow(tid, t);
      if (folderSlug === 'starred' && !row.is_starred) return;
      out.push(row);
    });
    out.sort(function (a, b) {
      var da = new Date((a.chat_info && a.chat_info.latest_date) || a.created_at).getTime();
      var db = new Date((b.chat_info && b.chat_info.latest_date) || b.created_at).getTime();
      return db - da;
    });
    return { success: true, data: { messages: out } };
  }

  function findEnvelope(msgId) {
    ensureSeed();
    var idNum = typeof msgId === 'string' ? parseInt(msgId, 10) : msgId;
    var ids = Object.keys(state.threads);
    for (var i = 0; i < ids.length; i++) {
      var tid = ids[i];
      var hit = state.threads[tid].messages.find(function (m) {
        return Number(m.id) === idNum || String(m.id) === String(msgId);
      });
      if (hit)
        return {
          threadId: tid,
          thread: state.threads[tid],
          msg: JSON.parse(JSON.stringify(hit)),
        };
    }
    return null;
  }

  function readGet(msgId) {
    ensureSeed();
    var env = findEnvelope(msgId);
    if (!env)
      return { success: false, message: 'Mensaje no encontrado en demo mock' };

    env.thread.messages.forEach(function (m) {
      m.is_read = 1;
    });

    var threadSorted = JSON.parse(JSON.stringify(env.thread.messages));
    threadSorted.sort(function (a, b) {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    var idNum =
      typeof msgId === 'string' ? parseInt(msgId, 10) : msgId;

    var head =
      JSON.parse(JSON.stringify(threadSorted.find(function (m) { return Number(m.id) === idNum; }) || threadSorted.slice(-1)[0]));

    var rootTid = Number(env.threadId);
    threadSorted.forEach(function (m) {
      if (!m.chat_info) m.chat_info = {};
      if (m.chat_info.root_message_id == null) m.chat_info.root_message_id = rootTid;
      if (m.root_message_id == null) m.root_message_id = rootTid;
    });

    return {
      success: true,
      data: {
        message: head,
        thread: threadSorted,
        attachments: [],
      },
    };
  }

  function markReadPost(form) {
    ensureSeed();
    var id = parseInt(String(form.get('id') || '0'), 10);
    var env = findEnvelope(id);
    if (env && env.thread)
      env.thread.messages.forEach(function (m) {
        m.is_read = 1;
      });
    return { success: true };
  }

  function starPost(form) {
    ensureSeed();
    var mid = parseInt(String(form.get('id') || '0'), 10);
    var starred = parseInt(String(form.get('starred') || '0'), 10);
    var env = findEnvelope(mid);
    if (!env || !env.thread)
      return { success: false, message: 'No encontrado' };

    env.thread.messages.forEach(function (m) {
      m.is_starred = starred;
    });
    if (starred === 1)
      env.thread.folder = 'starred';
    else if (env.thread.folder === 'starred')
      env.thread.folder = 'inbox';

    return { success: true };
  }

  function parseIds(field) {
    try {
      var arr = JSON.parse(field || '[]');
      return Array.isArray(arr) ? arr.map(Number) : [];
    } catch (e) {
      return [];
    }
  }

  function handleBulk(form) {
    ensureSeed();
    var bulkAction = String(form.get('action') || '').trim();
    var ids = parseIds(String(form.get('message_ids') || '[]'));
    var cf = String(form.get('current_folder') || 'inbox');

    ids.forEach(function (tid) {
      var key = String(tid);
      var t = state.threads[key];
      if (!t) return;

      switch (bulkAction) {
        case 'delete':
          if (cf === 'trash') delete state.threads[key];
          else t.folder = 'trash';
          break;
        case 'archive':
          t.folder = 'archived';
          break;
        case 'restore':
        case 'unarchive':
          t.folder = 'inbox';
          break;
        case 'star':
          t.folder = 'starred';
          t.messages.forEach(function (m) {
            m.is_starred = 1;
          });
          break;
        case 'unstar':
          t.messages.forEach(function (m) {
            m.is_starred = 0;
          });
          if (cf === 'starred') t.folder = 'inbox';
          break;
        case 'mark_read':
          t.messages.forEach(function (m) {
            m.is_read = 1;
          });
          break;
        default:
          break;
      }
    });

    return { success: true };
  }

  function userById(uid) {
    uid = Number(uid);
    if (uid === DEMO_USER.id) return DEMO_USER;
    if (uid === U_SOPORTE.id) return U_SOPORTE;
    return { id: uid, username: 'Usuario ' + uid, email: uid + '@demo.local', profile_slug: '', profile_level: 1 };
  }

  function handleSend(form) {
    ensureSeed();
    var subject = String(form.get('subject') || 'Sin asunto');
    var body = String(form.get('body') || '');
    var parentId = parseInt(String(form.get('parent_id') || '0'), 10);
    var toUid = parseInt(String(form.get('to_user_id') || '0'), 10);
    var cc = [];
    if (typeof form.getAll === 'function') {
      form.getAll('cc_users[]').forEach(function (v) {
        cc.push(Number(v));
      });
    }

    var newId = ++state.nextId;
    var newMsg = {
      id: newId,
      subject: subject,
      body: body,
      created_at: iso(Date.now()),
      is_read: 1,
      is_starred: 0,
      from_user: DEMO_USER,
      to_user: userById(toUid || U_SOPORTE.id),
      cc_users: cc.map(userById),
      attachments: [],
    };

    if (parentId) {
      var env = findEnvelope(parentId);
      if (env) {
        env.thread.messages.push(newMsg);
        env.thread.folder = 'inbox';
        return { success: true };
      }
    }

    state.threads[String(newId)] = {
      folder: 'sent',
      messages: [JSON.parse(JSON.stringify(newMsg))],
    };

    return { success: true };
  }

  function emptyTrash() {
    ensureSeed();
    Object.keys(state.threads).forEach(function (k) {
      if (state.threads[k].folder === 'trash') delete state.threads[k];
    });
    return { success: true };
  }

  function respond(obj) {
    return Promise.resolve(
      new Response(JSON.stringify(obj), {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      }),
    );
  }

  function parseQuery(urlStr) {
    var qidx = urlStr.indexOf('?');
    var q = qidx === -1 ? '' : urlStr.slice(qidx + 1);
    var out = {};
    q.split('&').forEach(function (pair) {
      if (!pair) return;
      var p = pair.split('=');
      out[decodeURIComponent(p[0] || '')] = decodeURIComponent((p[1] || '').replace(/\+/g, ' '));
    });
    return out;
  }

  function matchApi(urlStr) {
    return urlStr.indexOf('messages/index.php') !== -1 || urlStr.indexOf('/api/messages') !== -1;
  }

  window.fetch = function (input, init) {
    var urlStr =
      typeof input === 'string' ? input : input && typeof input.url === 'string' ? input.url : '';
    if (!matchApi(urlStr)) {
      return origFetch(input, init);
    }

    try {
      var method = (((init || {}).method) || (typeof input !== 'string' && input && input.method) || 'GET').toUpperCase();
      var href = '';
      try {
        href = new URL(urlStr, window.location.origin).href;
      } catch (eHref) {
        href = window.location.origin + '/' + urlStr.replace(/^\//, '');
      }
      var params = parseQuery(href);
      var action = params.action || '';

      if (method === 'GET') {
        if (action === 'folders')
          return respond(foldersResponse());
        if (action === 'list')
          return respond(listMessages(params.folder || 'inbox'));
        if (action === 'read' && params.id)
          return respond(readGet(params.id));
        if (action === 'get_messaging_users')
          return respond({
            success: true,
            data: [DEMO_USER, U_SOPORTE, { id: 9, username: 'QA Demo', email: 'qa@demo.local', profile_slug: 'clerk', profile_level: 2 }],
          });
        if (action === 'get_admin')
          return respond({ success: true, data: U_SOPORTE });
      }

      if (method === 'POST') {
        if (action === 'empty_trash')
          return respond(emptyTrash());

        var body = init && init.body;
        if (!(body instanceof FormData)) {
          return respond({ success: false, message: 'Mock mensajes POST requiere FormData' });
        }
        var fd = body;

        if (action === 'bulk')
          return respond(handleBulk(fd));
        if (action === 'star')
          return respond(starPost(fd));
        if (action === 'read')
          return respond(markReadPost(fd));
        if (action === 'send')
          return respond(handleSend(fd));
      }

      return respond({
        success: false,
        message: 'Opción mensajes showcase no contemplada: ' + method + '/' + action,
      });
    } catch (e) {
      return respond({ success: false, message: 'Mock mensajes — error:' + String(e.message) });
    }
  };
})();
