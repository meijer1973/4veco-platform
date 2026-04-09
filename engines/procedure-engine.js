// Procedure Practice Game — Engine (pure logic, no DOM)
// Manages game state for step-by-step procedure exercises.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.ProcedureEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  "use strict";

  function ProcedureEngine(config) {
    this.procedures = config.procedures || [];
    this.storageKey = "proc_" + (config.parNr || "0");
    this._loadScores();
    this.current = null;
    this.selections = [];
    this.results = [];
    this.checked = false;
  }

  // --- Score persistence ---

  ProcedureEngine.prototype._loadScores = function () {
    this.scores = {};
    try {
      var raw = localStorage.getItem(this.storageKey);
      if (raw) this.scores = JSON.parse(raw);
    } catch (e) { /* ignore */ }
  };

  ProcedureEngine.prototype._saveScores = function () {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
    } catch (e) { /* ignore */ }
  };

  ProcedureEngine.prototype.getBestScore = function (procedureId) {
    return this.scores[procedureId] || null;
  };

  // --- Procedure selection ---

  ProcedureEngine.prototype.startProcedure = function (index) {
    var proc = this.procedures[index];
    if (!proc) return null;
    this.current = proc;
    this.checked = false;
    this.selections = [];
    this.results = [];
    for (var i = 0; i < proc.steps.length; i++) {
      this.selections.push(null);
      this.results.push(null);
    }
    // Shuffle option order for each choose-step (Fisher-Yates)
    this._shuffledOptions = [];
    for (var j = 0; j < proc.steps.length; j++) {
      if (proc.steps[j].type === "choose") {
        var opts = proc.steps[j].options.slice();
        for (var k = opts.length - 1; k > 0; k--) {
          var r = Math.floor(Math.random() * (k + 1));
          var tmp = opts[k]; opts[k] = opts[r]; opts[r] = tmp;
        }
        this._shuffledOptions.push(opts);
      } else {
        this._shuffledOptions.push(null);
      }
    }
    return proc;
  };

  ProcedureEngine.prototype.getShuffledOptions = function (stepIndex) {
    return this._shuffledOptions[stepIndex] || null;
  };

  // --- Interaction ---

  ProcedureEngine.prototype.selectOption = function (stepIndex, optionIndex) {
    if (this.checked) return false;
    var step = this.current && this.current.steps[stepIndex];
    if (!step || step.type !== "choose") return false;
    this.selections[stepIndex] = optionIndex;
    return true;
  };

  ProcedureEngine.prototype.isAllSelected = function () {
    if (!this.current) return false;
    for (var i = 0; i < this.current.steps.length; i++) {
      if (this.current.steps[i].type === "choose" && this.selections[i] === null) {
        return false;
      }
    }
    return true;
  };

  ProcedureEngine.prototype.checkAnswers = function () {
    if (!this.current || !this.isAllSelected()) return null;
    this.checked = true;
    var correct = 0;
    var total = 0;
    for (var i = 0; i < this.current.steps.length; i++) {
      if (this.current.steps[i].type === "choose") {
        total++;
        var selectedOpt = this._shuffledOptions[i][this.selections[i]];
        var isCorrect = selectedOpt && selectedOpt.correct === true;
        this.results[i] = isCorrect;
        if (isCorrect) correct++;
      }
    }

    var score = { correct: correct, total: total, perfect: correct === total };

    var procId = this.current.id;
    var prev = this.scores[procId];
    if (!prev || correct > prev.correct) {
      this.scores[procId] = { correct: correct, total: total };
      this._saveScores();
    }

    return score;
  };

  ProcedureEngine.prototype.getSelectedOption = function (stepIndex) {
    if (this.selections[stepIndex] === null) return null;
    return this._shuffledOptions[stepIndex][this.selections[stepIndex]];
  };

  ProcedureEngine.prototype.getChooseStepCount = function () {
    if (!this.current) return 0;
    var count = 0;
    for (var i = 0; i < this.current.steps.length; i++) {
      if (this.current.steps[i].type === "choose") count++;
    }
    return count;
  };

  ProcedureEngine.prototype.reset = function () {
    if (this.current) {
      var idx = this.procedures.indexOf(this.current);
      if (idx >= 0) this.startProcedure(idx);
    }
  };

  return ProcedureEngine;
});
