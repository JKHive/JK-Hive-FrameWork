/**
 * Home: servicios destacados y noticias desde gallery.html / about.html
 * (ítems con data-jkfw-featured-home="true").
 */
(function () {
  'use strict';

  function buildCarouselArticle(title, subtitle, iconClass, href) {
    var article = document.createElement('article');
    article.className = 'jkhive-carouselitem-big';
    var a = document.createElement('a');
    a.className =
      'jkhive-itemgallery-big jkhive-hex-item-big jkhive-hex-item-hover-glowV2';
    a.href = href;
    a.setAttribute('aria-label', title + '. ' + subtitle);

    var hex = document.createElement('div');
    hex.className = 'jkhive-hex jkhive-hex-item-style-glow';
    var content = document.createElement('div');
    content.className = 'jkhive-hex-content';

    var span = document.createElement('span');
    span.className = 'service-icon';
    span.setAttribute('aria-hidden', 'true');
    var i = document.createElement('i');
    i.className = iconClass || 'fas fa-layer-group';
    span.appendChild(i);

    var h3 = document.createElement('h3');
    h3.className = 'service-title';
    h3.textContent = title;

    var p = document.createElement('p');
    p.className = 'service-description';
    p.textContent = subtitle;

    content.appendChild(span);
    content.appendChild(h3);
    content.appendChild(p);
    hex.appendChild(content);
    a.appendChild(hex);
    article.appendChild(a);
    return article;
  }

  function iconClasses(el) {
    var icon = el.querySelector('.jkhive-hex-gallery-icon');
    if (!icon) return 'fas fa-layer-group';
    var parts = (icon.className || '').split(/\s+/).filter(Boolean);
    var cls = parts
      .filter(function (c) {
        return (
          c !== 'jkhive-hex-gallery-icon' &&
          c.indexOf('jkfw-') !== 0 &&
          c.indexOf('jklp-') !== 0
        );
      })
      .join(' ')
      .trim();
    return cls || 'fas fa-layer-group';
  }

  function syncServices(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var items = doc.querySelectorAll(
      '#jkfwGalleryServicesGrid [data-jkfw-featured-home="true"]'
    );
    var track = document.querySelector(
      '#jkfwSimpleFeaturedCarousel .jkfw-simple-featured-track'
    );
    if (!track || !items.length) return;

    track.innerHTML = '';
    Array.prototype.forEach.call(items, function (node) {
      var titleEl = node.querySelector('.jkhive-hex-gallery-title');
      var subEl = node.querySelector('.jkhive-hex-gallery-subtitle');
      var title = titleEl ? titleEl.textContent.trim() : '';
      var sub = subEl ? subEl.textContent.trim() : '';
      if (!title) return;
      var href =
        'gallery.html?q=' +
        encodeURIComponent(title) +
        '&section=servicios';
      track.appendChild(
        buildCarouselArticle(title, sub, iconClasses(node), href)
      );
    });
  }

  function syncNews(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var items = doc.querySelectorAll(
      '#jkfwAboutNewsGallery [data-jkfw-featured-home="true"]'
    );
    var root = document.getElementById('jkfwHomeNewsSpotGallery');
    if (!root || !items.length) return;

    root.innerHTML = '';
    Array.prototype.forEach.call(items, function (src) {
      var titleEl = src.querySelector('.jkhive-hex-gallery-title');
      var title = titleEl ? titleEl.textContent.trim() : '';
      if (!title) return;

      var a = document.createElement('a');
      a.className =
        'jkfw-home-news-spot jkhive-itemgallery-med jkhive-hex-item-med jkhive-hex-item-hover-glowV2';
      var inner = src.cloneNode(true);
      inner.removeAttribute('tabindex');
      inner.removeAttribute('role');
      inner.removeAttribute('data-jkfw-featured-home');
      inner.classList.remove('jklp-hex-detail-trigger');

      var labelBits = [];
      var subEl = inner.querySelector('.jkhive-hex-gallery-subtitle');
      if (subEl) labelBits.push(subEl.textContent.trim());
      a.setAttribute(
        'aria-label',
        title + (labelBits.length ? '. ' + labelBits.join('. ') : '')
      );
      a.href =
        'about.html?q=' + encodeURIComponent(title) + '&section=noticias';

      a.appendChild(inner);
      root.appendChild(a);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Promise.all([
      fetch('gallery.html', { credentials: 'same-origin' }).then(function (r) {
        return r.text();
      }),
      fetch('about.html', { credentials: 'same-origin' }).then(function (r) {
        return r.text();
      }),
    ])
      .then(function (pair) {
        syncServices(pair[0]);
        syncNews(pair[1]);
      })
      .catch(function () {})
      .finally(function () {
        var track = document.querySelector(
          '#jkfwSimpleFeaturedCarousel .jkfw-simple-featured-track'
        );
        if (track && track.children.length === 0) {
          track.appendChild(
            buildCarouselArticle(
              'Galería de servicios',
              'Ver todos los ítems',
              'fas fa-images',
              'gallery.html'
            )
          );
        }
        if (typeof window.__jkfwRunFeaturedCarousel === 'function') {
          window.__jkfwRunFeaturedCarousel();
        }
      });
  });
})();
