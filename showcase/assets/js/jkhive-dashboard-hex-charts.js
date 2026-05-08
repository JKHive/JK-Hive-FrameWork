/**
 * JK Hive — gráficos de dashboard dentro de filosofía hex (prototipo showcase).
 */
(function () {
  'use strict';

  function conicFromSlices(slices) {
    var start = -90;
    var parts = [];
    for (var i = 0; i < slices.length; i++) {
      var s = slices[i];
      var deg = ((s.pct || 0) / 100) * 360;
      var end = start + deg;
      parts.push(s.color + ' ' + start + 'deg ' + end + 'deg');
      start = end;
    }
    return 'conic-gradient(' + parts.join(', ') + ')';
  }

  function polarPoint(cx, cy, r, angleDeg) {
    var a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function renderPieHex(el, slices) {
    el.className = 'jkhive-hexchart-pie';
    el.style.background = conicFromSlices(slices);
    el.setAttribute('role', 'img');
    el.setAttribute(
      'aria-label',
      'Gráfico torta hexagonal (sectores por ángulo)',
    );
  }

  function renderStar6(el, labels, values) {
    labels = labels || [];
    values = values || [];
    var n = 6;
    var cx = 100;
    var cy = 100;
    var rOuter = 78;
    var rLabel = 92;
    var pts = [];
    for (var i = 0; i < n; i++) {
      var ang = i * (360 / n);
      var v = Math.max(0, Math.min(1, values[i] != null ? values[i] : 0));
      var p = polarPoint(cx, cy, rOuter * v, ang);
      pts.push(p.x + ',' + p.y);
    }

    var gridR = [26, 52, 78];
    var circles = '';
    var axes = '';
    for (var g = 0; g < gridR.length; g++) {
      var rr = gridR[g];
      var gp = [];
      for (var j = 0; j < n; j++) {
        var p2 = polarPoint(cx, cy, rr, j * (360 / n));
        gp.push(p2.x + ',' + p2.y);
      }
      circles +=
        '<polygon class="jkhive-hexchart-star-grid" points="' +
        gp.join(' ') +
        '" />';
    }
    for (var k = 0; k < n; k++) {
      var p0 = polarPoint(cx, cy, rOuter, k * (360 / n));
      axes +=
        '<line class="jkhive-hexchart-star-axis" x1="' +
        cx +
        '" y1="' +
        cy +
        '" x2="' +
        p0.x +
        '" y2="' +
        p0.y +
        '" />';
    }

    var lbl = '';
    var monthLbl = labels.length ? labels : ['E', 'F', 'M', 'A', 'M', 'J'];
    for (var li = 0; li < n; li++) {
      var pla = polarPoint(cx, cy, rLabel, li * (360 / n));
      lbl +=
        '<text class="jkhive-hexchart-star-label" x="' +
        pla.x +
        '" y="' +
        pla.y +
        '">' +
        escapeHtml(monthLbl[li] || '') +
        '</text>';
    }

    el.innerHTML =
      '<svg class="jkhive-hexchart-star-svg" width="220" height="220" viewBox="0 0 200 200" aria-hidden="false">' +
      axes +
      circles +
      '<polygon class="jkhive-hexchart-star-shape" points="' +
      pts.join(' ') +
      '" />' +
      lbl +
      '</svg>';
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderBars(el, series, horizontal) {
    el.className =
      'jkhive-hexbars' + (horizontal ? ' jkhive-hexbars--horizontal' : '');
    var maxSteps = 10;
    var html = '';
    for (var i = 0; i < series.length; i++) {
      var item = series[i];
      var steps = Math.round((item.value / item.max) * maxSteps);
      steps = Math.max(0, Math.min(maxSteps, steps));
      var cells = '';
      for (var r = 0; r < maxSteps; r++) {
        var filled = r < steps;
        cells +=
          '<div class="jkhive-hexcell' +
          (filled ? ' filled' + (horizontal ? ' alt' : '') : '') +
          '"></div>';
      }
      var tip = escapeHtml(item.label + ': ' + item.value);
      if (horizontal) {
        html +=
          '<div class="jkhive-hexbars-row" data-tooltip="' +
          tip +
          '">' +
          '<div class="jkhive-hexbars-label">' +
          escapeHtml(item.label) +
          '</div><div class="jkhive-hexbars-row-cells">' +
          cells +
          '</div></div>';
      } else {
        html +=
          '<div class="jkhive-hexbars-col" data-tooltip="' +
          tip +
          '">' +
          cells +
          '<div class="jkhive-hexbars-label">' +
          escapeHtml(item.label) +
          '</div></div>';
      }
    }
    el.innerHTML = html;
  }

  window.JKHiveHexCharts = {
    renderPieHex: renderPieHex,
    renderStar6: renderStar6,
    renderBarsVertical: function (el, series) {
      renderBars(el, series, false);
    },
    renderBarsHorizontal: function (el, series) {
      renderBars(el, series, true);
    },

    mount: function mount(rootId) {
      var root = document.getElementById(rootId || 'jkhive-hexcharts-demo');
      if (!root) return;

      root.innerHTML =
        '<figure class="jkhive-hexchart-card"><figcaption>Torta hex (sectores por ángulo)</figcaption><div class="jkhive-hexchart-pie-wrap"><div data-hexchart-pie></div></div><p class="jkhive-hexchart-note">Proporción igual que una torta sobre círculo; el hexágono actúa como máscara. Si en el futuro se requiere reparto por área dentro del hex, hace falta otra función de mapeo (no usar ángulos del círculo).</p></figure>' +
        '<figure class="jkhive-hexchart-card"><figcaption>Estrella / radar · 6 ejes</figcaption><div data-hexchart-star></div><p class="jkhive-hexchart-note">Polígono sobre radios a vértices de un hex; valores normalizados 0–1 por eje.</p></figure>' +
        '<figure class="jkhive-hexchart-card"><figcaption>Barras verticales · celdas hex</figcaption><div data-hexchart-bars-v></div></figure>' +
        '<figure class="jkhive-hexchart-card"><figcaption>Barras horizontales · celdas hex</figcaption><div data-hexchart-bars-h></div></figure>';

      var pie = root.querySelector('[data-hexchart-pie]');
      if (pie) {
        renderPieHex(pie, [
          { color: '#0ea5e9', pct: 35 },
          { color: '#22c55e', pct: 28 },
          { color: '#eab308', pct: 18 },
          { color: '#a855f7', pct: 19 },
        ]);
      }

      var star = root.querySelector('[data-hexchart-star]');
      if (star) {
        renderStar6(star, ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], [
          0.85, 0.55, 0.92, 0.4, 0.72, 0.63,
        ]);
      }

      var bv = root.querySelector('[data-hexchart-bars-v]');
      if (bv) {
        renderBars(bv, [
          { label: 'A', max: 100, value: 72 },
          { label: 'B', max: 100, value: 45 },
          { label: 'C', max: 100, value: 90 },
          { label: 'D', max: 100, value: 30 },
          { label: 'E', max: 100, value: 55 },
          { label: 'F', max: 100, value: 68 },
        ]);
      }

      var bh = root.querySelector('[data-hexchart-bars-h]');
      if (bh) {
        renderBars(
          bh,
          [
            { label: 'Ventas', max: 100, value: 60 },
            { label: 'Soporte', max: 100, value: 82 },
            { label: 'NPS', max: 100, value: 48 },
          ],
          true,
        );
      }
    },
  };
})();
