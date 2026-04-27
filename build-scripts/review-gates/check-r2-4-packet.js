#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function fail(message) {
  console.error(`R2.4 packet check failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function assertFileExists(file, label) {
  if (!fs.existsSync(file)) fail(`missing ${label}: ${file}`);
}

const file = process.argv[2];
if (!file) fail('missing packet path');
assertFileExists(file, 'packet JSON');

const packet = readJson(file);

if (packet.sprint_id !== 'R2.4') fail('packet sprint_id must be R2.4');
if (packet.gate_id !== 'GATE-R2-empty-needs') fail('packet gate_id must be GATE-R2-empty-needs');
if (packet.protected_reference_data_changed !== false) {
  fail('packet must declare protected_reference_data_changed: false');
}
if (packet.mutation_authorized !== false) {
  fail('packet must not authorize mutation');
}

for (const source of packet.source_artifacts || []) {
  assertFileExists(source, `source artifact ${source}`);
}

const evidencePaths = [];
function collectEvidence(items) {
  for (const item of items || []) {
    for (const ev of item.evidence || []) evidencePaths.push(ev.path);
  }
}

collectEvidence(packet.candidate_edges);
collectEvidence(packet.a_domain_zero_needs);
collectEvidence(packet.unit_design_decisions);
collectEvidence(packet.labor_market_second_pass?.review_ready_edges);

for (const evidencePath of evidencePaths) {
  assertFileExists(evidencePath, `evidence path ${evidencePath}`);
}

const edgeIds = new Set((packet.candidate_edges || []).map((edge) => edge.id));
for (const required of [
  'edge-A15-needs-A38',
  'edge-A16-needs-A15',
  'edge-A17-needs-A15',
  'edge-D06-needs-A15',
  'edge-D04-needs-A15',
  'edge-D10-needs-D01-D03',
  'edge-D13-needs-D03',
  'edge-D32-needs-D01-D03',
]) {
  if (!edgeIds.has(required)) fail(`missing required candidate edge decision: ${required}`);
}

for (const rejected of ['edge-D10-needs-D01-D03', 'edge-D13-needs-D03', 'edge-D32-needs-D01-D03']) {
  const edge = (packet.candidate_edges || []).find((item) => item.id === rejected);
  if (!edge || edge.status !== 'rejected') fail(`${rejected} must be status rejected`);
}

const d04 = (packet.unit_design_decisions || []).find((item) => item.unit_id === 'D04');
if (!d04 || d04.status !== 'unit_design_required') {
  fail('D04 unit-design decision must be present and unit_design_required');
}

const aDomain = packet.a_domain_zero_needs || [];
const foundational = aDomain.find((item) => (item.unit_ids || []).includes('A38'));
if (!foundational || foundational.recommended_zero_needs_status !== 'underbouw_assumed') {
  fail('foundational A-domain underbouw_assumed decision must include A38');
}

const labor = packet.labor_market_second_pass;
if (!labor || labor.status !== 'completed_as_bounded_packet') {
  fail('labor_market_second_pass must be completed_as_bounded_packet');
}
if (!Array.isArray(labor.review_ready_edges) || labor.review_ready_edges.length < 4) {
  fail('labor second pass must include review-ready edge candidates');
}

const policy = packet.remaining_backlog_policy;
if (!policy || policy.phase_2_sufficient_for_now !== true) {
  fail('remaining_backlog_policy must declare phase_2_sufficient_for_now: true');
}
if (!Array.isArray(policy.blocked_sprints) || !policy.blocked_sprints.includes('R3.2 Apply Reviewed Empty-Needs Corrections')) {
  fail('remaining backlog policy must keep R3.2 blocked');
}

const mdPath = file.replace(/\.json$/i, '.md');
assertFileExists(mdPath, 'packet Markdown companion');
const md = fs.readFileSync(mdPath, 'utf8');
for (const phrase of ['D04 Unit-Design Decision', 'Labor-Market And Unemployment Second Pass', 'No protected reference data changed']) {
  if (!md.includes(phrase)) fail(`packet Markdown missing phrase: ${phrase}`);
}

console.log(`OK R2.4 packet: ${path.normalize(file)}`);
