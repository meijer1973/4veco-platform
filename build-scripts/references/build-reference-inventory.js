#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Add inventory roots in INVENTORY_ROOTS when a new reference-adjacent
 *   surface becomes part of reference governance.
 * - Keep generated files under references/data/.
 * - Do not use this script to mutate references/machine/ or references/external/.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SOURCE_MANIFEST = 'references/data/source_manifest.json';
const DOCUMENT_INVENTORY = 'references/data/document_inventory.json';
const INVENTORY_ROOTS = [
  'references',
  'reports',
  'build-scripts/references',
  'build-scripts/reports',
];
const SELF_GENERATED = new Set([SOURCE_MANIFEST, DOCUMENT_INVENTORY]);

function slashPath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function rel(filePath) {
  return slashPath(path.relative(REPO_ROOT, filePath));
}

function walkFiles(rootRel) {
  const root = path.join(REPO_ROOT, rootRel);
  if (!fs.existsSync(root)) return [];
  const out = [];
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile()) {
        out.push(full);
      }
    }
  }
  return out.sort((a, b) => rel(a).localeCompare(rel(b)));
}

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function ext(pathRel) {
  const value = path.extname(pathRel).replace(/^\./, '');
  return value || 'none';
}

function isGenerated(pathRel) {
  return (
    pathRel.startsWith('reports/') ||
    pathRel.startsWith('references/data/') ||
    pathRel.endsWith('.json') && pathRel.includes('/sprints/')
  );
}

function classify(pathRel) {
  if (pathRel.startsWith('references/external/')) {
    return {
      layer: 'external_authority',
      authority_level: 'external_primary',
      source_type: pathRel.endsWith('.pdf') ? 'external_pdf' : 'external_reference',
      generated_status: 'mirrored_or_extracted',
      edit_policy: 'external_refresh_only',
      owner: 'references_team',
      refresh_policy: 'refresh_from_external_authority',
      downstream_dependencies: ['reports', 'reference-qc', 'future-evidence-anchors'],
    };
  }
  if (pathRel.startsWith('references/machine/')) {
    return {
      layer: 'machine_registry',
      authority_level: 'machine_registry',
      source_type: pathRel.endsWith('.json') ? 'machine_json' : 'machine_projection',
      generated_status: pathRel.endsWith('.json') ? 'machine_consumed_projection' : 'machine_authored_projection',
      edit_policy: 'cli_only',
      owner: 'references_team',
      refresh_policy: 'reference_cli',
      downstream_dependencies: ['reports', 'lesson-production', 'dashboards', 'future-alignment-graph'],
    };
  }
  if (pathRel.startsWith('references/authored/')) {
    return {
      layer: 'authored_judgement',
      authority_level: 'authored_judgement',
      source_type: ext(pathRel) === 'json' ? 'authored_json' : 'authored_markdown',
      generated_status: 'manual_source',
      edit_policy: 'human_reviewed_edit',
      owner: 'references_team',
      refresh_policy: 'manual_review',
      downstream_dependencies: ['reports', 'planning', 'future-migration'],
    };
  }
  if (pathRel.startsWith('references/qc-prompts/')) {
    return {
      layer: 'quality_protocol',
      authority_level: 'authored_judgement',
      source_type: 'qc_prompt',
      generated_status: 'manual_source',
      edit_policy: 'human_reviewed_edit',
      owner: 'references_team',
      refresh_policy: 'manual_review',
      downstream_dependencies: ['qc-runs', 'review-gates'],
    };
  }
  if (pathRel === 'references/SOURCE_OF_TRUTH.md') {
    return {
      layer: 'governance_policy',
      authority_level: 'authored_judgement',
      source_type: 'source_of_truth_policy',
      generated_status: 'manual_source',
      edit_policy: 'human_reviewed_edit',
      owner: 'references_team',
      refresh_policy: 'roadmap_update',
      downstream_dependencies: ['schemas', 'validators', 'review-gates'],
    };
  }
  if (pathRel.startsWith('references/data/')) {
    return {
      layer: 'governance_data',
      authority_level: 'generated_report',
      source_type: pathRel.includes('/sprints/') ? 'sprint_metadata' : 'inventory',
      generated_status: 'generated_or_sprint_metadata',
      edit_policy: pathRel.includes('/sprints/') ? 'sprint_process' : 'generated_by_inventory_script',
      owner: 'references_team',
      refresh_policy: pathRel.includes('/sprints/') ? 'sprint_lifecycle' : 'regenerate',
      downstream_dependencies: ['roadmap', 'dashboards', 'future-validators'],
    };
  }
  if (pathRel === 'references/reference-team-roadmap.md') {
    return {
      layer: 'planning',
      authority_level: 'authored_judgement',
      source_type: 'roadmap',
      generated_status: 'manual_source',
      edit_policy: 'human_reviewed_edit',
      owner: 'references_team',
      refresh_policy: 'roadmap_update',
      downstream_dependencies: ['internal-dashboard', 'sprint-planning'],
    };
  }
  if (pathRel.startsWith('reports/')) {
    return {
      layer: 'generated_report',
      authority_level: 'generated_report',
      source_type: pathRel.endsWith('.html') ? 'dashboard_html' : `report_${ext(pathRel)}`,
      generated_status: 'generated_projection',
      edit_policy: 'generated_by_script',
      owner: 'platform_team',
      refresh_policy: 'regenerate',
      downstream_dependencies: ['dashboards', 'planning', 'qc-review'],
    };
  }
  if (pathRel.startsWith('build-scripts/references/')) {
    return {
      layer: 'reference_tooling',
      authority_level: 'tooling',
      source_type: ext(pathRel) === 'js' ? 'reference_cli_script' : 'reference_tool_data',
      generated_status: 'manual_source',
      edit_policy: 'code_review',
      owner: 'platform_team',
      refresh_policy: 'code_change',
      downstream_dependencies: ['reference-cli', 'reports', 'validators'],
    };
  }
  if (pathRel.startsWith('build-scripts/reports/')) {
    return {
      layer: 'report_tooling',
      authority_level: 'tooling',
      source_type: 'report_generator',
      generated_status: 'manual_source',
      edit_policy: 'code_review',
      owner: 'platform_team',
      refresh_policy: 'code_change',
      downstream_dependencies: ['reports', 'dashboards'],
    };
  }
  return {
    layer: 'unclassified',
    authority_level: 'unknown',
    source_type: `file_${ext(pathRel)}`,
    generated_status: isGenerated(pathRel) ? 'generated_projection' : 'manual_source',
    edit_policy: 'review_required',
    owner: 'references_team',
    refresh_policy: 'review_required',
    downstream_dependencies: [],
  };
}

function entryFor(filePath) {
  const pathRel = rel(filePath);
  const stats = fs.statSync(filePath);
  const base = classify(pathRel);
  const selfGenerated = SELF_GENERATED.has(pathRel);
  return {
    path: pathRel,
    file_name: path.basename(pathRel),
    extension: ext(pathRel),
    size_bytes: selfGenerated ? null : stats.size,
    sha256: selfGenerated ? null : sha256(filePath),
    ...base,
    self_generated_inventory_file: selfGenerated,
  };
}

function buildEntries(roots) {
  const seen = new Map();
  for (const root of roots) {
    for (const file of walkFiles(root)) {
      seen.set(rel(file), entryFor(file));
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.path.localeCompare(b.path));
}

function summarize(entries) {
  const byLayer = {};
  const byEditPolicy = {};
  for (const entry of entries) {
    byLayer[entry.layer] = (byLayer[entry.layer] || 0) + 1;
    byEditPolicy[entry.edit_policy] = (byEditPolicy[entry.edit_policy] || 0) + 1;
  }
  return {
    file_count: entries.length,
    by_layer: byLayer,
    by_edit_policy: byEditPolicy,
  };
}

function writeJson(pathRel, data) {
  const full = path.join(REPO_ROOT, pathRel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, `${JSON.stringify(data, null, 2)}\n`);
}

function main() {
  const referencesEntries = buildEntries(['references']);
  const documentEntries = buildEntries(INVENTORY_ROOTS);
  const generatedAt = new Date().toISOString();

  writeJson(SOURCE_MANIFEST, {
    schema_version: '0.1',
    generated_at: generatedAt,
    sprint_id: 'R0.2',
    scope: 'references/',
    note: 'Self-generated inventory files intentionally omit size and sha256 to avoid unstable self-checksums.',
    summary: summarize(referencesEntries),
    files: referencesEntries,
  });

  writeJson(DOCUMENT_INVENTORY, {
    schema_version: '0.1',
    generated_at: generatedAt,
    sprint_id: 'R0.2',
    scope: INVENTORY_ROOTS,
    note: 'Inventory covers reference sources, generated reports, and reference/report tooling.',
    summary: summarize(documentEntries),
    files: documentEntries,
  });

  console.log(`OK source manifest: ${SOURCE_MANIFEST} (${referencesEntries.length} files)`);
  console.log(`OK document inventory: ${DOCUMENT_INVENTORY} (${documentEntries.length} files)`);
}

if (require.main === module) main();

module.exports = {
  buildEntries,
  classify,
  INVENTORY_ROOTS,
  SOURCE_MANIFEST,
  DOCUMENT_INVENTORY,
};
