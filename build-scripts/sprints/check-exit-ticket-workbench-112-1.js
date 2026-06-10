#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PROOF_PATH = path.join(ROOT, 'reports', 'json', 'exit-ticket-workbench-112-1-proof.json');

const ExitTicketEngine = require('../../engines/exit-ticket-engine');
const GoldenTicketLayout = require('../../engines/golden-ticket-layout');
const shells = require('../platform/build-exit-ticket-shells');
const exit111 = require('../../source-data/book-1/exit-ticket/1.1.1-exit-ticket.json');
const exit112 = require('../../source-data/book-1/exit-ticket/1.1.2-exit-ticket.json');
const exit113 = require('../../source-data/book-1/exit-ticket/1.1.3-exit-ticket.json');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function task(data, id) {
  const wrapper = data.tasks.find((item) => item.id === id);
  assert(wrapper && wrapper.taskShell, `missing task shell: ${id}`);
  return wrapper.taskShell;
}

function assertContains(text, needle, label) {
  assert(text.includes(needle), `${label} missing: ${needle}`);
}

function assertNotContains(text, needle, label) {
  assert(!text.includes(needle), `${label} must not contain: ${needle}`);
}

function assertNoOverclaim(text, label) {
  assert(!/(eindopgave|aankunt|bewezen|aangetoond|beheerst|diagnos|mastery|summatief|Scale Gate 1)/i.test(text), `${label} contains held-authority language`);
}

function assertContextRefs(data) {
  const contextIds = new Set(data.contextBlocks.map((block) => block.id));
  data.tasks.forEach((wrapper) => {
    const refs = wrapper.taskShell.contextRefs || [];
    assert(refs.length > 0, `${wrapper.id} must reference contextBlocks`);
    refs.forEach((ref) => assert(contextIds.has(ref), `${wrapper.id} has unknown context ref ${ref}`));
  });
}

function evaluateResponses() {
  const correct = {
    'prijsstijging-procent': GoldenTicketLayout.evaluateTaskResponse(task(exit112, 'prijsstijging-procent'), {
      work: '(920 - 800) / 800 x 100',
      finalAnswer: '15%',
      unitNotation: '%',
    }),
    'index-naar-waarde': GoldenTicketLayout.evaluateTaskResponse(task(exit112, 'index-naar-waarde'), {
      work: '162 / 150 x 100',
      finalAnswer: '108',
      unitNotation: '',
    }),
    'index-naar-procent': GoldenTicketLayout.evaluateTaskResponse(task(exit112, 'index-naar-procent'), {
      work: '(112 - 108) / 108 x 100',
      finalAnswer: '3,7%',
      unitNotation: '%',
    }),
    'indexpunten-uitleg': GoldenTicketLayout.evaluateTaskResponse(task(exit112, 'indexpunten-uitleg'), {
      fields: {
        indexpunten: '4 indexpunten',
        basis: '108',
        'procentuele-stijging': '3,7%',
      },
      choice: 'niet-vier-procent',
    }),
  };
  const retry = {
    'prijsstijging-procent': GoldenTicketLayout.evaluateTaskResponse(task(exit112, 'prijsstijging-procent'), {
      work: 'ik gok',
      finalAnswer: '15%',
      unitNotation: '%',
    }),
    'indexpunten-uitleg': GoldenTicketLayout.evaluateTaskResponse(task(exit112, 'indexpunten-uitleg'), {
      fields: {
        indexpunten: '4 procent',
        basis: '100',
        'procentuele-stijging': '4%',
      },
      choice: 'wel-vier-procent',
    }),
  };
  Object.entries(correct).forEach(([id, ok]) => assert(ok === true, `${id} correct response must pass`));
  Object.entries(retry).forEach(([id, ok]) => assert(ok === false, `${id} retry response must fail`));
  return { correct, retry };
}

function main() {
  assert(ExitTicketEngine.validateData(exit112) === true, '1.1.2 source data must validate');
  assert(exit112.layout && exit112.layout.framework === 'golden_exercise_workbench', '1.1.2 must opt into Golden Workbench');
  assert(GoldenTicketLayout.supportedVariantFor(exit112) === 'golden_calculation_structured_v1', '1.1.2 must select calculation/structured Golden variant');
  assert(GoldenTicketLayout.supportedVariantFor(exit113) === 'golden_graph_reading_claim_v1', '1.1.3 must keep graph Golden variant');
  assert(GoldenTicketLayout.supportedVariantFor(exit111) === null, '1.1.1 must not be migrated in this transfer');
  assert(exit112.targetEquivalent.candidate === true, '1.1.2 remains a target-equivalent candidate');
  assert(exit112.targetEquivalent.gateApproved === false, '1.1.2 Golden transfer must hold gate approval');
  assert(exit112.targetEquivalent.completionLanguageEligible === false, '1.1.2 Golden transfer must hold completion language');
  assert(exit112.metadataAlignment.targetReadinessEvidence === false, '1.1.2 Golden transfer must hold target-readiness evidence');
  assertContextRefs(exit112);
  assertNoOverclaim(JSON.stringify(exit112.completion || {}), '1.1.2 completion copy');

  const html = shells.generateShell('1.1.2', 'Percentages en indexcijfers', exit112, '1.1.2-exit-ticket');
  assertContains(html, 'class="ge-topbar"', '1.1.2 shell');
  assertContains(html, 'class="ge-page" data-golden-ticket-root', '1.1.2 shell');
  assertContains(html, 'shared/exit-ticket/1.1.2-exit-ticket.js', '1.1.2 shell');
  assertContains(html, 'shared/golden-ticket-layout.css', '1.1.2 shell');
  assertContains(html, 'shared/golden-ticket-layout.js', '1.1.2 shell');
  assertContains(html, 'data-ge-work', '1.1.2 shell');
  assertContains(html, 'data-ge-structured-choice', '1.1.2 shell');
  assertContains(html, 'data-ge-feedback="prijsstijging-procent"', '1.1.2 shell');
  assertNotContains(html, 'shared/golden-ticket-graph.js', '1.1.2 shell');
  assertNotContains(html, 'id="exit-ticket-app"', '1.1.2 shell');
  assertNotContains(html, 'class="et-page"', '1.1.2 shell');
  assertNotContains(html, 'shared/task-shell.css', '1.1.2 shell');
  assertNotContains(html, 'shared/exit-ticket.css', '1.1.2 shell');
  assertNotContains(html, 'shared/task-shell-ui.js', '1.1.2 shell');
  assertNotContains(html, 'shared/exit-ticket-ui.js', '1.1.2 shell');
  assertNoOverclaim(html, '1.1.2 shell');

  const responseProof = evaluateResponses();
  const proof = {
    schema_version: 1,
    sprint_id: 'EXIT-TICKET-WORKBENCH-112-1',
    generated: new Date().toISOString(),
    status: 'passed',
    source: rel(path.join(ROOT, 'source-data', 'book-1', 'exit-ticket', '1.1.2-exit-ticket.json')),
    renderer: {
      selected_variant: GoldenTicketLayout.supportedVariantFor(exit112),
      graph_runtime_loaded: false,
      legacy_shell_loaded: false,
    },
    proof_states: [
      'desktop_initial_contract',
      'wrong_retry_feedback',
      'correct_completed',
      'after_interaction',
      'no_legacy_dom',
    ],
    response_proof: responseProof,
    authority: {
      migrated_routes: ['1.1.2-exit-ticket'],
      broad_migration_authorized: false,
      generated_lesson_output_changed: false,
      legacy_renderers_deleted: false,
      product_use_authorized: false,
      scale_gate_1_authorized: false,
      target_equivalent_completion_language_authorized: false,
      diagnostics_mastery_or_summative_use_authorized: false,
    },
  };

  fs.mkdirSync(path.dirname(PROOF_PATH), { recursive: true });
  fs.writeFileSync(PROOF_PATH, `${JSON.stringify(proof, null, 2)}\n`);
  console.log(`EXIT-TICKET-WORKBENCH-112-1 passed; proof written to ${rel(PROOF_PATH)}`);
}

try {
  main();
} catch (error) {
  console.error(`check-exit-ticket-workbench-112-1 failed: ${error.message}`);
  process.exit(1);
}
