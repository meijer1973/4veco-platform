// Procedure Practice Game — UI (DOM rendering & event binding)
// Depends on: theme.js, procedure/[par].js, procedure-engine.js

(function () {
  "use strict";

  var data = window.PROCEDURE_DATA;
  if (!data) return;

  // --- Domain colors ---
  var par = data.meta.parNr.substring(0, 3);
  var dc = (window.DOMAIN_COLORS && window.DOMAIN_COLORS[par]) || {
    primary: "#1A5276", primaryDk: "#154360", primaryLt: "#EBF5FB",
    accent: "#F8C471", navy: "#1E2761"
  };
  var root = document.documentElement;
  root.style.setProperty("--p-primary", dc.primary);
  root.style.setProperty("--p-primary-dk", dc.primaryDk);
  root.style.setProperty("--p-primary-lt", dc.primaryLt);
  root.style.setProperty("--p-accent", dc.accent);
  root.style.setProperty("--p-navy", dc.navy);

  // --- Engine ---
  var engine = new ProcedureEngine({
    procedures: data.procedures,
    parNr: data.meta.parNr
  });

  // --- DOM refs ---
  var els = {
    menuScreen:    document.getElementById("p-menu"),
    gameScreen:    document.getElementById("p-game"),
    resultsScreen: document.getElementById("p-results"),
    procedureGrid: document.getElementById("p-procedure-grid"),
    backBtn:       document.getElementById("p-back-btn"),
    gameTitle:     document.getElementById("p-game-title"),
    stepCounter:   document.getElementById("p-step-counter"),
    pipeline:      document.getElementById("p-pipeline"),
    checkBtn:      document.getElementById("p-check-btn"),
    nextBtn:       document.getElementById("p-next-btn"),
    replayBtn:     document.getElementById("p-replay-btn"),
    menuBtn:       document.getElementById("p-menu-btn"),
    resultsEmoji:  document.getElementById("p-results-emoji"),
    resultsTitle:  document.getElementById("p-results-title"),
    resultsScore:  document.getElementById("p-results-score"),
    resultsFill:   document.getElementById("p-results-fill"),
    resultsDetail: document.getElementById("p-results-detail"),
    sidebarList:   document.getElementById("p-sidebar-list"),
    scrollHint:    document.getElementById("p-scroll-hint")
  };

  // --- Screen management ---
  function showScreen(screen) {
    [els.menuScreen, els.gameScreen, els.resultsScreen].forEach(function (s) {
      if (s) s.classList.remove("active");
    });
    if (screen) screen.classList.add("active");
  }

  // --- Arrow SVG ---
  function arrowSVG() {
    return '<svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>';
  }

  // --- Sidebar ---
  function renderSidebar(activeId) {
    var html = "";
    data.procedures.forEach(function (proc) {
      var best = engine.getBestScore(proc.id);
      var checkClass = "";
      var checkIcon = "";
      if (best) {
        if (best.correct === best.total) {
          checkClass = "p-done";
          checkIcon = '<i class="fa-solid fa-circle-check"></i>';
        } else {
          checkClass = "p-partial";
          checkIcon = '<i class="fa-solid fa-circle-half-stroke"></i>';
        }
      }
      var activeClass = proc.id === activeId ? " p-active" : "";
      html += '<li class="p-sidebar-item' + activeClass + '" data-id="' + proc.id + '">';
      html += '<span class="p-sidebar-item-icon"><i class="fa-solid ' + proc.icon + '"></i></span>';
      html += '<span>' + proc.title + '</span>';
      if (checkIcon) html += '<span class="p-sidebar-item-check ' + checkClass + '">' + checkIcon + '</span>';
      html += '</li>';
    });
    els.sidebarList.innerHTML = html;

    // Click handler
    els.sidebarList.querySelectorAll(".p-sidebar-item").forEach(function (item) {
      item.addEventListener("click", function () {
        var id = this.getAttribute("data-id");
        for (var i = 0; i < data.procedures.length; i++) {
          if (data.procedures[i].id === id) {
            startGame(i);
            break;
          }
        }
      });
    });
  }

  // --- Menu Screen ---
  function renderMenu() {
    showScreen(els.menuScreen);
    var html = "";
    data.procedures.forEach(function (proc, idx) {
      var chooseCount = 0;
      proc.steps.forEach(function (s) { if (s.type === "choose") chooseCount++; });
      var best = engine.getBestScore(proc.id);
      var bestHtml = "";
      if (best) {
        if (best.correct === best.total) {
          bestHtml = '<span class="p-procedure-card-best p-best-perfect"><i class="fa-solid fa-star"></i> Perfect</span>';
        } else {
          bestHtml = '<span class="p-procedure-card-best p-best-partial">' + best.correct + '/' + best.total + '</span>';
        }
      }
      html += '<div class="p-procedure-card" data-idx="' + idx + '">';
      html += bestHtml;
      html += '<div class="p-procedure-card-icon"><i class="fa-solid ' + proc.icon + '"></i></div>';
      html += '<h3>' + proc.title + '</h3>';
      html += '<p>' + proc.description + '</p>';
      html += '<span class="p-procedure-card-steps"><i class="fa-solid fa-shoe-prints"></i> ' + chooseCount + ' stappen</span>';
      html += '</div>';
    });
    els.procedureGrid.innerHTML = html;

    // Click handlers
    els.procedureGrid.querySelectorAll(".p-procedure-card").forEach(function (card) {
      card.addEventListener("click", function () {
        startGame(parseInt(this.getAttribute("data-idx")));
      });
    });

    renderSidebar(null);
  }

  // --- Game Screen ---
  var currentProcIndex = -1;

  function startGame(index) {
    currentProcIndex = index;
    var proc = engine.startProcedure(index);
    if (!proc) return;

    showScreen(els.gameScreen);
    els.gameTitle.textContent = proc.title;
    els.checkBtn.style.display = "";
    els.checkBtn.disabled = true;
    els.nextBtn.style.display = "none";
    updateStepCounter();
    renderPipeline();
    renderSidebar(proc.id);

    // Scroll pipeline to start
    if (els.pipeline && els.pipeline.parentElement) {
      els.pipeline.parentElement.scrollLeft = 0;
    }
  }

  function updateStepCounter() {
    if (!engine.current) return;
    var selected = 0;
    var total = engine.getChooseStepCount();
    engine.selections.forEach(function (s, i) {
      if (engine.current.steps[i].type === "choose" && s !== null) selected++;
    });
    els.stepCounter.textContent = selected + "/" + total + " gekozen";
  }

  function renderPipeline() {
    var proc = engine.current;
    if (!proc) return;
    var html = "";

    proc.steps.forEach(function (step, si) {
      // Arrow before each step (except first)
      if (si > 0) {
        var arrowClass = "p-arrow";
        if (engine.checked) {
          arrowClass += " p-arrow-done";
        }
        html += '<div class="' + arrowClass + '">' + arrowSVG() + '</div>';
      }

      html += '<div class="p-step-col" data-step="' + si + '">';
      html += '<div class="p-step-label">' + step.label + '</div>';

      if (step.type === "given") {
        html += '<div class="p-given-card">';
        html += '<span class="p-given-icon"><i class="fa-solid fa-lock"></i></span>';
        html += escapeHtml(step.text);
        html += '</div>';
      } else {
        html += '<div class="p-step-options">';
        var shuffled = engine.getShuffledOptions(si);
        shuffled.forEach(function (opt, oi) {
          var cls = "p-option-card";
          if (engine.checked) {
            cls += " p-disabled";
            if (engine.selections[si] === oi) {
              cls += opt.correct ? " p-correct" : " p-wrong";
            } else if (opt.correct && !engine.results[si]) {
              // Reveal the correct answer when user got it wrong
              cls += " p-reveal-correct";
            }
          } else if (engine.selections[si] === oi) {
            cls += " p-selected";
          }
          html += '<div class="' + cls + '" data-step="' + si + '" data-opt="' + oi + '">';
          html += escapeHtml(opt.text);
          html += '</div>';
        });
        html += '</div>';

        // Feedback after checking
        if (engine.checked && engine.selections[si] !== null) {
          var selectedOpt = shuffled[engine.selections[si]];
          if (!selectedOpt.correct && selectedOpt.feedback) {
            html += '<div class="p-feedback-tip p-fb-wrong">';
            html += '<strong><i class="fa-solid fa-triangle-exclamation"></i> Let op:</strong> ' + escapeHtml(selectedOpt.feedback);
            html += '</div>';
          } else if (selectedOpt.correct) {
            html += '<div class="p-feedback-tip p-fb-correct">';
            html += '<i class="fa-solid fa-check"></i> Goed!';
            html += '</div>';
          }
        }
      }

      html += '</div>'; // /p-step-col
    });

    els.pipeline.innerHTML = html;

    // Option click handlers (only if not checked)
    if (!engine.checked) {
      els.pipeline.querySelectorAll(".p-option-card").forEach(function (card) {
        card.addEventListener("click", function () {
          var si = parseInt(this.getAttribute("data-step"));
          var oi = parseInt(this.getAttribute("data-opt"));
          engine.selectOption(si, oi);
          els.checkBtn.disabled = !engine.isAllSelected();
          updateStepCounter();
          renderPipeline(); // Re-render to update selection visuals
        });
      });
    }
  }

  // --- Check Answers ---
  function handleCheck() {
    var score = engine.checkAnswers();
    if (!score) return;
    renderPipeline(); // Re-render with results
    els.checkBtn.style.display = "none";
    els.nextBtn.style.display = "";
    renderSidebar(engine.current.id);
  }

  // --- Show Results ---
  function showResults() {
    showScreen(els.resultsScreen);
    var proc = engine.current;
    var best = engine.getBestScore(proc.id);
    if (!best) return;

    var pct = Math.round((best.correct / best.total) * 100);
    var perfect = best.correct === best.total;

    els.resultsEmoji.textContent = perfect ? "\ud83c\udf1f" : (pct >= 60 ? "\ud83d\udcaa" : "\ud83d\udca1");
    els.resultsTitle.textContent = perfect ? "Perfect!" : (pct >= 60 ? "Goed bezig!" : "Blijf oefenen!");
    els.resultsScore.textContent = best.correct + " van " + best.total + " stappen goed (" + pct + "%)";

    // Animate progress bar
    els.resultsFill.style.width = "0%";
    setTimeout(function () {
      els.resultsFill.style.width = pct + "%";
      els.resultsFill.style.background = perfect ? "var(--p-success)" :
        (pct >= 60 ? "var(--p-accent)" : "var(--p-error)");
    }, 50);

    // Step-by-step breakdown
    var detailHtml = "";
    proc.steps.forEach(function (step, si) {
      if (step.type !== "choose") return;
      var isCorrect = engine.results[si];
      var selectedOpt = engine.getSelectedOption(si);
      var cls = isCorrect ? "p-rs-correct" : "p-rs-wrong";
      var icon = isCorrect ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>';
      detailHtml += '<div class="p-results-step ' + cls + '">';
      detailHtml += '<span class="p-results-step-icon">' + icon + '</span>';
      detailHtml += '<span><strong>' + escapeHtml(step.label) + ':</strong> ';
      if (selectedOpt) detailHtml += escapeHtml(selectedOpt.text);
      if (!isCorrect) {
        // Find correct answer
        var shuffled = engine.getShuffledOptions(si);
        for (var j = 0; j < shuffled.length; j++) {
          if (shuffled[j].correct) {
            detailHtml += '<br><em style="color:#166534">\u2192 Correct: ' + escapeHtml(shuffled[j].text) + '</em>';
            break;
          }
        }
      }
      detailHtml += '</span></div>';
    });
    els.resultsDetail.innerHTML = detailHtml;
    renderSidebar(proc.id);
  }

  // --- Helpers ---
  function escapeHtml(str) {
    var d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  // --- Event bindings ---
  els.backBtn.addEventListener("click", function () { renderMenu(); });
  els.checkBtn.addEventListener("click", handleCheck);
  els.nextBtn.addEventListener("click", showResults);
  els.replayBtn.addEventListener("click", function () { startGame(currentProcIndex); });
  els.menuBtn.addEventListener("click", function () { renderMenu(); });

  // --- Init ---
  renderMenu();
})();
