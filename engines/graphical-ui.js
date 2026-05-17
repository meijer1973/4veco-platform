// Graphical Game - UI
// Depends on: theme.js, graphical/[par].js, adaptive-seam.js, graphical-engine.js

(function () {
  "use strict";

  var data = window.GRAPHICAL_GAME_DATA;
  var rootEl = document.getElementById("g-app");
  if (!data || !rootEl || typeof GraphicalEngine === "undefined") return;

  var engine = new GraphicalEngine({ data: data });
  var lastResult = null;

  function bindThemeToggle() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    function syncLabel() {
      var current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      btn.textContent = current === "dark" ? "Lichte modus" : "Donkere modus";
    }
    btn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("quizMode", next); } catch (e) { /* ignore */ }
      syncLabel();
    });
    syncLabel();
  }

  function escapeHtml(str) {
    var d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
  }

  function formatNumber(value) {
    if (Math.abs(value - Math.round(value)) < 0.0001) return String(Math.round(value));
    return String(Math.round(value * 10) / 10).replace(".", ",");
  }

  function renderChart(challenge) {
    var graph = challenge.graph;
    var values = graph.series.map(function (p) { return p.value; });
    var max = Math.max.apply(null, values.concat([1]));
    var min = Math.min.apply(null, values.concat([0]));
    var layout = getChartLayout();
    if (graph.type === "bar") return renderBarChart(graph, max, layout);
    return renderLineChart(graph, min, max, layout);
  }

  function getChartLayout() {
    var compact = false;
    try {
      compact = window.matchMedia && window.matchMedia("(max-width: 620px)").matches;
    } catch (e) {
      compact = false;
    }
    if (compact) {
      return {
        width: 440,
        height: 330,
        left: 54,
        bottom: 268,
        chartW: 330,
        chartH: 188,
        titleX: 220,
        titleY: 30,
        labelY: 306,
        yLabelX: 22,
        yLabelY: 160,
        barRadius: 5,
        dotRadius: 6
      };
    }
    return {
      width: 720,
      height: 360,
      left: 72,
      bottom: 292,
      chartW: 600,
      chartH: 220,
      titleX: 360,
      titleY: 32,
      labelY: 326,
      yLabelX: 26,
      yLabelY: 176,
      barRadius: 6,
      dotRadius: 7
    };
  }

  function renderBarChart(graph, max, layout) {
    var width = layout.width;
    var height = layout.height;
    var left = layout.left;
    var bottom = layout.bottom;
    var chartW = layout.chartW;
    var chartH = layout.chartH;
    var slot = chartW / graph.series.length;
    var bars = graph.series.map(function (point, idx) {
      var h = Math.max(8, (point.value / max) * chartH);
      var x = left + idx * slot + slot * 0.22;
      var y = bottom - h;
      var bw = slot * 0.56;
      return [
        '<g class="g-bar-item">',
        '<rect class="g-bar" x="' + x + '" y="' + y + '" width="' + bw + '" height="' + h + '" rx="' + layout.barRadius + '"></rect>',
        '<text class="g-chart-value" x="' + (x + bw / 2) + '" y="' + (y - 10) + '">' + escapeHtml(formatNumber(point.value)) + '</text>',
        '<text class="g-chart-label" x="' + (x + bw / 2) + '" y="' + layout.labelY + '">' + escapeHtml(point.label) + '</text>',
        '</g>'
      ].join("");
    }).join("");
    return [
      '<svg class="g-chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' + escapeHtml(graph.title) + '">',
      '<text class="g-chart-title" x="' + layout.titleX + '" y="' + layout.titleY + '">' + escapeHtml(graph.title) + '</text>',
      '<line class="g-axis" x1="' + left + '" y1="' + bottom + '" x2="' + (left + chartW) + '" y2="' + bottom + '"></line>',
      '<line class="g-axis" x1="' + left + '" y1="' + (bottom - chartH) + '" x2="' + left + '" y2="' + bottom + '"></line>',
      '<text class="g-axis-label g-y-label" x="' + layout.yLabelX + '" y="' + layout.yLabelY + '">' + escapeHtml(graph.unit) + '</text>',
      bars,
      '</svg>'
    ].join("");
  }

  function renderLineChart(graph, min, max, layout) {
    var width = layout.width;
    var height = layout.height;
    var left = layout.left;
    var bottom = layout.bottom;
    var chartW = layout.chartW;
    var chartH = layout.chartH;
    var range = max - min || 1;
    var step = chartW / Math.max(1, graph.series.length - 1);
    var coords = graph.series.map(function (point, idx) {
      var x = left + idx * step;
      var y = bottom - ((point.value - min) / range) * chartH;
      return { x: x, y: y, point: point };
    });
    var poly = coords.map(function (c) { return c.x + "," + c.y; }).join(" ");
    var dots = coords.map(function (c) {
      return [
        '<g class="g-line-point">',
        '<circle class="g-dot" cx="' + c.x + '" cy="' + c.y + '" r="' + layout.dotRadius + '"></circle>',
        '<text class="g-chart-value" x="' + c.x + '" y="' + (c.y - 14) + '">' + escapeHtml(formatNumber(c.point.value)) + '</text>',
        '<text class="g-chart-label" x="' + c.x + '" y="' + layout.labelY + '">' + escapeHtml(c.point.label) + '</text>',
        '</g>'
      ].join("");
    }).join("");
    return [
      '<svg class="g-chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' + escapeHtml(graph.title) + '">',
      '<text class="g-chart-title" x="' + layout.titleX + '" y="' + layout.titleY + '">' + escapeHtml(graph.title) + '</text>',
      '<line class="g-axis" x1="' + left + '" y1="' + bottom + '" x2="' + (left + chartW) + '" y2="' + bottom + '"></line>',
      '<line class="g-axis" x1="' + left + '" y1="' + (bottom - chartH) + '" x2="' + left + '" y2="' + bottom + '"></line>',
      '<text class="g-axis-label g-y-label" x="' + layout.yLabelX + '" y="' + layout.yLabelY + '">' + escapeHtml(graph.unit) + '</text>',
      '<polyline class="g-line" points="' + poly + '"></polyline>',
      dots,
      '</svg>'
    ].join("");
  }

  function renderInputs(challenge) {
    if (challenge.expected_answer.kind === "number") {
      return [
        '<form class="g-answer-form" id="g-answer-form">',
        '<label for="g-number-answer">Waarde uit de grafiek</label>',
        '<div class="g-answer-row">',
        '<input id="g-number-answer" inputmode="decimal" autocomplete="off" placeholder="Bijvoorbeeld ' + escapeHtml(formatNumber(challenge.expected_answer.value)) + '">',
        '<span class="g-unit">' + escapeHtml(challenge.expected_answer.unit) + '</span>',
        '<button type="submit" class="g-btn">Controleer</button>',
        '</div>',
        '</form>'
      ].join("");
    }
    var options = challenge.graph.series.map(function (point) {
      return '<option value="' + escapeHtml(point.label) + '">' + escapeHtml(point.label) + '</option>';
    }).join("");
    return [
      '<form class="g-answer-form" id="g-answer-form">',
      '<div class="g-select-grid">',
      '<label>Oude waarde<select id="g-old-label">' + options + '</select></label>',
      '<label>Nieuwe waarde<select id="g-new-label">' + options + '</select></label>',
      '</div>',
      '<label for="g-percent-answer">Procentuele verandering</label>',
      '<div class="g-answer-row">',
      '<input id="g-percent-answer" inputmode="decimal" autocomplete="off" placeholder="Bijvoorbeeld ' + escapeHtml(formatNumber(challenge.expected_answer.value)) + '">',
      '<span class="g-unit">%</span>',
      '<button type="submit" class="g-btn">Controleer</button>',
      '</div>',
      '</form>'
    ].join("");
  }

  function renderFeedback(result) {
    if (!result) return "";
    var title = result.correct ? "Goed gelezen" : "Kijk nog eens naar de bron";
    var steps = result.feedback_steps.map(function (step) {
      return '<li><strong>' + escapeHtml(step.label) + ':</strong> ' + escapeHtml(step.text) + '</li>';
    }).join("");
    return [
      '<section class="g-feedback ' + (result.correct ? 'is-correct' : 'is-wrong') + '" aria-live="polite">',
      '<h3>' + title + '</h3>',
      '<ul>' + steps + '</ul>',
      '<button type="button" class="g-btn g-btn-secondary" id="g-next-btn">' + (engine.index === data.challenges.length - 1 ? 'Bekijk resultaat' : 'Volgende opgave') + '</button>',
      '</section>'
    ].join("");
  }

  function renderSummary() {
    var summary = engine.getSummary();
    return [
      '<main class="g-shell">',
      '<section class="g-panel g-summary">',
      '<p class="g-kicker">Klaar</p>',
      '<h1>' + summary.correct + ' van ' + summary.total + ' goed</h1>',
      '<p>Je hebt geoefend met grafieken aflezen en waarden gebruiken in een berekening.</p>',
      '<button type="button" class="g-btn" id="g-restart-btn">Opnieuw oefenen</button>',
      '</section>',
      '</main>'
    ].join("");
  }

  function render() {
    if (engine.isComplete()) {
      rootEl.innerHTML = renderSummary();
      document.getElementById("g-restart-btn").addEventListener("click", function () {
        engine = new GraphicalEngine({ data: data });
        lastResult = null;
        render();
      });
      return;
    }

    var challenge = engine.getCurrentChallenge();
    var progress = engine.getProgress();
    rootEl.innerHTML = [
      '<main class="g-shell">',
      '<section class="g-panel g-intro">',
      '<div>',
      '<p class="g-kicker">Grafiekenspel</p>',
      '<h1>' + escapeHtml(data.student_title || data.meta.title || "Grafieken lezen") + '</h1>',
      '<p>' + escapeHtml(data.student_subtitle || "Lees de grafiek, kies de juiste waarden en reken rustig verder.") + '</p>',
      '</div>',
      '<div class="g-progress" aria-label="Voortgang"><span>' + progress.current + '</span><small>/ ' + progress.total + '</small></div>',
      '</section>',
      '<section class="g-grid">',
      '<article class="g-panel g-chart-panel">',
      '<div class="g-challenge-head">',
      '<p class="g-kicker">Opgave ' + progress.current + '</p>',
      '<h2>' + escapeHtml(challenge.title) + '</h2>',
      '<p>' + escapeHtml(challenge.prompt) + '</p>',
      '</div>',
      '<div class="g-chart-wrap">' + renderChart(challenge) + '</div>',
      '</article>',
      '<aside class="g-panel g-work-panel">',
      renderInputs(challenge),
      renderFeedback(lastResult),
      '</aside>',
      '</section>',
      '</main>'
    ].join("");

    bindForm(challenge);
    var nextBtn = document.getElementById("g-next-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        lastResult = null;
        engine.nextChallenge();
        render();
      });
    }
  }

  function bindForm(challenge) {
    var form = document.getElementById("g-answer-form");
    if (!form) return;
    if (challenge.expected_answer.kind === "percentage_change") {
      document.getElementById("g-old-label").value = challenge.graph.series[0].label;
      document.getElementById("g-new-label").value = challenge.graph.series[challenge.graph.series.length - 1].label;
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (challenge.expected_answer.kind === "number") {
        lastResult = engine.answerNumber(document.getElementById("g-number-answer").value);
      } else {
        lastResult = engine.answerPercentage({
          old_label: document.getElementById("g-old-label").value,
          new_label: document.getElementById("g-new-label").value,
          value: document.getElementById("g-percent-answer").value
        });
      }
      render();
    });
  }

  bindThemeToggle();
  render();
})();
