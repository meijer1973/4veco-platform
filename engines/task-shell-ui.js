// Shared Task Shell UI - static rendering helpers for reusable task families.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.TaskShellUI = factory(root.TaskShellEngine);
  }
})(typeof self !== 'undefined' ? self : this, function (TaskShellEngine) {
  'use strict';

  if (!TaskShellEngine && typeof require === 'function') {
    try { TaskShellEngine = require('./task-shell-engine'); } catch (e) { TaskShellEngine = null; }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function familyLabel(task) {
    if (task.familyLabel) return task.familyLabel;
    if (TaskShellEngine && TaskShellEngine.FAMILIES && TaskShellEngine.FAMILIES[task.family]) {
      return TaskShellEngine.FAMILIES[task.family].label;
    }
    return task.family;
  }

  function optionButton(task, option) {
    return '<button type="button" class="ts-choice" aria-pressed="false" data-task-id="' + escapeHtml(task.id) + '" data-choice-id="' + escapeHtml(option.id) + '">' +
      '<span class="ts-choice-mark" aria-hidden="true"></span>' +
      '<span class="ts-choice-body">' +
        '<strong>' + escapeHtml(option.label) + '</strong>' +
        (option.description ? '<span>' + escapeHtml(option.description) + '</span>' : '') +
      '</span>' +
    '</button>';
  }

  function renderChoice(task) {
    return '<div class="ts-options" role="group" aria-label="' + escapeHtml(task.interaction.inputLabel || task.prompt) + '">' +
      task.interaction.options.map(function (option) { return optionButton(task, option); }).join('') +
    '</div>';
  }

  function multiOptionButton(task, option) {
    return '<button type="button" class="ts-multi-option" aria-pressed="false" data-task-id="' + escapeHtml(task.id) + '" data-multi-option-id="' + escapeHtml(option.id) + '">' +
      '<span class="ts-multi-mark" aria-hidden="true"></span>' +
      '<span class="ts-multi-body">' +
        '<strong>' + escapeHtml(option.label) + '</strong>' +
        (option.description ? '<span>' + escapeHtml(option.description) + '</span>' : '') +
      '</span>' +
    '</button>';
  }

  function renderMultiSelect(task) {
    return '<div class="ts-multi-select" role="group" aria-label="' + escapeHtml(task.interaction.inputLabel) + '">' +
      task.interaction.options.map(function (option) { return multiOptionButton(task, option); }).join('') +
    '</div>';
  }

  function renderTextInput(task, role, inputMode) {
    var label = task.interaction.inputLabel || 'Antwoord';
    return '<label class="ts-field">' +
      '<span>' + escapeHtml(label) + '</span>' +
      '<input class="ts-input" type="text" inputmode="' + escapeHtml(inputMode || 'text') + '" autocomplete="off" ' +
        'data-task-id="' + escapeHtml(task.id) + '" data-input-role="' + escapeHtml(role || 'answer') + '" ' +
        'placeholder="' + escapeHtml(task.interaction.placeholder || 'Antwoord') + '">' +
    '</label>';
  }

  function renderTextArea(task, role, label) {
    return '<label class="ts-field">' +
      '<span>' + escapeHtml(label || task.interaction.inputLabel || 'Antwoord') + '</span>' +
      '<textarea class="ts-textarea" rows="4" data-task-id="' + escapeHtml(task.id) + '" data-input-role="' + escapeHtml(role || 'answer') + '" ' +
        'placeholder="' + escapeHtml(task.interaction.placeholder || 'Schrijf je antwoord') + '"></textarea>' +
    '</label>';
  }

  function renderCriteria(task) {
    if (task.interaction && task.interaction.showCriteriaBeforeCheck === false) return '';
    var criteria = task.expected && Array.isArray(task.expected.criteria) ? task.expected.criteria : task.interaction.criteria || [];
    if (!criteria.length) return '';
    return '<ul class="ts-criteria" aria-label="Zelfcheck punten">' +
      criteria.map(function (criterion) { return '<li>' + escapeHtml(criterion) + '</li>'; }).join('') +
    '</ul>';
  }

  function renderCalculation(task) {
    var unitNotation = '';
    if (task.interaction.unitNotationLabel || (task.expected && task.expected.unitNotation)) {
      unitNotation = renderTextInput({
        id: task.id,
        interaction: {
          inputLabel: task.interaction.unitNotationLabel || 'Eenheid of notatie',
          placeholder: task.interaction.unitNotationPlaceholder || 'Bijvoorbeeld %, euro of indexcijfer'
        }
      }, 'unit-notation', 'text');
    }
    return '<div class="ts-calculation">' +
      renderTextArea(task, 'work', task.interaction.workLabel) +
      '<div class="ts-answer-grid">' +
        renderTextInput({
          id: task.id,
          interaction: {
            inputLabel: task.interaction.finalAnswerLabel,
            placeholder: task.interaction.finalAnswerPlaceholder || 'Eindantwoord'
          }
        }, 'final-answer', 'decimal') +
        unitNotation +
      '</div>' +
      renderCriteria(task) +
    '</div>';
  }

  function renderHints(task) {
    var hints = Array.isArray(task.hints) ? task.hints : [];
    if (!hints.length) return '';
    var label = hints.length === 1 ? 'Hint' : 'Hints';
    return '<details class="ts-hints">' +
      '<summary>' + escapeHtml(label) + '</summary>' +
      '<ul>' + hints.map(function (hint) { return '<li>' + escapeHtml(hint) + '</li>'; }).join('') + '</ul>' +
    '</details>';
  }

  function renderPointPlacement(task) {
    return '<div class="ts-point-grid">' +
      '<label class="ts-field"><span>' + escapeHtml(task.interaction.xLabel) + '</span>' +
        '<input class="ts-input" type="text" inputmode="decimal" autocomplete="off" data-task-id="' + escapeHtml(task.id) + '" data-point-axis="x" placeholder="x">' +
      '</label>' +
      '<label class="ts-field"><span>' + escapeHtml(task.interaction.yLabel) + '</span>' +
        '<input class="ts-input" type="text" inputmode="decimal" autocomplete="off" data-task-id="' + escapeHtml(task.id) + '" data-point-axis="y" placeholder="y">' +
      '</label>' +
    '</div>';
  }

  function renderStructuredShortResponse(task) {
    var fields = task.interaction.fields || [];
    var fieldHtml = fields.map(function (field) {
      return '<label class="ts-field">' +
        '<span>' + escapeHtml(field.label) + '</span>' +
        '<input class="ts-input" type="text" inputmode="' + escapeHtml(field.inputMode || 'text') + '" autocomplete="off" ' +
          'data-task-id="' + escapeHtml(task.id) + '" data-input-role="structured-field" ' +
          'data-field-id="' + escapeHtml(field.id) + '" placeholder="' + escapeHtml(field.placeholder || 'Antwoord') + '">' +
      '</label>';
    }).join('');
    return '<div class="ts-structured-response">' +
      fieldHtml +
      (task.interaction.options ? renderChoice(task) : '') +
      renderCriteria(task) +
    '</div>';
  }

  function blankMeta(task, blankId) {
    var blanks = task.interaction.blanks || [];
    for (var i = 0; i < blanks.length; i++) {
      if (blanks[i].id === blankId) return blanks[i];
    }
    return { id: blankId, label: blankId };
  }

  function renderClozeBlank(task, blankId) {
    var blank = blankMeta(task, blankId);
    var placeholder = blank.placeholder || 'Kies tegel';
    return '<span class="ts-cloze-slot">' +
      '<button type="button" class="ts-cloze-blank" data-task-id="' + escapeHtml(task.id) + '" ' +
        'data-cloze-blank-id="' + escapeHtml(blankId) + '" data-selected-tile="" ' +
        'data-cloze-label="' + escapeHtml(blank.label) + '" data-cloze-placeholder="' + escapeHtml(placeholder) + '" ' +
        'aria-label="' + escapeHtml(blank.label + ': nog leeg') + '">' +
        '<span class="ts-cloze-blank-text">' + escapeHtml(placeholder) + '</span>' +
      '</button>' +
      '<button type="button" class="ts-cloze-clear" data-task-id="' + escapeHtml(task.id) + '" ' +
        'data-cloze-clear-id="' + escapeHtml(blankId) + '" aria-label="' + escapeHtml(blank.label + ' leegmaken') + '" hidden>&times;</button>' +
    '</span>';
  }

  function renderClozeTileSelect(task) {
    var segments = task.interaction.segments || [];
    var tiles = task.interaction.tiles || [];
    var line = segments.map(function (segment) {
      if (segment.type === 'blank') return renderClozeBlank(task, segment.blankId);
      return '<span class="ts-cloze-text">' + escapeHtml(segment.text) + '</span>';
    }).join('');
    var tileHtml = tiles.map(function (tile) {
      return '<button type="button" class="ts-cloze-tile" data-task-id="' + escapeHtml(task.id) + '" ' +
        'data-cloze-tile-id="' + escapeHtml(tile.id) + '" aria-pressed="false">' +
        '<span class="ts-cloze-tile-label">' + escapeHtml(tile.label) + '</span>' +
        (tile.description ? '<span class="ts-cloze-tile-description">' + escapeHtml(tile.description) + '</span>' : '') +
      '</button>';
    }).join('');
    return '<div class="ts-cloze" data-cloze-task="' + escapeHtml(task.id) + '" data-allow-reuse="' + (task.interaction.allowReuse === true ? 'true' : 'false') + '">' +
      '<p class="ts-cloze-line">' + line + '</p>' +
      '<div class="ts-cloze-bank" role="group" aria-label="' + escapeHtml(task.interaction.tileBankLabel || 'Tegelbank') + '">' + tileHtml + '</div>' +
      renderCriteria(task) +
    '</div>';
  }

  function renderClozeTextBlank(task, blankId) {
    var blank = blankMeta(task, blankId);
    return '<label class="ts-cloze-text-slot">' +
      '<span class="ts-cloze-text-label">' + escapeHtml(blank.label) + '</span>' +
      '<input class="ts-input ts-cloze-text-input" type="text" inputmode="' + escapeHtml(blank.inputMode || 'text') + '" ' +
        'autocomplete="' + escapeHtml(blank.autocomplete || 'off') + '" data-task-id="' + escapeHtml(task.id) + '" ' +
        'data-cloze-text-blank-id="' + escapeHtml(blankId) + '" data-cloze-text-label="' + escapeHtml(blank.label) + '" ' +
        (blank.width ? 'data-cloze-text-width="' + escapeHtml(blank.width) + '" ' : '') +
        'placeholder="' + escapeHtml(blank.placeholder || 'Antwoord') + '" aria-label="' + escapeHtml(blank.label) + '">' +
    '</label>';
  }

  function renderClozeText(task) {
    var segments = task.interaction.segments || [];
    var line = segments.map(function (segment) {
      if (segment.type === 'blank') return renderClozeTextBlank(task, segment.blankId);
      return '<span class="ts-cloze-text-copy">' + escapeHtml(segment.text) + '</span>';
    }).join('');
    return '<div class="ts-cloze-typed" data-cloze-text-task="' + escapeHtml(task.id) + '">' +
      '<p class="ts-cloze-text-line">' + line + '</p>' +
      renderCriteria(task) +
    '</div>';
  }

  function renderSentenceBuilder(task) {
    var tokens = task.interaction.tokens || [];
    var tokenHtml = tokens.map(function (token) {
      return '<button type="button" class="ts-sentence-token" data-task-id="' + escapeHtml(task.id) + '" ' +
        'data-sentence-token-id="' + escapeHtml(token.id) + '" aria-pressed="false">' +
        '<span class="ts-sentence-token-label">' + escapeHtml(token.label) + '</span>' +
        (token.description ? '<span class="ts-sentence-token-description">' + escapeHtml(token.description) + '</span>' : '') +
      '</button>';
    }).join('');
    var placeholder = task.interaction.placeholder || 'Bouw je redenering met de tegels.';
    return '<div class="ts-sentence" data-sentence-task="' + escapeHtml(task.id) + '" data-allow-reuse="' + (task.interaction.allowReuse === true ? 'true' : 'false') + '" data-separator="' + escapeHtml(task.interaction.separator || ' ') + '">' +
      '<div class="ts-sentence-sequence" role="list" tabindex="0" data-task-id="' + escapeHtml(task.id) + '" data-sentence-sequence aria-label="' + escapeHtml(task.interaction.sequenceLabel || 'Opgebouwde zin') + '">' +
        '<span class="ts-sentence-placeholder">' + escapeHtml(placeholder) + '</span>' +
      '</div>' +
      '<div class="ts-sentence-bank" role="group" aria-label="' + escapeHtml(task.interaction.tokenBankLabel || 'Fragmentbank') + '">' + tokenHtml + '</div>' +
      '<button type="button" class="ts-sentence-clear" data-task-id="' + escapeHtml(task.id) + '" data-sentence-clear aria-label="Opgebouwde zin leegmaken">Leegmaken</button>' +
      renderCriteria(task) +
    '</div>';
  }

  function renderFormulaBuilder(task) {
    var tokens = task.interaction.tokens || [];
    var tokenHtml = tokens.map(function (token) {
      return '<button type="button" class="ts-formula-token" data-task-id="' + escapeHtml(task.id) + '" ' +
        'data-formula-token-id="' + escapeHtml(token.id) + '" data-formula-token-category="' + escapeHtml(token.category || '') + '" aria-pressed="false">' +
        '<span class="ts-formula-token-label">' + escapeHtml(token.label) + '</span>' +
        (token.description ? '<span class="ts-formula-token-description">' + escapeHtml(token.description) + '</span>' : '') +
      '</button>';
    }).join('');
    var placeholder = task.interaction.placeholder || 'Bouw de formule met de blokken.';
    return '<div class="ts-formula" data-formula-task="' + escapeHtml(task.id) + '" data-allow-reuse="' + (task.interaction.allowReuse === true ? 'true' : 'false') + '" data-separator="' + escapeHtml(task.interaction.separator || ' ') + '">' +
      '<div class="ts-formula-sequence" role="list" tabindex="0" data-task-id="' + escapeHtml(task.id) + '" data-formula-sequence aria-label="' + escapeHtml(task.interaction.sequenceLabel || 'Opgebouwde formule') + '">' +
        '<span class="ts-formula-placeholder">' + escapeHtml(placeholder) + '</span>' +
      '</div>' +
      '<div class="ts-formula-bank" role="group" aria-label="' + escapeHtml(task.interaction.tokenBankLabel || 'Formuleblokken') + '">' + tokenHtml + '</div>' +
      '<button type="button" class="ts-formula-clear" data-task-id="' + escapeHtml(task.id) + '" data-formula-clear aria-label="Opgebouwde formule leegmaken">Leegmaken</button>' +
      renderCriteria(task) +
    '</div>';
  }

  function renderStepOrdering(task) {
    var steps = task.interaction.steps || [];
    var stepHtml = steps.map(function (step) {
      return '<button type="button" class="ts-step-token" data-task-id="' + escapeHtml(task.id) + '" ' +
        'data-step-id="' + escapeHtml(step.id) + '" aria-pressed="false">' +
        '<span class="ts-step-token-label">' + escapeHtml(step.label) + '</span>' +
        (step.description ? '<span class="ts-step-token-description">' + escapeHtml(step.description) + '</span>' : '') +
      '</button>';
    }).join('');
    var placeholder = task.interaction.placeholder || 'Zet de stappen in de juiste volgorde.';
    return '<div class="ts-step-ordering" data-step-task="' + escapeHtml(task.id) + '" data-separator="' + escapeHtml(task.interaction.separator || ' -> ') + '">' +
      '<div class="ts-step-sequence" role="list" tabindex="0" data-task-id="' + escapeHtml(task.id) + '" data-step-sequence aria-label="' + escapeHtml(task.interaction.sequenceLabel || 'Gekozen volgorde') + '">' +
        '<span class="ts-step-placeholder">' + escapeHtml(placeholder) + '</span>' +
      '</div>' +
      '<div class="ts-step-bank" role="group" aria-label="' + escapeHtml(task.interaction.stepBankLabel || 'Stappen') + '">' + stepHtml + '</div>' +
      '<button type="button" class="ts-step-clear" data-task-id="' + escapeHtml(task.id) + '" data-step-clear aria-label="Gekozen volgorde leegmaken">Leegmaken</button>' +
      renderCriteria(task) +
    '</div>';
  }

  function renderControl(task) {
    switch (task.family) {
      case 'choice':
      case 'table_value_selection':
        return renderChoice(task);
      case 'multi_select':
        return renderMultiSelect(task);
      case 'numeric_input':
      case 'graph_reading':
        return renderTextInput(task, 'answer', 'decimal');
      case 'final_answer_entry':
      case 'unit_notation_field':
        return renderTextInput(task, 'answer', 'text');
      case 'calculation_work_capture':
        return renderCalculation(task);
      case 'point_placement':
        return renderPointPlacement(task);
      case 'short_constructed_response':
      case 'graph_construction_substitute':
      case 'structured_reasoning':
        return renderTextArea(task, 'answer') + renderCriteria(task);
      case 'structured_short_response':
        return renderStructuredShortResponse(task);
      case 'cloze_text':
        return renderClozeText(task);
      case 'cloze_tile_select':
        return renderClozeTileSelect(task);
      case 'sentence_builder':
        return renderSentenceBuilder(task);
      case 'formula_builder':
        return renderFormulaBuilder(task);
      case 'step_ordering':
        return renderStepOrdering(task);
      default:
        return '<p class="ts-error">Deze taakvorm kan nog niet worden getoond.</p>';
    }
  }

  function renderTask(task, index) {
    if (TaskShellEngine) TaskShellEngine.validateTask(task);
    return '<article class="ts-task" data-task="' + escapeHtml(task.id) + '" data-task-family="' + escapeHtml(task.family) + '">' +
      '<div class="ts-task-meta">' +
        '<span>Taak ' + (index + 1) + '</span>' +
        '<span>' + escapeHtml(task.skillLabel) + '</span>' +
        '<span>' + escapeHtml(familyLabel(task)) + '</span>' +
      '</div>' +
      '<h2>' + escapeHtml(task.prompt) + '</h2>' +
      (task.purpose ? '<p class="ts-purpose">' + escapeHtml(task.purpose) + '</p>' : '') +
      renderHints(task) +
      renderControl(task) +
      '<div class="ts-feedback" data-feedback-for="' + escapeHtml(task.id) + '" aria-live="polite" role="status" aria-label="Feedback op je antwoord" tabindex="-1"></div>' +
    '</article>';
  }

  function renderStaticHtml(data) {
    if (TaskShellEngine) TaskShellEngine.validateTaskSet(data);
    return '<section class="ts-shell" data-task-shell="GAME-UX-3A">' +
      '<header class="ts-shell-head">' +
        '<p class="ts-eyebrow">' + escapeHtml(data.eyebrow || 'Oefentaak') + '</p>' +
        '<h1>' + escapeHtml(data.title) + '</h1>' +
        (data.intro ? '<p>' + escapeHtml(data.intro) + '</p>' : '') +
      '</header>' +
      '<div class="ts-task-list">' + data.tasks.map(renderTask).join('') + '</div>' +
    '</section>';
  }

  function renderFeedback(result) {
    var state = result && result.state ? result.state : 'retry';
    var criteria = result && Array.isArray(result.selfCheckCriteria) && result.selfCheckCriteria.length
      ? '<ul>' + result.selfCheckCriteria.map(function (criterion) { return '<li>' + escapeHtml(criterion) + '</li>'; }).join('') + '</ul>'
      : '';
    var selection = renderSelectionFeedback(result && result.selectionFeedback);
    var order = renderOrderFeedback(result && result.orderFeedback);
    return '<div class="ts-feedback-card is-' + escapeHtml(state) + '" data-feedback-state="' + escapeHtml(state) + '">' +
      '<strong>' + escapeHtml(result && result.feedbackTitle ? result.feedbackTitle : 'Kijk je antwoord na') + '</strong>' +
      '<p>' + escapeHtml(result && result.feedbackText ? result.feedbackText : '') + '</p>' +
      selection +
      order +
      criteria +
      (result && result.practiceRoute ? '<div class="ts-feedback-actions"><a class="ts-feedback-action" href="' + escapeHtml(result.practiceRoute.href) + '">' + escapeHtml(result.practiceRoute.label) + '</a></div>' : '') +
    '</div>';
  }

  function renderSelectionList(title, items) {
    if (!Array.isArray(items) || !items.length) return '';
    return '<div class="ts-selection-feedback-group">' +
      '<strong>' + escapeHtml(title) + '</strong>' +
      '<ul>' + items.map(function (item) { return '<li>' + escapeHtml(item.label || item.id) + '</li>'; }).join('') + '</ul>' +
    '</div>';
  }

  function renderSelectionFeedback(feedback) {
    if (!feedback || feedback.mode !== 'practice_only') return '';
    return '<div class="ts-selection-feedback" aria-label="Aanwijzingen bij je keuzes">' +
      renderSelectionList('Nog nodig', feedback.missingRequired) +
      renderSelectionList('Niet nodig gekozen', feedback.selectedDistractors) +
      renderSelectionList('Al goed gekozen', feedback.correctSelected) +
    '</div>';
  }

  function renderOrderFeedback(feedback) {
    if (!feedback || feedback.mode !== 'practice_only') return '';
    var first = '';
    if (feedback.firstMisplaced) {
      first = '<div class="ts-order-feedback-first">' +
        '<strong>Eerste plek om te controleren</strong>' +
        '<p>Verwacht: ' + escapeHtml(feedback.firstMisplaced.expectedLabel || feedback.firstMisplaced.expectedId) +
        '. Gekozen: ' + escapeHtml(feedback.firstMisplaced.actualLabel || feedback.firstMisplaced.actualId || 'geen stap') + '.</p>' +
      '</div>';
    }
    return '<div class="ts-order-feedback" aria-label="Aanwijzingen bij je volgorde">' +
      first +
      renderSelectionList('Nog nodig', feedback.missingRequired) +
      renderSelectionList('Afleider gekozen', feedback.selectedDistractors) +
      renderSelectionList('Begin klopt al', feedback.correctPrefix) +
    '</div>';
  }

  function collectClozeTileResponse(rootEl, task) {
    if (!rootEl || !task) return { blanks: {} };
    var blanks = {};
    var controls = rootEl.querySelectorAll('[data-task-id="' + cssEscape(task.id) + '"][data-cloze-blank-id]');
    for (var i = 0; i < controls.length; i++) {
      blanks[controls[i].getAttribute('data-cloze-blank-id')] = controls[i].getAttribute('data-selected-tile') || '';
    }
    return { blanks: blanks };
  }

  function collectClozeTextResponse(rootEl, task) {
    if (!rootEl || !task) return { blanks: {} };
    var blanks = {};
    var controls = rootEl.querySelectorAll('[data-task-id="' + cssEscape(task.id) + '"][data-cloze-text-blank-id]');
    for (var i = 0; i < controls.length; i++) {
      blanks[controls[i].getAttribute('data-cloze-text-blank-id')] = controls[i].value || '';
    }
    return { blanks: blanks };
  }

  function collectMultiSelectResponse(rootEl, task) {
    if (!rootEl || !task) return { values: [] };
    var values = [];
    var controls = rootEl.querySelectorAll('[data-task-id="' + cssEscape(task.id) + '"][data-multi-option-id].selected');
    for (var i = 0; i < controls.length; i++) {
      values.push(controls[i].getAttribute('data-multi-option-id') || '');
    }
    return { values: values };
  }

  function handleMultiSelectClick(rootEl, event) {
    if (!rootEl || !event || !event.target || !event.target.closest) return false;
    var option = event.target.closest('.ts-multi-option');
    if (!option || !rootEl.contains(option)) return false;
    var selected = !option.classList.contains('selected');
    option.classList.toggle('selected', selected);
    option.setAttribute('aria-pressed', selected ? 'true' : 'false');
    return true;
  }

  function handleClozeTileClick(rootEl, event) {
    if (!rootEl || !event || !event.target || !event.target.closest) return false;
    var clear = event.target.closest('.ts-cloze-clear');
    var blank = event.target.closest('.ts-cloze-blank');
    var tile = event.target.closest('.ts-cloze-tile');
    var cloze = event.target.closest('.ts-cloze');
    if (!cloze || !rootEl.contains(cloze)) return false;

    if (tile) {
      if (tile.disabled) return true;
      setSelectedTile(cloze, tile);
      return true;
    }
    if (clear) {
      var blankId = clear.getAttribute('data-cloze-clear-id');
      var blankToClear = cloze.querySelector('[data-cloze-blank-id="' + cssEscape(blankId) + '"]');
      if (blankToClear) {
        setBlankValue(blankToClear, '', '');
        updateTileAvailability(cloze);
        focusElement(blankToClear);
      }
      return true;
    }
    if (blank) {
      var selected = cloze.querySelector('.ts-cloze-tile.selected');
      if (!selected) return true;
      setBlankValue(blank, selected.getAttribute('data-cloze-tile-id'), selectedText(selected));
      clearSelectedTile(cloze);
      updateTileAvailability(cloze);
      focusElement(blank);
      return true;
    }
    return false;
  }

  function collectSentenceBuilderResponse(rootEl, task) {
    if (!rootEl || !task) return { tokens: [] };
    var tokens = [];
    var controls = rootEl.querySelectorAll('[data-task-id="' + cssEscape(task.id) + '"][data-sentence-selected-token-id]');
    for (var i = 0; i < controls.length; i++) {
      tokens.push(controls[i].getAttribute('data-sentence-selected-token-id') || '');
    }
    return { tokens: tokens };
  }

  function handleSentenceBuilderClick(rootEl, event) {
    if (!rootEl || !event || !event.target || !event.target.closest) return false;
    var sentence = event.target.closest('.ts-sentence');
    if (!sentence || !rootEl.contains(sentence)) return false;

    var token = event.target.closest('.ts-sentence-token');
    var remove = event.target.closest('.ts-sentence-remove');
    var move = event.target.closest('.ts-sentence-move');
    var clear = event.target.closest('.ts-sentence-clear');
    var sequence = sentence.querySelector('[data-sentence-sequence]');

    if (token) {
      if (token.disabled || !sequence) return true;
      addSentenceToken(sentence, sequence, token);
      updateSentenceAvailability(sentence);
      return true;
    }
    if (remove) {
      var item = remove.closest('.ts-sentence-item');
      var nextFocus = item && (item.nextElementSibling || item.previousElementSibling);
      if (item && item.parentNode) item.parentNode.removeChild(item);
      updateSentencePlaceholder(sentence);
      updateSentenceAvailability(sentence);
      focusElement(nextFocus || sequence);
      return true;
    }
    if (move) {
      moveSentenceItem(sentence, move);
      return true;
    }
    if (clear) {
      clearSentence(sentence);
      updateSentenceAvailability(sentence);
      focusElement(sequence);
      return true;
    }
    return false;
  }

  function collectFormulaBuilderResponse(rootEl, task) {
    if (!rootEl || !task) return { tokens: [] };
    var tokens = [];
    var controls = rootEl.querySelectorAll('[data-task-id="' + cssEscape(task.id) + '"][data-formula-selected-token-id]');
    for (var i = 0; i < controls.length; i++) {
      tokens.push(controls[i].getAttribute('data-formula-selected-token-id') || '');
    }
    return { tokens: tokens };
  }

  function collectStepOrderingResponse(rootEl, task) {
    if (!rootEl || !task) return { order: [] };
    var order = [];
    var controls = rootEl.querySelectorAll('[data-task-id="' + cssEscape(task.id) + '"][data-step-selected-id]');
    for (var i = 0; i < controls.length; i++) {
      order.push(controls[i].getAttribute('data-step-selected-id') || '');
    }
    return { order: order };
  }

  function handleFormulaBuilderClick(rootEl, event) {
    if (!rootEl || !event || !event.target || !event.target.closest) return false;
    var formula = event.target.closest('.ts-formula');
    if (!formula || !rootEl.contains(formula)) return false;

    var token = event.target.closest('.ts-formula-token');
    var remove = event.target.closest('.ts-formula-remove');
    var move = event.target.closest('.ts-formula-move');
    var clear = event.target.closest('.ts-formula-clear');
    var sequence = formula.querySelector('[data-formula-sequence]');

    if (token) {
      if (token.disabled || !sequence) return true;
      addFormulaToken(formula, sequence, token);
      updateFormulaAvailability(formula);
      return true;
    }
    if (remove) {
      var item = remove.closest('.ts-formula-item');
      var nextFocus = item && (item.nextElementSibling || item.previousElementSibling);
      if (item && item.parentNode) item.parentNode.removeChild(item);
      updateFormulaPlaceholder(formula);
      updateFormulaAvailability(formula);
      focusElement(nextFocus || sequence);
      return true;
    }
    if (move) {
      moveFormulaItem(formula, move);
      return true;
    }
    if (clear) {
      clearFormula(formula);
      updateFormulaAvailability(formula);
      focusElement(sequence);
      return true;
    }
    return false;
  }

  function handleStepOrderingClick(rootEl, event) {
    if (!rootEl || !event || !event.target || !event.target.closest) return false;
    var ordering = event.target.closest('.ts-step-ordering');
    if (!ordering || !rootEl.contains(ordering)) return false;

    var step = event.target.closest('.ts-step-token');
    var remove = event.target.closest('.ts-step-remove');
    var move = event.target.closest('.ts-step-move');
    var clear = event.target.closest('.ts-step-clear');
    var sequence = ordering.querySelector('[data-step-sequence]');

    if (step) {
      if (step.disabled || !sequence) return true;
      addStepToken(ordering, sequence, step);
      updateStepAvailability(ordering);
      return true;
    }
    if (remove) {
      var item = remove.closest('.ts-step-item');
      var nextFocus = item && (item.nextElementSibling || item.previousElementSibling);
      if (item && item.parentNode) item.parentNode.removeChild(item);
      updateStepPlaceholder(ordering);
      updateStepAvailability(ordering);
      focusElement(nextFocus || sequence);
      return true;
    }
    if (move) {
      moveStepItem(ordering, move);
      return true;
    }
    if (clear) {
      clearSteps(ordering);
      updateStepAvailability(ordering);
      focusElement(sequence);
      return true;
    }
    return false;
  }

  function addSentenceToken(sentence, sequence, token) {
    var tokenId = token.getAttribute('data-sentence-token-id') || '';
    var label = sentenceTokenText(token);
    var item = document.createElement('span');
    item.className = 'ts-sentence-item';
    item.setAttribute('role', 'listitem');
    item.setAttribute('data-task-id', token.getAttribute('data-task-id') || '');
    item.setAttribute('data-sentence-selected-token-id', tokenId);
    item.setAttribute('tabindex', '-1');

    var labelEl = document.createElement('span');
    labelEl.className = 'ts-sentence-item-label';
    labelEl.textContent = label;

    item.appendChild(labelEl);
    item.appendChild(sentenceButton('ts-sentence-move', 'left', 'Naar links', '\u2039'));
    item.appendChild(sentenceButton('ts-sentence-move', 'right', 'Naar rechts', '\u203a'));
    item.appendChild(sentenceButton('ts-sentence-remove', '', 'Verwijder fragment ' + label, '\u00d7'));
    sequence.appendChild(item);
    updateSentencePlaceholder(sentence);
    focusElement(item);
  }

  function addFormulaToken(formula, sequence, token) {
    var tokenId = token.getAttribute('data-formula-token-id') || '';
    var label = formulaTokenText(token);
    var item = document.createElement('span');
    item.className = 'ts-formula-item';
    item.setAttribute('role', 'listitem');
    item.setAttribute('data-task-id', token.getAttribute('data-task-id') || '');
    item.setAttribute('data-formula-selected-token-id', tokenId);
    item.setAttribute('tabindex', '-1');

    var labelEl = document.createElement('span');
    labelEl.className = 'ts-formula-item-label';
    labelEl.textContent = label;

    item.appendChild(labelEl);
    item.appendChild(formulaButton('ts-formula-move', 'left', 'Naar links', '\u2039'));
    item.appendChild(formulaButton('ts-formula-move', 'right', 'Naar rechts', '\u203a'));
    item.appendChild(formulaButton('ts-formula-remove', '', 'Verwijder formuleblok ' + label, '\u00d7'));
    sequence.appendChild(item);
    updateFormulaPlaceholder(formula);
    focusElement(item);
  }

  function addStepToken(ordering, sequence, step) {
    var stepId = step.getAttribute('data-step-id') || '';
    var label = stepTokenText(step);
    var item = document.createElement('span');
    item.className = 'ts-step-item';
    item.setAttribute('role', 'listitem');
    item.setAttribute('data-task-id', step.getAttribute('data-task-id') || '');
    item.setAttribute('data-step-selected-id', stepId);
    item.setAttribute('tabindex', '-1');

    var labelEl = document.createElement('span');
    labelEl.className = 'ts-step-item-label';
    labelEl.textContent = label;

    item.appendChild(labelEl);
    item.appendChild(stepButton('ts-step-move', 'left', 'Naar links', '\u2039'));
    item.appendChild(stepButton('ts-step-move', 'right', 'Naar rechts', '\u203a'));
    item.appendChild(stepButton('ts-step-remove', '', 'Verwijder stap ' + label, '\u00d7'));
    sequence.appendChild(item);
    updateStepPlaceholder(ordering);
    focusElement(item);
  }

  function sentenceButton(className, direction, label, text) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    if (direction) button.setAttribute('data-sentence-move', direction);
    button.setAttribute('aria-label', label);
    button.textContent = text;
    return button;
  }

  function formulaButton(className, direction, label, text) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    if (direction) button.setAttribute('data-formula-move', direction);
    button.setAttribute('aria-label', label);
    button.textContent = text;
    return button;
  }

  function stepButton(className, direction, label, text) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    if (direction) button.setAttribute('data-step-move', direction);
    button.setAttribute('aria-label', label);
    button.textContent = text;
    return button;
  }

  function moveSentenceItem(sentence, button) {
    var item = button.closest('.ts-sentence-item');
    if (!item || !item.parentNode) return;
    var direction = button.getAttribute('data-sentence-move');
    if (direction === 'left') {
      var previous = item.previousElementSibling;
      if (previous && !previous.classList.contains('ts-sentence-placeholder')) {
        item.parentNode.insertBefore(item, previous);
      }
    } else if (direction === 'right') {
      var next = item.nextElementSibling;
      if (next) item.parentNode.insertBefore(next, item);
    }
    updateSentencePlaceholder(sentence);
    focusElement(item);
  }

  function moveFormulaItem(formula, button) {
    var item = button.closest('.ts-formula-item');
    if (!item || !item.parentNode) return;
    var direction = button.getAttribute('data-formula-move');
    if (direction === 'left') {
      var previous = item.previousElementSibling;
      if (previous && !previous.classList.contains('ts-formula-placeholder')) {
        item.parentNode.insertBefore(item, previous);
      }
    } else if (direction === 'right') {
      var next = item.nextElementSibling;
      if (next) item.parentNode.insertBefore(next, item);
    }
    updateFormulaPlaceholder(formula);
    focusElement(item);
  }

  function moveStepItem(ordering, button) {
    var item = button.closest('.ts-step-item');
    if (!item || !item.parentNode) return;
    var direction = button.getAttribute('data-step-move');
    if (direction === 'left') {
      var previous = item.previousElementSibling;
      if (previous && !previous.classList.contains('ts-step-placeholder')) {
        item.parentNode.insertBefore(item, previous);
      }
    } else if (direction === 'right') {
      var next = item.nextElementSibling;
      if (next) item.parentNode.insertBefore(next, item);
    }
    updateStepPlaceholder(ordering);
    focusElement(item);
  }

  function clearSentence(sentence) {
    var items = sentence.querySelectorAll('.ts-sentence-item');
    for (var i = 0; i < items.length; i++) {
      if (items[i].parentNode) items[i].parentNode.removeChild(items[i]);
    }
    updateSentencePlaceholder(sentence);
  }

  function clearFormula(formula) {
    var items = formula.querySelectorAll('.ts-formula-item');
    for (var i = 0; i < items.length; i++) {
      if (items[i].parentNode) items[i].parentNode.removeChild(items[i]);
    }
    updateFormulaPlaceholder(formula);
  }

  function clearSteps(ordering) {
    var items = ordering.querySelectorAll('.ts-step-item');
    for (var i = 0; i < items.length; i++) {
      if (items[i].parentNode) items[i].parentNode.removeChild(items[i]);
    }
    updateStepPlaceholder(ordering);
  }

  function updateSentencePlaceholder(sentence) {
    var placeholder = sentence.querySelector('.ts-sentence-placeholder');
    if (!placeholder) return;
    placeholder.hidden = sentence.querySelectorAll('.ts-sentence-item').length > 0;
  }

  function updateFormulaPlaceholder(formula) {
    var placeholder = formula.querySelector('.ts-formula-placeholder');
    if (!placeholder) return;
    placeholder.hidden = formula.querySelectorAll('.ts-formula-item').length > 0;
  }

  function updateStepPlaceholder(ordering) {
    var placeholder = ordering.querySelector('.ts-step-placeholder');
    if (!placeholder) return;
    placeholder.hidden = ordering.querySelectorAll('.ts-step-item').length > 0;
  }

  function updateSentenceAvailability(sentence) {
    var allowReuse = sentence.getAttribute('data-allow-reuse') === 'true';
    var used = {};
    var items = sentence.querySelectorAll('.ts-sentence-item');
    for (var i = 0; i < items.length; i++) {
      var tokenId = items[i].getAttribute('data-sentence-selected-token-id');
      if (tokenId) used[tokenId] = true;
    }
    var tokens = sentence.querySelectorAll('.ts-sentence-token');
    for (var j = 0; j < tokens.length; j++) {
      var id = tokens[j].getAttribute('data-sentence-token-id');
      var unavailable = !allowReuse && Boolean(used[id]);
      tokens[j].disabled = unavailable;
      tokens[j].setAttribute('aria-disabled', unavailable ? 'true' : 'false');
      tokens[j].setAttribute('aria-pressed', unavailable ? 'true' : 'false');
    }
  }

  function updateFormulaAvailability(formula) {
    var allowReuse = formula.getAttribute('data-allow-reuse') === 'true';
    var used = {};
    var items = formula.querySelectorAll('.ts-formula-item');
    for (var i = 0; i < items.length; i++) {
      var tokenId = items[i].getAttribute('data-formula-selected-token-id');
      if (tokenId) used[tokenId] = true;
    }
    var tokens = formula.querySelectorAll('.ts-formula-token');
    for (var j = 0; j < tokens.length; j++) {
      var id = tokens[j].getAttribute('data-formula-token-id');
      var unavailable = !allowReuse && Boolean(used[id]);
      tokens[j].disabled = unavailable;
      tokens[j].setAttribute('aria-disabled', unavailable ? 'true' : 'false');
      tokens[j].setAttribute('aria-pressed', unavailable ? 'true' : 'false');
    }
  }

  function updateStepAvailability(ordering) {
    var used = {};
    var items = ordering.querySelectorAll('.ts-step-item');
    for (var i = 0; i < items.length; i++) {
      var stepId = items[i].getAttribute('data-step-selected-id');
      if (stepId) used[stepId] = true;
    }
    var steps = ordering.querySelectorAll('.ts-step-token');
    for (var j = 0; j < steps.length; j++) {
      var id = steps[j].getAttribute('data-step-id');
      var unavailable = Boolean(used[id]);
      steps[j].disabled = unavailable;
      steps[j].setAttribute('aria-disabled', unavailable ? 'true' : 'false');
      steps[j].setAttribute('aria-pressed', unavailable ? 'true' : 'false');
    }
  }

  function sentenceTokenText(token) {
    var label = token.querySelector('.ts-sentence-token-label');
    return label ? label.textContent : token.textContent;
  }

  function formulaTokenText(token) {
    var label = token.querySelector('.ts-formula-token-label');
    return label ? label.textContent : token.textContent;
  }

  function stepTokenText(step) {
    var label = step.querySelector('.ts-step-token-label');
    return label ? label.textContent : step.textContent;
  }

  function setSelectedTile(cloze, tile) {
    var tiles = cloze.querySelectorAll('.ts-cloze-tile');
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].classList.remove('selected');
      tiles[i].setAttribute('aria-pressed', 'false');
    }
    tile.classList.add('selected');
    tile.setAttribute('aria-pressed', 'true');
  }

  function clearSelectedTile(cloze) {
    var selected = cloze.querySelectorAll('.ts-cloze-tile.selected');
    for (var i = 0; i < selected.length; i++) {
      selected[i].classList.remove('selected');
      selected[i].setAttribute('aria-pressed', 'false');
    }
  }

  function setBlankValue(blank, tileId, tileLabel) {
    var label = blank.getAttribute('data-cloze-label') || 'Invulling';
    var placeholder = blank.getAttribute('data-cloze-placeholder') || 'Kies tegel';
    var text = blank.querySelector('.ts-cloze-blank-text');
    blank.setAttribute('data-selected-tile', tileId || '');
    if (tileId) {
      blank.classList.add('is-filled');
      blank.setAttribute('aria-label', label + ': ' + tileLabel);
      if (text) text.textContent = tileLabel;
    } else {
      blank.classList.remove('is-filled');
      blank.setAttribute('aria-label', label + ': nog leeg');
      if (text) text.textContent = placeholder;
    }
    var clear = blank.parentNode ? blank.parentNode.querySelector('.ts-cloze-clear') : null;
    if (clear) clear.hidden = !tileId;
  }

  function selectedText(tile) {
    var label = tile.querySelector('.ts-cloze-tile-label');
    return label ? label.textContent : tile.textContent;
  }

  function updateTileAvailability(cloze) {
    var allowReuse = cloze.getAttribute('data-allow-reuse') === 'true';
    if (allowReuse) return;
    var used = {};
    var blanks = cloze.querySelectorAll('.ts-cloze-blank');
    for (var i = 0; i < blanks.length; i++) {
      var tileId = blanks[i].getAttribute('data-selected-tile');
      if (tileId) used[tileId] = true;
    }
    var tiles = cloze.querySelectorAll('.ts-cloze-tile');
    for (var j = 0; j < tiles.length; j++) {
      var id = tiles[j].getAttribute('data-cloze-tile-id');
      var unavailable = Boolean(used[id]);
      tiles[j].disabled = unavailable;
      tiles[j].setAttribute('aria-disabled', unavailable ? 'true' : 'false');
      if (unavailable) {
        tiles[j].classList.remove('selected');
        tiles[j].setAttribute('aria-pressed', 'false');
      }
    }
  }

  function focusElement(el) {
    if (el && typeof el.focus === 'function') el.focus({ preventScroll: true });
  }

  function cssEscape(value) {
    if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(value);
    return String(value).replace(/"/g, '\\"');
  }

  return {
    escapeHtml: escapeHtml,
    collectMultiSelectResponse: collectMultiSelectResponse,
    handleMultiSelectClick: handleMultiSelectClick,
    collectClozeTextResponse: collectClozeTextResponse,
    collectClozeTileResponse: collectClozeTileResponse,
    handleClozeTileClick: handleClozeTileClick,
    collectSentenceBuilderResponse: collectSentenceBuilderResponse,
    handleSentenceBuilderClick: handleSentenceBuilderClick,
    collectFormulaBuilderResponse: collectFormulaBuilderResponse,
    handleFormulaBuilderClick: handleFormulaBuilderClick,
    collectStepOrderingResponse: collectStepOrderingResponse,
    handleStepOrderingClick: handleStepOrderingClick,
    renderTask: renderTask,
    renderStaticHtml: renderStaticHtml,
    renderFeedback: renderFeedback
  };
});
