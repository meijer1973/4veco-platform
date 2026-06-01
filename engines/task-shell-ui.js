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

  function renderControl(task) {
    switch (task.family) {
      case 'choice':
      case 'table_value_selection':
        return renderChoice(task);
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
    return '<div class="ts-feedback-card is-' + escapeHtml(state) + '" data-feedback-state="' + escapeHtml(state) + '">' +
      '<strong>' + escapeHtml(result && result.feedbackTitle ? result.feedbackTitle : 'Kijk je antwoord na') + '</strong>' +
      '<p>' + escapeHtml(result && result.feedbackText ? result.feedbackText : '') + '</p>' +
      criteria +
      (result && result.practiceRoute ? '<div class="ts-feedback-actions"><a class="ts-feedback-action" href="' + escapeHtml(result.practiceRoute.href) + '">' + escapeHtml(result.practiceRoute.label) + '</a></div>' : '') +
    '</div>';
  }

  return {
    escapeHtml: escapeHtml,
    renderTask: renderTask,
    renderStaticHtml: renderStaticHtml,
    renderFeedback: renderFeedback
  };
});
