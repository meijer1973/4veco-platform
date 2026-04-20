#!/usr/bin/env node
/**
 * apply-audit.js
 *
 * One-shot: take the 4 subagent audit results in audit-2025.json, dedupe
 * slugs, validate exam_codes, assign unit IDs per domain, mint all new
 * units via unit-lib (single atomic save at the end), and write final
 * annotations back to exam-questions.json.
 *
 * Idempotent: refuses to run if any unit with a non-A ID already exists
 * (i.e. a prior audit has already populated the catalog).
 */

const fs = require('fs');
const path = require('path');
const { loadCatalog, saveCatalog } = require('./unit-lib');
const { parseMarkdown, loadEindtermen } = require('./build-unit-index');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const AUDIT_JSON = path.join(__dirname, 'audit-2025.json');
const EXAM_QUESTIONS = path.join(REPO_ROOT, 'references/external/exam-questions.json');

const DOMAIN_ORDER = ['D', 'E', 'F', 'G', 'H', 'I', 'A', 'B', 'C', 'J', 'K'];
const VALID_TYPES = new Set(['uitleg_dat', 'berekenen', 'uitleg_of', 'classificatie', 'grafisch', 'bron', 'noem']);

function isAId(s)    { return /^A\d{2}$/.test(s); }
function isUnitId(s) { return /^[A-K]\d{2}$/.test(s); }

function main() {
  const audit = JSON.parse(fs.readFileSync(AUDIT_JSON, 'utf8'));
  const eindtermen = loadEindtermen() || new Set();
  console.log(`loaded ${eindtermen.size} valid eindtermen`);

  // Collect all new_units across the 4 audits, dedupe by slug
  // (keeping longest-kern variant). Skip A-domain proposals — the audit
  // should not mint new math skills; those belong to the skilltree seed.
  const unitsBySlug = new Map();
  const droppedADomain = [];
  for (const exam of Object.keys(audit)) {
    for (const u of audit[exam].new_units) {
      if (!u.slug) continue;
      if (u.domain_letter === 'A') {
        droppedADomain.push(u.slug);
        continue;
      }
      const existing = unitsBySlug.get(u.slug);
      if (!existing || (u.kern || '').length > (existing.kern || '').length) {
        unitsBySlug.set(u.slug, { ...u });
      }
    }
  }
  console.log(`deduped to ${unitsBySlug.size} unique slugs`);
  if (droppedADomain.length) console.log(`[info] dropped ${droppedADomain.length} A-domain proposals: ${droppedADomain.join(', ')}`);

  // Drop invalid exam_codes from each new_unit and from each annotation.
  function cleanExamCodes(codes) {
    return (codes || []).filter(c => eindtermen.has(c));
  }

  // Assign IDs per domain, stable ordering (alphabetical slug).
  const slugsByDomain = {};
  for (const [slug, u] of unitsBySlug.entries()) {
    const letter = u.domain_letter;
    if (!DOMAIN_ORDER.includes(letter)) continue;
    (slugsByDomain[letter] = slugsByDomain[letter] || []).push(slug);
  }

  // Idempotency: refuse if any non-A unit already exists.
  const { preamble, units, byId } = loadCatalog();
  const existingNonA = units.filter(u => !u.id.startsWith('A') && !u.deprecated);
  if (existingNonA.length > 0) {
    console.error(`refuse to run: catalog already has ${existingNonA.length} non-A unit(s). Revert first.`);
    process.exit(1);
  }

  // Next available ID number for A-domain (if any new A-units are proposed).
  const aUsed = new Set(units.filter(u => u.id.startsWith('A')).map(u => u.id));
  let aNext = 38;
  function nextAId() {
    while (aUsed.has(`A${String(aNext).padStart(2, '0')}`)) aNext++;
    const id = `A${String(aNext).padStart(2, '0')}`;
    aUsed.add(id);
    aNext++;
    return id;
  }

  const slugToId = new Map();
  for (const letter of DOMAIN_ORDER) {
    const slugs = (slugsByDomain[letter] || []).slice().sort();
    let n = 1;
    for (const slug of slugs) {
      let id;
      if (letter === 'A') {
        id = nextAId();
      } else {
        id = `${letter}${String(n).padStart(2, '0')}`;
        n++;
      }
      slugToId.set(slug, id);
    }
  }
  console.log(`assigned IDs across ${[...new Set([...slugToId.values()].map(id => id[0]))].sort().join('/')} domains`);

  // Build unit specs and append to catalog.
  const newUnits = [];
  for (const [slug, u] of unitsBySlug.entries()) {
    const id = slugToId.get(slug);
    if (!id) { console.warn(`no ID for slug ${slug}; skipping`); continue; }
    const unit = {
      id,
      name: u.name,
      kern: u.kern,
      needs: [],
      exam_codes: cleanExamCodes(u.exam_codes),
      mastery_target: u.mastery_target,
      prior_learning: u.prior_learning || 'new_this_year',
      terms: [],
    };
    if (['apply', 'analyze', 'evaluate'].includes(unit.mastery_target)) {
      // Apply-level unit without an abstract procedure — seed with the kern
      // as a single-step placeholder; refinement via unit-update later.
      unit.procedure = [u.kern];
    }
    newUnits.push(unit);
    units.push(unit);
  }

  // Commit new units.
  try {
    saveCatalog({ preamble, units });
  } catch (err) {
    if (err.errors) for (const e of err.errors) console.error('CATALOG  ' + e);
    else console.error(err.message);
    process.exit(1);
  }
  console.log(`minted ${newUnits.length} new units`);

  // Now resolve annotations on exam-questions.json.
  const questions = JSON.parse(fs.readFileSync(EXAM_QUESTIONS, 'utf8'));
  const byKey = new Map();
  for (const q of questions) byKey.set(q.exam + ':' + q.question_num, q);

  let resolved = 0;
  const unresolvedSlugs = new Set();

  for (const examCode of Object.keys(audit)) {
    const ann = audit[examCode].annotations;
    for (const a of ann) {
      const q = byKey.get(examCode + ':' + a.question_num);
      if (!q) continue;

      const skillIds = [];
      for (const s of a.required_skills || []) {
        if (isUnitId(s)) {
          skillIds.push(s);
        } else if (slugToId.has(s)) {
          skillIds.push(slugToId.get(s));
        } else {
          unresolvedSlugs.add(s);
        }
      }

      q.required_skills = skillIds;
      q.question_type = VALID_TYPES.has(a.question_type) ? a.question_type : null;
      q.exam_codes = cleanExamCodes(a.exam_codes);
      resolved++;
    }
  }

  fs.writeFileSync(EXAM_QUESTIONS, JSON.stringify(questions, null, 2) + '\n');
  console.log(`updated ${resolved} question annotations in exam-questions.json`);
  if (unresolvedSlugs.size > 0) {
    console.warn(`[warn] ${unresolvedSlugs.size} unresolved slug(s) in annotations:`);
    for (const s of unresolvedSlugs) console.warn(`  - ${s}`);
  }

  // Summary by domain
  const byDomain = {};
  const finalUnits = parseMarkdown(fs.readFileSync(path.join(REPO_ROOT, 'references/machine/micro-teaching-units.md'), 'utf8'));
  for (const u of finalUnits) byDomain[u.id[0]] = (byDomain[u.id[0]] || 0) + 1;
  console.log('catalog distribution:', byDomain);
}

if (require.main === module) main();
