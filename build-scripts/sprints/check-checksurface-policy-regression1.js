#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_ROOT = path.resolve(ROOT, '..', '4veco-lessen');
const SOURCE_ROOT = path.join(ROOT, 'source-data', 'book-1', 'exit-ticket');
const FIXTURE_PATH = path.join(ROOT, 'reports', 'fixtures', 'checksurface-policy-regression1', 'negative-fixtures.json');
const PROOF_PATH = path.join(ROOT, 'reports', 'json', 'checksurface-policy-regression1-proof.json');

const ExitTicketEngine = require('../../engines/exit-ticket-engine');
const TaskShellEngine = require('../../engines/task-shell-engine');

function fail(message) {
  console.error(`CHECKSURFACE-POLICY-REGRESSION-1 failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing required file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function sourcePath(key) {
  return path.join(SOURCE_ROOT, `${key}.json`);
}

function loadSource(key) {
  const data = readJson(sourcePath(key));
  assert(ExitTicketEngine.validateData(data), `${key} must validate through ExitTicketEngine`);
  return data;
}

function asText(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(asText).join(' ');
  if (typeof value === 'object') return Object.values(value).map(asText).join(' ');
  return '';
}

function normalizeText(value) {
  return asText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokens(value) {
  return normalizeText(value)
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !['een', 'het', 'met', 'voor', 'naar', 'dat', 'die', 'dit', 'als', 'wat', 'welke'].includes(token));
}

function tokenSet(value) {
  return new Set(tokens(value));
}

function jaccard(a, b) {
  const left = tokenSet(a);
  const right = tokenSet(b);
  if (!left.size || !right.size) return 0;
  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  const union = new Set([...left, ...right]).size;
  return intersection / union;
}

function surfaceText(data) {
  return [
    data && data.title,
    data && data.intro,
    data && data.parName,
    data && data.contextBlocks,
    data && data.tasks && data.tasks.map((task) => {
      const shell = task.taskShell || task;
      return [
        shell.skillLabel,
        shell.purpose,
        shell.prompt,
        shell.interaction && shell.interaction.inputLabel,
        shell.expected && shell.expected.criteria,
      ];
    }),
  ];
}

function surfaceSimilarity(shortData, exitData) {
  return jaccard(surfaceText(shortData), surfaceText(exitData));
}

function taskShells(data) {
  return (data.tasks || [])
    .filter((task) => task && task.taskShell)
    .map((task) => task.taskShell);
}

function assertWorkGroup(shell, label, expectedValues) {
  const groups = shell.expected.requiredWorkText || [];
  const group = groups.find((entry) => entry && entry.label === label);
  assert(group, `requiredWorkText missing group: ${label}`);
  for (const value of expectedValues) {
    assert((group.any || []).includes(value), `requiredWorkText.${label} missing ${value}`);
  }
}

function allTasks(data) {
  return data && Array.isArray(data.tasks) ? data.tasks : [];
}

function containsProcedureGiveaway(data) {
  const text = normalizeText([
    data && data.intro,
    data && data.contextBlocks,
    allTasks(data).map((task) => {
      const shell = task.taskShell || task;
      return [shell.prompt, shell.purpose, shell.interaction && shell.interaction.instructions];
    }),
  ]);
  return /stap\s*1|teken eerst|zet p op|zet q op|vul q.?0|vul p.?0|verbind daarna|procedure|flowchart|denkroute/.test(text);
}

function isGraphOrTableShell(shell) {
  const text = normalizeText([shell.family, shell.skillLabel, shell.purpose, shell.prompt]);
  return /grafiek|graph|tabel|table|prijs.?hoeveelheid|assen|axis/.test(text);
}

function containsChoiceOnlySubstitution(data) {
  return allTasks(data).some((task) => {
    const shell = task.taskShell || task;
    const type = task.type || shell.family;
    return type === 'choice' && isGraphOrTableShell(shell);
  });
}

function containsAnswerGiveaway(data) {
  return taskShells(data).some((shell) => {
    if (shell.family !== 'graph_construction_substitute') return false;
    const interaction = shell.interaction || {};
    if (interaction.answerVisible === true || interaction.showCompletedGraphBeforeAttempt === true) return true;
    if (interaction.hideAxisLabelsUntilAxisSelection !== true) {
      const axisText = normalizeText([interaction.axes, interaction.axisOptions, shell.prompt]);
      if (/prijs|hoeveelheid|p as|q as|verticale as|horizontale as/.test(axisText)) return true;
    }
    return false;
  });
}

function arrayHasOnlyAnswers(items) {
  if (!Array.isArray(items) || items.length < 2) return false;
  const kindItems = items.filter((item) => item && typeof item === 'object' && item.kind);
  if (!kindItems.length) return false;
  return kindItems.every((item) => item.kind === 'answer');
}

function containsCorrectOnlySelector(data) {
  return taskShells(data).some((shell) => {
    const interaction = shell.interaction || {};
    return [
      interaction.tokens,
      interaction.steps,
      interaction.values,
      interaction.labels,
      interaction.targets,
      interaction.leftItems,
      interaction.rightItems,
      interaction.tiles,
      interaction.nodes,
    ].some(arrayHasOnlyAnswers);
  });
}

function containsCorrectOnlyIntervalFromInteraction(interaction) {
  if (!interaction || !Array.isArray(interaction.intervalOptions)) return false;
  const intervals = interaction.intervalOptions || [];
  const hasCorrectInterval = intervals.some((option) => option.correct === true);
  const hasDistractorInterval = intervals.some((option) => option.correct === false);
  if (!hasCorrectInterval || !hasDistractorInterval) return true;
  if (interaction.selectionMode !== 'interval_halving_check') return false;
  const conclusions = interaction.conclusionOptions || [];
  const hasCorrectConclusion = conclusions.some((option) => option.correct === true);
  const hasDistractorConclusion = conclusions.some((option) => option.correct === false);
  return !hasCorrectConclusion || !hasDistractorConclusion;
}

function containsCorrectOnlyInterval(dataOrTask) {
  if (dataOrTask && dataOrTask.interaction) {
    return containsCorrectOnlyIntervalFromInteraction(dataOrTask.interaction);
  }
  return taskShells(dataOrTask || {}).some((shell) => containsCorrectOnlyIntervalFromInteraction(shell.interaction));
}

function containsMissingFeedbackOrNextAction(data) {
  return allTasks(data).some((task) => {
    const shell = task.taskShell || task;
    if (!shell.prompt) return true;
    if (!shell.feedback || !shell.feedback.matchTitle || !shell.feedback.retryTitle) return true;
    if (!shell.practiceRoute || !shell.practiceRoute.href || !shell.practiceRoute.label) return true;
    return false;
  });
}

function containsGraphWorkspaceViolation(payload) {
  return payload && payload.proof && payload.proof.graphLineInsideWorkspace === false;
}

const BAD_COMPLETION = /laten zien dat|aankunt|bewezen|aangetoond|beheerst|mag automatisch door|volgende paragraaf|diagnost|mastery|summatief|cijfer|pv|scale gate/i;

function containsAuthorityOverclaim(data) {
  if (!data) return false;
  const text = asText([data.completion, data.metadataAlignment, data.targetEquivalent]);
  if (data.parNr === '1.1.2') {
    const completionText = normalizeText([data.completion && data.completion.title, data.completion && data.completion.text]);
    if (/beheerst|automatisch door|volgende paragraaf|diagnost|summatief|cijfer/.test(completionText)) return true;
    return false;
  }
  if (data.targetEquivalent && data.targetEquivalent.completionLanguageEligible === true) return true;
  if (data.metadataAlignment && data.metadataAlignment.targetReadinessEvidence === true) return true;
  return BAD_COMPLETION.test(text);
}

function violationsForPayload(payload) {
  const violations = new Set();
  if (!payload) return violations;
  if (payload.short && payload.exit && surfaceSimilarity(payload.short, payload.exit) >= 0.72) {
    violations.add('duplicate_surface');
  }
  for (const data of [payload.short, payload.exit].filter(Boolean)) {
    if (containsProcedureGiveaway(data)) violations.add('procedure_giveaway');
    if (containsAnswerGiveaway(data)) violations.add('answer_giveaway');
    if (containsChoiceOnlySubstitution(data)) violations.add('choice_only_substitution');
    if (containsCorrectOnlySelector(data)) violations.add('correct_only_selector');
    if (containsCorrectOnlyInterval(data)) violations.add('correct_only_interval');
    if (containsMissingFeedbackOrNextAction(data)) violations.add('missing_feedback_or_next_action');
    if (containsAuthorityOverclaim(data)) violations.add('authority_overclaim');
  }
  if (payload.task && containsCorrectOnlyInterval(payload.task)) violations.add('correct_only_interval');
  if (containsGraphWorkspaceViolation(payload)) violations.add('graph_workspace');
  return violations;
}

function checkSpecsAndRoadmaps() {
  const companion = read(path.join(LESSON_ROOT, 'specifications', 'companion-core-specifications.md'));
  const endState = read(path.join(LESSON_ROOT, 'specifications', 'product-end-state.md'));
  const platformRoadmap = read(path.join(ROOT, 'references', 'reference-team-roadmap.md'));
  const lessonRoadmap = read(path.join(LESSON_ROOT, 'lessen-team-roadmap.md'));
  const requiredSpecPatterns = [
    [/Shared Task And Check-Surface Integrity Policy/, 'policy section title'],
    [/correct-only selector[\s\S]{0,80}not a\s+check/, 'correct-only selector rule'],
    [/choice-only checks may not stand in/, 'choice-only substitution rule'],
    [/Regression memory/, 'regression memory rule'],
    [/Excellence/, 'excellence rule'],
  ];
  for (const [pattern, label] of requiredSpecPatterns) {
    assert(pattern.test(companion), `companion spec missing policy text: ${label}`);
  }
  assert(endState.includes('Controls that contain only correct choices'), 'product end-state missing correct-only control policy');
  for (const id of [
    'CHECKSURFACE-POLICY-REGRESSION-1',
    'CHECKSURFACE-EXCELLENCE-REDESIGN-1',
    'CHECKSURFACE-EXCELLENCE-AUDIT-3P',
    'CHECKSURFACE-GATE-RETRY-EXCELLENT-1',
  ]) {
    assert(platformRoadmap.includes(id), `platform roadmap missing ${id}`);
    assert(lessonRoadmap.includes(id), `lesson roadmap missing ${id}`);
  }
  const immediate = platformRoadmap.split('## Immediate Next Sprint')[1] || '';
  assert(!/Direct human\s+review comments are next/i.test(immediate), 'platform immediate next sprint still sends stale retry comments');
  assert(/GATE-CHECK-SHORT-EXIT-2-RETRY superseded/i.test(immediate), 'platform immediate next sprint must name stale retry packet as superseded');
}

function checkCurrentSources() {
  const keys = [
    '1.1.1-korte-check',
    '1.1.1-exit-ticket',
    '1.1.2-korte-check',
    '1.1.2-exit-ticket',
    '1.1.3-korte-check',
    '1.1.3-exit-ticket',
  ];
  const sources = Object.fromEntries(keys.map((key) => [key, loadSource(key)]));

  for (const par of ['1.1.1', '1.1.2', '1.1.3']) {
    const shortData = sources[`${par}-korte-check`];
    const exitData = sources[`${par}-exit-ticket`];
    const similarity = surfaceSimilarity(shortData, exitData);
    assert(similarity < 0.72, `${par} short check and exit ticket are too similar (${similarity.toFixed(2)})`);
    assert(shortData.surface === 'advisory_short_check', `${par} short check must remain advisory`);
    assert(exitData.surface === 'target_equivalent_exit_ticket', `${par} exit ticket must remain exit-ticket surface`);
    assert(!containsAuthorityOverclaim(shortData), `${par} short check has authority overclaim`);
    assert(!containsMissingFeedbackOrNextAction(shortData), `${par} short check has missing feedback or next action`);
    assert(!containsMissingFeedbackOrNextAction(exitData), `${par} exit ticket has missing feedback or next action`);
  }

  for (const key of ['1.1.1-exit-ticket', '1.1.3-exit-ticket']) {
    const data = sources[key];
    assert(data.targetEquivalent && data.targetEquivalent.gateApproved === false, `${key} must remain unapproved`);
    assert(data.targetEquivalent.completionLanguageEligible === false, `${key} completion language must remain held`);
    assert(data.metadataAlignment.targetReadinessEvidence === false, `${key} must not claim target-readiness evidence`);
    assert(!containsAuthorityOverclaim(data), `${key} has authority overclaim`);
  }

  const reviewed112 = sources['1.1.2-exit-ticket'];
  assert(reviewed112.targetEquivalent.gateApproved === true, '1.1.2 reviewed authority must remain approved');
  assert(reviewed112.targetEquivalent.completionLanguageEligible === true, '1.1.2 reviewed completion authority must remain true');
  assert(reviewed112.metadataAlignment.targetReadinessEvidence === true, '1.1.2 reviewed target-readiness evidence must remain true');
  assert(!containsAuthorityOverclaim(reviewed112), '1.1.2 authority broadened beyond reviewed local copy');

  const short113 = sources['1.1.3-korte-check'];
  const exit113 = sources['1.1.3-exit-ticket'];
  assert(!containsProcedureGiveaway(exit113), '1.1.3 exit ticket must not teach the graph procedure');
  assert(!containsChoiceOnlySubstitution(short113), '1.1.3 short check must not be choice-only graph substitute');
  assert(!containsChoiceOnlySubstitution(exit113), '1.1.3 exit ticket must not be choice-only graph substitute');
  assert(!containsAnswerGiveaway(short113), '1.1.3 short graph task reveals the graph convention');
  assert(!containsAnswerGiveaway(exit113), '1.1.3 exit graph task reveals the graph convention');
  assert(!containsCorrectOnlyInterval(exit113), '1.1.3 interval task must include correct and distractor choices');
  assert((exit113.contextBlocks || []).length === 2, '1.1.3 exit ticket must have source and table context only');
  assert((exit113.contextBlocks || []).some((block) => block.type === 'source_excerpt'), '1.1.3 exit ticket must include source context');
  assert((exit113.contextBlocks || []).some((block) => block.type === 'table'), '1.1.3 exit ticket must include table context');
  assert(!(exit113.contextBlocks || []).some((block) => block.type === 'formula' || /procedure|flowchart|formula/i.test(asText(block))), '1.1.3 exit ticket must not include formula/procedure context block');
  const exit113Families = taskShells(exit113).map((shell) => shell.family);
  for (const family of ['graph_construction_substitute', 'graph_reading', 'formula_builder', 'calculation_work_capture']) {
    assert(exit113Families.includes(family), `1.1.3 exit ticket missing task family ${family}`);
  }
  const graph113 = taskShells(exit113).find((shell) => shell.family === 'graph_construction_substitute');
  assert(graph113.interaction.hideAxisLabelsUntilAxisSelection === true, '1.1.3 graph must delay axis labels until axis selection');
  assert(graph113.interaction.pointCount === 2, '1.1.3 graph must require exactly two points');
  assert(graph113.interaction.pointSnapMode === 'magnetic_table_point', '1.1.3 graph must use magnetic table-point snapping');
  assert(graph113.expected.pointPolicy === 'straight_line_two_distinct_table_points', '1.1.3 graph must accept two distinct table points');
  assert(Array.isArray(graph113.expected.acceptedTablePoints) && graph113.expected.acceptedTablePoints.length >= 5, '1.1.3 graph must expose accepted table points');
  const read113 = taskShells(exit113).find((shell) => shell.family === 'graph_reading');
  assert(Array.isArray(read113.interaction.stepOrder) && read113.interaction.stepOrder[0] === 'interval_selection', '1.1.3 graph reading must choose interval first');
  assert(read113.expected.interval && read113.expected.interval.value, '1.1.3 graph reading must require selected interval');
  const calc113 = taskShells(exit113).find((shell) => shell.family === 'calculation_work_capture');
  assert(!calc113.interaction.selectionMode, '1.1.3 calculation must not use interval-halving dropdown substitute');
  assert((calc113.interaction.answerParsers || []).includes('number_with_optional_percent'), '1.1.3 calculation must declare number parser');
  assert((calc113.interaction.answerParsers || []).includes('decrease_phrase_to_negative_percent'), '1.1.3 calculation must declare decrease phrase parser');
  assert(calc113.expected.finalAnswer.acceptedNotations.includes('-50%'), '1.1.3 calculation must accept signed percent notation');
  assert(calc113.expected.finalAnswer.acceptedNotations.includes('50% daling'), '1.1.3 calculation must accept decrease phrase notation');
  assert((calc113.expected.requiredWorkText || []).length === 4, '1.1.3 calculation must require both interval endpoints and both Q-values');
  assertWorkGroup(calc113, 'startprijs', ['1,50', '1.50']);
  assertWorkGroup(calc113, 'eindprijs', ['3,00', '3.00']);
  assertWorkGroup(calc113, 'oude hoeveelheid', ['300']);
  assertWorkGroup(calc113, 'nieuwe hoeveelheid', ['150']);

  for (const key of keys) {
    for (const shell of taskShells(sources[key])) {
      assert(TaskShellEngine.validateTask(shell), `${key}.${shell.id} must validate through TaskShellEngine`);
    }
  }

  return {
    surface_similarity: {
      '1.1.1': Number(surfaceSimilarity(sources['1.1.1-korte-check'], sources['1.1.1-exit-ticket']).toFixed(3)),
      '1.1.2': Number(surfaceSimilarity(sources['1.1.2-korte-check'], sources['1.1.2-exit-ticket']).toFixed(3)),
      '1.1.3': Number(surfaceSimilarity(short113, exit113).toFixed(3)),
    },
    sources_checked: keys,
  };
}

function checkNegativeFixtures() {
  const fixtureData = readJson(FIXTURE_PATH);
  assert(fixtureData.schema_version === 1, 'negative fixtures schema_version must be 1');
  assert(Array.isArray(fixtureData.fixtures) && fixtureData.fixtures.length >= 9, 'negative fixtures must include at least nine cases');
  return fixtureData.fixtures.map((fixture) => {
    const violations = violationsForPayload(fixture.payload);
    const caught = violations.has(fixture.expected_violation);
    assert(caught, `fixture ${fixture.id} did not trigger expected violation ${fixture.expected_violation}; got ${[...violations].join(', ') || 'none'}`);
    return {
      id: fixture.id,
      expected_violation: fixture.expected_violation,
      detected_violations: [...violations].sort(),
      caught,
    };
  });
}

function main() {
  checkSpecsAndRoadmaps();
  const current = checkCurrentSources();
  const negativeFixtures = checkNegativeFixtures();
  const proof = {
    schema_version: 1,
    sprint_id: 'CHECKSURFACE-POLICY-REGRESSION-1',
    generated: new Date().toISOString(),
    status: 'passed',
    policy: {
      stable_specs_updated: true,
      old_retry_packet_superseded: true,
      durable_policy: 'Shared Task And Check-Surface Integrity Policy',
    },
    current_sources: current,
    negative_fixtures: negativeFixtures,
    authority: {
      reviewed_112_completion_authority_preserved: true,
      new_111_or_113_completion_language_authorized: false,
      product_route_adoption_authorized: false,
      diagnostics_authorized: false,
      mastery_or_sequencing_authorized: false,
      pv_authorized: false,
      scale_gate_1_authorized: false,
      student_product_use_authorized: false,
    },
  };
  fs.mkdirSync(path.dirname(PROOF_PATH), { recursive: true });
  fs.writeFileSync(PROOF_PATH, `${JSON.stringify(proof, null, 2)}\n`);
  console.log(`CHECKSURFACE-POLICY-REGRESSION-1 passed; proof written to ${path.relative(ROOT, PROOF_PATH)}`);
}

main();
