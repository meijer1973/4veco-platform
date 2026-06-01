// Graphical Game - UI
// Depends on: theme.js, task-shell, graphical/[par].js, adaptive-seam.js, graphical-engine.js

(function () {
  "use strict";

  var data = window.GRAPHICAL_GAME_DATA;
  var rootEl = document.getElementById("g-app");
  if (!data || !rootEl || typeof GraphicalEngine === "undefined") return;

  var engine = new GraphicalEngine({ data: data });
  var lastResult = null;
  var focusFeedbackAfterRender = false;

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

  function showValueLabels(graph) {
    return graph.show_value_labels !== false;
  }

  function getYAxisTicks(graph, min, max) {
    if (Array.isArray(graph.y_ticks) && graph.y_ticks.length >= 2) {
      return graph.y_ticks.filter(function (tick) {
        return typeof tick === "number" && isFinite(tick);
      });
    }
    var count = 4;
    var range = max - min || 1;
    var ticks = [];
    for (var i = 0; i <= count; i++) {
      ticks.push(min + (range * i / count));
    }
    return ticks;
  }

  function renderYAxisTicks(graph, min, max, layout) {
    if (graph.show_y_ticks !== true && graph.show_value_labels !== false) return "";
    var range = max - min || 1;
    return getYAxisTicks(graph, min, max).map(function (tick) {
      var y = layout.bottom - ((tick - min) / range) * layout.chartH;
      return [
        '<g class="g-axis-tick-row">',
        '<line class="g-grid-line" x1="' + layout.left + '" y1="' + y + '" x2="' + (layout.left + layout.chartW) + '" y2="' + y + '"></line>',
        '<text class="g-axis-tick" x="' + (layout.left - 10) + '" y="' + (y + 4) + '">' + escapeHtml(formatNumber(tick)) + '</text>',
        '</g>'
      ].join("");
    }).join("");
  }

  function renderSkillMapRoute() {
    if (!window.SkillMapRouteUI || typeof engine.getSkillMapRequest !== "function") return "";
    var routeOptions = window.SkillMapRouteUI.getRouteOptions("graphical", { mode: "compact", maxVisibleAvailable: 3 });
    return window.SkillMapRouteUI.renderRequest(
      engine.getSkillMapRequest(routeOptions),
      routeOptions
    );
  }

  function renderChart(challenge) {
    var graph = challenge.graph;
    if (graph.type === "table") return renderSourceTable(graph);
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
        showValueLabels(graph) ? '<text class="g-chart-value" x="' + (x + bw / 2) + '" y="' + (y - 10) + '">' + escapeHtml(formatNumber(point.value)) + '</text>' : '',
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
      renderYAxisTicks(graph, 0, max, layout),
      bars,
      '</svg>'
    ].join("");
  }

  function renderSourceTable(graph) {
    var headers = graph.columns.map(function (column) {
      return '<th scope="col">' + escapeHtml(column) + '</th>';
    }).join("");
    var rows = graph.rows.map(function (row) {
      return '<tr>' + row.values.map(function (value) {
        return '<td>' + escapeHtml(value) + '</td>';
      }).join("") + '</tr>';
    }).join("");
    return [
      '<div class="g-source-table-wrap" role="region" aria-label="' + escapeHtml(graph.title) + '">',
      '<h3>' + escapeHtml(graph.title) + '</h3>',
      '<table class="g-source-table">',
      '<thead><tr>' + headers + '</tr></thead>',
      '<tbody>' + rows + '</tbody>',
      '</table>',
      '</div>'
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
        showValueLabels(graph) ? '<text class="g-chart-value" x="' + c.x + '" y="' + (c.y - 14) + '">' + escapeHtml(formatNumber(c.point.value)) + '</text>' : '',
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
      renderYAxisTicks(graph, min, max, layout),
      '<polyline class="g-line" points="' + poly + '"></polyline>',
      dots,
      '</svg>'
    ].join("");
  }

  function renderChecklist(challenge) {
    var steps = challenge.expected_answer.kind === "percentage_change"
      ? [
        "Kies de oude waarde.",
        "Kies de nieuwe waarde.",
        "Bereken verschil = nieuw - oud.",
        "Deel door oud en vermenigvuldig met 100%."
      ]
      : [
        "Lees de titel en de assen.",
        "Zoek de gevraagde periode of waarde.",
        "Lees de grafiekwaarde af.",
        "Vul pas daarna je antwoord in."
      ];
    var items = steps.map(function (step) {
      return '<li>' + escapeHtml(step) + '</li>';
    }).join("");
    return '<ol class="g-checklist" aria-label="Aanpak">' + items + '</ol>';
  }

  function renderInputs(challenge) {
    if (challenge.expected_answer.kind === "number") {
      return [
        renderChecklist(challenge),
        '<form class="g-answer-form" id="g-answer-form">',
        '<label for="g-number-answer">Waarde uit de grafiek</label>',
        '<div class="g-answer-row">',
        '<input id="g-number-answer" inputmode="decimal" autocomplete="off" placeholder="Typ je antwoord">',
        '<span class="g-unit">' + escapeHtml(challenge.expected_answer.unit) + '</span>',
        '<button type="submit" class="g-btn">Controleer</button>',
        '</div>',
        '</form>'
      ].join("");
    }
    var options = challenge.graph.series.map(function (point) {
      return '<option value="' + escapeHtml(point.label) + '">' + escapeHtml(point.label) + '</option>';
    }).join("");
    var oldOptions = '<option value="" disabled selected>Kies oude waarde</option>' + options;
    var newOptions = '<option value="" disabled selected>Kies nieuwe waarde</option>' + options;
    return [
      renderChecklist(challenge),
      '<form class="g-answer-form" id="g-answer-form">',
      '<div class="g-select-grid">',
      '<label for="g-old-label">Oude waarde<select id="g-old-label" required>' + oldOptions + '</select></label>',
      '<label for="g-new-label">Nieuwe waarde<select id="g-new-label" required>' + newOptions + '</select></label>',
      '</div>',
      '<label for="g-percent-answer">Procentuele verandering</label>',
      '<div class="g-answer-row">',
      '<input id="g-percent-answer" inputmode="decimal" autocomplete="off" placeholder="Typ je percentage">',
      '<span class="g-unit">%</span>',
      '<button type="submit" class="g-btn">Controleer</button>',
      '</div>',
      '</form>'
    ].join("");
  }

  function renderDiagnosticFeedback(result) {
    if (!result || result.correct) return "";
    var expected = result.expected || {};
    var submitted = result.submitted || {};
    var text = "";
    if (expected.kind === "percentage_change") {
      if (!submitted.old_label || !submitted.new_label) {
        text = "Kies eerst de oude en de nieuwe waarde uit de grafiek.";
      } else if (submitted.old_label !== expected.old_label || submitted.new_label !== expected.new_label) {
        if (submitted.old_label !== expected.old_label && submitted.new_label !== expected.new_label) {
          text = "Je koos niet de gevraagde oude en nieuwe waarde. De vraag vergelijkt " + expected.old_label + " met " + expected.new_label + ".";
        } else if (submitted.old_label !== expected.old_label) {
          text = "Je oude waarde klopt nog niet. Begin bij " + expected.old_label + ".";
        } else {
          text = "Je nieuwe waarde klopt nog niet. Vergelijk met " + expected.new_label + ".";
        }
      } else {
        text = "Je koos de juiste waarden, maar de berekening klopt nog niet. Gebruik: (nieuw - oud) / oud x 100%.";
      }
    } else if (expected.kind === "number") {
      if (submitted.value == null) {
        text = "Vul een getal in voordat je controleert.";
      } else {
        text = "Zoek de gevraagde periode in de grafiek en neem de waarde over zonder de eenheid.";
      }
    }
    return text ? '<p class="g-feedback-diagnosis">' + escapeHtml(text) + '</p>' : "";
  }

  function renderFeedback(result) {
    if (!result) return "";
    var title = result.correct ? "Goed gelezen" : "Kijk nog eens naar de bron";
    var diagnosis = renderDiagnosticFeedback(result);
    var steps = result.feedback_steps.map(function (step) {
      return '<li><strong>' + escapeHtml(step.label) + ':</strong> ' + escapeHtml(step.text) + '</li>';
    }).join("");
    return [
      '<section class="g-feedback ' + (result.correct ? 'is-correct' : 'is-wrong') + '" aria-live="polite">',
      '<h3>' + title + '</h3>',
      diagnosis,
      '<ul>' + steps + '</ul>',
      '<button type="button" class="g-btn g-btn-secondary" id="g-next-btn">' + (engine.index === data.challenges.length - 1 ? 'Bekijk resultaat' : 'Volgende opgave') + '</button>',
      '</section>'
    ].join("");
  }

  function renderTaskShellTask(challenge, progress) {
    if (!window.TaskShellUI || typeof engine.getCurrentTaskShellTask !== "function") {
      return renderInputs(challenge);
    }
    var task = engine.getCurrentTaskShellTask();
    var taskMarkup = window.TaskShellUI.renderTask(task, progress.current - 1);
    taskMarkup = removeTaskShellFeedbackRegion(taskMarkup, task.id);
    return [
      '<section class="g-task-shell" data-graph-task-shell="GRAPH-UX-2">',
      '<div class="g-task-shell-head">',
      '<p class="g-kicker">Taak ' + progress.current + ' van ' + progress.total + '</p>',
      '<p>Lees de bron, geef je antwoord en kijk rustig na wat je volgende stap is.</p>',
      '</div>',
      taskMarkup,
      '<button type="button" class="g-btn g-task-check" id="g-task-check-btn">Controleer</button>',
      renderTaskShellFeedbackRegion(lastResult, task.id),
      '</section>'
    ].join("");
  }

  function removeTaskShellFeedbackRegion(markup, taskId) {
    var id = escapeHtml(taskId).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return String(markup).replace(new RegExp('<div class="ts-feedback"[^>]*data-feedback-for="' + id + '"[^>]*></div>'), "");
  }

  function renderTaskShellFeedbackRegion(result, taskId) {
    var feedbackHtml = renderTaskShellFeedback(result);
    return [
      '<div class="ts-feedback" id="g-task-feedback" data-feedback-for="' + escapeHtml(taskId) + '" aria-live="polite" role="status" aria-label="Feedback op je antwoord" tabindex="-1">',
      feedbackHtml,
      '</div>',
      result ? '<button type="button" class="g-btn g-btn-secondary" id="g-next-btn">' + (engine.index === data.challenges.length - 1 ? 'Bekijk resultaat' : 'Volgende opgave') + '</button>' : ''
    ].join("");
  }

  function renderTaskShellFeedback(result) {
    if (!result || !window.TaskShellUI) return "";
    var feedback = {
      state: result.state || (result.correct ? "matched" : "retry"),
      feedbackTitle: result.feedbackTitle,
      feedbackText: result.feedbackText,
      selfCheckCriteria: result.selfCheckCriteria || [],
      practiceRoute: result.practiceRoute
    };
    return window.TaskShellUI.renderFeedback(feedback);
  }

  function renderSummary() {
    var summary = engine.getSummary();
    var progress = engine.getProgress();
    return [
      '<main class="g-shell">',
      '<section class="g-panel g-summary">',
      '<p class="g-kicker">Klaar</p>',
      '<h1>' + progress.completed + ' van ' + progress.total + ' taken gedaan</h1>',
      '<p>Je hebt lokaal geoefend met grafieken, tabellen, assen en bronwaarden. Gebruik dit als oefenstap; het is geen cijfer of automatische route.</p>',
      '<button type="button" class="g-btn" id="g-restart-btn">Opnieuw oefenen</button>',
      '</section>',
      '</main>'
    ].join("");
  }

  function render() {
    if (engine.isComplete() && !lastResult) {
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
      '<section class="g-route-cue">',
      renderSkillMapRoute(),
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
      renderTaskShellTask(challenge, progress),
      '</aside>',
      '</section>',
      '</main>'
    ].join("");

    bindTaskShell(challenge);
    var nextBtn = document.getElementById("g-next-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        lastResult = null;
        focusFeedbackAfterRender = false;
        engine.nextChallenge();
        render();
      });
    }
    if (focusFeedbackAfterRender) {
      focusFeedbackAfterRender = false;
      var feedbackRegion = document.getElementById("g-task-feedback");
      if (feedbackRegion && typeof feedbackRegion.focus === "function") {
        feedbackRegion.focus({ preventScroll: true });
      }
    }
  }

  function collectTaskShellResponse(task) {
    if (!task) return null;
    var selected = rootEl.querySelector('[data-task="' + escapeCss(task.id) + '"] .ts-choice.selected');
    if (task.family === "choice" || task.family === "table_value_selection") {
      return selected ? selected.getAttribute("data-choice-id") : "";
    }
    if (task.family === "multi_select" && window.TaskShellUI && window.TaskShellUI.collectMultiSelectResponse) {
      return window.TaskShellUI.collectMultiSelectResponse(rootEl, task);
    }
    if (task.family === "point_placement") {
      return {
        x: getValue('[data-task-id="' + escapeCss(task.id) + '"][data-point-axis="x"]'),
        y: getValue('[data-task-id="' + escapeCss(task.id) + '"][data-point-axis="y"]')
      };
    }
    if (task.family === "calculation_work_capture") {
      return {
        work: getValue('[data-task-id="' + escapeCss(task.id) + '"][data-input-role="work"]'),
        finalAnswer: getValue('[data-task-id="' + escapeCss(task.id) + '"][data-input-role="final-answer"]'),
        unitNotation: getValue('[data-task-id="' + escapeCss(task.id) + '"][data-input-role="unit-notation"]')
      };
    }
    if (task.family === "cloze_tile_select" && window.TaskShellUI && window.TaskShellUI.collectClozeTileResponse) {
      return window.TaskShellUI.collectClozeTileResponse(rootEl, task);
    }
    if (task.family === "cloze_text" && window.TaskShellUI && window.TaskShellUI.collectClozeTextResponse) {
      return window.TaskShellUI.collectClozeTextResponse(rootEl, task);
    }
    if (task.family === "sentence_builder" && window.TaskShellUI && window.TaskShellUI.collectSentenceBuilderResponse) {
      return window.TaskShellUI.collectSentenceBuilderResponse(rootEl, task);
    }
    if (task.family === "formula_builder" && window.TaskShellUI && window.TaskShellUI.collectFormulaBuilderResponse) {
      return window.TaskShellUI.collectFormulaBuilderResponse(rootEl, task);
    }
    if (task.family === "step_ordering" && window.TaskShellUI && window.TaskShellUI.collectStepOrderingResponse) {
      return window.TaskShellUI.collectStepOrderingResponse(rootEl, task);
    }
    return getValue('[data-task-id="' + escapeCss(task.id) + '"][data-input-role="answer"]');
  }

  function escapeCss(value) {
    if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(value);
    return String(value).replace(/"/g, '\\"');
  }

  function getValue(selector) {
    var el = rootEl.querySelector(selector);
    return el ? el.value : "";
  }

  function bindTaskShell(challenge) {
    if (!window.TaskShellUI || typeof engine.getCurrentTaskShellTask !== "function") {
      bindForm(challenge);
      return;
    }
    var task = engine.getCurrentTaskShellTask();
    rootEl.querySelectorAll(".ts-multi-select").forEach(function (multi) {
      multi.addEventListener("click", function (event) {
        window.TaskShellUI.handleMultiSelectClick(rootEl, event);
      });
    });
    rootEl.querySelectorAll(".ts-cloze").forEach(function (cloze) {
      cloze.addEventListener("click", function (event) {
        window.TaskShellUI.handleClozeTileClick(rootEl, event);
      });
    });
    rootEl.querySelectorAll(".ts-sentence").forEach(function (sentence) {
      sentence.addEventListener("click", function (event) {
        window.TaskShellUI.handleSentenceBuilderClick(rootEl, event);
      });
    });
    rootEl.querySelectorAll(".ts-formula").forEach(function (formula) {
      formula.addEventListener("click", function (event) {
        window.TaskShellUI.handleFormulaBuilderClick(rootEl, event);
      });
    });
    rootEl.querySelectorAll(".ts-step-ordering").forEach(function (ordering) {
      ordering.addEventListener("click", function (event) {
        window.TaskShellUI.handleStepOrderingClick(rootEl, event);
      });
    });
    rootEl.querySelectorAll(".ts-choice").forEach(function (button) {
      button.addEventListener("click", function () {
        var taskEl = button.closest(".ts-task");
        if (taskEl) {
          taskEl.querySelectorAll(".ts-choice").forEach(function (other) {
            other.classList.remove("selected");
            other.setAttribute("aria-pressed", "false");
          });
        }
        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
      });
    });
    var checkBtn = document.getElementById("g-task-check-btn");
    if (!checkBtn) return;
    checkBtn.addEventListener("click", function () {
      lastResult = engine.evaluateTaskShellResponse(collectTaskShellResponse(task));
      focusFeedbackAfterRender = true;
      render();
    });
  }

  function bindForm(challenge) {
    var form = document.getElementById("g-answer-form");
    if (!form) return;

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
