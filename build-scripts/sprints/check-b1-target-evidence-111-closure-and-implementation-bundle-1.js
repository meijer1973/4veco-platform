#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_BOOK_ROOT = process.env.LESSON_BOOK_ROOT || process.env.MODULE_ROOT || path.resolve(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');
const SOURCE_DIR = path.join(ROOT, 'source-data', 'book-1', 'exit-ticket');
const PROOF_PATH = path.join(ROOT, 'reports', 'json', 'b1-target-evidence-111-closure-and-implementation-bundle-1-proof.json');

const ExitTicketEngine = require('../../engines/exit-ticket-engine');
const { loadConfig } = require('../lib/lib-deploy-config');

function fail(message) {
  console.error(`B1-TARGET-EVIDENCE-111-CLOSURE-AND-IMPLEMENTATION-BUNDLE-1 failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON ${file}: ${error.message}`);
  }
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function loadGeneratedExitTicketData(file) {
  const source = read(file);
  const context = { module: { exports: {} } };
  context.exports = context.module.exports;
  context.self = context;
  vm.createContext(context);
  vm.runInContext(source, context, { filename: file });
  return context.module.exports;
}

function taskShell(data, id) {
  const wrapper = data.tasks.find((task) => task.id === id);
  assert(wrapper && wrapper.taskShell, `missing task shell: ${id}`);
  return wrapper.taskShell;
}

function flattenStudentText(data) {
  return ExitTicketEngine.collectStudentText(data).join('\n');
}

function assertNoText(text, pattern, label) {
  assert(!pattern.test(text), `${label} contains forbidden text: ${pattern}`);
}

function assertHasWorkVariant(shell, label, value) {
  const group = (shell.expected.requiredWorkText || []).find((entry) => entry.label === label);
  assert(group, `${shell.id || shell.prompt} missing required work group ${label}`);
  assert((group.any || []).includes(value), `${label} missing accepted work variant: ${value}`);
}

function completeCorrectAttempt(data) {
  const engine = new ExitTicketEngine({ data });
  assert(engine.checkTask('tarwe-opbrengst', {
    work: '500 x 10',
    finalAnswer: '5000',
    unitNotation: 'euro',
  }).matched === true, 'tarwe profit reversed multiplication must match');
  assert(engine.checkTask('alternatieve-kosten-mais', {
    work: '350 x 10',
    finalAnswer: '3500',
    unitNotation: 'euro',
  }).matched === true, 'corn opportunity-cost reversed multiplication must match');
  assert(engine.checkTask('buurvrouw-gemengd', {
    work: '500 x 6 plus 350 x 4 = 4400',
    finalAnswer: '4400',
    unitNotation: 'euro',
  }).matched === true, 'mixed-profit reversed parts must match');
  assert(engine.checkTask('betere-keuze-uitleg', {
    fields: {
      boer: '5000 euro',
      buurvrouw: '4400 euro',
      schaarste: 'grond is schaars',
    },
    choice: 'boer-beter',
  }).matched === true, 'structured scarcity explanation must match');
  return engine.getProgress();
}

function adversarialAttempt(data) {
  const engine = new ExitTicketEngine({ data });
  assert(engine.checkTask('tarwe-opbrengst', {
    work: 'ik gok',
    finalAnswer: '5000',
    unitNotation: 'euro',
  }).matched === false, 'correct final answer alone must not match task 1');
  engine.checkTask('alternatieve-kosten-mais', {
    work: '350 x 10',
    finalAnswer: '3500',
    unitNotation: 'euro',
  });
  engine.checkTask('buurvrouw-gemengd', {
    work: '500 x 6 + 350 x 4 = 4400',
    finalAnswer: '4400',
    unitNotation: 'euro',
  });
  assert(engine.checkTask('betere-keuze-uitleg', {
    fields: {
      boer: '5000 euro',
      buurvrouw: '4400 euro',
      schaarste: 'grond is beperkt beschikbaar',
    },
    choice: 'buurvrouw-beter',
  }).matched === false, 'wrong comparison choice must not match');
  return engine.getProgress();
}

function checkHeldAuthority(data) {
  assert(data.surface === 'target_equivalent_exit_ticket', '1.1.1 exit ticket keeps target-equivalent surface for review');
  assert(data.targetEquivalent && data.targetEquivalent.candidate === true, '1.1.1 remains a candidate');
  assert(data.targetEquivalent.gateApproved === true, '1.1.1 gateApproved must record narrow readiness approval');
  assert(data.targetEquivalent.completionLanguageEligible === false, '1.1.1 completion language must remain false');
  assert(data.metadataAlignment.targetReadinessEvidence === true, '1.1.1 targetReadinessEvidence must record narrow readiness approval');
  assert(data.metadataAlignment.status === 'target_equivalent_aligned', '1.1.1 status must record target-equivalent alignment');
  assert(
    JSON.stringify(data.metadataAlignment.notes || []).includes('B1-TARGET-EVIDENCE-111-RENDERED-CLOSURE-AND-FLAG-BUNDLE-1') &&
      JSON.stringify(data.metadataAlignment.notes || []).includes('Completion language remains held'),
    '1.1.1 notes must record narrow readiness approval while holding completion language'
  );
}

function checkSurfaceRepair(data) {
  const studentText = flattenStudentText(data);
  assert(studentText.includes('winst'), 'student-facing text must use winst wording');
  assertNoText(studentText, /\bopbrengst\b/i, 'student-facing 1.1.1 source');
  assertNoText(studentText, /Bijvoorbeeld\s*(?:5000|3500|4400|euro|de grond is beperkt)/i, 'student-facing placeholders');
  assertNoText(studentText, /\b(?:A43|B01|B02|PV|MTU)\b/, 'student-facing 1.1.1 source');
  assertNoText(JSON.stringify(data.completion || {}), /laten zien dat|aankunt|bewezen|aangetoond|beheerst|diagnost|mastery|summatief|cijfer|pv|scale gate/i, '1.1.1 completion');

  assertHasWorkVariant(taskShell(data, 'tarwe-opbrengst'), 'vermenigvuldigen', '500 x 10');
  assertHasWorkVariant(taskShell(data, 'alternatieve-kosten-mais'), 'vermenigvuldigen', '350 x 10');
  assertHasWorkVariant(taskShell(data, 'buurvrouw-gemengd'), 'tarwe-winstdeel', '500 x 6');
  assertHasWorkVariant(taskShell(data, 'buurvrouw-gemengd'), 'mais-winstdeel', '350 x 4');
  assertHasWorkVariant(taskShell(data, 'buurvrouw-gemengd'), 'totale winst', '1400 plus 3000');
}

function main() {
  const sourcePath = path.join(SOURCE_DIR, '1.1.1-exit-ticket.json');
  const shortPath = path.join(SOURCE_DIR, '1.1.1-korte-check.json');
  const generatedPath = path.join(LESSON_BOOK_ROOT, 'shared', 'exit-ticket', '1.1.1-exit-ticket.js');
  const config = loadConfig(LESSON_BOOK_ROOT);
  const found = config.findParagraphFolder('1.1.1');
  assert(found && found.fullPath, 'must find 1.1.1 paragraph folder in lesson output');
  const landingPath = path.join(found.fullPath, 'index.html');

  const source = readJson(sourcePath);
  const shortCheck = readJson(shortPath);
  assert(ExitTicketEngine.validateData(source) === true, '1.1.1 exit-ticket source validates');
  assert(ExitTicketEngine.validateData(shortCheck) === true, '1.1.1 korte-check source validates');
  assert(shortCheck.surface === 'advisory_short_check', '1.1.1 korte-check remains advisory');
  assert(shortCheck.metadataAlignment.targetReadinessEvidence === false, '1.1.1 korte-check remains non-readiness evidence');
  checkHeldAuthority(source);
  checkSurfaceRepair(source);

  const correctProgress = completeCorrectAttempt(source);
  assert(correctProgress.proofCandidate === true, 'complete correct 1.1.1 attempt should be a proof candidate only');
  assert(correctProgress.gateApproved === true, 'complete correct 1.1.1 attempt must report approved gate');
  assert(correctProgress.completionLanguageEligible === false, 'complete correct 1.1.1 attempt must not authorize completion language');

  const adversarialProgress = adversarialAttempt(source);
  assert(adversarialProgress.proofCandidate === false, 'adversarial 1.1.1 attempt must not become proof candidate');

  const generated = loadGeneratedExitTicketData(generatedPath);
  assert(JSON.stringify(generated) === JSON.stringify(source), 'generated 1.1.1 lesson data must match platform source');
  checkHeldAuthority(generated);
  checkSurfaceRepair(generated);

  const landing = read(landingPath);
  assert(landing.includes('Werk de eindcontrole uit en gebruik de feedback'), '1.1.1 landing must carry neutral exit-ticket copy');
  assert(landing.includes('box-sizing: border-box'), '1.1.1 landing must include content box-sizing overflow repair');
  assertNoText(landing, /doelopgave op hetzelfde niveau|doelopgave-niveau|aankunt|bewe(e|e)n|aangetoond|beheerst/i, '1.1.1 landing');

  const proof = {
    schema_version: 1,
    sprint_id: 'B1-TARGET-EVIDENCE-111-CLOSURE-AND-IMPLEMENTATION-BUNDLE-1',
    generated: new Date().toISOString(),
    status: 'repair_complete_readiness_approved_completion_held',
    sources: {
      platform_source: rel(sourcePath),
      short_check_source: rel(shortPath),
      generated_lesson_data: path.relative(LESSON_BOOK_ROOT, generatedPath).replace(/\\/g, '/'),
      generated_landing_page: path.relative(LESSON_BOOK_ROOT, landingPath).replace(/\\/g, '/'),
    },
    checks: {
      source_validates: true,
      generated_matches_source: true,
      visible_profit_wording_repaired: true,
      answer_leak_placeholders_removed: true,
      broader_calculation_variants_accepted: true,
      adversarial_final_answer_only_rejected: true,
      neutral_landing_copy_present: true,
      landing_overflow_box_sizing_present: true,
    },
    progress_contract: {
      complete_correct_attempt: correctProgress,
      adversarial_attempt: adversarialProgress,
    },
    authority: {
      gate_approved: true,
      target_readiness_evidence: true,
      completion_language_authorized: false,
      product_route_adoption_authorized: false,
      diagnostics_mastery_pv_or_summative_use_authorized: false,
      scale_gate_1_authorized: false,
      student_product_use_authorized: false,
      human_review_completed_for_readiness: true,
      human_review_required_to_close: false,
      human_review_required_for_downstream_closure: true,
    },
    carried_findings: [
      '1.1.1 readiness flags are narrowly approved; completion language remains held.',
      'Scale Gate 1, diagnostics, mastery/sequencing, PV, product-route adoption, and student/product use remain blocked.',
    ],
  };

  fs.mkdirSync(path.dirname(PROOF_PATH), { recursive: true });
  fs.writeFileSync(PROOF_PATH, `${JSON.stringify(proof, null, 2)}\n`);
  console.log(`B1-TARGET-EVIDENCE-111-CLOSURE-AND-IMPLEMENTATION-BUNDLE-1 passed; proof written to ${rel(PROOF_PATH)}`);
}

try {
  main();
} catch (error) {
  fail(error.message);
}
