#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GATE_DIR = path.join(REPO_ROOT, 'reports/review-gates/GATE-R7-rag');

function fail(message) {
  console.error(`RAG review packet validation failed: ${message}`);
  process.exit(1);
}

function readJson(relPath) {
  const file = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(file)) fail(`missing ${relPath}`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON ${relPath}: ${error.message}`);
  }
}

function mustExist(relPath) {
  if (!fs.existsSync(path.join(REPO_ROOT, relPath))) fail(`missing ${relPath}`);
}

function includesAll(values, required, label) {
  if (!Array.isArray(values)) fail(`${label} must be an array`);
  for (const item of required) {
    if (!values.includes(item)) fail(`${label} missing ${item}`);
  }
}

function main() {
  const requiredFiles = [
    'reports/review-gates/GATE-R7-rag/review-packet.md',
    'reports/review-gates/GATE-R7-rag/review-packet.json',
    'reports/review-gates/GATE-R7-rag/subagent-rag-retrieval.json',
    'reports/review-gates/GATE-R7-rag/subagent-authority-ranking.json',
    'reports/review-gates/GATE-R7-rag/subagent-evidence-surfacing.json',
    'reports/review-gates/GATE-R7-rag/subagent-summary.md',
  ];
  for (const file of requiredFiles) mustExist(file);

  const packet = readJson('reports/review-gates/GATE-R7-rag/review-packet.json');
  if (packet.gate_id !== 'GATE-R7-rag') fail('wrong gate_id');
  if (packet.packet_status !== 'prepared_for_review') fail('packet_status must be prepared_for_review');
  if (packet.gate_closure_status !== 'not_closed') fail('gate_closure_status must be not_closed');
  if (packet.proposed_gate_status !== 'pass_with_conditions') fail('expected proposed pass_with_conditions status');
  if (!packet.retrieval_eval_summary || packet.retrieval_eval_summary.fail_count !== 0) fail('retrieval eval summary must have zero failures');
  if (packet.retrieval_eval_summary.authority_violation_count !== 0) fail('authority violations must be zero');

  includesAll(packet.proposed_allowed_downstream_uses, [
    'internal_retrieval_development',
    'retrieval_evaluation',
    'reference_health_reports',
  ], 'proposed_allowed_downstream_uses');
  includesAll(packet.proposed_blocked_downstream_uses, [
    'student_diagnostics',
    'adaptive_routing',
    'student_facing_ai',
    'automatic_mastery_decisions',
    'summative_assessment_decisions',
  ], 'proposed_blocked_downstream_uses');

  if (!Array.isArray(packet.review_questions) || packet.review_questions.length < 8) fail('expected at least eight review questions');
  for (const lens of [
    'subagent-rag-retrieval.json',
    'subagent-authority-ranking.json',
    'subagent-evidence-surfacing.json',
  ]) {
    const data = JSON.parse(fs.readFileSync(path.join(GATE_DIR, lens), 'utf8'));
    if (data.verdict !== 'pass_with_conditions') fail(`${lens} must propose pass_with_conditions`);
    if (!Array.isArray(data.findings) || data.findings.length === 0) fail(`${lens} must include findings`);
  }

  const md = fs.readFileSync(path.join(GATE_DIR, 'review-packet.md'), 'utf8');
  for (const phrase of [
    'Authority Handling',
    'Diagnostic-Only Handling',
    'Pending-Review Handling',
    'Evidence-Anchor Surfacing',
    'Known Failures And Limits',
    'Proposed Allowed Downstream Uses',
    'Proposed Blocked Downstream Uses',
    'Review Questions',
  ]) {
    if (!md.includes(phrase)) fail(`review packet missing section: ${phrase}`);
  }

  const closurePath = path.join(GATE_DIR, 'gate-closure.json');
  if (fs.existsSync(closurePath)) {
    const closure = JSON.parse(fs.readFileSync(closurePath, 'utf8'));
    if (closure.status === 'draft_not_closed') {
      console.log('OK RAG review packet');
      return;
    }
    if (closure.gate_id !== 'GATE-R7-rag') fail('gate-closure.json has wrong gate_id');
    if (!['pass', 'pass_with_conditions', 'hold', 'fail'].includes(closure.status)) {
      fail('gate-closure.json has invalid final status');
    }
    if (closure.closure_confirmed_by_human !== true) {
      fail('final gate-closure.json must have closure_confirmed_by_human=true');
    }
    if (!closure.human_interview || !fs.existsSync(path.join(REPO_ROOT, closure.human_interview))) {
      fail('final gate-closure.json must reference an existing human interview');
    }
  }

  console.log('OK RAG review packet');
}

if (require.main === module) main();
