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

  function plainParagraphs(value) {
    return String(value == null ? '' : value)
      .split(/\n{2,}/)
      .map(function (part) { return part.trim(); })
      .filter(Boolean);
  }

  function renderMarkdownBody(value) {
    var paragraphs = plainParagraphs(value);
    if (!paragraphs.length) return '';
    return '<div class="ts-context-copy">' +
      paragraphs.map(function (paragraph) {
        return '<p>' + escapeHtml(paragraph).replace(/\n/g, '<br>') + '</p>';
      }).join('') +
    '</div>';
  }

  function sanitizeInlineSvg(svg) {
    var value = String(svg == null ? '' : svg);
    if (!/^\s*<svg\b/i.test(value)) return '';
    if (/<script\b/i.test(value) || /\son[a-z]+\s*=/i.test(value) || /javascript\s*:/i.test(value)) return '';
    return value.replace(/<svg\b/i, '<svg class="ts-context-svg-art" aria-hidden="true" focusable="false"');
  }

  function contextDisplayLabel(block) {
    return block.sourceLabel || block.caption || block.title || 'Context';
  }

  function buildContextIndex(contextBlocks) {
    var index = {};
    (contextBlocks || []).forEach(function (block, position) {
      index[block.id] = {
        id: block.id,
        domId: 'ts-context-block-' + (position + 1),
        label: contextDisplayLabel(block)
      };
    });
    return index;
  }

  function renderContextSummary(block) {
    var summary = block.altText || block.accessibilitySummary;
    return summary ? '<p class="ts-context-summary">' + escapeHtml(summary) + '</p>' : '';
  }

  function renderContextHeading(block, position) {
    var label = contextDisplayLabel(block);
    var title = block.caption || block.title || label;
    return '<div class="ts-context-head">' +
      '<p class="ts-context-kicker">' + escapeHtml(label) + '</p>' +
      '<h2 id="ts-context-title-' + (position + 1) + '">' + escapeHtml(title) + '</h2>' +
    '</div>';
  }

  function renderMarkdownContext(block) {
    return renderMarkdownBody(block.bodyMarkdown) + renderContextSummary(block);
  }

  function renderTableContext(block) {
    var head = '<thead><tr>' + block.columns.map(function (column) {
      return '<th scope="col">' + escapeHtml(column) + '</th>';
    }).join('') + '</tr></thead>';
    var body = '<tbody>' + block.rows.map(function (row) {
      return '<tr>' + row.map(function (cell) {
        return '<td>' + escapeHtml(cell) + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody>';
    return renderContextSummary(block) +
      '<div class="ts-context-table-wrap">' +
        '<table class="ts-context-table">' +
          '<caption class="ts-visually-hidden">' + escapeHtml(block.caption) + '</caption>' +
          head +
          body +
        '</table>' +
      '</div>';
  }

  function renderSvgFigureContext(block) {
    var svg = sanitizeInlineSvg(block.svg);
    return renderContextSummary(block) +
      '<div class="ts-context-svg" role="img" aria-label="' + escapeHtml(block.altText) + '">' +
        (svg || '<p>' + escapeHtml(block.altText) + '</p>') +
      '</div>';
  }

  function renderGraphContext(block) {
    var axisText = (block.axes && block.axes.x && block.axes.y)
      ? '<p class="ts-context-axis">x: ' + escapeHtml(block.axes.x.label) + ' | y: ' + escapeHtml(block.axes.y.label) + '</p>'
      : '';
    var series = (block.series || []).map(function (item) {
      var points = (item.points || []).map(function (point) {
        return escapeHtml(point.x) + ': ' + escapeHtml(point.y);
      }).join(', ');
      return '<li><strong>' + escapeHtml(item.label) + '</strong><span>' + points + '</span></li>';
    }).join('');
    return renderContextSummary(block) +
      '<div class="ts-context-graph" role="img" aria-label="' + escapeHtml(block.altText) + '">' +
        axisText +
        '<ul>' + series + '</ul>' +
      '</div>';
  }

  function renderFlowchartContext(block) {
    var nodeLabels = {};
    (block.nodes || []).forEach(function (node) { nodeLabels[node.id] = node.label; });
    var edges = (block.edges || []).map(function (edge) {
      var from = nodeLabels[edge.from] || edge.from;
      var to = nodeLabels[edge.to] || edge.to;
      return '<li>' +
        '<span>' + escapeHtml(from) + '</span>' +
        '<span aria-hidden="true">-></span>' +
        '<span>' + escapeHtml(to) + '</span>' +
        (edge.label ? '<em>' + escapeHtml(edge.label) + '</em>' : '') +
      '</li>';
    }).join('');
    return renderContextSummary(block) +
      '<ol class="ts-context-flow" role="img" aria-label="' + escapeHtml(block.altText) + '">' + edges + '</ol>';
  }

  function renderFormulaContext(block) {
    var variables = (block.variables || []).map(function (variable) {
      return '<li><code>' + escapeHtml(variable.symbol) + '</code><span>' + escapeHtml(variable.meaning) + '</span></li>';
    }).join('');
    return renderContextSummary(block) +
      '<div class="ts-context-formula" role="img" aria-label="' + escapeHtml(block.altText) + '">' +
        '<code>' + escapeHtml(block.expression) + '</code>' +
        '<ul>' + variables + '</ul>' +
      '</div>';
  }

  function renderContextBlockBody(block) {
    if (block.type === 'markdown' || block.type === 'info_box' || block.type === 'source_excerpt') return renderMarkdownContext(block);
    if (block.type === 'table') return renderTableContext(block);
    if (block.type === 'svg_figure') return renderSvgFigureContext(block);
    if (block.type === 'graph') return renderGraphContext(block);
    if (block.type === 'flowchart') return renderFlowchartContext(block);
    if (block.type === 'formula') return renderFormulaContext(block);
    return '';
  }

  function renderContextBlocks(contextBlocks) {
    if (!Array.isArray(contextBlocks) || !contextBlocks.length) return '';
    if (TaskShellEngine && TaskShellEngine.validateContextBlocks) TaskShellEngine.validateContextBlocks(contextBlocks);
    return '<section class="ts-context" data-task-context aria-label="Bronnen en context">' +
      '<div class="ts-context-region-head">' +
        '<p class="ts-eyebrow">Context</p>' +
        '<h2>Bekijk eerst de bron</h2>' +
      '</div>' +
      '<div class="ts-context-grid">' +
        contextBlocks.map(function (block, position) {
          return '<article class="ts-context-block ts-context-' + escapeHtml(block.type) + '" id="ts-context-block-' + (position + 1) + '" ' +
            'data-context-block="' + escapeHtml(block.id) + '" data-context-type="' + escapeHtml(block.type) + '" ' +
            'aria-labelledby="ts-context-title-' + (position + 1) + '">' +
              renderContextHeading(block, position) +
              renderContextBlockBody(block) +
            '</article>';
        }).join('') +
      '</div>' +
    '</section>';
  }

  function renderContextRefs(task, contextIndex) {
    if (!contextIndex || !Array.isArray(task.contextRefs) || !task.contextRefs.length) return '';
    var links = task.contextRefs.map(function (ref) {
      var context = contextIndex[ref];
      if (!context) return '';
      return '<a href="#' + escapeHtml(context.domId) + '" data-context-ref="' + escapeHtml(ref) + '">' + escapeHtml(context.label) + '</a>';
    }).filter(Boolean);
    if (!links.length) return '';
    return '<p class="ts-context-refs" data-context-refs-for="' + escapeHtml(task.id) + '">' +
      '<span>Gebruik:</span> ' + links.join('<span aria-hidden="true">, </span>') +
    '</p>';
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

  function twoTierOptionButton(task, tier, option) {
    var attr = tier === 'answer' ? 'data-two-tier-answer-id' : 'data-two-tier-reason-id';
    var tierClass = tier === 'answer' ? 'ts-two-tier-answer' : 'ts-two-tier-reason';
    return '<button type="button" class="ts-two-tier-option ' + tierClass + '" aria-pressed="false" data-task-id="' + escapeHtml(task.id) + '" data-two-tier-tier="' + escapeHtml(tier) + '" ' + attr + '="' + escapeHtml(option.id) + '">' +
      '<span class="ts-two-tier-mark" aria-hidden="true"></span>' +
      '<span class="ts-two-tier-body">' +
        '<strong>' + escapeHtml(option.label) + '</strong>' +
        '<span>' + escapeHtml(option.description) + '</span>' +
      '</span>' +
    '</button>';
  }

  function renderTwoTierChoice(task) {
    var answerHtml = task.interaction.answerOptions.map(function (option) {
      return twoTierOptionButton(task, 'answer', option);
    }).join('');
    var reasonHtml = task.interaction.reasonOptions.map(function (option) {
      return twoTierOptionButton(task, 'reason', option);
    }).join('');
    return '<div class="ts-two-tier-choice" data-two-tier-task="' + escapeHtml(task.id) + '">' +
      '<div class="ts-two-tier-grid">' +
        '<div class="ts-two-tier-group" role="group" aria-label="' + escapeHtml(task.interaction.answerLabel) + '">' +
          '<strong class="ts-two-tier-group-label">' + escapeHtml(task.interaction.answerLabel) + '</strong>' +
          answerHtml +
        '</div>' +
        '<div class="ts-two-tier-group" role="group" aria-label="' + escapeHtml(task.interaction.reasonLabel) + '">' +
          '<strong class="ts-two-tier-group-label">' + escapeHtml(task.interaction.reasonLabel) + '</strong>' +
          reasonHtml +
        '</div>' +
      '</div>' +
      '<div class="ts-two-tier-summary" tabindex="0" data-task-id="' + escapeHtml(task.id) + '" data-two-tier-summary aria-label="Gekozen antwoord en reden">' +
        '<span class="ts-two-tier-summary-answer">Antwoord: nog niet gekozen</span>' +
        '<span class="ts-two-tier-summary-reason">Reden: nog niet gekozen</span>' +
      '</div>' +
    '</div>';
  }

  function assertionReasonOptionButton(task, option) {
    return '<button type="button" class="ts-assertion-option" aria-pressed="false" data-task-id="' + escapeHtml(task.id) + '" data-assertion-option-id="' + escapeHtml(option.id) + '">' +
      '<span class="ts-assertion-mark" aria-hidden="true"></span>' +
      '<span class="ts-assertion-option-body">' +
        '<strong>' + escapeHtml(option.label) + '</strong>' +
        '<span>' + escapeHtml(option.description) + '</span>' +
      '</span>' +
    '</button>';
  }

  function renderAssertionReason(task) {
    var optionsHtml = task.interaction.options.map(function (option) {
      return assertionReasonOptionButton(task, option);
    }).join('');
    return '<div class="ts-assertion" data-assertion-task="' + escapeHtml(task.id) + '">' +
      '<div class="ts-assertion-panel">' +
        '<div class="ts-assertion-card">' +
          '<strong class="ts-assertion-label">' + escapeHtml(task.interaction.assertionLabel) + '</strong>' +
          '<p class="ts-assertion-text">' + escapeHtml(task.interaction.assertionText) + '</p>' +
        '</div>' +
        '<div class="ts-assertion-card">' +
          '<strong class="ts-assertion-label">' + escapeHtml(task.interaction.reasonLabel) + '</strong>' +
          '<p class="ts-assertion-text">' + escapeHtml(task.interaction.reasonText) + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="ts-assertion-options" role="group" aria-label="' + escapeHtml(task.interaction.optionLabel) + '">' +
        '<strong class="ts-assertion-group-label">' + escapeHtml(task.interaction.optionLabel) + '</strong>' +
        optionsHtml +
      '</div>' +
      '<div class="ts-assertion-summary" tabindex="0" data-task-id="' + escapeHtml(task.id) + '" data-assertion-summary aria-label="Gekozen relatie">' +
        '<span>Relatie: nog niet gekozen</span>' +
      '</div>' +
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
    if (task.interaction.selectionMode === 'interval_halving_check') {
      return renderIntervalHalvingCalculation(task);
    }
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

  function renderIntervalHalvingCalculation(task) {
    var interaction = task.interaction;
    var intervals = (interaction.intervalOptions || []).map(function (option) {
      return '<label class="ts-choice-option">' +
        '<input type="radio" name="interval-' + escapeHtml(task.id) + '" data-task-id="' + escapeHtml(task.id) + '" data-interval-option-id="' + escapeHtml(option.id) + '" value="' + escapeHtml(option.id) + '">' +
        '<span>' + escapeHtml(option.label) + '</span>' +
      '</label>';
    }).join('');
    var relations = (interaction.relationOptions || []).map(function (option) {
      return '<option value="' + escapeHtml(option.id) + '">' + escapeHtml(option.label) + '</option>';
    }).join('');
    var conclusions = (interaction.conclusionOptions || []).map(function (option) {
      return '<option value="' + escapeHtml(option.id) + '">' + escapeHtml(option.label) + '</option>';
    }).join('');
    return '<div class="ts-calculation ts-interval-halving" data-interval-halving-check>' +
      '<fieldset class="ts-choice-group">' +
        '<legend>' + escapeHtml(interaction.intervalLabel) + '</legend>' +
        intervals +
      '</fieldset>' +
      '<label class="ts-field"><span>' + escapeHtml(interaction.relationLabel) + '</span>' +
        '<select class="ts-input" data-task-id="' + escapeHtml(task.id) + '" data-relation-option-id>' +
          '<option value="">Kies...</option>' + relations +
        '</select>' +
      '</label>' +
      '<label class="ts-field"><span>' + escapeHtml(interaction.conclusionLabel || interaction.finalAnswerLabel) + '</span>' +
        '<select class="ts-input" data-task-id="' + escapeHtml(task.id) + '" data-conclusion-option-id>' +
          '<option value="">Kies...</option>' + conclusions +
        '</select>' +
      '</label>' +
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

  function renderMatchingPairs(task) {
    var leftItems = task.interaction.leftItems || [];
    var rightItems = task.interaction.rightItems || [];
    var leftHtml = leftItems.map(function (item) {
      return '<button type="button" class="ts-match-left" data-task-id="' + escapeHtml(task.id) + '" ' +
        'data-match-left-id="' + escapeHtml(item.id) + '" aria-pressed="false" aria-label="' + escapeHtml(item.label + ': ' + item.description) + '">' +
        '<span class="ts-match-left-label">' + escapeHtml(item.label) + '</span>' +
        '<span class="ts-match-left-description">' + escapeHtml(item.description) + '</span>' +
      '</button>';
    }).join('');
    var rightHtml = rightItems.map(function (item) {
      return '<button type="button" class="ts-match-right" data-task-id="' + escapeHtml(task.id) + '" ' +
        'data-match-right-id="' + escapeHtml(item.id) + '" aria-pressed="false" aria-label="' + escapeHtml(item.label + ': ' + item.description) + '">' +
        '<span class="ts-match-right-label">' + escapeHtml(item.label) + '</span>' +
        '<span class="ts-match-right-description">' + escapeHtml(item.description) + '</span>' +
        '<span class="ts-match-right-assigned"></span>' +
      '</button>';
    }).join('');
    return '<div class="ts-matching-pairs" data-matching-pairs-task="' + escapeHtml(task.id) + '">' +
      '<div class="ts-match-banks">' +
        '<div class="ts-match-bank ts-match-left-bank" role="group" aria-label="' + escapeHtml(task.interaction.leftBankLabel || 'Linker kolom') + '">' + leftHtml + '</div>' +
        '<div class="ts-match-bank ts-match-right-bank" role="group" aria-label="' + escapeHtml(task.interaction.rightBankLabel || 'Rechter kolom') + '">' + rightHtml + '</div>' +
      '</div>' +
      '<div class="ts-match-pair-summary" role="list" tabindex="0" data-task-id="' + escapeHtml(task.id) + '" data-match-pair-summary aria-label="' + escapeHtml(task.interaction.pairLabel || 'Gemaakte koppels') + '">' +
        '<span class="ts-match-placeholder">' + escapeHtml(task.interaction.placeholder || 'Kies links een item en daarna rechts de passende betekenis.') + '</span>' +
      '</div>' +
      '<button type="button" class="ts-match-clear" data-task-id="' + escapeHtml(task.id) + '" data-match-clear aria-label="Gemaakte koppels leegmaken">Leegmaken</button>' +
      renderCriteria(task) +
    '</div>';
  }

  function renderSourceValueSelection(task) {
    var values = task.interaction.values || [];
    var roles = task.interaction.roles || [];
    var roleOptions = '<option value="">Kies rol</option>' + roles.map(function (role) {
      return '<option value="' + escapeHtml(role.id) + '">' + escapeHtml(role.label) + '</option>';
    }).join('');
    var valueHtml = values.map(function (value) {
      var meta = [
        value.sourceLabel,
        value.period,
        value.unit
      ].filter(Boolean).map(function (item) {
        return '<span>' + escapeHtml(item) + '</span>';
      }).join('');
      return '<div class="ts-source-value-card" data-task-id="' + escapeHtml(task.id) + '" data-source-value-card="' + escapeHtml(value.id) + '">' +
        '<button type="button" class="ts-source-value" data-task-id="' + escapeHtml(task.id) + '" data-source-value-id="' + escapeHtml(value.id) + '" aria-pressed="false">' +
          '<span class="ts-source-value-label">' + escapeHtml(value.label) + '</span>' +
          (value.description ? '<span class="ts-source-value-description">' + escapeHtml(value.description) + '</span>' : '') +
          (meta ? '<span class="ts-source-value-meta">' + meta + '</span>' : '') +
        '</button>' +
        '<label class="ts-source-role">' +
          '<span>' + escapeHtml(task.interaction.roleLabel || 'Rol') + '</span>' +
          '<select data-task-id="' + escapeHtml(task.id) + '" data-source-role-value-id="' + escapeHtml(value.id) + '" aria-label="' + escapeHtml((task.interaction.roleLabel || 'Rol') + ' voor ' + value.label) + '">' +
            roleOptions +
          '</select>' +
        '</label>' +
      '</div>';
    }).join('');
    return '<div class="ts-source-values" data-source-value-task="' + escapeHtml(task.id) + '">' +
      '<div class="ts-source-value-bank" role="group" aria-label="' + escapeHtml(task.interaction.valueBankLabel || 'Bronwaarden') + '">' + valueHtml + '</div>' +
      renderCriteria(task) +
    '</div>';
  }

  function renderSourceChainBuilder(task) {
    var nodes = task.interaction.nodes || [];
    var nodeHtml = nodes.map(function (node) {
      return '<button type="button" class="ts-source-node" data-task-id="' + escapeHtml(task.id) + '" ' +
        'data-source-node-id="' + escapeHtml(node.id) + '" data-source-node-role="' + escapeHtml(node.nodeRole || '') + '" aria-pressed="false">' +
        '<span class="ts-source-node-label">' + escapeHtml(node.label) + '</span>' +
        '<span class="ts-source-node-role">' + escapeHtml(sourceRoleLabel(node.nodeRole)) + '</span>' +
        (node.description ? '<span class="ts-source-node-description">' + escapeHtml(node.description) + '</span>' : '') +
      '</button>';
    }).join('');
    var placeholder = task.interaction.placeholder || 'Bouw de bronketen in de juiste volgorde.';
    return '<div class="ts-source-chain" data-source-chain-task="' + escapeHtml(task.id) + '" data-separator="' + escapeHtml(task.interaction.separator || ' -> ') + '">' +
      '<div class="ts-source-chain-sequence" role="list" tabindex="0" data-task-id="' + escapeHtml(task.id) + '" data-source-chain-sequence aria-label="' + escapeHtml(task.interaction.sequenceLabel || 'Opgebouwde bronketen') + '">' +
        '<span class="ts-source-chain-placeholder">' + escapeHtml(placeholder) + '</span>' +
      '</div>' +
      '<div class="ts-source-node-bank" role="group" aria-label="' + escapeHtml(task.interaction.nodeBankLabel || 'Bronketen onderdelen') + '">' + nodeHtml + '</div>' +
      '<button type="button" class="ts-source-chain-clear" data-task-id="' + escapeHtml(task.id) + '" data-source-chain-clear aria-label="Opgebouwde bronketen leegmaken">Leegmaken</button>' +
      renderCriteria(task) +
    '</div>';
  }

  function coordinateStyle(target) {
    if (typeof target.x === 'number' && typeof target.y === 'number') {
      return ' style="left:' + Math.max(0, Math.min(100, target.x)) + '%;top:' + Math.max(0, Math.min(100, target.y)) + '%;"';
    }
    return '';
  }

  function renderLabelPlacement(task) {
    var labels = task.interaction.labels || [];
    var targets = task.interaction.targets || [];
    var visual = task.interaction.visual || {};
    var targetRegionClass = 'ts-label-target-region' + (visual.showGrid === false ? ' ts-label-target-region-clean' : '');
    var visualLineHtml = visual.showLine === false
      ? ''
      : '<div class="ts-label-visual-line ts-label-visual-line-demand" aria-hidden="true"></div>';
    var labelHtml = labels.map(function (label) {
      return '<button type="button" class="ts-label-token" data-task-id="' + escapeHtml(task.id) + '" ' +
        'data-label-id="' + escapeHtml(label.id) + '" aria-pressed="false" aria-label="' + escapeHtml(label.label + ': ' + label.description) + '">' +
        '<span class="ts-label-token-label">' + escapeHtml(label.label) + '</span>' +
        '<span class="ts-label-token-description">' + escapeHtml(label.description) + '</span>' +
      '</button>';
    }).join('');
    var targetHtml = targets.map(function (target) {
      return '<button type="button" class="ts-label-target" data-task-id="' + escapeHtml(task.id) + '" ' +
        'data-label-target-id="' + escapeHtml(target.id) + '" data-label-target-role="' + escapeHtml(target.targetRole || '') + '"' + coordinateStyle(target) + ' ' +
        'aria-label="' + escapeHtml(target.label + ': ' + target.description) + '">' +
        '<span class="ts-label-target-dot" aria-hidden="true"></span>' +
        '<span class="ts-label-target-label">' + escapeHtml(target.label) + '</span>' +
        '<span class="ts-label-target-assigned"></span>' +
      '</button>';
    }).join('');
    var visualTitle = visual.title || task.interaction.targetRegionLabel || 'Visuele plaatsing';
    var visualDescription = visual.description || 'Plaats de labels op de juiste plekken.';
    return '<div class="ts-label-placement" data-label-placement-task="' + escapeHtml(task.id) + '">' +
      '<div class="ts-label-bank" role="group" aria-label="' + escapeHtml(task.interaction.labelBankLabel || 'Labels') + '">' + labelHtml + '</div>' +
      '<div class="ts-label-visual" data-label-visual-kind="' + escapeHtml(visual.kind || 'structure') + '">' +
        '<div class="ts-label-visual-head">' +
          '<strong>' + escapeHtml(visualTitle) + '</strong>' +
          '<span>' + escapeHtml(visualDescription) + '</span>' +
        '</div>' +
        '<div class="' + targetRegionClass + '" role="group" data-task-id="' + escapeHtml(task.id) + '" data-label-target-region aria-label="' + escapeHtml(task.interaction.targetRegionLabel || visualTitle) + '">' +
          '<div class="ts-label-visual-axis ts-label-visual-axis-x" aria-hidden="true"></div>' +
          '<div class="ts-label-visual-axis ts-label-visual-axis-y" aria-hidden="true"></div>' +
          visualLineHtml +
          targetHtml +
        '</div>' +
      '</div>' +
      '<div class="ts-label-placement-summary" role="list" tabindex="0" data-task-id="' + escapeHtml(task.id) + '" data-label-placement-summary aria-label="' + escapeHtml(task.interaction.placementLabel || 'Geplaatste labels') + '">' +
        '<span class="ts-label-placeholder">' + escapeHtml(task.interaction.placeholder || 'Kies een label en daarna een plek.') + '</span>' +
      '</div>' +
      '<button type="button" class="ts-label-clear" data-task-id="' + escapeHtml(task.id) + '" data-label-clear aria-label="Geplaatste labels leegmaken">Leegmaken</button>' +
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
      case 'matching_pairs':
        return renderMatchingPairs(task);
      case 'two_tier_choice':
        return renderTwoTierChoice(task);
      case 'assertion_reason':
        return renderAssertionReason(task);
      case 'source_value_selection':
        return renderSourceValueSelection(task);
      case 'source_chain_builder':
        return renderSourceChainBuilder(task);
      case 'label_placement':
        return renderLabelPlacement(task);
      default:
        return '<p class="ts-error">Deze taakvorm kan nog niet worden getoond.</p>';
    }
  }

  function renderTask(task, index, contextIndex) {
    if (TaskShellEngine) TaskShellEngine.validateTask(task);
    return '<article class="ts-task" data-task="' + escapeHtml(task.id) + '" data-task-family="' + escapeHtml(task.family) + '">' +
      '<div class="ts-task-meta">' +
        '<span>Taak ' + (index + 1) + '</span>' +
        '<span>' + escapeHtml(task.skillLabel) + '</span>' +
        '<span>' + escapeHtml(familyLabel(task)) + '</span>' +
      '</div>' +
      '<h2>' + escapeHtml(task.prompt) + '</h2>' +
      (task.purpose ? '<p class="ts-purpose">' + escapeHtml(task.purpose) + '</p>' : '') +
      renderContextRefs(task, contextIndex) +
      renderHints(task) +
      renderControl(task) +
      '<div class="ts-feedback" data-feedback-for="' + escapeHtml(task.id) + '" aria-live="polite" role="status" aria-label="Feedback op je antwoord" tabindex="-1"></div>' +
    '</article>';
  }

  function renderStaticHtml(data) {
    if (TaskShellEngine) TaskShellEngine.validateTaskSet(data);
    var contextIndex = buildContextIndex(data.contextBlocks);
    return '<section class="ts-shell" data-task-shell="GAME-UX-3A">' +
      '<header class="ts-shell-head">' +
        '<p class="ts-eyebrow">' + escapeHtml(data.eyebrow || 'Oefentaak') + '</p>' +
        '<h1>' + escapeHtml(data.title) + '</h1>' +
        (data.intro ? '<p>' + escapeHtml(data.intro) + '</p>' : '') +
      '</header>' +
      renderContextBlocks(data.contextBlocks) +
      '<div class="ts-task-list">' + data.tasks.map(function (task, index) { return renderTask(task, index, contextIndex); }).join('') + '</div>' +
    '</section>';
  }

  function renderFeedback(result) {
    var state = result && result.state ? result.state : 'retry';
    var criteria = result && Array.isArray(result.selfCheckCriteria) && result.selfCheckCriteria.length
      ? '<ul>' + result.selfCheckCriteria.map(function (criterion) { return '<li>' + escapeHtml(criterion) + '</li>'; }).join('') + '</ul>'
      : '';
    var selection = renderSelectionFeedback(result && result.selectionFeedback);
    var order = renderOrderFeedback(result && result.orderFeedback);
    var sourceValue = renderSourceValueFeedback(result && result.sourceValueFeedback);
    var sourceChain = renderSourceChainFeedback(result && result.sourceChainFeedback);
    var labelPlacement = renderLabelPlacementFeedback(result && result.labelPlacementFeedback);
    var matchingPairs = renderMatchingPairsFeedback(result && result.matchingPairsFeedback);
    var twoTier = renderTwoTierFeedback(result && result.twoTierFeedback);
    var assertionReason = renderAssertionReasonFeedback(result && result.assertionReasonFeedback);
    return '<div class="ts-feedback-card is-' + escapeHtml(state) + '" data-feedback-state="' + escapeHtml(state) + '">' +
      '<strong>' + escapeHtml(result && result.feedbackTitle ? result.feedbackTitle : 'Kijk je antwoord na') + '</strong>' +
      '<p>' + escapeHtml(result && result.feedbackText ? result.feedbackText : '') + '</p>' +
      selection +
      order +
      matchingPairs +
      twoTier +
      assertionReason +
      sourceValue +
      sourceChain +
      labelPlacement +
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

  function renderWrongRoleList(title, items) {
    if (!Array.isArray(items) || !items.length) return '';
    return '<div class="ts-selection-feedback-group">' +
      '<strong>' + escapeHtml(title) + '</strong>' +
      '<ul>' + items.map(function (item) {
        var expected = item.expectedRole && item.expectedRole.label ? item.expectedRole.label : '';
        var actual = item.actualRole && item.actualRole.label ? item.actualRole.label : 'geen rol';
        return '<li>' + escapeHtml(item.label || item.id) + ': verwacht ' + escapeHtml(expected) + ', gekozen ' + escapeHtml(actual) + '</li>';
      }).join('') + '</ul>' +
    '</div>';
  }

  function renderSourceValueFeedback(feedback) {
    if (!feedback || feedback.mode !== 'practice_only') return '';
    return '<div class="ts-source-value-feedback" aria-label="Aanwijzingen bij je bronwaarden">' +
      renderSelectionList('Nog nodig', feedback.missingRequired) +
      renderWrongRoleList('Rol controleren', feedback.wrongRoles) +
      renderSelectionList('Niet nodig gekozen', feedback.selectedDistractors) +
      renderSelectionList('Al goed gekozen', feedback.correctSelected) +
    '</div>';
  }

  function renderSourceChainFeedback(feedback) {
    if (!feedback || feedback.mode !== 'practice_only') return '';
    var first = '';
    if (feedback.firstMisplaced) {
      first = '<div class="ts-order-feedback-first">' +
        '<strong>Eerste onderdeel om te controleren</strong>' +
        '<p>Verwacht: ' + escapeHtml(feedback.firstMisplaced.expectedLabel || feedback.firstMisplaced.expectedId) +
        '. Gekozen: ' + escapeHtml(feedback.firstMisplaced.actualLabel || feedback.firstMisplaced.actualId || 'geen onderdeel') + '.</p>' +
      '</div>';
    }
    return '<div class="ts-source-chain-feedback" aria-label="Aanwijzingen bij je bronketen">' +
      first +
      renderSelectionList('Nog nodig', feedback.missingRequired) +
      renderSelectionList('Ontbrekend type onderdeel', feedback.missingRequiredRoles) +
      renderSelectionList('Afleider gekozen', feedback.selectedDistractors) +
      renderSelectionList('Begin klopt al', feedback.correctPrefix) +
    '</div>';
  }

  function renderPlacementPairList(title, items) {
    if (!Array.isArray(items) || !items.length) return '';
    return '<div class="ts-selection-feedback-group">' +
      '<strong>' + escapeHtml(title) + '</strong>' +
      '<ul>' + items.map(function (item) {
        var label = item.label && item.label.label ? item.label.label : '';
        var target = item.target && item.target.label ? item.target.label : '';
        if (label && target) return '<li>' + escapeHtml(label + ' -> ' + target) + '</li>';
        return '<li>' + escapeHtml(item.label || item.id || '') + '</li>';
      }).join('') + '</ul>' +
    '</div>';
  }

  function renderMisplacedLabelList(title, items) {
    if (!Array.isArray(items) || !items.length) return '';
    return '<div class="ts-selection-feedback-group">' +
      '<strong>' + escapeHtml(title) + '</strong>' +
      '<ul>' + items.map(function (item) {
        var label = item.label && item.label.label ? item.label.label : '';
        var expected = item.expectedTarget && item.expectedTarget.label ? item.expectedTarget.label : '';
        var actual = item.actualTarget && item.actualTarget.label ? item.actualTarget.label : 'geen plek';
        return '<li>' + escapeHtml(label) + ': verwacht ' + escapeHtml(expected) + ', gekozen ' + escapeHtml(actual) + '</li>';
      }).join('') + '</ul>' +
    '</div>';
  }

  function renderLabelPlacementFeedback(feedback) {
    if (!feedback || feedback.mode !== 'practice_only') return '';
    return '<div class="ts-label-feedback" aria-label="Aanwijzingen bij je labels">' +
      renderSelectionList('Labels nog nodig', feedback.missingLabels) +
      renderSelectionList('Plekken nog leeg', feedback.missingTargets) +
      renderMisplacedLabelList('Label controleren', feedback.misplacedLabels) +
      renderSelectionList('Afleidend label gekozen', feedback.selectedDistractorLabels) +
      renderSelectionList('Afleidende plek gekozen', feedback.selectedDistractorTargets) +
      renderPlacementPairList('Al goed geplaatst', feedback.correctPlacements) +
    '</div>';
  }

  function renderMatchingPairList(title, items) {
    if (!Array.isArray(items) || !items.length) return '';
    return '<div class="ts-selection-feedback-group">' +
      '<strong>' + escapeHtml(title) + '</strong>' +
      '<ul>' + items.map(function (item) {
        var left = item.left && item.left.label ? item.left.label : '';
        var right = item.right && item.right.label ? item.right.label : '';
        if (left && right) return '<li>' + escapeHtml(left + ' -> ' + right) + '</li>';
        return '<li>' + escapeHtml(item.label || item.id || '') + '</li>';
      }).join('') + '</ul>' +
    '</div>';
  }

  function renderMisplacedMatchingList(title, items) {
    if (!Array.isArray(items) || !items.length) return '';
    return '<div class="ts-selection-feedback-group">' +
      '<strong>' + escapeHtml(title) + '</strong>' +
      '<ul>' + items.map(function (item) {
        var left = item.left && item.left.label ? item.left.label : '';
        var expected = item.expectedRight && item.expectedRight.label ? item.expectedRight.label : '';
        var actual = item.actualRight && item.actualRight.label ? item.actualRight.label : 'geen koppeling';
        return '<li>' + escapeHtml(left) + ': verwacht ' + escapeHtml(expected) + ', gekozen ' + escapeHtml(actual) + '</li>';
      }).join('') + '</ul>' +
    '</div>';
  }

  function renderMatchingPairsFeedback(feedback) {
    if (!feedback || feedback.mode !== 'practice_only') return '';
    return '<div class="ts-match-feedback" aria-label="Aanwijzingen bij je koppels">' +
      renderSelectionList('Linker items nog nodig', feedback.missingLeftItems) +
      renderSelectionList('Rechter items nog nodig', feedback.missingRightItems) +
      renderMisplacedMatchingList('Koppel controleren', feedback.misplacedPairs) +
      renderSelectionList('Afleider links gekozen', feedback.selectedDistractorLeftItems) +
      renderSelectionList('Afleider rechts gekozen', feedback.selectedDistractorRightItems) +
      renderMatchingPairList('Al goed gekoppeld', feedback.correctPairs) +
    '</div>';
  }

  function renderTwoTierStatus(label, selected, matches) {
    var value = selected ? (selected.label || selected.id) : 'nog niet gekozen';
    var status = selected ? (matches ? 'past' : 'kijk dit na') : 'kies nog een optie';
    return '<div class="ts-two-tier-feedback-row">' +
      '<strong>' + escapeHtml(label) + '</strong>' +
      '<span>' + escapeHtml(value) + '</span>' +
      '<em>' + escapeHtml(status) + '</em>' +
    '</div>';
  }

  function renderTwoTierFeedback(feedback) {
    if (!feedback || feedback.mode !== 'practice_only') return '';
    var combinationText = feedback.combinationMatches
      ? 'Je gekozen antwoord en reden passen bij elkaar.'
      : 'Controleer of je reden het gekozen antwoord echt ondersteunt.';
    return '<div class="ts-two-tier-feedback" aria-label="Aanwijzingen bij antwoord en reden">' +
      renderTwoTierStatus('Antwoord', feedback.selectedAnswer, feedback.answerMatches) +
      renderTwoTierStatus('Reden', feedback.selectedReason, feedback.reasonMatches) +
      '<p>' + escapeHtml(combinationText) + '</p>' +
    '</div>';
  }

  function renderAssertionReasonFeedback(feedback) {
    if (!feedback || feedback.mode !== 'practice_only') return '';
    var selected = feedback.selected ? (feedback.selected.label || feedback.selected.id) : 'nog niet gekozen';
    var expected = feedback.expected ? (feedback.expected.label || feedback.expected.id) : '';
    var status = feedback.relationMatches ? 'past' : 'kijk dit na';
    return '<div class="ts-assertion-feedback" aria-label="Aanwijzingen bij stelling en reden">' +
      '<div class="ts-assertion-feedback-row">' +
        '<strong>Gekozen relatie</strong>' +
        '<span>' + escapeHtml(selected) + '</span>' +
        '<em>' + escapeHtml(status) + '</em>' +
      '</div>' +
      '<div class="ts-assertion-feedback-row">' +
        '<strong>Verwachte relatie</strong>' +
        '<span>' + escapeHtml(expected) + '</span>' +
        '<em>vergelijk</em>' +
      '</div>' +
      '<p>Controleer of de gekozen relatie klopt bij stelling en reden.</p>' +
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

  function collectMatchingPairsResponse(rootEl, task) {
    if (!rootEl || !task) return { pairs: [] };
    var pairs = [];
    var controls = rootEl.querySelectorAll('[data-task-id="' + cssEscape(task.id) + '"][data-match-paired-left-id]');
    for (var i = 0; i < controls.length; i++) {
      pairs.push([
        controls[i].getAttribute('data-match-paired-left-id') || '',
        controls[i].getAttribute('data-match-paired-right-id') || ''
      ]);
    }
    return { pairs: pairs };
  }

  function collectTwoTierChoiceResponse(rootEl, task) {
    if (!rootEl || !task) return { answer: '', reason: '' };
    var answer = rootEl.querySelector('[data-task-id="' + cssEscape(task.id) + '"][data-two-tier-answer-id].selected');
    var reason = rootEl.querySelector('[data-task-id="' + cssEscape(task.id) + '"][data-two-tier-reason-id].selected');
    return {
      answer: answer ? answer.getAttribute('data-two-tier-answer-id') || '' : '',
      reason: reason ? reason.getAttribute('data-two-tier-reason-id') || '' : ''
    };
  }

  function collectAssertionReasonResponse(rootEl, task) {
    if (!rootEl || !task) return { value: '' };
    var selected = rootEl.querySelector('[data-task-id="' + cssEscape(task.id) + '"][data-assertion-option-id].selected');
    return {
      value: selected ? selected.getAttribute('data-assertion-option-id') || '' : ''
    };
  }

  function collectSourceValueSelectionResponse(rootEl, task) {
    if (!rootEl || !task) return { selections: [] };
    var selections = [];
    var cards = rootEl.querySelectorAll('[data-task-id="' + cssEscape(task.id) + '"][data-source-value-card]');
    for (var i = 0; i < cards.length; i++) {
      var valueId = cards[i].getAttribute('data-source-value-card') || '';
      var button = cards[i].querySelector('[data-source-value-id="' + cssEscape(valueId) + '"]');
      var select = cards[i].querySelector('[data-source-role-value-id="' + cssEscape(valueId) + '"]');
      var selected = button && button.classList.contains('selected');
      var role = select ? select.value : '';
      if (selected || role) selections.push({ valueId: valueId, role: role });
    }
    return { selections: selections };
  }

  function collectSourceChainBuilderResponse(rootEl, task) {
    if (!rootEl || !task) return { chain: [] };
    var chain = [];
    var controls = rootEl.querySelectorAll('[data-task-id="' + cssEscape(task.id) + '"][data-source-selected-node-id]');
    for (var i = 0; i < controls.length; i++) {
      chain.push(controls[i].getAttribute('data-source-selected-node-id') || '');
    }
    return { chain: chain };
  }

  function collectLabelPlacementResponse(rootEl, task) {
    if (!rootEl || !task) return { placements: [] };
    var placements = [];
    var controls = rootEl.querySelectorAll('[data-task-id="' + cssEscape(task.id) + '"][data-label-placed-label-id]');
    for (var i = 0; i < controls.length; i++) {
      placements.push({
        labelId: controls[i].getAttribute('data-label-placed-label-id') || '',
        targetId: controls[i].getAttribute('data-label-placed-target-id') || ''
      });
    }
    return { placements: placements };
  }

  function handleSourceValueSelectionClick(rootEl, event) {
    if (!rootEl || !event || !event.target || !event.target.closest) return false;
    var sourceValues = event.target.closest('.ts-source-values');
    if (!sourceValues || !rootEl.contains(sourceValues)) return false;
    var value = event.target.closest('.ts-source-value');
    if (!value) return false;
    var selected = !value.classList.contains('selected');
    value.classList.toggle('selected', selected);
    value.setAttribute('aria-pressed', selected ? 'true' : 'false');
    var card = value.closest('.ts-source-value-card');
    if (card) card.classList.toggle('is-selected', selected);
    return true;
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

  function handleSourceChainBuilderClick(rootEl, event) {
    if (!rootEl || !event || !event.target || !event.target.closest) return false;
    var chain = event.target.closest('.ts-source-chain');
    if (!chain || !rootEl.contains(chain)) return false;

    var node = event.target.closest('.ts-source-node');
    var remove = event.target.closest('.ts-source-chain-remove');
    var move = event.target.closest('.ts-source-chain-move');
    var clear = event.target.closest('.ts-source-chain-clear');
    var sequence = chain.querySelector('[data-source-chain-sequence]');

    if (node) {
      if (node.disabled || !sequence) return true;
      addSourceNode(chain, sequence, node);
      updateSourceNodeAvailability(chain);
      return true;
    }
    if (remove) {
      var item = remove.closest('.ts-source-chain-item');
      var nextFocus = item && (item.nextElementSibling || item.previousElementSibling);
      if (item && item.parentNode) item.parentNode.removeChild(item);
      updateSourceChainPlaceholder(chain);
      updateSourceNodeAvailability(chain);
      focusElement(nextFocus || sequence);
      return true;
    }
    if (move) {
      moveSourceNode(chain, move);
      return true;
    }
    if (clear) {
      clearSourceChain(chain);
      updateSourceNodeAvailability(chain);
      focusElement(sequence);
      return true;
    }
    return false;
  }

  function handleLabelPlacementClick(rootEl, event) {
    if (!rootEl || !event || !event.target || !event.target.closest) return false;
    var placement = event.target.closest('.ts-label-placement');
    if (!placement || !rootEl.contains(placement)) return false;

    var label = event.target.closest('.ts-label-token');
    var target = event.target.closest('.ts-label-target');
    var remove = event.target.closest('.ts-label-remove');
    var clear = event.target.closest('.ts-label-clear');
    var summary = placement.querySelector('[data-label-placement-summary]');

    if (label) {
      if (label.disabled) return true;
      setSelectedLabel(placement, label);
      return true;
    }
    if (target) {
      var selected = placement.querySelector('.ts-label-token.selected');
      if (!selected || !summary) return true;
      addLabelPlacement(placement, summary, selected, target);
      clearSelectedLabels(placement);
      updateLabelPlacementState(placement);
      return true;
    }
    if (remove) {
      var item = remove.closest('.ts-label-placement-item');
      var nextFocus = item && (item.nextElementSibling || item.previousElementSibling);
      if (item && item.parentNode) item.parentNode.removeChild(item);
      updateLabelPlacementState(placement);
      focusElement(nextFocus || summary);
      return true;
    }
    if (clear) {
      clearLabelPlacements(placement);
      updateLabelPlacementState(placement);
      focusElement(summary);
      return true;
    }
    return false;
  }

  function handleMatchingPairsClick(rootEl, event) {
    if (!rootEl || !event || !event.target || !event.target.closest) return false;
    var matching = event.target.closest('.ts-matching-pairs');
    if (!matching || !rootEl.contains(matching)) return false;

    var left = event.target.closest('.ts-match-left');
    var right = event.target.closest('.ts-match-right');
    var remove = event.target.closest('.ts-match-remove');
    var clear = event.target.closest('.ts-match-clear');
    var summary = matching.querySelector('[data-match-pair-summary]');

    if (left) {
      if (left.disabled) return true;
      setSelectedMatchLeft(matching, left);
      return true;
    }
    if (right) {
      var selectedLeft = matching.querySelector('.ts-match-left.selected');
      if (!selectedLeft || !summary) return true;
      addMatchingPair(matching, summary, selectedLeft, right);
      clearSelectedMatchLeft(matching);
      updateMatchingPairsState(matching);
      return true;
    }
    if (remove) {
      var item = remove.closest('.ts-match-pair-item');
      var nextFocus = item && (item.nextElementSibling || item.previousElementSibling);
      if (item && item.parentNode) item.parentNode.removeChild(item);
      updateMatchingPairsState(matching);
      focusElement(nextFocus || summary);
      return true;
    }
    if (clear) {
      clearMatchingPairs(matching);
      updateMatchingPairsState(matching);
      focusElement(summary);
      return true;
    }
    return false;
  }

  function handleTwoTierChoiceClick(rootEl, event) {
    if (!rootEl || !event || !event.target || !event.target.closest) return false;
    var twoTier = event.target.closest('.ts-two-tier-choice');
    if (!twoTier || !rootEl.contains(twoTier)) return false;

    var option = event.target.closest('.ts-two-tier-option');
    if (!option || !twoTier.contains(option)) return false;
    setSelectedTwoTierOption(twoTier, option);
    updateTwoTierSummary(twoTier);
    return true;
  }

  function handleAssertionReasonClick(rootEl, event) {
    if (!rootEl || !event || !event.target || !event.target.closest) return false;
    var assertion = event.target.closest('.ts-assertion');
    if (!assertion || !rootEl.contains(assertion)) return false;

    var option = event.target.closest('.ts-assertion-option');
    if (!option || !assertion.contains(option)) return false;
    setSelectedAssertionOption(assertion, option);
    updateAssertionSummary(assertion);
    return true;
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

  function addSourceNode(chain, sequence, node) {
    var nodeId = node.getAttribute('data-source-node-id') || '';
    var role = node.getAttribute('data-source-node-role') || '';
    var label = sourceNodeText(node);
    var item = document.createElement('span');
    item.className = 'ts-source-chain-item';
    item.setAttribute('role', 'listitem');
    item.setAttribute('data-task-id', node.getAttribute('data-task-id') || '');
    item.setAttribute('data-source-selected-node-id', nodeId);
    item.setAttribute('data-source-selected-node-role', role);
    item.setAttribute('tabindex', '-1');

    var labelEl = document.createElement('span');
    labelEl.className = 'ts-source-chain-item-label';
    labelEl.textContent = label;

    item.appendChild(labelEl);
    item.appendChild(sourceChainButton('ts-source-chain-move', 'left', 'Naar links', '\u2039'));
    item.appendChild(sourceChainButton('ts-source-chain-move', 'right', 'Naar rechts', '\u203a'));
    item.appendChild(sourceChainButton('ts-source-chain-remove', '', 'Verwijder onderdeel ' + label, '\u00d7'));
    sequence.appendChild(item);
    updateSourceChainPlaceholder(chain);
    focusElement(item);
  }

  function addMatchingPair(matching, summary, left, right) {
    var leftId = left.getAttribute('data-match-left-id') || '';
    var rightId = right.getAttribute('data-match-right-id') || '';
    removeExistingMatchingPair(summary, 'data-match-paired-left-id', leftId);
    removeExistingMatchingPair(summary, 'data-match-paired-right-id', rightId);

    var leftText = matchLeftText(left);
    var rightText = matchRightText(right);
    var item = document.createElement('span');
    item.className = 'ts-match-pair-item';
    item.setAttribute('role', 'listitem');
    item.setAttribute('data-task-id', left.getAttribute('data-task-id') || '');
    item.setAttribute('data-match-paired-left-id', leftId);
    item.setAttribute('data-match-paired-right-id', rightId);
    item.setAttribute('tabindex', '-1');

    var leftEl = document.createElement('span');
    leftEl.className = 'ts-match-pair-left';
    leftEl.textContent = leftText;

    var arrowEl = document.createElement('span');
    arrowEl.className = 'ts-match-pair-arrow';
    arrowEl.setAttribute('aria-hidden', 'true');
    arrowEl.textContent = '->';

    var rightEl = document.createElement('span');
    rightEl.className = 'ts-match-pair-right';
    rightEl.textContent = rightText;

    item.appendChild(leftEl);
    item.appendChild(arrowEl);
    item.appendChild(rightEl);
    item.appendChild(matchButton('ts-match-remove', 'Verwijder koppel ' + leftText, '\u00d7'));
    summary.appendChild(item);
    focusElement(item);
  }

  function removeExistingMatchingPair(summary, attr, value) {
    if (!summary || !value) return;
    var existing = summary.querySelector('[' + attr + '="' + cssEscape(value) + '"]');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
  }

  function matchButton(className, label, text) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.setAttribute('aria-label', label);
    button.textContent = text;
    return button;
  }

  function addLabelPlacement(placement, summary, label, target) {
    var labelId = label.getAttribute('data-label-id') || '';
    var targetId = target.getAttribute('data-label-target-id') || '';
    removeExistingLabelPlacement(summary, 'data-label-placed-label-id', labelId);
    removeExistingLabelPlacement(summary, 'data-label-placed-target-id', targetId);

    var labelText = labelTokenText(label);
    var targetText = labelTargetText(target);
    var item = document.createElement('span');
    item.className = 'ts-label-placement-item';
    item.setAttribute('role', 'listitem');
    item.setAttribute('data-task-id', label.getAttribute('data-task-id') || '');
    item.setAttribute('data-label-placed-label-id', labelId);
    item.setAttribute('data-label-placed-target-id', targetId);
    item.setAttribute('tabindex', '-1');

    var labelEl = document.createElement('span');
    labelEl.className = 'ts-label-placement-label';
    labelEl.textContent = labelText;

    var arrowEl = document.createElement('span');
    arrowEl.className = 'ts-label-placement-arrow';
    arrowEl.setAttribute('aria-hidden', 'true');
    arrowEl.textContent = '->';

    var targetEl = document.createElement('span');
    targetEl.className = 'ts-label-placement-target';
    targetEl.textContent = targetText;

    item.appendChild(labelEl);
    item.appendChild(arrowEl);
    item.appendChild(targetEl);
    item.appendChild(labelButton('ts-label-remove', 'Verwijder label ' + labelText, '\u00d7'));
    summary.appendChild(item);
    focusElement(item);
  }

  function removeExistingLabelPlacement(summary, attr, value) {
    if (!summary || !value) return;
    var existing = summary.querySelector('[' + attr + '="' + cssEscape(value) + '"]');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
  }

  function labelButton(className, label, text) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.setAttribute('aria-label', label);
    button.textContent = text;
    return button;
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

  function sourceChainButton(className, direction, label, text) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    if (direction) button.setAttribute('data-source-chain-move', direction);
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

  function moveSourceNode(chain, button) {
    var item = button.closest('.ts-source-chain-item');
    if (!item || !item.parentNode) return;
    var direction = button.getAttribute('data-source-chain-move');
    if (direction === 'left') {
      var previous = item.previousElementSibling;
      if (previous && !previous.classList.contains('ts-source-chain-placeholder')) {
        item.parentNode.insertBefore(item, previous);
      }
    } else if (direction === 'right') {
      var next = item.nextElementSibling;
      if (next) item.parentNode.insertBefore(next, item);
    }
    updateSourceChainPlaceholder(chain);
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

  function clearSourceChain(chain) {
    var items = chain.querySelectorAll('.ts-source-chain-item');
    for (var i = 0; i < items.length; i++) {
      if (items[i].parentNode) items[i].parentNode.removeChild(items[i]);
    }
    updateSourceChainPlaceholder(chain);
  }

  function clearLabelPlacements(placement) {
    var items = placement.querySelectorAll('.ts-label-placement-item');
    for (var i = 0; i < items.length; i++) {
      if (items[i].parentNode) items[i].parentNode.removeChild(items[i]);
    }
  }

  function clearMatchingPairs(matching) {
    var items = matching.querySelectorAll('.ts-match-pair-item');
    for (var i = 0; i < items.length; i++) {
      if (items[i].parentNode) items[i].parentNode.removeChild(items[i]);
    }
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

  function updateSourceChainPlaceholder(chain) {
    var placeholder = chain.querySelector('.ts-source-chain-placeholder');
    if (!placeholder) return;
    placeholder.hidden = chain.querySelectorAll('.ts-source-chain-item').length > 0;
  }

  function updateLabelPlacementState(placement) {
    var usedLabels = {};
    var usedTargets = {};
    var labelTextByTarget = {};
    var labelIdByTarget = {};
    var items = placement.querySelectorAll('.ts-label-placement-item');
    for (var i = 0; i < items.length; i++) {
      var labelId = items[i].getAttribute('data-label-placed-label-id') || '';
      var targetId = items[i].getAttribute('data-label-placed-target-id') || '';
      if (labelId) usedLabels[labelId] = true;
      if (targetId) {
        usedTargets[targetId] = true;
        labelIdByTarget[targetId] = labelId;
        var labelEl = items[i].querySelector('.ts-label-placement-label');
        labelTextByTarget[targetId] = labelEl ? labelEl.textContent : labelId;
      }
    }

    var labels = placement.querySelectorAll('.ts-label-token');
    for (var j = 0; j < labels.length; j++) {
      var id = labels[j].getAttribute('data-label-id');
      var unavailable = Boolean(usedLabels[id]);
      labels[j].disabled = unavailable;
      labels[j].setAttribute('aria-disabled', unavailable ? 'true' : 'false');
      if (unavailable) {
        labels[j].classList.remove('selected');
        labels[j].setAttribute('aria-pressed', 'true');
      } else if (!labels[j].classList.contains('selected')) {
        labels[j].setAttribute('aria-pressed', 'false');
      }
    }

    var targets = placement.querySelectorAll('.ts-label-target');
    for (var k = 0; k < targets.length; k++) {
      var targetId = targets[k].getAttribute('data-label-target-id');
      var assigned = Boolean(usedTargets[targetId]);
      targets[k].classList.toggle('is-filled', assigned);
      targets[k].setAttribute('data-label-assigned-label-id', assigned ? labelIdByTarget[targetId] : '');
      var assignedEl = targets[k].querySelector('.ts-label-target-assigned');
      if (assignedEl) assignedEl.textContent = assigned ? labelTextByTarget[targetId] : '';
    }

    var placeholder = placement.querySelector('.ts-label-placeholder');
    if (placeholder) placeholder.hidden = items.length > 0;
  }

  function updateMatchingPairsState(matching) {
    var usedLeft = {};
    var usedRight = {};
    var leftTextByRight = {};
    var leftIdByRight = {};
    var items = matching.querySelectorAll('.ts-match-pair-item');
    for (var i = 0; i < items.length; i++) {
      var leftId = items[i].getAttribute('data-match-paired-left-id') || '';
      var rightId = items[i].getAttribute('data-match-paired-right-id') || '';
      if (leftId) usedLeft[leftId] = true;
      if (rightId) {
        usedRight[rightId] = true;
        leftIdByRight[rightId] = leftId;
        var leftEl = items[i].querySelector('.ts-match-pair-left');
        leftTextByRight[rightId] = leftEl ? leftEl.textContent : leftId;
      }
    }

    var leftControls = matching.querySelectorAll('.ts-match-left');
    for (var j = 0; j < leftControls.length; j++) {
      var id = leftControls[j].getAttribute('data-match-left-id');
      var unavailable = Boolean(usedLeft[id]);
      leftControls[j].disabled = unavailable;
      leftControls[j].setAttribute('aria-disabled', unavailable ? 'true' : 'false');
      if (unavailable) {
        leftControls[j].classList.remove('selected');
        leftControls[j].setAttribute('aria-pressed', 'true');
      } else if (!leftControls[j].classList.contains('selected')) {
        leftControls[j].setAttribute('aria-pressed', 'false');
      }
    }

    var rightControls = matching.querySelectorAll('.ts-match-right');
    for (var k = 0; k < rightControls.length; k++) {
      var rightId = rightControls[k].getAttribute('data-match-right-id');
      var assigned = Boolean(usedRight[rightId]);
      rightControls[k].disabled = assigned;
      rightControls[k].setAttribute('aria-disabled', assigned ? 'true' : 'false');
      rightControls[k].setAttribute('aria-pressed', assigned ? 'true' : 'false');
      rightControls[k].classList.toggle('is-filled', assigned);
      rightControls[k].setAttribute('data-match-assigned-left-id', assigned ? leftIdByRight[rightId] : '');
      var assignedEl = rightControls[k].querySelector('.ts-match-right-assigned');
      if (assignedEl) assignedEl.textContent = assigned ? leftTextByRight[rightId] : '';
    }

    var placeholder = matching.querySelector('.ts-match-placeholder');
    if (placeholder) placeholder.hidden = items.length > 0;
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

  function updateSourceNodeAvailability(chain) {
    var used = {};
    var items = chain.querySelectorAll('.ts-source-chain-item');
    for (var i = 0; i < items.length; i++) {
      var nodeId = items[i].getAttribute('data-source-selected-node-id');
      if (nodeId) used[nodeId] = true;
    }
    var nodes = chain.querySelectorAll('.ts-source-node');
    for (var j = 0; j < nodes.length; j++) {
      var id = nodes[j].getAttribute('data-source-node-id');
      var unavailable = Boolean(used[id]);
      nodes[j].disabled = unavailable;
      nodes[j].setAttribute('aria-disabled', unavailable ? 'true' : 'false');
      nodes[j].setAttribute('aria-pressed', unavailable ? 'true' : 'false');
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

  function sourceNodeText(node) {
    var label = node.querySelector('.ts-source-node-label');
    return label ? label.textContent : node.textContent;
  }

  function labelTokenText(label) {
    var el = label.querySelector('.ts-label-token-label');
    return el ? el.textContent : label.textContent;
  }

  function labelTargetText(target) {
    var el = target.querySelector('.ts-label-target-label');
    return el ? el.textContent : target.textContent;
  }

  function matchLeftText(left) {
    var el = left.querySelector('.ts-match-left-label');
    return el ? el.textContent : left.textContent;
  }

  function matchRightText(right) {
    var el = right.querySelector('.ts-match-right-label');
    return el ? el.textContent : right.textContent;
  }

  function twoTierOptionText(option) {
    var el = option.querySelector('.ts-two-tier-body strong');
    return el ? el.textContent : option.textContent;
  }

  function assertionOptionText(option) {
    var el = option.querySelector('.ts-assertion-option-body strong');
    return el ? el.textContent : option.textContent;
  }

  function setSelectedTwoTierOption(twoTier, option) {
    var tier = option.getAttribute('data-two-tier-tier');
    if (!tier) return;
    var controls = twoTier.querySelectorAll('[data-two-tier-tier="' + cssEscape(tier) + '"]');
    for (var i = 0; i < controls.length; i++) {
      controls[i].classList.remove('selected');
      controls[i].setAttribute('aria-pressed', 'false');
    }
    option.classList.add('selected');
    option.setAttribute('aria-pressed', 'true');
  }

  function updateTwoTierSummary(twoTier) {
    var answer = twoTier.querySelector('.ts-two-tier-answer.selected');
    var reason = twoTier.querySelector('.ts-two-tier-reason.selected');
    var answerSummary = twoTier.querySelector('.ts-two-tier-summary-answer');
    var reasonSummary = twoTier.querySelector('.ts-two-tier-summary-reason');
    if (answerSummary) answerSummary.textContent = 'Antwoord: ' + (answer ? twoTierOptionText(answer) : 'nog niet gekozen');
    if (reasonSummary) reasonSummary.textContent = 'Reden: ' + (reason ? twoTierOptionText(reason) : 'nog niet gekozen');
  }

  function setSelectedAssertionOption(assertion, option) {
    var controls = assertion.querySelectorAll('.ts-assertion-option');
    for (var i = 0; i < controls.length; i++) {
      controls[i].classList.remove('selected');
      controls[i].setAttribute('aria-pressed', 'false');
    }
    option.classList.add('selected');
    option.setAttribute('aria-pressed', 'true');
  }

  function updateAssertionSummary(assertion) {
    var selected = assertion.querySelector('.ts-assertion-option.selected');
    var summary = assertion.querySelector('[data-assertion-summary]');
    if (summary) summary.textContent = 'Relatie: ' + (selected ? assertionOptionText(selected) : 'nog niet gekozen');
  }

  function setSelectedMatchLeft(matching, left) {
    var controls = matching.querySelectorAll('.ts-match-left');
    var wasSelected = left.classList.contains('selected');
    for (var i = 0; i < controls.length; i++) {
      controls[i].classList.remove('selected');
      controls[i].setAttribute('aria-pressed', 'false');
    }
    if (!wasSelected) {
      left.classList.add('selected');
      left.setAttribute('aria-pressed', 'true');
    }
  }

  function clearSelectedMatchLeft(matching) {
    var selected = matching.querySelectorAll('.ts-match-left.selected');
    for (var i = 0; i < selected.length; i++) {
      selected[i].classList.remove('selected');
      selected[i].setAttribute('aria-pressed', 'false');
    }
  }

  function setSelectedLabel(placement, label) {
    var labels = placement.querySelectorAll('.ts-label-token');
    var wasSelected = label.classList.contains('selected');
    for (var i = 0; i < labels.length; i++) {
      labels[i].classList.remove('selected');
      labels[i].setAttribute('aria-pressed', 'false');
    }
    if (!wasSelected) {
      label.classList.add('selected');
      label.setAttribute('aria-pressed', 'true');
    }
  }

  function clearSelectedLabels(placement) {
    var labels = placement.querySelectorAll('.ts-label-token.selected');
    for (var i = 0; i < labels.length; i++) {
      labels[i].classList.remove('selected');
      labels[i].setAttribute('aria-pressed', 'false');
    }
  }

  function sourceRoleLabel(role) {
    var labels = {
      source: 'bron',
      value: 'waarde',
      operation: 'bewerking',
      answer: 'antwoord',
      conclusion: 'conclusie'
    };
    return labels[role] || role || 'onderdeel';
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
    collectMatchingPairsResponse: collectMatchingPairsResponse,
    handleMatchingPairsClick: handleMatchingPairsClick,
    collectTwoTierChoiceResponse: collectTwoTierChoiceResponse,
    handleTwoTierChoiceClick: handleTwoTierChoiceClick,
    collectAssertionReasonResponse: collectAssertionReasonResponse,
    handleAssertionReasonClick: handleAssertionReasonClick,
    collectSourceValueSelectionResponse: collectSourceValueSelectionResponse,
    handleSourceValueSelectionClick: handleSourceValueSelectionClick,
    collectSourceChainBuilderResponse: collectSourceChainBuilderResponse,
    handleSourceChainBuilderClick: handleSourceChainBuilderClick,
    collectLabelPlacementResponse: collectLabelPlacementResponse,
    handleLabelPlacementClick: handleLabelPlacementClick,
    renderContextBlocks: renderContextBlocks,
    renderTask: renderTask,
    renderStaticHtml: renderStaticHtml,
    renderFeedback: renderFeedback
  };
});
