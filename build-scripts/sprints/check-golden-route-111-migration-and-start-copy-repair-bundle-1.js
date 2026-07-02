#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SPRINT_ID = 'GOLDEN-ROUTE-111-MIGRATION-AND-START-COPY-REPAIR-BUNDLE-1';
const platformRoot = path.resolve(__dirname, '..', '..');
const defaultBookRoot = path.resolve(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');
const bookRoot = path.resolve(process.env.GOLDEN_ROUTE_111_BOOK_ROOT || process.env.LESSON_BOOK_ROOT || defaultBookRoot);
const chapterDir = '1.1 Hoofdstuk Economisch denken en rekenen';
const GoldenTicketLayout = require('../../engines/golden-ticket-layout');

const paragraphs = [
  { id: '1.1.1', dir: '1.1.1 Schaarste en economisch denken' },
  { id: '1.1.2', dir: '1.1.2 Percentages en indexcijfers' },
  { id: '1.1.3', dir: '1.1.3 Grafieken en tabellen' },
];

const forbiddenStartPatterns = [
  /Jouw beheersing/i,
  /beheersing/i,
  /mastery-dashboard/i,
  /mastery-container/i,
  /mastery-step/i,
  /mastery-item/i,
  /definitief af te sluiten/i,
  /doelopgave-niveau/i,
  /doelopgave op hetzelfde niveau/i,
  /antwoordvorm aankunt/i,
  /aankunt/i,
  /<span class="stat-label">Gesloten<\/span>/i,
];

const forbiddenGoldenLegacyPatterns = [
  /id="exit-ticket-app"/i,
  /class="et-page"/i,
  /class="et-topbar"/i,
  /task-shell\.css/i,
  /exit-ticket\.css/i,
  /skill-map-route\.css/i,
  /task-shell-ui\.js/i,
  /exit-ticket-ui\.js/i,
];

function fail(message) {
  console.error(`${SPRINT_ID} check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (error) {
    fail(`cannot read ${file}: ${error.message}`);
  }
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function requireGeneratedData(sourceKey) {
  const file = path.join(bookRoot, 'shared', 'exit-ticket', `${sourceKey}.js`);
  const resolved = require.resolve(file);
  delete require.cache[resolved];
  return require(resolved);
}

function pageFile(paragraph, suffix) {
  return path.join(bookRoot, chapterDir, paragraph.dir, `${paragraph.id} ${paragraph.dir.slice(6)} \u2013 ${suffix}.html`);
}

function sourceData(sourceKey) {
  return readJson(path.join(platformRoot, 'source-data', 'book-1', 'exit-ticket', `${sourceKey}.json`));
}

function dataFacts(data) {
  const targetEquivalent = data.targetEquivalent || {};
  const metadataAlignment = data.metadataAlignment || {};
  return {
    surface: data.surface,
    framework: data.layout && data.layout.framework,
    variant: data.layout && data.layout.framework === 'golden_exercise_workbench'
      ? GoldenTicketLayout.assertSupportedGoldenExerciseVariant(data)
      : null,
    candidate: targetEquivalent.candidate,
    gateApproved: targetEquivalent.gateApproved,
    completionLanguageEligible: targetEquivalent.completionLanguageEligible,
    targetReadinessEvidence: metadataAlignment.targetReadinessEvidence,
    contextBlockCount: Array.isArray(data.contextBlocks) ? data.contextBlocks.length : 0,
  };
}

function assertMigrated111Data(kind, data, expectedVariant) {
  const facts = dataFacts(data);
  assert(facts.framework === 'golden_exercise_workbench', `1.1.1 ${kind} must use Golden Workbench framework`);
  assert(facts.variant === expectedVariant, `1.1.1 ${kind} must resolve to ${expectedVariant}, got ${facts.variant}`);
  assert(facts.completionLanguageEligible === false, `1.1.1 ${kind} completionLanguageEligible must remain false`);
  assert(facts.contextBlockCount > 0, `1.1.1 ${kind} must have contextBlocks`);

  if (kind === 'exit-ticket') {
    assert(facts.surface === 'target_equivalent_exit_ticket', '1.1.1 exit surface must stay target_equivalent_exit_ticket');
    assert(facts.candidate === true, '1.1.1 exit candidate must stay true');
    assert(facts.gateApproved === true, '1.1.1 exit gateApproved must stay true');
    assert(facts.targetReadinessEvidence === true, '1.1.1 exit targetReadinessEvidence must stay true');
    for (const task of data.tasks || []) {
      const shell = task.taskShell || {};
      assert(Array.isArray(shell.contextRefs) && shell.contextRefs.length > 0, `${task.id} must cite contextRefs`);
      assert(Array.isArray(shell.operationChain) && shell.operationChain.length > 0, `${task.id} must cite operationChain`);
    }
  } else {
    assert(facts.surface === 'advisory_short_check', '1.1.1 short surface must stay advisory_short_check');
    assert(facts.candidate === false, '1.1.1 short candidate must be false');
    assert(facts.gateApproved === false, '1.1.1 short gateApproved must be false');
    assert(facts.targetReadinessEvidence === false, '1.1.1 short targetReadinessEvidence must be false');
    assert(data.advisory && data.advisory.targetEquivalentProof === false, '1.1.1 short advisory targetEquivalentProof must be false');
    for (const task of data.tasks || []) {
      assert(Array.isArray(task.contextRefs) && task.contextRefs.length > 0, `${task.id} must cite contextRefs`);
    }
  }
}

function assertGoldenHtml(file, label) {
  const html = readText(file);
  assert(/<header class="ge-topbar">/.test(html), `${label} must render ge-topbar`);
  assert(/data-golden-ticket-root/.test(html), `${label} must render data-golden-ticket-root`);
  assert(/golden-ticket-layout\.css/.test(html), `${label} must load golden-ticket-layout.css`);
  assert(!/Exit ticket afgerond/i.test(html), `${label} must not render completion-equivalent heading "Exit ticket afgerond"`);
  for (const pattern of forbiddenGoldenLegacyPatterns) {
    assert(!pattern.test(html), `${label} still contains legacy shell marker ${pattern}`);
  }
}

function assertStartCopy() {
  for (const paragraph of paragraphs) {
    const html = readText(pageFile(paragraph, 'instapquiz'));
    assert(/Oefenstatus/.test(html), `${paragraph.id} Start page must use Oefenstatus`);
    assert(/progress-dashboard/.test(html), `${paragraph.id} Start page must use progress-dashboard`);
    assert(/progress-container/.test(html), `${paragraph.id} Start page must use progress-container`);
    assert(/Een <strong>reeks van 3<\/strong> laat zien waar je vlot antwoordt/.test(html), `${paragraph.id} Start page must use neutral series copy`);
    for (const pattern of forbiddenStartPatterns) {
      assert(!pattern.test(html), `${paragraph.id} Start page contains forbidden copy/marker ${pattern}`);
    }
  }

  const sharedQuizUi = readText(path.join(bookRoot, 'shared', 'quiz-ui.js'));
  const sharedQuizCss = readText(path.join(bookRoot, 'shared', 'quiz.css'));
  for (const pattern of [/mastery-dashboard/i, /mastery-container/i, /mastery-step/i, /mastery-item/i, /Jouw beheersing/i]) {
    assert(!pattern.test(sharedQuizUi), `shared quiz-ui contains forbidden marker ${pattern}`);
    assert(!pattern.test(sharedQuizCss), `shared quiz.css contains forbidden marker ${pattern}`);
  }
}

function assertCompletionHeld() {
  for (const paragraph of paragraphs) {
    const sourceExit = sourceData(`${paragraph.id}-exit-ticket`);
    const generatedExit = requireGeneratedData(`${paragraph.id}-exit-ticket`);
    for (const [label, data] of [['source', sourceExit], ['generated', generatedExit]]) {
      assert((data.targetEquivalent || {}).completionLanguageEligible === false, `${paragraph.id} ${label} exit completionLanguageEligible must be false`);
      assert((data.metadataAlignment || {}).targetReadinessEvidence === true, `${paragraph.id} ${label} exit targetReadinessEvidence must stay true`);
      assert(!/Exit ticket afgerond/i.test((data.completion || {}).title || ''), `${paragraph.id} ${label} exit must not use completion-equivalent title`);
      assert((data.completion || {}).title === 'Werk nagekeken', `${paragraph.id} ${label} exit must use neutral local-check title`);
    }
    const sourceShort = sourceData(`${paragraph.id}-korte-check`);
    const generatedShort = requireGeneratedData(`${paragraph.id}-korte-check`);
    for (const [label, data] of [['source', sourceShort], ['generated', generatedShort]]) {
      assert(data.surface === 'advisory_short_check', `${paragraph.id} ${label} short check must remain advisory`);
      assert((data.metadataAlignment || {}).targetReadinessEvidence === false, `${paragraph.id} ${label} short targetReadinessEvidence must stay false`);
      if (data.targetEquivalent) {
        assert(data.targetEquivalent.completionLanguageEligible === false, `${paragraph.id} ${label} short completionLanguageEligible must be false when declared`);
        assert(data.targetEquivalent.gateApproved === false, `${paragraph.id} ${label} short gateApproved must be false when declared`);
      }
    }
  }
}

function pngDimensions(file) {
  const buffer = fs.readFileSync(file);
  assert(buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG', `${file} must be a PNG`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function assertProofBundle() {
  const proofFile = path.join(platformRoot, 'reports', 'json', 'golden-route-111-migration-and-start-copy-repair-bundle-1-proof.json');
  assert(fs.existsSync(proofFile), 'proof JSON missing');
  const proof = readJson(proofFile);
  assert(proof.schema_version === 1, 'proof schema_version must be 1');
  assert(proof.sprint_id === SPRINT_ID, 'proof sprint_id mismatch');
  assert(proof.status === 'ready_for_human_review' || proof.status === 'ready_for_lead_review', `unsupported proof status ${proof.status}`);
  assert(proof.authority.product_route_adoption_authorized === false, 'product_route_adoption_authorized must be false');
  assert(proof.authority.scale_gate_1_authorized === false, 'scale_gate_1_authorized must be false');
  assert(proof.authority.diagnostics_authorized === false, 'diagnostics_authorized must be false');
  assert(proof.authority.mastery_or_sequencing_authorized === false, 'mastery_or_sequencing_authorized must be false');
  assert(proof.authority.student_product_use_authorized === false, 'student_product_use_authorized must be false');
  assert(proof.proof.start_copy_forbidden_terms_absent === true, 'proof must record Start forbidden terms absent');
  assert(proof.proof.golden_111_exit_rendered === true, 'proof must record 1.1.1 exit Golden rendered');
  assert(proof.proof.golden_111_short_rendered === true, 'proof must record 1.1.1 short Golden rendered');
  assert(proof.proof.rendered_no_horizontal_overflow === true, 'proof must record no rendered horizontal overflow');
  assert(proof.proof.rendered_mobile_no_horizontal_overflow === true, 'proof must record no mobile rendered horizontal overflow');
  assert(proof.proof.completion_language_held === true, 'proof must record completion language held');
  assert(proof.proof.visible_exit_completion_heading_neutral === true, 'proof must record neutral visible exit completion heading');
  assert(Array.isArray(proof.screenshots) && proof.screenshots.length >= 8, 'proof must include screenshot evidence');
  for (const shot of proof.screenshots) {
    const file = path.join(platformRoot, shot.file);
    assert(fs.existsSync(file), `missing screenshot ${shot.file}`);
    const dimensions = pngDimensions(file);
    assert(dimensions.width === shot.viewport.width, `${shot.id} width mismatch`);
    assert(dimensions.height === shot.viewport.height, `${shot.id} height mismatch`);
    assert(shot.inspection && shot.inspection.viewport_width === shot.viewport.width, `${shot.id} must include matching viewport inspection`);
    assert(shot.inspection.horizontal_overflow === false, `${shot.id} must report no horizontal overflow`);
    assert(Array.isArray(shot.inspection.offenders) && shot.inspection.offenders.length === 0, `${shot.id} must have no overflow offenders`);
  }
}

function main() {
  assertMigrated111Data('exit-ticket', sourceData('1.1.1-exit-ticket'), 'golden_calculation_structured_v1');
  assertMigrated111Data('exit-ticket', requireGeneratedData('1.1.1-exit-ticket'), 'golden_calculation_structured_v1');
  assertMigrated111Data('korte-check', sourceData('1.1.1-korte-check'), 'golden_advisory_short_check_v1');
  assertMigrated111Data('korte-check', requireGeneratedData('1.1.1-korte-check'), 'golden_advisory_short_check_v1');
  assertGoldenHtml(pageFile(paragraphs[0], 'exit-ticket'), '1.1.1 exit-ticket');
  assertGoldenHtml(pageFile(paragraphs[0], 'korte-check'), '1.1.1 korte-check');
  assertStartCopy();
  assertCompletionHeld();
  assertProofBundle();
  console.log(`OK ${SPRINT_ID} checker passed`);
}

main();
