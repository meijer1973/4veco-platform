// Golden Ticket route renderer for Golden Exercise proof routes.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('./golden-ticket-graph'));
  } else {
    root.GoldenTicketLayout = factory(root.GoldenTicketGraph);
  }
})(typeof self !== 'undefined' ? self : this, function (Graph) {
  'use strict';

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function attr(value) {
    return escapeHtml(value);
  }

  function markdownParagraphs(value) {
    return String(value || '')
      .split(/\n{2,}/)
      .map(function (part) { return part.trim(); })
      .filter(Boolean)
      .map(function (part) { return '<p>' + escapeHtml(part) + '</p>'; })
      .join('');
  }

  function taskShells(data) {
    return (data.tasks || [])
      .filter(function (task) { return task && task.type === 'task_shell' && task.taskShell; })
      .map(function (task) { return { id: task.id, taskShell: task.taskShell }; });
  }

  function choiceTasks(data) {
    return (data.tasks || [])
      .filter(function (task) { return task && task.type === 'choice'; });
  }

  function findTask(data, family) {
    return taskShells(data).find(function (entry) {
      return entry.taskShell.family === family;
    }) || null;
  }

  var GRAPH_VARIANT = 'golden_graph_reading_claim_v1';
  var GRAPH_ADVISORY_VARIANT = 'golden_graph_advisory_v1';
  var CALCULATION_VARIANT = 'golden_calculation_structured_v1';
  var ADVISORY_SHORT_CHECK_VARIANT = 'golden_advisory_short_check_v1';
  var SUPPORTED_VARIANT = GRAPH_VARIANT;
  var SUPPORTED_VARIANTS = [GRAPH_VARIANT, GRAPH_ADVISORY_VARIANT, CALCULATION_VARIANT, ADVISORY_SHORT_CHECK_VARIANT];

  function isGoldenExerciseWorkbench(data) {
    return Boolean(
      data &&
      data.layout &&
      data.layout.framework === 'golden_exercise_workbench'
    );
  }

  function graphSupportGaps(data) {
    var gaps = [];
    if (!findTask(data, 'graph_construction_substitute')) gaps.push('task family graph_construction_substitute');
    if (!findTask(data, 'graph_reading')) gaps.push('task family graph_reading');
    if (!findTask(data, 'calculation_work_capture')) gaps.push('task family calculation_work_capture');
    if (!Graph || typeof Graph.buildGraphSpec !== 'function') {
      gaps.push('Golden graph runtime');
    } else if (!Graph.buildGraphSpec(data)) {
      gaps.push('graph spec from graph_construction_substitute');
    }
    return gaps;
  }

  function graphAdvisorySupportGaps(data) {
    var gaps = [];
    var layout = data && data.layout ? data.layout : {};
    var targetEquivalent = data && data.targetEquivalent ? data.targetEquivalent : {};
    var metadataAlignment = data && data.metadataAlignment ? data.metadataAlignment : {};
    var advisory = data && data.advisory ? data.advisory : {};
    var shells = taskShells(data || {});
    var families = shells.map(function (entry) { return entry.taskShell.family; });
    var allowedFamilies = ['graph_construction_substitute', 'graph_reading', 'table_value_selection'];
    var unsupported = families.filter(function (family) { return allowedFamilies.indexOf(family) === -1; });
    var graphEntry = findTask(data || {}, 'graph_construction_substitute');
    var readEntry = findTask(data || {}, 'graph_reading');
    var routeEntry = findTask(data || {}, 'table_value_selection');
    var blocks = Array.isArray(data && data.contextBlocks) ? data.contextBlocks : [];
    var blockIds = {};

    blocks.forEach(function (block) {
      if (block && block.id) blockIds[block.id] = true;
    });

    if (!data || data.surface !== 'advisory_short_check') gaps.push('surface advisory_short_check');
    if (layout.variant !== GRAPH_ADVISORY_VARIANT) gaps.push('layout.variant ' + GRAPH_ADVISORY_VARIANT);
    if (targetEquivalent.candidate !== false) gaps.push('targetEquivalent.candidate false');
    if (targetEquivalent.gateApproved !== false) gaps.push('targetEquivalent.gateApproved false');
    if (targetEquivalent.completionLanguageEligible !== false) gaps.push('targetEquivalent.completionLanguageEligible false');
    if (metadataAlignment.targetReadinessEvidence !== false) gaps.push('metadataAlignment.targetReadinessEvidence false');
    if (!advisory.intent) gaps.push('advisory.intent');
    if (advisory.hintsAbsent !== true) gaps.push('advisory.hintsAbsent true or governed hint implementation');
    if (advisory.targetEquivalentProof !== false) gaps.push('advisory.targetEquivalentProof false');
    if (unsupported.length) {
      gaps.push('unsupported task families for graph advisory variant: ' + Array.from(new Set(unsupported)).join(', '));
    }
    if (!graphEntry) gaps.push('task family graph_construction_substitute');
    if (!readEntry) gaps.push('task family graph_reading');
    if (!routeEntry) gaps.push('task family table_value_selection');
    if (!blocks.length) gaps.push('contextBlocks');
    if (!Graph || typeof Graph.buildGraphSpec !== 'function') {
      gaps.push('Golden graph runtime');
    } else if (!Graph.buildGraphSpec(data)) {
      gaps.push('graph spec from graph_construction_substitute');
    }

    shells.forEach(function (entry) {
      var task = entry.taskShell || {};
      if (!Array.isArray(task.contextRefs) || !task.contextRefs.length) {
        gaps.push(task.id + '.contextRefs');
      } else {
        task.contextRefs.forEach(function (ref) {
          if (!blockIds[ref]) gaps.push(task.id + '.contextRefs unknown ' + ref);
        });
      }
    });

    if (graphEntry) {
      var graphTask = graphEntry.taskShell || {};
      var interaction = graphTask.interaction || {};
      ['lineConfirmationLabel', 'lineConfirmationOptions', 'lineShapeLabel', 'lineShapeOptions', 'slopeLabel', 'slopeOptions'].forEach(function (field) {
        if (interaction[field] != null) gaps.push('forbidden graph interaction field ' + field);
      });
      var axisOptions = Array.isArray(interaction.axisOptions) ? interaction.axisOptions : [];
      var axisValues = axisOptions.map(function (option) { return option.value; });
      if (axisOptions.length < 3 || axisValues.indexOf('Q') === -1 || axisValues.indexOf('P') === -1) {
        gaps.push(graphTask.id + '.interaction.axisOptions with P/Q and plausible distractors');
      }
    }

    if (readEntry) {
      var readTask = readEntry.taskShell || {};
      var readInteraction = readTask.interaction || {};
      var intervalOptions = Array.isArray(readInteraction.intervalOptions) ? readInteraction.intervalOptions : [];
      var expectedInterval = (((readTask.expected || {}).interval || {}).value || '');
      if (intervalOptions.length < 2) gaps.push(readTask.id + '.interaction.intervalOptions');
      if (!expectedInterval) gaps.push(readTask.id + '.expected.interval.value');
      if (intervalOptions.length && expectedInterval && !intervalOptions.some(function (option) { return option.id === expectedInterval; })) {
        gaps.push(readTask.id + '.expected.interval option');
      }
    }

    if (routeEntry) {
      var routeTask = routeEntry.taskShell || {};
      var routeOptions = Array.isArray((routeTask.interaction || {}).options) ? routeTask.interaction.options : [];
      if (routeOptions.length < 2) gaps.push(routeTask.id + '.interaction.options');
      if (!routeTask.expected || routeTask.expected.kind !== 'advisory_choice' || !Array.isArray(routeTask.expected.values) || !routeTask.expected.values.length) {
        gaps.push(routeTask.id + '.expected advisory_choice values');
      } else {
        routeTask.expected.values.forEach(function (value) {
          if (!routeOptions.some(function (option) { return option.id === value; })) {
            gaps.push(routeTask.id + '.expected.values unknown ' + value);
          }
        });
      }
      if (!routeTask.practiceRoute || !routeTask.practiceRoute.href || !routeTask.practiceRoute.label) {
        gaps.push(routeTask.id + '.practiceRoute');
      }
    }

    return Array.from(new Set(gaps));
  }

  function calculationSupportGaps(data) {
    var gaps = [];
    var shells = taskShells(data);
    var families = shells.map(function (entry) { return entry.taskShell.family; });
    var unsupported = families.filter(function (family) {
      return family !== 'calculation_work_capture' && family !== 'structured_short_response';
    });
    if (!findTask(data, 'calculation_work_capture')) gaps.push('task family calculation_work_capture');
    if (!findTask(data, 'structured_short_response')) gaps.push('task family structured_short_response');
    if (unsupported.length) {
      gaps.push('unsupported task families for calculation/structured variant: ' + Array.from(new Set(unsupported)).join(', '));
    }
    if (!Array.isArray(data.contextBlocks) || !data.contextBlocks.length) gaps.push('contextBlocks');
    return gaps;
  }

  function advisoryShortCheckSupportGaps(data) {
    var gaps = [];
    var layout = data && data.layout ? data.layout : {};
    var targetEquivalent = data && data.targetEquivalent ? data.targetEquivalent : {};
    var metadataAlignment = data && data.metadataAlignment ? data.metadataAlignment : {};
    var advisory = data && data.advisory ? data.advisory : {};
    var choices = choiceTasks(data || {});
    var shellCount = taskShells(data || {}).length;
    var blocks = Array.isArray(data && data.contextBlocks) ? data.contextBlocks : [];
    var blockIds = {};

    blocks.forEach(function (block) {
      if (block && block.id) blockIds[block.id] = true;
    });

    if (!data || data.surface !== 'advisory_short_check') gaps.push('surface advisory_short_check');
    if (layout.variant !== ADVISORY_SHORT_CHECK_VARIANT) gaps.push('layout.variant ' + ADVISORY_SHORT_CHECK_VARIANT);
    if (targetEquivalent.candidate !== false) gaps.push('targetEquivalent.candidate false');
    if (targetEquivalent.gateApproved !== false) gaps.push('targetEquivalent.gateApproved false');
    if (targetEquivalent.completionLanguageEligible !== false) gaps.push('targetEquivalent.completionLanguageEligible false');
    if (metadataAlignment.targetReadinessEvidence !== false) gaps.push('metadataAlignment.targetReadinessEvidence false');
    if (!advisory.intent) gaps.push('advisory.intent');
    if (advisory.hintsAbsent !== true) gaps.push('advisory.hintsAbsent true or governed hint implementation');
    if (shellCount) gaps.push('ordinary choice tasks only');
    if (!choices.length) gaps.push('choice tasks');
    if (!blocks.length) gaps.push('contextBlocks');

    choices.forEach(function (task) {
      if (!Array.isArray(task.options) || task.options.length < 2) gaps.push(task.id + '.options');
      if (!task.answer) gaps.push(task.id + '.answer');
      if (!task.feedback || !task.feedback.matchText || !task.feedback.retryText) gaps.push(task.id + '.feedback');
      if (!task.practiceRoute || !task.practiceRoute.href || !task.practiceRoute.label) gaps.push(task.id + '.practiceRoute');
      if (!Array.isArray(task.contextRefs) || !task.contextRefs.length) {
        gaps.push(task.id + '.contextRefs');
      } else {
        task.contextRefs.forEach(function (ref) {
          if (!blockIds[ref]) gaps.push(task.id + '.contextRefs unknown ' + ref);
        });
      }
    });

    return Array.from(new Set(gaps));
  }

  function supportGaps(data) {
    return graphSupportGaps(data);
  }

  function supportGapsByVariant(data) {
    return {
      graph: graphSupportGaps(data),
      graph_advisory: graphAdvisorySupportGaps(data),
      calculation: calculationSupportGaps(data),
      advisory_short_check: advisoryShortCheckSupportGaps(data)
    };
  }

  function supportedVariantFor(data) {
    if (!isGoldenExerciseWorkbench(data)) return null;
    if (!graphSupportGaps(data).length) return GRAPH_VARIANT;
    if (!graphAdvisorySupportGaps(data).length) return GRAPH_ADVISORY_VARIANT;
    if (!calculationSupportGaps(data).length) return CALCULATION_VARIANT;
    if (!advisoryShortCheckSupportGaps(data).length) return ADVISORY_SHORT_CHECK_VARIANT;
    return null;
  }

  function assertSupportedGoldenExerciseVariant(data) {
    if (!isGoldenExerciseWorkbench(data)) return null;
    var variant = supportedVariantFor(data);
    if (!variant) {
      var gaps = supportGapsByVariant(data);
      throw new Error(
        'Unsupported Golden Exercise Workbench variant: current renderer supports ' +
        GRAPH_VARIANT +
        ' (graph construction + graph reading + calculation/claim control with graph spec) and ' +
        GRAPH_ADVISORY_VARIANT +
        ' (advisory graph construction + graph reading + route choice with false authority flags) and ' +
        CALCULATION_VARIANT +
        ' (calculation_work_capture + structured_short_response with context blocks) and ' +
        ADVISORY_SHORT_CHECK_VARIANT +
        ' (advisory choice short check with context blocks and false authority flags); graph variant missing ' +
        gaps.graph.join(', ') +
        '; graph advisory variant missing ' +
        gaps.graph_advisory.join(', ') +
        '; calculation/structured variant missing ' +
        gaps.calculation.join(', ') +
        '; advisory short-check variant missing ' +
        gaps.advisory_short_check.join(', ') +
        '.'
      );
    }
    return variant;
  }

  function needsGraphRuntimeForVariant(variant) {
    return variant === GRAPH_VARIANT || variant === GRAPH_ADVISORY_VARIANT;
  }

  function rendererAssetsForVariant(variant) {
    return {
      stylesheets: ['golden-ticket-layout.css'],
      scripts: needsGraphRuntimeForVariant(variant)
        ? ['exit-ticket/{sourceKey}.js', 'golden-ticket-graph.js', 'golden-ticket-layout.js']
        : ['exit-ticket/{sourceKey}.js', 'golden-ticket-layout.js']
    };
  }

  function sourceBlockTitle(block) {
    return block.caption || block.title || block.sourceLabel || 'Bron';
  }

  function titleCaseAfterSourceLabel(value) {
    var title = String(value || '').trim();
    var match = title.match(/^(Bron\s+\d+)\s*:\s*(.+)$/i);
    if (!match) return title.replace(':', ' -');
    var subject = match[2].trim();
    if (subject) subject = subject.charAt(0).toLowerCase() + subject.slice(1);
    return match[1] + ' — ' + subject;
  }

  function renderSourceBlock(block, options) {
    options = options || {};
    var title = block.caption || block.title || block.sourceLabel || 'Bron';
    var titleHtml = options.showTitle === false ? '' : '<h3>' + escapeHtml(title.replace(':', ' -')) + '</h3>';
    var sectionClass = 'ge-source-section' + (block.type === 'table' ? ' ge-source-table-section' : '');
    if (block.type === 'table') {
      var columns = Array.isArray(block.columns) ? block.columns : [];
      var rows = Array.isArray(block.rows) ? block.rows : [];
      return '<section class="' + sectionClass + '" data-context-block="' + attr(block.id || '') + '">' +
        titleHtml +
        (block.bodyMarkdown ? markdownParagraphs(block.bodyMarkdown) : '') +
        '<table class="ge-source-table" aria-label="' + attr(block.altText || title) + '">' +
          '<thead><tr>' + columns.map(function (column) { return '<th>' + escapeHtml(column) + '</th>'; }).join('') + '</tr></thead>' +
          '<tbody>' + rows.map(function (row) {
            return '<tr>' + (row || []).map(function (cell) { return '<td>' + escapeHtml(cell) + '</td>'; }).join('') + '</tr>';
          }).join('') + '</tbody>' +
        '</table>' +
      '</section>';
    }
    return '<section class="' + sectionClass + '" data-context-block="' + attr(block.id || '') + '">' +
      titleHtml +
      markdownParagraphs(block.bodyMarkdown || block.text || block.altText || '') +
    '</section>';
  }

  function renderSourceCard(data, options) {
    options = options || {};
    var blocks = Array.isArray(data.contextBlocks) ? data.contextBlocks : [];
    var primary = blocks.find(function (block) { return block && block.type !== 'table'; }) || blocks[0] || {};
    var remaining = blocks.filter(function (block) { return block !== primary; });
    var heading = titleCaseAfterSourceLabel(sourceBlockTitle(primary));
    var note = options.sourceNote || 'Gebruik deze bron als enige gegevensbron. De tabel geeft niet voor welke as je moet kiezen; dat hoort bij het P-Q-diagram.';
    return '<aside class="ge-source-card" aria-label="Bronnen">' +
      '<h2>' + escapeHtml(heading) + '</h2>' +
      (primary.id ? renderSourceBlock(primary, { showTitle: false }) : '') +
      remaining.map(function (block) {
        return renderSourceBlock(block, { showTitle: options.showTableTitles === true || block.type !== 'table' });
      }).join('') +
      '<p class="ge-subtle ge-source-note">' + escapeHtml(note) + '</p>' +
    '</aside>';
  }

  function renderRouteStrip(data) {
    var skillMap = data.skillMap || {};
    var routes = Array.isArray(skillMap.routes) ? skillMap.routes : [];
    if (!routes.length) return '';
    var title = skillMap.title || 'Oefenroute bij herstel';
    return '<nav class="ge-route-panel" aria-label="' + attr(title) + '">' +
      '<h2>' + escapeHtml(title) + '</h2>' +
      '<div class="ge-route-strip">' +
        routes.map(function (route) {
          return '<a class="ge-route-pill" href="' + attr(route.href || '#') + '">' +
            '<span>' + escapeHtml(route.surface || 'Oefenen') + '</span>' +
            '<strong>' + escapeHtml(route.label || '') + '</strong>' +
          '</a>';
        }).join('') +
      '</div>' +
    '</nav>';
  }

  function renderAxisOption(option) {
    return '<button type="button" class="ge-chip" aria-pressed="false" data-ge-axis-option data-axis-option-id="' + attr(option.id) + '" data-axis-value="' + attr(option.value) + '">' +
      escapeHtml(option.label) +
    '</button>';
  }

  function renderGraphStep(graphEntry, spec) {
    var task = graphEntry.taskShell;
    var interaction = task.interaction || {};
    var axisOptions = Array.isArray(interaction.axisOptions) ? interaction.axisOptions : [];
    return '<li class="ge-step ge-step-graph" data-ge-step="graph" data-task-id="' + attr(graphEntry.id) + '" data-task-family="' + attr(task.family) + '">' +
      renderStepHead('1', task.skillLabel, 'Maak een economisch P-Q-diagram', task.purpose) +
      '<div class="ge-graph-layout">' +
        '<div class="ge-axis-panel">' +
          '<h4>Aslabels</h4>' +
          '<div class="ge-chip-row" data-ge-axis-options>' + axisOptions.map(renderAxisOption).join('') + '</div>' +
          '<div class="ge-slot-grid">' +
            '<button type="button" class="ge-slot" data-ge-axis-slot="x"><strong>' + escapeHtml(interaction.xAxisLabel || 'Horizontale as') + '</strong><span>Nog leeg</span></button>' +
            '<button type="button" class="ge-slot" data-ge-axis-slot="y"><strong>' + escapeHtml(interaction.yAxisLabel || 'Verticale as') + '</strong><span>Nog leeg</span></button>' +
          '</div>' +
        '</div>' +
        '<div class="ge-graph-panel">' +
          '<div class="ge-graph-wrap" data-ge-graph-wrap>' + Graph.renderSvgString(spec, { axesVisible: false, points: [], lineVisible: false }) + '</div>' +
          '<div class="ge-action-row ge-graph-actions">' +
            '<button type="button" class="ge-small-button" data-ge-clear-graph>Wis punten</button>' +
            '<button type="button" class="ge-small-button" data-ge-check-graph>Controleer grafiek</button>' +
          '</div>' +
          '<p class="ge-subtle" data-ge-graph-help>Kies eerst de assen. Daarna klik je twee verschillende tabelpunten in het raster.</p>' +
          renderFeedback('graph') +
        '</div>' +
      '</div>' +
    '</li>';
  }

  function renderStepHead(number, kicker, title, purpose) {
    return '<header class="ge-step-head">' +
      '<span class="ge-step-number">' + escapeHtml(number) + '</span>' +
      '<div>' +
        '<p class="ge-step-kicker">' + escapeHtml(kicker || '') + '</p>' +
        '<h3>' + escapeHtml(title || '') + '</h3>' +
        (purpose ? '<p class="ge-step-purpose">' + escapeHtml(purpose) + '</p>' : '') +
      '</div>' +
    '</header>';
  }

  function renderFeedback(id) {
    return '<div class="ge-feedback" data-ge-feedback="' + attr(id) + '" role="status" aria-live="polite" tabindex="-1"></div>';
  }

  function renderPill(option, groupName) {
    return '<button type="button" class="ge-pill" aria-pressed="false" data-ge-pill-group="' + attr(groupName) + '" data-option-id="' + attr(option.id) + '">' +
      escapeHtml(option.label) +
    '</button>';
  }

  function renderReadingStep(readEntry) {
    var task = readEntry.taskShell;
    var interaction = task.interaction || {};
    var intervalOptions = Array.isArray(interaction.intervalOptions) ? interaction.intervalOptions : [];
    return '<li class="ge-step ge-step-reading ge-locked" data-ge-step="reading" data-task-id="' + attr(readEntry.id) + '" data-task-family="' + attr(task.family) + '" aria-disabled="true">' +
      renderStepHead('2', task.skillLabel, 'Lees een tussenwaarde af', task.purpose) +
      '<p>' + escapeHtml(task.prompt || '') + '</p>' +
      '<div class="ge-field-grid">' +
        '<div class="ge-field ge-field-wide">' +
          '<span>' + escapeHtml(interaction.intervalLabel || '1. Gebruikt interval') + '</span>' +
          '<div class="ge-pill-row" data-ge-read-intervals>' + intervalOptions.map(function (option) { return renderPill(option, 'read-interval'); }).join('') + '</div>' +
        '</div>' +
        '<label class="ge-field ge-field-wide"><span>' + escapeHtml(interaction.inputLabel || '2. Afgelezen hoeveelheid Q') + '</span>' +
          '<input type="text" inputmode="decimal" autocomplete="off" data-ge-read-q placeholder="' + attr(interaction.inputPlaceholder || 'vul hoeveelheid in') + '">' +
        '</label>' +
      '</div>' +
      '<div class="ge-action-row"><button type="button" class="ge-small-button" data-ge-check-reading>Controleer aflezing</button></div>' +
      renderFeedback('reading') +
      renderLockOverlay() +
    '</li>';
  }

  function renderToken(token) {
    return '<button type="button" class="ge-token" data-ge-token-id="' + attr(token.id) + '">' + escapeHtml(token.label) + '</button>';
  }

  function renderClaimStep(claimEntry) {
    var task = claimEntry.taskShell;
    var interaction = task.interaction || {};
    var formula = interaction.formula || {};
    var intervalOptions = Array.isArray(interaction.intervalOptions) ? interaction.intervalOptions : [];
    var conclusionOptions = Array.isArray(interaction.conclusionOptions) ? interaction.conclusionOptions : [];
    var tokens = Array.isArray(formula.tokens) ? formula.tokens : [];
    return '<li class="ge-step ge-step-claim ge-locked" data-ge-step="claim" data-task-id="' + attr(claimEntry.id) + '" data-task-family="' + attr(task.family) + '" aria-disabled="true">' +
      renderStepHead('3', task.skillLabel, 'Controleer een claim over 50% daling', task.purpose) +
      '<p>' + escapeHtml(task.prompt || '') + '</p>' +
      '<div class="ge-claim-grid" data-percentage-claim-control>' +
        '<section class="ge-claim-part">' +
          '<h4>' + escapeHtml(interaction.intervalLabel || '3a. Kies het interval') + '</h4>' +
          '<p class="ge-subtle">' + escapeHtml(interaction.intervalLegend || '') + '</p>' +
          '<div class="ge-pill-row" data-ge-claim-intervals>' + intervalOptions.map(function (option) { return renderPill(option, 'claim-interval'); }).join('') + '</div>' +
        '</section>' +
        '<section class="ge-claim-part">' +
          '<h4>' + escapeHtml(interaction.valueSectionLabel || '3b. Haal de bronwaarden zelf uit de tabel') + '</h4>' +
          '<div class="ge-field-grid">' +
            '<label class="ge-field"><span>' + escapeHtml(interaction.oldValueLabel || 'Oude hoeveelheid Q') + '</span><input type="text" inputmode="decimal" autocomplete="off" data-ge-old-q placeholder="' + attr(interaction.oldValuePlaceholder || 'oude Q') + '"></label>' +
            '<label class="ge-field"><span>' + escapeHtml(interaction.newValueLabel || 'Nieuwe hoeveelheid Q') + '</span><input type="text" inputmode="decimal" autocomplete="off" data-ge-new-q placeholder="' + attr(interaction.newValuePlaceholder || 'nieuwe Q') + '"></label>' +
          '</div>' +
        '</section>' +
        '<section class="ge-claim-part">' +
          '<h4>' + escapeHtml(interaction.formulaSectionLabel || '3c. Bouw de berekening') + '</h4>' +
          '<p class="ge-subtle">' + escapeHtml(formula.placeholder || 'Klik bouwstenen in de juiste volgorde.') + '</p>' +
          '<div class="ge-token-bank" data-ge-token-bank>' + tokens.map(renderToken).join('') + '</div>' +
          '<div class="ge-chosen-tokens" data-ge-chosen-tokens aria-label="' + attr(formula.sequenceLabel || 'Jouw berekening') + '"></div>' +
          '<div class="ge-action-row">' +
            '<button type="button" class="ge-small-button" data-ge-undo-token>Laatste bouwsteen weg</button>' +
            '<button type="button" class="ge-small-button" data-ge-clear-formula>Wis formule</button>' +
          '</div>' +
        '</section>' +
        '<section class="ge-claim-part">' +
          '<h4>' + escapeHtml(interaction.finalAnswerSectionLabel || '3d. Vul de procentuele verandering in') + '</h4>' +
          '<label class="ge-field ge-field-wide"><span>' + escapeHtml(interaction.finalAnswerLabel || 'Procentuele verandering') + '</span><input type="text" inputmode="decimal" autocomplete="off" data-ge-percent placeholder="' + attr(interaction.finalAnswerPlaceholder || 'vul percentage in, bijvoorbeeld met %') + '"></label>' +
        '</section>' +
        '<section class="ge-claim-part">' +
          '<h4>' + escapeHtml(interaction.conclusionLabel || '3e. Conclusie') + '</h4>' +
          '<p class="ge-subtle">' + escapeHtml(interaction.conclusionLegend || '') + '</p>' +
          '<div class="ge-pill-row" data-ge-conclusions>' + conclusionOptions.map(function (option) { return renderPill(option, 'claim-conclusion'); }).join('') + '</div>' +
        '</section>' +
      '</div>' +
      '<div class="ge-action-row"><button type="button" class="ge-small-button" data-ge-check-claim>Controleer claim</button></div>' +
      renderFeedback('claim') +
      renderLockOverlay() +
    '</li>';
  }

  function renderLockOverlay() {
    return '<div class="ge-lock-overlay" aria-hidden="true"><span>Rond eerst het vorige onderdeel af.</span></div>';
  }

  function renderCalculationStep(calcEntry, number) {
    var task = calcEntry.taskShell;
    var interaction = task.interaction || {};
    return '<li class="ge-step ge-step-calculation" data-ge-step="calculation" data-task-id="' + attr(calcEntry.id) + '" data-task-family="' + attr(task.family) + '">' +
      renderStepHead(String(number), 'Berekening', task.skillLabel, task.purpose) +
      '<p>' + escapeHtml(task.prompt || '') + '</p>' +
      '<div class="ge-claim-grid ge-calculation-grid">' +
        '<section class="ge-claim-part">' +
          '<h4>' + escapeHtml(interaction.workLabel || 'Berekening') + '</h4>' +
          '<label class="ge-field ge-field-wide">' +
            '<span>Methode, invulling en tussenstap</span>' +
            '<textarea rows="4" autocomplete="off" data-ge-work placeholder="' + attr(interaction.placeholder || 'laat je berekening zien') + '"></textarea>' +
          '</label>' +
        '</section>' +
        '<section class="ge-claim-part">' +
          '<h4>Antwoord en notatie</h4>' +
          '<div class="ge-field-grid">' +
            '<label class="ge-field"><span>' + escapeHtml(interaction.finalAnswerLabel || 'Eindantwoord') + '</span><input type="text" inputmode="decimal" autocomplete="off" data-ge-final-answer placeholder="' + attr(interaction.finalAnswerPlaceholder || 'vul je antwoord in') + '"></label>' +
            '<label class="ge-field"><span>' + escapeHtml(interaction.unitNotationLabel || 'Notatie') + '</span><input type="text" autocomplete="off" data-ge-unit-notation placeholder="' + attr(interaction.unitNotationPlaceholder || 'vul de notatie in') + '"></label>' +
          '</div>' +
        '</section>' +
      '</div>' +
      '<div class="ge-action-row"><button type="button" class="ge-small-button" data-ge-check-task>Controleer onderdeel</button></div>' +
      renderFeedback(task.id) +
    '</li>';
  }

  function renderStructuredChoice(option) {
    return '<button type="button" class="ge-pill" aria-pressed="false" data-ge-structured-choice data-option-id="' + attr(option.id) + '">' +
      escapeHtml(option.label) +
    '</button>';
  }

  function renderStructuredStep(structuredEntry, number) {
    var task = structuredEntry.taskShell;
    var interaction = task.interaction || {};
    var fields = Array.isArray(interaction.fields) ? interaction.fields : [];
    var options = Array.isArray(interaction.options) ? interaction.options : [];
    return '<li class="ge-step ge-step-structured" data-ge-step="structured" data-task-id="' + attr(structuredEntry.id) + '" data-task-family="' + attr(task.family) + '">' +
      renderStepHead(String(number), 'Uitleg', task.skillLabel, task.purpose) +
      '<p>' + escapeHtml(task.prompt || '') + '</p>' +
      '<div class="ge-claim-grid ge-structured-grid">' +
        '<section class="ge-claim-part">' +
          '<h4>Gegevens voor je uitleg</h4>' +
          '<div class="ge-field-grid">' +
            fields.map(function (field) {
              return '<label class="ge-field"><span>' + escapeHtml(field.label || field.id) + '</span>' +
                '<input type="text" inputmode="' + attr(field.inputMode || 'text') + '" autocomplete="off" data-ge-structured-field data-field-id="' + attr(field.id) + '" placeholder="' + attr(field.placeholder || 'vul je antwoord in') + '">' +
              '</label>';
            }).join('') +
          '</div>' +
        '</section>' +
        '<section class="ge-claim-part">' +
          '<h4>Korte conclusie</h4>' +
          '<div class="ge-pill-row" data-ge-structured-options>' + options.map(renderStructuredChoice).join('') + '</div>' +
        '</section>' +
      '</div>' +
      '<div class="ge-action-row"><button type="button" class="ge-small-button" data-ge-check-task>Controleer onderdeel</button></div>' +
      renderFeedback(task.id) +
    '</li>';
  }

  function contextLabel(block) {
    return block.sourceLabel || block.caption || block.title || block.id || 'Context';
  }

  function renderContextRefs(data, task) {
    var refs = Array.isArray(task.contextRefs) ? task.contextRefs : [];
    if (!refs.length) return '';
    var blocks = Array.isArray(data.contextBlocks) ? data.contextBlocks : [];
    var byId = {};
    blocks.forEach(function (block) {
      if (block && block.id) byId[block.id] = block;
    });
    return '<p class="ge-context-refs">Gebruik: ' +
      refs.map(function (ref) {
        var block = byId[ref] || { id: ref };
        return '<span>' + escapeHtml(contextLabel(block).replace(':', ' -')) + '</span>';
      }).join(' ') +
    '</p>';
  }

  function renderChoiceOption(option) {
    return '<button type="button" class="ge-pill ge-choice-option" aria-pressed="false" data-ge-choice-option data-option-id="' + attr(option.id) + '">' +
      escapeHtml(option.label) +
    '</button>';
  }

  function renderChoiceRoute(task) {
    var route = task.practiceRoute || {};
    if (!route.href || !route.label) return '';
    return '<p class="ge-choice-route"><span>Oefentip</span><a href="' + attr(route.href) + '">' + escapeHtml(route.label) + '</a></p>';
  }

  function renderChoiceStep(data, task, number) {
    var options = Array.isArray(task.options) ? task.options : [];
    return '<li class="ge-step ge-step-choice" data-ge-step="choice" data-task-id="' + attr(task.id) + '">' +
      renderStepHead(String(number), task.skillLabel || 'Korte check', task.prompt || '', task.purpose) +
      renderContextRefs(data, task) +
      '<div class="ge-choice-options" data-ge-choice-options>' + options.map(renderChoiceOption).join('') + '</div>' +
      '<div class="ge-action-row"><button type="button" class="ge-small-button" data-ge-check-task>Controleer onderdeel</button></div>' +
      renderFeedback(task.id) +
      renderChoiceRoute(task) +
    '</li>';
  }

  function renderRouteChoiceOption(option) {
    return '<button type="button" class="ge-pill ge-choice-option" aria-pressed="false" data-ge-route-choice-option data-option-id="' + attr(option.id) + '">' +
      '<strong>' + escapeHtml(option.label) + '</strong>' +
      (option.description ? '<span>' + escapeHtml(option.description) + '</span>' : '') +
    '</button>';
  }

  function renderAdvisoryRouteStep(data, routeEntry, number) {
    var task = routeEntry.taskShell;
    var options = Array.isArray((task.interaction || {}).options) ? task.interaction.options : [];
    return '<li class="ge-step ge-step-choice" data-ge-step="route-choice" data-task-id="' + attr(routeEntry.id) + '" data-task-family="' + attr(task.family) + '">' +
      renderStepHead(String(number), task.skillLabel || 'Volgende oefenstap', task.prompt || '', task.purpose) +
      renderContextRefs(data, task) +
      '<div class="ge-choice-options ge-route-choice-options" data-ge-route-choice-options>' + options.map(renderRouteChoiceOption).join('') + '</div>' +
      '<div class="ge-action-row"><button type="button" class="ge-small-button" data-ge-check-route-choice>Toon oefentip</button></div>' +
      renderFeedback('route-choice') +
    '</li>';
  }

  function renderCompletion(data) {
    var completion = data.completion || {};
    return '<section class="ge-completion" data-ge-completion>' +
      '<h3>' + escapeHtml(completion.title || 'Exit ticket afgerond') + '</h3>' +
      '<p>' + escapeHtml(completion.text || '') + '</p>' +
    '</section>';
  }

  function renderGraphMain(data) {
    var graphEntry = findTask(data, 'graph_construction_substitute');
    var readEntry = findTask(data, 'graph_reading');
    var claimEntry = findTask(data, 'calculation_work_capture');
    var spec = Graph.buildGraphSpec(data);
    if (!graphEntry || !readEntry || !claimEntry || !spec) {
      throw new Error('Golden ticket route needs graph, reading, claim tasks and graph spec.');
    }
    var layout = data.layout || {};
    var kicker = layout.kicker || ('Exit ticket - section ' + (data.parNr || '1.1.3'));
    return '<section class="ge-hero">' +
      '<div class="ge-hero-card">' +
        '<p class="ge-kicker">' + escapeHtml(kicker) + '</p>' +
        '<h1>' + escapeHtml(data.title || 'Exit ticket') + '</h1>' +
        '<p class="ge-intro">' + escapeHtml(data.intro || '') + '</p>' +
      '</div>' +
      renderRouteStrip(data) +
      '</section>' +
      '<section class="ge-workbench">' +
        renderSourceCard(data) +
        '<section class="ge-task-card" data-ge-task-card aria-label="' + attr(layout.taskPaneTitle || 'Werkvragen') + '">' +
          '<ol class="ge-step-list">' +
            renderGraphStep(graphEntry, spec) +
            renderReadingStep(readEntry) +
            renderClaimStep(claimEntry) +
          '</ol>' +
          renderCompletion(data) +
          '<button type="button" class="ge-primary-action" data-ge-check-all>Controleer werk</button>' +
        '</section>' +
      '</section>';
  }

  function renderGraphAdvisoryMain(data) {
    var graphEntry = findTask(data, 'graph_construction_substitute');
    var readEntry = findTask(data, 'graph_reading');
    var routeEntry = findTask(data, 'table_value_selection');
    var spec = Graph.buildGraphSpec(data);
    if (!graphEntry || !readEntry || !routeEntry || !spec) {
      throw new Error('Golden graph advisory route needs graph, reading, route-choice tasks and graph spec.');
    }
    var layout = data.layout || {};
    var kicker = layout.kicker || ('Korte check - paragraaf ' + (data.parNr || ''));
    var sourceNote = layout.sourceNote || 'Gebruik de bron en tabel bij je grafiekwerk. De feedback wijst alleen naar een oefenstap.';
    return '<section class="ge-hero ge-hero-advisory">' +
      '<div class="ge-hero-card">' +
        '<p class="ge-kicker">' + escapeHtml(kicker) + '</p>' +
        '<h1>' + escapeHtml(data.title || 'Korte check') + '</h1>' +
        '<p class="ge-intro">' + escapeHtml(data.intro || '') + '</p>' +
      '</div>' +
      renderRouteStrip(data) +
      '</section>' +
      '<section class="ge-workbench ge-workbench-advisory">' +
        renderSourceCard(data, { sourceNote: sourceNote, showTableTitles: true }) +
        '<section class="ge-task-card" data-ge-task-card aria-label="' + attr(layout.taskPaneTitle || 'Werkvragen') + '">' +
          '<ol class="ge-step-list">' +
            renderGraphStep(graphEntry, spec) +
            renderReadingStep(readEntry) +
            renderAdvisoryRouteStep(data, routeEntry, 3) +
          '</ol>' +
          renderCompletion(data) +
          '<button type="button" class="ge-primary-action" data-ge-check-all>Controleer grafiek en aflezing</button>' +
        '</section>' +
      '</section>';
  }

  function renderCalculationMain(data) {
    var layout = data.layout || {};
    var kicker = layout.kicker || ('Exit ticket - section ' + (data.parNr || ''));
    var sourceNote = layout.sourceNote || 'Gebruik deze gegevens als bron voor je berekeningen en uitleg.';
    var entries = taskShells(data);
    return '<section class="ge-hero">' +
      '<div class="ge-hero-card">' +
        '<p class="ge-kicker">' + escapeHtml(kicker) + '</p>' +
        '<h1>' + escapeHtml(data.title || 'Exit ticket') + '</h1>' +
        '<p class="ge-intro">' + escapeHtml(data.intro || '') + '</p>' +
      '</div>' +
      renderRouteStrip(data) +
      '</section>' +
      '<section class="ge-workbench">' +
        renderSourceCard(data, { sourceNote: sourceNote }) +
        '<section class="ge-task-card" data-ge-task-card aria-label="' + attr(layout.taskPaneTitle || 'Werkvragen') + '">' +
          '<ol class="ge-step-list">' +
            entries.map(function (entry, index) {
              if (entry.taskShell.family === 'calculation_work_capture') return renderCalculationStep(entry, index + 1);
              return renderStructuredStep(entry, index + 1);
            }).join('') +
          '</ol>' +
          renderCompletion(data) +
          '<button type="button" class="ge-primary-action" data-ge-check-all>Controleer werk</button>' +
        '</section>' +
      '</section>';
  }

  function renderAdvisoryShortCheckMain(data) {
    var layout = data.layout || {};
    var kicker = layout.kicker || ('Korte check - paragraaf ' + (data.parNr || ''));
    var sourceNote = layout.sourceNote || 'Gebruik deze gegevens bij je keuzes. De feedback wijst naar een oefenstap.';
    var entries = choiceTasks(data);
    return '<section class="ge-hero ge-hero-advisory">' +
      '<div class="ge-hero-card">' +
        '<p class="ge-kicker">' + escapeHtml(kicker) + '</p>' +
        '<h1>' + escapeHtml(data.title || 'Korte check') + '</h1>' +
        '<p class="ge-intro">' + escapeHtml(data.intro || '') + '</p>' +
      '</div>' +
      renderRouteStrip(data) +
      '</section>' +
      '<section class="ge-workbench ge-workbench-advisory">' +
        renderSourceCard(data, { sourceNote: sourceNote, showTableTitles: true }) +
        '<section class="ge-task-card" data-ge-task-card aria-label="' + attr(layout.taskPaneTitle || 'Werkvragen') + '">' +
          '<ol class="ge-step-list">' +
            entries.map(function (task, index) {
              return renderChoiceStep(data, task, index + 1);
            }).join('') +
          '</ol>' +
          renderCompletion(data) +
          '<button type="button" class="ge-primary-action" data-ge-check-all>Controleer alle keuzes</button>' +
        '</section>' +
      '</section>';
  }

  function renderMain(data) {
    var variant = assertSupportedGoldenExerciseVariant(data);
    if (variant === GRAPH_VARIANT) return renderGraphMain(data);
    if (variant === GRAPH_ADVISORY_VARIANT) return renderGraphAdvisoryMain(data);
    if (variant === CALCULATION_VARIANT) return renderCalculationMain(data);
    if (variant === ADVISORY_SHORT_CHECK_VARIANT) return renderAdvisoryShortCheckMain(data);
    throw new Error('Unsupported Golden Exercise Workbench variant: ' + variant);
  }

  function query(root, selector) {
    return root.querySelector(selector);
  }

  function queryAll(root, selector) {
    return Array.prototype.slice.call(root.querySelectorAll(selector));
  }

  function parseNumber(value) {
    if (value == null) return NaN;
    var normalized = String(value)
      .trim()
      .replace(',', '.')
      .replace(/[^0-9.+-]/g, '');
    if (!normalized) return NaN;
    return Number(normalized);
  }

  function parsePercent(value) {
    if (value == null) return NaN;
    var raw = String(value).trim().toLowerCase().replace(/−/g, '-');
    var decrease = /(daling|gedaald|daalt)/.test(raw);
    var number = parseNumber(raw.replace(/%/g, '').replace(/procent/g, ''));
    if (!Number.isFinite(number)) return NaN;
    if (decrease && number > 0) return -Math.abs(number);
    return number;
  }

  function normalizeAnswer(value) {
    return String(value == null ? '' : value)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  function normalizeWork(value) {
    return normalizeAnswer(value)
      .replace(/×/g, 'x')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');
  }

  function compactWork(value) {
    return normalizeWork(value).replace(/\s+/g, '');
  }

  function hasValue(value) {
    return String(value == null ? '' : value).trim().length > 0;
  }

  function textMatches(value, accepted) {
    var normalized = normalizeAnswer(value);
    return (Array.isArray(accepted) ? accepted : []).some(function (item) {
      return normalizeAnswer(item) === normalized;
    });
  }

  function requiredWorkTextMatches(work, groups) {
    if (!Array.isArray(groups) || !groups.length) return true;
    var normalized = normalizeWork(work);
    var compact = compactWork(work);
    return groups.every(function (group) {
      return (Array.isArray(group.any) ? group.any : []).some(function (needle) {
        var normalizedNeedle = normalizeWork(needle);
        return normalized.indexOf(normalizedNeedle) !== -1 ||
          compact.indexOf(compactWork(needle)) !== -1;
      });
    });
  }

  function unitNotationMatches(value, expected) {
    expected = expected || {};
    if (!hasValue(value) && expected.required === false) return true;
    return textMatches(value, expected.accepted);
  }

  function evaluateCalculationResponse(task, response) {
    var expected = task.expected || {};
    response = response || {};
    if (expected.workRequired !== false && !hasValue(response.work)) return false;
    if (!requiredWorkTextMatches(response.work, expected.requiredWorkText)) return false;
    return textMatches(response.finalAnswer, (expected.finalAnswer || {}).accepted) &&
      unitNotationMatches(response.unitNotation, expected.unitNotation);
  }

  function evaluateStructuredResponse(task, response) {
    var expected = task.expected || {};
    response = response || {};
    var fields = Array.isArray(expected.fields) ? expected.fields : [];
    var fieldResponses = response.fields || {};
    var fieldsOk = fields.every(function (field) {
      return textMatches(fieldResponses[field.id], field.accepted);
    });
    var choiceOk = !expected.choice || normalizeAnswer(response.choice) === normalizeAnswer(expected.choice.value);
    return fieldsOk && choiceOk;
  }

  function evaluateChoiceResponse(task, response) {
    var answer = response && typeof response === 'object' ? response.answerId : response;
    return normalizeAnswer(answer) === normalizeAnswer(task.answer);
  }

  function evaluateTaskResponse(task, response) {
    if (task && task.taskShell) task = task.taskShell;
    if (!task) return false;
    if (task.type === 'choice' || task.answer) {
      return evaluateChoiceResponse(task, response);
    }
    if (task.family === 'calculation_work_capture' && (task.expected || {}).kind === 'calculation') {
      return evaluateCalculationResponse(task, response);
    }
    if (task.family === 'structured_short_response' && (task.expected || {}).kind === 'structured_text_criteria') {
      return evaluateStructuredResponse(task, response);
    }
    if (task.family === 'table_value_selection' && (task.expected || {}).kind === 'choice') {
      var routeAnswer = response && typeof response === 'object' ? response.answerId : response;
      return normalizeAnswer(routeAnswer) === normalizeAnswer(task.expected.value);
    }
    if (task.family === 'table_value_selection' && (task.expected || {}).kind === 'advisory_choice') {
      var advisoryAnswer = response && typeof response === 'object' ? response.answerId : response;
      return (task.expected.values || []).some(function (value) {
        return normalizeAnswer(value) === normalizeAnswer(advisoryAnswer);
      });
    }
    return false;
  }

  function axisOptionByValue(graphTask, value) {
    var options = graphTask.interaction && Array.isArray(graphTask.interaction.axisOptions)
      ? graphTask.interaction.axisOptions
      : [];
    return options.find(function (option) { return option.value === value; }) || null;
  }

  function pointKey(point) {
    return String(Number(point.x)) + ':' + String(Number(point.y));
  }

  function setFeedback(root, id, tone, title, text) {
    var el = query(root, '[data-ge-feedback="' + id + '"]');
    if (!el) return;
    el.className = 'ge-feedback';
    if (!tone) {
      el.innerHTML = '';
      return;
    }
    el.classList.add('is-visible', tone === 'good' ? 'is-good' : tone === 'bad' ? 'is-bad' : 'is-warn');
    el.innerHTML = '<strong>' + escapeHtml(title) + '</strong><p>' + escapeHtml(text) + '</p>';
    if (el.focus) el.focus({ preventScroll: true });
  }

  function setLocked(root, stepName, locked) {
    var step = query(root, '[data-ge-step="' + stepName + '"]');
    if (!step) return;
    step.classList.toggle('ge-locked', locked);
    step.setAttribute('aria-disabled', locked ? 'true' : 'false');
    queryAll(step, 'input, button, textarea').forEach(function (control) {
      control.disabled = locked;
    });
  }

  function setPressed(buttons, selectedButton) {
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', button === selectedButton ? 'true' : 'false');
    });
  }

  function initTheme(root) {
    var button = query(document, '#theme-toggle');
    if (!button) return;
    function currentMode() {
      return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }
    function syncLabel() {
      button.textContent = currentMode() === 'dark' ? 'Lichte modus' : 'Donkere modus';
    }
    syncLabel();
    button.addEventListener('click', function () {
      var next = currentMode() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('quizMode', next);
      } catch (error) {
        // Ignore private browsing storage failures.
      }
      syncLabel();
      if (root && root.__goldenTicketRedrawGraph) root.__goldenTicketRedrawGraph();
    });
  }

  function initCalculationWorkbench(root, data) {
    var entries = taskShells(data);
    var byId = {};
    var state = { taskOk: {} };
    entries.forEach(function (entry) {
      byId[entry.id] = entry.taskShell;
      state.taskOk[entry.id] = false;
    });

    function collectCalculationResponse(step) {
      return {
        work: query(step, '[data-ge-work]').value,
        finalAnswer: query(step, '[data-ge-final-answer]').value,
        unitNotation: query(step, '[data-ge-unit-notation]').value
      };
    }

    function collectStructuredResponse(step) {
      var fields = {};
      queryAll(step, '[data-ge-structured-field]').forEach(function (field) {
        fields[field.getAttribute('data-field-id')] = field.value;
      });
      var selected = query(step, '[data-ge-structured-choice][aria-pressed="true"]');
      return {
        fields: fields,
        choice: selected ? selected.getAttribute('data-option-id') : ''
      };
    }

    function collectResponse(step, task) {
      if (task.family === 'calculation_work_capture') return collectCalculationResponse(step);
      if (task.family === 'structured_short_response') return collectStructuredResponse(step);
      return {};
    }

    function updateCompletion() {
      var complete = entries.every(function (entry) { return state.taskOk[entry.id] === true; });
      var completion = query(root, '[data-ge-completion]');
      if (completion) completion.classList.toggle('is-visible', complete);
      return complete;
    }

    function checkStep(step) {
      if (!step) return false;
      var taskId = step.getAttribute('data-task-id');
      var task = byId[taskId];
      var ok = evaluateTaskResponse(task, collectResponse(step, task));
      state.taskOk[taskId] = ok;
      var feedback = task.feedback || {};
      setFeedback(
        root,
        taskId,
        ok ? 'good' : 'warn',
        ok ? feedback.matchTitle : feedback.retryTitle,
        ok ? feedback.matchText : feedback.retryText
      );
      updateCompletion();
      return ok;
    }

    root.addEventListener('click', function (event) {
      var choice = event.target.closest('[data-ge-structured-choice]');
      if (choice && root.contains(choice)) {
        var choiceStep = choice.closest('[data-task-id]');
        setPressed(queryAll(choiceStep, '[data-ge-structured-choice]'), choice);
        state.taskOk[choiceStep.getAttribute('data-task-id')] = false;
        updateCompletion();
        return;
      }

      var taskCheck = event.target.closest('[data-ge-check-task]');
      if (taskCheck && root.contains(taskCheck)) {
        checkStep(taskCheck.closest('[data-task-id]'));
        return;
      }

      if (event.target.closest('[data-ge-check-all]')) {
        queryAll(root, '[data-task-id]').forEach(checkStep);
      }
    });

    root.addEventListener('input', function (event) {
      var step = event.target.closest ? event.target.closest('[data-task-id]') : null;
      if (!step || !root.contains(step)) return;
      state.taskOk[step.getAttribute('data-task-id')] = false;
      updateCompletion();
    });

    initTheme(root);

    return {
      variant: CALCULATION_VARIANT,
      state: state,
      checkStep: checkStep,
      evaluateTaskResponse: evaluateTaskResponse
    };
  }

  function initAdvisoryShortCheckWorkbench(root, data) {
    var entries = choiceTasks(data);
    var byId = {};
    var state = { taskOk: {} };
    entries.forEach(function (task) {
      byId[task.id] = task;
      state.taskOk[task.id] = false;
    });

    function selectedAnswer(step) {
      var selected = query(step, '[data-ge-choice-option][aria-pressed="true"]');
      return selected ? selected.getAttribute('data-option-id') : '';
    }

    function updateCompletion() {
      var complete = entries.every(function (task) { return state.taskOk[task.id] === true; });
      var completion = query(root, '[data-ge-completion]');
      if (completion) completion.classList.toggle('is-visible', complete);
      return complete;
    }

    function checkStep(step) {
      if (!step) return false;
      var taskId = step.getAttribute('data-task-id');
      var task = byId[taskId];
      var ok = evaluateTaskResponse(task, selectedAnswer(step));
      state.taskOk[taskId] = ok;
      var feedback = task.feedback || {};
      setFeedback(
        root,
        taskId,
        ok ? 'good' : 'warn',
        ok ? feedback.matchTitle : feedback.retryTitle,
        ok ? feedback.matchText : feedback.retryText
      );
      updateCompletion();
      return ok;
    }

    root.addEventListener('click', function (event) {
      var choice = event.target.closest('[data-ge-choice-option]');
      if (choice && root.contains(choice)) {
        var choiceStep = choice.closest('[data-task-id]');
        setPressed(queryAll(choiceStep, '[data-ge-choice-option]'), choice);
        state.taskOk[choiceStep.getAttribute('data-task-id')] = false;
        updateCompletion();
        return;
      }

      var taskCheck = event.target.closest('[data-ge-check-task]');
      if (taskCheck && root.contains(taskCheck)) {
        checkStep(taskCheck.closest('[data-task-id]'));
        return;
      }

      if (event.target.closest('[data-ge-check-all]')) {
        queryAll(root, '[data-task-id]').forEach(checkStep);
      }
    });

    initTheme(root);

    return {
      variant: ADVISORY_SHORT_CHECK_VARIANT,
      state: state,
      checkStep: checkStep,
      evaluateTaskResponse: evaluateTaskResponse
    };
  }

  function initGraphAdvisoryWorkbench(root, data) {
    var graphEntry = findTask(data, 'graph_construction_substitute');
    var readEntry = findTask(data, 'graph_reading');
    var routeEntry = findTask(data, 'table_value_selection');
    var graphTask = graphEntry.taskShell;
    var readTask = readEntry.taskShell;
    var routeTask = routeEntry.taskShell;
    var graphSpec = Graph.buildGraphSpec(data);
    var state = {
      selectedAxisOption: null,
      axis: { x: null, y: null },
      points: [],
      connectLine: false,
      graphOk: false,
      readInterval: null,
      readOk: false,
      routeChoice: null,
      routeOk: false
    };

    function axisIsCorrect() {
      return state.axis.x === 'Q' && state.axis.y === 'P';
    }

    function redrawGraph() {
      var xOption = axisOptionByValue(graphTask, state.axis.x);
      var yOption = axisOptionByValue(graphTask, state.axis.y);
      var wrap = query(root, '[data-ge-graph-wrap]');
      if (!wrap) return;
      wrap.innerHTML = Graph.renderSvgString(graphSpec, {
        axesVisible: Boolean(state.axis.x && state.axis.y),
        xLabel: xOption ? xOption.label : graphSpec.x_axis.label,
        yLabel: yOption ? yOption.label : graphSpec.y_axis.label,
        points: state.points,
        lineVisible: state.connectLine
      });
      var help = query(root, '[data-ge-graph-help]');
      if (help) {
        help.textContent = state.axis.x && state.axis.y
          ? 'Geplaatste punten: ' + state.points.length + '/2. Klik ongeveer bij een tabelpunt; het punt springt naar de dichtstbijzijnde bronwaarde. Na punt 2 verschijnt de lijn vanzelf.'
          : 'Kies eerst de assen. Daarna klik je twee verschillende tabelpunten in het raster.';
      }
    }

    root.__goldenTicketRedrawGraph = redrawGraph;

    function hideCompletion() {
      var completion = query(root, '[data-ge-completion]');
      if (completion) completion.classList.remove('is-visible');
    }

    function resetAfterGraphChange() {
      state.graphOk = false;
      state.readOk = false;
      setLocked(root, 'reading', true);
      hideCompletion();
    }

    function renderSlots() {
      queryAll(root, '[data-ge-axis-slot]').forEach(function (slot) {
        var axis = slot.getAttribute('data-ge-axis-slot');
        var option = axisOptionByValue(graphTask, state.axis[axis]);
        var label = slot.querySelector('span');
        if (label) label.textContent = option ? option.label : 'Nog leeg';
      });
    }

    function selectedTablePointCount() {
      var accepted = new Set((graphTask.expected.acceptedTablePoints || []).map(pointKey));
      var selected = new Set();
      state.points.forEach(function (point) {
        if (accepted.has(pointKey(point))) selected.add(pointKey(point));
      });
      return selected.size;
    }

    function plottedLineIsDecreasing() {
      if (state.points.length < 2) return false;
      var a = state.points[0];
      var b = state.points[1];
      if (Number(a.x) === Number(b.x)) return false;
      return ((Number(b.y) - Number(a.y)) / (Number(b.x) - Number(a.x))) < 0;
    }

    function checkGraph() {
      var errors = [];
      if (!axisIsCorrect()) errors.push('Kies Q op de horizontale as en P op de verticale as.');
      if (state.points.length < 2) errors.push('Plaats twee verschillende tabelpunten in het werkvlak.');
      if (axisIsCorrect() && selectedTablePointCount() < 2) errors.push('Gebruik twee verschillende bronwaarden uit de tabel.');
      if (state.points.length >= 2 && (!state.connectLine || !plottedLineIsDecreasing())) {
        errors.push('Controleer of beide punten uit de bron komen; de lijn wordt na het tweede punt automatisch getekend.');
      }
      if (errors.length) {
        state.graphOk = false;
        state.readOk = false;
        setLocked(root, 'reading', true);
        hideCompletion();
        setFeedback(root, 'graph', 'warn', 'Controleer het P-Q-diagram', errors.join(' '));
        return false;
      }
      state.graphOk = true;
      setLocked(root, 'reading', false);
      setFeedback(root, 'graph', 'good', graphTask.feedback.matchTitle, graphTask.feedback.matchText);
      updateCompletion();
      return true;
    }

    function selectPill(group, optionId) {
      var attrName = '[data-ge-pill-group="' + group + '"]';
      var buttons = queryAll(root, attrName);
      var target = buttons.find(function (button) { return button.getAttribute('data-option-id') === optionId; });
      setPressed(buttons, target);
      if (group === 'read-interval') {
        state.readInterval = optionId;
        state.readOk = false;
        hideCompletion();
      }
    }

    function checkReading() {
      if (!state.graphOk) return false;
      var expected = readTask.expected || {};
      var q = parseNumber(query(root, '[data-ge-read-q]').value);
      var intervalOk = state.readInterval === ((expected.interval || {}).value || '');
      var qOk = Math.abs(q - Number(expected.value)) <= Number(expected.tolerance || 0);
      if (intervalOk && qOk) {
        state.readOk = true;
        setFeedback(root, 'reading', 'good', readTask.feedback.matchTitle, readTask.feedback.matchText);
        updateCompletion();
        return true;
      }
      state.readOk = false;
      hideCompletion();
      setFeedback(root, 'reading', 'warn', readTask.feedback.retryTitle, readTask.feedback.retryText);
      return false;
    }

    function setRouteFeedback(tone, title, text, route) {
      var el = query(root, '[data-ge-feedback="route-choice"]');
      if (!el) return;
      el.className = 'ge-feedback';
      if (!tone) {
        el.innerHTML = '';
        return;
      }
      el.classList.add('is-visible', tone === 'good' ? 'is-good' : tone === 'bad' ? 'is-bad' : 'is-warn');
      el.innerHTML = '<strong>' + escapeHtml(title) + '</strong><p>' + escapeHtml(text) + '</p>' +
        (route && route.href && route.label
          ? '<p class="ge-choice-route"><span>Oefentip</span><a href="' + attr(route.href) + '">' + escapeHtml(route.label) + '</a></p>'
          : '');
      if (el.focus) el.focus({ preventScroll: true });
    }

    function checkRouteChoice() {
      var ok = evaluateTaskResponse(routeTask, state.routeChoice);
      state.routeOk = ok;
      var feedback = routeTask.feedback || {};
      var optionFeedback = ok && routeTask.feedbackByOption ? routeTask.feedbackByOption[state.routeChoice] : null;
      setRouteFeedback(
        ok ? 'good' : 'warn',
        ok ? (optionFeedback && optionFeedback.title ? optionFeedback.title : feedback.matchTitle) : feedback.retryTitle,
        ok ? (optionFeedback && optionFeedback.text ? optionFeedback.text : feedback.matchText) : feedback.retryText,
        optionFeedback && optionFeedback.route
      );
      updateCompletion();
      return ok;
    }

    function updateCompletion() {
      var completion = query(root, '[data-ge-completion]');
      if (completion) {
        completion.classList.toggle('is-visible', state.graphOk && state.readOk);
      }
    }

    root.addEventListener('click', function (event) {
      var axisOption = event.target.closest('[data-ge-axis-option]');
      if (axisOption && root.contains(axisOption)) {
        state.selectedAxisOption = axisOption.getAttribute('data-axis-value');
        setPressed(queryAll(root, '[data-ge-axis-option]'), axisOption);
        return;
      }
      var axisSlot = event.target.closest('[data-ge-axis-slot]');
      if (axisSlot && root.contains(axisSlot)) {
        if (!state.selectedAxisOption) return;
        var axis = axisSlot.getAttribute('data-ge-axis-slot');
        state.axis[axis] = state.selectedAxisOption;
        if (axis === 'x' && state.axis.y === state.selectedAxisOption) state.axis.y = null;
        if (axis === 'y' && state.axis.x === state.selectedAxisOption) state.axis.x = null;
        state.points = [];
        state.connectLine = false;
        resetAfterGraphChange();
        renderSlots();
        redrawGraph();
        return;
      }
      var pill = event.target.closest('[data-ge-pill-group]');
      if (pill && root.contains(pill)) {
        selectPill(pill.getAttribute('data-ge-pill-group'), pill.getAttribute('data-option-id'));
        return;
      }
      var routeChoice = event.target.closest('[data-ge-route-choice-option]');
      if (routeChoice && root.contains(routeChoice)) {
        var choiceStep = routeChoice.closest('[data-task-id]');
        setPressed(queryAll(choiceStep, '[data-ge-route-choice-option]'), routeChoice);
        state.routeChoice = routeChoice.getAttribute('data-option-id');
        state.routeOk = false;
        updateCompletion();
        return;
      }
      if (event.target.closest('[data-ge-clear-graph]')) {
        state.points = [];
        state.connectLine = false;
        resetAfterGraphChange();
        setFeedback(root, 'graph', null);
        redrawGraph();
        return;
      }
      if (event.target.closest('[data-ge-check-graph]')) {
        checkGraph();
        return;
      }
      if (event.target.closest('[data-ge-check-reading]')) {
        checkReading();
        return;
      }
      if (event.target.closest('[data-ge-check-route-choice]')) {
        checkRouteChoice();
        return;
      }
      if (event.target.closest('[data-ge-check-all]')) {
        var graphPass = state.graphOk || checkGraph();
        if (graphPass) checkReading();
      }
    });

    root.addEventListener('click', function (event) {
      var svg = event.target.closest('svg.ge-graph');
      if (!svg || !root.contains(svg)) return;
      if (!state.axis.x || !state.axis.y) return;
      var rect = svg.getBoundingClientRect();
      var scaleX = Graph.VIEW_BOX.width / rect.width;
      var scaleY = Graph.VIEW_BOX.height / rect.height;
      var rawX = (event.clientX - rect.left) * scaleX;
      var rawY = (event.clientY - rect.top) * scaleY;
      if (rawX < Graph.PLOT.x || rawX > Graph.PLOT.x + Graph.PLOT.width || rawY < Graph.PLOT.y || rawY > Graph.PLOT.y + Graph.PLOT.height) {
        return;
      }
      var clamped = Graph.clampPlotPoint(rawX, rawY);
      var snapped = Graph.nearestSourcePoint(graphSpec, clamped.x, clamped.y, graphSpec.snap_tolerance_px);
      if (state.points.length < 2) {
        state.points.push(snapped);
      } else {
        var replaceIndex = Graph.nearestRenderedPointIndex(graphSpec, state.points, clamped.x, clamped.y);
        state.points[replaceIndex >= 0 ? replaceIndex : 1] = snapped;
      }
      state.connectLine = state.points.length >= 2;
      resetAfterGraphChange();
      redrawGraph();
    });

    root.addEventListener('input', function (event) {
      if (!event.target.closest || !event.target.closest('[data-ge-read-q]')) return;
      state.readOk = false;
      hideCompletion();
    });

    setLocked(root, 'reading', true);
    redrawGraph();
    initTheme(root);

    return {
      variant: GRAPH_ADVISORY_VARIANT,
      state: state,
      checkGraph: checkGraph,
      checkReading: checkReading,
      checkRouteChoice: checkRouteChoice,
      redrawGraph: redrawGraph
    };
  }

  function init(root, explicitData) {
    if (!root) return null;
    var data = explicitData || (typeof window !== 'undefined' ? window.EXIT_TICKET_DATA : null);
    if (!data) return null;
    var variant = assertSupportedGoldenExerciseVariant(data);
    if (variant === CALCULATION_VARIANT) return initCalculationWorkbench(root, data);
    if (variant === ADVISORY_SHORT_CHECK_VARIANT) return initAdvisoryShortCheckWorkbench(root, data);
    if (variant === GRAPH_ADVISORY_VARIANT) return initGraphAdvisoryWorkbench(root, data);
    var graphEntry = findTask(data, 'graph_construction_substitute');
    var readEntry = findTask(data, 'graph_reading');
    var claimEntry = findTask(data, 'calculation_work_capture');
    var graphTask = graphEntry.taskShell;
    var readTask = readEntry.taskShell;
    var claimTask = claimEntry.taskShell;
    var graphSpec = Graph.buildGraphSpec(data);
    var expectedClaimFormula = (((claimTask.expected || {}).formula || {}).tokens || []).slice();
    var state = {
      selectedAxisOption: null,
      axis: { x: null, y: null },
      points: [],
      connectLine: false,
      graphOk: false,
      readInterval: null,
      readOk: false,
      claimInterval: null,
      claimConclusion: null,
      formula: [],
      claimOk: false
    };

    function axisIsCorrect() {
      return state.axis.x === 'Q' && state.axis.y === 'P';
    }

    function redrawGraph() {
      var xOption = axisOptionByValue(graphTask, state.axis.x);
      var yOption = axisOptionByValue(graphTask, state.axis.y);
      var wrap = query(root, '[data-ge-graph-wrap]');
      if (!wrap) return;
      wrap.innerHTML = Graph.renderSvgString(graphSpec, {
        axesVisible: Boolean(state.axis.x && state.axis.y),
        xLabel: xOption ? xOption.label : graphSpec.x_axis.label,
        yLabel: yOption ? yOption.label : graphSpec.y_axis.label,
        points: state.points,
        lineVisible: state.connectLine
      });
      var help = query(root, '[data-ge-graph-help]');
      if (help) {
        help.textContent = state.axis.x && state.axis.y
          ? 'Geplaatste punten: ' + state.points.length + '/2. Klik ongeveer bij een tabelpunt; het punt springt naar de dichtstbijzijnde bronwaarde. Na punt 2 verschijnt de lijn vanzelf.'
          : 'Kies eerst de assen. Daarna klik je twee verschillende tabelpunten in het raster.';
      }
    }

    root.__goldenTicketRedrawGraph = redrawGraph;

    function resetAfterGraphChange() {
      state.graphOk = false;
      state.readOk = false;
      state.claimOk = false;
      setLocked(root, 'reading', true);
      setLocked(root, 'claim', true);
      query(root, '[data-ge-completion]').classList.remove('is-visible');
    }

    function renderSlots() {
      queryAll(root, '[data-ge-axis-slot]').forEach(function (slot) {
        var axis = slot.getAttribute('data-ge-axis-slot');
        var option = axisOptionByValue(graphTask, state.axis[axis]);
        var label = slot.querySelector('span');
        if (label) label.textContent = option ? option.label : 'Nog leeg';
      });
    }

    function selectedTablePointCount() {
      var accepted = new Set((graphTask.expected.acceptedTablePoints || []).map(pointKey));
      var selected = new Set();
      state.points.forEach(function (point) {
        if (accepted.has(pointKey(point))) selected.add(pointKey(point));
      });
      return selected.size;
    }

    function plottedLineIsDecreasing() {
      if (state.points.length < 2) return false;
      var a = state.points[0];
      var b = state.points[1];
      if (Number(a.x) === Number(b.x)) return false;
      return ((Number(b.y) - Number(a.y)) / (Number(b.x) - Number(a.x))) < 0;
    }

    function checkGraph() {
      var errors = [];
      if (!axisIsCorrect()) errors.push('Kies Q op de horizontale as en P op de verticale as.');
      if (state.points.length < 2) errors.push('Plaats twee verschillende tabelpunten in het werkvlak.');
      if (axisIsCorrect() && selectedTablePointCount() < 2) errors.push('Gebruik twee verschillende bronwaarden uit de tabel.');
      if (state.points.length >= 2 && (!state.connectLine || !plottedLineIsDecreasing())) {
        errors.push('Controleer of beide punten uit de bron komen; de lijn wordt na het tweede punt automatisch getekend.');
      }
      if (errors.length) {
        state.graphOk = false;
        resetAfterGraphChange();
        setFeedback(root, 'graph', 'warn', 'Controleer het P-Q-diagram', errors.join(' '));
        return false;
      }
      state.graphOk = true;
      setLocked(root, 'reading', false);
      setFeedback(root, 'graph', 'good', graphTask.feedback.matchTitle, graphTask.feedback.matchText);
      updateCompletion();
      return true;
    }

    function selectPill(group, optionId) {
      var attrName = '[data-ge-pill-group="' + group + '"]';
      var buttons = queryAll(root, attrName);
      var target = buttons.find(function (button) { return button.getAttribute('data-option-id') === optionId; });
      setPressed(buttons, target);
      if (group === 'read-interval') state.readInterval = optionId;
      if (group === 'claim-interval') state.claimInterval = optionId;
      if (group === 'claim-conclusion') state.claimConclusion = optionId;
    }

    function checkReading() {
      if (!state.graphOk) return false;
      var expected = readTask.expected || {};
      var q = parseNumber(query(root, '[data-ge-read-q]').value);
      var intervalOk = state.readInterval === ((expected.interval || {}).value || '');
      var qOk = Math.abs(q - Number(expected.value)) <= Number(expected.tolerance || 0);
      if (intervalOk && qOk) {
        state.readOk = true;
        setLocked(root, 'claim', false);
        setFeedback(root, 'reading', 'good', readTask.feedback.matchTitle, readTask.feedback.matchText);
        updateCompletion();
        return true;
      }
      state.readOk = false;
      setFeedback(root, 'reading', 'warn', readTask.feedback.retryTitle, readTask.feedback.retryText);
      return false;
    }

    function renderChosenTokens() {
      var box = query(root, '[data-ge-chosen-tokens]');
      if (!box) return;
      var tokens = ((claimTask.interaction || {}).formula || {}).tokens || [];
      box.innerHTML = state.formula.map(function (id, index) {
        var token = tokens.find(function (item) { return item.id === id; });
        return '<button type="button" class="ge-token" data-ge-remove-token-index="' + index + '">' +
          escapeHtml(token ? token.label : id) +
        '</button>';
      }).join('');
    }

    function formulaOk() {
      return expectedClaimFormula.length === state.formula.length &&
        expectedClaimFormula.every(function (id, index) { return state.formula[index] === id; });
    }

    function checkClaim() {
      if (!state.readOk) return false;
      var expected = claimTask.expected || {};
      var oldQ = parseNumber(query(root, '[data-ge-old-q]').value);
      var newQ = parseNumber(query(root, '[data-ge-new-q]').value);
      var percent = parsePercent(query(root, '[data-ge-percent]').value);
      var expectedPercent = (expected.finalAnswer || {}).value;
      var tolerance = (expected.finalAnswer || {}).tolerance || 0;
      var ok = [
        state.claimInterval === ((expected.interval || {}).value || ''),
        Math.abs(oldQ - Number((expected.oldValue || {}).value)) <= Number((expected.oldValue || {}).tolerance || 0),
        Math.abs(newQ - Number((expected.newValue || {}).value)) <= Number((expected.newValue || {}).tolerance || 0),
        formulaOk(),
        Math.abs(percent - Number(expectedPercent)) <= Number(tolerance),
        state.claimConclusion === ((expected.conclusion || {}).value || '')
      ].every(Boolean);
      if (ok) {
        state.claimOk = true;
        setFeedback(root, 'claim', 'good', claimTask.feedback.matchTitle, claimTask.feedback.matchText);
        updateCompletion();
        return true;
      }
      state.claimOk = false;
      setFeedback(root, 'claim', 'warn', claimTask.feedback.retryTitle, claimTask.feedback.retryText);
      return false;
    }

    function updateCompletion() {
      var completion = query(root, '[data-ge-completion]');
      if (completion) {
        completion.classList.toggle('is-visible', state.graphOk && state.readOk && state.claimOk);
      }
    }

    root.addEventListener('click', function (event) {
      var axisOption = event.target.closest('[data-ge-axis-option]');
      if (axisOption && root.contains(axisOption)) {
        state.selectedAxisOption = axisOption.getAttribute('data-axis-value');
        setPressed(queryAll(root, '[data-ge-axis-option]'), axisOption);
        return;
      }
      var axisSlot = event.target.closest('[data-ge-axis-slot]');
      if (axisSlot && root.contains(axisSlot)) {
        if (!state.selectedAxisOption) return;
        var axis = axisSlot.getAttribute('data-ge-axis-slot');
        state.axis[axis] = state.selectedAxisOption;
        if (axis === 'x' && state.axis.y === state.selectedAxisOption) state.axis.y = null;
        if (axis === 'y' && state.axis.x === state.selectedAxisOption) state.axis.x = null;
        state.points = [];
        state.connectLine = false;
        resetAfterGraphChange();
        renderSlots();
        redrawGraph();
        return;
      }
      var pill = event.target.closest('[data-ge-pill-group]');
      if (pill && root.contains(pill)) {
        selectPill(pill.getAttribute('data-ge-pill-group'), pill.getAttribute('data-option-id'));
        return;
      }
      var token = event.target.closest('[data-ge-token-id]');
      if (token && root.contains(token)) {
        state.formula.push(token.getAttribute('data-ge-token-id'));
        renderChosenTokens();
        return;
      }
      var removeToken = event.target.closest('[data-ge-remove-token-index]');
      if (removeToken && root.contains(removeToken)) {
        var index = Number(removeToken.getAttribute('data-ge-remove-token-index'));
        state.formula.splice(index, 1);
        renderChosenTokens();
        return;
      }
      if (event.target.closest('[data-ge-clear-graph]')) {
        state.points = [];
        state.connectLine = false;
        resetAfterGraphChange();
        setFeedback(root, 'graph', null);
        redrawGraph();
        return;
      }
      if (event.target.closest('[data-ge-check-graph]')) {
        checkGraph();
        return;
      }
      if (event.target.closest('[data-ge-check-reading]')) {
        checkReading();
        return;
      }
      if (event.target.closest('[data-ge-undo-token]')) {
        state.formula.pop();
        renderChosenTokens();
        return;
      }
      if (event.target.closest('[data-ge-clear-formula]')) {
        state.formula = [];
        renderChosenTokens();
        return;
      }
      if (event.target.closest('[data-ge-check-claim]')) {
        checkClaim();
        return;
      }
      if (event.target.closest('[data-ge-check-all]')) {
        var graphPass = state.graphOk || checkGraph();
        var readingPass = graphPass && (state.readOk || checkReading());
        if (readingPass) checkClaim();
      }
    });

    root.addEventListener('click', function (event) {
      var svg = event.target.closest('svg.ge-graph');
      if (!svg || !root.contains(svg)) return;
      if (!state.axis.x || !state.axis.y) return;
      var rect = svg.getBoundingClientRect();
      var scaleX = Graph.VIEW_BOX.width / rect.width;
      var scaleY = Graph.VIEW_BOX.height / rect.height;
      var rawX = (event.clientX - rect.left) * scaleX;
      var rawY = (event.clientY - rect.top) * scaleY;
      if (rawX < Graph.PLOT.x || rawX > Graph.PLOT.x + Graph.PLOT.width || rawY < Graph.PLOT.y || rawY > Graph.PLOT.y + Graph.PLOT.height) {
        return;
      }
      var clamped = Graph.clampPlotPoint(rawX, rawY);
      var snapped = Graph.nearestSourcePoint(graphSpec, clamped.x, clamped.y, graphSpec.snap_tolerance_px);
      if (state.points.length < 2) {
        state.points.push(snapped);
      } else {
        var replaceIndex = Graph.nearestRenderedPointIndex(graphSpec, state.points, clamped.x, clamped.y);
        state.points[replaceIndex >= 0 ? replaceIndex : 1] = snapped;
      }
      state.connectLine = state.points.length >= 2;
      resetAfterGraphChange();
      redrawGraph();
    });

    setLocked(root, 'reading', true);
    setLocked(root, 'claim', true);
    redrawGraph();
    initTheme(root);

    return {
      state: state,
      checkGraph: checkGraph,
      checkReading: checkReading,
      checkClaim: checkClaim,
      redrawGraph: redrawGraph
    };
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      var root = document.querySelector('[data-golden-ticket-root]');
      if (root) init(root);
    });
  }

  return {
    ADVISORY_SHORT_CHECK_VARIANT: ADVISORY_SHORT_CHECK_VARIANT,
    CALCULATION_VARIANT: CALCULATION_VARIANT,
    GRAPH_ADVISORY_VARIANT: GRAPH_ADVISORY_VARIANT,
    GRAPH_VARIANT: GRAPH_VARIANT,
    SUPPORTED_VARIANT: SUPPORTED_VARIANT,
    SUPPORTED_VARIANTS: SUPPORTED_VARIANTS.slice(),
    assertSupportedGoldenExerciseVariant: assertSupportedGoldenExerciseVariant,
    evaluateTaskResponse: evaluateTaskResponse,
    findTask: findTask,
    isGoldenExerciseWorkbench: isGoldenExerciseWorkbench,
    needsGraphRuntimeForVariant: needsGraphRuntimeForVariant,
    renderMain: renderMain,
    rendererAssetsForVariant: rendererAssetsForVariant,
    supportGaps: supportGaps,
    supportGapsByVariant: supportGapsByVariant,
    supportedVariantFor: supportedVariantFor,
    init: init,
    parseNumber: parseNumber,
    parsePercent: parsePercent
  };
});
