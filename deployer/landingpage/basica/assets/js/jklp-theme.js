/**
 * Lee theme.txt (misma carpeta) o ?theme= → data-jkfw-theme + clase jkfw-theme-* en body.
 */
(function () {
  'use strict';
  var doc = document.documentElement;

  function applySlug(slug) {
    doc.setAttribute('data-jkfw-theme', slug);
    var b = document.body;
    if (!b) return;
    var parts = (b.className || '')
      .split(/\s+/)
      .filter(function (c) {
        return c && !/^jkfw-theme-/.test(c);
      });
    parts.push('jkfw-theme-' + slug);
    b.className = parts.join(' ');
  }

  var q = '';
  try {
    q = new URLSearchParams(window.location.search).get('theme') || '';
  } catch (e) {
    q = '';
  }
  q = (q || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (q !== '') {
    applySlug(q);
    return;
  }

  fetch('theme.txt', { cache: 'no-store' })
    .then(function (r) {
      return r.ok ? r.text() : '';
    })
    .then(function (t) {
      var slug = (t || '').trim().split(/\r?\n/)[0] || 'canonical';
      slug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '');
      if (!slug) slug = 'canonical';
      applySlug(slug);
    })
    .catch(function () {
      applySlug('canonical');
    });
})();
