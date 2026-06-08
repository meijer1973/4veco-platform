// Exit Ticket Checkpoint UI.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.ExitTicketUI = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function resolveTaskShellUI(rootObj) {
    if (rootObj && rootObj.TaskShellUI) return rootObj.TaskShellUI;
    if (typeof window !== 'undefined' && window.TaskShellUI) return window.TaskShellUI;
    if (typeof require === 'function') {
      try { return require('./task-shell-ui'); } catch (e) { return null; }
    }
    return null;
  }

  function readStars(storage) {
    try {
      storage = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
      if (!storage) return {};
      var raw = storage.getItem('skilltree_global_stars');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function buildSkillView(data, engine, globals) {
    globals = globals || {};
    var request = engine.getSkillMapRequest();
    var routeLabels = data.skillMap && Array.isArray(data.skillMap.routes) ? data.skillMap.routes.slice() : [];
    var view = {
      request: request,
      routeLabels: routeLabels,
      visibleSkills: []
    };
    var SkillMapEngine = globals.SkillMapEngine || (typeof window !== 'undefined' ? window.SkillMapEngine : null);
    var elements = globals.SKILL_TREE_ELEMENTS || (typeof window !== 'undefined' ? window.SKILL_TREE_ELEMENTS : null);
    var skillData = globals.SKILL_TREE_DATA || (typeof window !== 'undefined' ? window.SKILL_TREE_DATA : null);
    if (SkillMapEngine && elements && skillData) {
      try {
        var mapEngine = new SkillMapEngine({
          elements: elements,
          data: skillData,
          stars: readStars(globals.localStorage)
        });
        view.skillMapView = mapEngine.buildView(request);
        view.visibleSkills = view.skillMapView.visibleSkills || [];
      } catch (e) {
        view.warning = 'skill_map_view_unavailable';
      }
    }
    return view;
  }

  function renderRouteCards(data) {
    var routes = data.skillMap && Array.isArray(data.skillMap.routes) ? data.skillMap.routes : [];
    if (!routes.length) return '';
    return routes.map(function (route) {
      return '<a class="et-route-card" href="' + escapeHtml(route.href) + '">' +
        '<span class="et-route-surface">' + escapeHtml(route.surface) + '</span>' +
        '<strong>' + escapeHtml(route.label) + '</strong>' +
        '</a>';
    }).join('');
  }

  function renderTaskShellTask(task, index, contextIndex) {
    var TaskShellUI = resolveTaskShellUI();
    if (!TaskShellUI) {
      return '<article class="et-task et-task-shell" data-task="' + escapeHtml(task.id) + '">' +
        '<p class="et-error">Deze taakvorm kan nu niet worden getoond.</p>' +
      '</article>';
    }
    var taskMarkup = removeTaskShellFeedbackRegion(
      TaskShellUI.renderTask(displayTaskShellForExitTicket(task.taskShell), index, contextIndex),
      task.taskShell.id
    );
    return '<article class="et-task et-task-shell" data-task="' + escapeHtml(task.id) + '">' +
      taskMarkup +
      '<button type="button" class="et-task-shell-check" data-task-id="' + escapeHtml(task.id) + '">Controleer</button>' +
      '<div class="et-feedback" id="feedback-' + escapeHtml(task.id) + '" aria-live="polite" role="status" aria-label="Feedback op je antwoord" tabindex="-1"></div>' +
    '</article>';
  }

  function removeTaskShellFeedbackRegion(markup, taskId) {
    var id = escapeHtml(taskId).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return String(markup).replace(new RegExp('<div class="ts-feedback"[^>]*data-feedback-for="' + id + '"[^>]*></div>'), '');
  }

  function displayTaskShellForExitTicket(taskShell) {
    var displayTask = JSON.parse(JSON.stringify(taskShell));
    displayTask.interaction = displayTask.interaction || {};
    displayTask.interaction.showCriteriaBeforeCheck = false;
    displayTask.interaction.placeholder = safeExitTicketPlaceholder(displayTask.interaction.placeholder, 'Schrijf hier je uitwerking.');
    displayTask.interaction.finalAnswerPlaceholder = safeExitTicketPlaceholder(displayTask.interaction.finalAnswerPlaceholder, 'Vul je eindantwoord in');
    displayTask.interaction.unitNotationPlaceholder = safeExitTicketPlaceholder(displayTask.interaction.unitNotationPlaceholder, 'Vul de notatie in');
    if (Array.isArray(displayTask.interaction.fields)) {
      displayTask.interaction.fields = displayTask.interaction.fields.map(function (field) {
        var copy = JSON.parse(JSON.stringify(field));
        copy.placeholder = safeExitTicketPlaceholder(copy.placeholder, 'Vul je antwoord in');
        return copy;
      });
    }
    return displayTask;
  }

  function safeExitTicketPlaceholder(value, fallback) {
    if (typeof value !== 'string' || !value.trim()) return fallback;
    if (/[0-9]/.test(value)) return fallback;
    return value;
  }

  function renderTask(task, index, contextIndex) {
    if (task.type === 'task_shell') return renderTaskShellTask(task, index, contextIndex);
    var options = task.options.map(function (option) {
      return '<button type="button" class="et-option" data-task-id="' + escapeHtml(task.id) + '" data-answer-id="' + escapeHtml(option.id) + '">' +
        '<span class="et-option-letter">' + escapeHtml(option.id.toUpperCase()) + '</span>' +
        '<span>' + escapeHtml(option.label) + '</span>' +
        '</button>';
    }).join('');
    return '<article class="et-task" data-task="' + escapeHtml(task.id) + '">' +
      '<div class="et-task-meta">' +
        '<span>Vraag ' + (index + 1) + '</span>' +
        '<span>' + escapeHtml(task.skillLabel) + '</span>' +
      '</div>' +
      '<h2>' + escapeHtml(task.prompt) + '</h2>' +
      '<div class="et-options">' + options + '</div>' +
      '<div class="et-feedback" id="feedback-' + escapeHtml(task.id) + '" aria-live="polite"></div>' +
    '</article>';
  }

  function renderTasksSection(data, contextIndex) {
    return '<section class="et-tasks" data-task-pane-list>' + data.tasks.map(function (task, index) {
      return renderTask(task, index, contextIndex);
    }).join('') + '</section>';
  }

  function usesSourceTaskWorkspace(data, contextHtml) {
    return Boolean(
      contextHtml &&
      data &&
      data.layout &&
      data.layout.kind === 'source_task_workspace'
    );
  }

  function usesGoldenExerciseWorkbench(data) {
    return Boolean(
      data &&
      data.layout &&
      data.layout.framework === 'golden_exercise_workbench'
    );
  }

  function renderSourceTaskWorkspace(data, contextHtml, tasksHtml) {
    var layout = data.layout || {};
    return '<section class="et-source-task-workspace" data-source-task-workspace>' +
      '<aside class="et-source-pane" data-source-pane aria-label="' + escapeHtml(layout.sourcePaneTitle || 'Bronnen') + '">' +
        contextHtml +
      '</aside>' +
      '<section class="et-task-pane" data-task-pane aria-label="' + escapeHtml(layout.taskPaneTitle || 'Werkvragen') + '">' +
        '<div class="et-task-pane-head" data-sticky-question-strip>' +
          '<p class="et-eyebrow">Exit ticket</p>' +
          '<h2>' + escapeHtml(layout.taskPaneTitle || 'Werkvragen') + '</h2>' +
          '<p>' + escapeHtml(layout.taskPaneIntro || data.intro || '') + '</p>' +
        '</div>' +
        tasksHtml +
      '</section>' +
    '</section>';
  }

  function markdownParagraphs(value) {
    var lines = String(value || '').split(/\n{2,}/).map(function (part) { return part.trim(); }).filter(Boolean);
    return lines.map(function (line) {
      return '<p>' + escapeHtml(line) + '</p>';
    }).join('');
  }

  function renderGoldenSourceBlock(block) {
    if (!block || typeof block !== 'object') return '';
    var title = block.caption || block.title || block.sourceLabel || 'Bron';
    if (block.type === 'table') {
      var columns = Array.isArray(block.columns) ? block.columns : [];
      var rows = Array.isArray(block.rows) ? block.rows : [];
      return '<section class="ge-source-section" data-context-block="' + escapeHtml(block.id || '') + '">' +
        '<h3>' + escapeHtml(title.replace(':', ' -')) + '</h3>' +
        (block.bodyMarkdown ? markdownParagraphs(block.bodyMarkdown) : '') +
        '<table class="ge-source-table">' +
          '<thead><tr>' + columns.map(function (column) { return '<th>' + escapeHtml(column) + '</th>'; }).join('') + '</tr></thead>' +
          '<tbody>' + rows.map(function (row) {
            return '<tr>' + (row || []).map(function (cell) { return '<td>' + escapeHtml(cell) + '</td>'; }).join('') + '</tr>';
          }).join('') + '</tbody>' +
        '</table>' +
      '</section>';
    }
    return '<section class="ge-source-section" data-context-block="' + escapeHtml(block.id || '') + '">' +
      '<h3>' + escapeHtml(title.replace(':', ' -')) + '</h3>' +
      markdownParagraphs(block.bodyMarkdown || block.text || block.altText || '') +
    '</section>';
  }

  function renderGoldenSourceCard(data) {
    var blocks = Array.isArray(data.contextBlocks) ? data.contextBlocks : [];
    return '<aside class="ge-source-card" aria-label="Context">' +
      '<p class="ge-card-kicker">Context</p>' +
      '<h2>' + escapeHtml(data.layout && data.layout.sourcePaneTitle ? data.layout.sourcePaneTitle : 'Bekijk eerst de bron') + '</h2>' +
      blocks.map(renderGoldenSourceBlock).join('') +
    '</aside>';
  }

  function renderGoldenRouteHint(data) {
    var routes = data.skillMap && Array.isArray(data.skillMap.routes) ? data.skillMap.routes : [];
    if (!routes.length) return '';
    return '<div class="ge-route-strip" aria-label="' + escapeHtml(data.skillMap.title || 'Oefenroute') + '">' +
      routes.map(function (route) {
        return '<a class="ge-route-pill" href="' + escapeHtml(route.href) + '">' +
          '<span>' + escapeHtml(route.surface) + '</span>' +
          '<strong>' + escapeHtml(route.label) + '</strong>' +
        '</a>';
      }).join('') +
    '</div>';
  }

  function taskShellAt(data, index) {
    var task = data.tasks && data.tasks[index];
    return task && task.type === 'task_shell' ? task : null;
  }

  function renderGoldenControl(taskShell, index, contextIndex) {
    var TaskShellUI = resolveTaskShellUI();
    if (!TaskShellUI || !TaskShellUI.renderControl) {
      return '<p class="et-error">Deze taakvorm kan nu niet worden getoond.</p>';
    }
    return TaskShellUI.renderControl(displayTaskShellForExitTicket(taskShell), index, contextIndex);
  }

  function renderGoldenFeedback(taskId) {
    return '<div class="et-feedback ge-feedback" id="feedback-' + escapeHtml(taskId) + '" aria-live="polite" role="status" aria-label="Feedback op je antwoord" tabindex="-1"></div>';
  }

  function renderGoldenStep(step) {
    return '<li class="ge-step-card ' + escapeHtml(step.className || '') + '" data-task="' + escapeHtml(step.taskId || '') + '" data-task-family="' + escapeHtml(step.family || '') + '">' +
      '<header class="ge-step-head">' +
        '<span class="ge-step-number">' + escapeHtml(step.number) + '</span>' +
        '<div>' +
          '<p class="ge-step-kicker">' + escapeHtml(step.kicker || '') + '</p>' +
          '<h3>' + escapeHtml(step.title || '') + '</h3>' +
          (step.purpose ? '<p class="ge-step-purpose">' + escapeHtml(step.purpose) + '</p>' : '') +
        '</div>' +
      '</header>' +
      '<div class="ge-step-body">' + (step.body || '') + '</div>' +
      (step.feedback ? renderGoldenFeedback(step.feedback) : '') +
    '</li>';
  }

  function goldenStepTitle(taskShell, fallback) {
    return taskShell && taskShell.workbenchTitle ? taskShell.workbenchTitle : fallback;
  }

  function renderGoldenChoiceOptions(taskId, name, attrName, options, className) {
    return '<div class="' + escapeHtml(className || 'ge-choice-grid') + '">' + (options || []).map(function (option) {
      return '<label class="ge-choice-option">' +
        '<input type="radio" name="' + escapeHtml(name) + '" value="' + escapeHtml(option.id) + '" data-task-id="' + escapeHtml(taskId) + '" ' + attrName + '="' + escapeHtml(option.id) + '">' +
        '<span>' + escapeHtml(option.label) + '</span>' +
      '</label>';
    }).join('') + '</div>';
  }

  function renderGoldenPercentageClaimSetup(taskShell) {
    var interaction = taskShell.interaction || {};
    var TaskShellUI = resolveTaskShellUI();
    var formula = TaskShellUI && TaskShellUI.renderFormulaBuilderControl
      ? TaskShellUI.renderFormulaBuilderControl(taskShell.id, interaction.formula || {}, '')
      : '';
    return '<div class="ge-claim-setup" data-percentage-claim-control>' +
      '<section class="ge-claim-part">' +
        '<h4>' + escapeHtml(interaction.intervalLabel || '3a. Kies het interval') + '</h4>' +
        '<p>' + escapeHtml(interaction.intervalLegend || '') + '</p>' +
        renderGoldenChoiceOptions(taskShell.id, 'claim-interval-' + taskShell.id, 'data-claim-interval-option-id', interaction.intervalOptions, 'ge-choice-grid ge-interval-grid') +
      '</section>' +
      '<section class="ge-claim-part">' +
        '<h4>' + escapeHtml(interaction.valueSectionLabel || '3b. Haal de bronwaarden uit de tabel') + '</h4>' +
        '<div class="ge-value-grid">' +
          '<label class="ge-field"><span>' + escapeHtml(interaction.oldValueLabel || 'Oude waarde') + '</span>' +
            '<input type="text" inputmode="decimal" autocomplete="off" data-task-id="' + escapeHtml(taskShell.id) + '" data-input-role="old-value" placeholder="' + escapeHtml(interaction.oldValuePlaceholder || 'oude waarde') + '">' +
          '</label>' +
          '<label class="ge-field"><span>' + escapeHtml(interaction.newValueLabel || 'Nieuwe waarde') + '</span>' +
            '<input type="text" inputmode="decimal" autocomplete="off" data-task-id="' + escapeHtml(taskShell.id) + '" data-input-role="new-value" placeholder="' + escapeHtml(interaction.newValuePlaceholder || 'nieuwe waarde') + '">' +
          '</label>' +
        '</div>' +
      '</section>' +
      '<section class="ge-claim-part">' +
        '<h4>' + escapeHtml(interaction.formulaSectionLabel || '3c. Bouw de berekening') + '</h4>' +
        formula +
      '</section>' +
    '</div>';
  }

  function renderGoldenPercentageClaimFinal(taskShell) {
    var interaction = taskShell.interaction || {};
    return '<div class="ge-claim-final">' +
      '<section class="ge-claim-part">' +
        '<h4>' + escapeHtml(interaction.finalAnswerSectionLabel || interaction.finalAnswerLabel || 'Procentuele verandering') + '</h4>' +
        '<label class="ge-field ge-field-wide"><span>' + escapeHtml(interaction.finalAnswerLabel || 'Eindantwoord') + '</span>' +
          '<input type="text" inputmode="decimal" autocomplete="off" data-task-id="' + escapeHtml(taskShell.id) + '" data-input-role="final-answer" placeholder="' + escapeHtml(interaction.finalAnswerPlaceholder || 'Vul je percentage in') + '">' +
        '</label>' +
      '</section>' +
      '<section class="ge-claim-part">' +
        '<h4>' + escapeHtml(interaction.conclusionLabel || 'Conclusie') + '</h4>' +
        '<p>' + escapeHtml(interaction.conclusionLegend || '') + '</p>' +
        renderGoldenChoiceOptions(taskShell.id, 'claim-conclusion-' + taskShell.id, 'data-claim-conclusion-option-id', interaction.conclusionOptions, 'ge-choice-grid ge-conclusion-grid') +
      '</section>' +
    '</div>';
  }

  function renderGoldenExerciseWorkbench(data, view, contextIndex) {
    var graphTask = taskShellAt(data, 0);
    var readingTask = taskShellAt(data, 1);
    var claimTask = taskShellAt(data, 2);
    var graphShell = graphTask && graphTask.taskShell;
    var readingShell = readingTask && readingTask.taskShell;
    var claimShell = claimTask && claimTask.taskShell;
    var steps = [];
    if (graphShell) {
      steps.push({
        number: '1',
        taskId: graphTask.id,
        family: graphShell.family,
        kicker: graphShell.skillLabel,
        title: goldenStepTitle(graphShell, 'Maak een economisch P-Q-diagram'),
        purpose: graphShell.purpose,
        body: renderGoldenControl(graphShell, 0, contextIndex),
        feedback: graphTask.id,
        className: 'ge-step-graph'
      });
    }
    if (readingShell) {
      steps.push({
        number: '2',
        taskId: readingTask.id,
        family: readingShell.family,
        kicker: readingShell.skillLabel,
        title: goldenStepTitle(readingShell, 'Lees een tussenwaarde af'),
        purpose: readingShell.purpose,
        body: renderGoldenControl(readingShell, 1, contextIndex),
        feedback: readingTask.id,
        className: 'ge-step-reading'
      });
    }
    if (claimShell) {
      steps.push({
        number: '3',
        taskId: claimTask.id,
        family: claimShell.family,
        kicker: claimShell.skillLabel,
        title: 'Controleer de bronwaarden en formule',
        purpose: 'Kies het interval, haal oude en nieuwe Q uit de tabel en bouw de berekening.',
        body: renderGoldenPercentageClaimSetup(claimShell),
        className: 'ge-step-claim-setup'
      });
      steps.push({
        number: '4',
        taskId: claimTask.id,
        family: claimShell.family,
        kicker: 'Afronden',
        title: 'Geef het percentage en de conclusie',
        purpose: 'Maak de claim controleerbaar met een percentage en een conclusie.',
        body: renderGoldenPercentageClaimFinal(claimShell),
        feedback: claimTask.id,
        className: 'ge-step-claim-final'
      });
    }
    var kicker = data.layout && data.layout.kicker ? data.layout.kicker : 'Exit ticket · §' + data.parNr;
    return '<section class="ge-hero">' +
        '<div class="ge-kicker">' + escapeHtml(kicker) + '</div>' +
        '<h1>' + escapeHtml(data.title) + '</h1>' +
        '<p class="ge-intro">' + escapeHtml(data.intro || '') + '</p>' +
        renderGoldenRouteHint(data) +
      '</section>' +
      '<section class="ge-workbench">' +
        renderGoldenSourceCard(data) +
        '<section class="ge-task-card" data-ge-task-card>' +
          '<header class="ge-task-header">' +
            '<p class="ge-card-kicker">Werkbank</p>' +
            '<h2>' + escapeHtml(data.layout && data.layout.taskPaneTitle ? data.layout.taskPaneTitle : 'Werkvragen') + '</h2>' +
            '<p>' + escapeHtml(data.layout && data.layout.taskPaneIntro ? data.layout.taskPaneIntro : '') + '</p>' +
          '</header>' +
          '<ol class="ge-step-list">' + steps.map(renderGoldenStep).join('') + '</ol>' +
          '<footer class="ge-actions">' +
            '<button type="button" class="ge-primary-action" data-ge-check-all>Controleer werk</button>' +
          '</footer>' +
        '</section>' +
      '</section>';
  }

  function renderStaticHtml(data, view) {
    view = view || {};
    var TaskShellUI = resolveTaskShellUI();
    var contextHtml = '';
    var contextIndex = null;
    if (Array.isArray(data.contextBlocks) && data.contextBlocks.length && TaskShellUI) {
      contextHtml = TaskShellUI.renderContextBlocks(data.contextBlocks);
      contextIndex = TaskShellUI.buildContextIndex
        ? TaskShellUI.buildContextIndex(data.contextBlocks)
        : null;
    }
    if (usesGoldenExerciseWorkbench(data)) {
      return renderGoldenExerciseWorkbench(data, view, contextIndex);
    }
    var workspaceMode = usesSourceTaskWorkspace(data, contextHtml);
    var heroHtml = '<section class="et-hero' + (workspaceMode ? ' et-hero-compact' : '') + '">' +
      '<div>' +
        '<p class="et-eyebrow">Afronden</p>' +
        '<h1>' + escapeHtml(data.title) + '</h1>' +
        '<p>' + escapeHtml(data.intro) + '</p>' +
      '</div>' +
      '<aside class="et-route-panel" aria-label="' + escapeHtml(data.skillMap && data.skillMap.title ? data.skillMap.title : 'Oefenroute') + '">' +
        '<div class="et-route-head">' +
          '<span>' + escapeHtml(data.skillMap && data.skillMap.title ? data.skillMap.title : 'Oefenroute') + '</span>' +
          '<span>compact</span>' +
        '</div>' +
        '<div class="et-route-grid">' + renderRouteCards(data) + '</div>' +
      '</aside>' +
    '</section>';
    var tasksHtml = renderTasksSection(data, contextIndex);
    var bodyHtml = workspaceMode
      ? renderSourceTaskWorkspace(data, contextHtml, tasksHtml)
      : contextHtml + tasksHtml;
    var completionHtml = '<section class="et-completion" id="et-completion" hidden>' +
      '<h2>' + escapeHtml(data.completion && data.completion.title ? data.completion.title : 'Kies je volgende oefenstap') + '</h2>' +
      '<p>' + escapeHtml(data.completion && data.completion.text ? data.completion.text : '') + '</p>' +
      '<div class="et-route-grid">' + renderRouteCards(data) + '</div>' +
    '</section>';
    return heroHtml + bodyHtml + completionHtml;
  }

  function updateCompletion(app, engine) {
    var completion = app.querySelector('#et-completion');
    if (!completion) return;
    var progress = engine.getProgress();
    if (progress.targetEquivalentAttempt) {
      completion.hidden = progress.completionLanguageEligible !== true;
      return;
    }
    completion.hidden = progress.pending !== 0;
  }

  function bindInteractions(app, engine) {
    app.addEventListener('click', function (event) {
      var sharedTaskShellUI = resolveTaskShellUI();
      if (sharedTaskShellUI && sharedTaskShellUI.handleMultiSelectClick && sharedTaskShellUI.handleMultiSelectClick(app, event)) {
        return;
      }
      if (sharedTaskShellUI && sharedTaskShellUI.handleClozeTileClick && sharedTaskShellUI.handleClozeTileClick(app, event)) {
        return;
      }
      if (sharedTaskShellUI && sharedTaskShellUI.handleSentenceBuilderClick && sharedTaskShellUI.handleSentenceBuilderClick(app, event)) {
        return;
      }
      if (sharedTaskShellUI && sharedTaskShellUI.handleFormulaBuilderClick && sharedTaskShellUI.handleFormulaBuilderClick(app, event)) {
        return;
      }
      if (sharedTaskShellUI && sharedTaskShellUI.handleStepOrderingClick && sharedTaskShellUI.handleStepOrderingClick(app, event)) {
        return;
      }
      if (sharedTaskShellUI && sharedTaskShellUI.handleMatchingPairsClick && sharedTaskShellUI.handleMatchingPairsClick(app, event)) {
        return;
      }
      if (sharedTaskShellUI && sharedTaskShellUI.handleTwoTierChoiceClick && sharedTaskShellUI.handleTwoTierChoiceClick(app, event)) {
        return;
      }
      if (sharedTaskShellUI && sharedTaskShellUI.handleAssertionReasonClick && sharedTaskShellUI.handleAssertionReasonClick(app, event)) {
        return;
      }
      if (sharedTaskShellUI && sharedTaskShellUI.handleSourceValueSelectionClick && sharedTaskShellUI.handleSourceValueSelectionClick(app, event)) {
        return;
      }
      if (sharedTaskShellUI && sharedTaskShellUI.handleSourceChainBuilderClick && sharedTaskShellUI.handleSourceChainBuilderClick(app, event)) {
        return;
      }
      if (sharedTaskShellUI && sharedTaskShellUI.handleLabelPlacementClick && sharedTaskShellUI.handleLabelPlacementClick(app, event)) {
        return;
      }
      if (sharedTaskShellUI && sharedTaskShellUI.handleGraphConstructionClick && sharedTaskShellUI.handleGraphConstructionClick(app, event)) {
        return;
      }

      var taskShellChoice = event.target.closest ? event.target.closest('.ts-choice') : null;
      if (taskShellChoice && taskShellChoice.closest('.et-task-shell')) {
        var shellTask = taskShellChoice.closest('.ts-task');
        if (shellTask) {
          var choices = shellTask.querySelectorAll('.ts-choice');
          for (var c = 0; c < choices.length; c++) {
            choices[c].classList.remove('selected');
            choices[c].removeAttribute('aria-pressed');
          }
        }
        taskShellChoice.classList.add('selected');
        taskShellChoice.setAttribute('aria-pressed', 'true');
        return;
      }

      var goldenCheckAll = event.target.closest ? event.target.closest('[data-ge-check-all]') : null;
      if (goldenCheckAll) {
        var goldenWrapper = app.querySelector('[data-ge-task-card]') || app;
        var TaskShellUIForAll = resolveTaskShellUI();
        (engine.data.tasks || []).forEach(function (sourceTask) {
          if (!sourceTask || sourceTask.type !== 'task_shell' || !sourceTask.taskShell) return;
          var resultForTask = engine.checkTask(sourceTask.id, collectTaskShellResponse(goldenWrapper, sourceTask.taskShell));
          renderTaskShellResult(app, sourceTask.id, resultForTask, TaskShellUIForAll);
        });
        updateCompletion(app, engine);
        return;
      }

      var taskShellCheck = event.target.closest ? event.target.closest('.et-task-shell-check') : null;
      if (taskShellCheck) {
        var shellTaskId = taskShellCheck.getAttribute('data-task-id');
        var shellWrapper = app.querySelector('[data-task="' + cssEscape(shellTaskId) + '"]');
        var sourceTask = engine.data.tasks.find(function (item) { return item.id === shellTaskId; });
        var shellResult = engine.checkTask(shellTaskId, collectTaskShellResponse(shellWrapper, sourceTask.taskShell));
        renderTaskShellResult(app, shellTaskId, shellResult, resolveTaskShellUI());
        updateCompletion(app, engine);
        return;
      }

      var button = event.target.closest ? event.target.closest('.et-option') : null;
      if (!button) return;
      var taskId = button.getAttribute('data-task-id');
      var answerId = button.getAttribute('data-answer-id');
      var result = engine.checkTask(taskId, answerId);
      var task = app.querySelector('[data-task="' + taskId + '"]');
      if (task) {
        var options = task.querySelectorAll('.et-option');
        for (var i = 0; i < options.length; i++) {
          options[i].classList.remove('selected');
          options[i].removeAttribute('aria-pressed');
        }
      }
      button.classList.add('selected');
      button.setAttribute('aria-pressed', 'true');
      var feedback = app.querySelector('#feedback-' + taskId);
      if (feedback) {
        feedback.className = 'et-feedback ' + (result.matched ? 'is-match' : 'is-retry');
        feedback.innerHTML =
          '<strong>' + escapeHtml(result.feedbackTitle) + '</strong>' +
          '<p>' + escapeHtml(result.feedbackText) + '</p>' +
          '<a href="' + escapeHtml(result.practiceRoute.href) + '">' + escapeHtml(result.practiceRoute.label) + '</a>';
        feedback.setAttribute('role', 'status');
        feedback.setAttribute('tabindex', '-1');
        feedback.setAttribute('aria-label', 'Feedback op je antwoord');
        if (typeof feedback.focus === 'function') feedback.focus({ preventScroll: true });
      }
      updateCompletion(app, engine);
    });
    app.addEventListener('change', function (event) {
      var sharedTaskShellUI = resolveTaskShellUI();
      if (
        sharedTaskShellUI &&
        sharedTaskShellUI.handleGraphConstructionChange &&
        sharedTaskShellUI.handleGraphConstructionChange(app, event)
      ) {
        return;
      }
    });
  }

  function renderTaskShellResult(app, taskId, result, TaskShellUI) {
    var shellFeedback = app.querySelector('#feedback-' + taskId);
    if (shellFeedback && TaskShellUI) {
      shellFeedback.className = 'et-feedback ge-feedback ' + (result.matched ? 'is-match' : 'is-retry');
      shellFeedback.innerHTML = TaskShellUI.renderFeedback(result);
      if (typeof shellFeedback.focus === 'function') shellFeedback.focus({ preventScroll: true });
    }
  }

  function updateThemeToggle(documentObj) {
    var button = documentObj.getElementById('theme-toggle');
    if (!button) return;
    var mode = documentObj.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    button.textContent = mode === 'dark' ? 'Lichte modus' : 'Donkere modus';
    button.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
  }

  function bindThemeToggle(documentObj, rootObj) {
    var button = documentObj.getElementById('theme-toggle');
    if (!button) return;
    updateThemeToggle(documentObj);
    button.addEventListener('click', function () {
      var current = documentObj.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      documentObj.documentElement.setAttribute('data-theme', next);
      try {
        var storage = rootObj.localStorage || (typeof localStorage !== 'undefined' ? localStorage : null);
        if (storage) storage.setItem('quizMode', next);
      } catch (e) {
        // Theme persistence is a convenience; the visible toggle should still work.
      }
      updateThemeToggle(documentObj);
    });
  }

  function cssEscape(value) {
    if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(value);
    return String(value).replace(/"/g, '\\"');
  }

  function collectTaskShellResponse(wrapper, task) {
    if (!wrapper || !task) return null;
    var selected = wrapper.querySelector('.ts-choice.selected');
    if (task.family === 'choice' || task.family === 'table_value_selection') {
      return selected ? selected.getAttribute('data-choice-id') : '';
    }
    if (task.family === 'multi_select') {
      var MultiTaskShellUI = resolveTaskShellUI();
      return MultiTaskShellUI && MultiTaskShellUI.collectMultiSelectResponse
        ? MultiTaskShellUI.collectMultiSelectResponse(wrapper, task)
        : { values: [] };
    }
    if (task.family === 'point_placement') {
      return {
        x: getValue(wrapper, '[data-task-id="' + cssEscape(task.id) + '"][data-point-axis="x"]'),
        y: getValue(wrapper, '[data-task-id="' + cssEscape(task.id) + '"][data-point-axis="y"]')
      };
    }
    if (task.family === 'graph_construction_substitute') {
      var GraphTaskShellUI = resolveTaskShellUI();
      return GraphTaskShellUI && GraphTaskShellUI.collectGraphConstructionResponse
        ? GraphTaskShellUI.collectGraphConstructionResponse(wrapper, task)
        : { axes: { x: '', y: '' }, points: [], lineShape: '' };
    }
    if (task.family === 'graph_reading') {
      var GraphReadingTaskShellUI = resolveTaskShellUI();
      return GraphReadingTaskShellUI && GraphReadingTaskShellUI.collectGraphReadingResponse
        ? GraphReadingTaskShellUI.collectGraphReadingResponse(wrapper, task)
        : getValue(wrapper, '[data-task-id="' + cssEscape(task.id) + '"][data-input-role="answer"]');
    }
    if (task.family === 'calculation_work_capture') {
      var CalculationTaskShellUI = resolveTaskShellUI();
      return CalculationTaskShellUI && CalculationTaskShellUI.collectCalculationResponse
        ? CalculationTaskShellUI.collectCalculationResponse(wrapper, task)
        : {
          work: getValue(wrapper, '[data-task-id="' + cssEscape(task.id) + '"][data-input-role="work"]'),
          finalAnswer: getValue(wrapper, '[data-task-id="' + cssEscape(task.id) + '"][data-input-role="final-answer"]'),
          unitNotation: getValue(wrapper, '[data-task-id="' + cssEscape(task.id) + '"][data-input-role="unit-notation"]')
        };
    }
    if (task.family === 'structured_short_response') {
      var fields = {};
      var fieldInputs = wrapper.querySelectorAll('[data-task-id="' + cssEscape(task.id) + '"][data-input-role="structured-field"]');
      for (var i = 0; i < fieldInputs.length; i++) {
        fields[fieldInputs[i].getAttribute('data-field-id')] = fieldInputs[i].value;
      }
      return {
        fields: fields,
        choice: selected ? selected.getAttribute('data-choice-id') : ''
      };
    }
    if (task.family === 'cloze_text') {
      var ClozeTextTaskShellUI = resolveTaskShellUI();
      return ClozeTextTaskShellUI && ClozeTextTaskShellUI.collectClozeTextResponse
        ? ClozeTextTaskShellUI.collectClozeTextResponse(wrapper, task)
        : { blanks: {} };
    }
    if (task.family === 'cloze_tile_select') {
      var TaskShellUI = resolveTaskShellUI();
      return TaskShellUI && TaskShellUI.collectClozeTileResponse
        ? TaskShellUI.collectClozeTileResponse(wrapper, task)
        : { blanks: {} };
    }
    if (task.family === 'sentence_builder') {
      var SentenceTaskShellUI = resolveTaskShellUI();
      return SentenceTaskShellUI && SentenceTaskShellUI.collectSentenceBuilderResponse
        ? SentenceTaskShellUI.collectSentenceBuilderResponse(wrapper, task)
        : { tokens: [] };
    }
    if (task.family === 'formula_builder') {
      var FormulaTaskShellUI = resolveTaskShellUI();
      return FormulaTaskShellUI && FormulaTaskShellUI.collectFormulaBuilderResponse
        ? FormulaTaskShellUI.collectFormulaBuilderResponse(wrapper, task)
        : { tokens: [] };
    }
    if (task.family === 'step_ordering') {
      var StepTaskShellUI = resolveTaskShellUI();
      return StepTaskShellUI && StepTaskShellUI.collectStepOrderingResponse
        ? StepTaskShellUI.collectStepOrderingResponse(wrapper, task)
        : { order: [] };
    }
    if (task.family === 'matching_pairs') {
      var MatchingTaskShellUI = resolveTaskShellUI();
      return MatchingTaskShellUI && MatchingTaskShellUI.collectMatchingPairsResponse
        ? MatchingTaskShellUI.collectMatchingPairsResponse(wrapper, task)
        : { pairs: [] };
    }
    if (task.family === 'two_tier_choice') {
      var TwoTierTaskShellUI = resolveTaskShellUI();
      return TwoTierTaskShellUI && TwoTierTaskShellUI.collectTwoTierChoiceResponse
        ? TwoTierTaskShellUI.collectTwoTierChoiceResponse(wrapper, task)
        : { answer: '', reason: '' };
    }
    if (task.family === 'assertion_reason') {
      var AssertionTaskShellUI = resolveTaskShellUI();
      return AssertionTaskShellUI && AssertionTaskShellUI.collectAssertionReasonResponse
        ? AssertionTaskShellUI.collectAssertionReasonResponse(wrapper, task)
        : { value: '' };
    }
    if (task.family === 'source_value_selection') {
      var SourceValueTaskShellUI = resolveTaskShellUI();
      return SourceValueTaskShellUI && SourceValueTaskShellUI.collectSourceValueSelectionResponse
        ? SourceValueTaskShellUI.collectSourceValueSelectionResponse(wrapper, task)
        : { selections: [] };
    }
    if (task.family === 'source_chain_builder') {
      var SourceChainTaskShellUI = resolveTaskShellUI();
      return SourceChainTaskShellUI && SourceChainTaskShellUI.collectSourceChainBuilderResponse
        ? SourceChainTaskShellUI.collectSourceChainBuilderResponse(wrapper, task)
        : { chain: [] };
    }
    if (task.family === 'label_placement') {
      var LabelPlacementTaskShellUI = resolveTaskShellUI();
      return LabelPlacementTaskShellUI && LabelPlacementTaskShellUI.collectLabelPlacementResponse
        ? LabelPlacementTaskShellUI.collectLabelPlacementResponse(wrapper, task)
        : { placements: [] };
    }
    return getValue(wrapper, '[data-task-id="' + cssEscape(task.id) + '"][data-input-role="answer"]');
  }

  function getValue(wrapper, selector) {
    var el = wrapper.querySelector(selector);
    return el ? el.value : '';
  }

  function init(options) {
    options = options || {};
    var rootObj = options.root || (typeof window !== 'undefined' ? window : {});
    var documentObj = options.document || rootObj.document;
    if (!documentObj) return null;
    var app = documentObj.getElementById(options.appId || 'exit-ticket-app');
    if (!app) return null;
    var Engine = options.Engine || rootObj.ExitTicketEngine;
    var data = options.data || rootObj.EXIT_TICKET_DATA;
    if (!Engine || !data) {
      app.innerHTML = '<p class="et-error">Deze check kan nu niet laden.</p>';
      return null;
    }
    var engine = new Engine({
      data: data,
      SkillMapEngine: options.SkillMapEngine || rootObj.SkillMapEngine
    });
    var view = buildSkillView(data, engine, rootObj);
    if (usesGoldenExerciseWorkbench(data)) {
      app.className = 'ge-page';
    }
    app.innerHTML = renderStaticHtml(data, view);
    bindThemeToggle(documentObj, rootObj);
    bindInteractions(app, engine);
    return { engine: engine, view: view };
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function () { init(); });
  }

  return {
    init: init,
    renderStaticHtml: renderStaticHtml,
    buildSkillView: buildSkillView,
    escapeHtml: escapeHtml
  };
});
