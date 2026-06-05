// Exit Ticket Checkpoint Engine - pure logic, no DOM.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.ExitTicketEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var BLOCKED_STUDENT_TERMS = [
    'mastery',
    'pass',
    'fail',
    'score',
    'grade',
    'summative',
    'diagnose',
    'diagnostic',
    'adaptive',
    'evidence',
    'toets',
    'cijfer',
    'beoordeling',
    'summatief',
    'diagnostisch',
    'adaptief'
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
    studentFacingOutput: false,
    studentProductUse: false,
    targetEquivalentProof: false
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function resolveTaskShellEngine() {
    if (typeof globalThis !== 'undefined' && globalThis.TaskShellEngine) return globalThis.TaskShellEngine;
    if (typeof require === 'function') {
      try { return require('./task-shell-engine'); } catch (e) { return null; }
    }
    return null;
  }

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function isNonEmptyStringArray(value) {
    return Array.isArray(value) && value.length > 0 && value.every(function (item) {
      return typeof item === 'string' && item;
    });
  }

  function includesAll(container, required) {
    var set = {};
    (container || []).forEach(function (item) { set[item] = true; });
    return (required || []).every(function (item) { return set[item]; });
  }

  function text(value) {
    return String(value == null ? '' : value);
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function containsBlockedTerm(value, term) {
    var pattern = new RegExp('(^|[^a-z0-9])' + escapeRegExp(term.toLowerCase()) + '([^a-z0-9]|$)');
    return pattern.test(value.toLowerCase());
  }

  function collectStudentText(data) {
    var out = [];
    function push(value) {
      if (value == null) return;
      if (Array.isArray(value)) {
        value.forEach(push);
        return;
      }
      if (typeof value === 'object') return;
      var str = text(value).trim();
      if (str) out.push(str);
    }

    push(data.title);
    push(data.intro);
    push(data.parName);
    if (data.skillMap) {
      push(data.skillMap.title);
      (data.skillMap.routes || []).forEach(function (route) {
        push(route.label);
        push(route.surface);
      });
    }
    (data.tasks || []).forEach(function (task) {
      if (task.type === 'task_shell' && task.taskShell) {
        push(task.taskShell.skillLabel);
        push(task.taskShell.familyLabel);
        push(task.taskShell.purpose);
        push(task.taskShell.prompt);
        if (task.taskShell.interaction) {
          push(task.taskShell.interaction.inputLabel);
          push(task.taskShell.interaction.workLabel);
          push(task.taskShell.interaction.finalAnswerLabel);
          push(task.taskShell.interaction.xLabel);
          push(task.taskShell.interaction.yLabel);
          (task.taskShell.interaction.options || []).forEach(function (option) {
            push(option.label);
            push(option.description);
          });
        }
        if (task.taskShell.feedback) {
          push(task.taskShell.feedback.matchTitle);
          push(task.taskShell.feedback.matchText);
          push(task.taskShell.feedback.retryTitle);
          push(task.taskShell.feedback.retryText);
          push(task.taskShell.feedback.selfCheckTitle);
          push(task.taskShell.feedback.selfCheckText);
        }
      } else {
        push(task.skillLabel);
        push(task.prompt);
        (task.options || []).forEach(function (option) { push(option.label); });
        if (task.feedback) {
          push(task.feedback.matchTitle);
          push(task.feedback.matchText);
          push(task.feedback.retryTitle);
          push(task.feedback.retryText);
        }
        if (task.practiceRoute) push(task.practiceRoute.label);
      }
    });
    if (data.completion) {
      push(data.completion.title);
      push(data.completion.text);
    }
    (data.contextBlocks || []).forEach(function (block) {
      push(block.label);
      push(block.title);
      push(block.bodyMarkdown);
      push(block.caption);
      push(block.altText);
      if (block.table) {
        push(block.table.caption);
        (block.table.headers || []).forEach(push);
        (block.table.rows || []).forEach(function (row) { (row || []).forEach(push); });
      }
    });
    return out;
  }

  function findStudentTextViolations(data) {
    var violations = [];
    var values = collectStudentText(data || {});
    values.forEach(function (value) {
      var lower = value.toLowerCase();
      BLOCKED_STUDENT_TERMS.forEach(function (term) {
        if (containsBlockedTerm(lower, term)) {
          violations.push({ type: 'blocked_term', term: term, text: value });
        }
      });
      if (INTERNAL_CODE_RE.test(value)) {
        violations.push({ type: 'internal_code', text: value });
      }
    });
    return violations;
  }

  function validateData(data) {
    assert(data && typeof data === 'object', 'Exit-ticket data must be an object');
    assert(data.schema_version === 1, 'Exit-ticket data must use schema_version 1');
    assert(typeof data.parNr === 'string' && data.parNr, 'Exit-ticket data needs parNr');
    assert(typeof data.parName === 'string' && data.parName, 'Exit-ticket data needs parName');
    assert(typeof data.title === 'string' && data.title, 'Exit-ticket data needs title');
    if (data.surface !== undefined) {
      assert(
        data.surface === 'advisory_short_check' || data.surface === 'target_equivalent_exit_ticket',
        'Exit-ticket surface must be advisory_short_check or target_equivalent_exit_ticket'
      );
    }
    validateTargetEquivalentState(data);
    assert(isNonEmptyStringArray(data.targetSkillIds), 'Exit-ticket data needs targetSkillIds');
    assert(isNonEmptyStringArray(data.skillScopeIds), 'Exit-ticket data needs skillScopeIds');
    validateMetadataAlignment(data);
    assert(Array.isArray(data.tasks), 'Exit-ticket data needs tasks');
    assert(data.tasks.length >= 3 && data.tasks.length <= 5, 'Exit-ticket data must contain 3 to 5 tasks');

    var seen = {};
    data.tasks.forEach(function (task) {
      assert(task && typeof task === 'object', 'Task must be an object');
      assert(typeof task.id === 'string' && task.id, 'Task needs id');
      assert(!seen[task.id], 'Task id must be unique: ' + task.id);
      seen[task.id] = true;
      assert(task.type === 'choice' || task.type === 'task_shell', 'Only choice and task_shell tasks are supported');
      if (task.type === 'task_shell') {
        var TaskShellEngine = resolveTaskShellEngine();
        assert(TaskShellEngine && typeof TaskShellEngine.validateTask === 'function', 'TaskShellEngine is required for task_shell tasks');
        assert(task.taskShell && typeof task.taskShell === 'object', 'task_shell tasks need taskShell');
        TaskShellEngine.validateTask(task.taskShell);
        return;
      }
      assert(typeof task.prompt === 'string' && task.prompt, 'Task needs prompt');
      assert(Array.isArray(task.options) && task.options.length >= 2, 'Task needs at least two options');
      assert(typeof task.answer === 'string' && task.answer, 'Task needs answer id');
      assert(task.options.some(function (option) { return option.id === task.answer; }), 'Task answer must match an option');
      assert(task.feedback && task.feedback.matchText && task.feedback.retryText, 'Task needs feedback text');
      assert(task.practiceRoute && task.practiceRoute.label && task.practiceRoute.href, 'Task needs practice route');
    });

    validateContextTaskSet(data);

    var violations = findStudentTextViolations(data);
    assert(violations.length === 0, 'Student-facing checkpoint text has blocked terms or internal codes');
    return true;
  }

  function validateContextTaskSet(data) {
    if (data.contextBlocks === undefined) return true;
    var TaskShellEngine = resolveTaskShellEngine();
    assert(TaskShellEngine && typeof TaskShellEngine.validateTaskSet === 'function', 'TaskShellEngine.validateTaskSet is required for contextBlocks');
    var tasks = data.tasks.map(function (task) {
      assert(task.type === 'task_shell', 'contextBlocks require task_shell tasks');
      return task.taskShell;
    });
    return TaskShellEngine.validateTaskSet({
      schema_version: 1,
      title: data.title,
      surfaceKind: isTargetEquivalentData(data) ? 'exit_ticket' : 'practice_check',
      contextBlocks: data.contextBlocks,
      tasks: tasks
    });
  }

  function validateMetadataAlignment(data) {
    var meta = data.metadataAlignment;
    assert(meta && typeof meta === 'object', 'Exit-ticket data needs metadataAlignment');
    assert(typeof meta.status === 'string' && meta.status, 'metadataAlignment needs status');
    assert(isNonEmptyStringArray(meta.paragraphSkillIds), 'metadataAlignment needs paragraphSkillIds');
    assert(isNonEmptyStringArray(meta.targetExerciseSkillIds), 'metadataAlignment needs targetExerciseSkillIds');
    assert(typeof meta.targetReadinessEvidence === 'boolean', 'metadataAlignment needs targetReadinessEvidence boolean');
    assert(includesAll(data.targetSkillIds, meta.paragraphSkillIds), 'targetSkillIds must include paragraphSkillIds');
    assert(includesAll(data.skillScopeIds, meta.paragraphSkillIds), 'skillScopeIds must include paragraphSkillIds');
    if (meta.targetReadinessEvidence === true) {
      assert(
        meta.status === 'target_exercise_readiness_aligned' || meta.status === 'target_equivalent_aligned',
        'target-readiness evidence requires aligned status'
      );
      assert(includesAll(data.targetSkillIds, meta.targetExerciseSkillIds), 'target-readiness evidence must cover all targetExerciseSkillIds');
    } else {
      assert(
        meta.status !== 'target_exercise_readiness_aligned' && meta.status !== 'target_equivalent_aligned',
        'aligned target-readiness status requires targetReadinessEvidence true'
      );
    }
    return true;
  }

  function validateTargetEquivalentState(data) {
    var state = data.targetEquivalent;
    if (data.surface === 'target_equivalent_exit_ticket') {
      assert(state && typeof state === 'object', 'target-equivalent exit ticket needs targetEquivalent state');
    }
    if (!state) return true;
    assert(typeof state.candidate === 'boolean', 'targetEquivalent.candidate must be boolean');
    assert(typeof state.gateApproved === 'boolean', 'targetEquivalent.gateApproved must be boolean');
    assert(typeof state.completionLanguageEligible === 'boolean', 'targetEquivalent.completionLanguageEligible must be boolean');
    if (state.completionLanguageEligible) {
      assert(state.gateApproved === true, 'completion language requires gate approval');
    }
    return true;
  }

  function isTargetEquivalentData(data) {
    return Boolean(
      data &&
      (data.surface === 'target_equivalent_exit_ticket' ||
        (data.targetEquivalent && data.targetEquivalent.candidate === true))
    );
  }

  function normalizeAnswer(value) {
    return text(value).trim().toLowerCase();
  }

  function getTask(data, taskId) {
    for (var i = 0; i < data.tasks.length; i++) {
      if (data.tasks[i].id === taskId) return data.tasks[i];
    }
    return null;
  }

  function fallbackSkillMapRequest(paragraph, skillScope, targetSkills) {
    return {
      paragraph: paragraph || null,
      surface: 'exit-ticket',
      mode: 'compact',
      aspectFilter: 'mixed',
      skillScope: skillScope.slice(),
      targetSkills: targetSkills.slice(),
      maxVisibleAvailable: 4,
      allowFullView: false,
      boundaryFlags: clone(BOUNDARY_FLAGS)
    };
  }

  function resolveSkillMapEngine(explicitEngine) {
    if (explicitEngine && typeof explicitEngine.createRequest === 'function') return explicitEngine;
    if (typeof globalThis !== 'undefined' && globalThis.SkillMapEngine) return globalThis.SkillMapEngine;
    if (typeof require === 'function') {
      try { return require('./skill-map-engine'); } catch (e) { return null; }
    }
    return null;
  }

  function ExitTicketEngine(options) {
    options = options || {};
    validateData(options.data);
    this.data = clone(options.data);
    this.skillMapEngine = resolveSkillMapEngine(options.SkillMapEngine);
    this.responses = {};
  }

  ExitTicketEngine.prototype.getSkillMapRequest = function () {
    var scope = this.data.skillScopeIds || this.data.targetSkillIds;
    var targets = this.data.targetSkillIds;
    if (this.skillMapEngine && typeof this.skillMapEngine.createRequest === 'function') {
      return this.skillMapEngine.createRequest('exit-ticket', {
        paragraph: this.data.parNr,
        mode: 'compact',
        aspectFilter: 'mixed',
        skillScope: scope,
        targetSkills: targets,
        maxVisibleAvailable: 4,
        allowFullView: false
      });
    }
    return fallbackSkillMapRequest(this.data.parNr, scope, targets);
  };

  ExitTicketEngine.prototype.getBoundaryFlags = function () {
    return clone(BOUNDARY_FLAGS);
  };

  ExitTicketEngine.prototype.checkTask = function (taskId, answerId) {
    var task = getTask(this.data, taskId);
    assert(task, 'Unknown task: ' + taskId);
    if (task.type === 'task_shell') {
      var TaskShellEngine = resolveTaskShellEngine();
      assert(TaskShellEngine && typeof TaskShellEngine.evaluateTask === 'function', 'TaskShellEngine is required for task_shell tasks');
      var taskShellResult = TaskShellEngine.evaluateTask(task.taskShell, answerId);
      this.responses[taskId] = {
        answerId: clone(answerId),
        matched: taskShellResult.matched,
        viewedAt: new Date().toISOString()
      };
      return Object.assign({}, taskShellResult, { taskId: taskId });
    }
    var matched = normalizeAnswer(answerId) === normalizeAnswer(task.answer);
    this.responses[taskId] = {
      answerId: answerId,
      matched: matched,
      viewedAt: new Date().toISOString()
    };
    return {
      taskId: taskId,
      state: matched ? 'matched' : 'retry',
      matched: matched,
      feedbackTitle: matched ? task.feedback.matchTitle : task.feedback.retryTitle,
      feedbackText: matched ? task.feedback.matchText : task.feedback.retryText,
      practiceRoute: clone(task.practiceRoute),
      boundaryFlags: clone(BOUNDARY_FLAGS)
    };
  };

  ExitTicketEngine.prototype.getProgress = function () {
    var viewed = Object.keys(this.responses).length;
    if (isTargetEquivalentData(this.data)) {
      var responseValues = Object.keys(this.responses).map(function (key) {
        return this.responses[key];
      }, this);
      var matched = responseValues.filter(function (response) { return response.matched === true; }).length;
      var needsRepair = responseValues.filter(function (response) { return response.matched !== true; }).length;
      var pending = Math.max(0, this.data.tasks.length - viewed);
      var proofCandidate = pending === 0 && matched === this.data.tasks.length;
      var state = this.data.targetEquivalent || {};
      return {
        practiceProgressOnly: false,
        targetEquivalentAttempt: true,
        viewed: viewed,
        total: this.data.tasks.length,
        pending: pending,
        matched: matched,
        needsRepair: needsRepair,
        proofCandidate: proofCandidate,
        gateApproved: state.gateApproved === true,
        completionLanguageEligible:
          proofCandidate === true && state.gateApproved === true && state.completionLanguageEligible === true
      };
    }
    return {
      practiceProgressOnly: true,
      viewed: viewed,
      total: this.data.tasks.length,
      pending: Math.max(0, this.data.tasks.length - viewed)
    };
  };

  ExitTicketEngine.prototype.reset = function () {
    this.responses = {};
  };

  ExitTicketEngine.validateData = validateData;
  ExitTicketEngine.validateMetadataAlignment = validateMetadataAlignment;
  ExitTicketEngine.collectStudentText = collectStudentText;
  ExitTicketEngine.findStudentTextViolations = findStudentTextViolations;
  ExitTicketEngine.BLOCKED_STUDENT_TERMS = BLOCKED_STUDENT_TERMS.slice();
  ExitTicketEngine.INTERNAL_CODE_RE = INTERNAL_CODE_RE;
  ExitTicketEngine.BOUNDARY_FLAGS = clone(BOUNDARY_FLAGS);

  return ExitTicketEngine;
});
