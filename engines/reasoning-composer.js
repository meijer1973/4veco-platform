// Data-driven reasoning-game composer over the shared task shell.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(
      require('./task-shell-engine'),
      require('./task-shell-ui')
    );
  } else {
    root.ReasoningComposer = factory(root.TaskShellEngine, root.TaskShellUI);
  }
})(typeof self !== 'undefined' ? self : this, function (TaskShellEngine, TaskShellUI) {
  'use strict';

  var REQUIRED_BRIEF_FIELDS = [
    'reasoningTarget',
    'centralMisconception',
    'sourceEvidenceType',
    'requiredAnswerForm',
    'mustNotTest',
    'candidateArchetype',
    'selectedGoldenExemplars',
    'mechanicFit'
  ];

  var ALLOWED_LAYOUTS = {
    dual_pane_source_task_workspace: true,
    single_column_source_before_tasks: true
  };

  var RESTRICTED_COMPOSITION_KEYS = {
    modePicker: true,
    legacyModePicker: true,
    legacyReasoningMode: true,
    modeOverload: true
  };

  var GOAL_ANSWER_LEAK_RE = /\b(?:juiste\s+antwoord|antwoord\s+is|oplossing\s+is|kies\s+[^.?!]*(?:want|omdat)|selecteer\s+[^.?!]*(?:en|dus)|concludeer\s+dat)\b/i;
  var RESTRICTED_AUTHORITY_FLAGS = [
    'student_product_adoption',
    'target_equivalent_proof',
    'diagnostics',
    'mastery_or_sequencing',
    'summative_use',
    'scale_gate'
  ];

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

  function requireArray(value, path, minLength) {
    assert(Array.isArray(value) && value.length >= minLength, path + ' must contain at least ' + minLength + ' item(s)');
  }

  function escapeHtml(value) {
    if (TaskShellUI && TaskShellUI.escapeHtml) return TaskShellUI.escapeHtml(value);
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function validateTargetBrief(brief) {
    assert(isObject(brief), 'targetBrief is required');
    REQUIRED_BRIEF_FIELDS.forEach(function (field) {
      if (Array.isArray(brief[field])) {
        requireArray(brief[field], 'targetBrief.' + field, 1);
      } else {
        requireString(brief[field], 'targetBrief.' + field);
      }
    });
    assert(
      !/^(percentages|graphs|index|schaarste|vraag|aanbod)$/i.test(String(brief.reasoningTarget).trim()),
      'targetBrief.reasoningTarget must name a reasoning operation, not only a content label'
    );
  }

  function validateAuthority(authority) {
    assert(isObject(authority), 'authority boundary is required');
    assert(authority.golden_reference === true, 'authority.golden_reference must be true for this review corpus');
    RESTRICTED_AUTHORITY_FLAGS.forEach(function (flag) {
      assert(authority[flag] === false, 'authority.' + flag + ' must remain false');
    });
  }

  function scanRestrictedKeys(value, path) {
    if (!isObject(value) && !Array.isArray(value)) return;
    if (Array.isArray(value)) {
      value.forEach(function (item, index) { scanRestrictedKeys(item, path + '[' + index + ']'); });
      return;
    }
    Object.keys(value).forEach(function (key) {
      assert(!RESTRICTED_COMPOSITION_KEYS[key], path + '.' + key + ' is not allowed in reasoning-game compositions');
      scanRestrictedKeys(value[key], path + '.' + key);
    });
  }

  function validateComposition(composition) {
    assert(isObject(composition), 'composition must be an object');
    assert(composition.schema_version === 1, 'composition must use schema_version 1');
    requireString(composition.composition_id, 'composition_id');
    requireString(composition.title, 'title');
    requireString(composition.goal, 'goal');
    assert(!GOAL_ANSWER_LEAK_RE.test(composition.goal), 'goal must be prominent but not answer-giving');
    requireString(composition.archetype_id, 'archetype_id');
    requireArray(composition.selected_exemplar_ids, 'selected_exemplar_ids', 1);
    validateAuthority(composition.authority);
    validateTargetBrief(composition.targetBrief);
    assert(isObject(composition.layout), 'layout is required');
    requireString(composition.layout.type, 'layout.type');
    assert(ALLOWED_LAYOUTS[composition.layout.type], 'layout.type must be a supported reasoning-game layout');
    assert(composition.layout.defaultRoute !== 'legacy_reasoning_modes', 'legacy reasoning modes are not an authoring route');
    assert(isObject(composition.taskSet), 'taskSet is required');
    assert(composition.taskSet.schema_version === 1, 'taskSet must use schema_version 1');
    requireArray(composition.taskSet.tasks, 'taskSet.tasks', 2);
    assert(composition.taskSet.tasks.length <= 4, 'reasoning-game task loop must have at most four tasks');
    TaskShellEngine.validateTaskSet(composition.taskSet);
    scanRestrictedKeys(composition, 'composition');

    var taskFamilies = composition.taskSet.tasks.map(function (task) { return task.family; });
    assert(taskFamilies.indexOf('functional_answer_builder') !== -1, 'composition must include a visible final answer builder');
    assert(taskFamilies.indexOf('graph_construction_substitute') === -1, 'reasoning-game compositions must not replace reasoning with graph construction');
    if (composition.archetype_id === 'graph_evidence_and_epistemic_scope') {
      assert(taskFamilies.indexOf('graph_evidence_selector') !== -1, 'graph archetype must use graph_evidence_selector');
    }
    return true;
  }

  function contextIndex(taskSet) {
    return TaskShellUI.buildContextIndex(taskSet.contextBlocks || []);
  }

  function renderGoal(composition) {
    return '<section class="rg-goal" aria-label="Doel">' +
      '<p class="ts-eyebrow">Redeneerdoel</p>' +
      '<h1>' + escapeHtml(composition.title) + '</h1>' +
      '<p>' + escapeHtml(composition.goal) + '</p>' +
    '</section>';
  }

  function renderSourcePane(composition) {
    var blocks = TaskShellUI.renderContextBlocks(composition.taskSet.contextBlocks || []);
    return '<aside class="rg-pane rg-source-pane" data-rg-source-pane>' +
      renderGoal(composition) +
      blocks +
    '</aside>';
  }

  function renderTaskPane(composition) {
    var index = contextIndex(composition.taskSet);
    var tasks = composition.taskSet.tasks.map(function (task, taskIndex) {
      var html = TaskShellUI.renderTask(task, taskIndex, index);
      return html.replace(
        '<div class="ts-feedback"',
        '<div class="rg-task-actions"><button type="button" class="rg-check" data-rg-check-task="' + escapeHtml(task.id) + '">Controleer</button></div><div class="ts-feedback"'
      );
    }).join('');
    return '<main class="rg-pane rg-task-pane" data-rg-task-pane>' +
      '<section class="ts-shell" data-task-shell="REASONING-COMPOSER">' +
        '<div class="ts-task-list">' + tasks + '</div>' +
      '</section>' +
    '</main>';
  }

  function renderBrief(composition) {
    var json = JSON.stringify(composition).replace(/</g, '\\u003c');
    return '<script type="application/json" id="rg-composition-data">' +
      json +
    '</script>';
  }

  function renderRuntimeScript() {
    return '<script>' +
      '(function(){\n' +
      '  function data(){ return JSON.parse(document.getElementById("rg-composition-data").textContent); }\n' +
      '  function css(value){ return window.CSS && CSS.escape ? CSS.escape(value) : String(value).replace(/"/g, "\\\\\\""); }\n' +
      '  function taskById(id){ return data().taskSet.tasks.find(function(task){ return task.id === id; }); }\n' +
      '  function taskRoot(id){ return document.querySelector("[data-task=\\"" + css(id) + "\\"]"); }\n' +
      '  function selectChoice(root, option){ var controls=root.querySelectorAll(".ts-choice"); for(var i=0;i<controls.length;i++){ controls[i].classList.remove("selected"); controls[i].setAttribute("aria-pressed","false"); } if(option){ option.classList.add("selected"); option.setAttribute("aria-pressed","true"); } }\n' +
      '  function collectChoice(root, task){ var selected=root.querySelector("[data-task-id=\\"" + css(task.id) + "\\"][data-choice-id].selected"); return selected ? selected.getAttribute("data-choice-id") : ""; }\n' +
      '  function collect(task){ var root=taskRoot(task.id); if(!root) return null; switch(task.family){ case "choice": case "table_value_selection": return { value: collectChoice(root, task) }; case "multi_select": return TaskShellUI.collectMultiSelectResponse(root, task); case "cloze_tile_select": return TaskShellUI.collectClozeTileResponse(root, task); case "cloze_text": return TaskShellUI.collectClozeTextResponse(root, task); case "sentence_builder": return TaskShellUI.collectSentenceBuilderResponse(root, task); case "step_ordering": return TaskShellUI.collectStepOrderingResponse(root, task); case "source_chain_builder": return TaskShellUI.collectSourceChainBuilderResponse(root, task); case "source_value_selection": return TaskShellUI.collectSourceValueSelectionResponse(root, task); case "functional_answer_builder": return TaskShellUI.collectFunctionalAnswerResponse(root, task); case "graph_evidence_selector": return TaskShellUI.collectGraphEvidenceResponse(root, task); case "two_tier_choice": return TaskShellUI.collectTwoTierChoiceResponse(root, task); default: return ""; } }\n' +
      '  function check(taskId){ var task=taskById(taskId); var root=taskRoot(taskId); if(!task||!root) return null; var result=TaskShellEngine.evaluateTask(task, collect(task)); var target=root.querySelector("[data-feedback-for=\\"" + css(taskId) + "\\"]"); if(target){ target.innerHTML=TaskShellUI.renderFeedback(result); target.focus({preventScroll:true}); } return result; }\n' +
      '  function clickSelector(selector){ var el=document.querySelector(selector); if(el) el.click(); return !!el; }\n' +
      '  function applyResponse(taskId, response){ var task=taskById(taskId); var root=taskRoot(taskId); if(!task||!root) return; if(task.family==="choice"||task.family==="table_value_selection"){ clickSelector("[data-task-id=\\"" + css(taskId) + "\\"][data-choice-id=\\"" + css(response.value||response) + "\\"]"); return; } if(task.family==="multi_select"){ (response.values||[]).forEach(function(id){ clickSelector("[data-task-id=\\"" + css(taskId) + "\\"][data-multi-option-id=\\"" + css(id) + "\\"]"); }); return; } if(task.family==="step_ordering"){ (response.order||[]).forEach(function(id){ clickSelector("[data-task-id=\\"" + css(taskId) + "\\"][data-step-id=\\"" + css(id) + "\\"]"); }); return; } if(task.family==="source_chain_builder"){ (response.chain||[]).forEach(function(id){ clickSelector("[data-task-id=\\"" + css(taskId) + "\\"][data-source-node-id=\\"" + css(id) + "\\"]"); }); return; } if(task.family==="cloze_tile_select"){ Object.keys(response.blanks||{}).forEach(function(blankId){ var tileId=response.blanks[blankId]; clickSelector("[data-task-id=\\"" + css(taskId) + "\\"][data-cloze-tile-id=\\"" + css(tileId) + "\\"]"); clickSelector("[data-task-id=\\"" + css(taskId) + "\\"][data-cloze-blank-id=\\"" + css(blankId) + "\\"]"); }); return; } if(task.family==="functional_answer_builder"){ Object.keys(response.rows||{}).forEach(function(rowId){ clickSelector("[data-task-id=\\"" + css(taskId) + "\\"][data-answer-row-id=\\"" + css(rowId) + "\\"][data-answer-option-id=\\"" + css(response.rows[rowId]) + "\\"]"); }); return; } if(task.family==="graph_evidence_selector"){ (response.pointIds||[]).forEach(function(id){ clickSelector("[data-task-id=\\"" + css(taskId) + "\\"][data-graph-evidence-point-id=\\"" + css(id) + "\\"]"); }); return; } }\n' +
      '  function applyScenario(name){ var composition=data(); var scenario=composition.proofScenarios&&composition.proofScenarios[name]; if(!scenario) return []; var results=[]; (scenario.responses||[]).forEach(function(item){ applyResponse(item.taskId,item.response); if(item.check!==false) results.push(check(item.taskId)); }); return results; }\n' +
      '  document.addEventListener("click", function(event){ var checkButton=event.target.closest("[data-rg-check-task]"); if(checkButton){ check(checkButton.getAttribute("data-rg-check-task")); return; } var root=document; TaskShellUI.handleMultiSelectClick(root,event)||TaskShellUI.handleClozeTileClick(root,event)||TaskShellUI.handleSentenceBuilderClick(root,event)||TaskShellUI.handleStepOrderingClick(root,event)||TaskShellUI.handleSourceChainBuilderClick(root,event)||TaskShellUI.handleSourceValueSelectionClick(root,event)||TaskShellUI.handleFunctionalAnswerClick(root,event)||TaskShellUI.handleGraphEvidenceClick(root,event)||TaskShellUI.handleTwoTierChoiceClick(root,event); var choice=event.target.closest(".ts-choice"); if(choice){ selectChoice(choice.closest(".ts-task"),choice); } });\n' +
      '  window.ReasoningGameComposer={ data:data, check:check, applyResponse:applyResponse, applyScenario:applyScenario, collect:function(taskId){ return collect(taskById(taskId)); } };\n' +
      '}());' +
    '</script>';
  }

  function renderCompositionPage(composition, options) {
    validateComposition(composition);
    options = options || {};
    var layoutClass = composition.layout.type === 'dual_pane_source_task_workspace' ? 'rg-dual-pane' : 'rg-single-column';
    return '<!doctype html>\n' +
      '<html lang="nl" data-theme="' + escapeHtml(options.theme || 'light') + '">\n' +
      '<head>\n' +
      '<meta charset="utf-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '<title>' + escapeHtml(composition.title) + '</title>\n' +
      '<link rel="stylesheet" href="../../../engines/task-shell.css">\n' +
      '<link rel="stylesheet" href="../reasoning-composer-gallery.css">\n' +
      '</head>\n' +
      '<body>\n' +
      '<div class="rg-page" data-composition-id="' + escapeHtml(composition.composition_id) + '" data-archetype="' + escapeHtml(composition.archetype_id) + '">\n' +
        '<div class="' + layoutClass + '" data-rg-workspace data-rg-layout="' + escapeHtml(composition.layout.type) + '">\n' +
          renderSourcePane(composition) +
          renderTaskPane(composition) +
        '</div>\n' +
      '</div>\n' +
      renderBrief(composition) +
      '<script src="../../../engines/task-shell-engine.js"></script>\n' +
      '<script src="../../../engines/task-shell-ui.js"></script>\n' +
      renderRuntimeScript() + '\n' +
      '</body>\n' +
      '</html>\n';
  }

  function buildProof(composition) {
    validateComposition(composition);
    return {
      composition_id: composition.composition_id,
      archetype_id: composition.archetype_id,
      selected_exemplar_ids: clone(composition.selected_exemplar_ids),
      layout: clone(composition.layout),
      task_families: composition.taskSet.tasks.map(function (task) { return task.family; }),
      focus_plans: composition.taskSet.tasks.map(function (task) {
        return {
          task_id: task.id,
          family: task.family,
          selectors: TaskShellEngine.focusPlan(task)
        };
      }),
      authority: clone(composition.authority || {}),
      proof_scenarios: Object.keys(composition.proofScenarios || {})
    };
  }

  return {
    validateComposition: validateComposition,
    renderCompositionPage: renderCompositionPage,
    buildProof: buildProof
  };
});
