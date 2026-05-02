#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep AUTHORIZED_ORDER aligned with the human gate closure before reuse.
 * - This script may write gate/report/sprint artifacts directly, but protected
 *   machine references must only be changed through the CLI command invoked
 *   here: build-scripts/references/unit-add.js.
 * - Market/welfare duplicate areas are intentionally outside RX.4 mutation.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GATE_DIR = 'reports/review-gates/GATE-RX4-elasticity-market-diagram-review';
const SPECS_PATH = `${GATE_DIR}/candidate-specs.json`;
const UNITS_PATH = 'references/machine/micro-teaching-units.json';
const HUMAN_JSON = `${GATE_DIR}/human-interview.json`;
const HUMAN_MD = `${GATE_DIR}/human-interview.md`;
const CLOSURE_JSON = `${GATE_DIR}/gate-closure.json`;
const CLOSURE_MD = `${GATE_DIR}/gate-closure.md`;
const BLOCK_JSON = `${GATE_DIR}/RX.4-generator-blocked-units.json`;
const BLOCK_MD = `${GATE_DIR}/RX.4-generator-blocked-units.md`;
const MUTATION_LOG_JSON = `${GATE_DIR}/RX.4-mutation-log.json`;
const MUTATION_LOG_MD = `${GATE_DIR}/RX.4-mutation-log.md`;
const TODAY = '2026-05-02';
const AUTHORIZED_ORDER = ['A82', 'A84', 'A83'];
const AUTHORIZED_CANDIDATES = ['A82', 'A84'];
const CONDITIONALLY_AUTHORIZED_CANDIDATES = ['A83'];
const REQUIRED_DEPENDENCIES = {
  A82: ['A15', 'A61', 'A66'],
  A83: ['A15', 'A46', 'A66'],
  A84: ['A15', 'A67'],
};
const A83_NAME = 'Prijselasticiteit van de vraag berekenen uit P-Q-grafiek';
const ELASTICITY_INTERPRETATION_REQUIREMENTS = [
  'preserve sign of elasticity',
  'interpret absolute value of elasticity',
  'distinguish elastic, inelastic, and unitary elastic demand',
  'apply interpretation to economic context',
  'for A84, explicitly connect elasticity to omzet effect',
];
const PV_GRAPH_CONSTRAINTS = [
  'title and economic context',
  'horizontal and vertical axes',
  'units and scale',
  'direct labels or legend',
  'exact versus estimated reading where relevant',
  'reading two price/quantity pairs before calculating',
  'non-color fallback requirement for later PV visual-state templates',
];
const HELD_SCOPE = [
  'market/welfare duplicate areas',
  'new welfare/surplus units overlapping A19',
  'new welfare/surplus units overlapping A32',
  'new welfare/surplus units overlapping A40',
  'new intervention graph units overlapping D39',
  'new intervention graph units overlapping D40',
  'new short-side/intervention units overlapping A51',
  'new short-side/intervention units overlapping A56',
  'new short-side/intervention units overlapping A59',
];
const BLOCKED_SCOPE = [
  ...HELD_SCOPE,
  'student diagnostics',
  'adaptive routing',
  'student-facing AI',
  'automatic sequencing',
  'mastery decisions',
  'summative use',
  'student-facing PV projection',
];

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function writeJson(relPath, data) {
  fs.mkdirSync(path.dirname(repoPath(relPath)), { recursive: true });
  fs.writeFileSync(repoPath(relPath), `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(relPath, text) {
  fs.mkdirSync(path.dirname(repoPath(relPath)), { recursive: true });
  fs.writeFileSync(repoPath(relPath), text.replace(/\n*$/, '\n'));
}

function fail(message) {
  console.error(`RX.4 apply failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function sameArray(actual, expected) {
  return JSON.stringify(actual || []) === JSON.stringify(expected || []);
}

function commandText(spec) {
  return `node build-scripts/references/unit-add.js --spec '${JSON.stringify(spec)}'`;
}

function finalSpec(id) {
  if (id === 'A82') {
    return {
      id: 'A82',
      name: 'Elasticiteit berekenen uit tabelwaarden',
      kern: 'Bereken prijselasticiteit nadat je oude en nieuwe prijs- en hoeveelheidswaarden uit een tabel hebt geselecteerd en de juiste waardenparen hebt gekoppeld.',
      needs: REQUIRED_DEPENDENCIES.A82,
      mastery_target: 'apply',
      prior_learning: 'new_this_year',
      aspects: ['rekenen', 'verbaal'],
      terms: [],
      procedure: [
        'Lees de vraag en bepaal welke prijs- en hoeveelheidsvariabelen bij de elasticiteit horen.',
        'Selecteer in de tabel de oude prijs, oude hoeveelheid, nieuwe prijs en nieuwe hoeveelheid en controleer rij, kolom, periode en eenheid.',
        'Controleer dat oude prijs en oude hoeveelheid bij dezelfde situatie horen en dat nieuwe prijs en nieuwe hoeveelheid bij dezelfde situatie horen.',
        'Label per variabele de basiswaarde en vergelijkingswaarde.',
        'Bereken de procentuele verandering van Q en de procentuele verandering van P.',
        'Bereken Ev = procentuele verandering Q gedeeld door procentuele verandering P.',
        'Interpreteer teken, absolute waarde en elastisch, inelastisch of unitair elastisch in de economische context.',
      ],
      pitfalls: [
        'De verkeerde tabelrijen of perioden koppelen.',
        'Oude prijs bij nieuwe hoeveelheid gebruiken of andersom.',
        'P en Q omwisselen in de elasticiteitsbreuk.',
        'Absolute veranderingen gebruiken in plaats van procentuele veranderingen.',
        'Het teken of de absolute waarde negeren bij de interpretatie.',
      ],
      generator: 'GEN_A82',
    };
  }

  if (id === 'A84') {
    return {
      id: 'A84',
      name: 'Omzetverandering beoordelen met elasticiteit uit bron',
      kern: 'Beoordeel met brongegevens en prijselasticiteit of omzet stijgt, daalt of ongeveer gelijk blijft: bij elastische vraag beweegt omzet tegengesteld aan de prijs, bij inelastische vraag mee met de prijs, en bij unitair elastische vraag ongeveer niet.',
      needs: REQUIRED_DEPENDENCIES.A84,
      mastery_target: 'apply',
      prior_learning: 'new_this_year',
      aspects: ['rekenen', 'verbaal'],
      terms: [],
      procedure: [
        'Lees uit de bron welke prijsverandering, hoeveelheidsverandering of elasticiteitswaarde gegeven is.',
        'Bepaal met de absolute waarde van de elasticiteit of de vraag elastisch, inelastisch of unitair elastisch is.',
        'Bij elastische vraag beweegt omzet tegengesteld aan de prijs: prijs omhoog betekent omzet omlaag en prijs omlaag betekent omzet omhoog.',
        'Bij inelastische vraag beweegt omzet mee met de prijs: prijs omhoog betekent omzet omhoog en prijs omlaag betekent omzet omlaag.',
        'Bij unitair elastische vraag blijft omzet ongeveer gelijk omdat prijs- en hoeveelheidsverandering elkaar ongeveer compenseren.',
        'Gebruik TO = P maal Q of vergelijk de procentuele effecten om de richting van de omzetverandering te onderbouwen.',
        'Controleer teken, absolute waarde en context, en formuleer het oordeel met verwijzing naar de brongegevens.',
      ],
      pitfalls: [
        'Elastische en inelastische vraag omdraaien bij de omzetrichting.',
        'Het minteken mechanisch gebruiken zonder de omzetbetekenis te controleren.',
        'Omzet en winst door elkaar halen.',
        'Alleen een procentuele verandering berekenen zonder de elasticiteitscategorie te interpreteren.',
      ],
      generator: 'GEN_A84',
    };
  }

  if (id === 'A83') {
    return {
      id: 'A83',
      name: A83_NAME,
      kern: 'Lees twee prijs-hoeveelheidsparen uit een P-Q-grafiek van de vraag af en bereken de prijselasticiteit van de vraag met correcte procentuele veranderingen.',
      needs: REQUIRED_DEPENDENCIES.A83,
      mastery_target: 'apply',
      prior_learning: 'new_this_year',
      aspects: ['grafisch', 'rekenen'],
      terms: [],
      procedure: [
        'Lees de titel en bepaal dat de grafiek een vraagrelatie tussen prijs en gevraagde hoeveelheid toont.',
        'Controleer horizontale as, verticale as, eenheden, schaal en directe labels of legenda.',
        'Kies twee punten of twee situaties die bij de vraag horen en bepaal of de waarden exact of geschat moeten worden afgelezen.',
        'Lees bij elk punt de prijs en hoeveelheid af en noteer beide P,Q-paren.',
        'Bepaal voor prijs en hoeveelheid welke waarde oud of basis is en welke waarde nieuw of vergelijking is.',
        'Bereken de procentuele verandering van Q en de procentuele verandering van P.',
        'Bereken Ev = procentuele verandering Q gedeeld door procentuele verandering P.',
        'Interpreteer teken, absolute waarde en elastisch, inelastisch of unitair elastisch, en controleer of de uitkomst past bij de grafiek.',
      ],
      pitfalls: [
        'Slechts een punt aflezen en daarna een helling berekenen.',
        'P en Q of de assen verwisselen.',
        'Geschatte grafiekwaarden behandelen alsof ze exact zijn.',
        'Absolute veranderingen gebruiken in plaats van procentuele veranderingen.',
        'De grafiekhelling behandelen alsof die hetzelfde is als elasticiteit.',
        'Het teken of de absolute waarde negeren bij de interpretatie.',
      ],
      generator: 'GEN_A83',
    };
  }

  fail(`unknown final spec id: ${id}`);
}

function runUnitAdd(spec) {
  const result = spawnSync(process.execPath, ['build-scripts/references/unit-add.js', '--spec', JSON.stringify(spec)], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    shell: false,
  });
  return {
    step: `add unit ${spec.id}`,
    unit_id: spec.id,
    command: commandText(spec),
    final_spec: spec,
    status: result.status === 0 ? 'passed' : 'failed',
    exit_code: result.status,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

function validateLivePreconditions() {
  const units = readJson(UNITS_PATH);
  const existingIds = new Set(units.map((unit) => unit.id));
  const occupied = AUTHORIZED_ORDER.filter((id) => existingIds.has(id));
  assert(occupied.length === 0, `authorized IDs already exist: ${occupied.join(', ')}`);

  for (const dep of ['A15', 'A46', 'A61', 'A66', 'A67']) {
    assert(existingIds.has(dep), `required dependency missing before mutation: ${dep}`);
  }

  for (const held of ['A19', 'A32', 'A40', 'D39', 'D40', 'A51', 'A56', 'A59']) {
    assert(existingIds.has(held), `held duplicate-audit reference missing: ${held}`);
  }

  const available = new Set(existingIds);
  for (const id of AUTHORIZED_ORDER) {
    const spec = finalSpec(id);
    assert(sameArray(spec.needs, REQUIRED_DEPENDENCIES[id]), `${id} needs do not match the human decision`);
    for (const need of spec.needs || []) {
      assert(available.has(need), `${id} depends on missing or later unit ${need}`);
    }
    available.add(id);
  }

  const maxA = units
    .filter((unit) => /^A\d+$/.test(unit.id))
    .map((unit) => unit.id)
    .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))
    .at(-1);

  return {
    checked_on: new Date().toISOString(),
    live_a_domain_max_id_before_mutation: maxA,
    authorized_ids_available: true,
    occupied_authorized_ids: occupied,
    dependency_check: 'passed',
    required_dependencies: REQUIRED_DEPENDENCIES,
    execution_order: AUTHORIZED_ORDER,
  };
}

function writeGateFiles() {
  const answers = [
    ['RX4-Q1', 'A. Yes, keep RX.4 limited to elasticity representation candidates and duplicate-audit holds', 'RX.4 stays focused on elasticity representations and duplicate-audit holds.'],
    ['RX4-Q2', 'A. Yes, authorize mutation review for A82 with source-value pairing emphasized', 'A82 is approved with needs A15, A61, and A66.'],
    ['RX4-Q3', 'B. Mostly; preserve A15/A67 but explicitly encode elasticity-and-omzet reasoning in the spec', 'A84 is approved with needs A15 and A67, and the final spec must encode the elasticity-to-omzet relationship.'],
    ['RX4-Q4', 'B. Conditional: approve A83 only with explicit naming/scope decision', `A83 is approved only with the final name ${A83_NAME} and a demand-elasticity P-Q graph scope.`],
    ['RX4-Q5', 'A. Yes, require sign and absolute-value interpretation in every approved spec', 'Every approved unit must distinguish sign, absolute value, elastic/inelastic/unitary, and economic interpretation.'],
    ['RX4-Q6', 'A. Yes, keep market/welfare duplicate areas held unless a later focused review moves one into scope', 'No new market/welfare units are authorized in RX.4.'],
    ['RX4-Q7', 'A. Yes, hard block student-facing use', 'All approved units remain generator-blocked/non-interactive.'],
    ['RX4-Q8', 'A. Yes for A82/A84 after live checks; A83 only if the graph-source decision is explicit', 'CLI-only mutation is authorized for A82 and A84, and conditionally for A83 with recorded naming/scope.'],
    ['RX4-Q9', 'pass_with_conditions', 'Close the gate as pass_with_conditions, not clean pass.'],
  ].map(([id, answer, decision]) => ({ id, answer, decision }));

  const human = {
    gate_id: 'GATE-RX4-elasticity-market-diagram-review',
    sprint_id: 'RX.4',
    recorded_on: TODAY,
    reviewer_role: 'Head of Content Strategy',
    decision: 'pass_with_conditions',
    closure_authorized: true,
    plain_pass_authorized: false,
    cli_unit_mutation_authorized: true,
    authorized_candidates: AUTHORIZED_CANDIDATES,
    conditionally_authorized_candidates: CONDITIONALLY_AUTHORIZED_CANDIDATES,
    authorized_execution_mode: 'CLI-only via build-scripts/references/unit-add.js',
    required_execution_order: AUTHORIZED_ORDER,
    required_dependencies: REQUIRED_DEPENDENCIES,
    a83_naming_decision: {
      preferred_name: A83_NAME,
      scope: 'demand-elasticity from a P-Q graph, not a broad all-elasticities graph unit',
      condition: 'Final name and graph-source scope must be recorded in gate closure and mutation log before mutation.',
    },
    elasticity_interpretation_requirements: ELASTICITY_INTERPRETATION_REQUIREMENTS,
    pv_graph_constraints_required_for_A83: PV_GRAPH_CONSTRAINTS,
    held_scope: HELD_SCOPE,
    generator_block_required: true,
    student_facing_use_authorized: false,
    pv_projection_authorized: false,
    answers,
    pattern_analysis: 'The answers approve A82 and A84 for CLI-only mutation, conditionally approve A83 with the preferred P-Q graph demand-elasticity name and scope, keep market/welfare duplicate areas held, and preserve generator/product-surface blocks.',
    targeted_followups_required: true,
    targeted_followups: [
      'Run live numbering and dependency checks immediately before mutation.',
      'Use only unit-add.js.',
      'Record the A83 naming/scope decision in gate closure and mutation log.',
      'Encode the elasticity-to-omzet reasoning in A84.',
      'Keep market/welfare duplicate areas held.',
      'Track A82, A83, and A84 as generator-blocked/non-interactive until generators exist and validate.',
      'Keep student-facing skill-tree use, PV projection, diagnostics, adaptive routing, AI, sequencing, mastery, and summative use blocked.',
    ],
  };

  const closure = {
    gate_id: 'GATE-RX4-elasticity-market-diagram-review',
    sprint_id: 'RX.4',
    status: 'pass_with_conditions',
    closed_on: TODAY,
    closure_confirmed_by_human: true,
    human_interview: HUMAN_MD,
    review_packet: `${GATE_DIR}/review-packet.md`,
    audit: SPECS_PATH,
    summary: 'RX.4 elasticity and market-diagram review is closed as pass_with_conditions. CLI-only mutation is authorized for A82 and A84, and conditionally for A83 with the final name Prijselasticiteit van de vraag berekenen uit P-Q-grafiek and explicit demand-elasticity P-Q graph scope. All units remain generator-blocked/non-interactive; PV projection and product-surface uses remain blocked.',
    protected_reference_data_changed: false,
    cli_unit_mutation_authorized: true,
    authorized_execution_mode: 'CLI-only via build-scripts/references/unit-add.js',
    authorized_candidates: AUTHORIZED_CANDIDATES,
    conditionally_authorized_candidates: CONDITIONALLY_AUTHORIZED_CANDIDATES,
    required_execution_order: AUTHORIZED_ORDER,
    required_dependencies: REQUIRED_DEPENDENCIES,
    a83_naming_decision: human.a83_naming_decision,
    elasticity_interpretation_requirements: ELASTICITY_INTERPRETATION_REQUIREMENTS,
    pv_graph_constraints_required_for_A83: PV_GRAPH_CONSTRAINTS,
    held_scope: HELD_SCOPE,
    generator_block_required: true,
    student_facing_use_authorized: false,
    pv_projection_authorized: false,
    blocked_scope: BLOCKED_SCOPE,
    accepted_outcomes: [
      'RX.4 is limited to elasticity representation candidates and market/welfare duplicate-audit holds.',
      'A82 is accepted with needs A15, A61, and A66.',
      'A84 is accepted with needs A15 and A67, provided elasticity-and-omzet reasoning is explicit.',
      `A83 is conditionally accepted with the final name ${A83_NAME}.`,
      'A83 remains demand-elasticity specific and must not become a broad all-elasticities graph unit.',
      'All approved specs must preserve sign, absolute-value interpretation, elastic/inelastic/unitary distinction, and economic context.',
      'CLI-only mutation may proceed after live checks.',
      'Missing generators are acceptable only if the units remain generator-blocked and non-interactive.',
    ],
    blocked_outcomes: [
      'Do not mint new market/welfare units in RX.4.',
      'Do not mutate surplus/welfare units overlapping A19, A32, A40, D39, or D40.',
      'Do not mutate short-side or intervention graph units overlapping A51, A56, or A59.',
      'Do not hand-edit references/machine/.',
      'Do not hand-edit references/external/.',
      'Do not mutate authored source files.',
      'Do not patch RAG chunks by hand.',
      'Do not expose A82, A83, or A84 in student-facing skill-tree or PV projection before generator/projection support exists.',
      'Do not authorize diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative use, or student-facing PV projection.',
    ],
    explicit_decisions: [
      {
        topic: 'gate status',
        decision: 'Close GATE-RX4-elasticity-market-diagram-review as pass_with_conditions, not clean pass.',
      },
      {
        topic: 'mutation authorization',
        decision: 'Authorize CLI-only unit mutation for A82 and A84, and conditionally for A83 with the final naming/scope decision recorded.',
      },
      {
        topic: 'A82 dependencies',
        decision: 'A82 must include A15, A61, and A66 as needs.',
      },
      {
        topic: 'A84 dependencies and concept boundary',
        decision: 'A84 must include A15 and A67 as needs and explicitly encode the elasticity-to-omzet relationship.',
      },
      {
        topic: 'A83 naming and scope',
        decision: `A83 must use the name ${A83_NAME} and stay scoped to demand elasticity from a P-Q graph.`,
      },
      {
        topic: 'market/welfare duplicate areas',
        decision: 'Keep market/welfare duplicate areas held unless a later focused review moves one into scope.',
      },
      {
        topic: 'generator status',
        decision: 'A82, A83, and A84 remain generator-blocked/non-interactive until their generators exist and validate.',
      },
    ],
    conditions_to_reopen_or_pass: [
      'Run live numbering check immediately before any later mutation.',
      'Use only unit-add.js; no hand edits to references/machine.',
      'Record the A83 naming/evidence decision in the gate closure and mutation log.',
      'A83 may be mutated only if the final spec uses an explicit P-Q graph demand-elasticity scope.',
      'Keep market/welfare duplicate areas held unless explicitly re-approved by a later focused review.',
      'Mark any newly approved A-domain units generator-blocked and non-interactive.',
      'Do not hand-edit references/external, authored source files, or RAG chunks.',
      'No diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative use, or student-facing PV projection is authorized.',
    ],
    allowed_next_step: 'RX.4 CLI-only elasticity representation mutation execution',
    allowed_next_step_scope: [
      'live A-domain numbering check',
      'dependency resolution check',
      'unit-add.js execution for A82, A84, and conditionally approved A83',
      'A83 naming/scope application',
      'generator-blocked/non-interactive tracking',
      'validation and report regeneration',
    ],
  };

  writeJson(HUMAN_JSON, human);
  writeJson(CLOSURE_JSON, closure);

  const answerMd = answers
    .map((answer) => `### ${answer.id}\n\nAnswer: ${answer.answer}\n\n${answer.decision}`)
    .join('\n\n');
  writeText(
    HUMAN_MD,
    `# Human Interview: GATE-RX4 Elasticity And Market Diagram Review

Recorded on: ${TODAY}  
Reviewer role: Head of Content Strategy  
Decision: \`pass_with_conditions\`

## Answers

${answerMd}

## Decision Pattern

The review authorizes CLI-only mutation for \`A82\` and \`A84\`, conditionally authorizes \`A83\` with the final name \`${A83_NAME}\`, requires elasticity sign and absolute-value interpretation in every approved spec, and keeps market/welfare duplicate areas plus product-surface uses blocked.

## Authorized Candidates

- \`A82\`
- \`A84\`

## Conditionally Authorized Candidate

- \`A83\`: final name \`${A83_NAME}\`; scoped to demand elasticity from a P-Q graph.

## Required Follow-Ups

- Re-check live A-domain numbering immediately before mutation.
- Use \`unit-add.js\` only.
- Encode elasticity-to-omzet reasoning in \`A84\`.
- Record \`A83\` naming/scope in gate closure and mutation log.
- Track all three generators as missing/non-interactive until implemented and validated.
- Keep market/welfare duplicate areas, student-facing skill-tree use, PV projection, diagnostics, adaptive routing, AI, sequencing, mastery, and summative use blocked.
`
  );
  writeText(
    CLOSURE_MD,
    `# Gate Closure: GATE-RX4 Elasticity And Market Diagram Review

Status: \`pass_with_conditions\`  
Closed on: ${TODAY}  
Human confirmation: yes

## Summary

RX.4 is closed as \`pass_with_conditions\`. CLI-only mutation is authorized for \`A82\` and \`A84\`, and conditionally for \`A83\` with the final name \`${A83_NAME}\`.

## Accepted Outcomes

- \`A82\` must include \`A15\`, \`A61\`, and \`A66\` as needs.
- \`A84\` must include \`A15\` and \`A67\` as needs and explicitly encode elasticity-to-omzet reasoning.
- \`A83\` must include \`A15\`, \`A46\`, and \`A66\` as needs and stay scoped to demand elasticity from a P-Q graph.
- All approved units must preserve sign, absolute-value interpretation, elastic/inelastic/unitary distinction, and economic context.
- All approved units remain generator-blocked and non-interactive until generator/projection support exists and validates.

## Blocked Outcomes

- No new market/welfare/surplus/intervention graph units in RX.4.
- No hand edits to \`references/machine/\`, \`references/external/\`, authored source files, or RAG chunks.
- No student-facing skill-tree use, PV projection, diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative use.

## Next Allowed Step

Run the approved CLI-only mutation for \`A82\`, \`A84\`, and conditionally approved \`A83\`, then validate and regenerate the reference/RAG surfaces.
`
  );
}

function writeGeneratorBlock() {
  const units = AUTHORIZED_ORDER.map((unitId) => ({
    unit_id: unitId,
    generator: `GEN_${unitId}`,
    generator_implemented: false,
    student_facing_skilltree_use_allowed: false,
    pv_projection_allowed: false,
    blocker: 'generator/projection support missing; student-facing use blocked until implementation and validation',
  }));
  writeJson(BLOCK_JSON, {
    schema_version: 1,
    sprint_id: 'RX.4',
    status: 'active_block',
    generated_on: new Date().toISOString(),
    generator_blocked_units: AUTHORIZED_ORDER,
    missing_generators: AUTHORIZED_ORDER.map((id) => `GEN_${id}`),
    student_facing_use_authorized: false,
    student_facing_skilltree_use_allowed: false,
    pv_projection_authorized: false,
    pv_projection_allowed: false,
    units,
    notes: [
      'These units are live catalog entries only after RX.4 CLI mutation.',
      'No student-facing skill-tree or PV projection use is authorized before generator/projection support exists and validates.',
    ],
  });
  writeText(
    BLOCK_MD,
    `# RX.4 Generator-Blocked Units

Status: \`active_block\`

The following units are live catalog entries but remain non-interactive until generators and projection support exist and validate:

- \`A82\` / \`GEN_A82\`
- \`A84\` / \`GEN_A84\`
- \`A83\` / \`GEN_A83\`

No student-facing skill-tree use, PV projection, diagnostics, adaptive routing, AI, sequencing, mastery, or summative use is authorized.
`
  );
}

function writeMutationLog(preExecutionCheck, commands, status = 'completed') {
  const commandsPassed = commands.filter((command) => command.status === 'passed').length;
  const commandsFailed = commands.filter((command) => command.status === 'failed').length;
  const log = {
    sprint_id: 'RX.4',
    generated_on: new Date().toISOString(),
    status,
    decision_source: CLOSURE_JSON,
    execution_mode: 'CLI-only via build-scripts/references/unit-add.js',
    pre_execution_check: preExecutionCheck,
    commands,
    applied: {
      units_added: commands.filter((command) => command.status === 'passed').map((command) => command.unit_id),
      required_execution_order: AUTHORIZED_ORDER,
      required_dependencies: REQUIRED_DEPENDENCIES,
    },
    a83_naming_decision: {
      final_name: A83_NAME,
      scope: 'demand-elasticity from a P-Q graph, not a broad all-elasticities graph unit',
    },
    elasticity_interpretation_requirements: ELASTICITY_INTERPRETATION_REQUIREMENTS,
    generator_block: {
      tracked_in: BLOCK_JSON,
      status: 'active_block',
      units: AUTHORIZED_ORDER.map((unitId) => ({
        unit_id: unitId,
        generator: `GEN_${unitId}`,
        generator_implemented: false,
        student_facing_skilltree_use_allowed: false,
        pv_projection_allowed: false,
      })),
    },
    blocked_scope: BLOCKED_SCOPE,
    constraints: [
      'CLI-only mutation',
      'no hand edits to references/machine',
      'no hand edits to references/external',
      'no authored-source mutation',
      'no RAG chunk patching',
      'no student-facing skill-tree or PV projection before generator/projection support',
    ],
    summary: {
      units_added: commandsPassed,
      commands_passed: commandsPassed,
      commands_failed: commandsFailed,
    },
  };
  writeJson(MUTATION_LOG_JSON, log);
  writeText(
    MUTATION_LOG_MD,
    `# RX.4 Mutation Log

Status: \`${status}\`  
Execution mode: CLI-only via \`build-scripts/references/unit-add.js\`

## Pre-Execution Check

- Live A-domain max before mutation: \`${preExecutionCheck.live_a_domain_max_id_before_mutation}\`
- Authorized IDs available: ${preExecutionCheck.authorized_ids_available ? 'yes' : 'no'}
- Dependency check: \`${preExecutionCheck.dependency_check}\`

## Commands

${commands.map((command) => `- \`${command.unit_id}\`: ${command.status}`).join('\n')}

## Applied Units

${commands.filter((command) => command.status === 'passed').map((command) => `- \`${command.unit_id}\``).join('\n')}

## A83 Naming Decision

\`A83\` was added as \`${A83_NAME}\`, scoped to demand elasticity from a P-Q graph.

## Generator Block

\`A82\`, \`A83\`, and \`A84\` remain generator-blocked/non-interactive until their generators exist and validate.

## Blocked Scope

No mutation or student-facing use was authorized for market/welfare duplicate areas, student-facing skill-tree use, PV projection, diagnostics, adaptive routing, student-facing AI, sequencing, mastery, or summative use.
`
  );
}

function main() {
  const specs = readJson(SPECS_PATH);
  assert(specs.sprint_id === 'RX.4', 'candidate specs must be RX.4');

  writeGateFiles();
  const preExecutionCheck = validateLivePreconditions();

  const commands = [];
  for (const id of AUTHORIZED_ORDER) {
    const result = runUnitAdd(finalSpec(id));
    commands.push(result);
    if (result.status !== 'passed') {
      writeGeneratorBlock();
      writeMutationLog(preExecutionCheck, commands, 'failed');
      fail(`${id} unit-add.js failed`);
    }
  }

  writeGeneratorBlock();
  writeMutationLog(preExecutionCheck, commands, 'completed');
  console.log(`OK RX.4 applied: ${AUTHORIZED_ORDER.join(', ')}`);
}

if (require.main === module) main();
