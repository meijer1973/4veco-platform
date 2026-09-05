#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ownerDecision = require('./book2-owner-decision');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT = 'BOOK2-TARGET-AUTHORITY-REMEDIATION-1';
const PATHS = Object.freeze({
  registry: 'references/authored/course-target-exercises.json',
  candidates: `references/data/sprints/${SPRINT}.candidates.json`,
  alignment: `references/data/sprints/${SPRINT}.alignment.json`,
  alignmentMarkdown: `reports/sprints/${SPRINT}-alignment-matrix.md`,
  plan: `references/data/sprints/${SPRINT}.plan.json`,
  meta: 'references/authored/book-outlines/book-2-outline.meta.json',
  terminology: 'references/authored/economie-terminologie.md',
  units: 'references/machine/micro-teaching-units.json',
  unitsMarkdown: 'references/machine/micro-teaching-units.md',
});
const IDS = Object.freeze([
  '2.1.1', '2.1.2', '2.1.3', '2.1.4',
  '2.2.1', '2.2.2', '2.2.3', '2.2.4',
  '2.3.1', '2.3.2', '2.3.3', '2.3.4',
]);
const HOLD_IDS = Object.freeze([
  'H-229-211-CANDIDATE', 'H-212-STALE-REF', 'H-213-DELTAQ', 'H-229-214-CANDIDATE',
  'H-229-221-CANDIDATE', 'H-229-222-CANDIDATE', 'H-229-223-CANDIDATE', 'H-229-224-CANDIDATE',
  'H-231-V5', 'H-232-V5', 'H-233-V5-REF', 'H-234-PLACEHOLDER',
]);
const CANDIDATE_FIELDS = Object.freeze([
  'blocked_baseline_sha256', 'candidate_replacement_sha256', 'candidate_package_sha256',
  'candidate_evidence_ref', 'candidate_status', 'approved_replacement_sha256',
  'approval_ref', 'approved_by', 'approved_on',
]);
const ALIGNMENT_FIELDS = Object.freeze([
  'goal', 'questions', 'classification', 'authority', 'answer_form',
  'source_sufficiency', 'calculation_evidence',
]);
const QUESTION_BUDGET_FIELDS = Object.freeze(['label', 'minutes', 'points', 'observable_actions']);
const DURABLE_PENDING_STATUS = 'pending';
const DURABLE_TERMINAL_STATUS = 'integrated';
const REVIEWED_PACKAGE_SHA256 = '914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310';

function sha256(value) {
  return crypto.createHash('sha256').update(Buffer.isBuffer(value) ? value : Buffer.from(String(value))).digest('hex');
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function gitJson(commit, relativePath) {
  return JSON.parse(execFileSync('git', ['show', `${commit}:${relativePath}`], { cwd: ROOT, encoding: 'utf8' }));
}

function readInputs(options = {}) {
  const plan = readJson(PATHS.plan);
  const scopeBase = options.scopeBase || plan.platform_baseline;
  if (!/^[0-9a-f]{40}$/i.test(String(scopeBase || ''))) throw new Error('sprint scope base requires a full commit SHA');
  execFileSync('git', ['merge-base', '--is-ancestor', scopeBase, 'HEAD'], { cwd: ROOT, stdio: 'pipe' });
  return {
    registry: readJson(PATHS.registry),
    candidates: readJson(PATHS.candidates),
    alignment: readJson(PATHS.alignment),
    alignmentMarkdown: fs.readFileSync(path.join(ROOT, PATHS.alignmentMarkdown), 'utf8'),
    plan,
    meta: readJson(PATHS.meta),
    terminology: fs.readFileSync(path.join(ROOT, PATHS.terminology), 'utf8'),
    units: readJson(PATHS.units),
    unitsMarkdown: fs.readFileSync(path.join(ROOT, PATHS.unitsMarkdown), 'utf8'),
    baselineRegistry: gitJson(scopeBase, PATHS.registry),
    baselineMeta: gitJson(plan.platform_baseline, PATHS.meta),
    baselineUnits: gitJson(scopeBase, PATHS.units),
  };
}

function canonical(value) {
  return JSON.stringify(value);
}

function textOf(value) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(textOf).join('\n');
  if (value && typeof value === 'object') return Object.values(value).map(textOf).join('\n');
  return '';
}

function requireMatch(errors, id, text, pattern, purpose) {
  if (!pattern.test(text)) errors.push(`${id}: missing ${purpose}`);
}

function durableLifecycleState(meta, input = readInputs(), options = {}) {
  const candidate = meta && meta.issue_229_candidate;
  const approvalStatus = candidate && candidate.approval_status;
  if (approvalStatus === DURABLE_PENDING_STATUS) return { mode: 'pending', failures: [] };
  if (approvalStatus !== DURABLE_TERMINAL_STATUS) {
    return {
      mode: 'invalid',
      failures: [`Issue #229 durable lifecycle approval_status must be ${DURABLE_PENDING_STATUS} or ${DURABLE_TERMINAL_STATUS}`],
    };
  }

  const failures = [];
  failures.push(...ownerDecision.validateOwnerDecision(meta.issue_229_owner_decision));
  // The only recorded immutable owner decision approves content, not integration.
  // A later integration needs its own reviewed/pinned authority contract; neither
  // release metadata nor a real candidate commit can manufacture that permission.
  if (meta.issue_229_owner_decision?.integration_authorized !== true) {
    failures.push('Issue #229 terminal retirement requires a separate immutable owner integration decision; content approval does not authorize target integration');
  }
  let expectedRecords;
  try { expectedRecords = ownerDecision.approvedRecords(); }
  catch (error) { return { mode: 'invalid', failures: [error.message] }; }
  const expectedById = new Map(expectedRecords.map((record) => [record.id, sha256(canonical(record))]));
  const registryRecords = (input.registry?.exercises || []).filter((record) => record.module === 2);
  if (sha256(canonical(registryRecords)) !== REVIEWED_PACKAGE_SHA256) failures.push('terminal registry must match the exact approved ordered package');
  if (candidate.status !== DURABLE_TERMINAL_STATUS) failures.push('Issue #229 durable terminal state requires status integrated');
  if (!/^[0-9a-f]{40}$/i.test(String(candidate.integrated_commit || ''))) failures.push('Issue #229 durable terminal state requires a full integrated_commit');
  if (typeof candidate.integration_evidence_ref !== 'string' || candidate.integration_evidence_ref.trim() === '') failures.push('Issue #229 durable terminal state requires integration_evidence_ref');
  if (candidate.package_sha256 !== REVIEWED_PACKAGE_SHA256) failures.push('Issue #229 durable terminal state requires the exact reviewed package hash');

  const byId = new Map((meta.holds || []).map((hold) => [hold.id, hold]));
  if (byId.size !== (meta.holds || []).length) failures.push('terminal hold IDs must be unique');
  const reviewedMeta = JSON.parse(ownerDecision.gitText(ownerDecision.REVIEWED_HEAD, PATHS.meta));
  const reviewedHolds = new Map(reviewedMeta.holds.map((hold) => [hold.id, hold]));
  const checkedCommits = new Map();
  function integratedRecords(commit) {
    if (checkedCommits.has(commit)) return checkedCommits.get(commit);
    try {
      if (!/^[0-9a-f]{40}$/i.test(String(commit || ''))) throw new Error('full commit SHA required');
      const root = options.gitRoot || ROOT;
      execFileSync('git', ['merge-base', '--is-ancestor', commit, 'HEAD'], { cwd: root, stdio: 'pipe' });
      const registry = JSON.parse(ownerDecision.gitText(commit, PATHS.registry, root));
      const records = registry.exercises.filter((record) => record.module === 2);
      if (sha256(canonical(records)) !== REVIEWED_PACKAGE_SHA256) throw new Error('integrated registry package mismatch');
      checkedCommits.set(commit, records);
      return records;
    } catch (error) {
      failures.push(`terminal integrated_commit ${commit}: ${error.message}`);
      checkedCommits.set(commit, null);
      return null;
    }
  }
  integratedRecords(candidate.integrated_commit);
  for (const [index, id] of HOLD_IDS.entries()) {
    const hold = byId.get(id);
    if (!hold || hold.status !== 'released' || hold.candidate_binding || !hold.target_binding) {
      failures.push(`${id}: durable terminal state requires a released target binding without candidate binding`);
      continue;
    }
    const approved = hold.target_binding.approved_replacement_sha256;
    const evidence = hold.release_evidence;
    const bindingFields = ['blocked_baseline_sha256', 'approved_replacement_sha256', 'approval_ref', 'approved_by', 'approved_on'];
    const evidenceFields = ['resolved_via', 'released_by', 'released_on', 'evidence_ref', 'subject_id', 'subject_sha256', 'integrated_commit'];
    if (canonical(Object.keys(hold.target_binding).sort()) !== canonical(bindingFields.sort())
        || hold.target_binding.blocked_baseline_sha256 !== reviewedHolds.get(id).candidate_binding.blocked_baseline_sha256) {
      failures.push(`${id}: terminal binding must preserve exact fields and original reviewed baseline`);
    }
    if (!evidence || canonical(Object.keys(evidence).sort()) !== canonical(evidenceFields.sort())
        || typeof evidence.released_by !== 'string' || !evidence.released_by.trim()
        || !/^\d{4}-\d{2}-\d{2}$/.test(String(evidence.released_on || ''))
        || typeof evidence.evidence_ref !== 'string' || !evidence.evidence_ref.trim()) {
      failures.push(`${id}: terminal release requires complete evidence fields, identity, date, and reference`);
    }
    const subjectId = IDS[index];
    const expectedHash = expectedById.get(subjectId);
    if (canonical(hold.scope) !== canonical([`paragraph:${subjectId}`])
        || approved !== expectedHash || evidence?.subject_sha256 !== expectedHash
        || evidence?.subject_id !== subjectId
        || (meta.target_registry_pins || []).find((pin) => pin.id === subjectId)?.target_record_sha256 !== expectedHash) {
      failures.push(`${id}: terminal target binding, release subject, and current pin must match the approved record hash`);
    }
    if (!ownerDecision.hasApprovedFrozenRecord(meta, expectedRecords[index], hold.target_binding)) {
      failures.push(`${id}: terminal binding requires the exact owner content approval`);
    }
    if (!/^[0-9a-f]{64}$/i.test(String(approved || ''))
        || !evidence || evidence.resolved_via !== 'target_authority_integration'
        || evidence.subject_sha256 !== approved
        || !/^[0-9a-f]{40}$/i.test(String(evidence.integrated_commit || ''))) {
      failures.push(`${id}: durable terminal state requires exact target-integration evidence`);
    }
    const integrated = integratedRecords(evidence?.integrated_commit);
    if (integrated && sha256(canonical(integrated[index])) !== expectedHash) failures.push(`${id}: integrated record differs from approved content`);
  }

  const eiHold = byId.get('H-229-EI-SUPERSESSION');
  const eiEvidence = eiHold && eiHold.release_evidence;
  if (!eiHold || eiHold.status !== 'released') {
    failures.push('H-229-EI-SUPERSESSION: durable terminal state requires a released Ei supersession hold');
  } else failures.push(...ownerDecision.validateEiDecision(meta));
  return { mode: failures.length === 0 ? 'retired' : 'invalid', failures };
}

function validateConcreteSources(errors, id, sources) {
  const placeholder = /(?:\b(?:bron|tabel|grafiek|gegevens)\s+(?:volgt|later|wordt\s+toegevoegd)\b|\b(?:todo|tbd|placeholder)\b)/i;
  for (const [index, source] of sources.entries()) {
    const label = `${id}: source ${index + 1}`;
    if (!source || typeof source !== 'object') {
      errors.push(`${label} must be a concrete source object`);
      continue;
    }
    if (typeof source.id !== 'string' || source.id.trim() === '') errors.push(`${label} requires a stable id`);
    if (typeof source.content !== 'string' || source.content.trim() === '' || placeholder.test(source.content)) {
      errors.push(`${label} contains placeholder or empty source content`);
    }
    if (source.type === 'table') {
      if (!Array.isArray(source.columns) || source.columns.length < 2 || source.columns.some((cell) => String(cell).trim() === '')) {
        errors.push(`${label} table requires at least two named columns`);
      }
      if (!Array.isArray(source.rows) || source.rows.length === 0) {
        errors.push(`${label} table requires concrete rows`);
      } else if (Array.isArray(source.columns) && source.rows.some((row) => !Array.isArray(row) || row.length !== source.columns.length || row.some((cell) => String(cell).trim() === ''))) {
        errors.push(`${label} table rows must be complete and match the column count`);
      }
    }
  }
}

function validateGenericRecords(errors, candidates, alignment) {
  const alignmentById = new Map((alignment.records || []).map((item) => [item.id, item]));
  const forbiddenEnglish = /\b(?:write|calculate|explain|what do you notice|why|shade|draw|using|suppose)\b/i;
  for (const record of candidates) {
    const id = record.id;
    const questions = record.target_exercise && record.target_exercise.subquestions;
    const labels = Array.isArray(questions) ? questions.map((item) => String(item.label)) : [];
    const answerLabels = Object.keys(record.short_answer_model || {});
    const studentText = textOf([record.target_exercise, record.lesson_goals, record.short_answer_model]);
    if (record.record_status !== 'candidate_review_ready') errors.push(`${id}: record_status must remain candidate_review_ready before owner approval`);
    if (!Array.isArray(record.lesson_goals) || record.lesson_goals.length < 1 || record.lesson_goals.length > 4) errors.push(`${id}: requires one to four lesson goals`);
    if ((record.lesson_goals || []).some((goal) => !goal.startsWith('Je kunt '))) errors.push(`${id}: every lesson goal must start with Je kunt`);
    if (!Array.isArray(questions) || questions.length < 4) errors.push(`${id}: requires at least four visible questions`);
    if ((questions || []).some((question) => !Number.isInteger(question.points) || question.points <= 0)) errors.push(`${id}: every visible question requires positive integer points`);
    if ((questions || []).some((question) => question.points > 4)) errors.push(`${id}: visible question exceeds the governed four-point maximum`);
    if (canonical(labels) !== canonical(answerLabels)) errors.push(`${id}: short answer labels must exactly match visible question labels`);
    if (!Array.isArray(record.answer_form_expectations) || record.answer_form_expectations.length === 0) errors.push(`${id}: answer-form expectations are missing`);
    if (forbiddenEnglish.test(studentText)) errors.push(`${id}: student-facing task contains an English instruction verb`);
    if (/noodzakelijk/i.test(studentText)) errors.push(`${id}: student-facing candidate uses forbidden Ei category noodzakelijk`);
    if (/productiegebied/i.test(studentText)) errors.push(`${id}: student-facing candidate uses forbidden pseudo-term productiegebied`);
    if (/break-evenafzet/i.test(studentText)) errors.push(`${id}: student-facing candidate must use canonical break-even-afzet`);
    if (/kruiselingse/i.test(studentText)) errors.push(`${id}: student-facing candidate must use canonical kruislingse elasticiteit`);
    if (/\bEkr\b/.test(studentText)) errors.push(`${id}: student-facing candidate must use authored Ek notation`);
    if (/\bWTP\b/.test(studentText)) errors.push(`${id}: student-facing candidate must spell out betalingsbereidheid`);
    if (/trapez/i.test(studentText)) errors.push(`${id}: surplus calculation may use only rectangles and triangles`);

    const expectedLabels = record.paragraph_kind === 'gemengde_opgaven'
      ? Array.from({ length: labels.length }, (_, index) => String(index + 1))
      : Array.from({ length: labels.length }, (_, index) => String.fromCharCode(97 + index));
    if (canonical(labels) !== canonical(expectedLabels)) errors.push(`${id}: question labels must be continuous`);
    if (record.paragraph_kind === 'gemengde_opgaven') {
      if (labels.length < 4 || labels.length > 6) errors.push(`${id}: mixed target requires four to six questions`);
      if (record.introduces_new_theory !== false || !record.mixed_target_profile || record.mixed_target_profile.no_new_theory !== true) errors.push(`${id}: mixed target must introduce no new theory`);
      const sources = record.target_exercise.sources;
      if (!Array.isArray(sources) || sources.length === 0) errors.push(`${id}: mixed target requires concrete sources`);
      else validateConcreteSources(errors, id, sources);
      if (/grafiek/i.test(studentText) && !/basisgrafiek/i.test(studentText)) errors.push(`${id}: mixed graph work requires a supplied base graph`);
      if (/teken (?:de )?(?:vraag|aanbod|volledige)/i.test(studentText) && !/teken de vraag- en aanbodlijn niet opnieuw/i.test(studentText)) errors.push(`${id}: mixed target may not require a complete graph from scratch`);
      if ((questions || []).filter((question) => question.points === 2).length < Math.ceil(0.8 * labels.length)) errors.push(`${id}: mixed target must give at least 80% of visible questions two points`);
      if (record.mixed_target_profile.table_or_graph_interpretation_required === true) {
        const sources = record.target_exercise.sources || [];
        if (!sources.some((source) => source.type === 'table' || source.id === 'basisgrafiek')) errors.push(`${id}: mixed target claims table/graph interpretation without a concrete table or base graph`);
      }
    }

    const map = alignmentById.get(id);
    if (!map) { errors.push(`${id}: alignment record is missing`); continue; }
    const min = record.paragraph_kind === 'gemengde_opgaven' ? 18 : 8;
    const max = record.paragraph_kind === 'gemengde_opgaven' ? 25 : 12;
    if (!Number.isInteger(map.estimated_minutes) || map.estimated_minutes < min || map.estimated_minutes > max) errors.push(`${id}: workload estimate is outside its budget`);
    const timeLabels = Object.keys(map.question_time_minutes || {});
    if (canonical(timeLabels) !== canonical(labels)) errors.push(`${id}: question-time labels must exactly match visible question labels`);
    const timeValues = Object.values(map.question_time_minutes || {});
    if (timeValues.some((minutes) => !Number.isInteger(minutes) || minutes <= 0)) errors.push(`${id}: every visible question requires a positive integer time budget`);
    if (timeValues.reduce((sum, minutes) => sum + minutes, 0) !== map.estimated_minutes) errors.push(`${id}: question-time budget must sum to estimated_minutes`);
    const budgets = Array.isArray(map.question_budgets) ? map.question_budgets : [];
    if (canonical(budgets.map((budget) => String(budget.label))) !== canonical(labels)) errors.push(`${id}: action budgets must exactly cover visible question labels in order`);
    for (const budget of budgets) {
      if (canonical(Object.keys(budget)) !== canonical(QUESTION_BUDGET_FIELDS)) errors.push(`${id}: each action budget requires exact label/minutes/points/observable_actions fields`);
      const question = (questions || []).find((item) => String(item.label) === String(budget.label));
      if (!question) continue;
      if (budget.minutes !== map.question_time_minutes[budget.label]) errors.push(`${id}/${budget.label}: action-budget minutes differ from question-time budget`);
      if (budget.points !== question.points) errors.push(`${id}/${budget.label}: action-budget points differ from visible points`);
      if (!Array.isArray(budget.observable_actions) || budget.observable_actions.length === 0 || budget.observable_actions.some((action) => typeof action !== 'string' || action.trim() === '')) errors.push(`${id}/${budget.label}: observable actions are missing`);
      if (Array.isArray(budget.observable_actions) && budget.observable_actions.length > question.points) errors.push(`${id}/${budget.label}: observable actions exceed available points`);
    }
    const mappedQuestions = new Set();
    const mappedGoals = new Set();
    for (const operation of map.operations || []) {
      if (canonical(Object.keys(operation)) !== canonical(ALIGNMENT_FIELDS)) errors.push(`${id}: each alignment operation requires exact evidence fields`);
      if (!Number.isInteger(operation.goal) || operation.goal < 1 || operation.goal > record.lesson_goals.length) errors.push(`${id}: operation maps an invalid goal`);
      mappedGoals.add(operation.goal);
      if (!Array.isArray(operation.questions) || operation.questions.length === 0) errors.push(`${id}: operation has no visible question`);
      if (typeof operation.classification !== 'string' || operation.classification.trim() === '') errors.push(`${id}: operation classification is empty`);
      for (const label of operation.questions || []) {
        mappedQuestions.add(String(label));
        if (!labels.includes(String(label))) errors.push(`${id}: operation maps unknown question ${label}`);
      }
      for (const field of ALIGNMENT_FIELDS.slice(3)) if (textOf(operation[field]).trim() === '') errors.push(`${id}: operation field ${field} is empty`);
    }
    if (mappedGoals.size !== record.lesson_goals.length) errors.push(`${id}: not every lesson goal maps to an operation`);
    if (canonical([...mappedQuestions].sort()) !== canonical([...labels].sort())) errors.push(`${id}: not every point-bearing question maps back to a goal`);
  }
}

function validateAlignmentMarkdown(errors, alignment, markdown, packageHash) {
  if (!markdown.includes(`Candidate package SHA-256: \`${packageHash}\`.`)) errors.push('alignment Markdown candidate package hash is stale');
  for (const record of alignment.records || []) {
    const start = markdown.indexOf(`## ${record.id} `);
    if (start < 0) { errors.push(`${record.id}: alignment Markdown section is missing`); continue; }
    const next = markdown.indexOf('\n## ', start + 4);
    const section = markdown.slice(start, next < 0 ? markdown.length : next);
    const map = (record.operations || [])
      .map((operation) => `goal ${operation.goal} → ${(operation.questions || []).join(',')}`)
      .join('; ');
    if (!section.includes(`Machine map: ${map}`)) errors.push(`${record.id}: alignment Markdown goal/question map is stale`);
  }
}

function validateRecordSpecific(errors, byId) {
  const checks = {
    '2.1.1': [[/TCK = 500/, 'TCK function'], [/Bij Q=500 zijn TCK=€500, TVK=€400 en TK=€900.*bij Q=1\.000 zijn TCK=€500, TVK=€800 en TK=€1\.300/s, 'two-state total-cost comparison'], [/TCK blijft gelijk, TVK verdubbelt en TK stijgt maar verdubbelt niet/, 'total-cost change explanation'], [/GVK blijft €0,80/, 'bounded GVK answer'], [/500–1\.000/, 'production range'], [/hun totale maandbedrag verandert niet met Q/, 'cause for constant-cost judgment'], [/doordat dezelfde TCK over tweemaal zoveel broden worden verdeeld/, 'cause for GCK judgment'], [/omdat alleen GCK halveert/, 'cause for GTK judgment'], [/table.*kostencomponent.*soort kosten.*reden/s, 'structured classification table']],
    '2.1.2': [[/Q=714,2857/, 'continuous break-even'], [/eerste gehele aantal broden zonder verlies is 715/, 'whole-unit break-even'], [/Horizontale as: hoeveelheid Q \(broden per maand\).*Verticale as: TK en TO \(€ per maand\)/s, 'graph axes and units'], [/verticale afstand €1\.500−€1\.300=€200/, 'profit as vertical distance'], [/voor Q>0.*GO=.*=P/s, 'GO=P domain condition']],
    '2.1.3': [[/MK=.*€5 bij Q=5.*MK=€15 bij Q=10.*MK=€25 bij Q=15/s, 'normalized Curva MK at right endpoints'], [/\(230−200\)\/\(10−0\)=€3/, 'explicit Delta Q denominator'], [/Gebruik geen afgeleiden/, 'pre-calculus boundary'], [/Trek geen conclusie over de winstmaximaliserende afzet/, 'output-choice boundary'], [/table.*Q.*TK.*TO.*winst.*MK.*MO/s, 'true table representation']],
    '2.1.4': [[/Q=400 lunchboxen/, 'break-even'], [/MK=€3,00\/€3,50\/€4,00 per lunchbox/, 'rush MK'], [/basisgrafiek/, 'supplied representation'], [/snelst van Q=400 tot Q=700/, 'largest profit-growth range'], [/MO−MK=€5−€2=€3.*€2,00, €1,50 en €1,00/s, 'complete marginal comparison'], [/table.*Q.*TK.*TO/s, 'true table source']],
    '2.2.1': [[/Ev=−16%\/\+20%=−0,8/, 'inelastic calculation'], [/A38/, 'percentage-change prerequisite'], [/D1\.5/, 'correct exam code D1.5'], [/D1\.6/, 'correct exam code D1.6']],
    '2.2.2': [[/€5\.000 per week.*€5\.040 per week/s, 'cinema revenue'], [/€20\.000 per maand.*€17\.600 per maand/s, 'stream revenue'], [/TO stijgt met €40\/€5\.000×100%=0,8%/, 'finite cinema revenue change'], [/%ΔTO=\(17\.600−20\.000\)\/20\.000×100%=−12%/, 'signed finite stream revenue change'], [/Lokale regel: bij een kleine prijsstijging/, 'local revenue rule boundary'], [/kostengegevens ontbreken.*geen hogere winst/s, 'profit limit'], [/D25 concerns a different mathematical skill/, 'D25 noncoverage gap']],
    '2.2.3': [[/Ei<0 inferieur goed, 0<Ei<1 normaal goed en Ei>1 luxegoed/, 'three-way Ei rule'], [/kruislingse elasticiteit geldt Ek=/, 'authored Ek definition'], [/Qx oud=.*390 abonnementen per maand.*Qx=420/s, 'income function outputs'], [/Ei=7,69%\/10%=0,769, dus fitnessdienst X is hier een normaal goed/, 'observable normal-good calculation and classification'], [/Bij Pz=24: Qx=.*392 abonnementen per maand/s, 'cross-price function outputs'], [/thee en koffie zijn substituten.*koffiefilters en koffie zijn complementen/s, 'named Ek goods'], [/A15 from §2\.2\.1/, 'percentage-change prerequisite']],
    '2.2.4': [[/Ev=−0,7/, 'mixed Ev'], [/Ei=15%\/8%=1,875/, 'mixed Ei'], [/Ek=5%\/12,5%=0,4/, 'mixed Ek'], [/Q oud=.*14\.200 abonnementen per maand.*Q=14\.400 abonnementen per maand/s, 'demand-function consolidation'], [/D1\.5/, 'exam-code coverage D1.5'], [/D1\.6/, 'exam-code coverage D1.6'], [/table.*gegeven.*oud.*nieuw.*prijs Standaard/s, 'table source representation']],
    '2.3.1': [[/Noem dit niet de evenwichtshoeveelheid/, 'demand-only wording'], [/alle bij deze prijs gevraagde kaartjes worden verkocht/, 'realized-sales assumption without leaked quantity'], [/hoogste betalingsbereidheid/, 'allocation assumption'], [/Qd.*60 kaartjes/, 'demand quantity'], [/Horizontale as: Q \(kaartjes\).*Verticale as: P \(€ per kaartje\)/s, 'graph axes and units'], [/½×60×\(50−20\)=€900/, 'CS area'], [/60 verkochte kaartjes/, 'sold-ticket interpretation']],
    '2.3.2': [[/inverse aanbodlijn voor 0≤Q≤100 de marginale kosten/, 'bounded supply-as-MC'], [/CS=½×60×\(50−20\)=€900.*PS=½×60×\(20−5\)=€450/s, 'CS/PS anchors'], [/Q=50: betalingsbereidheid=€25 en MK=€17,50/, 'below-equilibrium comparison'], [/Q=70: betalingsbereidheid=€15 en MK=€22,50/, 'above-equilibrium comparison'], [/geen volledig maatschappelijk oordeel/, 'social-welfare boundary']],
    '2.3.3': [[/Pareto-efficiënt betekent/, 'Pareto definition'], [/kosteloos verruimbare reserveringsregel/, 'removable rule'], [/technisch minstens 60 transacties/, 'technical feasibility'], [/Bij P=25: Qd=50 en Qs=80/, 'strictly binding transaction chain'], [/hoogste betalingsbereidheid.*laagste marginale kosten/s, 'allocation rule'], [/CS=rechthoek.*€600.*PS=rechthoek.*€600/s, 'rectangle-triangle surplus route'], [/welvaartsverlies=1\.350−1\.200=€150/i, 'DWL'], [/Bij Q=41.*€29,50.*€15,25.*bestaande partijen niet/s, 'feasible Pareto improvement'], [/D20 is scoped to Pareto-efficiency in market equilibrium/, 'D20 coverage gap'], [/D1\.18/, 'exam-code coverage D1.18']],
    '2.3.4': [[/Qe=40 en Pe=€40/, 'equilibrium'], [/Bij P=45 is Qd=35 en Qs=50/, 'strictly binding transaction chain'], [/CS=rechthoek.*€600.*PS=rechthoek.*€525.*TS=€1\.125/s, 'rectangle-triangle booking-limit surplus'], [/Welvaartsverlies=1\.200−1\.125=€75/, 'DWL'], [/teken de vraag- en aanbodlijn niet opnieuw/i, 'base-graph instruction'], [/Bij Q=31.*€49.*€35,50.*bestaande partijen te schaden/s, 'retrieved Pareto application'], [/geen norm voor een eerlijke verdeling/i, 'fairness boundary'], [/boekingsgrens, prijs en allocatieregel/, 'booking-limit lesson goal'], [/D1\.18/, 'exam-code coverage D1.18']],
  };
  for (const [id, rules] of Object.entries(checks)) {
    const record = byId.get(id);
    const text = textOf(record);
    for (const [pattern, purpose] of rules) requireMatch(errors, id, text, pattern, purpose);
  }
  const marginalPrompts = new Map((byId.get('2.1.3').target_exercise.subquestions || []).map((question) => [String(question.label), question.prompt || '']));
  requireMatch(errors, '2.1.3', marginalPrompts.get('a') || '', /vul\b.*\btabel\b.*\bwinstkolom/i, 'visible Linea table-completion action');
  requireMatch(errors, '2.1.3', marginalPrompts.get('d') || '', /bereken\b.*\bMK\b.*\bMO\b.*\bvul\b.*\brechter eindpunten/i, 'visible Curva interval-table action');
  const costPrompt = (byId.get('2.1.1').target_exercise.subquestions || []).find((question) => question.label === 'e');
  requireMatch(errors, '2.1.1', (costPrompt || {}).prompt || '', /vergelijk\b.*\bTCK\b.*\bTVK\b.*\bTK\b/i, 'visible total-cost comparison');
  const incomePrompt = (byId.get('2.2.3').target_exercise.subquestions || []).find((question) => question.label === 'd');
  requireMatch(errors, '2.2.3', (incomePrompt || {}).prompt || '', /%ΔQx.*\bEi\b.*classificeer/i, 'visible normal-good Ei operation');
  if (textOf(byId.get('2.1.2')).includes('§1.3.2')) errors.push('2.1.2: stale Book 1 bakery dependency');
  if (/MK=€5, €15 en €25/.test((byId.get('2.1.3').target_exercise.subquestions || []).map((question) => question.prompt).join('\n'))) errors.push('2.1.3: expected Curva MK answers leak into a student prompt');
  if ((byId.get('2.2.1').exam_codes || []).includes('D1.3')) errors.push('2.2.1: stale exam code D1.3');
  if (!/\|−2\|>1/.test((byId.get('2.2.1').short_answer_model || {}).c || '')) errors.push('2.2.1: missing elastic contrast');
  if ((byId.get('2.3.1').target_exercise.context || '').includes('aanbodfunctie') && !/geen aanbodfunctie/.test(byId.get('2.3.1').target_exercise.context)) errors.push('2.3.1: demand-only context is ambiguous');

  const forbiddenSkills = {
    '2.1.2': ['A22', 'A29', 'A40'],
    '2.1.4': ['A22', 'A29', 'A40'],
    '2.3.1': ['A19', 'A30'],
    '2.3.2': ['D20'],
    '2.3.3': ['A32'],
    '2.3.4': ['A32'],
  };
  for (const [id, skills] of Object.entries(forbiddenSkills)) {
    for (const skill of skills) if ((byId.get(id).required_skills || []).includes(skill)) errors.push(`${id}: semantically invalid required skill ${skill}`);
  }
  for (const [id, skill] of [['2.2.1', 'A38'], ['2.2.2', 'A85'], ['2.2.3', 'A15'], ['2.2.4', 'A04'], ['2.2.4', 'A85'], ['2.2.4', 'D06'], ['2.2.4', 'D27'], ['2.3.2', 'D39'], ['2.3.3', 'D20'], ['2.3.4', 'D20']]) {
    if (!(byId.get(id).required_skills || []).includes(skill)) errors.push(`${id}: required skill ${skill} is missing`);
  }
  for (const id of ['2.2.2', '2.2.4']) {
    if ((byId.get(id).required_skills || []).includes('D25')) errors.push(`${id}: D25 must not be cited as coverage for the local Ev/TO rule`);
  }
  for (const id of ['2.2.1', '2.2.2', '2.2.3', '2.2.4']) {
    if ((byId.get(id).exam_codes || []).includes('A2.5')) errors.push(`${id}: A2.5 may not be claimed without a visible percentage-point operation`);
  }
  if (!(byId.get('2.2.2').exam_codes || []).includes('A2.4')) errors.push('2.2.2: A2.4 is required for the visible percentage calculation');
}

function findFailures(input, options = {}) {
  const errors = [];
  const durable = options.durable === true;
  let terminal = false;
  if (durable) {
    const lifecycle = durableLifecycleState(input.meta, input, options);
    errors.push(...lifecycle.failures);
    terminal = input.meta.issue_229_candidate?.approval_status === 'integrated';
  }
  const candidates = input.candidates || [];
  const ids = candidates.map((item) => item.id);
  if (canonical(ids) !== canonical(IDS)) errors.push('candidate package must contain the canonical twelve Book 2 records in order');
  const packageHash = sha256(canonical(candidates));
  if (packageHash !== REVIEWED_PACKAGE_SHA256) errors.push('candidate package must remain the immutable owner-approved package');
  errors.push(...ownerDecision.validateOwnerDecision(input.meta.issue_229_owner_decision));
  errors.push(...ownerDecision.validateEiDecision(input.meta));
  const registryBook2 = (input.registry.exercises || []).filter((item) => item.module === 2);
  if (canonical(registryBook2) !== canonical(candidates)) errors.push('active registry Book 2 records must exactly equal the candidate package');
  if (input.alignment.candidate_package_sha256 !== packageHash) errors.push('alignment candidate package hash is stale');
  validateAlignmentMarkdown(errors, input.alignment, input.alignmentMarkdown || '', packageHash);
  if (!input.meta.issue_229_candidate || input.meta.issue_229_candidate.package_sha256 !== packageHash) errors.push('outline metadata candidate package hash is stale');
  if (canonical((input.alignment.records || []).map((item) => item.id)) !== canonical(IDS)) errors.push('alignment must cover all twelve records in order');

  const candidateHolds = (input.meta.holds || []).filter((hold) => hold.candidate_binding);
  if (!terminal && canonical(candidateHolds.map((hold) => hold.id)) !== canonical(HOLD_IDS)) errors.push('candidate holds must cover all twelve paragraphs in order');
  for (const [index, hold] of candidateHolds.entries()) {
    const binding = hold.candidate_binding;
    if (canonical(Object.keys(binding || {})) !== canonical(CANDIDATE_FIELDS)) errors.push(`${hold.id}: candidate binding fields changed`);
    if (binding && (!candidates[index] || binding.candidate_replacement_sha256 !== sha256(canonical(candidates[index])))) errors.push(`${hold.id}: candidate record hash is stale`);
    if (binding && binding.candidate_package_sha256 !== packageHash) errors.push(`${hold.id}: candidate package hash is stale`);
    if (binding && !ownerDecision.hasApprovedFrozenRecord(input.meta, candidates[index], binding)) errors.push(`${hold.id}: candidate approval must match the immutable owner decision`);
    if (hold.status !== 'open') errors.push(`${hold.id}: candidate hold must remain open before owner approval`);
  }
  const eiHold = (input.meta.holds || []).find((hold) => hold.id === 'H-229-EI-SUPERSESSION');
  if (!eiHold || !eiHold.blocks.includes('target_authority_integration')) errors.push('Ei supersession hold is missing or incomplete');

  const historicalId = 'H-211-TARGET-INTEGRATION';
  const historical = (input.meta.holds || []).find((hold) => hold.id === historicalId);
  const baselineHistorical = (input.baselineMeta.holds || []).find((hold) => hold.id === historicalId);
  if (canonical(historical) !== canonical(baselineHistorical)) errors.push('historical released 2.1.1 target binding/evidence changed');

  if (!durable) {
    const baselineNonBook2 = (input.baselineRegistry.exercises || []).filter((item) => item.module !== 2);
    const currentNonBook2 = (input.registry.exercises || []).filter((item) => item.module !== 2);
    if (canonical(currentNonBook2) !== canonical(baselineNonBook2)) errors.push('a non-Book-2 target record changed');
    const baselineUnits = new Map((input.baselineUnits.units || input.baselineUnits || []).map((unit) => [unit.id, unit]));
    const currentUnits = new Map((input.units.units || input.units || []).map((unit) => [unit.id, unit]));
    for (const [id, unit] of baselineUnits) {
      if (id !== 'A17' && canonical(currentUnits.get(id)) !== canonical(unit)) errors.push(`machine unit ${id} changed outside A17 scope`);
    }
    for (const id of currentUnits.keys()) {
      if (!baselineUnits.has(id)) errors.push(`machine unit ${id} added outside A17 scope`);
    }
  }
  const currentUnits = new Map((input.units.units || input.units || []).map((unit) => [unit.id, unit]));
  const a17 = currentUnits.get('A17');
  const a17Text = textOf(a17);
  if (!/Ei < 0 = inferieur goed, 0 < Ei < 1 = normaal goed, Ei > 1 = luxegoed/.test(a17Text) || /noodzakelijk/i.test(a17Text)) errors.push('A17 does not implement the canonical three-way Ei route');
  if (!/Ei = 0 en Ei = 1 zijn grenswaarden/.test(a17Text)) errors.push('A17 does not preserve Ei=0 and Ei=1 as explicit boundaries');
  if (!/Ei-classificatie voor studentteksten/.test(input.terminology) || !/Gebruik `noodzakelijk goed` niet/.test(input.terminology)) errors.push('authored terminology lacks the explicit Ei decision');
  if (!/Ei = 0 en Ei = 1 zijn grenswaarden/.test(input.unitsMarkdown)) errors.push('A17 Markdown projection is stale');

  validateGenericRecords(errors, candidates, input.alignment);
  validateRecordSpecific(errors, new Map(candidates.map((item) => [item.id, item])));
  return errors;
}

function main() {
  const args = process.argv.slice(2);
  const durable = args.includes('--durable');
  const scopeIndex = args.indexOf('--scope-base');
  if (scopeIndex >= 0 && !args[scopeIndex + 1]) throw new Error('--scope-base requires a commit SHA');
  const failures = findFailures(readInputs({ scopeBase: scopeIndex < 0 ? null : args[scopeIndex + 1] }), { durable });
  if (failures.length > 0) {
    console.error('Book 2 target authority remediation: FAIL');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log('Book 2 target authority remediation: PASS');
  console.log(`- mode: ${durable ? 'durable pending-candidate invariant' : 'Issue #229 sprint-scope proof'}`);
  console.log('- exact candidate records: 12');
  console.log('- goal/question alignment and workload budgets: complete');
  console.log(durable
    ? '- unrelated-record scope checks: delegated to the PR-scoped sprint guard'
    : '- non-Book-2 records and machine units outside A17: unchanged');
}

if (require.main === module) main();

module.exports = { IDS, PATHS, REVIEWED_PACKAGE_SHA256, durableLifecycleState, findFailures, readInputs, sha256 };
