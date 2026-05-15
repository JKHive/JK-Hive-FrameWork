/**
 * JK Hive hex gallery framework:
 * - Row-capped pagination by gallery size (big/medium/small)
 * - Responsive row caps for mobile
 * - Rebuilds page items to preserve nth-child honeycomb math
 *
 * MEDIUM panal: CSS en jk-hive.css usa ciclo 9 (5+4) en desktop y 5 (3+2) en ≤768px.
 * Si pageSize no es múltiplo de ese ciclo, la última página desincroniza transforms / row-pull
 * y la separación vertical entre filas se ve mal (demo-landing-simple noticias).
 */
(function () {
  'use strict';

  var GALLERY_SELECTOR =
    '.jkhive-hex-gallery[data-jkhive-paginate="true"]';

  function getSizeKey(gallery) {
    if (gallery.classList.contains('jkhive-hex-gallery-big')) return 'big';
    if (gallery.classList.contains('jkhive-hex-gallery-small')) return 'small';
    return 'medium';
  }

  /** Longitud de ciclo del panal MEDIUM según breakpoint (alineado a product-gallery / jk-hive § GALLERY MEDIUM). */
  function honeyMediumCycle(width) {
    return width > 768 ? 9 : 5;
  }

  /**
   * @param {string} sizeKey
   * @param {number} width
   * @param {number} raw — salida de computePageSize
   * @returns {number}
   */
  function snapPageSizeToHoneyCombCycle(sizeKey, width, raw) {
    var r = Math.max(1, raw | 0);
    if (sizeKey !== 'medium') return r;
    var c = honeyMediumCycle(width);
    var snapped = Math.floor(r / c) * c;
    if (snapped >= c) return snapped;
    return c;
  }

  function getRowLimit(sizeKey, mobile) {
    if (mobile) {
      if (sizeKey === 'big') return 2;
      if (sizeKey === 'small') return 6;
      return 4;
    }
    if (sizeKey === 'big') return 3;
    if (sizeKey === 'small') return 7;
    return 5;
  }

  function getRowPattern(sizeKey, width) {
    var is480 = width <= 480;
    var is768 = width <= 768;

    if (sizeKey === 'big') {
      return is768 ? [2, 1] : [3, 2];
    }
    if (sizeKey === 'small') {
      if (is480) return [3, 2];
      if (is768) return [4, 3];
      return [8, 7];
    }
    if (is480) return [2, 1];
    if (is768) return [3, 2];
    return [5, 4];
  }

  function computePageSize(sizeKey, width) {
    var mobile = width <= 768;
    var rowLimit = getRowLimit(sizeKey, mobile);
    var pattern = getRowPattern(sizeKey, width);
    var total = 0;
    for (var i = 0; i < rowLimit; i += 1) {
      total += pattern[i % pattern.length];
    }
    return Math.max(1, total);
  }

  function getDirectItems(gallery, sizeKey) {
    var selector;
    if (sizeKey === 'big') {
      selector =
        ':scope > .jkhive-itemgallery-big, :scope > .jkhive-hex-gallery-item';
    } else if (sizeKey === 'small') {
      selector =
        ':scope > .jkhive-itemgallery-small, :scope > .jkhive-hex-gallery-item';
    } else {
      selector =
        ':scope > .jkfw-launcher-hexlink.jkhive-itemgallery-med, :scope > .jkhive-itemgallery-med, :scope > .jkhive-why-me-item, :scope > .jkhive-services-item, :scope > .jkhive-hex-gallery-item';
    }
    return Array.prototype.slice.call(gallery.querySelectorAll(selector));
  }

  function ensurePager(gallery) {
    var existing = gallery.nextElementSibling;
    if (existing && existing.classList.contains('jkhive-pagination')) return existing;

    var pager = document.createElement('div');
    pager.className = 'jkhive-pagination jkhive-pagination--hex-gallery';
    pager.setAttribute('role', 'navigation');
    pager.setAttribute('aria-label', 'Paginacion de galeria');
    pager.innerHTML =
      '<div class="jkhive-pagination-meta"></div>' +
      '<div class="jkhive-pagination-actions">' +
      '  <button type="button" class="jkhive-pagination-pagebtn" data-jkhive-gallery-first title="Primera pagina">Inicio</button>' +
      '  <div class="jkhive-admoptions-bttn jkhive-bttn-med jkhive-btn-anim-coinleft" data-tooltip="Pagina anterior">' +
      '    <button type="button" class="jkhive-bttn-inner" data-jkhive-gallery-prev>' +
      '      <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-chevron-left" aria-hidden="true"></i></div></div>' +
      '    </button>' +
      '  </div>' +
      '  <div class="jkhive-pagination-pages" data-jkhive-gallery-pages></div>' +
      '  <div class="jkhive-admoptions-bttn jkhive-bttn-med jkhive-btn-anim-coinright" data-tooltip="Pagina siguiente">' +
      '    <button type="button" class="jkhive-bttn-inner" data-jkhive-gallery-next>' +
      '      <div class="jkhive-hex"><div class="jkhive-hex-content"><i class="jkhive-hex-icon fas fa-chevron-right" aria-hidden="true"></i></div></div>' +
      '    </button>' +
      '  </div>' +
      '  <button type="button" class="jkhive-pagination-pagebtn" data-jkhive-gallery-last title="Ultima pagina">Fin</button>' +
      '</div>';
    gallery.insertAdjacentElement('afterend', pager);
    return pager;
  }

  function ensureSearchBar(gallery) {
    var prev = gallery.previousElementSibling;
    if (prev && prev.classList.contains('jkhive-gallery-searchbar')) return prev;

    var wrap = document.createElement('div');
    wrap.className = 'jkhive-gallery-searchbar';
    wrap.innerHTML =
      '<label class="jkhive-gallery-searchbar-label" for="">Buscar en la galeria</label>' +
      '<input type="search" class="jkhive-gallery-searchbar-input" data-jkhive-gallery-search placeholder="Titulo, subtitulo o texto...">';
    gallery.insertAdjacentElement('beforebegin', wrap);
    return wrap;
  }

  function chunkItems(items, chunkSize) {
    var pages = [];
    for (var i = 0; i < items.length; i += chunkSize) {
      pages.push(items.slice(i, i + chunkSize));
    }
    return pages.length ? pages : [items];
  }

  function mountPage(gallery, items) {
    gallery.innerHTML = '';
    items.forEach(function (item) {
      gallery.appendChild(item);
    });
  }

  function buildController(gallery) {
    var sizeKey = getSizeKey(gallery);
    var originalItems = getDirectItems(gallery, sizeKey);
    if (!originalItems.length) return null;

    var pager = ensurePager(gallery);
    var searchBar = ensureSearchBar(gallery);
    var meta = pager.querySelector('.jkhive-pagination-meta');
    var prevBtn = pager.querySelector('[data-jkhive-gallery-prev]');
    var nextBtn = pager.querySelector('[data-jkhive-gallery-next]');
    var firstBtn = pager.querySelector('[data-jkhive-gallery-first]');
    var lastBtn = pager.querySelector('[data-jkhive-gallery-last]');
    var pagesWrap = pager.querySelector('[data-jkhive-gallery-pages]');
    var searchInput = searchBar.querySelector('[data-jkhive-gallery-search]');
    var currentPage = 1;
    var pages = [];
    var filteredItems = originalItems.slice();

    function itemSearchText(item) {
      return (item.textContent || '').trim().toLowerCase();
    }

    function applyFilter() {
      var term = searchInput ? (searchInput.value || '').trim().toLowerCase() : '';
      if (!term) {
        filteredItems = originalItems.slice();
      } else {
        filteredItems = originalItems.filter(function (item) {
          return itemSearchText(item).indexOf(term) !== -1;
        });
      }
      currentPage = 1;
    }

    function goToPage(target) {
      if (!pages.length) return;
      if (target < 1) target = 1;
      if (target > pages.length) target = pages.length;
      currentPage = target;
      render();
    }

    function updateNumericPages() {
      if (!pagesWrap) return;
      pagesWrap.innerHTML = '';
      if (pages.length <= 1) return;

      var windowSize = 5;
      var start = Math.max(1, currentPage - 2);
      var end = Math.min(pages.length, start + windowSize - 1);
      start = Math.max(1, end - windowSize + 1);

      function addPageBtn(pageNum, isActive) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'jkhive-pagination-pagebtn' + (isActive ? ' is-active' : '');
        btn.textContent = String(pageNum);
        btn.addEventListener('click', function () {
          goToPage(pageNum);
        });
        pagesWrap.appendChild(btn);
      }

      if (start > 1) {
        addPageBtn(1, currentPage === 1);
        if (start > 2) {
          var dotsA = document.createElement('span');
          dotsA.className = 'jkhive-pagination-dots';
          dotsA.textContent = '...';
          pagesWrap.appendChild(dotsA);
        }
      }

      for (var p = start; p <= end; p += 1) {
        addPageBtn(p, p === currentPage);
      }

      if (end < pages.length) {
        if (end < pages.length - 1) {
          var dotsB = document.createElement('span');
          dotsB.className = 'jkhive-pagination-dots';
          dotsB.textContent = '...';
          pagesWrap.appendChild(dotsB);
        }
        addPageBtn(pages.length, currentPage === pages.length);
      }
    }

    function render() {
      var width = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0);
      var rawPage = computePageSize(sizeKey, width);
      var pageSize = snapPageSizeToHoneyCombCycle(sizeKey, width, rawPage);
      pages = chunkItems(filteredItems, pageSize);
      if (currentPage > pages.length) currentPage = pages.length;
      if (currentPage < 1) currentPage = 1;

      mountPage(gallery, pages[currentPage - 1]);

      if (meta) {
        var start = 0;
        var end = 0;
        var cur = pages[currentPage - 1];
        if (filteredItems.length && cur && cur.length) {
          var prevTotal = 0;
          for (var pi = 0; pi < currentPage - 1; pi++) {
            prevTotal += pages[pi] ? pages[pi].length : 0;
          }
          start = prevTotal + 1;
          end = prevTotal + cur.length;
        }
        meta.textContent =
          'Mostrando ' + start + '-' + end + ' de ' + filteredItems.length;
      }

      if (prevBtn) {
        prevBtn.classList.toggle('jkhive-pagination-btn-disabled', currentPage <= 1);
        prevBtn.disabled = currentPage <= 1;
      }
      if (nextBtn) {
        nextBtn.classList.toggle('jkhive-pagination-btn-disabled', currentPage >= pages.length);
        nextBtn.disabled = currentPage >= pages.length;
      }
      if (firstBtn) {
        firstBtn.classList.toggle('jkhive-pagination-btn-disabled', currentPage <= 1);
        firstBtn.disabled = currentPage <= 1;
      }
      if (lastBtn) {
        lastBtn.classList.toggle('jkhive-pagination-btn-disabled', currentPage >= pages.length);
        lastBtn.disabled = currentPage >= pages.length;
      }
      updateNumericPages();

      pager.style.display = pages.length > 1 ? '' : 'none';
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (currentPage <= 1) return;
        currentPage -= 1;
        render();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (currentPage >= pages.length) return;
        currentPage += 1;
        render();
      });
    }
    if (firstBtn) {
      firstBtn.addEventListener('click', function () {
        goToPage(1);
      });
    }
    if (lastBtn) {
      lastBtn.addEventListener('click', function () {
        goToPage(pages.length);
      });
    }
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        applyFilter();
        render();
      });
    }

    applyFilter();

    return { render: render };
  }

  function init() {
    var controllers = [];
    document.querySelectorAll(GALLERY_SELECTOR).forEach(function (gallery) {
      var controller = buildController(gallery);
      if (controller) controllers.push(controller);
    });
    if (!controllers.length) return;

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        controllers.forEach(function (ctrl) {
          ctrl.render();
        });
      }, 120);
    });

    controllers.forEach(function (ctrl) {
      ctrl.render();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
