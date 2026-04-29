#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const CHUNK_FILE = path.join(REPO_ROOT, 'references/data/rag/chunk_index.jsonl');

function normalize(value) {
  return String(value || '').toLowerCase().replace(/_/g, '-');
}

function parseArgs(argv) {
  const args = { json: false, limit: 12 };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') args.json = true;
    else if (arg === '--text') args.text = argv[++i];
    else if (arg === '--unit') args.unit = argv[++i];
    else if (arg === '--term') args.term = argv[++i];
    else if (arg === '--exam-code') args.examCode = argv[++i];
    else if (arg === '--quality-issue') args.qualityIssue = argv[++i];
    else if (arg === '--limit') args.limit = Number(argv[++i]);
  }
  return args;
}

function loadChunks() {
  return fs.readFileSync(CHUNK_FILE, 'utf8')
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const STOP_WORDS = new Set([
  'welke',
  'hebben',
  'heeft',
  'voor',
  'zijn',
  'worden',
  'komt',
  'alleen',
  'informatie',
  'testen',
  'ondersteunen',
  'missen',
  'maar',
  'nog',
  'met',
  'uit',
  'een',
  'het',
  'de',
  'dat',
  'die',
  'wat',
  'waar',
]);

function textTerms(text) {
  return normalize(text)
    .replace(/[^a-z0-9.-]+/g, ' ')
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 4 && !STOP_WORDS.has(term));
}

function hasAny(hay, terms) {
  return terms.some((term) => hay.includes(term));
}

function scoreChunk(chunk, args) {
  let score = 0;
  const hay = normalize(`${chunk.chunk_id} ${chunk.text} ${(chunk.entity_ids || []).join(' ')} ${(chunk.evidence_ids || []).join(' ')}`);
  const entities = (chunk.entity_ids || []).map(normalize);
  if (args.text) {
    const query = normalize(args.text);
    const terms = textTerms(args.text);
    const qualityQuery = hasAny(query, ['term-links', 'term links', 'empty-needs', 'lege needs', 'false-zero', 'false_zero', 'deprecated', 'generated reports', 'generated-report', 'missing-unit']);
    if (terms.length > 0) {
      for (const term of terms) {
        if (entities.includes(term)) score += 18;
        if (chunk.chunk_id.includes(term)) score += 14;
        if (hay.includes(term)) score += 8;
      }
      const phrase = terms.join(' ');
      if (phrase.length > 8 && hay.includes(phrase)) score += 25;
    }
    if (hasAny(query, ['examenvragen', 'examvragen', 'examenvraag']) && chunk.source_type === 'exam_question' && score > 0) score += 68;
    if (!qualityQuery && score > 0 && chunk.source_type === 'machine_unit') score += 34;
    if (!qualityQuery && query.includes('units') && chunk.source_type === 'machine_unit') score += 18;
    if (hasAny(query, ['begrippen', 'begrip']) && chunk.source_type === 'machine_term') score += 14;
    if (hasAny(query, ['target-exercises', 'target exercises', 'target', 'missing-unit']) && chunk.source_type === 'target_exercise') score += 14;
    if (hasAny(query, ['term-links', 'term links', 'empty-needs', 'lege needs', 'false-zero', 'false_zero', 'deprecated', 'generated reports', 'generated-report']) && chunk.source_type === 'quality_report') score += 20;
    if (hasAny(query, ['target-exercises', 'target exercises', 'target', 'missing-unit']) && chunk.source_type === 'quality_report' && chunk.chunk_id.includes('blueprint-flag-triage')) score += 90;
    if (hasAny(query, ['diagnostic-only', 'diagnostic_only', 'pending-review', 'pending_review', 'edges', 'graph']) && chunk.source_type === 'alignment_edge') score += 18;
    if (hasAny(query, ['owned', 'content', 'paragraph', 'paragraaf', 'blueprint', 'projection', 'projectie']) && chunk.source_type === 'owned_content_edge') score += 24;
    if (hasAny(query, ['owned exercise', 'owned-exercise']) && chunk.source_type === 'owned_content_edge' && (chunk.edge_statuses || []).includes('owned_exercise_evidence')) score += 32;
    if (hasAny(query, ['diagnostic-only', 'diagnostic_only']) && (chunk.edge_statuses || []).includes('diagnostic_only')) score += 30;
    if (hasAny(query, ['pending-review', 'pending_review']) && (chunk.edge_statuses || []).includes('pending_review')) score += 30;
    if (hasAny(query, ['generated reports', 'generated-report', 'generated']) && chunk.authority_level === 'generated_report') score += 30;
  }
  if (args.unit) {
    const unit = normalize(args.unit);
    if (entities.includes(unit)) score += 50;
    if (chunk.chunk_id.includes(unit)) score += 40;
    if (hay.includes(unit)) score += 15;
    if (chunk.source_type === 'alignment_edge' && hay.includes(`unit:${unit}`)) score += 30;
  }
  if (args.term) {
    const term = normalize(args.term);
    if (entities.includes(term)) score += 50;
    if (chunk.chunk_id.includes(term)) score += 40;
    if (hay.includes(term)) score += 20;
    if (score > 0 && chunk.source_type === 'machine_term') score += 10;
  }
  if (args.examCode) {
    const code = normalize(args.examCode);
    if (entities.includes(code)) score += 55;
    if (hay.includes(code)) score += 25;
    if (chunk.source_type === 'exam_question') score += 10;
  }
  if (args.qualityIssue) {
    const issue = normalize(args.qualityIssue);
    if (hay.includes(issue)) score += 40;
    if (chunk.source_type === 'quality_report') score += 20;
    if (chunk.authority_level === 'generated_report') score += 5;
  }
  return score;
}

function resultFor(chunk, score) {
  const generatedReport = chunk.authority_level === 'generated_report' || chunk.source_type === 'quality_report';
  const generatedArtifact = (chunk.edge_statuses || []).includes('generated_artifact_warning');
  const diagnosticOnly = (chunk.edge_statuses || []).includes('diagnostic_only') || chunk.authority_level === 'diagnostic' || generatedReport || generatedArtifact;
  const pendingReview = (chunk.edge_statuses || []).includes('pending_review');
  return {
    chunk_id: chunk.chunk_id,
    score,
    source_path: chunk.source_path,
    source_type: chunk.source_type,
    authority_level: chunk.authority_level,
    entity_ids: chunk.entity_ids,
    evidence_ids: chunk.evidence_ids,
    edge_statuses: chunk.edge_statuses,
    diagnostic_only: diagnosticOnly,
    pending_review: pendingReview,
    generated_report_warning: generatedReport,
    generated_artifact_warning: generatedArtifact,
    not_primary_evidence: generatedReport || chunk.primary_evidence === false,
    curriculum_authority: chunk.curriculum_authority === true,
    allowed_for_public_citation: chunk.allowed_for_public_citation === true,
    text_excerpt: chunk.text.slice(0, 500),
  };
}

function runQuery(args) {
  const chunks = loadChunks();
  const results = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, args) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.chunk.chunk_id.localeCompare(b.chunk.chunk_id))
    .slice(0, args.limit)
    .map((item) => resultFor(item.chunk, item.score));
  return {
    generated_by: 'build-scripts/rag/query.js',
    generated_on: new Date().toISOString(),
    query: {
      text: args.text || null,
      unit: args.unit || null,
      term: args.term || null,
      exam_code: args.examCode || null,
      quality_issue: args.qualityIssue || null,
    },
    result_count: results.length,
    results,
  };
}

function printText(output) {
  console.log(`# Retrieval results (${output.result_count})`);
  for (const item of output.results) {
    console.log(`\n- ${item.chunk_id} [score ${item.score}]`);
    console.log(`  source: ${item.source_path} (${item.source_type}, ${item.authority_level})`);
    console.log(`  entities: ${(item.entity_ids || []).join(', ') || '-'}`);
    console.log(`  evidence: ${(item.evidence_ids || []).join(', ') || '-'}`);
    console.log(`  edge_status: ${(item.edge_statuses || []).join(', ') || '-'}`);
    if (item.diagnostic_only || item.generated_report_warning) {
      console.log(`  diagnostic_only: ${item.diagnostic_only}`);
      console.log(`  not_primary_evidence: ${item.not_primary_evidence}`);
    }
    console.log(`  ${item.text_excerpt}`);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.text && !args.unit && !args.term && !args.examCode && !args.qualityIssue) {
    console.error('Usage: query.js --text "vraag" | --unit A15 | --term prijselasticiteit_van_de_vraag | --exam-code A2.5 | --quality-issue empty-needs [--json]');
    process.exit(1);
  }
  const output = runQuery(args);
  if (args.json) console.log(JSON.stringify(output, null, 2));
  else printText(output);
}

if (require.main === module) main();

module.exports = { runQuery, parseArgs };
