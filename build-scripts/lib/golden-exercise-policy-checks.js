const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const boundary = require('../sprints/check-golden-ticket-layout-boundary');

const PATHS = {
  layoutRegistryJson: path.join(ROOT, 'references', 'ui', 'layout-registry.json'),
  layoutRegistryMd: path.join(ROOT, 'references', 'ui', 'layout-registry.md'),
  interactionPolicyJson: path.join(ROOT, 'references', 'ui', 'interaction-policy.json'),
  interactionPolicyMd: path.join(ROOT, 'references', 'ui', 'interaction-policy.md'),
  uiReadme: path.join(ROOT, 'references', 'ui', 'README.md'),
  exerciseWorkbenchPolicyMd: path.join(ROOT, 'references', 'ui', 'exercise-workbench-policy.md'),
  sharedTaskPolicyMd: path.join(ROOT, 'references', 'ui', 'shared-task-rollout-policy.md'),
  shortCheckSpecMd: path.join(ROOT, 'references', 'ui', 'layouts', 'golden-exercise-workbench-short-check.md'),
  shortCheckSpecJson: path.join(ROOT, 'references', 'ui', 'layouts', 'golden-exercise-workbench-short-check.json'),
  shortCheckProofJson: path.join(ROOT, 'reports', 'json', 'short-check-workbench-policy-1-proof.json'),
  exemplarIndexJson: path.join(ROOT, 'references', 'exemplars', 'exemplar-index.json'),
  implementedSnapshotHtml: path.join(ROOT, 'references', 'exemplars', 'implemented', '1.1.3-golden-exercise-workbench', 'generated-route-snapshot.html'),
  implementedSourceJson: path.join(ROOT, 'references', 'exemplars', 'implemented', '1.1.3-golden-exercise-workbench', 'source-data-snapshot.json'),
  a96NegativeFixtures: path.join(ROOT, 'references', 'exemplars', 'a96-answer-form', 'negative-fixtures.json'),
  checkerFixtures: path.join(ROOT, 'references', 'ui', 'golden-exercise-checker-fixtures.json'),
  sourceDataDir: path.join(ROOT, 'source-data', 'book-1', 'exit-ticket'),
};

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`missing file: ${rel(file)}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    throw new Error(`invalid JSON in ${rel(file)}: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertIncludesText(text, needles, label) {
  for (const needle of needles) {
    assert(text.includes(needle), `${label} missing text: ${needle}`);
  }
}

function assertFalseFields(object, fields, label) {
  for (const field of fields) {
    assert(object && object[field] === false, `${label}.${field} must be false`);
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asText(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(asText).join(' ');
  if (typeof value === 'object') return Object.values(value).map(asText).join(' ');
  return '';
}

function normalizeLabel(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function collectByKey(value, predicate, out = []) {
  if (value == null) return out;
  if (Array.isArray(value)) {
    value.forEach((item) => collectByKey(item, predicate, out));
    return out;
  }
  if (typeof value !== 'object') return out;
  for (const [key, child] of Object.entries(value)) {
    if (predicate(key, child)) out.push({ key, value: child });
    collectByKey(child, predicate, out);
  }
  return out;
}

function taskShells(data) {
  return asArray(data && data.tasks)
    .map((task) => task && (task.taskShell || task))
    .filter(Boolean);
}

function formulaSpecs(shell) {
  const specs = [];
  const interaction = shell.interaction || {};
  const expected = shell.expected || {};
  if (interaction.formula && Array.isArray(interaction.formula.tokens)) {
    specs.push({
      label: `${shell.id || shell.family || 'task'}.interaction.formula`,
      tokens: interaction.formula.tokens,
      expectedTokens: asArray(expected.formula && expected.formula.tokens),
    });
  }
  if (Array.isArray(interaction.tokens)) {
    specs.push({
      label: `${shell.id || shell.family || 'task'}.interaction.tokens`,
      tokens: interaction.tokens,
      expectedTokens: asArray(expected.tokens || (expected.formula && expected.formula.tokens)),
    });
  }
  if (Array.isArray(shell.tokens)) {
    specs.push({
      label: `${shell.id || shell.family || 'task'}.tokens`,
      tokens: shell.tokens,
      expectedTokens: asArray(shell.expectedTokens || expected.tokens),
    });
  }
  return specs;
}

function tokenIds(tokens) {
  return asArray(tokens).map((token) => typeof token === 'string' ? token : token && token.id).filter(Boolean);
}

function isFormulaBankOrderedAsAnswer(spec) {
  const displayIds = tokenIds(spec.tokens);
  const expected = asArray(spec.expectedTokens).filter(Boolean);
  if (expected.length < 3) return false;
  return displayIds.slice(0, expected.length).join('|') === expected.join('|');
}

function hiddenTokenTrapErrors(spec) {
  const errors = [];
  const expected = asArray(spec.expectedTokens).filter(Boolean);
  const expectedSet = new Set(expected);
  const byLabel = new Map();
  for (const token of asArray(spec.tokens)) {
    if (!token || typeof token !== 'object' || !token.id || !token.label) continue;
    const label = normalizeLabel(token.label);
    if (!label) continue;
    if (!byLabel.has(label)) byLabel.set(label, []);
    byLabel.get(label).push(token);
  }
  for (const [label, tokens] of byLabel.entries()) {
    const distinctIds = [...new Set(tokens.map((token) => token.id))];
    if (distinctIds.length < 2) continue;
    const answerLikeIds = distinctIds.filter((id) => tokens.some((token) => {
      return token.id === id && (token.kind === 'answer' || expectedSet.has(token.id));
    }));
    if (answerLikeIds.length) {
      errors.push(`${spec.label}: visually identical hidden-token trap for label "${label}" across ids ${distinctIds.join(', ')}`);
    }
  }
  return errors;
}

function expectedAnswerNeedles(shell) {
  const expected = shell.expected || {};
  const needles = new Set();
  function add(value) {
    if (value == null) return;
    const text = String(value).trim();
    if (text && text.length >= 2) needles.add(text.toLowerCase());
  }
  add(expected.value);
  add(expected.answer);
  add(expected.interval && expected.interval.value);
  add(expected.oldValue && expected.oldValue.value);
  add(expected.newValue && expected.newValue.value);
  add(expected.finalAnswer && expected.finalAnswer.value);
  asArray(expected.finalAnswer && expected.finalAnswer.acceptedNotations).forEach(add);
  asArray(expected.acceptedNotations).forEach(add);
  return [...needles];
}

function answerGivingPlaceholderErrors(shell) {
  const placeholders = collectByKey(shell, (key, value) => /placeholder/i.test(key) && typeof value === 'string');
  const needles = expectedAnswerNeedles(shell);
  const errors = [];
  for (const item of placeholders) {
    const value = item.value.toLowerCase();
    for (const needle of needles) {
      if (needle && value.includes(needle)) {
        errors.push(`${shell.id || shell.family || 'task'}: placeholder "${item.value}" gives expected answer "${needle}"`);
      }
    }
  }
  return errors;
}

function isFakeGraphLineShapeQuestion(shell) {
  if (shell.family !== 'graph_construction_substitute') return false;
  const interaction = shell.interaction || {};
  const expected = shell.expected || {};
  const straightTwoPointPolicy = interaction.pointCount === 2
    || /two_distinct|two points|two source points/i.test(String(expected.pointPolicy || ''));
  if (!straightTwoPointPolicy) return false;
  if (Array.isArray(interaction.lineShapeOptions) && interaction.lineShapeOptions.length) return true;
  if (interaction.lineShapeLabel) return true;
  return /line[- ]?shape|lijnvorm|helling|stijgend|dalend/i.test(asText([
    interaction.lineShapeQuestion,
    interaction.shapeQuestion,
    shell.prompt,
    shell.purpose,
  ]));
}

function detectDataViolations(data, options = {}) {
  const violations = new Set();
  const details = [];
  const quarantined = [];
  for (const shell of taskShells(data)) {
    if (isFakeGraphLineShapeQuestion(shell)) {
      violations.add('fake_graph_line_shape');
      details.push(`${shell.id || shell.family}: fake line-shape/slope question after two-point graph construction`);
    }
    for (const error of answerGivingPlaceholderErrors(shell)) {
      violations.add('answer_giving_placeholder');
      details.push(error);
    }
    for (const spec of formulaSpecs(shell)) {
      if (isFormulaBankOrderedAsAnswer(spec)) {
        violations.add('formula_tokens_ordered_answer');
        details.push(`${spec.label}: token bank display order matches the expected formula sequence`);
      }
      for (const error of hiddenTokenTrapErrors(spec)) {
        if (options.allowKnown113FormulaTrap && data && data.parNr === '1.1.3') {
          quarantined.push(error);
        } else {
          violations.add('visually_identical_hidden_token_trap');
          details.push(error);
        }
      }
    }
  }
  return { violations, details, quarantined };
}

function htmlPolicyErrors(html, label = 'html') {
  const errors = [];
  try {
    boundary.checkHtml(html, { label });
  } catch (error) {
    errors.push(...(error.errors || [error.message]));
  }
  if (!/class\s*=\s*["'][^"']*\bge-task-card\b[^"']*["'][^>]*data-ge-task-card[^>]*aria-label\s*=\s*["']Werkvragen["']/i.test(html)) {
    errors.push(`${label}: ge-task-card must expose data-ge-task-card and aria-label="Werkvragen"`);
  }
  [
    [/ge-task-header/i, 'visible/internal ge-task-header must be absent'],
    [/>Werkbank</i, 'visible Werkbank task-card label must be absent'],
    [/<h2>\s*Werkvragen\s*<\/h2>/i, 'visible Werkvragen task-card heading must be absent'],
  ].forEach(([pattern, message]) => {
    if (pattern.test(html)) errors.push(`${label}: ${message}`);
  });
  return errors;
}

function detectHtmlViolations(html, label = 'html') {
  const errors = htmlPolicyErrors(html, label);
  const violations = new Set();
  const text = errors.join('\n');
  if (/exit-ticket-app|et-page|et-topbar|task-shell\.css|exit-ticket\.css|skill-map-route\.css|task-shell-ui\.js|exit-ticket-ui\.js|legacy task-shell/i.test(text)) {
    violations.add('legacy_shell_or_asset');
  }
  if (/mix golden and legacy|mixed ge-\*|must not also be et-page|must not mix/i.test(text)) {
    violations.add('hybrid_golden_legacy_shell');
  }
  if (/task-shell\.css|exit-ticket\.css|skill-map-route\.css/i.test(text)) {
    violations.add('legacy_asset_on_golden_route');
  }
  if (errors.length) violations.add('layout_contract');
  return { violations, details: errors };
}

function detectProofViolations(proof) {
  const violations = new Set();
  const details = [];
  if (!proof) return { violations, details };
  const states = new Set(asArray(proof.states || proof.screenshot_states || proof.proof_states));
  const needsAfterInteraction = proof.requires_after_interaction === true
    || proof.surface_has_graph_or_formula === true
    || /graph|formula/i.test(asText(proof.surface || proof.controls || proof.required_controls));
  const claimsAdoption = proof.claims_route_adoption === true
    || proof.claims_product_use === true
    || proof.claims_scale_gate === true
    || proof.status === 'adoption_ready';
  const hasAfterInteraction = [...states].some((state) => /after.*(interaction|graph|formula)|wrong_retry|correct_completed/i.test(String(state)));
  if (needsAfterInteraction && claimsAdoption && !hasAfterInteraction) {
    violations.add('missing_after_interaction_proof');
    details.push('proof claims adoption for graph/formula surface without after-interaction evidence');
  }
  return { violations, details };
}

function detectFixtureViolations(fixture) {
  const violations = new Set();
  const details = [];
  const payload = fixture.payload || {};
  if (payload.html) {
    const result = detectHtmlViolations(payload.html, fixture.id);
    result.violations.forEach((item) => violations.add(item));
    details.push(...result.details);
  }
  if (payload.html_file) {
    const file = path.join(ROOT, payload.html_file);
    const result = detectHtmlViolations(read(file), fixture.id);
    result.violations.forEach((item) => violations.add(item));
    details.push(...result.details);
  }
  for (const data of asArray(payload.data ? [payload.data] : payload.data_cases)) {
    const result = detectDataViolations(data);
    result.violations.forEach((item) => violations.add(item));
    details.push(...result.details);
  }
  if (payload.proof) {
    const result = detectProofViolations(payload.proof);
    result.violations.forEach((item) => violations.add(item));
    details.push(...result.details);
  }
  return { violations, details };
}

function validateLayoutRegistry() {
  const registry = readJson(PATHS.layoutRegistryJson);
  assert(registry.schema_version === 1, 'layout registry schema_version must be 1');
  const layout = asArray(registry.layouts).find((item) => item.id === 'golden_exercise_workbench');
  assert(layout, 'layout registry missing golden_exercise_workbench');
  const selector = layout.current_selector || {};
  assert(selector['layout.framework'] === 'golden_exercise_workbench', 'layout registry must select Golden renderer by layout.framework');
  assert(!Object.prototype.hasOwnProperty.call(selector, 'parNr'), 'layout registry selector must not be pinned to parNr');
  assert(selector.supported_variant === 'golden_graph_reading_claim_v1', 'layout registry must name the current Golden renderer variant');
  const supportedVariants = asArray(selector.supported_variants);
  const graphVariant = supportedVariants.find((item) => item.id === 'golden_graph_reading_claim_v1');
  const graphAdvisoryVariant = supportedVariants.find((item) => item.id === 'golden_graph_advisory_v1');
  const calculationVariant = supportedVariants.find((item) => item.id === 'golden_calculation_structured_v1');
  const advisoryVariant = supportedVariants.find((item) => item.id === 'golden_advisory_short_check_v1');
  assert(graphVariant, 'layout registry must list golden_graph_reading_claim_v1 in supported_variants');
  assert(graphAdvisoryVariant, 'layout registry must list golden_graph_advisory_v1 in supported_variants');
  assert(calculationVariant, 'layout registry must list golden_calculation_structured_v1 in supported_variants');
  assert(advisoryVariant, 'layout registry must list golden_advisory_short_check_v1 in supported_variants');
  ['graph_construction_substitute', 'graph_reading', 'calculation_work_capture'].forEach((family) => {
    assert(asArray(graphVariant.required_task_families).includes(family), `graph variant missing required task family ${family}`);
  });
  ['graph_construction_substitute', 'graph_reading', 'table_value_selection'].forEach((family) => {
    assert(asArray(graphAdvisoryVariant.required_task_families).includes(family), `graph advisory variant missing required task family ${family}`);
  });
  ['calculation_work_capture', 'structured_short_response'].forEach((family) => {
    assert(asArray(calculationVariant.required_task_families).includes(family), `calculation variant missing required task family ${family}`);
  });
  assert(asArray(advisoryVariant.required_task_types).includes('choice'), 'advisory short-check variant must require choice tasks');
  assert(advisoryVariant.surface_type === 'advisory_short_check', 'advisory short-check variant must declare advisory surface type');
  assert(graphAdvisoryVariant.surface_type === 'advisory_short_check', 'graph advisory variant must declare advisory surface type');
  assert(graphVariant.requires_graph_spec === true, 'graph variant must require graph spec support');
  assert(graphAdvisoryVariant.requires_graph_spec === true, 'graph advisory variant must require graph spec support');
  assert(calculationVariant.requires_graph_spec === false, 'calculation variant must not require graph spec support');
  assert(advisoryVariant.requires_graph_spec === false, 'advisory short-check variant must not require graph spec support');
  ['graph_construction_substitute', 'graph_reading', 'calculation_work_capture'].forEach((family) => {
    assert(asArray(selector.required_task_families).includes(family), `layout registry selector missing required task family ${family}`);
  });
  assert(selector.requires_graph_spec === true, 'layout registry selector must require graph spec support');
  assert(selector.unsupported_behavior === 'fail_with_clear_error_no_legacy_fallback', 'layout registry must require unsupported Golden variants to fail clearly');
  assert(layout.required_shell && layout.required_shell.root === 'main.ge-page[data-golden-ticket-root]', 'layout registry must require golden root');
  ['.ge-hero', '.ge-workbench', '.ge-source-card', '.ge-task-card', '.ge-step-list', '.ge-feedback'].forEach((selector) => {
    assert(asArray(layout.required_shell.required_sections).includes(selector), `layout registry missing required section ${selector}`);
  });
  ['golden-ticket-layout.css', 'exit-ticket/{sourceKey}.js', 'golden-ticket-layout.js'].forEach((asset) => {
    assert(asArray(layout.required_shell.required_assets).includes(asset), `layout registry missing required asset ${asset}`);
  });
  ['#exit-ticket-app', 'main.et-page', 'header.et-topbar', 'task-shell.css', 'exit-ticket.css', 'skill-map-route.css', 'mixed ge-* and et-* classes'].forEach((item) => {
    assert(asArray(layout.forbidden_shell).includes(item), `layout registry missing forbidden shell item ${item}`);
  });
  assert(asArray(layout.proof_states).includes('after_interaction'), 'layout registry must require after_interaction proof state');
  return {
    layout_id: layout.id,
    supported_variant: selector.supported_variant,
    supported_variants: supportedVariants.map((item) => item.id),
    required_sections: layout.required_shell.required_sections.length,
  };
}

function validateInteractionPolicy() {
  const policy = readJson(PATHS.interactionPolicyJson);
  assert(policy.schema_version === 1, 'interaction policy schema_version must be 1');
  assert(policy.policy_id === 'golden-exercise-interaction-policy', 'interaction policy id mismatch');
  const formula = policy.task_family_controls && policy.task_family_controls.formula_structure;
  assert(formula, 'interaction policy missing formula_structure controls');
  ['left-to-right answer token order', 'visually identical hidden-token trap'].forEach((item) => {
    assert(asArray(formula.forbidden).includes(item), `interaction policy missing formula forbidden item ${item}`);
  });
  const graph = policy.task_family_controls && policy.task_family_controls.graph_construction;
  assert(graph, 'interaction policy missing graph_construction controls');
  assert(asArray(graph.forbidden).includes('fake line-shape check'), 'interaction policy must forbid fake line-shape check');
  assert(asArray(policy.proof_states).includes('after_graph_or_formula_interaction'), 'interaction policy must require after graph/formula interaction proof');
  const exitTicket = policy.surface_distinctions && policy.surface_distinctions.exit_ticket;
  assert(exitTicket, 'interaction policy missing exit_ticket surface distinction');
  assert(asArray(exitTicket.must).includes('same-level operation-chain proof'), 'exit ticket distinction must require same-level operation-chain proof');
  const shortCheck = policy.surface_distinctions && policy.surface_distinctions.advisory_short_check;
  assert(shortCheck, 'interaction policy missing advisory_short_check surface distinction');
  [
    'route advice allowed',
    'local repair feedback',
    'partial-skill rather than full target chain',
  ].forEach((item) => {
    assert(asArray(shortCheck.may_be).includes(item), `advisory short-check distinction missing may_be item ${item}`);
  });
  [
    'hidden/collapsible before attempt',
    'shown after attempt as local repair help',
  ].forEach((item) => {
    assert(asArray(shortCheck.hint_policy).includes(item), `advisory short-check hint policy missing ${item}`);
  });
  [
    'replace exit ticket',
    'claim target-equivalent proof',
    'claim paragraph completion',
    'claim completion language',
    'claim mastery',
    'claim diagnostics',
    'claim grading',
    'claim automatic sequencing',
    'claim summative use',
    'claim student/product use',
    'claim PV',
    'claim Scale Gate 1',
  ].forEach((item) => {
    assert(asArray(shortCheck.must_not).includes(item), `advisory short-check distinction missing must_not item ${item}`);
  });
  assert(shortCheck.authority && shortCheck.authority.advisory_only === true, 'advisory short-check authority must be advisory_only');
  assertFalseFields(shortCheck.authority, [
    'target_equivalent_proof_authorized',
    'paragraph_completion_authorized',
    'completion_language_authorized',
    'diagnostics_authorized',
    'grading_authorized',
    'mastery_authorized',
    'automatic_sequencing_authorized',
    'summative_use_authorized',
    'student_product_use_authorized',
    'pv_authorized',
    'scale_gate_1_authorized',
  ], 'advisory_short_check.authority');
  return { policy_id: policy.policy_id };
}

function validateShortCheckPolicySpec() {
  const registry = readJson(PATHS.layoutRegistryJson);
  const layout = asArray(registry.layouts).find((item) => item.id === 'golden_exercise_workbench');
  assert(layout, 'layout registry missing golden_exercise_workbench for short-check policy');
  const selector = layout.current_selector || {};
  const rendererVariantIds = asArray(selector.supported_variants).map((item) => item && item.id).filter(Boolean);
  assert(rendererVariantIds.includes('golden_advisory_short_check_v1'), 'short-check policy variant must be listed as a narrow current renderer variant');
  const surfaceSpec = asArray(selector.surface_variant_specs).find((item) => item.id === 'golden_advisory_short_check_v1');
  assert(surfaceSpec, 'layout registry missing golden_advisory_short_check_v1 surface variant spec');
  assert(surfaceSpec.surface_type === 'advisory_short_check', 'short-check surface variant must declare advisory_short_check');
  assert(surfaceSpec.status === 'first_route_rendered_pending_review', 'short-check surface variant must be first_route_rendered_pending_review');
  assert(surfaceSpec.renderer_status === 'current_narrow_renderer_selector', 'short-check surface variant must declare narrow renderer selector status');
  assert(surfaceSpec.specification === 'references/ui/layouts/golden-exercise-workbench-short-check.md', 'short-check surface variant specification path mismatch');
  assert(surfaceSpec.machine_contract === 'references/ui/layouts/golden-exercise-workbench-short-check.json', 'short-check surface variant JSON path mismatch');
  [
    'references/ui/layouts/golden-exercise-workbench-short-check.md',
    'references/ui/layouts/golden-exercise-workbench-short-check.json',
  ].forEach((item) => {
    assert(asArray(layout.current_references).includes(item), `layout registry current_references missing ${item}`);
  });

  const spec = readJson(PATHS.shortCheckSpecJson);
  assert(spec.schema_version === 1, 'short-check spec schema_version must be 1');
  assert(spec.variant_id === 'golden_advisory_short_check_v1', 'short-check spec variant_id mismatch');
  assert(spec.layout_id === 'golden_exercise_workbench', 'short-check spec layout_id mismatch');
  assert(spec.surface_type === 'advisory_short_check', 'short-check spec surface_type mismatch');
  assert(spec.status === 'first_route_rendered_pending_review', 'short-check spec status mismatch');
  assert(spec.renderer_status === 'current_narrow_renderer_selector', 'short-check spec must claim only narrow renderer selector status');
  assert(spec.scope && Array.isArray(spec.scope.real_routes_migrated), 'short-check spec must list real route migration scope');
  assert(spec.scope.real_routes_migrated.length === 1 && spec.scope.real_routes_migrated[0] === '1.1.2-korte-check', 'short-check spec must migrate only 1.1.2-korte-check');
  assert(spec.scope.generated_lesson_output_changed === true, 'short-check spec must record generated_lesson_output_changed true for first route');
  assert(spec.scope.implementation_migration_authorized === true, 'short-check spec must authorize the narrow implementation migration');
  assert(spec.scope.broad_migration_authorized === false, 'short-check spec must not authorize broad migration');
  assert(asArray(spec.distinction_table).length >= 6, 'short-check spec must include the required distinction table');
  ['authority', 'operation_proof', 'teaching_flow', 'hints', 'completion_wording', 'proof_states'].forEach((dimension) => {
    assert(asArray(spec.distinction_table).some((row) => row.dimension === dimension), `short-check distinction table missing ${dimension}`);
  });
  [
    'route advice',
    'local repair feedback after attempt',
    'hidden or collapsible hints',
    'after-attempt hints',
    'partial-skill operation slice',
  ].forEach((item) => {
    assert(asArray(spec.allowed_behavior).includes(item), `short-check spec missing allowed behavior ${item}`);
  });
  [
    'source/context first where source-dependent',
    'clear task cards',
    'local feedback after attempt',
    'mobile proof before rendered adoption',
    'dark-mode proof before rendered adoption',
    'no legacy shell',
  ].forEach((item) => {
    assert(asArray(spec.required_layout_quality).includes(item), `short-check spec missing layout quality item ${item}`);
  });
  assert(spec.authority && spec.authority.advisory_only === true, 'short-check spec authority must be advisory_only');
  assertFalseFields(spec.authority, [
    'target_equivalent_proof_authorized',
    'paragraph_completion_authorized',
    'completion_language_authorized',
    'diagnostics_authorized',
    'grading_authorized',
    'mastery_authorized',
    'automatic_sequencing_authorized',
    'summative_use_authorized',
    'student_product_use_authorized',
    'pv_authorized',
    'scale_gate_1_authorized',
    'exit_ticket_replacement_authorized',
  ], 'short_check_spec.authority');

  const requiredMdNeedles = [
    'target-equivalent candidate',
    'same-level operation-chain proof',
    'route advice allowed',
    'local hints allowed only hidden/collapsible or after attempt',
    'no completion-language claim',
    'may be partial-skill rather than full target chain',
    'target-equivalent proof',
    'paragraph completion',
    'mastery',
    'diagnostics',
    'grading',
    'automatic sequencing',
    'summative use',
    'student/product use',
    'PV',
    'Scale Gate 1',
    'no legacy shell',
  ];
  [
    [PATHS.shortCheckSpecMd, 'short-check spec markdown'],
    [PATHS.interactionPolicyMd, 'interaction policy markdown'],
    [PATHS.exerciseWorkbenchPolicyMd, 'exercise workbench policy markdown'],
  ].forEach(([file, label]) => assertIncludesText(read(file), requiredMdNeedles, label));
  assertIncludesText(read(PATHS.uiReadme), [
    'golden_advisory_short_check_v1',
    'references/ui/layouts/golden-exercise-workbench-short-check.md',
    'references/ui/layouts/golden-exercise-workbench-short-check.json',
  ], 'ui readme');
  assertIncludesText(read(PATHS.layoutRegistryMd), [
    'golden_advisory_short_check_v1',
    'narrow current renderer selector',
    '1.1.2-korte-check',
    'targetEquivalent.candidate: false',
    'no target-equivalent or paragraph-completion claim',
  ], 'layout registry markdown');
  assertIncludesText(read(PATHS.sharedTaskPolicyMd), [
    'advisory short-check rendered proof',
    'targetEquivalent.candidate',
    'route advice',
    'hidden/collapsible or after-attempt hints',
  ], 'shared task policy markdown');

  return {
    variant_id: spec.variant_id,
    status: spec.status,
    migrated_routes: spec.scope.real_routes_migrated,
    distinction_rows: spec.distinction_table.length,
    proof_states: spec.proof_before_rendered_adoption.length,
  };
}

function validateShortCheckPolicyProof() {
  const proof = readJson(PATHS.shortCheckProofJson);
  assert(proof.schema_version === 1, 'short-check proof schema_version must be 1');
  assert(proof.sprint_id === 'SHORT-CHECK-WORKBENCH-POLICY-1', 'short-check proof sprint_id mismatch');
  assert(['policy_defined_pending_review', 'policy_defined_pending_validation', 'passed'].includes(proof.status), 'short-check proof status mismatch');
  assert(proof.scope && proof.scope.real_routes_migrated === false, 'short-check proof must state real_routes_migrated false');
  assert(proof.scope.generated_lesson_output_changed === false, 'short-check proof must state generated_lesson_output_changed false');
  assert(proof.scope.lesson_repo_changed === false, 'short-check proof must state lesson_repo_changed false');
  assert(proof.scope.implementation_migration_authorized === false, 'short-check proof must state implementation_migration_authorized false');
  assert(proof.authority && proof.authority.advisory_only === true, 'short-check proof authority must be advisory_only');
  assertFalseFields(proof.authority, [
    'target_equivalent_proof_authorized',
    'paragraph_completion_authorized',
    'completion_language_authorized',
    'diagnostics_authorized',
    'grading_authorized',
    'mastery_authorized',
    'automatic_sequencing_authorized',
    'summative_use_authorized',
    'student_product_use_authorized',
    'pv_authorized',
    'scale_gate_1_authorized',
    'exit_ticket_replacement_authorized',
  ], 'short_check_proof.authority');
  [
    'references/ui/layouts/golden-exercise-workbench-short-check.md',
    'references/ui/layouts/golden-exercise-workbench-short-check.json',
    'reports/sprints/SHORT-CHECK-WORKBENCH-POLICY-1-plan.md',
    'reports/sprints/SHORT-CHECK-WORKBENCH-POLICY-1-result.md',
    'reports/json/short-check-workbench-policy-1-proof.json',
  ].forEach((item) => {
    assert(asArray(proof.files_created_or_updated).includes(item), `short-check proof missing file ${item}`);
  });
  assert(proof.review_targets && proof.review_targets.exit_ticket_short_check_distinction >= 9.0, 'short-check proof distinction target must be >= 9.0');
  assert(proof.review_targets.advisory_copy_safety >= 9.0, 'short-check proof advisory-copy target must be >= 9.0');
  assert(proof.review_targets.layout_transferability >= 8.5, 'short-check proof layout transferability target must be >= 8.5');
  assert(proof.review_targets.future_agent_usability >= 8.5, 'short-check proof future-agent usability target must be >= 8.5');
  return {
    sprint_id: proof.sprint_id,
    status: proof.status,
    validation_commands: asArray(proof.validation_commands).length,
  };
}

function validateExemplarIndexFormulaBoundary() {
  const index = readJson(PATHS.exemplarIndexJson);
  const implemented = asArray(index.entries).find((entry) => entry.id === '1.1.3-golden-exercise-workbench');
  assert(implemented, 'exemplar index missing implemented 1.1.3 entry');
  assert(asArray(implemented.must_not_use_for).includes('formula_token_policy'), 'implemented 1.1.3 must not be formula-token policy');
  assert(asArray(implemented.must_not_use_for).includes('hidden_token_trap_policy'), 'implemented 1.1.3 must not be hidden-token policy');
  const limitText = asText(implemented.limitations);
  assert(/A96/.test(limitText) && /formula-builder policy/i.test(limitText), 'implemented 1.1.3 limitation must keep A96 as formula-builder policy');
  assert(/local formula-token clarity/i.test(limitText), 'implemented 1.1.3 limitation must distinguish local clarity from formula-token policy');
  const a96 = asArray(index.entries).find((entry) => entry.id === 'a96-answer-form');
  assert(a96 && asArray(a96.use_for).includes('formula-builder policy'), 'A96 must remain formula-builder policy exemplar');
  return { implemented_boundary: implemented.id, formula_exemplar: a96.id };
}

function validateA96FixturePolicy() {
  const fixtures = readJson(PATHS.a96NegativeFixtures);
  const negative = fixtures.negative || {};
  assert(negative.leftToRightTokenClickOrder, 'A96 negative fixtures missing leftToRightTokenClickOrder');
  assert(negative.visuallyIdenticalOldPriceTokensWithDistinctIds, 'A96 negative fixtures missing visually identical token trap');
  return { exemplar_id: fixtures.exemplar_id, negative_count: Object.keys(negative).length };
}

function validateSharedTaskPolicyText() {
  const text = read(PATHS.sharedTaskPolicyMd);
  [
    'formula token banks ordered as the answer',
    'visually identical hidden-token traps',
    'fake graph slope/line-shape question',
    'missing after-interaction screenshot proof',
    'Do not downgrade the Workbench route into generic dropdowns or textareas',
  ].forEach((needle) => {
    assert(text.includes(needle), `shared task policy missing text: ${needle}`);
  });
  return { policy: rel(PATHS.sharedTaskPolicyMd) };
}

function loadCheckerFixtures() {
  const fixtures = readJson(PATHS.checkerFixtures);
  assert(fixtures.schema_version === 1, 'checker fixture schema_version must be 1');
  assert(Array.isArray(fixtures.fixtures), 'checker fixtures must contain fixtures array');
  return fixtures;
}

function checkNegativeFixtures(filter = () => true) {
  const fixtures = loadCheckerFixtures();
  const checked = [];
  for (const fixture of fixtures.fixtures.filter(filter)) {
    const result = detectFixtureViolations(fixture);
    assert(result.violations.has(fixture.expected_violation), `fixture ${fixture.id} expected ${fixture.expected_violation}, got ${[...result.violations].join(', ') || 'none'}`);
    checked.push({
      id: fixture.id,
      expected_violation: fixture.expected_violation,
      detected_violations: [...result.violations].sort(),
    });
  }
  return checked;
}

function checkImplementedSnapshotHtml() {
  const errors = htmlPolicyErrors(read(PATHS.implementedSnapshotHtml), rel(PATHS.implementedSnapshotHtml));
  assert(errors.length === 0, `implemented snapshot failed Golden HTML policy:\n${errors.join('\n')}`);
  return { snapshot: rel(PATHS.implementedSnapshotHtml) };
}

function checkCurrentGoldenSources() {
  const checked = [];
  for (const fileName of fs.readdirSync(PATHS.sourceDataDir).filter((name) => name.endsWith('.json')).sort()) {
    const file = path.join(PATHS.sourceDataDir, fileName);
    const data = readJson(file);
    if (!data.layout || data.layout.framework !== 'golden_exercise_workbench') continue;
    const result = detectDataViolations(data, { allowKnown113FormulaTrap: true });
    assert(result.violations.size === 0, `${rel(file)} failed Golden Exercise data policy: ${result.details.join('; ')}`);
    checked.push({
      file: rel(file),
      parNr: data.parNr,
      quarantined_formula_token_traps: result.quarantined,
    });
  }
  return checked;
}

module.exports = {
  ROOT,
  PATHS,
  rel,
  read,
  readJson,
  assert,
  taskShells,
  detectDataViolations,
  detectHtmlViolations,
  detectProofViolations,
  detectFixtureViolations,
  htmlPolicyErrors,
  validateLayoutRegistry,
  validateInteractionPolicy,
  validateExemplarIndexFormulaBoundary,
  validateA96FixturePolicy,
  validateShortCheckPolicySpec,
  validateShortCheckPolicyProof,
  validateSharedTaskPolicyText,
  loadCheckerFixtures,
  checkNegativeFixtures,
  checkImplementedSnapshotHtml,
  checkCurrentGoldenSources,
};
