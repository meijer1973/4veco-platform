// Shared Task Shell Engine - pure task validation and local feedback logic.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.TaskShellEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FAMILIES = {
    choice: { label: 'Keuzevraag', deterministic: true },
    numeric_input: { label: 'Rekenantwoord', deterministic: true },
    calculation_work_capture: { label: 'Berekening tonen', deterministic: false },
    calculation_answer_form_capture: { label: 'Bereken-antwoordvorm', deterministic: true },
    final_answer_entry: { label: 'Eindantwoord', deterministic: true },
    unit_notation_field: { label: 'Eenheid/notatie', deterministic: true },
    short_constructed_response: { label: 'Kort antwoord', deterministic: false },
    structured_short_response: { label: 'Kort antwoord in stappen', deterministic: true },
    cloze_text: { label: 'Invultekst', deterministic: true },
    multi_select: { label: 'Meerdere keuzes', deterministic: true },
    cloze_tile_select: { label: 'Invullen met tegels', deterministic: true },
    sentence_builder: { label: 'Zin bouwen', deterministic: true },
    formula_builder: { label: 'Formule bouwen', deterministic: true },
    step_ordering: { label: 'Stappen ordenen', deterministic: true },
    matching_pairs: { label: 'Koppels maken', deterministic: true },
    two_tier_choice: { label: 'Antwoord en reden kiezen', deterministic: true },
    assertion_reason: { label: 'Stelling en reden beoordelen', deterministic: true },
    source_value_selection: { label: 'Bronwaarden kiezen', deterministic: true },
    source_chain_builder: { label: 'Bronketen bouwen', deterministic: true },
    label_placement: { label: 'Labels plaatsen', deterministic: true },
    table_value_selection: { label: 'Tabelwaarde kiezen', deterministic: true },
    graph_reading: { label: 'Grafiek aflezen', deterministic: true },
    point_placement: { label: 'Punt plaatsen', deterministic: true },
    graph_construction_substitute: { label: 'Grafiek construeren', deterministic: true },
    structured_reasoning: { label: 'Gestructureerde redenering', deterministic: false }
  };

  var CONTEXT_BLOCK_TYPES = {
    markdown: true,
    source_excerpt: true,
    table: true,
    svg_figure: true,
    graph: true,
    flowchart: true,
    formula: true,
    info_box: true
  };

  var CONTEXT_ID_RE = /^ctx-[a-z0-9]+(?:-[a-z0-9]+)*$/;

  var CONTEXT_REQUIRED_FIELDS = {
    markdown: ['id', 'type', 'title', 'bodyMarkdown', 'accessibilitySummary'],
    source_excerpt: ['id', 'type', 'sourceLabel', 'caption', 'bodyMarkdown', 'sourceRefs', 'accessibilitySummary'],
    table: ['id', 'type', 'sourceLabel', 'caption', 'columns', 'rows', 'altText', 'sourceMaterialId'],
    svg_figure: ['id', 'type', 'sourceLabel', 'caption', 'svg', 'viewBox', 'altText', 'sourceMaterialId', 'reconstruction'],
    graph: ['id', 'type', 'sourceLabel', 'caption', 'axes', 'series', 'altText', 'sourceMaterialId'],
    flowchart: ['id', 'type', 'sourceLabel', 'caption', 'nodes', 'edges', 'altText', 'sourceMaterialId'],
    formula: ['id', 'type', 'sourceLabel', 'caption', 'expression', 'variables', 'altText', 'sourceMaterialId'],
    info_box: ['id', 'type', 'title', 'bodyMarkdown', 'accessibilitySummary']
  };

  var CONTEXT_CAPTION_PREFIX = {
    source_excerpt: 'Bron',
    table: 'Tabel',
    svg_figure: 'Figuur',
    graph: 'Figuur',
    flowchart: 'Figuur',
    formula: 'Formule'
  };

  var ANSWER_LEAK_RE = /\b(?:juiste\s+antwoord|antwoord\s+is|uitkomst\s+is|oplossing\s+is|hint\s*:|kies\s+[^.?!]*(?:als|want)\s+[^.?!]*(?:antwoord|uitkomst))\b/i;

  var BLOCKED_STUDENT_TERMS = [
    'mastery',
    'pass',
    'fail',
    'score',
    'grade',
    'summative',
    'diagnose',
    'diagnostics',
    'diagnostic',
    'adaptive',
    'evidence',
    'toets',
    'cijfer',
    'beoordeling',
    'summatief',
    'diagnostisch',
    'adaptief',
    'beheerst',
    'bewezen',
    'aangetoond'
  ];

  var INTERNAL_CODE_RE = /\b(?:[A-Z]\d{2}|PV|MTU)\b/;

  var ANSWER_PARSERS = {
    number_with_optional_percent: parseNumberWithOptionalPercent,
    decrease_phrase_to_negative_percent: parseDecreasePhraseToNegativePercent
  };

  var DEFAULT_ANSWER_PARSER_IDS = [
    'decrease_phrase_to_negative_percent',
    'number_with_optional_percent'
  ];

  var NUMERIC_FILLER_WORDS_RE = /\b(eur|euro|euros|procent|percent|percentage|pct|punten?|broodjes?|stuks?|q|met|van|naar|daling|daalt|dalen|daalde|gedaald|afname|afneemt|afnam|afgenomen|lager|minder|vermindering|vermindert|verminderde|stijging|stijgt|stijgen|steeg|gestegen|toename|toeneemt|toenam|toegenomen|meer|hoger)\b/g;

  var DECREASE_WORD_RE = /\b(daling|daalt|dalen|daalde|gedaald|afname|afneemt|afnam|afgenomen|lager|minder|vermindering|vermindert|verminderde)\b/;

  var FORMULA_TOKEN_CATEGORIES = {
    numerator: true,
    denominator: true,
    operator: true,
    grouping: true,
    value: true,
    variable: true,
    multiplier: true,
    notation: true
  };

  var SOURCE_CHAIN_NODE_ROLES = {
    source: true,
    value: true,
    operation: true,
    answer: true,
    conclusion: true
  };

  var LABEL_TARGET_ROLES = {
    axis: true,
    line: true,
    intersection: true,
    region: true,
    unit: true,
    index_label: true,
    curve_shift: true,
    formula_part: true,
    table_cell: true,
    structure_part: true
  };

  var BOUNDARY_FLAGS = {
    diagnostics: false,
    adaptiveRouting: false,
    masteryDecisions: false,
    automaticSequencing: false,
    studentFacingAI: false,
    summativeUse: false,
    pvProjection: false,
    pvMachinePromotion: false,
    studentProductUse: false,
    targetEquivalentProof: false
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function isObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  function requireString(value, path) {
    assert(typeof value === 'string' && value.trim().length > 0, path + ' must be a non-empty string');
  }

  function optionalString(value, path) {
    if (value != null) requireString(value, path);
  }

  function optionalSeparator(value, path) {
    if (value != null) assert(typeof value === 'string' && value.length > 0, path + ' must be a string separator');
  }

  function requireArray(value, path, minLength) {
    assert(Array.isArray(value) && value.length >= minLength, path + ' must contain at least ' + minLength + ' item(s)');
  }

  function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
  }

  function cleanNumber(value) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      return parseNumberWithAnswerParsers(value);
    }
    return NaN;
  }

  function normalizeNumberInput(value) {
    return String(value == null ? '' : value)
      .trim()
      .toLowerCase()
      .replace(/[\u2212\u2012\u2013\u2014]/g, '-')
      .replace(',', '.');
  }

  function parseNormalizedNumber(value, negativeByPhrase) {
    if (!value) return NaN;
    var cleaned = value
      .replace(/[\u20ac%]/g, ' ')
      .replace(NUMERIC_FILLER_WORDS_RE, ' ')
      .replace(/\s+/g, '');
    if (!/^[-+]?\d+(\.\d+)?$/.test(cleaned)) return NaN;
    var parsed = Number(cleaned);
    if (!isNumber(parsed)) return NaN;
    return negativeByPhrase ? -Math.abs(parsed) : parsed;
  }

  function parseNumberWithOptionalPercent(value) {
    return parseNormalizedNumber(normalizeNumberInput(value), false);
  }

  function parseDecreasePhraseToNegativePercent(value) {
    var normalized = normalizeNumberInput(value);
    var negativeByPhrase = !/^\s*-/.test(normalized) && DECREASE_WORD_RE.test(normalized);
    return parseNormalizedNumber(normalized, negativeByPhrase);
  }

  function parseNumberWithAnswerParsers(value, parserIds) {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return NaN;
    var ids = Array.isArray(parserIds) && parserIds.length ? parserIds : DEFAULT_ANSWER_PARSER_IDS;
    for (var i = 0; i < ids.length; i += 1) {
      var parser = ANSWER_PARSERS[ids[i]];
      if (!parser) continue;
      var parsed = parser(value);
      if (isNumber(parsed)) return parsed;
    }
    return NaN;
  }

  function normalizeText(value) {
    return String(value == null ? '' : value).trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function containsBlockedTerm(text, term) {
    var pattern = new RegExp('(^|[^a-z0-9])' + escapeRegExp(term.toLowerCase()) + '([^a-z0-9]|$)');
    return pattern.test(text.toLowerCase());
  }

  function hasValue(value) {
    if (value == null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (isObject(value)) return Object.keys(value).some(function (key) { return hasValue(value[key]); });
    return true;
  }

  function requireStringArray(value, path, minLength) {
    requireArray(value, path, minLength || 1);
    value.forEach(function (item, idx) {
      requireString(item, path + '[' + idx + ']');
    });
  }

  function validateAnswerParsers(value, path) {
    requireStringArray(value, path, 1);
    value.forEach(function (item, idx) {
      assert(ANSWER_PARSERS[item], path + '[' + idx + '] must be a known answer parser');
    });
  }

  function tolerance(expected) {
    return isNumber(expected.tolerance) ? Math.max(0, expected.tolerance) : 0;
  }

  function collectStudentText(task) {
    var out = [];
    function push(value) {
      if (value == null) return;
      if (Array.isArray(value)) {
        value.forEach(push);
        return;
      }
      if (isObject(value)) return;
      var str = String(value).trim();
      if (str) out.push(str);
    }

    push(task.title);
    push(task.skillLabel);
    push(task.familyLabel);
    push(task.purpose);
    push(task.prompt);
    if (task.interaction) {
      push(task.interaction.inputLabel);
      push(task.interaction.workLabel);
      push(task.interaction.finalAnswerLabel);
      push(task.interaction.unitNotationLabel);
      push(task.interaction.unitLabel);
      push(task.interaction.xLabel);
      push(task.interaction.yLabel);
      push(task.interaction.placeholder);
      push(task.interaction.unitNotationPlaceholder);
      push(task.interaction.stepBankLabel);
      push(task.interaction.sequenceLabel);
      push(task.interaction.valueBankLabel);
      push(task.interaction.roleLabel);
      push(task.interaction.nodeBankLabel);
      push(task.interaction.labelBankLabel);
      push(task.interaction.targetRegionLabel);
      push(task.interaction.placementLabel);
      push(task.interaction.leftBankLabel);
      push(task.interaction.rightBankLabel);
      push(task.interaction.pairLabel);
      push(task.interaction.answerLabel);
      push(task.interaction.reasonLabel);
      push(task.interaction.assertionLabel);
      push(task.interaction.assertionText);
      push(task.interaction.reasonText);
      push(task.interaction.optionLabel);
      push(task.interaction.workspaceTitle);
      push(task.interaction.xAxisLabel);
      push(task.interaction.yAxisLabel);
      push(task.interaction.pointRowsLabel);
      push(task.interaction.lineConfirmationLabel);
      push(task.interaction.lineShapeLabel);
      push(task.interaction.xInputLabel);
      push(task.interaction.yInputLabel);
      if (task.interaction.formula) {
        push(task.interaction.formula.title);
        push(task.interaction.formula.purpose);
        push(task.interaction.formula.placeholder);
        push(task.interaction.formula.tokenBankLabel);
        push(task.interaction.formula.sequenceLabel);
        (task.interaction.formula.tokens || []).forEach(function (token) {
          push(token.label);
          push(token.description);
          push(token.usageHint);
        });
      }
      if (task.interaction.substitution) {
        push(task.interaction.substitution.title);
        push(task.interaction.substitution.purpose);
        push(task.interaction.substitution.template);
        (task.interaction.substitution.fields || []).forEach(function (field) {
          push(field.label);
          push(field.placeholder);
        });
      }
      if (task.interaction.answer) {
        push(task.interaction.answer.title);
        push(task.interaction.answer.purpose);
        push(task.interaction.answer.finalAnswerLabel);
        push(task.interaction.answer.finalAnswerPlaceholder);
        push(task.interaction.answer.unitNotationLabel);
        push(task.interaction.answer.unitNotationPlaceholder);
      }
      if (task.interaction.context) {
        push(task.interaction.context.title);
        push(task.interaction.context.purpose);
        push(task.interaction.context.label);
        push(task.interaction.context.placeholder);
      }
      if (task.interaction.visual) {
        push(task.interaction.visual.title);
        push(task.interaction.visual.description);
      }
      (task.interaction.fields || []).forEach(function (field) {
        push(field.label);
        push(field.placeholder);
      });
      (task.interaction.segments || []).forEach(function (segment) {
        push(segment.text);
      });
      (task.interaction.blanks || []).forEach(function (blank) {
        push(blank.label);
        push(blank.placeholder);
      });
      (task.interaction.tiles || []).forEach(function (tile) {
        push(tile.label);
        push(tile.description);
      });
      (task.interaction.tokens || []).forEach(function (token) {
        push(token.label);
        push(token.description);
      });
      (task.interaction.steps || []).forEach(function (step) {
        push(step.label);
        push(step.description);
      });
      (task.interaction.values || []).forEach(function (value) {
        push(value.label);
        push(value.description);
        push(value.sourceLabel);
        push(value.unit);
        push(value.period);
      });
      (task.interaction.roles || []).forEach(function (role) {
        push(role.label);
        push(role.description);
      });
      (task.interaction.nodes || []).forEach(function (node) {
        push(node.label);
        push(node.description);
      });
      (task.interaction.labels || []).forEach(function (label) {
        push(label.label);
        push(label.description);
      });
      (task.interaction.targets || []).forEach(function (target) {
        push(target.label);
        push(target.description);
      });
      (task.interaction.leftItems || []).forEach(function (item) {
        push(item.label);
        push(item.description);
      });
      (task.interaction.rightItems || []).forEach(function (item) {
        push(item.label);
        push(item.description);
      });
      (task.interaction.answerOptions || []).forEach(function (option) {
        push(option.label);
        push(option.description);
      });
      (task.interaction.reasonOptions || []).forEach(function (option) {
        push(option.label);
        push(option.description);
      });
      push(task.interaction.rows);
      push(task.interaction.columns);
      (task.interaction.options || []).forEach(function (option) {
        push(option.label);
        push(option.description);
      });
      (task.interaction.criteria || []).forEach(push);
    }
    (task.hints || []).forEach(push);
    if (task.feedback) {
      push(task.feedback.matchTitle);
      push(task.feedback.matchText);
      push(task.feedback.retryTitle);
      push(task.feedback.retryText);
      push(task.feedback.selfCheckTitle);
      push(task.feedback.selfCheckText);
    }
    if (task.expected) {
      push(task.expected.criteria);
    }
    if (task.practiceRoute) push(task.practiceRoute.label);
    return out;
  }

  function collectContextText(block) {
    var out = [];
    function push(value) {
      if (value == null) return;
      if (Array.isArray(value)) {
        value.forEach(push);
        return;
      }
      if (isObject(value)) {
        Object.keys(value).forEach(function (key) {
          if (key === 'id' || key === 'sourceMaterialId' || key === 'viewBox' || key === 'sourceRefs') return;
          push(value[key]);
        });
        return;
      }
      var str = String(value).trim();
      if (str) out.push(str);
    }

    push(block.title);
    push(block.sourceLabel);
    push(block.caption);
    push(block.bodyMarkdown);
    push(block.accessibilitySummary);
    push(block.altText);
    push(block.columns);
    push(block.rows);
    push(block.axes);
    push(block.series);
    push(block.nodes);
    push(block.edges);
    push(block.expression);
    push(block.variables);
    return out;
  }

  function findTextViolations(values) {
    var violations = [];
    (values || []).forEach(function (value) {
      var lower = value.toLowerCase();
      BLOCKED_STUDENT_TERMS.forEach(function (term) {
        if (containsBlockedTerm(lower, term)) {
          violations.push({ type: 'blocked_term', term: term, text: value });
        }
      });
      if (INTERNAL_CODE_RE.test(value)) violations.push({ type: 'internal_code', text: value });
    });
    return violations;
  }

  function findStudentTextViolations(task) {
    return findTextViolations(collectStudentText(task || {}));
  }

  function findContextTextViolations(block) {
    return findTextViolations(collectContextText(block || {}));
  }

  function validateSafeSvg(svg, path) {
    requireString(svg, path);
    assert(/^\s*<svg\b/i.test(svg), path + ' must start with an svg element');
    assert(!/<script\b/i.test(svg), path + ' must not include script tags');
    assert(!/\son[a-z]+\s*=/i.test(svg), path + ' must not include inline event handlers');
    assert(!/javascript\s*:/i.test(svg), path + ' must not include javascript URLs');
  }

  function validateCaptionPrefix(block, path) {
    var prefix = CONTEXT_CAPTION_PREFIX[block.type];
    if (!prefix) return;
    requireString(block.caption, path + '.caption');
    assert(block.caption.indexOf(prefix + ' ') === 0, path + '.caption must start with "' + prefix + ' "');
  }

  function validateRequiredContextFields(block, path) {
    CONTEXT_REQUIRED_FIELDS[block.type].forEach(function (field) {
      var value = block[field];
      if (Array.isArray(value)) {
        requireArray(value, path + '.' + field, 1);
        return;
      }
      if (isObject(value)) {
        assert(Object.keys(value).length > 0, path + '.' + field + ' must be a non-empty object');
        return;
      }
      requireString(value, path + '.' + field);
    });
  }

  function validateContextTable(block, path) {
    requireStringArray(block.columns, path + '.columns', 1);
    requireArray(block.rows, path + '.rows', 1);
    block.rows.forEach(function (row, rowIndex) {
      requireArray(row, path + '.rows[' + rowIndex + ']', block.columns.length);
      assert(row.length === block.columns.length, path + '.rows[' + rowIndex + '] must match column count');
      row.forEach(function (cell, cellIndex) {
        assert(cell == null || typeof cell === 'string' || typeof cell === 'number' || typeof cell === 'boolean', path + '.rows[' + rowIndex + '][' + cellIndex + '] must be a primitive value');
      });
    });
  }

  function validateContextGraph(block, path) {
    assert(isObject(block.axes), path + '.axes must be an object');
    assert(isObject(block.axes.x), path + '.axes.x must be an object');
    assert(isObject(block.axes.y), path + '.axes.y must be an object');
    requireString(block.axes.x.label, path + '.axes.x.label');
    requireString(block.axes.y.label, path + '.axes.y.label');
    requireArray(block.series, path + '.series', 1);
    block.series.forEach(function (series, seriesIndex) {
      assert(isObject(series), path + '.series[' + seriesIndex + '] must be an object');
      requireString(series.label, path + '.series[' + seriesIndex + '].label');
      requireArray(series.points, path + '.series[' + seriesIndex + '].points', 1);
      series.points.forEach(function (point, pointIndex) {
        assert(isObject(point), path + '.series[' + seriesIndex + '].points[' + pointIndex + '] must be an object');
        assert(point.x != null, path + '.series[' + seriesIndex + '].points[' + pointIndex + '].x is required');
        assert(point.y != null, path + '.series[' + seriesIndex + '].points[' + pointIndex + '].y is required');
      });
    });
  }

  function validateContextFlowchart(block, path) {
    requireArray(block.nodes, path + '.nodes', 1);
    var nodeIds = {};
    block.nodes.forEach(function (node, idx) {
      assert(isObject(node), path + '.nodes[' + idx + '] must be an object');
      requireString(node.id, path + '.nodes[' + idx + '].id');
      requireString(node.label, path + '.nodes[' + idx + '].label');
      assert(!nodeIds[node.id], path + '.nodes has duplicate node id: ' + node.id);
      nodeIds[node.id] = true;
    });
    requireArray(block.edges, path + '.edges', 1);
    block.edges.forEach(function (edge, idx) {
      assert(isObject(edge), path + '.edges[' + idx + '] must be an object');
      requireString(edge.from, path + '.edges[' + idx + '].from');
      requireString(edge.to, path + '.edges[' + idx + '].to');
      optionalString(edge.label, path + '.edges[' + idx + '].label');
      assert(nodeIds[edge.from], path + '.edges[' + idx + '].from must match a node');
      assert(nodeIds[edge.to], path + '.edges[' + idx + '].to must match a node');
    });
  }

  function validateContextFormula(block, path) {
    requireArray(block.variables, path + '.variables', 1);
    block.variables.forEach(function (variable, idx) {
      assert(isObject(variable), path + '.variables[' + idx + '] must be an object');
      requireString(variable.symbol, path + '.variables[' + idx + '].symbol');
      requireString(variable.meaning, path + '.variables[' + idx + '].meaning');
    });
  }

  function validateSvgReconstruction(block, path) {
    assert(isObject(block.reconstruction), path + '.reconstruction must be an object');
    requireString(block.reconstruction.status, path + '.reconstruction.status');
    requireString(block.reconstruction.sourceMaterialId, path + '.reconstruction.sourceMaterialId');
    assert(block.reconstruction.sourceMaterialId === block.sourceMaterialId, path + '.reconstruction.sourceMaterialId must match sourceMaterialId');
    assert(block.reconstruction.rawCopiedImage === false, path + '.reconstruction.rawCopiedImage must be false');
    assert(block.rawCopiedImage !== true, path + '.rawCopiedImage must not be true');
    assert(!block.rawImagePath, path + '.rawImagePath is not allowed for reconstructed figures');
    validateSafeSvg(block.svg, path + '.svg');
  }

  function validateContextBlock(block, index) {
    var path = 'contextBlocks[' + index + ']';
    assert(isObject(block), path + ' must be an object');
    requireString(block.id, path + '.id');
    assert(CONTEXT_ID_RE.test(block.id), path + '.id must be a stable ctx-* id');
    requireString(block.type, path + '.type');
    assert(CONTEXT_BLOCK_TYPES[block.type], path + '.type is not supported');
    validateRequiredContextFields(block, path);
    validateCaptionPrefix(block, path);

    if (block.type === 'source_excerpt') requireStringArray(block.sourceRefs, path + '.sourceRefs', 1);
    if (block.type === 'table') validateContextTable(block, path);
    if (block.type === 'svg_figure') validateSvgReconstruction(block, path);
    if (block.type === 'graph') validateContextGraph(block, path);
    if (block.type === 'flowchart') validateContextFlowchart(block, path);
    if (block.type === 'formula') validateContextFormula(block, path);

    var violations = findContextTextViolations(block);
    assert(violations.length === 0, block.id + ' context text has blocked terms or internal codes');
    var leaked = collectContextText(block).some(function (value) { return ANSWER_LEAK_RE.test(value); });
    assert(!leaked, block.id + ' context text must not leak answer hints');
    return true;
  }

  function validateContextBlocks(blocks) {
    if (blocks === undefined) return {};
    requireArray(blocks, 'contextBlocks', 1);
    var ids = {};
    blocks.forEach(function (block, index) {
      validateContextBlock(block, index);
      assert(!ids[block.id], 'duplicate context block id: ' + block.id);
      ids[block.id] = block;
    });
    return ids;
  }

  function validateTaskContextRefs(task) {
    if (task.contextRefs === undefined) return;
    requireStringArray(task.contextRefs, task.id + '.contextRefs', 1);
    var ids = {};
    task.contextRefs.forEach(function (ref) {
      assert(CONTEXT_ID_RE.test(ref), task.id + '.contextRefs must use stable ctx-* ids');
      assert(!ids[ref], task.id + '.contextRefs contains duplicate ref: ' + ref);
      ids[ref] = true;
    });
  }

  function isSelfCheckFamily(family) {
    return FAMILIES[family] && FAMILIES[family].deterministic === false;
  }

  function isSelfCheckTask(task) {
    return task && task.expected && task.expected.kind === 'self_check';
  }

  function validatePracticeRoute(route, path) {
    assert(isObject(route), path + ' is required');
    requireString(route.label, path + '.label');
    requireString(route.href, path + '.href');
  }

  function validateFeedback(task) {
    var path = task.id + '.feedback';
    assert(isObject(task.feedback), path + ' is required');
    if (isSelfCheckTask(task)) {
      requireString(task.feedback.selfCheckTitle, path + '.selfCheckTitle');
      requireString(task.feedback.selfCheckText, path + '.selfCheckText');
      optionalString(task.feedback.retryTitle, path + '.retryTitle');
      optionalString(task.feedback.retryText, path + '.retryText');
      return;
    }
    requireString(task.feedback.matchTitle, path + '.matchTitle');
    requireString(task.feedback.matchText, path + '.matchText');
    requireString(task.feedback.retryTitle, path + '.retryTitle');
    requireString(task.feedback.retryText, path + '.retryText');
  }

  function validateOptions(options, path) {
    requireArray(options, path, 2);
    var ids = {};
    options.forEach(function (option, idx) {
      assert(isObject(option), path + '[' + idx + '] must be an object');
      requireString(option.id, path + '[' + idx + '].id');
      requireString(option.label, path + '[' + idx + '].label');
      assert(!ids[option.id], 'duplicate option id: ' + option.id);
      ids[option.id] = true;
    });
    return ids;
  }

  function optionLabelMap(options) {
    var labels = {};
    (options || []).forEach(function (option) {
      labels[option.id] = option.label;
    });
    return labels;
  }

  function validateMultiSelectInteraction(task, path) {
    requireString(task.interaction.inputLabel, path + '.inputLabel');
    var optionIds = validateOptions(task.interaction.options, path + '.options');
    return {
      optionIds: optionIds,
      optionLabels: optionLabelMap(task.interaction.options)
    };
  }

  function validateInlineSegments(interaction, path, blankIds) {
    requireArray(interaction.segments, path + '.segments', 1);
    var segmentBlankRefs = {};
    interaction.segments.forEach(function (segment, idx) {
      assert(isObject(segment), path + '.segments[' + idx + '] must be an object');
      requireString(segment.type, path + '.segments[' + idx + '].type');
      if (segment.type === 'text') {
        requireString(segment.text, path + '.segments[' + idx + '].text');
        return;
      }
      assert(segment.type === 'blank', path + '.segments[' + idx + '].type must be text or blank');
      requireString(segment.blankId, path + '.segments[' + idx + '].blankId');
      assert(blankIds[segment.blankId], path + '.segments[' + idx + '].blankId must match an interaction blank');
      segmentBlankRefs[segment.blankId] = true;
    });
    Object.keys(blankIds).forEach(function (blankId) {
      assert(segmentBlankRefs[blankId], path + '.segments must include blank ' + blankId);
    });
  }

  function validateClozeTextInteraction(task, path) {
    var interaction = task.interaction;
    requireArray(interaction.blanks, path + '.blanks', 1);
    var blankIds = {};
    interaction.blanks.forEach(function (blank, idx) {
      assert(isObject(blank), path + '.blanks[' + idx + '] must be an object');
      requireString(blank.id, path + '.blanks[' + idx + '].id');
      requireString(blank.label, path + '.blanks[' + idx + '].label');
      optionalString(blank.placeholder, path + '.blanks[' + idx + '].placeholder');
      optionalString(blank.inputMode, path + '.blanks[' + idx + '].inputMode');
      optionalString(blank.width, path + '.blanks[' + idx + '].width');
      optionalString(blank.autocomplete, path + '.blanks[' + idx + '].autocomplete');
      assert(!blankIds[blank.id], 'duplicate cloze text blank id: ' + blank.id);
      blankIds[blank.id] = true;
    });

    validateInlineSegments(interaction, path, blankIds);

    return {
      blankIds: blankIds
    };
  }

  function validateClozeInteraction(task, path) {
    var interaction = task.interaction;
    requireArray(interaction.blanks, path + '.blanks', 1);
    requireArray(interaction.tiles, path + '.tiles', 2);
    if (interaction.allowReuse !== undefined) {
      assert(typeof interaction.allowReuse === 'boolean', path + '.allowReuse must be boolean');
    }

    var blankIds = {};
    interaction.blanks.forEach(function (blank, idx) {
      assert(isObject(blank), path + '.blanks[' + idx + '] must be an object');
      requireString(blank.id, path + '.blanks[' + idx + '].id');
      requireString(blank.label, path + '.blanks[' + idx + '].label');
      optionalString(blank.placeholder, path + '.blanks[' + idx + '].placeholder');
      assert(!blankIds[blank.id], 'duplicate cloze blank id: ' + blank.id);
      blankIds[blank.id] = true;
    });

    validateInlineSegments(interaction, path, blankIds);

    var tileIds = {};
    var distractorCount = 0;
    interaction.tiles.forEach(function (tile, idx) {
      assert(isObject(tile), path + '.tiles[' + idx + '] must be an object');
      requireString(tile.id, path + '.tiles[' + idx + '].id');
      requireString(tile.label, path + '.tiles[' + idx + '].label');
      requireString(tile.kind, path + '.tiles[' + idx + '].kind');
      assert(/^(answer|distractor|neutral)$/.test(tile.kind), path + '.tiles[' + idx + '].kind must be answer, distractor, or neutral');
      optionalString(tile.description, path + '.tiles[' + idx + '].description');
      optionalString(tile.distractorFor, path + '.tiles[' + idx + '].distractorFor');
      if (tile.distractorFor !== undefined) {
        assert(blankIds[tile.distractorFor], path + '.tiles[' + idx + '].distractorFor must match an interaction blank');
      }
      assert(!tileIds[tile.id], 'duplicate cloze tile id: ' + tile.id);
      tileIds[tile.id] = true;
      if (tile.kind === 'distractor') distractorCount += 1;
    });

    if (distractorCount === 0) {
      assert(
        interaction.fixture_only_no_distractor === true && typeof interaction.fixture_only_rationale === 'string' && interaction.fixture_only_rationale.trim(),
        path + '.tiles must include at least one distractor tile'
      );
    }

    return {
      blankIds: blankIds,
      tileIds: tileIds,
      allowReuse: interaction.allowReuse === true
    };
  }

  function validateSentenceInteraction(task, path) {
    var interaction = task.interaction;
    requireArray(interaction.tokens, path + '.tokens', 2);
    if (interaction.allowReuse !== undefined) {
      assert(typeof interaction.allowReuse === 'boolean', path + '.allowReuse must be boolean');
    }
    optionalSeparator(interaction.separator, path + '.separator');
    optionalString(interaction.placeholder, path + '.placeholder');
    optionalString(interaction.tokenBankLabel, path + '.tokenBankLabel');
    optionalString(interaction.sequenceLabel, path + '.sequenceLabel');

    var tokenIds = {};
    var distractorCount = 0;
    interaction.tokens.forEach(function (token, idx) {
      assert(isObject(token), path + '.tokens[' + idx + '] must be an object');
      requireString(token.id, path + '.tokens[' + idx + '].id');
      requireString(token.label, path + '.tokens[' + idx + '].label');
      requireString(token.kind, path + '.tokens[' + idx + '].kind');
      assert(/^(answer|distractor|neutral)$/.test(token.kind), path + '.tokens[' + idx + '].kind must be answer, distractor, or neutral');
      optionalString(token.description, path + '.tokens[' + idx + '].description');
      assert(!tokenIds[token.id], 'duplicate sentence token id: ' + token.id);
      tokenIds[token.id] = true;
      if (token.kind === 'distractor') distractorCount += 1;
    });

    interaction.tokens.forEach(function (token, idx) {
      optionalString(token.distractorFor, path + '.tokens[' + idx + '].distractorFor');
      if (token.distractorFor !== undefined) {
        assert(tokenIds[token.distractorFor], path + '.tokens[' + idx + '].distractorFor must match an interaction token');
      }
    });

    if (distractorCount === 0) {
      assert(
        interaction.fixture_only_no_distractor === true && typeof interaction.fixture_only_rationale === 'string' && interaction.fixture_only_rationale.trim(),
        path + '.tokens must include at least one distractor token'
      );
    }

    return {
      tokenIds: tokenIds,
      allowReuse: interaction.allowReuse === true
    };
  }

  function validateFormulaInteraction(task, path) {
    var interaction = task.interaction;
    requireArray(interaction.tokens, path + '.tokens', 2);
    if (interaction.allowReuse !== undefined) {
      assert(typeof interaction.allowReuse === 'boolean', path + '.allowReuse must be boolean');
    }
    optionalSeparator(interaction.separator, path + '.separator');
    optionalString(interaction.placeholder, path + '.placeholder');
    optionalString(interaction.tokenBankLabel, path + '.tokenBankLabel');
    optionalString(interaction.sequenceLabel, path + '.sequenceLabel');

    var tokenIds = {};
    var tokenLabels = {};
    var tokenKinds = {};
    var tokenMaxUses = {};
    var distractorCount = 0;
    interaction.tokens.forEach(function (token, idx) {
      assert(isObject(token), path + '.tokens[' + idx + '] must be an object');
      requireString(token.id, path + '.tokens[' + idx + '].id');
      requireString(token.label, path + '.tokens[' + idx + '].label');
      requireString(token.kind, path + '.tokens[' + idx + '].kind');
      assert(/^(answer|distractor|neutral)$/.test(token.kind), path + '.tokens[' + idx + '].kind must be answer, distractor, or neutral');
      requireString(token.category, path + '.tokens[' + idx + '].category');
      assert(FORMULA_TOKEN_CATEGORIES[token.category], path + '.tokens[' + idx + '].category must be a formula token category');
      optionalString(token.description, path + '.tokens[' + idx + '].description');
      optionalString(token.usageHint, path + '.tokens[' + idx + '].usageHint');
      if (token.maxUses !== undefined) {
        assert(Number.isInteger(token.maxUses) && token.maxUses >= 1, path + '.tokens[' + idx + '].maxUses must be an integer >= 1');
      }
      assert(!tokenIds[token.id], 'duplicate formula token id: ' + token.id);
      tokenIds[token.id] = true;
      tokenLabels[token.id] = token.label;
      tokenKinds[token.id] = token.kind;
      tokenMaxUses[token.id] = token.maxUses || 1;
      if (token.kind === 'distractor') distractorCount += 1;
    });

    interaction.tokens.forEach(function (token, idx) {
      optionalString(token.distractorFor, path + '.tokens[' + idx + '].distractorFor');
      if (token.distractorFor !== undefined) {
        assert(tokenIds[token.distractorFor], path + '.tokens[' + idx + '].distractorFor must match an interaction token');
      }
    });

    if (distractorCount === 0) {
      assert(
        interaction.fixture_only_no_distractor === true && typeof interaction.fixture_only_rationale === 'string' && interaction.fixture_only_rationale.trim(),
        path + '.tokens must include at least one distractor token'
      );
    }

    return {
      tokenIds: tokenIds,
      tokenLabels: tokenLabels,
      tokenKinds: tokenKinds,
      tokenMaxUses: tokenMaxUses,
      tokenDisplayOrder: interaction.tokens.map(function (token) { return token.id; }),
      allowReuse: interaction.allowReuse === true
    };
  }

  function stepLabelMap(steps) {
    var labels = {};
    (steps || []).forEach(function (step) {
      labels[step.id] = step.label;
    });
    return labels;
  }

  function validateStepOrderingInteraction(task, path) {
    var interaction = task.interaction;
    requireArray(interaction.steps, path + '.steps', 3);
    optionalSeparator(interaction.separator, path + '.separator');
    optionalString(interaction.placeholder, path + '.placeholder');
    optionalString(interaction.stepBankLabel, path + '.stepBankLabel');
    optionalString(interaction.sequenceLabel, path + '.sequenceLabel');

    var stepIds = {};
    var stepLabels = {};
    var answerStepIds = [];
    var answerStepIdSet = {};
    var distractorCount = 0;
    interaction.steps.forEach(function (step, idx) {
      assert(isObject(step), path + '.steps[' + idx + '] must be an object');
      requireString(step.id, path + '.steps[' + idx + '].id');
      requireString(step.label, path + '.steps[' + idx + '].label');
      requireString(step.kind, path + '.steps[' + idx + '].kind');
      assert(/^(answer|distractor)$/.test(step.kind), path + '.steps[' + idx + '].kind must be answer or distractor');
      optionalString(step.description, path + '.steps[' + idx + '].description');
      assert(!stepIds[step.id], 'duplicate step id: ' + step.id);
      stepIds[step.id] = true;
      stepLabels[step.id] = step.label;
      if (step.kind === 'answer') {
        answerStepIds.push(step.id);
        answerStepIdSet[step.id] = true;
      }
      if (step.kind === 'distractor') distractorCount += 1;
    });

    interaction.steps.forEach(function (step, idx) {
      optionalString(step.distractorFor, path + '.steps[' + idx + '].distractorFor');
      if (step.distractorFor !== undefined) {
        assert(answerStepIdSet[step.distractorFor], path + '.steps[' + idx + '].distractorFor must match an answer step');
      }
    });

    assert(answerStepIds.length >= 2, path + '.steps must include at least two answer steps');
    assert(distractorCount >= 1, path + '.steps must include at least one distractor step');

    return {
      stepIds: stepIds,
      stepLabels: stepLabels,
      answerStepIds: answerStepIds
    };
  }

  function matchingOptionMap(items) {
    var labels = {};
    (items || []).forEach(function (item) {
      labels[item.id] = item.label;
    });
    return labels;
  }

  function validateMatchingItemBank(items, path, sideLabel) {
    requireArray(items, path, 3);
    var itemIds = {};
    var itemLabels = {};
    var itemKinds = {};
    var answerIds = [];
    var answerSet = {};
    var distractorCount = 0;

    items.forEach(function (item, idx) {
      assert(isObject(item), path + '[' + idx + '] must be an object');
      requireString(item.id, path + '[' + idx + '].id');
      requireString(item.label, path + '[' + idx + '].label');
      requireString(item.description, path + '[' + idx + '].description');
      requireString(item.kind, path + '[' + idx + '].kind');
      assert(/^(answer|distractor)$/.test(item.kind), path + '[' + idx + '].kind must be answer or distractor');
      assert(!itemIds[item.id], 'duplicate matching ' + sideLabel + ' item id: ' + item.id);
      itemIds[item.id] = true;
      itemLabels[item.id] = item.label;
      itemKinds[item.id] = item.kind;
      if (item.kind === 'answer') {
        answerIds.push(item.id);
        answerSet[item.id] = true;
      }
      if (item.kind === 'distractor') distractorCount += 1;
    });

    items.forEach(function (item, idx) {
      if (item.kind === 'distractor') {
        requireString(item.distractorFor, path + '[' + idx + '].distractorFor');
        assert(answerSet[item.distractorFor], path + '[' + idx + '].distractorFor must match an answer item in the same bank');
      } else {
        optionalString(item.distractorFor, path + '[' + idx + '].distractorFor');
        if (item.distractorFor !== undefined) {
          assert(answerSet[item.distractorFor], path + '[' + idx + '].distractorFor must match an answer item in the same bank');
        }
      }
    });

    assert(answerIds.length >= 2, path + ' must include at least two answer items');
    assert(distractorCount >= 1, path + ' must include at least one distractor item');

    return {
      itemIds: itemIds,
      itemLabels: itemLabels,
      itemKinds: itemKinds,
      answerIds: answerIds,
      answerSet: answerSet
    };
  }

  function validateMatchingPairsInteraction(task, path) {
    var interaction = task.interaction;
    optionalString(interaction.leftBankLabel, path + '.leftBankLabel');
    optionalString(interaction.rightBankLabel, path + '.rightBankLabel');
    optionalString(interaction.pairLabel, path + '.pairLabel');
    optionalString(interaction.placeholder, path + '.placeholder');

    var left = validateMatchingItemBank(interaction.leftItems, path + '.leftItems', 'left');
    var right = validateMatchingItemBank(interaction.rightItems, path + '.rightItems', 'right');

    assert(left.answerIds.length === right.answerIds.length, path + ' one-to-one matching requires equal answer counts in both banks');

    return {
      leftIds: left.itemIds,
      leftLabels: left.itemLabels,
      leftKinds: left.itemKinds,
      answerLeftIds: left.answerIds,
      rightIds: right.itemIds,
      rightLabels: right.itemLabels,
      rightKinds: right.itemKinds,
      answerRightIds: right.answerIds
    };
  }

  function validateTwoTierOptionBank(options, path, tierLabel) {
    requireArray(options, path, 2);
    var ids = {};
    var labels = {};
    options.forEach(function (option, idx) {
      assert(isObject(option), path + '[' + idx + '] must be an object');
      requireString(option.id, path + '[' + idx + '].id');
      requireString(option.label, path + '[' + idx + '].label');
      requireString(option.description, path + '[' + idx + '].description');
      assert(!ids[option.id], 'duplicate two-tier ' + tierLabel + ' option id: ' + option.id);
      ids[option.id] = true;
      labels[option.id] = option.label;
    });
    return {
      ids: ids,
      labels: labels
    };
  }

  function validateTwoTierInteraction(task, path) {
    var interaction = task.interaction;
    requireString(interaction.answerLabel, path + '.answerLabel');
    requireString(interaction.reasonLabel, path + '.reasonLabel');

    var answers = validateTwoTierOptionBank(interaction.answerOptions, path + '.answerOptions', 'answer');
    var reasons = validateTwoTierOptionBank(interaction.reasonOptions, path + '.reasonOptions', 'reason');

    Object.keys(answers.ids).forEach(function (answerId) {
      assert(!reasons.ids[answerId], path + ' must not reuse option id across answerOptions and reasonOptions: ' + answerId);
    });

    return {
      answerOptionIds: answers.ids,
      answerOptionLabels: answers.labels,
      reasonOptionIds: reasons.ids,
      reasonOptionLabels: reasons.labels
    };
  }

  function validateAssertionReasonOptions(options, path) {
    requireArray(options, path, 4);
    var ids = {};
    var labels = {};
    options.forEach(function (option, idx) {
      assert(isObject(option), path + '[' + idx + '] must be an object');
      requireString(option.id, path + '[' + idx + '].id');
      requireString(option.label, path + '[' + idx + '].label');
      requireString(option.description, path + '[' + idx + '].description');
      assert(!ids[option.id], 'duplicate assertion-reason option id: ' + option.id);
      ids[option.id] = true;
      labels[option.id] = option.label;
    });
    return {
      ids: ids,
      labels: labels
    };
  }

  function validateAssertionReasonInteraction(task, path) {
    var interaction = task.interaction;
    requireString(interaction.assertionLabel, path + '.assertionLabel');
    requireString(interaction.assertionText, path + '.assertionText');
    requireString(interaction.reasonLabel, path + '.reasonLabel');
    requireString(interaction.reasonText, path + '.reasonText');
    requireString(interaction.optionLabel, path + '.optionLabel');

    var options = validateAssertionReasonOptions(interaction.options, path + '.options');
    return {
      assertionOptionIds: options.ids,
      assertionOptionLabels: options.labels
    };
  }

  function validateGraphConstructionInteraction(task, path) {
    var interaction = task.interaction;
    requireString(interaction.workspaceTitle, path + '.workspaceTitle');
    requireString(interaction.xAxisLabel, path + '.xAxisLabel');
    requireString(interaction.yAxisLabel, path + '.yAxisLabel');
    requireString(interaction.pointRowsLabel, path + '.pointRowsLabel');
    optionalString(interaction.lineConfirmationLabel, path + '.lineConfirmationLabel');
    optionalString(interaction.lineShapeLabel, path + '.lineShapeLabel');
    optionalString(interaction.xInputLabel, path + '.xInputLabel');
    optionalString(interaction.yInputLabel, path + '.yInputLabel');
    optionalString(interaction.emptyGraphAltText, path + '.emptyGraphAltText');
    assert(isObject(interaction.axes), path + '.axes must be an object');
    assert(isObject(interaction.axes.x), path + '.axes.x must be an object');
    assert(isObject(interaction.axes.y), path + '.axes.y must be an object');
    requireString(interaction.axes.x.label, path + '.axes.x.label');
    requireString(interaction.axes.y.label, path + '.axes.y.label');
    assert(isNumber(interaction.axes.x.min), path + '.axes.x.min must be numeric');
    assert(isNumber(interaction.axes.x.max), path + '.axes.x.max must be numeric');
    assert(isNumber(interaction.axes.y.min), path + '.axes.y.min must be numeric');
    assert(isNumber(interaction.axes.y.max), path + '.axes.y.max must be numeric');
    assert(interaction.axes.x.max > interaction.axes.x.min, path + '.axes.x.max must exceed min');
    assert(interaction.axes.y.max > interaction.axes.y.min, path + '.axes.y.max must exceed min');
    if (interaction.axes.x.ticks !== undefined) validateAxisTicks(interaction.axes.x.ticks, interaction.axes.x, path + '.axes.x.ticks');
    if (interaction.axes.y.ticks !== undefined) validateAxisTicks(interaction.axes.y.ticks, interaction.axes.y, path + '.axes.y.ticks');
    assert(Number.isInteger(interaction.pointCount) && interaction.pointCount >= 2, path + '.pointCount must be an integer >= 2');
    if (interaction.pointSnapMode !== undefined) {
      assert(interaction.pointSnapMode === 'magnetic_table_point', path + '.pointSnapMode must be magnetic_table_point when present');
    }
    if (interaction.pointSnapTolerancePx !== undefined) {
      assert(isNumber(interaction.pointSnapTolerancePx) && interaction.pointSnapTolerancePx >= 0, path + '.pointSnapTolerancePx must be a non-negative number');
    }
    return {
      pointCount: interaction.pointCount
    };
  }

  function validateGraphReadingInteraction(task, path) {
    var interaction = task.interaction;
    requireString(interaction.inputLabel, path + '.inputLabel');
    optionalString(interaction.placeholder, path + '.placeholder');
    optionalString(interaction.inputPlaceholder, path + '.inputPlaceholder');
    optionalString(interaction.intervalLabel, path + '.intervalLabel');

    var intervalOptionIds = {};
    if (interaction.intervalOptions !== undefined) {
      requireString(interaction.intervalLabel, path + '.intervalLabel');
      requireArray(interaction.intervalOptions, path + '.intervalOptions', 2);
      var correctCount = 0;
      var distractorCount = 0;
      interaction.intervalOptions.forEach(function (option, idx) {
        assert(isObject(option), path + '.intervalOptions[' + idx + '] must be an object');
        requireString(option.id, path + '.intervalOptions[' + idx + '].id');
        requireString(option.label, path + '.intervalOptions[' + idx + '].label');
        assert(typeof option.correct === 'boolean', path + '.intervalOptions[' + idx + '].correct must be boolean');
        assert(!intervalOptionIds[option.id], 'duplicate graph reading interval option id: ' + option.id);
        intervalOptionIds[option.id] = true;
        if (option.correct) correctCount += 1;
        else distractorCount += 1;
      });
      assert(correctCount >= 1, path + '.intervalOptions must include at least one correct interval');
      assert(distractorCount >= 1, path + '.intervalOptions must include at least one distractor interval');
    }

    if (interaction.stepOrder !== undefined) {
      requireArray(interaction.stepOrder, path + '.stepOrder', 1);
      var seenSteps = {};
      interaction.stepOrder.forEach(function (step, idx) {
        requireString(step, path + '.stepOrder[' + idx + ']');
        assert(step === 'interval_selection' || step === 'read_q_value', path + '.stepOrder[' + idx + '] must be interval_selection or read_q_value');
        assert(!seenSteps[step], path + '.stepOrder contains duplicate step: ' + step);
        seenSteps[step] = true;
      });
      if (seenSteps.interval_selection) {
        assert(interaction.intervalOptions !== undefined, path + '.stepOrder interval_selection requires intervalOptions');
        assert(interaction.stepOrder.indexOf('interval_selection') < interaction.stepOrder.indexOf('read_q_value'), path + '.stepOrder must select interval before reading the value');
      }
    }

    return {
      intervalOptionIds: intervalOptionIds
    };
  }

  function validateAxisTicks(ticks, axis, path) {
    requireArray(ticks, path, 2);
    ticks.forEach(function (tick, idx) {
      assert(isNumber(tick), path + '[' + idx + '] must be numeric');
      assert(tick >= axis.min && tick <= axis.max, path + '[' + idx + '] must stay within axis min/max');
    });
    if (axis.tickDecimals !== undefined) {
      assert(Number.isInteger(axis.tickDecimals) && axis.tickDecimals >= 0, path.replace(/\.ticks$/, '.tickDecimals') + ' must be a non-negative integer');
    }
    if (axis.tickFormat !== undefined) {
      assert(axis.tickFormat === 'decimal_comma' || axis.tickFormat === 'plain', path.replace(/\.ticks$/, '.tickFormat') + ' must be decimal_comma or plain');
    }
  }

  function validateIntervalHalvingInteraction(task, path) {
    var interaction = task.interaction;
    requireString(interaction.intervalLabel, path + '.intervalLabel');
    requireArray(interaction.intervalOptions, path + '.intervalOptions', 2);
    var intervalIds = {};
    var intervalCorrectCount = 0;
    var intervalDistractorCount = 0;
    interaction.intervalOptions.forEach(function (option, idx) {
      assert(isObject(option), path + '.intervalOptions[' + idx + '] must be an object');
      requireString(option.id, path + '.intervalOptions[' + idx + '].id');
      requireString(option.label, path + '.intervalOptions[' + idx + '].label');
      requireString(option.finalAnswer, path + '.intervalOptions[' + idx + '].finalAnswer');
      requireString(option.oldQuantity, path + '.intervalOptions[' + idx + '].oldQuantity');
      requireString(option.newQuantity, path + '.intervalOptions[' + idx + '].newQuantity');
      requireString(option.work, path + '.intervalOptions[' + idx + '].work');
      assert(typeof option.correct === 'boolean', path + '.intervalOptions[' + idx + '].correct must be boolean');
      assert(!intervalIds[option.id], 'duplicate interval option id: ' + option.id);
      intervalIds[option.id] = true;
      if (option.correct) intervalCorrectCount += 1;
      else intervalDistractorCount += 1;
    });
    assert(intervalCorrectCount >= 1, path + '.intervalOptions must include at least one correct interval');
    assert(intervalDistractorCount >= 1, path + '.intervalOptions must include at least one distractor interval');
    requireString(interaction.relationLabel, path + '.relationLabel');
    requireArray(interaction.relationOptions, path + '.relationOptions', 2);
    var relationIds = {};
    interaction.relationOptions.forEach(function (option, idx) {
      assert(isObject(option), path + '.relationOptions[' + idx + '] must be an object');
      requireString(option.id, path + '.relationOptions[' + idx + '].id');
      requireString(option.label, path + '.relationOptions[' + idx + '].label');
      assert(!relationIds[option.id], 'duplicate relation option id: ' + option.id);
      relationIds[option.id] = true;
    });
    if (interaction.conclusionOptions !== undefined) {
      requireString(interaction.conclusionLabel, path + '.conclusionLabel');
      requireArray(interaction.conclusionOptions, path + '.conclusionOptions', 2);
      var conclusionIds = {};
      var conclusionCorrectCount = 0;
      var conclusionDistractorCount = 0;
      interaction.conclusionOptions.forEach(function (option, idx) {
        assert(isObject(option), path + '.conclusionOptions[' + idx + '] must be an object');
        requireString(option.id, path + '.conclusionOptions[' + idx + '].id');
        requireString(option.label, path + '.conclusionOptions[' + idx + '].label');
        requireString(option.finalAnswer, path + '.conclusionOptions[' + idx + '].finalAnswer');
        assert(typeof option.correct === 'boolean', path + '.conclusionOptions[' + idx + '].correct must be boolean');
        assert(!conclusionIds[option.id], 'duplicate conclusion option id: ' + option.id);
        conclusionIds[option.id] = true;
        if (option.correct) conclusionCorrectCount += 1;
        else conclusionDistractorCount += 1;
      });
      assert(conclusionCorrectCount >= 1, path + '.conclusionOptions must include at least one correct conclusion');
      assert(conclusionDistractorCount >= 1, path + '.conclusionOptions must include at least one distractor conclusion');
    }
  }

  function validateSimpleChoiceOptions(options, path, minimum) {
    requireArray(options, path, minimum || 2);
    var ids = {};
    var correctCount = 0;
    var distractorCount = 0;
    options.forEach(function (option, idx) {
      assert(isObject(option), path + '[' + idx + '] must be an object');
      requireString(option.id, path + '[' + idx + '].id');
      requireString(option.label, path + '[' + idx + '].label');
      assert(typeof option.correct === 'boolean', path + '[' + idx + '].correct must be boolean');
      optionalString(option.finalAnswer, path + '[' + idx + '].finalAnswer');
      assert(!ids[option.id], 'duplicate option id: ' + option.id);
      ids[option.id] = true;
      if (option.correct) correctCount += 1;
      else distractorCount += 1;
    });
    assert(correctCount >= 1, path + ' must include at least one correct option');
    assert(distractorCount >= 1, path + ' must include at least one distractor option');
    return ids;
  }

  function validatePercentageClaimInteraction(task, path) {
    var interaction = task.interaction;
    requireString(interaction.intervalLabel, path + '.intervalLabel');
    requireString(interaction.valueSectionLabel, path + '.valueSectionLabel');
    requireString(interaction.oldValueLabel, path + '.oldValueLabel');
    requireString(interaction.newValueLabel, path + '.newValueLabel');
    requireString(interaction.formulaSectionLabel, path + '.formulaSectionLabel');
    requireString(interaction.conclusionLabel, path + '.conclusionLabel');
    optionalString(interaction.oldValuePlaceholder, path + '.oldValuePlaceholder');
    optionalString(interaction.newValuePlaceholder, path + '.newValuePlaceholder');
    var intervalIds = validateSimpleChoiceOptions(interaction.intervalOptions, path + '.intervalOptions', 2);
    var conclusionIds = validateSimpleChoiceOptions(interaction.conclusionOptions, path + '.conclusionOptions', 2);
    assert(isObject(interaction.formula), path + '.formula must be an object');
    var formulaInfo = validateFormulaInteraction({ id: task.id, interaction: interaction.formula }, path + '.formula');
    return {
      intervalOptionIds: intervalIds,
      conclusionOptionIds: conclusionIds,
      formulaTokenIds: formulaInfo.tokenIds
    };
  }

  function sourceValueLabelMap(values) {
    var labels = {};
    (values || []).forEach(function (value) {
      labels[value.id] = value.label;
    });
    return labels;
  }

  function sourceRoleLabelMap(roles) {
    var labels = {};
    (roles || []).forEach(function (role) {
      labels[role.id] = role.label;
    });
    return labels;
  }

  function validateSourceValueInteraction(task, path) {
    var interaction = task.interaction;
    requireArray(interaction.values, path + '.values', 3);
    requireArray(interaction.roles, path + '.roles', 1);
    optionalString(interaction.valueBankLabel, path + '.valueBankLabel');
    optionalString(interaction.roleLabel, path + '.roleLabel');

    var valueIds = {};
    var valueLabels = {};
    var answerValueIds = [];
    var answerValueSet = {};
    var distractorCount = 0;
    interaction.values.forEach(function (value, idx) {
      assert(isObject(value), path + '.values[' + idx + '] must be an object');
      requireString(value.id, path + '.values[' + idx + '].id');
      requireString(value.label, path + '.values[' + idx + '].label');
      requireString(value.kind, path + '.values[' + idx + '].kind');
      assert(/^(answer|distractor)$/.test(value.kind), path + '.values[' + idx + '].kind must be answer or distractor');
      optionalString(value.description, path + '.values[' + idx + '].description');
      optionalString(value.sourceLabel, path + '.values[' + idx + '].sourceLabel');
      optionalString(value.unit, path + '.values[' + idx + '].unit');
      optionalString(value.period, path + '.values[' + idx + '].period');
      assert(!valueIds[value.id], 'duplicate source value id: ' + value.id);
      valueIds[value.id] = true;
      valueLabels[value.id] = value.label;
      if (value.kind === 'answer') {
        answerValueIds.push(value.id);
        answerValueSet[value.id] = true;
      }
      if (value.kind === 'distractor') distractorCount += 1;
    });

    interaction.values.forEach(function (value, idx) {
      optionalString(value.distractorFor, path + '.values[' + idx + '].distractorFor');
      if (value.distractorFor !== undefined) {
        assert(answerValueSet[value.distractorFor], path + '.values[' + idx + '].distractorFor must match an answer value');
      }
    });

    var roleIds = {};
    var roleLabels = {};
    interaction.roles.forEach(function (role, idx) {
      assert(isObject(role), path + '.roles[' + idx + '] must be an object');
      requireString(role.id, path + '.roles[' + idx + '].id');
      requireString(role.label, path + '.roles[' + idx + '].label');
      optionalString(role.description, path + '.roles[' + idx + '].description');
      assert(!roleIds[role.id], 'duplicate source role id: ' + role.id);
      roleIds[role.id] = true;
      roleLabels[role.id] = role.label;
    });

    assert(answerValueIds.length >= 2, path + '.values must include at least two answer values');
    assert(distractorCount >= 1, path + '.values must include at least one distractor value');

    return {
      valueIds: valueIds,
      valueLabels: valueLabels,
      answerValueIds: answerValueIds,
      roleIds: roleIds,
      roleLabels: roleLabels
    };
  }

  function sourceNodeLabelMap(nodes) {
    var labels = {};
    (nodes || []).forEach(function (node) {
      labels[node.id] = node.label;
    });
    return labels;
  }

  function validateSourceChainInteraction(task, path) {
    var interaction = task.interaction;
    requireArray(interaction.nodes, path + '.nodes', 6);
    optionalSeparator(interaction.separator, path + '.separator');
    optionalString(interaction.placeholder, path + '.placeholder');
    optionalString(interaction.nodeBankLabel, path + '.nodeBankLabel');
    optionalString(interaction.sequenceLabel, path + '.sequenceLabel');

    var nodeIds = {};
    var nodeLabels = {};
    var nodeRoles = {};
    var answerNodeIds = [];
    var answerNodeIdSet = {};
    var answerRoleCounts = {};
    var distractorCount = 0;
    interaction.nodes.forEach(function (node, idx) {
      assert(isObject(node), path + '.nodes[' + idx + '] must be an object');
      requireString(node.id, path + '.nodes[' + idx + '].id');
      requireString(node.label, path + '.nodes[' + idx + '].label');
      requireString(node.kind, path + '.nodes[' + idx + '].kind');
      assert(/^(answer|distractor)$/.test(node.kind), path + '.nodes[' + idx + '].kind must be answer or distractor');
      requireString(node.nodeRole, path + '.nodes[' + idx + '].nodeRole');
      assert(SOURCE_CHAIN_NODE_ROLES[node.nodeRole], path + '.nodes[' + idx + '].nodeRole must be a source-chain node role');
      optionalString(node.description, path + '.nodes[' + idx + '].description');
      assert(!nodeIds[node.id], 'duplicate source chain node id: ' + node.id);
      nodeIds[node.id] = true;
      nodeLabels[node.id] = node.label;
      nodeRoles[node.id] = node.nodeRole;
      if (node.kind === 'answer') {
        answerNodeIds.push(node.id);
        answerNodeIdSet[node.id] = true;
        answerRoleCounts[node.nodeRole] = (answerRoleCounts[node.nodeRole] || 0) + 1;
      }
      if (node.kind === 'distractor') distractorCount += 1;
    });

    interaction.nodes.forEach(function (node, idx) {
      optionalString(node.distractorFor, path + '.nodes[' + idx + '].distractorFor');
      if (node.distractorFor !== undefined) {
        assert(answerNodeIdSet[node.distractorFor], path + '.nodes[' + idx + '].distractorFor must match an answer node');
      }
    });

    Object.keys(SOURCE_CHAIN_NODE_ROLES).forEach(function (role) {
      assert(answerRoleCounts[role] >= 1, path + '.nodes must include at least one answer node with nodeRole ' + role);
    });
    assert(distractorCount >= 1, path + '.nodes must include at least one distractor node');

    return {
      nodeIds: nodeIds,
      nodeLabels: nodeLabels,
      nodeRoles: nodeRoles,
      answerNodeIds: answerNodeIds,
      answerRoleCounts: answerRoleCounts
    };
  }

  function labelOptionMap(labels) {
    var out = {};
    (labels || []).forEach(function (label) {
      out[label.id] = label.label;
    });
    return out;
  }

  function targetOptionMap(targets) {
    var out = {};
    (targets || []).forEach(function (target) {
      out[target.id] = target.label;
    });
    return out;
  }

  function optionalCoordinate(value, path) {
    if (value === undefined) return;
    assert(isNumber(value), path + ' must be a number from 0 to 100');
    assert(value >= 0 && value <= 100, path + ' must be between 0 and 100');
  }

  function validateLabelPlacementInteraction(task, path) {
    var interaction = task.interaction;
    requireArray(interaction.labels, path + '.labels', 3);
    requireArray(interaction.targets, path + '.targets', 3);
    optionalString(interaction.labelBankLabel, path + '.labelBankLabel');
    optionalString(interaction.targetRegionLabel, path + '.targetRegionLabel');
    optionalString(interaction.placementLabel, path + '.placementLabel');
    if (interaction.visual !== undefined) {
      assert(isObject(interaction.visual), path + '.visual must be an object');
      requireString(interaction.visual.kind, path + '.visual.kind');
      requireString(interaction.visual.title, path + '.visual.title');
      requireString(interaction.visual.description, path + '.visual.description');
    }

    var labelIds = {};
    var labelLabels = {};
    var answerLabelIds = [];
    var answerLabelSet = {};
    var labelDistractorCount = 0;
    interaction.labels.forEach(function (label, idx) {
      assert(isObject(label), path + '.labels[' + idx + '] must be an object');
      requireString(label.id, path + '.labels[' + idx + '].id');
      requireString(label.label, path + '.labels[' + idx + '].label');
      requireString(label.description, path + '.labels[' + idx + '].description');
      requireString(label.kind, path + '.labels[' + idx + '].kind');
      assert(/^(answer|distractor)$/.test(label.kind), path + '.labels[' + idx + '].kind must be answer or distractor');
      assert(!labelIds[label.id], 'duplicate label placement label id: ' + label.id);
      labelIds[label.id] = true;
      labelLabels[label.id] = label.label;
      if (label.kind === 'answer') {
        answerLabelIds.push(label.id);
        answerLabelSet[label.id] = true;
      }
      if (label.kind === 'distractor') labelDistractorCount += 1;
    });

    interaction.labels.forEach(function (label, idx) {
      if (label.kind === 'distractor') {
        requireString(label.distractorFor, path + '.labels[' + idx + '].distractorFor');
        assert(answerLabelSet[label.distractorFor], path + '.labels[' + idx + '].distractorFor must match an answer label');
      } else {
        optionalString(label.distractorFor, path + '.labels[' + idx + '].distractorFor');
        if (label.distractorFor !== undefined) {
          assert(answerLabelSet[label.distractorFor], path + '.labels[' + idx + '].distractorFor must match an answer label');
        }
      }
    });

    var targetIds = {};
    var targetLabels = {};
    var targetRoles = {};
    var answerTargetIds = [];
    var answerTargetSet = {};
    var targetDistractorCount = 0;
    interaction.targets.forEach(function (target, idx) {
      assert(isObject(target), path + '.targets[' + idx + '] must be an object');
      requireString(target.id, path + '.targets[' + idx + '].id');
      requireString(target.label, path + '.targets[' + idx + '].label');
      requireString(target.description, path + '.targets[' + idx + '].description');
      requireString(target.kind, path + '.targets[' + idx + '].kind');
      assert(/^(answer|distractor)$/.test(target.kind), path + '.targets[' + idx + '].kind must be answer or distractor');
      requireString(target.targetRole, path + '.targets[' + idx + '].targetRole');
      assert(LABEL_TARGET_ROLES[target.targetRole], path + '.targets[' + idx + '].targetRole must be a label-placement target role');
      optionalCoordinate(target.x, path + '.targets[' + idx + '].x');
      optionalCoordinate(target.y, path + '.targets[' + idx + '].y');
      assert(!targetIds[target.id], 'duplicate label placement target id: ' + target.id);
      targetIds[target.id] = true;
      targetLabels[target.id] = target.label;
      targetRoles[target.id] = target.targetRole;
      if (target.kind === 'answer') {
        answerTargetIds.push(target.id);
        answerTargetSet[target.id] = true;
      }
      if (target.kind === 'distractor') targetDistractorCount += 1;
    });

    interaction.targets.forEach(function (target, idx) {
      if (target.kind === 'distractor') {
        requireString(target.distractorFor, path + '.targets[' + idx + '].distractorFor');
        assert(answerTargetSet[target.distractorFor], path + '.targets[' + idx + '].distractorFor must match an answer target');
      } else {
        optionalString(target.distractorFor, path + '.targets[' + idx + '].distractorFor');
        if (target.distractorFor !== undefined) {
          assert(answerTargetSet[target.distractorFor], path + '.targets[' + idx + '].distractorFor must match an answer target');
        }
      }
    });

    assert(answerLabelIds.length >= 2, path + '.labels must include at least two answer labels');
    assert(answerTargetIds.length >= 2, path + '.targets must include at least two answer targets');
    assert(labelDistractorCount >= 1, path + '.labels must include at least one distractor label');
    assert(targetDistractorCount >= 1, path + '.targets must include at least one distractor target');

    return {
      labelIds: labelIds,
      labelLabels: labelLabels,
      answerLabelIds: answerLabelIds,
      targetIds: targetIds,
      targetLabels: targetLabels,
      targetRoles: targetRoles,
      answerTargetIds: answerTargetIds
    };
  }

  function validateStructuredFields(fields, path) {
    requireArray(fields, path, 1);
    var ids = {};
    fields.forEach(function (field, idx) {
      assert(isObject(field), path + '[' + idx + '] must be an object');
      requireString(field.id, path + '[' + idx + '].id');
      requireString(field.label, path + '[' + idx + '].label');
      optionalString(field.placeholder, path + '[' + idx + '].placeholder');
      optionalString(field.inputMode, path + '[' + idx + '].inputMode');
      assert(!ids[field.id], 'duplicate structured field id: ' + field.id);
      ids[field.id] = true;
    });
    return ids;
  }

  function validateHints(hints, path) {
    requireArray(hints, path, 1);
    hints.forEach(function (hint, idx) {
      requireString(hint, path + '[' + idx + ']');
    });
  }

  function validateUnitNotation(expected, path) {
    assert(isObject(expected), path + ' must be an object');
    assert(expected.kind === 'text', path + '.kind must be text');
    requireArray(expected.accepted, path + '.accepted', 1);
    if (expected.required !== undefined) {
      assert(typeof expected.required === 'boolean', path + '.required must be boolean');
    }
  }

  function validateFormulaExpected(expected, tokenIds, allowReuse, path) {
    assert(expected.kind === 'formula_builder', path + '.kind must be formula_builder');
    requireArray(expected.tokens, path + '.tokens', 1);
    requireArray(expected.acceptedSequences, path + '.acceptedSequences', 1);

    function validateFormulaSequence(sequence, sequencePath) {
      requireArray(sequence, sequencePath, 1);
      var seen = {};
      sequence.forEach(function (tokenId, idx) {
        requireString(tokenId, sequencePath + '[' + idx + ']');
        assert(tokenIds[tokenId], sequencePath + '[' + idx + '] must match an interaction token');
        if (!allowReuse) {
          assert(!seen[tokenId], sequencePath + ' uses token more than once without allowReuse');
          seen[tokenId] = true;
        }
      });
    }

    validateFormulaSequence(expected.tokens, path + '.tokens');
    var canonical = expected.tokens.join('\u0001');
    var includesCanonical = false;
    expected.acceptedSequences.forEach(function (sequence, idx) {
      validateFormulaSequence(sequence, path + '.acceptedSequences[' + idx + ']');
      if (sequence.join('\u0001') === canonical) includesCanonical = true;
    });
    assert(includesCanonical, path + '.acceptedSequences must include expected.tokens');
  }

  function validatePercentageClaimExpected(task, interactionInfo) {
    var expected = task.expected;
    assert(isObject(expected.interval), task.id + '.expected.interval must be an object');
    assert(expected.interval.kind === 'choice', task.id + '.expected.interval.kind must be choice');
    requireString(expected.interval.value, task.id + '.expected.interval.value');
    assert((interactionInfo.intervalOptionIds || {})[expected.interval.value], task.id + '.expected.interval.value must match an interval option id');

    assert(isObject(expected.oldValue), task.id + '.expected.oldValue must be an object');
    assert(expected.oldValue.kind === 'number', task.id + '.expected.oldValue.kind must be number');
    assert(isNumber(expected.oldValue.value), task.id + '.expected.oldValue.value must be numeric');
    if (expected.oldValue.tolerance !== undefined) assert(isNumber(expected.oldValue.tolerance), task.id + '.expected.oldValue.tolerance must be numeric');

    assert(isObject(expected.newValue), task.id + '.expected.newValue must be an object');
    assert(expected.newValue.kind === 'number', task.id + '.expected.newValue.kind must be number');
    assert(isNumber(expected.newValue.value), task.id + '.expected.newValue.value must be numeric');
    if (expected.newValue.tolerance !== undefined) assert(isNumber(expected.newValue.tolerance), task.id + '.expected.newValue.tolerance must be numeric');

    assert(isObject(expected.formula), task.id + '.expected.formula must be an object');
    validateFormulaExpected(expected.formula, interactionInfo.formulaTokenIds || {}, task.interaction.formula && task.interaction.formula.allowReuse === true, task.id + '.expected.formula');

    assert(isObject(expected.conclusion), task.id + '.expected.conclusion must be an object');
    assert(expected.conclusion.kind === 'choice', task.id + '.expected.conclusion.kind must be choice');
    requireString(expected.conclusion.value, task.id + '.expected.conclusion.value');
    assert((interactionInfo.conclusionOptionIds || {})[expected.conclusion.value], task.id + '.expected.conclusion.value must match a conclusion option id');
  }

  function validateCalculationAnswerFormInteraction(task, path) {
    var interaction = task.interaction;
    assert(isObject(interaction.formula), path + '.formula is required');
    requireString(interaction.formula.title, path + '.formula.title');
    optionalString(interaction.formula.purpose, path + '.formula.purpose');
    var formulaInfo = validateFormulaInteraction({ id: task.id, interaction: interaction.formula }, path + '.formula');

    assert(isObject(interaction.substitution), path + '.substitution is required');
    requireString(interaction.substitution.title, path + '.substitution.title');
    optionalString(interaction.substitution.purpose, path + '.substitution.purpose');
    optionalString(interaction.substitution.template, path + '.substitution.template');
    var substitutionFieldIds = validateStructuredFields(interaction.substitution.fields, path + '.substitution.fields');

    assert(isObject(interaction.answer), path + '.answer is required');
    requireString(interaction.answer.title, path + '.answer.title');
    optionalString(interaction.answer.purpose, path + '.answer.purpose');
    requireString(interaction.answer.finalAnswerLabel, path + '.answer.finalAnswerLabel');
    requireString(interaction.answer.unitNotationLabel, path + '.answer.unitNotationLabel');
    optionalString(interaction.answer.finalAnswerPlaceholder, path + '.answer.finalAnswerPlaceholder');
    optionalString(interaction.answer.unitNotationPlaceholder, path + '.answer.unitNotationPlaceholder');

    assert(isObject(interaction.context), path + '.context is required');
    requireString(interaction.context.title, path + '.context.title');
    optionalString(interaction.context.purpose, path + '.context.purpose');
    requireString(interaction.context.label, path + '.context.label');
    optionalString(interaction.context.placeholder, path + '.context.placeholder');

    return {
      formula: formulaInfo,
      substitutionFieldIds: substitutionFieldIds
    };
  }

  function tokenUsageCounts(tokens) {
    var counts = {};
    (tokens || []).forEach(function (tokenId) {
      counts[tokenId] = (counts[tokenId] || 0) + 1;
    });
    return counts;
  }

  function methodTokensMatch(tokens, expectedTokens) {
    if (!Array.isArray(tokens) || !Array.isArray(expectedTokens)) return false;
    if (tokens.length !== expectedTokens.length) return false;
    for (var i = 0; i < expectedTokens.length; i += 1) {
      if (normalizeText(tokens[i]) !== normalizeText(expectedTokens[i])) return false;
    }
    return true;
  }

  function validateNoIdenticalAnswerTokenLabels(formulaInfo, path) {
    var labels = {};
    Object.keys(formulaInfo.tokenLabels || {}).forEach(function (tokenId) {
      if (formulaInfo.tokenKinds[tokenId] !== 'answer') return;
      var label = normalizeText(formulaInfo.tokenLabels[tokenId]);
      if (!label) return;
      assert(!labels[label] || labels[label] === tokenId, path + ' must not contain visually identical answer tokens with different ids: ' + formulaInfo.tokenLabels[tokenId]);
      labels[label] = tokenId;
    });
  }

  function validateCalculationAnswerFormExpected(task, interactionInfo) {
    var expected = task.expected;
    assert(expected.kind === 'calculation_answer_form', task.id + '.expected.kind must be calculation_answer_form');
    var formulaInfo = interactionInfo.formula || {};
    requireArray(expected.methodTokens, task.id + '.expected.methodTokens', 1);
    var counts = tokenUsageCounts(expected.methodTokens);
    expected.methodTokens.forEach(function (tokenId, idx) {
      requireString(tokenId, task.id + '.expected.methodTokens[' + idx + ']');
      assert(formulaInfo.tokenIds[tokenId], task.id + '.expected.methodTokens[' + idx + '] must match a formula token');
      assert(counts[tokenId] <= (formulaInfo.tokenMaxUses[tokenId] || 1), task.id + '.expected.methodTokens uses token ' + tokenId + ' more than allowed');
    });
    if (expected.tokenDisplayOrderMustNotEqualMethodTokens !== undefined) {
      assert(typeof expected.tokenDisplayOrderMustNotEqualMethodTokens === 'boolean', task.id + '.expected.tokenDisplayOrderMustNotEqualMethodTokens must be boolean');
      if (expected.tokenDisplayOrderMustNotEqualMethodTokens) {
        assert(!methodTokensMatch(formulaInfo.tokenDisplayOrder, expected.methodTokens), task.id + '.interaction.formula.tokens must not be arranged in accepted answer order');
      }
    }
    if (
      expected.visualTokenIdentityPolicy &&
      expected.visualTokenIdentityPolicy.forbid_identical_labels_with_different_answer_ids === true
    ) {
      validateNoIdenticalAnswerTokenLabels(formulaInfo, task.id + '.interaction.formula.tokens');
    }

    assert(isObject(expected.substitution), task.id + '.expected.substitution must be an object');
    var expectedSubstitutionIds = Object.keys(expected.substitution);
    var interactionSubstitutionIds = Object.keys(interactionInfo.substitutionFieldIds || {});
    assert(expectedSubstitutionIds.length === interactionSubstitutionIds.length, task.id + '.expected.substitution must match all substitution fields');
    interactionSubstitutionIds.forEach(function (fieldId) {
      assert(Object.prototype.hasOwnProperty.call(expected.substitution, fieldId), task.id + '.expected.substitution missing ' + fieldId);
      var fieldExpected = expected.substitution[fieldId];
      assert(isObject(fieldExpected), task.id + '.expected.substitution.' + fieldId + ' must be an object');
      assert(fieldExpected.kind === 'number' || fieldExpected.kind === 'text', task.id + '.expected.substitution.' + fieldId + '.kind must be number or text');
      if (fieldExpected.kind === 'number') {
        assert(isNumber(fieldExpected.value), task.id + '.expected.substitution.' + fieldId + '.value must be numeric');
        if (fieldExpected.tolerance !== undefined) assert(isNumber(fieldExpected.tolerance), task.id + '.expected.substitution.' + fieldId + '.tolerance must be numeric');
      } else {
        requireArray(fieldExpected.accepted, task.id + '.expected.substitution.' + fieldId + '.accepted', 1);
      }
    });

    assert(isObject(expected.finalAnswer), task.id + '.expected.finalAnswer is required');
    assert(
      expected.finalAnswer.kind === 'number_or_percent_text' || expected.finalAnswer.kind === 'number' || expected.finalAnswer.kind === 'text',
      task.id + '.expected.finalAnswer.kind must be number_or_percent_text, number, or text'
    );
    if (expected.finalAnswer.kind === 'number_or_percent_text') {
      assert(isNumber(expected.finalAnswer.value), task.id + '.expected.finalAnswer.value must be numeric');
      requireStringArray(expected.finalAnswer.acceptedNotations, task.id + '.expected.finalAnswer.acceptedNotations', 1);
    } else if (expected.finalAnswer.kind === 'number') {
      assert(isNumber(expected.finalAnswer.value), task.id + '.expected.finalAnswer.value must be numeric');
      if (expected.finalAnswer.tolerance !== undefined) assert(isNumber(expected.finalAnswer.tolerance), task.id + '.expected.finalAnswer.tolerance must be numeric');
    } else {
      requireArray(expected.finalAnswer.accepted, task.id + '.expected.finalAnswer.accepted', 1);
    }
    validateUnitNotation(expected.notation, task.id + '.expected.notation');
    assert(isObject(expected.conclusion), task.id + '.expected.conclusion is required');
    validateRequiredTextGroups(expected.conclusion.requiredTextGroups, task.id + '.expected.conclusion.requiredTextGroups');
    if (expected.criteria !== undefined) requireArray(expected.criteria, task.id + '.expected.criteria', 1);
  }

  function validateRequiredTextGroups(groups, path) {
    requireArray(groups, path, 1);
    groups.forEach(function (group, idx) {
      requireArray(group, path + '[' + idx + ']', 1);
      group.forEach(function (value, valueIdx) {
        requireString(value, path + '[' + idx + '][' + valueIdx + ']');
      });
    });
  }

  function validateClozeTextExpectedBlank(blankExpected, path) {
    assert(isObject(blankExpected), path + ' must be an object');
    var hasAccepted = false;
    var hasGroups = false;
    if (blankExpected.accepted !== undefined) {
      requireArray(blankExpected.accepted, path + '.accepted', 1);
      blankExpected.accepted.forEach(function (value, idx) {
        requireString(value, path + '.accepted[' + idx + ']');
      });
      hasAccepted = true;
    }
    if (blankExpected.requiredTextGroups !== undefined) {
      validateRequiredTextGroups(blankExpected.requiredTextGroups, path + '.requiredTextGroups');
      hasGroups = true;
    }
    assert(hasAccepted || hasGroups, path + ' must include accepted or requiredTextGroups');
    if (blankExpected.rejectText !== undefined) {
      requireArray(blankExpected.rejectText, path + '.rejectText', 1);
      blankExpected.rejectText.forEach(function (value, idx) {
        requireString(value, path + '.rejectText[' + idx + ']');
      });
    }
  }

  function validateExpected(task, interactionInfo) {
    interactionInfo = interactionInfo || {};
    var optionIds = interactionInfo.optionIds || {};
    var expected = task.expected;
    assert(isObject(expected), task.id + '.expected is required');
    requireString(expected.kind, task.id + '.expected.kind');

    if (task.family === 'choice' || task.family === 'table_value_selection') {
      if (task.family === 'table_value_selection' && expected.kind === 'advisory_choice') {
        requireArray(expected.values, task.id + '.expected.values', 1);
        expected.values.forEach(function (value, idx) {
          requireString(value, task.id + '.expected.values[' + idx + ']');
          assert(optionIds[value], task.id + '.expected.values[' + idx + '] must match an option id');
        });
        return;
      }
      assert(expected.kind === 'choice', task.id + '.expected.kind must be choice');
      requireString(expected.value, task.id + '.expected.value');
      assert(optionIds[expected.value], task.id + '.expected.value must match an option id');
      return;
    }

    if (task.family === 'multi_select') {
      assert(expected.kind === 'multi_select', task.id + '.expected.kind must be multi_select');
      assert(expected.mode === 'exact_set', task.id + '.expected.mode must be exact_set');
      requireArray(expected.values, task.id + '.expected.values', 2);
      var seenMultiValues = {};
      expected.values.forEach(function (value, idx) {
        requireString(value, task.id + '.expected.values[' + idx + ']');
        assert(optionIds[value], task.id + '.expected.values[' + idx + '] must match an option id');
        assert(!seenMultiValues[value], task.id + '.expected.values contains duplicate option ' + value);
        seenMultiValues[value] = true;
      });
      assert(Object.keys(optionIds).length > expected.values.length, task.id + '.interaction.options must include at least one distractor option');
      if (expected.partialFeedback !== undefined) {
        assert(expected.partialFeedback === 'practice_only', task.id + '.expected.partialFeedback must be practice_only when present');
      }
      return;
    }

    if (task.family === 'matching_pairs') {
      assert(expected.kind === 'matching_pairs', task.id + '.expected.kind must be matching_pairs');
      requireArray(expected.pairs, task.id + '.expected.pairs', 2);
      var leftIds = interactionInfo.leftIds || {};
      var rightIds = interactionInfo.rightIds || {};
      var answerLeftIds = interactionInfo.answerLeftIds || [];
      var answerLeftSet = {};
      answerLeftIds.forEach(function (leftId) {
        answerLeftSet[leftId] = true;
      });
      var answerRightIds = interactionInfo.answerRightIds || [];
      var answerRightSet = {};
      answerRightIds.forEach(function (rightId) {
        answerRightSet[rightId] = true;
      });
      var seenExpectedLeft = {};
      var seenExpectedRight = {};
      var seenExpectedPair = {};
      expected.pairs.forEach(function (pair, idx) {
        assert(Array.isArray(pair) && pair.length === 2, task.id + '.expected.pairs[' + idx + '] must be [leftId, rightId]');
        requireString(pair[0], task.id + '.expected.pairs[' + idx + '][0]');
        requireString(pair[1], task.id + '.expected.pairs[' + idx + '][1]');
        assert(leftIds[pair[0]], task.id + '.expected.pairs[' + idx + '][0] must match a left item');
        assert(answerLeftSet[pair[0]], task.id + '.expected.pairs[' + idx + '][0] must be an answer left item');
        assert(rightIds[pair[1]], task.id + '.expected.pairs[' + idx + '][1] must match a right item');
        assert(answerRightSet[pair[1]], task.id + '.expected.pairs[' + idx + '][1] must be an answer right item');
        assert(!seenExpectedLeft[pair[0]], task.id + '.expected.pairs uses left item more than once');
        assert(!seenExpectedRight[pair[1]], task.id + '.expected.pairs uses right item more than once');
        seenExpectedLeft[pair[0]] = true;
        seenExpectedRight[pair[1]] = true;
        var pairKey = pair[0] + '\u0001' + pair[1];
        assert(!seenExpectedPair[pairKey], task.id + '.expected.pairs contains a duplicate left-right pair');
        seenExpectedPair[pairKey] = true;
      });
      assert(expected.pairs.length === answerLeftIds.length, task.id + '.expected.pairs must include all answer left items');
      assert(expected.pairs.length === answerRightIds.length, task.id + '.expected.pairs must include all answer right items');
      answerLeftIds.forEach(function (leftId) {
        assert(seenExpectedLeft[leftId], task.id + '.expected.pairs missing answer left item ' + leftId);
      });
      answerRightIds.forEach(function (rightId) {
        assert(seenExpectedRight[rightId], task.id + '.expected.pairs missing answer right item ' + rightId);
      });
      if (expected.partialFeedback !== undefined) {
        assert(expected.partialFeedback === 'practice_only', task.id + '.expected.partialFeedback must be practice_only when present');
      }
      return;
    }

    if (task.family === 'numeric_input' || task.family === 'graph_reading') {
      assert(expected.kind === 'number', task.id + '.expected.kind must be number');
      assert(isNumber(expected.value), task.id + '.expected.value must be numeric');
      if (expected.tolerance !== undefined) assert(isNumber(expected.tolerance), task.id + '.expected.tolerance must be numeric');
      optionalString(expected.unit, task.id + '.expected.unit');
      if (task.family === 'graph_reading' && expected.interval !== undefined) {
        assert(isObject(expected.interval), task.id + '.expected.interval must be an object');
        assert(expected.interval.kind === 'choice', task.id + '.expected.interval.kind must be choice');
        requireString(expected.interval.value, task.id + '.expected.interval.value');
        assert((interactionInfo.intervalOptionIds || {})[expected.interval.value], task.id + '.expected.interval.value must match an interval option id');
      }
      return;
    }

    if (task.family === 'final_answer_entry') {
      assert(expected.kind === 'number' || expected.kind === 'text', task.id + '.expected.kind must be number or text');
      if (expected.kind === 'number') {
        assert(isNumber(expected.value), task.id + '.expected.value must be numeric');
        if (expected.tolerance !== undefined) assert(isNumber(expected.tolerance), task.id + '.expected.tolerance must be numeric');
      } else {
        requireArray(expected.accepted, task.id + '.expected.accepted', 1);
      }
      return;
    }

    if (task.family === 'unit_notation_field') {
      assert(expected.kind === 'text', task.id + '.expected.kind must be text');
      requireArray(expected.accepted, task.id + '.expected.accepted', 1);
      return;
    }

    if (task.family === 'point_placement') {
      assert(expected.kind === 'point', task.id + '.expected.kind must be point');
      assert(isNumber(expected.x), task.id + '.expected.x must be numeric');
      assert(isNumber(expected.y), task.id + '.expected.y must be numeric');
      if (expected.toleranceX !== undefined) assert(isNumber(expected.toleranceX), task.id + '.expected.toleranceX must be numeric');
      if (expected.toleranceY !== undefined) assert(isNumber(expected.toleranceY), task.id + '.expected.toleranceY must be numeric');
      return;
    }

    if (task.family === 'calculation_work_capture' && expected.kind === 'calculation') {
      assert(isObject(expected.finalAnswer), task.id + '.expected.finalAnswer is required');
      assert(
        expected.finalAnswer.kind === 'number' || expected.finalAnswer.kind === 'text',
        task.id + '.expected.finalAnswer.kind must be number or text'
      );
      if (expected.finalAnswer.kind === 'number') {
        assert(isNumber(expected.finalAnswer.value), task.id + '.expected.finalAnswer.value must be numeric');
        if (expected.finalAnswer.tolerance !== undefined) {
          assert(isNumber(expected.finalAnswer.tolerance), task.id + '.expected.finalAnswer.tolerance must be numeric');
        }
        if (expected.finalAnswer.acceptedNotations !== undefined) {
          requireStringArray(expected.finalAnswer.acceptedNotations, task.id + '.expected.finalAnswer.acceptedNotations', 1);
        }
      } else {
        requireArray(expected.finalAnswer.accepted, task.id + '.expected.finalAnswer.accepted', 1);
      }
      if (expected.workRequired !== undefined) {
        assert(typeof expected.workRequired === 'boolean', task.id + '.expected.workRequired must be boolean');
      }
      if (expected.criteria !== undefined) requireArray(expected.criteria, task.id + '.expected.criteria', 1);
      if (expected.requiredWorkText !== undefined) validateTextGroups(expected.requiredWorkText, task.id + '.expected.requiredWorkText');
      if (expected.acceptedWorkPaths !== undefined) validateAcceptedWorkPaths(expected.acceptedWorkPaths, task.id + '.expected.acceptedWorkPaths');
      if (expected.unitNotation !== undefined) {
        validateUnitNotation(expected.unitNotation, task.id + '.expected.unitNotation');
        requireString(task.interaction.unitNotationLabel, task.id + '.interaction.unitNotationLabel');
      }
      if (task.interaction.selectionMode === 'percentage_claim_control') {
        validatePercentageClaimExpected(task, interactionInfo);
      }
      return;
    }

    if (task.family === 'calculation_answer_form_capture') {
      validateCalculationAnswerFormExpected(task, interactionInfo);
      return;
    }

    if (
      (task.family === 'short_constructed_response' || task.family === 'structured_reasoning') &&
      expected.kind === 'text_criteria'
    ) {
      requireArray(expected.criteria, task.id + '.expected.criteria', 1);
      validateTextGroups(expected.requiredText, task.id + '.expected.requiredText');
      if (expected.rejectText !== undefined) requireArray(expected.rejectText, task.id + '.expected.rejectText', 1);
      return;
    }

    if (task.family === 'structured_short_response' && expected.kind === 'structured_text_criteria') {
      requireArray(expected.criteria, task.id + '.expected.criteria', 1);
      requireArray(expected.fields, task.id + '.expected.fields', 1);
      var interactionFieldIds = {};
      (task.interaction.fields || []).forEach(function (field) {
        interactionFieldIds[field.id] = true;
      });
      expected.fields.forEach(function (field, idx) {
        assert(isObject(field), task.id + '.expected.fields[' + idx + '] must be an object');
        requireString(field.id, task.id + '.expected.fields[' + idx + '].id');
        assert(interactionFieldIds[field.id], task.id + '.expected.fields[' + idx + '].id must match an interaction field');
        requireArray(field.accepted, task.id + '.expected.fields[' + idx + '].accepted', 1);
        if (field.rejectText !== undefined) requireArray(field.rejectText, task.id + '.expected.fields[' + idx + '].rejectText', 1);
      });
      if (expected.choice !== undefined) {
        assert(isObject(expected.choice), task.id + '.expected.choice must be an object');
        requireString(expected.choice.value, task.id + '.expected.choice.value');
        assert(optionIds[expected.choice.value], task.id + '.expected.choice.value must match an option id');
      }
      return;
    }

    if (task.family === 'cloze_text') {
      assert(expected.kind === 'cloze_text', task.id + '.expected.kind must be cloze_text');
      assert(isObject(expected.blanks), task.id + '.expected.blanks must be an object');
      var clozeTextExpectedBlankIds = Object.keys(expected.blanks);
      var clozeTextInteractionBlankIds = interactionInfo.blankIds || {};
      var clozeTextActualBlankIds = Object.keys(clozeTextInteractionBlankIds);
      assert(clozeTextExpectedBlankIds.length === clozeTextActualBlankIds.length, task.id + '.expected.blanks must match all interaction blanks');
      clozeTextActualBlankIds.forEach(function (blankId) {
        assert(Object.prototype.hasOwnProperty.call(expected.blanks, blankId), task.id + '.expected.blanks missing ' + blankId);
        validateClozeTextExpectedBlank(expected.blanks[blankId], task.id + '.expected.blanks.' + blankId);
      });
      clozeTextExpectedBlankIds.forEach(function (blankId) {
        assert(clozeTextInteractionBlankIds[blankId], task.id + '.expected.blanks contains unknown blank ' + blankId);
      });
      return;
    }

    if (task.family === 'cloze_tile_select') {
      assert(expected.kind === 'cloze_tile_select', task.id + '.expected.kind must be cloze_tile_select');
      assert(isObject(expected.blanks), task.id + '.expected.blanks must be an object');
      var expectedBlankIds = Object.keys(expected.blanks);
      var interactionBlankIds = interactionInfo.blankIds || {};
      var interactionTileIds = interactionInfo.tileIds || {};
      var actualBlankIds = Object.keys(interactionBlankIds);
      assert(expectedBlankIds.length === actualBlankIds.length, task.id + '.expected.blanks must match all interaction blanks');
      var seenTiles = {};
      actualBlankIds.forEach(function (blankId) {
        assert(Object.prototype.hasOwnProperty.call(expected.blanks, blankId), task.id + '.expected.blanks missing ' + blankId);
        requireString(expected.blanks[blankId], task.id + '.expected.blanks.' + blankId);
        assert(interactionTileIds[expected.blanks[blankId]], task.id + '.expected.blanks.' + blankId + ' must match an interaction tile');
        if (!interactionInfo.allowReuse) {
          assert(!seenTiles[expected.blanks[blankId]], task.id + '.expected.blanks uses tile more than once without allowReuse');
          seenTiles[expected.blanks[blankId]] = true;
        }
      });
      expectedBlankIds.forEach(function (blankId) {
        assert(interactionBlankIds[blankId], task.id + '.expected.blanks contains unknown blank ' + blankId);
      });
      return;
    }

    if (task.family === 'sentence_builder') {
      assert(expected.kind === 'sentence_builder', task.id + '.expected.kind must be sentence_builder');
      requireArray(expected.tokens, task.id + '.expected.tokens', 1);
      requireArray(expected.acceptedSequences, task.id + '.expected.acceptedSequences', 1);
      var tokenIds = interactionInfo.tokenIds || {};

      function validateSequence(sequence, path) {
        requireArray(sequence, path, 1);
        var seen = {};
        sequence.forEach(function (tokenId, idx) {
          requireString(tokenId, path + '[' + idx + ']');
          assert(tokenIds[tokenId], path + '[' + idx + '] must match an interaction token');
          if (!interactionInfo.allowReuse) {
            assert(!seen[tokenId], path + ' uses token more than once without allowReuse');
            seen[tokenId] = true;
          }
        });
      }

      validateSequence(expected.tokens, task.id + '.expected.tokens');
      var canonical = expected.tokens.join('\u0001');
      var includesCanonical = false;
      expected.acceptedSequences.forEach(function (sequence, idx) {
        validateSequence(sequence, task.id + '.expected.acceptedSequences[' + idx + ']');
        if (sequence.join('\u0001') === canonical) includesCanonical = true;
      });
      assert(includesCanonical, task.id + '.expected.acceptedSequences must include expected.tokens');
      return;
    }

    if (task.family === 'formula_builder') {
      assert(expected.kind === 'formula_builder', task.id + '.expected.kind must be formula_builder');
      requireArray(expected.tokens, task.id + '.expected.tokens', 1);
      requireArray(expected.acceptedSequences, task.id + '.expected.acceptedSequences', 1);
      var formulaTokenIds = interactionInfo.tokenIds || {};

      function validateFormulaSequence(sequence, path) {
        requireArray(sequence, path, 1);
        var seen = {};
        sequence.forEach(function (tokenId, idx) {
          requireString(tokenId, path + '[' + idx + ']');
          assert(formulaTokenIds[tokenId], path + '[' + idx + '] must match an interaction token');
          if (!interactionInfo.allowReuse) {
            assert(!seen[tokenId], path + ' uses token more than once without allowReuse');
            seen[tokenId] = true;
          }
        });
      }

      validateFormulaSequence(expected.tokens, task.id + '.expected.tokens');
      var formulaCanonical = expected.tokens.join('\u0001');
      var formulaIncludesCanonical = false;
      expected.acceptedSequences.forEach(function (sequence, idx) {
        validateFormulaSequence(sequence, task.id + '.expected.acceptedSequences[' + idx + ']');
        if (sequence.join('\u0001') === formulaCanonical) formulaIncludesCanonical = true;
      });
      assert(formulaIncludesCanonical, task.id + '.expected.acceptedSequences must include expected.tokens');
      return;
    }

    if (task.family === 'step_ordering') {
      assert(expected.kind === 'step_ordering', task.id + '.expected.kind must be step_ordering');
      requireArray(expected.order, task.id + '.expected.order', 2);
      var stepIds = interactionInfo.stepIds || {};
      var answerStepIds = interactionInfo.answerStepIds || [];
      var answerStepSet = {};
      answerStepIds.forEach(function (stepId) {
        answerStepSet[stepId] = true;
      });
      var seenSteps = {};
      expected.order.forEach(function (stepId, idx) {
        requireString(stepId, task.id + '.expected.order[' + idx + ']');
        assert(stepIds[stepId], task.id + '.expected.order[' + idx + '] must match an interaction step');
        assert(answerStepSet[stepId], task.id + '.expected.order[' + idx + '] must be an answer step');
        assert(!seenSteps[stepId], task.id + '.expected.order uses step more than once');
        seenSteps[stepId] = true;
      });
      assert(expected.order.length === answerStepIds.length, task.id + '.expected.order must include all answer steps');
      answerStepIds.forEach(function (stepId) {
        assert(seenSteps[stepId], task.id + '.expected.order missing answer step ' + stepId);
      });
      if (expected.partialFeedback !== undefined) {
        assert(expected.partialFeedback === 'practice_only', task.id + '.expected.partialFeedback must be practice_only when present');
      }
      return;
    }

    if (task.family === 'two_tier_choice') {
      assert(expected.kind === 'two_tier_choice', task.id + '.expected.kind must be two_tier_choice');
      requireString(expected.answer, task.id + '.expected.answer');
      requireString(expected.reason, task.id + '.expected.reason');
      var answerOptionIds = interactionInfo.answerOptionIds || {};
      var reasonOptionIds = interactionInfo.reasonOptionIds || {};
      assert(answerOptionIds[expected.answer], task.id + '.expected.answer must match an answer option id');
      assert(reasonOptionIds[expected.reason], task.id + '.expected.reason must match a reason option id');
      if (expected.partialFeedback !== undefined) {
        assert(expected.partialFeedback === 'practice_only', task.id + '.expected.partialFeedback must be practice_only when present');
      }
      return;
    }

    if (task.family === 'assertion_reason') {
      assert(expected.kind === 'assertion_reason', task.id + '.expected.kind must be assertion_reason');
      requireString(expected.value, task.id + '.expected.value');
      var assertionOptionIds = interactionInfo.assertionOptionIds || {};
      assert(assertionOptionIds[expected.value], task.id + '.expected.value must match an assertion-reason option id');
      if (expected.partialFeedback !== undefined) {
        assert(expected.partialFeedback === 'practice_only', task.id + '.expected.partialFeedback must be practice_only when present');
      }
      return;
    }

    if (task.family === 'source_value_selection') {
      assert(expected.kind === 'source_value_selection', task.id + '.expected.kind must be source_value_selection');
      requireArray(expected.selections, task.id + '.expected.selections', 2);
      var sourceValueIds = interactionInfo.valueIds || {};
      var answerValueIds = interactionInfo.answerValueIds || [];
      var answerValueSet = {};
      answerValueIds.forEach(function (valueId) {
        answerValueSet[valueId] = true;
      });
      var sourceRoleIds = interactionInfo.roleIds || {};
      var seenExpectedValues = {};
      var seenExpectedPairs = {};
      expected.selections.forEach(function (selection, idx) {
        assert(isObject(selection), task.id + '.expected.selections[' + idx + '] must be an object');
        requireString(selection.valueId, task.id + '.expected.selections[' + idx + '].valueId');
        requireString(selection.role, task.id + '.expected.selections[' + idx + '].role');
        assert(sourceValueIds[selection.valueId], task.id + '.expected.selections[' + idx + '].valueId must match an interaction value');
        assert(answerValueSet[selection.valueId], task.id + '.expected.selections[' + idx + '].valueId must be an answer value');
        assert(sourceRoleIds[selection.role], task.id + '.expected.selections[' + idx + '].role must match an interaction role');
        assert(!seenExpectedValues[selection.valueId], task.id + '.expected.selections uses source value more than once');
        seenExpectedValues[selection.valueId] = true;
        var expectedPairKey = selection.valueId + '\u0001' + selection.role;
        assert(!seenExpectedPairs[expectedPairKey], task.id + '.expected.selections contains a duplicate value-role pair');
        seenExpectedPairs[expectedPairKey] = true;
      });
      assert(expected.selections.length === answerValueIds.length, task.id + '.expected.selections must include all answer values');
      answerValueIds.forEach(function (valueId) {
        assert(seenExpectedValues[valueId], task.id + '.expected.selections missing answer value ' + valueId);
      });
      if (expected.partialFeedback !== undefined) {
        assert(expected.partialFeedback === 'practice_only', task.id + '.expected.partialFeedback must be practice_only when present');
      }
      return;
    }

    if (task.family === 'source_chain_builder') {
      assert(expected.kind === 'source_chain_builder', task.id + '.expected.kind must be source_chain_builder');
      requireArray(expected.chain, task.id + '.expected.chain', 5);
      var sourceNodeIds = interactionInfo.nodeIds || {};
      var answerNodeIds = interactionInfo.answerNodeIds || [];
      var answerNodeSet = {};
      answerNodeIds.forEach(function (nodeId) {
        answerNodeSet[nodeId] = true;
      });
      var seenExpectedNodes = {};
      expected.chain.forEach(function (nodeId, idx) {
        requireString(nodeId, task.id + '.expected.chain[' + idx + ']');
        assert(sourceNodeIds[nodeId], task.id + '.expected.chain[' + idx + '] must match an interaction node');
        assert(answerNodeSet[nodeId], task.id + '.expected.chain[' + idx + '] must be an answer node');
        assert(!seenExpectedNodes[nodeId], task.id + '.expected.chain uses node more than once');
        seenExpectedNodes[nodeId] = true;
      });
      assert(expected.chain.length === answerNodeIds.length, task.id + '.expected.chain must include all answer nodes');
      answerNodeIds.forEach(function (nodeId) {
        assert(seenExpectedNodes[nodeId], task.id + '.expected.chain missing answer node ' + nodeId);
      });
      if (expected.partialFeedback !== undefined) {
        assert(expected.partialFeedback === 'practice_only', task.id + '.expected.partialFeedback must be practice_only when present');
      }
      return;
    }

    if (task.family === 'label_placement') {
      assert(expected.kind === 'label_placement', task.id + '.expected.kind must be label_placement');
      requireArray(expected.placements, task.id + '.expected.placements', 2);
      var labelIds = interactionInfo.labelIds || {};
      var answerLabelIds = interactionInfo.answerLabelIds || [];
      var answerLabelSet = {};
      answerLabelIds.forEach(function (labelId) {
        answerLabelSet[labelId] = true;
      });
      var targetIds = interactionInfo.targetIds || {};
      var answerTargetIds = interactionInfo.answerTargetIds || [];
      var answerTargetSet = {};
      answerTargetIds.forEach(function (targetId) {
        answerTargetSet[targetId] = true;
      });
      var seenExpectedLabels = {};
      var seenExpectedTargets = {};
      var seenExpectedPairs = {};
      expected.placements.forEach(function (placement, idx) {
        assert(isObject(placement), task.id + '.expected.placements[' + idx + '] must be an object');
        requireString(placement.labelId, task.id + '.expected.placements[' + idx + '].labelId');
        requireString(placement.targetId, task.id + '.expected.placements[' + idx + '].targetId');
        assert(labelIds[placement.labelId], task.id + '.expected.placements[' + idx + '].labelId must match an interaction label');
        assert(answerLabelSet[placement.labelId], task.id + '.expected.placements[' + idx + '].labelId must be an answer label');
        assert(targetIds[placement.targetId], task.id + '.expected.placements[' + idx + '].targetId must match an interaction target');
        assert(answerTargetSet[placement.targetId], task.id + '.expected.placements[' + idx + '].targetId must be an answer target');
        assert(!seenExpectedLabels[placement.labelId], task.id + '.expected.placements uses label more than once');
        assert(!seenExpectedTargets[placement.targetId], task.id + '.expected.placements uses target more than once');
        seenExpectedLabels[placement.labelId] = true;
        seenExpectedTargets[placement.targetId] = true;
        var placementKey = placement.labelId + '\u0001' + placement.targetId;
        assert(!seenExpectedPairs[placementKey], task.id + '.expected.placements contains a duplicate label-target pair');
        seenExpectedPairs[placementKey] = true;
      });
      assert(expected.placements.length === answerLabelIds.length, task.id + '.expected.placements must include all answer labels');
      assert(expected.placements.length === answerTargetIds.length, task.id + '.expected.placements must include all answer targets');
      answerLabelIds.forEach(function (labelId) {
        assert(seenExpectedLabels[labelId], task.id + '.expected.placements missing answer label ' + labelId);
      });
      answerTargetIds.forEach(function (targetId) {
        assert(seenExpectedTargets[targetId], task.id + '.expected.placements missing answer target ' + targetId);
      });
      if (expected.partialFeedback !== undefined) {
        assert(expected.partialFeedback === 'practice_only', task.id + '.expected.partialFeedback must be practice_only when present');
      }
      return;
    }

    if (task.family === 'graph_construction_substitute') {
      assert(expected.kind === 'graph_construction_substitute', task.id + '.expected.kind must be graph_construction_substitute');
      assert(isObject(expected.axes), task.id + '.expected.axes must be an object');
      requireStringArray(expected.axes.xAccepted, task.id + '.expected.axes.xAccepted', 1);
      requireStringArray(expected.axes.yAccepted, task.id + '.expected.axes.yAccepted', 1);
      requireArray(expected.points, task.id + '.expected.points', 2);
      validateGraphExpectedPoints(expected.points, task.id + '.expected.points');
      if (expected.acceptedTablePoints !== undefined) {
        requireArray(expected.acceptedTablePoints, task.id + '.expected.acceptedTablePoints', 2);
        validateGraphExpectedPoints(expected.acceptedTablePoints, task.id + '.expected.acceptedTablePoints');
      }
      if (expected.pointPolicy !== undefined) {
        assert(expected.pointPolicy === 'straight_line_two_distinct_table_points', task.id + '.expected.pointPolicy must be straight_line_two_distinct_table_points when present');
      }
      if (expected.minimumPointCount !== undefined) {
        assert(Number.isInteger(expected.minimumPointCount) && expected.minimumPointCount >= 2, task.id + '.expected.minimumPointCount must be an integer >= 2');
      }
      var requiredPointCount = expected.minimumPointCount || expected.points.length;
      assert(requiredPointCount === interactionInfo.pointCount, task.id + '.expected minimum point count must match interaction.pointCount');
      if (expected.acceptedTablePoints !== undefined) {
        assert(expected.acceptedTablePoints.length >= requiredPointCount, task.id + '.expected.acceptedTablePoints must include enough accepted points');
      }
      if (expected.toleranceX !== undefined) assert(isNumber(expected.toleranceX), task.id + '.expected.toleranceX must be numeric');
      if (expected.toleranceY !== undefined) assert(isNumber(expected.toleranceY), task.id + '.expected.toleranceY must be numeric');
      assert(/^(decreasing|increasing|constant)$/.test(expected.lineShape), task.id + '.expected.lineShape must be decreasing, increasing, or constant');
      return;
    }

    if (isSelfCheckFamily(task.family)) {
      assert(expected.kind === 'self_check', task.id + '.expected.kind must be self_check');
      requireArray(expected.criteria, task.id + '.expected.criteria', 1);
      return;
    }

    throw new Error(task.family + ' is not supported');
  }

  function validateTextGroups(groups, path) {
    requireArray(groups, path, 1);
    groups.forEach(function (group, idx) {
      assert(isObject(group), path + '[' + idx + '] must be an object');
      requireString(group.label, path + '[' + idx + '].label');
      requireArray(group.any, path + '[' + idx + '].any', 1);
    });
  }

  function validateGraphExpectedPoints(points, path) {
    points.forEach(function (point, idx) {
      assert(isObject(point), path + '[' + idx + '] must be an object');
      assert(isNumber(point.x), path + '[' + idx + '].x must be numeric');
      assert(isNumber(point.y), path + '[' + idx + '].y must be numeric');
    });
  }

  function validateAcceptedWorkPaths(paths, path) {
    requireArray(paths, path, 1);
    paths.forEach(function (workPath, idx) {
      assert(isObject(workPath), path + '[' + idx + '] must be an object');
      requireString(workPath.id, path + '[' + idx + '].id');
      optionalString(workPath.label, path + '[' + idx + '].label');
      validateTextGroups(workPath.requiredWorkText, path + '[' + idx + '].requiredWorkText');
    });
  }

  function validateInteraction(task) {
    var path = task.id + '.interaction';
    assert(isObject(task.interaction), path + ' is required');
    var interactionInfo = {};

    if (task.family === 'choice' || task.family === 'table_value_selection') {
      interactionInfo.optionIds = validateOptions(task.interaction.options, path + '.options');
    } else if (task.family === 'multi_select') {
      interactionInfo = validateMultiSelectInteraction(task, path);
    } else if (task.family === 'point_placement') {
      requireString(task.interaction.xLabel, path + '.xLabel');
      requireString(task.interaction.yLabel, path + '.yLabel');
    } else if (task.family === 'calculation_work_capture') {
      requireString(task.interaction.workLabel, path + '.workLabel');
      requireString(task.interaction.finalAnswerLabel, path + '.finalAnswerLabel');
      optionalString(task.interaction.finalAnswerPlaceholder, path + '.finalAnswerPlaceholder');
      optionalString(task.interaction.unitNotationLabel, path + '.unitNotationLabel');
      optionalString(task.interaction.unitNotationPlaceholder, path + '.unitNotationPlaceholder');
      if (task.interaction.answerParsers !== undefined) validateAnswerParsers(task.interaction.answerParsers, path + '.answerParsers');
      if (task.interaction.selectionMode !== undefined) {
        assert(/^(interval_halving_check|percentage_claim_control)$/.test(task.interaction.selectionMode), path + '.selectionMode must be interval_halving_check or percentage_claim_control when present');
        if (task.interaction.selectionMode === 'interval_halving_check') {
          validateIntervalHalvingInteraction(task, path);
        } else {
          interactionInfo = validatePercentageClaimInteraction(task, path);
        }
      }
    } else if (task.family === 'calculation_answer_form_capture') {
      interactionInfo = validateCalculationAnswerFormInteraction(task, path);
    } else if (
      task.family === 'numeric_input' ||
      task.family === 'final_answer_entry' ||
      task.family === 'unit_notation_field'
    ) {
      requireString(task.interaction.inputLabel, path + '.inputLabel');
    } else if (task.family === 'graph_reading') {
      interactionInfo = validateGraphReadingInteraction(task, path);
    } else if (task.family === 'short_constructed_response' || task.family === 'structured_reasoning') {
      requireString(task.interaction.inputLabel, path + '.inputLabel');
    } else if (task.family === 'graph_construction_substitute') {
      interactionInfo = validateGraphConstructionInteraction(task, path);
    } else if (task.family === 'structured_short_response') {
      validateStructuredFields(task.interaction.fields, path + '.fields');
      if (task.interaction.options !== undefined) interactionInfo.optionIds = validateOptions(task.interaction.options, path + '.options');
    } else if (task.family === 'cloze_text') {
      interactionInfo = validateClozeTextInteraction(task, path);
    } else if (task.family === 'cloze_tile_select') {
      interactionInfo = validateClozeInteraction(task, path);
    } else if (task.family === 'sentence_builder') {
      interactionInfo = validateSentenceInteraction(task, path);
    } else if (task.family === 'formula_builder') {
      interactionInfo = validateFormulaInteraction(task, path);
    } else if (task.family === 'step_ordering') {
      interactionInfo = validateStepOrderingInteraction(task, path);
    } else if (task.family === 'matching_pairs') {
      interactionInfo = validateMatchingPairsInteraction(task, path);
    } else if (task.family === 'two_tier_choice') {
      interactionInfo = validateTwoTierInteraction(task, path);
    } else if (task.family === 'assertion_reason') {
      interactionInfo = validateAssertionReasonInteraction(task, path);
    } else if (task.family === 'source_value_selection') {
      interactionInfo = validateSourceValueInteraction(task, path);
    } else if (task.family === 'source_chain_builder') {
      interactionInfo = validateSourceChainInteraction(task, path);
    } else if (task.family === 'label_placement') {
      interactionInfo = validateLabelPlacementInteraction(task, path);
    }

    return interactionInfo;
  }

  function validateTask(task) {
    assert(isObject(task), 'task must be an object');
    requireString(task.id, 'task.id');
    requireString(task.family, task.id + '.family');
    assert(FAMILIES[task.family], task.id + '.family is not supported');
    requireString(task.skillLabel, task.id + '.skillLabel');
    requireString(task.prompt, task.id + '.prompt');
    optionalString(task.purpose, task.id + '.purpose');
    validateTaskContextRefs(task);
    if (task.hints !== undefined) validateHints(task.hints, task.id + '.hints');
    var optionIds = validateInteraction(task);
    validateExpected(task, optionIds);
    validateFeedback(task);
    validatePracticeRoute(task.practiceRoute, task.id + '.practiceRoute');

    var violations = findStudentTextViolations(task);
    assert(violations.length === 0, task.id + ' student-facing text has blocked terms or internal codes');
    return true;
  }

  function validateTaskSet(data) {
    assert(isObject(data), 'task shell data must be an object');
    assert(data.schema_version === 1, 'task shell data must use schema_version 1');
    requireString(data.title, 'title');
    optionalString(data.surfaceKind, 'surfaceKind');
    requireArray(data.tasks, 'tasks', 1);
    var contextBlockIds = validateContextBlocks(data.contextBlocks);
    var hasContextBlocks = data.contextBlocks !== undefined;
    var contextRefs = {};
    var ids = {};
    data.tasks.forEach(function (task) {
      validateTask(task);
      assert(!ids[task.id], 'duplicate task id: ' + task.id);
      ids[task.id] = true;
      if (data.surfaceKind === 'exit_ticket') {
        assert(!Array.isArray(task.hints) || task.hints.length === 0, task.id + ' exit_ticket tasks must not include hints');
      }
      if (task.contextRefs !== undefined) {
        assert(hasContextBlocks, task.id + '.contextRefs require contextBlocks');
        task.contextRefs.forEach(function (ref) {
          assert(contextBlockIds[ref], task.id + '.contextRefs contains unknown block: ' + ref);
          contextRefs[ref] = true;
        });
      } else if (hasContextBlocks) {
        assert(false, task.id + '.contextRefs is required when contextBlocks are present');
      }
    });
    Object.keys(contextBlockIds).forEach(function (id) {
      assert(contextRefs[id], 'context block is not referenced by any task: ' + id);
    });
    return true;
  }

  function textMatches(value, accepted) {
    var normalized = normalizeText(value);
    return (accepted || []).some(function (item) {
      return normalizeText(item) === normalized;
    });
  }

  function numberMatches(value, expected, parserIds) {
    if (typeof value === 'number') {
      return Math.abs(value - expected.value) <= tolerance(expected);
    }
    if (typeof value !== 'string') return false;
    var ids = Array.isArray(parserIds) && parserIds.length ? parserIds : DEFAULT_ANSWER_PARSER_IDS;
    for (var i = 0; i < ids.length; i += 1) {
      var parser = ANSWER_PARSERS[ids[i]];
      if (!parser) continue;
      var actual = parser(value);
      if (isNumber(actual) && Math.abs(actual - expected.value) <= tolerance(expected)) return true;
    }
    return false;
  }

  function pointMatches(value, expected) {
    if (!isObject(value)) return false;
    var x = cleanNumber(value.x);
    var y = cleanNumber(value.y);
    if (!isNumber(x) || !isNumber(y)) return false;
    var tx = isNumber(expected.toleranceX) ? Math.max(0, expected.toleranceX) : tolerance(expected);
    var ty = isNumber(expected.toleranceY) ? Math.max(0, expected.toleranceY) : tolerance(expected);
    return Math.abs(x - expected.x) <= tx && Math.abs(y - expected.y) <= ty;
  }

  function graphConstructionMatches(response, expected) {
    if (!response || typeof response !== 'object') return false;
    var keys = Object.keys(response).sort();
    if (keys.join('\u0001') !== ['axes', 'lineShape', 'points'].join('\u0001')) return false;
    if (!isObject(response.axes)) return false;
    if (!textMatches(response.axes.x, expected.axes.xAccepted)) return false;
    if (!textMatches(response.axes.y, expected.axes.yAccepted)) return false;
    if (normalizeText(response.lineShape) !== normalizeText(expected.lineShape)) return false;
    var expectedPoints = Array.isArray(expected.acceptedTablePoints) ? expected.acceptedTablePoints : expected.points;
    var requiredPointCount = expected.minimumPointCount || expected.points.length;
    if (!Array.isArray(response.points) || response.points.length !== requiredPointCount) return false;
    var tx = isNumber(expected.toleranceX) ? Math.max(0, expected.toleranceX) : tolerance(expected);
    var ty = isNumber(expected.toleranceY) ? Math.max(0, expected.toleranceY) : tolerance(expected);
    var remaining = expectedPoints.map(function (point) {
      return { x: point.x, y: point.y, matched: false };
    });
    var matchedCount = 0;
    for (var i = 0; i < response.points.length; i += 1) {
      var actual = response.points[i];
      if (!isObject(actual)) return false;
      var x = cleanNumber(actual.x);
      var y = cleanNumber(actual.y);
      if (!isNumber(x) || !isNumber(y)) return false;
      var match = remaining.find(function (point) {
        return !point.matched && Math.abs(x - point.x) <= tx && Math.abs(y - point.y) <= ty;
      });
      if (!match) return false;
      match.matched = true;
      matchedCount += 1;
    }
    if (Array.isArray(expected.acceptedTablePoints)) return matchedCount === requiredPointCount;
    return remaining.every(function (point) { return point.matched; });
  }

  function graphReadingMatches(response, task) {
    if (task.expected.interval !== undefined) {
      if (!response || typeof response !== 'object') return false;
      if (normalizeText(response.interval) !== normalizeText(task.expected.interval.value)) return false;
      return numberMatches(response.value, task.expected);
    }
    return numberMatches(response && response.value != null ? response.value : response, task.expected);
  }

  function finalAnswerMatches(value, expected, parserIds) {
    if (!expected || !expected.kind) return false;
    if (expected.kind === 'number') {
      if (expected.acceptedNotations && textMatches(value, expected.acceptedNotations)) return true;
      return numberMatches(value, expected, parserIds);
    }
    if (expected.kind === 'text') return textMatches(value, expected.accepted);
    return false;
  }

  function unitNotationMatches(value, expected) {
    if (!expected) return true;
    if (expected.required === false && !hasValue(value)) return true;
    return textMatches(value, expected.accepted);
  }

  function answerFormFinalMatches(value, expected) {
    if (!expected || !expected.kind) return false;
    if (expected.kind === 'number_or_percent_text') {
      if (textMatches(value, expected.acceptedNotations)) return true;
      return numberMatches(value, { kind: 'number', value: expected.value, tolerance: expected.tolerance || 0 });
    }
    return finalAnswerMatches(value, expected);
  }

  function substitutionFieldMatches(value, expected) {
    if (!expected || !expected.kind) return false;
    if (expected.kind === 'number') return numberMatches(value, expected);
    return textMatches(value, expected.accepted);
  }

  function calculationAnswerFormPartMatches(response, task) {
    response = response || {};
    var expected = task.expected || {};
    var parts = {
      formula: methodTokensMatch(response.methodTokens, expected.methodTokens),
      substitution: false,
      finalAnswer: answerFormFinalMatches(response.finalAnswer, expected.finalAnswer),
      notation: unitNotationMatches(response.notation, expected.notation),
      conclusion: requiredTextGroupsMatch(response.conclusion, expected.conclusion && expected.conclusion.requiredTextGroups)
    };
    var substitution = isObject(response.substitution) ? response.substitution : {};
    parts.substitution = Object.keys(expected.substitution || {}).every(function (fieldId) {
      return substitutionFieldMatches(substitution[fieldId], expected.substitution[fieldId]);
    });
    return parts;
  }

  function calculationAnswerFormMatches(response, task) {
    if (!isObject(response)) return false;
    var keys = Object.keys(response).sort().join('|');
    if (keys !== 'conclusion|finalAnswer|methodTokens|notation|substitution') return false;
    var parts = calculationAnswerFormPartMatches(response, task);
    return parts.formula && parts.substitution && parts.finalAnswer && parts.notation && parts.conclusion;
  }

  function calculationAnswerFormFeedback(response, task) {
    var parts = calculationAnswerFormPartMatches(response, task);
    var labels = [
      { id: 'formula', label: 'Formule of rekenregel' },
      { id: 'substitution', label: 'Bronwaarden in de formule' },
      { id: 'finalAnswer', label: 'Eindantwoord' },
      { id: 'notation', label: 'Eenheid of notatie' },
      { id: 'conclusion', label: 'Contextzin met richting' }
    ];
    return {
      mode: 'practice_only',
      missingParts: labels.filter(function (part) { return !parts[part.id]; }),
      correctParts: labels.filter(function (part) { return parts[part.id]; })
    };
  }

  function textGroupsMatch(value, groups) {
    var normalized = normalizeText(value);
    if (!normalized) return false;
    return (groups || []).every(function (group) {
      return (group.any || []).some(function (accepted) {
        return normalized.indexOf(normalizeText(accepted)) !== -1;
      });
    });
  }

  function acceptedWorkPathMatches(value, paths) {
    return (paths || []).some(function (workPath) {
      return textGroupsMatch(value, workPath.requiredWorkText || []);
    });
  }

  function textCriteriaMatches(value, expected) {
    var normalized = normalizeText(value);
    if (!normalized) return false;
    var rejected = (expected.rejectText || []).some(function (rejectedText) {
      return normalized.indexOf(normalizeText(rejectedText)) !== -1;
    });
    return !rejected && textGroupsMatch(value, expected.requiredText || []);
  }

  function requiredTextGroupsMatch(value, groups) {
    var normalized = normalizeText(value);
    if (!normalized) return false;
    return (groups || []).every(function (group) {
      return (group || []).some(function (accepted) {
        var needle = normalizeText(accepted);
        return needle && normalized.indexOf(needle) !== -1;
      });
    });
  }

  function clozeTextBlankMatches(value, expected) {
    if (typeof value !== 'string') return false;
    var normalized = normalizeText(value);
    if (!normalized) return false;
    var rejected = (expected.rejectText || []).some(function (rejectedText) {
      return normalized.indexOf(normalizeText(rejectedText)) !== -1;
    });
    if (rejected) return false;
    if (expected.accepted && textMatches(value, expected.accepted)) return true;
    if (expected.requiredTextGroups && requiredTextGroupsMatch(value, expected.requiredTextGroups)) return true;
    return false;
  }

  function percentageClaimControlMatches(response, task) {
    if (!response || typeof response !== 'object') return false;
    if (task.expected.workRequired !== false && !hasValue(response.work)) return false;
    if (task.expected.acceptedWorkPaths && !acceptedWorkPathMatches(response.work, task.expected.acceptedWorkPaths)) return false;
    if (!task.expected.acceptedWorkPaths && task.expected.requiredWorkText && !textGroupsMatch(response.work, task.expected.requiredWorkText)) return false;
    if (normalizeText(response.interval) !== normalizeText(task.expected.interval.value)) return false;
    if (!numberMatches(response.oldValue, task.expected.oldValue)) return false;
    if (!numberMatches(response.newValue, task.expected.newValue)) return false;
    if (!formulaBuilderMatches(response.formula, task.expected.formula)) return false;
    if (normalizeText(response.conclusion) !== normalizeText(task.expected.conclusion.value)) return false;
    return finalAnswerMatches(response.finalAnswer, task.expected.finalAnswer, task.interaction && task.interaction.answerParsers) &&
      unitNotationMatches(response.unitNotation, task.expected.unitNotation);
  }

  function clozeTextMatches(response, expected) {
    if (!response || typeof response !== 'object' || !isObject(response.blanks)) return false;
    var keys = Object.keys(response);
    if (keys.length !== 1 || keys[0] !== 'blanks') return false;
    var blanks = response.blanks;
    var expectedBlanks = expected.blanks || {};
    var expectedIds = Object.keys(expectedBlanks);
    var responseIds = Object.keys(blanks || {});
    if (responseIds.some(function (id) { return !Object.prototype.hasOwnProperty.call(expectedBlanks, id); })) {
      return false;
    }
    return expectedIds.every(function (blankId) {
      return clozeTextBlankMatches(blanks[blankId], expectedBlanks[blankId]);
    });
  }

  function structuredTextCriteriaMatches(response, expected) {
    if (!response || typeof response !== 'object') return false;
    var values = response.fields && typeof response.fields === 'object' ? response.fields : response;
    var fieldsMatch = (expected.fields || []).every(function (field) {
      var value = values[field.id];
      if (!textMatches(value, field.accepted)) return false;
      var normalized = normalizeText(value);
      return !(field.rejectText || []).some(function (rejectedText) {
        return normalized.indexOf(normalizeText(rejectedText)) !== -1;
      });
    });
    if (!fieldsMatch) return false;
    if (expected.choice) {
      return normalizeText(response.choice) === normalizeText(expected.choice.value);
    }
    return true;
  }

  function clozeTileMatches(response, expected) {
    if (!response || typeof response !== 'object' || !isObject(response.blanks)) return false;
    var blanks = response.blanks;
    var expectedBlanks = expected.blanks || {};
    var expectedIds = Object.keys(expectedBlanks);
    var responseIds = Object.keys(blanks || {});
    if (responseIds.some(function (id) { return !Object.prototype.hasOwnProperty.call(expectedBlanks, id); })) {
      return false;
    }
    return expectedIds.every(function (blankId) {
      return normalizeText(blanks[blankId]) === normalizeText(expectedBlanks[blankId]);
    });
  }

  function sentenceBuilderMatches(response, expected) {
    if (!response || typeof response !== 'object' || !Array.isArray(response.tokens)) return false;
    var tokens = response.tokens;
    return (expected.acceptedSequences || []).some(function (sequence) {
      if (!Array.isArray(sequence) || sequence.length !== tokens.length) return false;
      for (var i = 0; i < sequence.length; i++) {
        if (normalizeText(tokens[i]) !== normalizeText(sequence[i])) return false;
      }
      return true;
    });
  }

  function formulaBuilderMatches(response, expected) {
    if (!response || typeof response !== 'object' || !Array.isArray(response.tokens)) return false;
    var keys = Object.keys(response);
    if (keys.length !== 1 || keys[0] !== 'tokens') return false;
    var tokens = response.tokens;
    return (expected.acceptedSequences || []).some(function (sequence) {
      if (!Array.isArray(sequence) || sequence.length !== tokens.length) return false;
      for (var i = 0; i < sequence.length; i++) {
        if (normalizeText(tokens[i]) !== normalizeText(sequence[i])) return false;
      }
      return true;
    });
  }

  function stepOrderingMatches(response, expected, stepIds) {
    if (!isObject(response) || !Array.isArray(response.order)) return false;
    var keys = Object.keys(response);
    if (keys.length !== 1 || keys[0] !== 'order') return false;
    var order = response.order;
    if (order.length !== (expected.order || []).length) return false;
    var seen = {};
    for (var i = 0; i < order.length; i++) {
      if (typeof order[i] !== 'string' || !order[i] || seen[order[i]]) return false;
      if (!Object.prototype.hasOwnProperty.call(stepIds, order[i])) return false;
      seen[order[i]] = true;
      if (order[i] !== expected.order[i]) return false;
    }
    return true;
  }

  function matchingPairsMatches(response, expected, leftIds, rightIds) {
    if (!isObject(response) || !Array.isArray(response.pairs)) return false;
    var keys = Object.keys(response);
    if (keys.length !== 1 || keys[0] !== 'pairs') return false;
    var pairs = response.pairs;
    var expectedPairs = expected.pairs || [];
    if (pairs.length !== expectedPairs.length) return false;

    var expectedPairSet = {};
    var seenExpectedLeft = {};
    var seenExpectedRight = {};
    expectedPairs.forEach(function (pair) {
      expectedPairSet[pair[0] + '\u0001' + pair[1]] = true;
      seenExpectedLeft[pair[0]] = true;
      seenExpectedRight[pair[1]] = true;
    });

    var seenSelectedLeft = {};
    var seenSelectedRight = {};
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      if (!Array.isArray(pair) || pair.length !== 2) return false;
      var leftId = pair[0];
      var rightId = pair[1];
      if (typeof leftId !== 'string' || !leftId) return false;
      if (typeof rightId !== 'string' || !rightId) return false;
      if (!Object.prototype.hasOwnProperty.call(leftIds, leftId)) return false;
      if (!Object.prototype.hasOwnProperty.call(rightIds, rightId)) return false;
      if (seenSelectedLeft[leftId]) return false;
      if (seenSelectedRight[rightId]) return false;
      seenSelectedLeft[leftId] = true;
      seenSelectedRight[rightId] = true;
      if (!expectedPairSet[leftId + '\u0001' + rightId]) return false;
    }

    return Object.keys(seenExpectedLeft).every(function (leftId) {
      return seenSelectedLeft[leftId];
    }) && Object.keys(seenExpectedRight).every(function (rightId) {
      return seenSelectedRight[rightId];
    });
  }

  function sourceValueSelectionMatches(response, expected, valueIds, roleIds) {
    if (!isObject(response) || !Array.isArray(response.selections)) return false;
    var keys = Object.keys(response);
    if (keys.length !== 1 || keys[0] !== 'selections') return false;
    var selections = response.selections;
    var expectedSelections = expected.selections || [];
    if (selections.length !== expectedSelections.length) return false;

    var expectedPairs = {};
    var seenExpectedValues = {};
    expectedSelections.forEach(function (selection) {
      expectedPairs[selection.valueId + '\u0001' + selection.role] = true;
      seenExpectedValues[selection.valueId] = true;
    });

    var seenSelectedValues = {};
    for (var i = 0; i < selections.length; i++) {
      var selection = selections[i];
      if (!isObject(selection)) return false;
      var selectionKeys = Object.keys(selection);
      if (selectionKeys.length !== 2 || !Object.prototype.hasOwnProperty.call(selection, 'valueId') || !Object.prototype.hasOwnProperty.call(selection, 'role')) return false;
      if (typeof selection.valueId !== 'string' || !selection.valueId) return false;
      if (typeof selection.role !== 'string' || !selection.role) return false;
      if (!Object.prototype.hasOwnProperty.call(valueIds, selection.valueId)) return false;
      if (!Object.prototype.hasOwnProperty.call(roleIds, selection.role)) return false;
      if (seenSelectedValues[selection.valueId]) return false;
      seenSelectedValues[selection.valueId] = true;
      if (!expectedPairs[selection.valueId + '\u0001' + selection.role]) return false;
    }

    return Object.keys(seenExpectedValues).every(function (valueId) {
      return seenSelectedValues[valueId];
    });
  }

  function sourceChainMatches(response, expected, nodeIds) {
    if (!isObject(response) || !Array.isArray(response.chain)) return false;
    var keys = Object.keys(response);
    if (keys.length !== 1 || keys[0] !== 'chain') return false;
    var chain = response.chain;
    if (chain.length !== (expected.chain || []).length) return false;
    var seen = {};
    for (var i = 0; i < chain.length; i++) {
      if (typeof chain[i] !== 'string' || !chain[i] || seen[chain[i]]) return false;
      if (!Object.prototype.hasOwnProperty.call(nodeIds, chain[i])) return false;
      seen[chain[i]] = true;
      if (chain[i] !== expected.chain[i]) return false;
    }
    return true;
  }

  function labelPlacementMatches(response, expected, labelIds, targetIds) {
    if (!isObject(response) || !Array.isArray(response.placements)) return false;
    var keys = Object.keys(response);
    if (keys.length !== 1 || keys[0] !== 'placements') return false;
    var placements = response.placements;
    var expectedPlacements = expected.placements || [];
    if (placements.length !== expectedPlacements.length) return false;

    var expectedPairs = {};
    var seenExpectedLabels = {};
    var seenExpectedTargets = {};
    expectedPlacements.forEach(function (placement) {
      expectedPairs[placement.labelId + '\u0001' + placement.targetId] = true;
      seenExpectedLabels[placement.labelId] = true;
      seenExpectedTargets[placement.targetId] = true;
    });

    var seenSelectedLabels = {};
    var seenSelectedTargets = {};
    for (var i = 0; i < placements.length; i++) {
      var placement = placements[i];
      if (!isObject(placement)) return false;
      var placementKeys = Object.keys(placement);
      if (placementKeys.length !== 2 || !Object.prototype.hasOwnProperty.call(placement, 'labelId') || !Object.prototype.hasOwnProperty.call(placement, 'targetId')) return false;
      if (typeof placement.labelId !== 'string' || !placement.labelId) return false;
      if (typeof placement.targetId !== 'string' || !placement.targetId) return false;
      if (!Object.prototype.hasOwnProperty.call(labelIds, placement.labelId)) return false;
      if (!Object.prototype.hasOwnProperty.call(targetIds, placement.targetId)) return false;
      if (seenSelectedLabels[placement.labelId]) return false;
      if (seenSelectedTargets[placement.targetId]) return false;
      seenSelectedLabels[placement.labelId] = true;
      seenSelectedTargets[placement.targetId] = true;
      if (!expectedPairs[placement.labelId + '\u0001' + placement.targetId]) return false;
    }

    return Object.keys(seenExpectedLabels).every(function (labelId) {
      return seenSelectedLabels[labelId];
    }) && Object.keys(seenExpectedTargets).every(function (targetId) {
      return seenSelectedTargets[targetId];
    });
  }

  function normalizeIdSet(values) {
    var out = {};
    for (var i = 0; i < values.length; i++) {
      if (typeof values[i] !== 'string') return null;
      var id = values[i];
      if (!id || out[id]) return null;
      out[id] = true;
    }
    return out;
  }

  function multiSelectMatches(response, expected, optionIds) {
    if (!response || typeof response !== 'object' || !Array.isArray(response.values)) return false;
    var keys = Object.keys(response);
    if (keys.length !== 1 || keys[0] !== 'values') return false;
    var selected = response.values;
    var selectedSet = normalizeIdSet(selected);
    if (!selectedSet) return false;
    for (var i = 0; i < selected.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(optionIds, selected[i])) return false;
    }
    var expectedSet = normalizeIdSet(expected.values || []);
    if (!expectedSet) return false;
    var selectedIds = Object.keys(selectedSet);
    var expectedIds = Object.keys(expectedSet);
    if (selectedIds.length !== expectedIds.length) return false;
    return expectedIds.every(function (id) { return selectedSet[id]; });
  }

  function multiSelectOptionEntry(optionId, labels) {
    return {
      id: optionId,
      label: labels && labels[optionId] ? labels[optionId] : optionId
    };
  }

  function multiSelectFeedback(response, task) {
    if (!task.expected || task.expected.partialFeedback !== 'practice_only') return null;
    var selected = response && response.values && Array.isArray(response.values) ? response.values : [];
    var selectedSet = normalizeIdSet(selected) || {};
    var expectedSet = normalizeIdSet(task.expected.values || []) || {};
    var labels = optionLabelMap(task.interaction && task.interaction.options ? task.interaction.options : []);
    var missingRequired = [];
    var selectedDistractors = [];
    var correctSelected = [];

    Object.keys(expectedSet).forEach(function (optionId) {
      if (selectedSet[optionId]) {
        correctSelected.push(multiSelectOptionEntry(optionId, labels));
      } else {
        missingRequired.push(multiSelectOptionEntry(optionId, labels));
      }
    });
    selected.forEach(function (optionId) {
      if (typeof optionId !== 'string') return;
      if (!expectedSet[optionId]) selectedDistractors.push(multiSelectOptionEntry(optionId, labels));
    });

    return {
      mode: 'practice_only',
      missingRequired: missingRequired,
      selectedDistractors: selectedDistractors,
      correctSelected: correctSelected
    };
  }

  function stepOptionEntry(stepId, labels) {
    return {
      id: stepId,
      label: labels && labels[stepId] ? labels[stepId] : stepId
    };
  }

  function matchingPairEntry(id, labels) {
    return {
      id: id,
      label: labels && labels[id] ? labels[id] : id
    };
  }

  function matchingPairsFeedback(response, task) {
    if (!task.expected || task.expected.partialFeedback !== 'practice_only') return null;
    var pairs = isObject(response) && Array.isArray(response.pairs) ? response.pairs : [];
    var expectedPairs = task.expected.pairs || [];
    var leftLabels = matchingOptionMap(task.interaction && task.interaction.leftItems ? task.interaction.leftItems : []);
    var rightLabels = matchingOptionMap(task.interaction && task.interaction.rightItems ? task.interaction.rightItems : []);
    var leftKinds = {};
    var rightKinds = {};
    var selectedByLeft = {};
    var selectedRight = {};
    var missingLeftItems = [];
    var missingRightItems = [];
    var misplacedPairs = [];
    var selectedDistractorLeftItems = [];
    var selectedDistractorRightItems = [];
    var correctPairs = [];

    (task.interaction.leftItems || []).forEach(function (item) {
      leftKinds[item.id] = item.kind;
    });
    (task.interaction.rightItems || []).forEach(function (item) {
      rightKinds[item.id] = item.kind;
    });
    pairs.forEach(function (pair) {
      if (!Array.isArray(pair) || pair.length !== 2 || typeof pair[0] !== 'string' || typeof pair[1] !== 'string') return;
      if (!selectedByLeft[pair[0]]) selectedByLeft[pair[0]] = pair[1];
      selectedRight[pair[1]] = true;
      if (leftKinds[pair[0]] === 'distractor') {
        selectedDistractorLeftItems.push(matchingPairEntry(pair[0], leftLabels));
      }
      if (rightKinds[pair[1]] === 'distractor') {
        selectedDistractorRightItems.push(matchingPairEntry(pair[1], rightLabels));
      }
    });

    expectedPairs.forEach(function (pair) {
      var leftId = pair[0];
      var rightId = pair[1];
      if (!Object.prototype.hasOwnProperty.call(selectedByLeft, leftId)) {
        missingLeftItems.push(matchingPairEntry(leftId, leftLabels));
        return;
      }
      if (selectedByLeft[leftId] === rightId) {
        correctPairs.push({
          left: matchingPairEntry(leftId, leftLabels),
          right: matchingPairEntry(rightId, rightLabels)
        });
        return;
      }
      misplacedPairs.push({
        left: matchingPairEntry(leftId, leftLabels),
        expectedRight: matchingPairEntry(rightId, rightLabels),
        actualRight: matchingPairEntry(selectedByLeft[leftId], rightLabels)
      });
    });

    expectedPairs.forEach(function (pair) {
      if (!selectedRight[pair[1]]) {
        missingRightItems.push(matchingPairEntry(pair[1], rightLabels));
      }
    });

    return {
      mode: 'practice_only',
      missingLeftItems: missingLeftItems,
      missingRightItems: missingRightItems,
      misplacedPairs: misplacedPairs,
      selectedDistractorLeftItems: selectedDistractorLeftItems,
      selectedDistractorRightItems: selectedDistractorRightItems,
      correctPairs: correctPairs
    };
  }

  function twoTierChoiceMatches(response, expected, answerOptionIds, reasonOptionIds) {
    if (!isObject(response)) return false;
    var keys = Object.keys(response);
    if (keys.length !== 2 || !Object.prototype.hasOwnProperty.call(response, 'answer') || !Object.prototype.hasOwnProperty.call(response, 'reason')) return false;
    if (typeof response.answer !== 'string' || !response.answer) return false;
    if (typeof response.reason !== 'string' || !response.reason) return false;
    if (!Object.prototype.hasOwnProperty.call(answerOptionIds, response.answer)) return false;
    if (!Object.prototype.hasOwnProperty.call(reasonOptionIds, response.reason)) return false;
    return response.answer === expected.answer && response.reason === expected.reason;
  }

  function twoTierOptionEntry(optionId, labels) {
    return {
      id: optionId,
      label: labels && labels[optionId] ? labels[optionId] : optionId
    };
  }

  function twoTierChoiceFeedback(response, task) {
    if (!task.expected || task.expected.partialFeedback !== 'practice_only') return null;
    var answerLabels = optionLabelMap(task.interaction && task.interaction.answerOptions ? task.interaction.answerOptions : []);
    var reasonLabels = optionLabelMap(task.interaction && task.interaction.reasonOptions ? task.interaction.reasonOptions : []);
    var selectedAnswer = isObject(response) && typeof response.answer === 'string' && response.answer
      ? twoTierOptionEntry(response.answer, answerLabels)
      : null;
    var selectedReason = isObject(response) && typeof response.reason === 'string' && response.reason
      ? twoTierOptionEntry(response.reason, reasonLabels)
      : null;
    var answerMatches = Boolean(selectedAnswer && response.answer === task.expected.answer);
    var reasonMatches = Boolean(selectedReason && response.reason === task.expected.reason);
    return {
      mode: 'practice_only',
      selectedAnswer: selectedAnswer,
      selectedReason: selectedReason,
      answerMatches: answerMatches,
      reasonMatches: reasonMatches,
      combinationMatches: answerMatches && reasonMatches
    };
  }

  function assertionReasonMatches(response, expected, optionIds) {
    if (!isObject(response)) return false;
    var keys = Object.keys(response);
    if (keys.length !== 1 || !Object.prototype.hasOwnProperty.call(response, 'value')) return false;
    if (typeof response.value !== 'string' || !response.value) return false;
    if (!Object.prototype.hasOwnProperty.call(optionIds, response.value)) return false;
    return response.value === expected.value;
  }

  function assertionReasonEntry(optionId, labels) {
    return {
      id: optionId,
      label: labels && labels[optionId] ? labels[optionId] : optionId
    };
  }

  function assertionReasonFeedback(response, task) {
    if (!task.expected || task.expected.partialFeedback !== 'practice_only') return null;
    var labels = optionLabelMap(task.interaction && task.interaction.options ? task.interaction.options : []);
    var selected = isObject(response) && typeof response.value === 'string' && response.value
      ? assertionReasonEntry(response.value, labels)
      : null;
    var expected = assertionReasonEntry(task.expected.value, labels);
    return {
      mode: 'practice_only',
      selected: selected,
      expected: expected,
      relationMatches: Boolean(selected && response.value === task.expected.value)
    };
  }

  function stepOrderingFeedback(response, task) {
    if (!task.expected || task.expected.partialFeedback !== 'practice_only') return null;
    var selected = response && Array.isArray(response.order) ? response.order : [];
    var expectedOrder = task.expected.order || [];
    var labels = stepLabelMap(task.interaction && task.interaction.steps ? task.interaction.steps : []);
    var expectedSet = {};
    var selectedSet = {};
    var missingRequired = [];
    var selectedDistractors = [];
    var correctPrefix = [];
    var firstMisplaced = null;
    var prefixStillCorrect = true;

    expectedOrder.forEach(function (stepId) {
      expectedSet[stepId] = true;
    });
    selected.forEach(function (stepId) {
      if (typeof stepId === 'string') selectedSet[stepId] = true;
    });

    expectedOrder.forEach(function (stepId, idx) {
      if (!selectedSet[stepId]) missingRequired.push(stepOptionEntry(stepId, labels));
      if (prefixStillCorrect && selected[idx] === stepId) {
        correctPrefix.push(stepOptionEntry(stepId, labels));
        return;
      }
      if (!firstMisplaced) {
        var actualId = typeof selected[idx] === 'string' ? selected[idx] : '';
        firstMisplaced = {
          expectedId: stepId,
          expectedLabel: labels[stepId] || stepId,
          actualId: actualId,
          actualLabel: actualId ? (labels[actualId] || actualId) : 'Geen stap gekozen'
        };
      }
      prefixStillCorrect = false;
    });

    selected.forEach(function (stepId) {
      if (typeof stepId !== 'string') return;
      if (!expectedSet[stepId]) selectedDistractors.push(stepOptionEntry(stepId, labels));
    });

    return {
      mode: 'practice_only',
      firstMisplaced: firstMisplaced,
      missingRequired: missingRequired,
      selectedDistractors: selectedDistractors,
      correctPrefix: correctPrefix
    };
  }

  function sourceValueEntry(valueId, labels) {
    return {
      id: valueId,
      label: labels && labels[valueId] ? labels[valueId] : valueId
    };
  }

  function sourceRoleEntry(roleId, labels) {
    return {
      id: roleId,
      label: labels && labels[roleId] ? labels[roleId] : roleId
    };
  }

  function sourceValueFeedback(response, task) {
    if (!task.expected || task.expected.partialFeedback !== 'practice_only') return null;
    var selections = isObject(response) && Array.isArray(response.selections) ? response.selections : [];
    var expectedSelections = task.expected.selections || [];
    var labels = sourceValueLabelMap(task.interaction && task.interaction.values ? task.interaction.values : []);
    var roleLabels = sourceRoleLabelMap(task.interaction && task.interaction.roles ? task.interaction.roles : []);
    var expectedByValue = {};
    var selectedByValue = {};
    var missingRequired = [];
    var wrongRoles = [];
    var selectedDistractors = [];
    var correctSelected = [];
    var valueKinds = {};

    (task.interaction.values || []).forEach(function (value) {
      valueKinds[value.id] = value.kind;
    });
    expectedSelections.forEach(function (selection) {
      expectedByValue[selection.valueId] = selection.role;
    });
    selections.forEach(function (selection) {
      if (!isObject(selection) || typeof selection.valueId !== 'string') return;
      if (!selectedByValue[selection.valueId]) selectedByValue[selection.valueId] = selection.role;
      if (valueKinds[selection.valueId] === 'distractor') {
        selectedDistractors.push(sourceValueEntry(selection.valueId, labels));
      }
    });

    expectedSelections.forEach(function (selection) {
      if (!Object.prototype.hasOwnProperty.call(selectedByValue, selection.valueId)) {
        missingRequired.push(sourceValueEntry(selection.valueId, labels));
        return;
      }
      if (selectedByValue[selection.valueId] === selection.role) {
        correctSelected.push(sourceValueEntry(selection.valueId, labels));
        return;
      }
      wrongRoles.push({
        id: selection.valueId,
        label: labels[selection.valueId] || selection.valueId,
        expectedRole: sourceRoleEntry(selection.role, roleLabels),
        actualRole: sourceRoleEntry(selectedByValue[selection.valueId], roleLabels)
      });
    });

    return {
      mode: 'practice_only',
      missingRequired: missingRequired,
      wrongRoles: wrongRoles,
      selectedDistractors: selectedDistractors,
      correctSelected: correctSelected
    };
  }

  function sourceChainEntry(nodeId, labels) {
    return {
      id: nodeId,
      label: labels && labels[nodeId] ? labels[nodeId] : nodeId
    };
  }

  function roleLabel(role) {
    var labels = {
      source: 'bron',
      value: 'waarde',
      operation: 'bewerking',
      answer: 'antwoord',
      conclusion: 'conclusie'
    };
    return labels[role] || role;
  }

  function sourceChainFeedback(response, task) {
    if (!task.expected || task.expected.partialFeedback !== 'practice_only') return null;
    var selected = isObject(response) && Array.isArray(response.chain) ? response.chain : [];
    var expectedChain = task.expected.chain || [];
    var labels = sourceNodeLabelMap(task.interaction && task.interaction.nodes ? task.interaction.nodes : []);
    var expectedSet = {};
    var selectedSet = {};
    var valueKinds = {};
    var nodeRoles = {};
    var missingRequired = [];
    var selectedDistractors = [];
    var correctPrefix = [];
    var missingRequiredRoles = [];
    var firstMisplaced = null;
    var prefixStillCorrect = true;

    (task.interaction.nodes || []).forEach(function (node) {
      valueKinds[node.id] = node.kind;
      nodeRoles[node.id] = node.nodeRole;
    });
    expectedChain.forEach(function (nodeId) {
      expectedSet[nodeId] = true;
    });
    selected.forEach(function (nodeId) {
      if (typeof nodeId === 'string') selectedSet[nodeId] = true;
    });

    expectedChain.forEach(function (nodeId, idx) {
      if (!selectedSet[nodeId]) missingRequired.push(sourceChainEntry(nodeId, labels));
      if (prefixStillCorrect && selected[idx] === nodeId) {
        correctPrefix.push(sourceChainEntry(nodeId, labels));
        return;
      }
      if (!firstMisplaced) {
        var actualId = typeof selected[idx] === 'string' ? selected[idx] : '';
        firstMisplaced = {
          expectedId: nodeId,
          expectedLabel: labels[nodeId] || nodeId,
          actualId: actualId,
          actualLabel: actualId ? (labels[actualId] || actualId) : 'Geen onderdeel gekozen'
        };
      }
      prefixStillCorrect = false;
    });

    selected.forEach(function (nodeId) {
      if (typeof nodeId !== 'string') return;
      if (!expectedSet[nodeId] && valueKinds[nodeId] === 'distractor') {
        selectedDistractors.push(sourceChainEntry(nodeId, labels));
      }
    });

    Object.keys(SOURCE_CHAIN_NODE_ROLES).forEach(function (role) {
      var hasSelectedRole = false;
      selected.forEach(function (nodeId) {
        if (expectedSet[nodeId] && nodeRoles[nodeId] === role) hasSelectedRole = true;
      });
      if (!hasSelectedRole) {
        missingRequiredRoles.push({ id: role, label: roleLabel(role) });
      }
    });

    return {
      mode: 'practice_only',
      firstMisplaced: firstMisplaced,
      missingRequired: missingRequired,
      selectedDistractors: selectedDistractors,
      correctPrefix: correctPrefix,
      missingRequiredRoles: missingRequiredRoles
    };
  }

  function labelPlacementEntry(id, labels) {
    return {
      id: id,
      label: labels && labels[id] ? labels[id] : id
    };
  }

  function labelPlacementFeedback(response, task) {
    if (!task.expected || task.expected.partialFeedback !== 'practice_only') return null;
    var placements = isObject(response) && Array.isArray(response.placements) ? response.placements : [];
    var expectedPlacements = task.expected.placements || [];
    var labelLabels = labelOptionMap(task.interaction && task.interaction.labels ? task.interaction.labels : []);
    var targetLabels = targetOptionMap(task.interaction && task.interaction.targets ? task.interaction.targets : []);
    var labelKinds = {};
    var targetKinds = {};
    var expectedByLabel = {};
    var selectedByLabel = {};
    var selectedTargets = {};
    var missingLabels = [];
    var missingTargets = [];
    var misplacedLabels = [];
    var selectedDistractorLabels = [];
    var selectedDistractorTargets = [];
    var correctPlacements = [];

    (task.interaction.labels || []).forEach(function (label) {
      labelKinds[label.id] = label.kind;
    });
    (task.interaction.targets || []).forEach(function (target) {
      targetKinds[target.id] = target.kind;
    });
    expectedPlacements.forEach(function (placement) {
      expectedByLabel[placement.labelId] = placement.targetId;
    });
    placements.forEach(function (placement) {
      if (!isObject(placement) || typeof placement.labelId !== 'string' || typeof placement.targetId !== 'string') return;
      if (!selectedByLabel[placement.labelId]) selectedByLabel[placement.labelId] = placement.targetId;
      selectedTargets[placement.targetId] = true;
      if (labelKinds[placement.labelId] === 'distractor') {
        selectedDistractorLabels.push(labelPlacementEntry(placement.labelId, labelLabels));
      }
      if (targetKinds[placement.targetId] === 'distractor') {
        selectedDistractorTargets.push(labelPlacementEntry(placement.targetId, targetLabels));
      }
    });

    expectedPlacements.forEach(function (placement) {
      if (!Object.prototype.hasOwnProperty.call(selectedByLabel, placement.labelId)) {
        missingLabels.push(labelPlacementEntry(placement.labelId, labelLabels));
        return;
      }
      if (selectedByLabel[placement.labelId] === placement.targetId) {
        correctPlacements.push({
          label: labelPlacementEntry(placement.labelId, labelLabels),
          target: labelPlacementEntry(placement.targetId, targetLabels)
        });
        return;
      }
      misplacedLabels.push({
        label: labelPlacementEntry(placement.labelId, labelLabels),
        expectedTarget: labelPlacementEntry(placement.targetId, targetLabels),
        actualTarget: labelPlacementEntry(selectedByLabel[placement.labelId], targetLabels)
      });
    });

    expectedPlacements.forEach(function (placement) {
      if (!selectedTargets[placement.targetId]) {
        missingTargets.push(labelPlacementEntry(placement.targetId, targetLabels));
      }
    });

    return {
      mode: 'practice_only',
      missingLabels: missingLabels,
      missingTargets: missingTargets,
      misplacedLabels: misplacedLabels,
      selectedDistractorLabels: selectedDistractorLabels,
      selectedDistractorTargets: selectedDistractorTargets,
      correctPlacements: correctPlacements
    };
  }

  function deterministicMatch(task, response) {
    if (task.family === 'choice' || task.family === 'table_value_selection') {
      if (task.family === 'table_value_selection' && task.expected.kind === 'advisory_choice') {
        var advisoryValues = {};
        (task.expected.values || []).forEach(function (value) { advisoryValues[normalizeText(value)] = true; });
        return Boolean(advisoryValues[normalizeText(response && response.value != null ? response.value : response)]);
      }
      return normalizeText(response && response.value != null ? response.value : response) === normalizeText(task.expected.value);
    }
    if (task.family === 'multi_select') {
      var optionIds = validateOptions(task.interaction.options, task.id + '.interaction.options');
      return multiSelectMatches(response, task.expected, optionIds);
    }
    if (task.family === 'numeric_input') {
      return numberMatches(response && response.value != null ? response.value : response, task.expected);
    }
    if (task.family === 'graph_reading') return graphReadingMatches(response, task);
    if (task.family === 'final_answer_entry') {
      var value = response && response.value != null ? response.value : response;
      return task.expected.kind === 'number' ? numberMatches(value, task.expected) : textMatches(value, task.expected.accepted);
    }
    if (task.family === 'unit_notation_field') {
      return textMatches(response && response.value != null ? response.value : response, task.expected.accepted);
    }
    if (task.family === 'point_placement') {
      return pointMatches(response && response.point ? response.point : response, task.expected);
    }
    if (task.family === 'graph_construction_substitute' && task.expected.kind === 'graph_construction_substitute') {
      return graphConstructionMatches(response, task.expected);
    }
    if (task.family === 'calculation_work_capture' && task.expected.kind === 'calculation') {
      if (!response || typeof response !== 'object') return false;
      if (task.interaction && task.interaction.selectionMode === 'percentage_claim_control') {
        return percentageClaimControlMatches(response, task);
      }
      if (task.expected.workRequired !== false && !hasValue(response.work)) return false;
      if (task.expected.acceptedWorkPaths && !acceptedWorkPathMatches(response.work, task.expected.acceptedWorkPaths)) return false;
      if (!task.expected.acceptedWorkPaths && task.expected.requiredWorkText && !textGroupsMatch(response.work, task.expected.requiredWorkText)) return false;
      return finalAnswerMatches(response.finalAnswer, task.expected.finalAnswer) &&
        unitNotationMatches(response.unitNotation, task.expected.unitNotation);
    }
    if (task.family === 'calculation_answer_form_capture' && task.expected.kind === 'calculation_answer_form') {
      return calculationAnswerFormMatches(response, task);
    }
    if (
      (task.family === 'short_constructed_response' || task.family === 'structured_reasoning') &&
      task.expected.kind === 'text_criteria'
    ) {
      return textCriteriaMatches(response && response.value != null ? response.value : response, task.expected);
    }
    if (task.family === 'structured_short_response' && task.expected.kind === 'structured_text_criteria') {
      return structuredTextCriteriaMatches(response, task.expected);
    }
    if (task.family === 'cloze_text' && task.expected.kind === 'cloze_text') {
      return clozeTextMatches(response, task.expected);
    }
    if (task.family === 'cloze_tile_select' && task.expected.kind === 'cloze_tile_select') {
      return clozeTileMatches(response, task.expected);
    }
    if (task.family === 'sentence_builder' && task.expected.kind === 'sentence_builder') {
      return sentenceBuilderMatches(response, task.expected);
    }
    if (task.family === 'formula_builder' && task.expected.kind === 'formula_builder') {
      return formulaBuilderMatches(response, task.expected);
    }
    if (task.family === 'step_ordering' && task.expected.kind === 'step_ordering') {
      var stepIds = validateStepOrderingInteraction(task, task.id + '.interaction').stepIds;
      return stepOrderingMatches(response, task.expected, stepIds);
    }
    if (task.family === 'matching_pairs' && task.expected.kind === 'matching_pairs') {
      var matchingInfo = validateMatchingPairsInteraction(task, task.id + '.interaction');
      return matchingPairsMatches(response, task.expected, matchingInfo.leftIds, matchingInfo.rightIds);
    }
    if (task.family === 'two_tier_choice' && task.expected.kind === 'two_tier_choice') {
      var twoTierInfo = validateTwoTierInteraction(task, task.id + '.interaction');
      return twoTierChoiceMatches(response, task.expected, twoTierInfo.answerOptionIds, twoTierInfo.reasonOptionIds);
    }
    if (task.family === 'assertion_reason' && task.expected.kind === 'assertion_reason') {
      var assertionInfo = validateAssertionReasonInteraction(task, task.id + '.interaction');
      return assertionReasonMatches(response, task.expected, assertionInfo.assertionOptionIds);
    }
    if (task.family === 'source_value_selection' && task.expected.kind === 'source_value_selection') {
      var sourceValueInfo = validateSourceValueInteraction(task, task.id + '.interaction');
      return sourceValueSelectionMatches(response, task.expected, sourceValueInfo.valueIds, sourceValueInfo.roleIds);
    }
    if (task.family === 'source_chain_builder' && task.expected.kind === 'source_chain_builder') {
      var sourceChainInfo = validateSourceChainInteraction(task, task.id + '.interaction');
      return sourceChainMatches(response, task.expected, sourceChainInfo.nodeIds);
    }
    if (task.family === 'label_placement' && task.expected.kind === 'label_placement') {
      var labelPlacementInfo = validateLabelPlacementInteraction(task, task.id + '.interaction');
      return labelPlacementMatches(response, task.expected, labelPlacementInfo.labelIds, labelPlacementInfo.targetIds);
    }
    return false;
  }

  function evaluateTask(task, response) {
    validateTask(task);

    if (isSelfCheckTask(task)) {
      if (!hasValue(response)) {
        return {
          taskId: task.id,
          family: task.family,
          state: 'retry',
          matched: null,
          feedbackTitle: task.feedback.retryTitle || 'Vul eerst je antwoord in',
          feedbackText: task.feedback.retryText || 'Schrijf je tussenstappen of korte antwoord voordat je jezelf controleert.',
          practiceRoute: clone(task.practiceRoute),
          selfCheckCriteria: clone(task.expected.criteria),
          boundaryFlags: clone(BOUNDARY_FLAGS)
        };
      }
      return {
        taskId: task.id,
        family: task.family,
        state: 'self_check',
        matched: null,
        feedbackTitle: task.feedback.selfCheckTitle,
        feedbackText: task.feedback.selfCheckText,
        practiceRoute: clone(task.practiceRoute),
        selfCheckCriteria: clone(task.expected.criteria),
        boundaryFlags: clone(BOUNDARY_FLAGS)
      };
    }

    var matched = deterministicMatch(task, response);
    var result = {
      taskId: task.id,
      family: task.family,
      state: matched ? 'matched' : 'retry',
      matched: matched,
      feedbackTitle: matched ? task.feedback.matchTitle : task.feedback.retryTitle,
      feedbackText: matched ? task.feedback.matchText : task.feedback.retryText,
      practiceRoute: clone(task.practiceRoute),
      boundaryFlags: clone(BOUNDARY_FLAGS)
    };
    if (task.family === 'multi_select' && !matched) {
      var selectionFeedback = multiSelectFeedback(response, task);
      if (selectionFeedback) result.selectionFeedback = selectionFeedback;
    }
    if (task.family === 'step_ordering' && !matched) {
      var orderFeedback = stepOrderingFeedback(response, task);
      if (orderFeedback) result.orderFeedback = orderFeedback;
    }
    if (task.family === 'matching_pairs' && !matched) {
      var matchFeedback = matchingPairsFeedback(response, task);
      if (matchFeedback) result.matchingPairsFeedback = matchFeedback;
    }
    if (task.family === 'two_tier_choice' && !matched) {
      var twoTierFeedback = twoTierChoiceFeedback(response, task);
      if (twoTierFeedback) result.twoTierFeedback = twoTierFeedback;
    }
    if (task.family === 'assertion_reason' && !matched) {
      var assertionFeedback = assertionReasonFeedback(response, task);
      if (assertionFeedback) result.assertionReasonFeedback = assertionFeedback;
    }
    if (task.family === 'source_value_selection' && !matched) {
      var valueFeedback = sourceValueFeedback(response, task);
      if (valueFeedback) result.sourceValueFeedback = valueFeedback;
    }
    if (task.family === 'source_chain_builder' && !matched) {
      var chainFeedback = sourceChainFeedback(response, task);
      if (chainFeedback) result.sourceChainFeedback = chainFeedback;
    }
    if (task.family === 'label_placement' && !matched) {
      var placementFeedback = labelPlacementFeedback(response, task);
      if (placementFeedback) result.labelPlacementFeedback = placementFeedback;
    }
    if (task.family === 'calculation_answer_form_capture' && !matched) {
      result.answerFormFeedback = calculationAnswerFormFeedback(response, task);
    }
    return result;
  }

  function focusPlan(task) {
    validateTask(task);
    if (task.family === 'choice' || task.family === 'table_value_selection') {
      return ['[data-task-id="' + task.id + '"][data-choice-id]'];
    }
    if (task.family === 'multi_select') {
      return ['[data-task-id="' + task.id + '"][data-multi-option-id]'];
    }
    if (task.family === 'point_placement') {
      return ['[data-task-id="' + task.id + '"][data-point-axis="x"]', '[data-task-id="' + task.id + '"][data-point-axis="y"]'];
    }
    if (task.family === 'graph_construction_substitute') {
      return [
        '[data-task-id="' + task.id + '"][data-graph-axis="x"]',
        '[data-task-id="' + task.id + '"][data-graph-axis="y"]',
        '[data-task-id="' + task.id + '"][data-graph-point-index]',
        '[data-task-id="' + task.id + '"][data-graph-line-confirmation]'
      ];
    }
    if (task.family === 'calculation_work_capture') {
      if (task.interaction && task.interaction.selectionMode === 'percentage_claim_control') {
        return [
          '[data-task-id="' + task.id + '"][data-claim-interval-option-id]',
          '[data-task-id="' + task.id + '"][data-input-role="old-value"]',
          '[data-task-id="' + task.id + '"][data-input-role="new-value"]',
          '[data-task-id="' + task.id + '"][data-formula-token-id]',
          '[data-task-id="' + task.id + '"][data-input-role="final-answer"]',
          '[data-task-id="' + task.id + '"][data-claim-conclusion-option-id]'
        ];
      }
      if (task.interaction && task.interaction.selectionMode === 'interval_halving_check') {
        return [
          '[data-task-id="' + task.id + '"][data-interval-option-id]',
          '[data-task-id="' + task.id + '"][data-relation-option-id]',
          '[data-task-id="' + task.id + '"][data-conclusion-option-id]'
        ];
      }
      var plan = ['[data-task-id="' + task.id + '"][data-input-role="work"]', '[data-task-id="' + task.id + '"][data-input-role="final-answer"]'];
      if (task.interaction && task.interaction.unitNotationLabel) {
        plan.push('[data-task-id="' + task.id + '"][data-input-role="unit-notation"]');
      }
      return plan;
    }
    if (task.family === 'calculation_answer_form_capture') {
      return [
        '[data-task-id="' + task.id + '"][data-formula-token-id]',
        '[data-task-id="' + task.id + '"][data-formula-sequence]',
        '[data-task-id="' + task.id + '"][data-input-role="substitution"]',
        '[data-task-id="' + task.id + '"][data-input-role="final-answer"]',
        '[data-task-id="' + task.id + '"][data-input-role="unit-notation"]',
        '[data-task-id="' + task.id + '"][data-input-role="conclusion"]'
      ];
    }
    if (task.family === 'graph_reading' && task.interaction && Array.isArray(task.interaction.intervalOptions)) {
      return [
        '[data-task-id="' + task.id + '"][data-graph-reading-interval-option-id]',
        '[data-task-id="' + task.id + '"][data-input-role="answer"]'
      ];
    }
    if (task.family === 'cloze_text') {
      return [
        '[data-task-id="' + task.id + '"][data-cloze-text-blank-id]'
      ];
    }
    if (task.family === 'cloze_tile_select') {
      return [
        '[data-task-id="' + task.id + '"][data-cloze-tile-id]',
        '[data-task-id="' + task.id + '"][data-cloze-blank-id]'
      ];
    }
    if (task.family === 'sentence_builder') {
      return [
        '[data-task-id="' + task.id + '"][data-sentence-token-id]',
        '[data-task-id="' + task.id + '"][data-sentence-sequence]'
      ];
    }
    if (task.family === 'formula_builder') {
      return [
        '[data-task-id="' + task.id + '"][data-formula-token-id]',
        '[data-task-id="' + task.id + '"][data-formula-sequence]'
      ];
    }
    if (task.family === 'step_ordering') {
      return [
        '[data-task-id="' + task.id + '"][data-step-id]',
        '[data-task-id="' + task.id + '"][data-step-sequence]'
      ];
    }
    if (task.family === 'matching_pairs') {
      return [
        '[data-task-id="' + task.id + '"][data-match-left-id]',
        '[data-task-id="' + task.id + '"][data-match-right-id]',
        '[data-task-id="' + task.id + '"][data-match-pair-summary]'
      ];
    }
    if (task.family === 'two_tier_choice') {
      return [
        '[data-task-id="' + task.id + '"][data-two-tier-answer-id]',
        '[data-task-id="' + task.id + '"][data-two-tier-reason-id]',
        '[data-task-id="' + task.id + '"][data-two-tier-summary]'
      ];
    }
    if (task.family === 'assertion_reason') {
      return [
        '[data-task-id="' + task.id + '"][data-assertion-option-id]',
        '[data-task-id="' + task.id + '"][data-assertion-summary]'
      ];
    }
    if (task.family === 'source_value_selection') {
      return [
        '[data-task-id="' + task.id + '"][data-source-value-id]',
        '[data-task-id="' + task.id + '"][data-source-role-value-id]'
      ];
    }
    if (task.family === 'source_chain_builder') {
      return [
        '[data-task-id="' + task.id + '"][data-source-node-id]',
        '[data-task-id="' + task.id + '"][data-source-chain-sequence]'
      ];
    }
    if (task.family === 'label_placement') {
      return [
        '[data-task-id="' + task.id + '"][data-label-id]',
        '[data-task-id="' + task.id + '"][data-label-target-id]',
        '[data-task-id="' + task.id + '"][data-label-placement-summary]'
      ];
    }
    return ['[data-task-id="' + task.id + '"][data-input-role="answer"]'];
  }

  return {
    FAMILIES: clone(FAMILIES),
    BOUNDARY_FLAGS: clone(BOUNDARY_FLAGS),
    BLOCKED_STUDENT_TERMS: BLOCKED_STUDENT_TERMS.slice(),
    CONTEXT_BLOCK_TYPES: clone(CONTEXT_BLOCK_TYPES),
    INTERNAL_CODE_RE: INTERNAL_CODE_RE,
    cleanNumber: cleanNumber,
    collectStudentText: collectStudentText,
    collectContextText: collectContextText,
    findStudentTextViolations: findStudentTextViolations,
    findContextTextViolations: findContextTextViolations,
    validateTask: validateTask,
    validateContextBlock: validateContextBlock,
    validateContextBlocks: validateContextBlocks,
    validateTaskSet: validateTaskSet,
    evaluateTask: evaluateTask,
    focusPlan: focusPlan
  };
});
