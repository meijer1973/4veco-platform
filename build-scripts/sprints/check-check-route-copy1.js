#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const BOOK_ROOT = path.resolve(
  process.argv[2] || path.join(ROOT, '..', '4veco-lessen', 'Boek 1 - Grondslagen, vraag en aanbod')
);
const CHAPTER_ROOT = path.join(BOOK_ROOT, '1.1 Hoofdstuk Economisch denken en rekenen');
const proofPath = path.join(ROOT, 'reports', 'json', 'check-route-copy1-proof.json');
const paragraphs = [
  { id: '1.1.1', folderPrefix: '1.1.1 ' },
  { id: '1.1.2', folderPrefix: '1.1.2 ' },
  { id: '1.1.3', folderPrefix: '1.1.3 ' },
];

function fail(message) {
  console.error(`CHECK-ROUTE-COPY-1 check failed: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(file) {
  assert(fs.existsSync(file), `missing required file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function requireText(content, pattern, label) {
  if (typeof pattern === 'string') {
    assert(content.includes(pattern), `missing ${label}`);
    return;
  }
  assert(pattern.test(content), `missing ${label}`);
}

function rejectText(content, pattern, label) {
  assert(!pattern.test(content), `contains forbidden ${label}`);
}

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function paragraphDir(paragraph) {
  const entry = fs.readdirSync(CHAPTER_ROOT, { withFileTypes: true })
    .find((item) => item.isDirectory() && item.name.startsWith(paragraph.folderPrefix));
  assert(entry, `missing generated paragraph directory for ${paragraph.id}`);
  return path.join(CHAPTER_ROOT, entry.name);
}

function checkSourceAuthority() {
  const sourceDir = path.join(ROOT, 'source-data', 'book-1', 'exit-ticket');
  const data111 = readJson(path.join(sourceDir, '1.1.1-exit-ticket.json'));
  const data112 = readJson(path.join(sourceDir, '1.1.2-exit-ticket.json'));
  const data113 = readJson(path.join(sourceDir, '1.1.3-exit-ticket.json'));
  assert(data112.targetEquivalent.gateApproved === true, '1.1.2 reviewed authority must remain approved');
  assert(data112.targetEquivalent.completionLanguageEligible === true, '1.1.2 completion language must remain eligible');
  for (const [key, data] of [['1.1.1', data111], ['1.1.3', data113]]) {
    assert(data.targetEquivalent.gateApproved === false, `${key} must remain unapproved`);
    assert(data.targetEquivalent.completionLanguageEligible === false, `${key} completion language must remain held`);
    assert(data.metadataAlignment.targetReadinessEvidence === false, `${key} target readiness evidence must remain false`);
  }
}

function checkGenerator() {
  const generator = read(path.join(ROOT, 'build-scripts', 'platform', 'build-landing-page.js'));
  requireText(generator, 'function checkRouteCard', 'check-specific landing card renderer');
  requireText(generator, 'data-check-route="${copy.route}"', 'check route data attribute');
  requireText(generator, 'Krijg lokaal oefenadvies', 'advisory short-check copy');
  requireText(generator, 'Maak de eindcheck met dezelfde soort denkstappen als de eindopgave', 'exit-ticket end-check copy');
  requireText(generator, 'Eerst oefenadvies, daarna eindcheck', 'check-section distinction hint');
}

function checkLanding(paragraph) {
  const file = path.join(paragraphDir(paragraph), 'index.html');
  const html = read(file);
  const text = visibleText(html);
  requireText(html, 'data-section="check"', `${paragraph.id} check navigation`);
  requireText(html, 'data-check-route="advisory"', `${paragraph.id} advisory check-card attribute`);
  requireText(html, 'data-check-purpose="local-practice-advice"', `${paragraph.id} advisory check purpose`);
  requireText(html, 'data-check-route="exit-ticket"', `${paragraph.id} exit-ticket check-card attribute`);
  requireText(html, 'data-check-purpose="end-check"', `${paragraph.id} exit-ticket check purpose`);
  requireText(text, 'Eerst oefenadvies, daarna eindcheck', `${paragraph.id} check-section hint`);
  requireText(text, 'Korte check', `${paragraph.id} short-check title`);
  requireText(text, 'advies', `${paragraph.id} advisory badge`);
  requireText(text, 'Krijg lokaal oefenadvies', `${paragraph.id} advisory purpose`);
  requireText(text, 'dit is geen eindcheck', `${paragraph.id} advisory boundary`);
  requireText(text, 'Krijg oefenadvies', `${paragraph.id} advisory action`);
  requireText(text, 'Exit ticket', `${paragraph.id} exit-ticket title`);
  requireText(text, 'eindcheck', `${paragraph.id} exit badge/action`);
  requireText(text, 'dezelfde soort denkstappen als de eindopgave', `${paragraph.id} exit purpose`);
  requireText(text, 'Maak eindcheck', `${paragraph.id} exit action`);
  rejectText(text, /Kies wat je nog wilt oefenen|Maak de volledige paragraaf-check/i, `${paragraph.id} old generic check copy`);
  rejectText(text, /\b(?:diagnostisch|diagnose|mastery|sequencing|summatief|cijfer|Scale Gate|PV)\b/i, `${paragraph.id} forbidden authority copy`);
  rejectText(text, /\b(?:beheerst|bewezen|aangetoond)\b/i, `${paragraph.id} unreviewed proof/mastery language`);
}

function checkProof() {
  const proof = readJson(proofPath);
  assert(proof.sprint_id === 'CHECK-ROUTE-COPY-1', 'proof sprint id mismatch');
  assert(proof.status === 'complete', 'proof must be complete');
  assert(proof.authority.product_route_adoption_authorized === false, 'proof must not authorize product-route adoption');
  assert(proof.authority.new_target_equivalent_completion_language_authorized === false, 'proof must not authorize new completion language');
  assert(proof.proof.first_three_landing_pages_checked === true, 'proof must check first-three landing pages');
  assert(proof.proof.advisory_and_exit_cards_distinct === true, 'proof must record distinct check cards');
  assert(proof.proof.old_generic_copy_absent === true, 'proof must record old generic copy absence');
  for (const id of ['desktop-111-check', 'desktop-112-check', 'desktop-113-check', 'mobile-113-check', 'mobile-dark-113-check']) {
    const item = proof.cases.find((entry) => entry.id === id);
    assert(item, `proof missing case ${id}`);
    assert(item.status === 'PASS', `proof case ${id} must pass`);
    assert(item.screenshot && fs.existsSync(path.join(ROOT, item.screenshot)), `proof case ${id} missing screenshot`);
  }
}

function checkRoadmap() {
  const roadmap = read(path.join(ROOT, 'references', 'reference-team-roadmap.md'));
  requireText(roadmap, 'CHECK-ROUTE-COPY-1', 'roadmap route-copy sprint mention');
  requireText(roadmap, /CHECK-ROUTE-COPY-1[\s\S]{0,400}complete/i, 'roadmap route-copy completion statement');
  rejectText(roadmap, /CHECK-ROUTE-COPY-1[\s\S]{0,700}Scale Gate 1 authorized/i, 'Scale Gate authorization');
}

function main() {
  checkSourceAuthority();
  checkGenerator();
  for (const paragraph of paragraphs) checkLanding(paragraph);
  checkProof();
  checkRoadmap();
  console.log('CHECK-ROUTE-COPY-1 check passed');
}

main();
