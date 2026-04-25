#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const GATE_DIR = 'reports/review-gates/GATE-R2-empty-needs';
const AUDIT_PATH = 'references/data/audits/empty-needs-audit.json';
const REVIEW_PACKET = `${GATE_DIR}/review-packet.md`;
const SUBAGENT_FILES = [
  `${GATE_DIR}/subagent-pedagogy.json`,
  `${GATE_DIR}/subagent-data-integrity.json`,
  `${GATE_DIR}/subagent-evidence.json`,
];

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(REPO_ROOT, relPath), 'utf8'));
}

function write(relPath, text) {
  const full = path.join(REPO_ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text);
}

function loadSubagents() {
  return SUBAGENT_FILES.map((file) => {
    const full = path.join(REPO_ROOT, file);
    if (!fs.existsSync(full)) return { file, missing: true };
    return { file, ...readJson(file) };
  });
}

function renderList(items) {
  if (!items || !items.length) return '- none recorded';
  return items.map((item) => `- ${typeof item === 'string' ? item : JSON.stringify(item)}`).join('\n');
}

function main() {
  const audit = readJson(AUDIT_PATH);
  const subagents = loadSubagents();
  const high = audit.entries.filter((entry) => entry.severity === 'high');
  const falseZero = audit.entries.filter((entry) => entry.recommended_status === 'false_zero');
  const ambiguous = audit.entries.filter((entry) => entry.recommended_status === 'ambiguous');

  const sections = subagents.map((review) => {
    if (review.missing) {
      return `## ${review.file}\n\nMissing.`;
    }
    return `## ${review.reviewer}\n\nSource: \`${review.file}\`\n\n### Findings\n\n${renderList(review.findings)}\n\n### Human Questions\n\n${renderList(review.human_questions)}\n\n### Residual Risks\n\n${renderList(review.residual_risks)}`;
  }).join('\n\n');

  const packet = `# GATE-R2 Empty-Needs Review Packet

Generated: ${new Date().toISOString()}
Sprint: R2.2
Audit source: \`${AUDIT_PATH}\`

## Audit Summary

- Live units: ${audit.live_unit_count}
- Empty-needs units: ${audit.empty_needs_count}
- False-zero machine suggestions: ${falseZero.length}
- Ambiguous machine suggestions: ${ambiguous.length}
- High-severity machine suggestions: ${high.length}

## Human Review Required

R2.3 must decide whether the empty-needs gate is:

- \`pass\`
- \`pass_with_conditions\`
- \`hold\`
- \`fail\`

No dependency corrections may be applied until the human review closes or conditions this gate.

## Priority Human Questions

1. Should known false-zero candidates be accepted as dependency corrections, rejected, or held for stronger evidence?
2. Should foundational A-domain math units be classified as \`underbouw_assumed\` rather than given internal platform prerequisites?
3. Which ambiguous applied non-A units require a second pedagogical pass before any graph work depends on them?

${sections}
`;

  write(REVIEW_PACKET, packet);
  console.log(`OK review packet: ${REVIEW_PACKET}`);
}

if (require.main === module) main();
