#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SPRINT_ID = 'SCALE-PROOF-3P-READINESS-PRODUCT-PATH-PROOF-1';
const platformRoot = path.resolve(__dirname, '..', '..');
const proofPath = path.join(platformRoot, 'reports', 'json', 'scale-proof-3p-readiness-product-path-proof-1-proof.json');
const requiredParagraphs = ['1.1.1', '1.1.2', '1.1.3'];
const requiredFamilies = ['start', 'leer', 'oefen', 'skill-map-or-learn-path', 'normal-practice', 'check', 'exit-ticket'];
const neutralExitRowCopy = 'Maak de aparte eindcontrole wanneer je de paragraaf hebt geoefend.';
const neutralExitTileCopy = 'Werk de eindcontrole uit en gebruik de feedback om je volgende oefenstap te kiezen.';

function fail(message) {
  console.error(`SCALE-PROOF-3P proof check failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`cannot read JSON ${file}: ${error.message}`);
  }
}

function pngDimensions(file) {
  let buffer;
  try {
    buffer = fs.readFileSync(file);
  } catch (error) {
    fail(`missing screenshot ${file}: ${error.message}`);
  }
  if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') {
    fail(`not a PNG screenshot: ${file}`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function relPathExists(relPath) {
  return fs.existsSync(path.join(platformRoot, relPath));
}

function getParagraphEntry(proof, paragraph) {
  return proof.route_inventory.paragraphs.find((item) => item.paragraph === paragraph);
}

function getCapture(proof, paragraph, predicate) {
  return proof.screenshots.find((item) => item.paragraph === paragraph && predicate(item));
}

function checkShape(proof) {
  assert(proof.schema_version === 1, 'schema_version must be 1');
  assert(proof.sprint_id === SPRINT_ID, `sprint_id must be ${SPRINT_ID}`);
  assert(typeof proof.generated === 'string' && proof.generated, 'generated timestamp missing');
  assert(
    proof.status === 'hold_for_authority_boundary_repair' ||
      proof.status === 'scale_proof_3p_product_path_ready_with_a96_hold' ||
      proof.status === 'scale_gate_1_ready_for_human_review',
    `unsupported status: ${proof.status}`
  );
  assert(
    proof.lead_recommendation === 'HOLD_FOR_AUTHORITY_BOUNDARY_REPAIR' ||
      proof.lead_recommendation === 'HOLD_FOR_A96_CALCULATION_REFINEMENT_FOR_SCALE_GATE_1' ||
      proof.lead_recommendation === 'READY_FOR_HUMAN_SCALE_GATE_1_REVIEW',
    `unsupported lead_recommendation: ${proof.lead_recommendation}`
  );
  assert(relPathExists(proof.screenshot_manifest), `missing screenshot manifest ${proof.screenshot_manifest}`);
  assert(relPathExists(proof.screenshot_manifest_json), `missing screenshot manifest JSON ${proof.screenshot_manifest_json}`);
  assert(relPathExists(proof.route_inventory_markdown), `missing route inventory ${proof.route_inventory_markdown}`);
}

function checkAuthority(proof) {
  const authority = proof.authority || {};
  const falseKeys = [
    'product_route_adoption_authorized',
    'product_use_authorized',
    'student_product_use_authorized',
    'scale_gate_1_authorized',
    'diagnostics_authorized',
    'mastery_or_sequencing_authorized',
    'adaptive_routing_authorized',
    'summative_use_authorized',
    'pv_authorized',
    'target_equivalent_completion_language_authorized',
  ];
  for (const key of falseKeys) {
    assert(authority[key] === false, `authority.${key} must be false`);
  }
  if ((proof.authority_issues || []).length > 0) {
    assert(proof.status === 'hold_for_authority_boundary_repair', 'authority issues require hold_for_authority_boundary_repair');
    assert(proof.lead_recommendation === 'HOLD_FOR_AUTHORITY_BOUNDARY_REPAIR', 'authority issues require HOLD_FOR_AUTHORITY_BOUNDARY_REPAIR');
    for (const issue of proof.authority_issues) {
      assert(issue.classification === 'blocks', `authority issue ${issue.id} must classify as blocks`);
      assert(Array.isArray(issue.blocks) && issue.blocks.length > 0, `authority issue ${issue.id} needs blocks`);
      assert(Array.isArray(issue.does_not_block), `authority issue ${issue.id} needs does_not_block`);
      assert(typeof issue.proof_required_to_close === 'string' && issue.proof_required_to_close, `authority issue ${issue.id} needs proof_required_to_close`);
    }
  }
  if ((proof.authority_issues || []).length === 0) {
    assert(proof.status === 'scale_gate_1_ready_for_human_review', 'clean authority proof must be ready for human Scale Gate 1 review');
    assert(
      proof.lead_recommendation === 'READY_FOR_HUMAN_SCALE_GATE_1_REVIEW',
      'clean authority proof must route to human Scale Gate 1 review'
    );
    assert(proof.next_repair_sprint === null, 'clean proof must not name another A96 repair sprint');
    assert(typeof proof.next_gate_action === 'string' && proof.next_gate_action.includes('Human Scale Gate 1 review'), 'clean proof must name human gate review as next action');
  }
}

function checkRouteInventory(proof) {
  assert(proof.route_inventory && Array.isArray(proof.route_inventory.paragraphs), 'route_inventory.paragraphs missing');
  for (const family of requiredFamilies) {
    assert(proof.route_inventory.required_families.includes(family), `route inventory missing required family ${family}`);
  }
  for (const paragraph of requiredParagraphs) {
    const entry = getParagraphEntry(proof, paragraph);
    assert(entry, `route inventory missing ${paragraph}`);
    assert(entry.all_required_families_present === true, `${paragraph} must include all route families`);
    assert(entry.link_resolution.unresolved.length === 0, `${paragraph} has unresolved links`);
    for (const family of requiredFamilies) {
      assert(Array.isArray(entry.families[family]) && entry.families[family].length > 0, `${paragraph} missing family ${family}`);
      if (family !== 'start' && family !== 'leer') {
        assert(
          entry.families[family].some((link) => link.exists === true),
          `${paragraph} family ${family} has no resolved concrete link`
        );
      }
    }
  }
}

function checkAuthorityCopyAudit(proof) {
  const audit = proof.authority_copy_audit || {};
  assert(Array.isArray(audit.first_three_gate_claim), 'authority_copy_audit.first_three_gate_claim missing');
  assert(Array.isArray(audit.same_copy_hygiene_not_gate_claim), 'authority_copy_audit.same_copy_hygiene_not_gate_claim missing');
  assert(audit.first_three_gate_claim.length === requiredParagraphs.length, 'first-three authority copy audit count mismatch');
  for (const paragraph of requiredParagraphs) {
    const entry = audit.first_three_gate_claim.find((item) => item.paragraph === paragraph);
    assert(entry, `authority copy audit missing ${paragraph}`);
    assert(entry.gate_claim === true, `${paragraph} authority copy audit must be gate_claim true`);
    assert(entry.row_copy === neutralExitRowCopy, `${paragraph} row copy did not record neutral copy`);
    assert(entry.tile_copy === neutralExitTileCopy, `${paragraph} tile copy did not record neutral copy`);
    assert(entry.neutral_row_copy_present === true, `${paragraph} neutral row copy missing`);
    assert(entry.neutral_tile_copy_present === true, `${paragraph} neutral tile copy missing`);
    assert(entry.forbidden_authority_copy_absent === true, `${paragraph} forbidden authority copy present`);
    assert(Array.isArray(entry.forbidden_matches) && entry.forbidden_matches.length === 0, `${paragraph} forbidden matches must be empty`);
  }
  const hygiene114 = audit.same_copy_hygiene_not_gate_claim.find((item) => item.paragraph === '1.1.4');
  assert(hygiene114, '1.1.4 same-copy hygiene audit missing');
  assert(hygiene114.gate_claim === false, '1.1.4 same-copy hygiene must not be a gate claim');
  assert(hygiene114.neutral_row_copy_present === true, '1.1.4 neutral row copy missing');
  assert(hygiene114.neutral_tile_copy_present === true, '1.1.4 neutral tile copy missing');
  assert(hygiene114.forbidden_authority_copy_absent === true, '1.1.4 forbidden authority copy present');
}

function checkSurfaceData(proof) {
  for (const paragraph of requiredParagraphs) {
    const facts = proof.surface_data[paragraph];
    assert(facts, `surface_data missing ${paragraph}`);
    const exitTicket = facts.exit_ticket;
    const shortCheck = facts.short_check;
    for (const side of ['source', 'generated']) {
      const exit = exitTicket[side];
      assert(exit.surface === 'target_equivalent_exit_ticket', `${paragraph} ${side} exit must be target_equivalent_exit_ticket`);
      assert(exit.gateApproved === true, `${paragraph} ${side} exit gateApproved must be true`);
      assert(exit.targetReadinessEvidence === true, `${paragraph} ${side} exit targetReadinessEvidence must be true`);
      assert(exit.completionLanguageEligible === false, `${paragraph} ${side} exit completionLanguageEligible must be false`);
      assert(exit.metadataStatus === 'target_equivalent_aligned', `${paragraph} ${side} exit status must be target_equivalent_aligned`);
      if (paragraph === '1.1.2') {
        assert(exit.a96AnswerFormReady === true, `${paragraph} ${side} exit must record A96 answer-form readiness`);
        assert(exit.taskFamilies.includes('calculation_answer_form_capture'), `${paragraph} ${side} exit missing A96 answer-form family`);
      }

      const short = shortCheck[side];
      assert(short.surface === 'advisory_short_check', `${paragraph} ${side} short check must be advisory_short_check`);
      assert(short.gateApproved === false, `${paragraph} ${side} short check gateApproved must be false`);
      assert(short.targetReadinessEvidence === false, `${paragraph} ${side} short check targetReadinessEvidence must be false`);
      assert(short.completionLanguageEligible === false, `${paragraph} ${side} short check completionLanguageEligible must be false`);
    }
    assert(exitTicket.links_resolve === true, `${paragraph} exit ticket links must resolve`);
    assert(shortCheck.links_resolve === true, `${paragraph} short check links must resolve`);
  }
  for (const paragraph of requiredParagraphs) {
    assert(proof.surface_data[paragraph].exit_ticket.rendered_shell === 'golden_exercise_workbench', `${paragraph} exit must be Golden Workbench`);
    assert(proof.surface_data[paragraph].short_check.rendered_shell === 'golden_exercise_workbench', `${paragraph} short check must be Golden Workbench`);
  }
}

function checkScreenshots(proof) {
  assert(Array.isArray(proof.screenshots) && proof.screenshots.length >= 37, 'expected at least 37 screenshots');
  for (const item of proof.screenshots) {
    assert(item.screenshot && item.screenshot.file, `${item.id} missing screenshot file`);
    const file = path.join(platformRoot, item.screenshot.file);
    const dimensions = pngDimensions(file);
    assert(dimensions.width === item.viewport.width, `${item.id} PNG width ${dimensions.width} does not match viewport ${item.viewport.width}`);
    assert(dimensions.height === item.viewport.height, `${item.id} PNG height ${dimensions.height} does not match viewport ${item.viewport.height}`);
    assert(item.inspection.horizontal_overflow === false, `${item.id} has horizontal overflow`);
    assert(item.inspection.forbidden_authority_terms.length === 0, `${item.id} has forbidden authority terms`);
    if (['landing', 'short-check', 'exit-ticket'].includes(item.surface)) {
      assert(item.inspection.target_completion_terms.length === 0, `${item.id} has held completion/readiness terms`);
    }
  }
  for (const paragraph of requiredParagraphs) {
    assert(getCapture(proof, paragraph, (item) => item.surface === 'landing' && item.viewport.width === 1280 && item.theme === 'light'), `${paragraph} missing desktop landing screenshot`);
    assert(getCapture(proof, paragraph, (item) => item.surface === 'landing' && item.viewport.width === 390 && item.theme === 'dark'), `${paragraph} missing mobile dark landing screenshot`);
    assert(getCapture(proof, paragraph, (item) => item.surface === 'start' && item.viewport.width === 1280), `${paragraph} missing Start screenshot`);
    assert(getCapture(proof, paragraph, (item) => item.surface === 'learn' && item.viewport.width === 1280), `${paragraph} missing Leer screenshot`);
    assert(getCapture(proof, paragraph, (item) => item.surface === 'skill-map' && item.viewport.width === 1280), `${paragraph} missing skill-map screenshot`);
    assert(getCapture(proof, paragraph, (item) => item.surface === 'normal-practice' && item.viewport.width === 1280), `${paragraph} missing normal practice screenshot`);
    assert(getCapture(proof, paragraph, (item) => item.surface === 'practice' && item.viewport.width === 1280), `${paragraph} missing practice screenshot`);
    assert(getCapture(proof, paragraph, (item) => item.surface === 'short-check' && item.action === 'initial' && item.viewport.width === 1280), `${paragraph} missing short-check initial screenshot`);
    const advisoryCompleted = getCapture(proof, paragraph, (item) => item.surface === 'short-check' && item.action === 'complete' && item.viewport.width === 1280);
    assert(advisoryCompleted, `${paragraph} missing completed advisory short-check screenshot`);
    assert(advisoryCompleted.inspection.feedback_good_count > 0, `${paragraph} completed advisory short-check lacks good feedback`);
    assert(getCapture(proof, paragraph, (item) => item.surface === 'exit-ticket' && item.action === 'initial' && item.viewport.width === 1280), `${paragraph} missing exit initial screenshot`);
    const completedDesktop = getCapture(proof, paragraph, (item) => item.surface === 'exit-ticket' && item.action === 'complete' && item.viewport.width === 1280);
    const completedMobile = getCapture(proof, paragraph, (item) => item.surface === 'exit-ticket' && item.action === 'complete' && item.viewport.width === 390 && item.theme === 'dark');
    assert(completedDesktop, `${paragraph} missing desktop completed exit screenshot`);
    assert(completedMobile, `${paragraph} missing mobile dark completed exit screenshot`);
    assert(completedDesktop.inspection.feedback_good_count > 0, `${paragraph} desktop completed exit lacks good feedback`);
    assert(completedMobile.inspection.feedback_good_count > 0, `${paragraph} mobile completed exit lacks good feedback`);
    assert(completedDesktop.inspection.data_flags.completionLanguageEligible === false, `${paragraph} desktop completed exit has completion language enabled`);
    assert(completedMobile.inspection.data_flags.completionLanguageEligible === false, `${paragraph} mobile completed exit has completion language enabled`);
    if (paragraph === '1.1.2') {
      for (const capture of [completedDesktop, completedMobile]) {
        const a96 = capture.inspection.a96_answer_form;
        assert(a96 && a96.present === true, `${capture.id}: A96 answer-form control missing`);
        assert(a96.family === 'calculation_answer_form_capture', `${capture.id}: A96 family mismatch`);
        assert(a96.formula_token_count >= 8, `${capture.id}: A96 formula tokens missing`);
        assert(a96.substitution_field_ids.includes('newPrice'), `${capture.id}: A96 newPrice substitution missing`);
        assert(a96.substitution_field_ids.includes('oldPriceNumerator'), `${capture.id}: A96 oldPriceNumerator substitution missing`);
        assert(a96.substitution_field_ids.includes('oldPriceDenominator'), `${capture.id}: A96 oldPriceDenominator substitution missing`);
        assert(a96.final_answer_field_present === true, `${capture.id}: A96 final answer field missing`);
        assert(a96.notation_field_present === true, `${capture.id}: A96 notation field missing`);
        assert(a96.conclusion_field_present === true, `${capture.id}: A96 conclusion field missing`);
        assert(a96.old_work_textarea_present === false, `${capture.id}: A96 must not use old work textarea`);
      }
    }
  }
}

function checkSummary(proof) {
  const summary = proof.proof || {};
  assert(summary.all_required_route_families_present === true, 'summary route families must pass');
  assert(summary.all_landing_links_resolve === true, 'summary landing links must resolve');
  assert(summary.exit_tickets_target_readiness_approved === true, 'summary exit readiness flags must pass');
  assert(summary.short_checks_advisory_only === true, 'summary short checks advisory must pass');
  assert(summary.all_first_three_check_exit_surfaces_golden === true, 'summary Golden shell classification must pass');
  assert(summary.start_learn_oefen_skill_practice_captured === true, 'summary product path screenshots must pass');
  assert(summary.rendered_desktop_mobile_dark_coverage === true, 'summary desktop/mobile/dark coverage must pass');
  assert(summary.completed_feedback_states_captured === true, 'summary completed feedback states must pass');
  assert(summary.advisory_feedback_states_captured === true, 'summary advisory feedback states must pass');
  assert(summary.a96_calculation_answer_form_refinement_ready === true, 'summary A96 refinement must be ready');
  assert(summary.target_completion_language_held_in_completed_exit_routes === true, 'summary completion language must stay held');
  assert(summary.no_broad_authority_terms_in_captures === true, 'summary broad authority terms must be absent');
  assert(summary.first_three_landing_authority_copy_neutral === true, 'summary first-three authority copy must be neutral');
  assert(summary.same_copy_hygiene_114_neutral_not_gate_claim === true, 'summary 1.1.4 same-copy hygiene must be neutral and not gate claim');
  assert(summary.authority_copy_issue_count === (proof.authority_issues || []).length, 'summary authority issue count mismatch');
}

function checkScaleReadiness(proof) {
  const scale = proof.scale_gate_readiness || {};
  assert(scale.product_path_evidence_ready_for_human_review === true, 'product-path evidence must be ready for human review');
  assert(scale.scale_gate_1_ready_for_human_review === true, 'Scale Gate 1 must be ready for human review');
  assert(scale.scale_gate_1_ready === true, 'Scale Gate 1 readiness flag must be true after A96 repair');
  assert(scale.scale_gate_1_authority_status === 'READY_FOR_HUMAN_REVIEW_NOT_AUTHORIZED', 'Scale Gate authority status must stay review-only');
  assert(scale.scale_gate_1_hold_reason === null, 'Scale Gate hold reason must be clear after A96 repair');
  assert(scale.a96_calculation_answer_form_refinement_ready === true, 'A96 refinement readiness must be true');
  assert(scale.product_route_adoption_authorized === false, 'product route adoption must remain unauthorized');
  assert(scale.diagnostics_mastery_pv_student_use_authorized === false, 'diagnostics/mastery/PV/student use must remain unauthorized');
  assert(scale.claim_scope === 'first_three_paragraphs_rendered_product_path_only', 'claim scope must stay first-three rendered product path only');
}

function main() {
  const proof = readJson(proofPath);
  checkShape(proof);
  checkAuthority(proof);
  checkRouteInventory(proof);
  checkAuthorityCopyAudit(proof);
  checkSurfaceData(proof);
  checkScreenshots(proof);
  checkSummary(proof);
  checkScaleReadiness(proof);
  console.log(`OK ${SPRINT_ID} proof: ${proof.status}`);
}

main();
