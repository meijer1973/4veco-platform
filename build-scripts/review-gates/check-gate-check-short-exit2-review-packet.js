#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const platformRoot = path.resolve(__dirname, '..', '..');
const gateId = 'GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review';
const gateDir = path.join(platformRoot, 'reports', 'review-gates', gateId);
const lessonRoot = path.resolve(platformRoot, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod');

function fail(message) {
  console.error(`check-gate-check-short-exit2-review-packet: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function rel(file) {
  return path.relative(platformRoot, file).replace(/\\/g, '/');
}

function readText(relativePath) {
  const file = path.resolve(platformRoot, relativePath);
  assert(fs.existsSync(file), `missing ${relativePath}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(relativePath) {
  try {
    return JSON.parse(readText(relativePath));
  } catch (error) {
    fail(`invalid JSON in ${relativePath}: ${error.message}`);
  }
}

function gitOutput(args, cwd = platformRoot) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

function requireEvidenceFiles(packet) {
  for (const relativePath of packet.evidence_base) {
    const file = path.resolve(platformRoot, relativePath);
    assert(fs.existsSync(file), `packet evidence missing: ${relativePath}`);
  }
}

function requirePacketText() {
  const text = readText(`reports/review-gates/${gateId}/review-packet.md`);
  for (const section of [
    '## Review Scope',
    '## Evidence Base',
    '## Minimum Playable Evidence Inspection',
    '## Calibration Checks',
    '## Planned Review Focus',
    '## Full Planned Review Comment Prompts',
    '## Direct Review Comment Protocol',
    '## Current Stop Conditions',
    '## Comment Resolution And Closure Protocol',
    '## Recommended Next Action',
  ]) {
    assert(text.includes(section), `review packet missing ${section}`);
  }
  for (let i = 1; i <= 12; i += 1) {
    assert(text.includes(`CHECKSURFACE-Q${i}`), `review packet missing CHECKSURFACE-Q${i}`);
  }
  for (const phrase of [
    'Korte check',
    'Exit ticket',
    'completion language held',
    'reviewed `1.1.2`',
    'screenshot_capture_blocked: false',
    'duplicate visible',
    'Direct Review Comment Protocol',
    'explicit human confirmation',
    'does not authorize product-route adoption',
    'Scale Gate 1',
  ]) {
    assert(text.includes(phrase), `review packet missing phrase: ${phrase}`);
  }
}

function requireNoClosureArtifacts() {
  for (const name of [
    'direct-review-comments.md',
    'direct-review-comments.json',
    'comment-resolution-log.md',
    'comment-resolution-log.json',
    'closure-proposal.md',
    'closure-proposal.json',
    'gate-closure.md',
    'gate-closure.json',
  ]) {
    assert(!fs.existsSync(path.join(gateDir, name)), `${name} must not exist before human review`);
  }
}

function requireProof(packet, live) {
  const proof = readJson('reports/json/check-short-exit2-proof.json');
  assert(proof.status === 'rendered_proof_ready_for_lead_review', 'proof status must be ready');
  assert(proof.proof.all_screenshots_exist === true, 'proof must record screenshots exist');
  assert(proof.proof.screenshot_capture_blocked === false, 'proof must record screenshot capture unblocked');
  assert(proof.screenshots.length === 10, 'proof must record 10 screenshots');
  assert(proof.screenshots.every((item) => item.file && item.capture_error == null), 'all screenshot cases must be captured without error');
  for (const item of proof.screenshots) {
    assert(fs.existsSync(path.join(platformRoot, item.file)), `missing screenshot file ${item.file}`);
  }
  for (const [key, value] of Object.entries(packet.proof_summary)) {
    if (key === 'screenshot_count') {
      assert(proof.screenshots.length === value, 'packet proof_summary.screenshot_count mismatch');
      assert(live.proof.screenshot_count === value, 'live proof.screenshot_count mismatch');
      continue;
    }
    assert(proof.proof[key] === value, `packet proof_summary.${key} mismatch`);
    assert(live.proof[key] === value, `live proof.${key} mismatch`);
  }
}

function requireSourceData() {
  const expected = [
    ['1.1.1-korte-check', 'advisory_short_check', false, false],
    ['1.1.1-exit-ticket', 'target_equivalent_exit_ticket', false, false],
    ['1.1.2-korte-check', 'advisory_short_check', false, false],
    ['1.1.2-exit-ticket', 'target_equivalent_exit_ticket', true, true],
    ['1.1.3-korte-check', 'advisory_short_check', false, false],
    ['1.1.3-exit-ticket', 'target_equivalent_exit_ticket', false, false],
  ];
  for (const [key, surface, approved, eligible] of expected) {
    const data = readJson(`source-data/book-1/exit-ticket/${key}.json`);
    assert(data.surface === surface, `${key} surface mismatch`);
    const target = data.targetEquivalent || {};
    assert(Boolean(target.gateApproved) === approved, `${key} gateApproved mismatch`);
    assert(Boolean(target.completionLanguageEligible) === eligible, `${key} completionLanguageEligible mismatch`);
  }
}

function findParagraphDir(paragraphId) {
  const chapterRoot = path.join(lessonRoot, '1.1 Hoofdstuk Economisch denken en rekenen');
  const entry = fs.readdirSync(chapterRoot, { withFileTypes: true })
    .find((item) => item.isDirectory() && item.name.startsWith(`${paragraphId} `));
  assert(entry, `missing generated paragraph ${paragraphId}`);
  return path.join(chapterRoot, entry.name);
}

function requireGeneratedOutput() {
  for (const paragraphId of ['1.1.1', '1.1.2', '1.1.3']) {
    const dir = findParagraphDir(paragraphId);
    assert(fs.existsSync(path.join(dir, 'index.html')), `${paragraphId} missing landing page`);
    assert(fs.readdirSync(dir).some((file) => file.endsWith('korte-check.html')), `${paragraphId} missing korte-check page`);
    assert(fs.readdirSync(dir).some((file) => file.endsWith('exit-ticket.html')), `${paragraphId} missing exit-ticket page`);
  }
}

function requireReviewLab() {
  const lab = readText(`reports/review-gates/${gateId}/review-lab.html`);
  for (const name of [
    'desktop-111-landing-check.png',
    'desktop-111-korte-check.png',
    'desktop-111-exit-ticket.png',
    'desktop-112-landing-check.png',
    'desktop-112-korte-check.png',
    'desktop-112-exit-ticket.png',
    'desktop-113-landing-check.png',
    'desktop-113-korte-check.png',
    'desktop-113-exit-ticket.png',
    'mobile-113-exit-ticket-dark.png',
  ]) {
    assert(lab.includes(name), `review lab missing ${name}`);
  }
  for (const label of ['1.1.1 landing', '1.1.2 Exit ticket', '1.1.3 Korte check']) {
    assert(lab.includes(label), `review lab missing link label ${label}`);
  }
}

function requireRemoteMetadata(packet, live) {
  const hash = /^[0-9a-f]{40}$/;
  assert(packet.remote_publication_required_before_review === true, 'remote publication must be required before review');
  assert(hash.test(packet.remote_publication.reviewed_platform_commit_hash), 'packet platform hash must be 40 hex chars');
  assert(hash.test(packet.remote_publication.generated_lesson_commit_hash), 'packet lesson hash must be 40 hex chars');
  assert(live.remote_publication.platform_commit === packet.remote_publication.reviewed_platform_commit_hash, 'live platform hash mismatch');
  assert(live.remote_publication.lesson_commit === packet.remote_publication.generated_lesson_commit_hash, 'live lesson hash mismatch');

  const platformRemote = gitOutput(['ls-remote', 'origin', packet.remote_publication.reviewed_platform_branch]);
  assert(platformRemote.includes(packet.remote_publication.reviewed_platform_commit_hash), 'platform reviewed hash not found on remote branch');
  const lessonRemote = gitOutput(
    ['ls-remote', 'origin', packet.remote_publication.generated_lesson_branch],
    path.resolve(platformRoot, '..', '4veco-lessen')
  );
  assert(lessonRemote.includes(packet.remote_publication.generated_lesson_commit_hash), 'lesson reviewed hash not found on remote branch');
}

function requireAuthority(packet, live) {
  assert(packet.human_review_comments_started === false, 'human review must not be pre-recorded');
  assert(packet.gate_closure_authorized === false, 'gate closure must not be authorized before comments');
  for (const [key, value] of Object.entries(packet.authority_boundary)) {
    if (key === 'generated_lesson_output_already_deployed_as_evidence') {
      assert(value === true, `${key} must be true`);
    } else {
      assert(value === false, `${key} must be false`);
    }
  }
  for (const [key, value] of Object.entries(live.authority)) {
    assert(value === false, `live authority.${key} must be false`);
  }
}

function requireBundleUrls() {
  const file = path.join(gateDir, 'bundle-urls.md');
  assert(fs.existsSync(file), 'bundle-urls.md must exist');
  const text = fs.readFileSync(file, 'utf8');
  for (const name of ['review-packet.md', 'review-packet.json', 'live-output-evidence.md', 'review-lab.html']) {
    assert(text.includes(name), `bundle-urls missing ${name}`);
  }
}

function main() {
  assert(fs.existsSync(gateDir), `missing gate directory ${rel(gateDir)}`);
  const packet = readJson(`reports/review-gates/${gateId}/review-packet.json`);
  const live = readJson(`reports/review-gates/${gateId}/live-output-evidence.json`);
  assert(packet.gate_id === gateId, 'packet gate id mismatch');
  assert(live.gate_id === gateId, 'live evidence gate id mismatch');
  requirePacketText();
  requireEvidenceFiles(packet);
  requireNoClosureArtifacts();
  requireProof(packet, live);
  requireSourceData();
  requireGeneratedOutput();
  requireReviewLab();
  requireRemoteMetadata(packet, live);
  requireAuthority(packet, live);
  requireBundleUrls();
  console.log(`OK review packet: ${gateId}`);
}

main();
