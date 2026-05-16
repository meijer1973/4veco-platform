// Graphical Game - Engine (pure logic, no DOM)
// MVP for reading values from simple graphs and using them in calculations.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.GraphicalEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  "use strict";

  var ALLOWED_TYPES = {
    bar_value_read: true,
    line_value_read: true,
    graph_values_percentage_change: true
  };

  function readAdaptivePayload(paragraphId, storage) {
    var seam = null;
    if (typeof globalThis !== 'undefined' && globalThis.AdaptiveSeam) {
      seam = globalThis.AdaptiveSeam;
    }
    if (!seam && typeof require === 'function') {
      try { seam = require('./adaptive-seam'); } catch (e) { seam = null; }
    }
    if (seam && typeof seam.readPayload === 'function') {
      return seam.readPayload({ paragraphId: paragraphId || null, storage: storage });
    }
    return {
      schema_version: 1,
      paragraph_id: paragraphId || null,
      focus_skills: [],
      difficulty_hint: 'default',
      allowed_hints: 'default',
      source: 'none'
    };
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function isNumber(value) {
    return typeof value === "number" && isFinite(value);
  }

  function cleanNumber(value) {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      var normalized = value.replace(",", ".").trim();
      if (normalized.length === 0) return NaN;
      return Number(normalized);
    }
    return NaN;
  }

  function getTolerance(expected) {
    return isNumber(expected.tolerance) ? Math.max(0, expected.tolerance) : 0;
  }

  function requireString(value, path) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(path + " must be a non-empty string");
    }
  }

  function requireArray(value, path, minLength) {
    if (!Array.isArray(value) || value.length < minLength) {
      throw new Error(path + " must contain at least " + minLength + " item(s)");
    }
  }

  function validateGraph(graph, challengeId) {
    if (!graph || typeof graph !== "object") throw new Error(challengeId + ".graph is required");
    if (graph.type !== "bar" && graph.type !== "line") {
      throw new Error(challengeId + ".graph.type must be bar or line");
    }
    requireString(graph.title, challengeId + ".graph.title");
    requireString(graph.x_label, challengeId + ".graph.x_label");
    requireString(graph.y_label, challengeId + ".graph.y_label");
    requireString(graph.unit, challengeId + ".graph.unit");
    requireArray(graph.series, challengeId + ".graph.series", 2);
    graph.series.forEach(function (point, idx) {
      requireString(point.label, challengeId + ".graph.series[" + idx + "].label");
      if (!isNumber(point.value)) {
        throw new Error(challengeId + ".graph.series[" + idx + "].value must be numeric");
      }
    });
  }

  function validateExpected(challenge) {
    var expected = challenge.expected_answer;
    if (!expected || typeof expected !== "object") {
      throw new Error(challenge.id + ".expected_answer is required");
    }
    if (challenge.type === "bar_value_read" || challenge.type === "line_value_read") {
      if (expected.kind !== "number") throw new Error(challenge.id + ".expected_answer.kind must be number");
      if (!isNumber(expected.value)) throw new Error(challenge.id + ".expected_answer.value must be numeric");
      requireString(expected.unit, challenge.id + ".expected_answer.unit");
      if (expected.tolerance !== undefined && !isNumber(expected.tolerance)) {
        throw new Error(challenge.id + ".expected_answer.tolerance must be numeric");
      }
      requireString(challenge.target_label, challenge.id + ".target_label");
      return;
    }
    if (challenge.type === "graph_values_percentage_change") {
      if (expected.kind !== "percentage_change") {
        throw new Error(challenge.id + ".expected_answer.kind must be percentage_change");
      }
      requireString(expected.old_label, challenge.id + ".expected_answer.old_label");
      requireString(expected.new_label, challenge.id + ".expected_answer.new_label");
      if (!isNumber(expected.value)) throw new Error(challenge.id + ".expected_answer.value must be numeric");
      if (expected.tolerance !== undefined && !isNumber(expected.tolerance)) {
        throw new Error(challenge.id + ".expected_answer.tolerance must be numeric");
      }
    }
  }

  function validateChallenge(challenge) {
    if (!challenge || typeof challenge !== "object") throw new Error("challenge must be an object");
    requireString(challenge.id, "challenge.id");
    if (!ALLOWED_TYPES[challenge.type]) throw new Error(challenge.id + ".type is not supported");
    requireString(challenge.title, challenge.id + ".title");
    requireString(challenge.prompt, challenge.id + ".prompt");
    validateGraph(challenge.graph, challenge.id);
    validateExpected(challenge);
    requireArray(challenge.feedback_steps, challenge.id + ".feedback_steps", 3);
    challenge.feedback_steps.forEach(function (step, idx) {
      requireString(step.label, challenge.id + ".feedback_steps[" + idx + "].label");
      requireString(step.text, challenge.id + ".feedback_steps[" + idx + "].text");
    });
  }

  function validateData(data) {
    if (!data || typeof data !== "object") throw new Error("graphical game data is required");
    if (data.schema_version !== 1) throw new Error("schema_version must be 1");
    if (!data.meta || typeof data.meta !== "object") throw new Error("meta is required");
    requireString(data.meta.parNr, "meta.parNr");
    requireString(data.meta.parName, "meta.parName");
    requireString(data.student_title || data.meta.title, "student_title");
    requireArray(data.challenges, "challenges", 1);

    var ids = {};
    data.challenges.forEach(function (challenge) {
      validateChallenge(challenge);
      if (ids[challenge.id]) throw new Error("duplicate challenge id: " + challenge.id);
      ids[challenge.id] = true;
    });
    return true;
  }

  function findGraphPoint(challenge, label) {
    if (!challenge || !challenge.graph || !Array.isArray(challenge.graph.series)) return null;
    for (var i = 0; i < challenge.graph.series.length; i++) {
      if (challenge.graph.series[i].label === label) return challenge.graph.series[i];
    }
    return null;
  }

  function compareNumber(actual, expected) {
    var value = cleanNumber(actual);
    if (!isNumber(value)) return false;
    return Math.abs(value - expected.value) <= getTolerance(expected);
  }

  function GraphicalEngine(config) {
    config = config || {};
    var data = config.data || config;
    validateData(data);
    this.data = clone(data);
    this.index = 0;
    this.results = [];
    this.adaptivePayload = readAdaptivePayload(this.data.meta.parNr, config.adaptiveStorage);
  }

  GraphicalEngine.validateData = validateData;
  GraphicalEngine.validateChallenge = validateChallenge;
  GraphicalEngine.cleanNumber = cleanNumber;

  GraphicalEngine.prototype.getAdaptivePayload = function () {
    return clone(this.adaptivePayload);
  };

  GraphicalEngine.prototype.getCurrentChallenge = function () {
    return this.data.challenges[this.index] || null;
  };

  GraphicalEngine.prototype.getProgress = function () {
    return {
      current: Math.min(this.index + 1, this.data.challenges.length),
      total: this.data.challenges.length,
      completed: this.results.length
    };
  };

  GraphicalEngine.prototype.answerNumber = function (value) {
    var challenge = this.getCurrentChallenge();
    if (!challenge || challenge.expected_answer.kind !== "number") return null;
    var expected = challenge.expected_answer;
    var correct = compareNumber(value, expected);
    return this._recordResult({
      challenge_id: challenge.id,
      type: challenge.type,
      correct: correct,
      submitted: { value: cleanNumber(value) },
      expected: clone(expected),
      feedback_steps: clone(challenge.feedback_steps)
    });
  };

  GraphicalEngine.prototype.answerPercentage = function (answer) {
    var challenge = this.getCurrentChallenge();
    if (!challenge || challenge.expected_answer.kind !== "percentage_change") return null;
    answer = answer || {};
    var expected = challenge.expected_answer;
    var oldPoint = findGraphPoint(challenge, answer.old_label);
    var newPoint = findGraphPoint(challenge, answer.new_label);
    var labelsCorrect = answer.old_label === expected.old_label && answer.new_label === expected.new_label;
    var valueCorrect = compareNumber(answer.value, expected);
    var correct = labelsCorrect && valueCorrect;
    var calculated = null;
    if (oldPoint && newPoint && oldPoint.value !== 0) {
      calculated = ((newPoint.value - oldPoint.value) / oldPoint.value) * 100;
    }
    return this._recordResult({
      challenge_id: challenge.id,
      type: challenge.type,
      correct: correct,
      submitted: {
        old_label: answer.old_label || null,
        new_label: answer.new_label || null,
        value: cleanNumber(answer.value),
        calculated_from_selected_values: calculated
      },
      expected: clone(expected),
      feedback_steps: clone(challenge.feedback_steps)
    });
  };

  GraphicalEngine.prototype._recordResult = function (result) {
    this.results[this.index] = result;
    return clone(result);
  };

  GraphicalEngine.prototype.nextChallenge = function () {
    if (this.index < this.data.challenges.length - 1) {
      this.index += 1;
      return this.getCurrentChallenge();
    }
    return null;
  };

  GraphicalEngine.prototype.isComplete = function () {
    return this.results.filter(Boolean).length >= this.data.challenges.length;
  };

  GraphicalEngine.prototype.getSummary = function () {
    var completed = this.results.filter(Boolean);
    var correct = completed.filter(function (r) { return r.correct; }).length;
    return {
      correct: correct,
      total: this.data.challenges.length,
      completed: completed.length,
      perfect: correct === this.data.challenges.length && completed.length === this.data.challenges.length
    };
  };

  return GraphicalEngine;
});
