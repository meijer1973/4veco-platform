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
    final_answer_entry: { label: 'Eindantwoord', deterministic: true },
    unit_notation_field: { label: 'Eenheid/notatie', deterministic: true },
    short_constructed_response: { label: 'Kort antwoord', deterministic: false },
    structured_short_response: { label: 'Kort antwoord in stappen', deterministic: true },
    table_value_selection: { label: 'Tabelwaarde kiezen', deterministic: true },
    graph_reading: { label: 'Grafiek aflezen', deterministic: true },
    point_placement: { label: 'Punt plaatsen', deterministic: true },
    graph_construction_substitute: { label: 'Grafiekstappen', deterministic: false },
    structured_reasoning: { label: 'Gestructureerde redenering', deterministic: false }
  };

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

  function requireArray(value, path, minLength) {
    assert(Array.isArray(value) && value.length >= minLength, path + ' must contain at least ' + minLength + ' item(s)');
  }

  function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
  }

  function cleanNumber(value) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      var normalized = value.replace(/\s/g, '').replace(',', '.').replace(/\u2212/g, '-');
      if (!normalized) return NaN;
      return Number(normalized);
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
      (task.interaction.fields || []).forEach(function (field) {
        push(field.label);
        push(field.placeholder);
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

  function findStudentTextViolations(task) {
    var violations = [];
    collectStudentText(task || {}).forEach(function (value) {
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

  function validateExpected(task, optionIds) {
    var expected = task.expected;
    assert(isObject(expected), task.id + '.expected is required');
    requireString(expected.kind, task.id + '.expected.kind');

    if (task.family === 'choice' || task.family === 'table_value_selection') {
      assert(expected.kind === 'choice', task.id + '.expected.kind must be choice');
      requireString(expected.value, task.id + '.expected.value');
      assert(optionIds && optionIds[expected.value], task.id + '.expected.value must match an option id');
      return;
    }

    if (task.family === 'numeric_input' || task.family === 'graph_reading') {
      assert(expected.kind === 'number', task.id + '.expected.kind must be number');
      assert(isNumber(expected.value), task.id + '.expected.value must be numeric');
      if (expected.tolerance !== undefined) assert(isNumber(expected.tolerance), task.id + '.expected.tolerance must be numeric');
      optionalString(expected.unit, task.id + '.expected.unit');
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
      } else {
        requireArray(expected.finalAnswer.accepted, task.id + '.expected.finalAnswer.accepted', 1);
      }
      if (expected.workRequired !== undefined) {
        assert(typeof expected.workRequired === 'boolean', task.id + '.expected.workRequired must be boolean');
      }
      if (expected.criteria !== undefined) requireArray(expected.criteria, task.id + '.expected.criteria', 1);
      if (expected.requiredWorkText !== undefined) validateTextGroups(expected.requiredWorkText, task.id + '.expected.requiredWorkText');
      if (expected.unitNotation !== undefined) {
        validateUnitNotation(expected.unitNotation, task.id + '.expected.unitNotation');
        requireString(task.interaction.unitNotationLabel, task.id + '.interaction.unitNotationLabel');
      }
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
        assert(optionIds && optionIds[expected.choice.value], task.id + '.expected.choice.value must match an option id');
      }
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

  function validateInteraction(task) {
    var path = task.id + '.interaction';
    assert(isObject(task.interaction), path + ' is required');
    var optionIds = null;

    if (task.family === 'choice' || task.family === 'table_value_selection') {
      optionIds = validateOptions(task.interaction.options, path + '.options');
    } else if (task.family === 'point_placement') {
      requireString(task.interaction.xLabel, path + '.xLabel');
      requireString(task.interaction.yLabel, path + '.yLabel');
    } else if (task.family === 'calculation_work_capture') {
      requireString(task.interaction.workLabel, path + '.workLabel');
      requireString(task.interaction.finalAnswerLabel, path + '.finalAnswerLabel');
      optionalString(task.interaction.finalAnswerPlaceholder, path + '.finalAnswerPlaceholder');
      optionalString(task.interaction.unitNotationLabel, path + '.unitNotationLabel');
      optionalString(task.interaction.unitNotationPlaceholder, path + '.unitNotationPlaceholder');
    } else if (
      task.family === 'numeric_input' ||
      task.family === 'final_answer_entry' ||
      task.family === 'unit_notation_field' ||
      task.family === 'graph_reading'
    ) {
      requireString(task.interaction.inputLabel, path + '.inputLabel');
    } else if (
      task.family === 'short_constructed_response' ||
      task.family === 'graph_construction_substitute' ||
      task.family === 'structured_reasoning'
    ) {
      requireString(task.interaction.inputLabel, path + '.inputLabel');
    } else if (task.family === 'structured_short_response') {
      validateStructuredFields(task.interaction.fields, path + '.fields');
      if (task.interaction.options !== undefined) optionIds = validateOptions(task.interaction.options, path + '.options');
    }

    return optionIds;
  }

  function validateTask(task) {
    assert(isObject(task), 'task must be an object');
    requireString(task.id, 'task.id');
    requireString(task.family, task.id + '.family');
    assert(FAMILIES[task.family], task.id + '.family is not supported');
    requireString(task.skillLabel, task.id + '.skillLabel');
    requireString(task.prompt, task.id + '.prompt');
    optionalString(task.purpose, task.id + '.purpose');
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
    requireArray(data.tasks, 'tasks', 1);
    var ids = {};
    data.tasks.forEach(function (task) {
      validateTask(task);
      assert(!ids[task.id], 'duplicate task id: ' + task.id);
      ids[task.id] = true;
    });
    return true;
  }

  function textMatches(value, accepted) {
    var normalized = normalizeText(value);
    return (accepted || []).some(function (item) {
      return normalizeText(item) === normalized;
    });
  }

  function numberMatches(value, expected) {
    var actual = cleanNumber(value);
    if (!isNumber(actual)) return false;
    return Math.abs(actual - expected.value) <= tolerance(expected);
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

  function finalAnswerMatches(value, expected) {
    if (!expected || !expected.kind) return false;
    if (expected.kind === 'number') return numberMatches(value, expected);
    if (expected.kind === 'text') return textMatches(value, expected.accepted);
    return false;
  }

  function unitNotationMatches(value, expected) {
    if (!expected) return true;
    if (expected.required === false && !hasValue(value)) return true;
    return textMatches(value, expected.accepted);
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

  function textCriteriaMatches(value, expected) {
    var normalized = normalizeText(value);
    if (!normalized) return false;
    var rejected = (expected.rejectText || []).some(function (rejectedText) {
      return normalized.indexOf(normalizeText(rejectedText)) !== -1;
    });
    return !rejected && textGroupsMatch(value, expected.requiredText || []);
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

  function deterministicMatch(task, response) {
    if (task.family === 'choice' || task.family === 'table_value_selection') {
      return normalizeText(response && response.value != null ? response.value : response) === normalizeText(task.expected.value);
    }
    if (task.family === 'numeric_input' || task.family === 'graph_reading') {
      return numberMatches(response && response.value != null ? response.value : response, task.expected);
    }
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
    if (task.family === 'calculation_work_capture' && task.expected.kind === 'calculation') {
      if (!response || typeof response !== 'object') return false;
      if (task.expected.workRequired !== false && !hasValue(response.work)) return false;
      if (task.expected.requiredWorkText && !textGroupsMatch(response.work, task.expected.requiredWorkText)) return false;
      return finalAnswerMatches(response.finalAnswer, task.expected.finalAnswer) &&
        unitNotationMatches(response.unitNotation, task.expected.unitNotation);
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
    return {
      taskId: task.id,
      family: task.family,
      state: matched ? 'matched' : 'retry',
      matched: matched,
      feedbackTitle: matched ? task.feedback.matchTitle : task.feedback.retryTitle,
      feedbackText: matched ? task.feedback.matchText : task.feedback.retryText,
      practiceRoute: clone(task.practiceRoute),
      boundaryFlags: clone(BOUNDARY_FLAGS)
    };
  }

  function focusPlan(task) {
    validateTask(task);
    if (task.family === 'choice' || task.family === 'table_value_selection') {
      return ['[data-task-id="' + task.id + '"][data-choice-id]'];
    }
    if (task.family === 'point_placement') {
      return ['[data-task-id="' + task.id + '"][data-point-axis="x"]', '[data-task-id="' + task.id + '"][data-point-axis="y"]'];
    }
    if (task.family === 'calculation_work_capture') {
      var plan = ['[data-task-id="' + task.id + '"][data-input-role="work"]', '[data-task-id="' + task.id + '"][data-input-role="final-answer"]'];
      if (task.interaction && task.interaction.unitNotationLabel) {
        plan.push('[data-task-id="' + task.id + '"][data-input-role="unit-notation"]');
      }
      return plan;
    }
    return ['[data-task-id="' + task.id + '"][data-input-role="answer"]'];
  }

  return {
    FAMILIES: clone(FAMILIES),
    BOUNDARY_FLAGS: clone(BOUNDARY_FLAGS),
    BLOCKED_STUDENT_TERMS: BLOCKED_STUDENT_TERMS.slice(),
    INTERNAL_CODE_RE: INTERNAL_CODE_RE,
    cleanNumber: cleanNumber,
    collectStudentText: collectStudentText,
    findStudentTextViolations: findStudentTextViolations,
    validateTask: validateTask,
    validateTaskSet: validateTaskSet,
    evaluateTask: evaluateTask,
    focusPlan: focusPlan
  };
});
