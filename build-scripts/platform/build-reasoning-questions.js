#!/usr/bin/env node
/**
 * build-reasoning-questions.js
 *
 * Validates a reasoning game CSV file and wraps it into a JS data file
 * for use with the reasoning engine.
 *
 * Usage:
 *   node build-scripts/build-reasoning-questions.js <parNr> <domain> <csvPath>
 *
 * Example:
 *   node build-scripts/build-reasoning-questions.js 3.1.1 economics questions/3.1.1.csv
 *
 * HOW TO ADAPT:
 * - Provide a semicolon-delimited CSV with the required columns
 * - Domain must be: arithmetic, economics, or math-economics
 * - Output goes to shared/reasoning/<parNr>.js
 */

const fs = require('fs');
const path = require('path');

const MODULE_ROOT = process.env.MODULE_ROOT
    ? path.resolve(process.env.MODULE_ROOT)
    : path.resolve(__dirname, '../..');
const OUTPUT_DIR = path.join(MODULE_ROOT, 'shared', 'reasoning');

// Paragraph names (discover from directory)
function findParName(parNr) {
    function walk(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory() && entry.name.startsWith(parNr + ' ')) {
                const nameMatch = entry.name.match(/- (.+)$/);
                return nameMatch ? nameMatch[1] : parNr;
            }
            if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.startsWith('node_')) {
                const result = walk(path.join(dir, entry.name));
                if (result) return result;
            }
        }
        return null;
    }
    return walk(MODULE_ROOT) || parNr;
}

// Required CSV columns
const REQUIRED_COLUMNS = [
    'id', 'structure_type', 'structure_label', 'problem_text',
    'step_1_label', 'step_1_detail', 'step_2_label', 'step_2_detail',
    'step_3_label', 'step_3_detail',
    'distractor_1_label', 'distractor_1_detail',
    'distractor_2_label', 'distractor_2_detail',
    'distractor_3_label', 'distractor_3_detail',
    'subq_1', 'subq_2', 'subq_3', 'subq_distractor_1', 'subq_distractor_2',
    'error_step_index', 'error_wrong_label', 'error_wrong_detail',
    'flow_1_type', 'flow_1_text', 'flow_2_type', 'flow_2_text',
    'flow_3_type', 'flow_3_text', 'flow_4_type', 'flow_4_text',
    'flow_5_type', 'flow_5_text'
];

const VALID_DOMAINS = ['arithmetic', 'economics', 'math-economics'];

const VALID_FLOW_TYPES = {
    'arithmetic': ['given', 'operation'],
    'economics': ['cause', 'reasoning', 'effect'],
    'math-economics': ['given', 'step', 'result']
};

function parseLine(line) {
    var fields = [];
    var current = '';
    var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
        var ch = line[i];
        if (inQuotes) {
            if (ch === '"') {
                if (i + 1 < line.length && line[i + 1] === '"') { current += '"'; i++; }
                else inQuotes = false;
            } else current += ch;
        } else {
            if (ch === '"') inQuotes = true;
            else if (ch === ';') { fields.push(current.trim()); current = ''; }
            else current += ch;
        }
    }
    fields.push(current.trim());
    return fields;
}

function validate(csvContent, domain) {
    const lines = csvContent.trim().split('\n');
    const errors = [];
    const warnings = [];

    if (lines.length < 2) {
        errors.push('CSV must have at least a header row and one data row.');
        return { errors, warnings };
    }

    const headers = parseLine(lines[0]);

    // Check required columns
    for (const col of REQUIRED_COLUMNS) {
        if (!headers.includes(col)) {
            errors.push('Missing required column: ' + col);
        }
    }

    // Check formula columns for math-economics
    if (domain === 'math-economics') {
        const formulaCols = ['step_1_formula', 'step_2_formula', 'step_3_formula'];
        for (const col of formulaCols) {
            if (!headers.includes(col)) {
                warnings.push('Math-economics domain should have column: ' + col);
            }
        }
    }

    if (errors.length > 0) return { errors, warnings };

    // Parse rows
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const values = parseLine(line);
        const row = {};
        for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = (j < values.length) ? values[j] : '';
        }
        rows.push({ row, lineNum: i + 1 });
    }

    // Check minimum problems
    if (rows.length < 6) {
        errors.push('Need at least 6 problems (found ' + rows.length + '). Match mode requires 3 structure types × 2 problems each.');
    }

    // Check structure types
    const structureTypes = {};
    for (const { row, lineNum } of rows) {
        const st = row.structure_type;
        if (!st) errors.push('Line ' + lineNum + ': empty structure_type');
        else {
            if (!structureTypes[st]) structureTypes[st] = [];
            structureTypes[st].push(lineNum);
        }
    }

    const typeKeys = Object.keys(structureTypes);
    if (typeKeys.length < 3) {
        errors.push('Need at least 3 distinct structure_type values (found ' + typeKeys.length + '). Match mode requires 3 types.');
    }

    for (const type of typeKeys) {
        if (structureTypes[type].length < 2) {
            errors.push('Structure type "' + type + '" has only ' + structureTypes[type].length + ' problem(s). Need at least 2 for Match mode.');
        }
    }

    // Check each row
    const validFlowTypes = VALID_FLOW_TYPES[domain] || [];
    for (const { row, lineNum } of rows) {
        // Check required fields not empty
        for (const col of REQUIRED_COLUMNS) {
            if (!row[col] && col !== 'flow_6_type' && col !== 'flow_6_text') {
                errors.push('Line ' + lineNum + ': empty required field "' + col + '"');
            }
        }

        // Check error_step_index
        const esi = parseInt(row.error_step_index);
        if (isNaN(esi) || esi < 1 || esi > 3) {
            errors.push('Line ' + lineNum + ': error_step_index must be 1, 2, or 3 (got "' + row.error_step_index + '")');
        }

        // Check flow types
        for (let fi = 1; fi <= 6; fi++) {
            const ftype = row['flow_' + fi + '_type'];
            if (ftype && validFlowTypes.length > 0 && !validFlowTypes.includes(ftype)) {
                errors.push('Line ' + lineNum + ': flow_' + fi + '_type "' + ftype + '" not valid for domain "' + domain + '". Expected: ' + validFlowTypes.join(', '));
            }
        }

        // Check math-economics has formulas
        if (domain === 'math-economics') {
            let hasFormula = false;
            for (let si = 1; si <= 3; si++) {
                if (row['step_' + si + '_formula']) hasFormula = true;
            }
            if (!hasFormula) {
                warnings.push('Line ' + lineNum + ': math-economics problem has no formula fields');
            }
        }

        // ── Distractor quality checks ──────────────────────────────
        // Check distractor labels differ from correct step labels
        const correctLabels = [row.step_1_label, row.step_2_label, row.step_3_label];
        for (let di = 1; di <= 3; di++) {
            const dLabel = row['distractor_' + di + '_label'];
            if (dLabel && correctLabels.includes(dLabel)) {
                warnings.push('Line ' + lineNum + ': distractor_' + di + '_label is identical to a correct step label ("' + dLabel + '")');
            }
        }

        // Check error_wrong step differs from the correct step it replaces
        const esiVal = parseInt(row.error_step_index);
        if (esiVal >= 1 && esiVal <= 3) {
            const correctLabel = row['step_' + esiVal + '_label'];
            const wrongLabel = row.error_wrong_label;
            if (correctLabel && wrongLabel && correctLabel === wrongLabel) {
                errors.push('Line ' + lineNum + ': error_wrong_label is identical to the correct step_' + esiVal + '_label ("' + wrongLabel + '")');
            }
        }

        // Check flow type progression (cause/given should come before effect/result)
        if (domain === 'economics') {
            const flowTypes = [];
            for (let fi = 1; fi <= 6; fi++) {
                const ft = row['flow_' + fi + '_type'];
                if (ft) flowTypes.push(ft);
            }
            const lastCauseIdx = flowTypes.lastIndexOf('cause');
            const firstEffectIdx = flowTypes.indexOf('effect');
            if (lastCauseIdx >= 0 && firstEffectIdx >= 0 && lastCauseIdx > firstEffectIdx) {
                warnings.push('Line ' + lineNum + ': flow diagram has "cause" block after "effect" block — check ordering');
            }
        }

        // Check sub-question distractors differ from correct sub-questions
        const correctSubqs = [row.subq_1, row.subq_2, row.subq_3];
        for (let sdi = 1; sdi <= 2; sdi++) {
            const sdText = row['subq_distractor_' + sdi];
            if (sdText && correctSubqs.includes(sdText)) {
                errors.push('Line ' + lineNum + ': subq_distractor_' + sdi + ' is identical to a correct sub-question');
            }
        }
    }

    return { errors, warnings, rowCount: rows.length, structureTypes: typeKeys };
}

/**
 * Generate a review document for economics content validation.
 * This document is designed to be reviewed by Claude Code subagent.
 */
function generateReviewDocument(csvContent, parNr, domain) {
    const lines = csvContent.trim().split('\n');
    const headers = parseLine(lines[0]);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const values = parseLine(line);
        const row = {};
        for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = (j < values.length) ? values[j] : '';
        }
        rows.push(row);
    }

    let doc = '# Economische Review — ' + parNr + ' (domein: ' + domain + ')\n\n';
    doc += 'Controleer elke vraag op economische correctheid voor VWO bovenbouw.\n';
    doc += 'Let specifiek op: marktvormclassificatie (homogeen/heterogeen oligopolie vs. monopolistische concurrentie),\n';
    doc += 'logische consistentie van redeneerstappen, kwaliteit van afleidingsmanoeuvres.\n\n';
    doc += '---\n\n';

    for (const row of rows) {
        doc += '## Vraag ' + row.id + ' (structuur: ' + row.structure_type + ' — ' + row.structure_label + ')\n\n';
        doc += '**Context:** ' + row.problem_text + '\n\n';
        doc += '**Correcte stappen:**\n';
        doc += '1. ' + row.step_1_label + ' — ' + row.step_1_detail + '\n';
        doc += '2. ' + row.step_2_label + ' — ' + row.step_2_detail + '\n';
        doc += '3. ' + row.step_3_label + ' — ' + row.step_3_detail + '\n\n';
        doc += '**Afleidingsmanoeuvres:**\n';
        doc += '- D1: ' + row.distractor_1_label + ' — ' + row.distractor_1_detail + '\n';
        doc += '- D2: ' + row.distractor_2_label + ' — ' + row.distractor_2_detail + '\n';
        doc += '- D3: ' + row.distractor_3_label + ' — ' + row.distractor_3_detail + '\n\n';
        doc += '**Deelvragen:** ' + row.subq_1 + ' → ' + row.subq_2 + ' → ' + row.subq_3 + '\n';
        doc += '**Deelvraag-distractors:** ' + row.subq_distractor_1 + ' | ' + row.subq_distractor_2 + '\n\n';
        doc += '**Foutstap (vervangt stap ' + row.error_step_index + '):** ' + row.error_wrong_label + ' — ' + row.error_wrong_detail + '\n\n';
        doc += '---\n\n';
    }

    return doc;
}

function main() {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.log('Usage: node build-reasoning-questions.js <parNr> <domain> <csvPath> [--generate-review]');
        console.log('');
        console.log('Arguments:');
        console.log('  parNr   — Paragraph number (e.g. 3.1.1)');
        console.log('  domain  — arithmetic | economics | math-economics');
        console.log('  csvPath — Path to the CSV file');
        console.log('');
        console.log('Flags:');
        console.log('  --generate-review  Generate a review document for economics content validation');
        console.log('');
        console.log('Example:');
        console.log('  node build-scripts/build-reasoning-questions.js 3.1.1 economics questions/3.1.1.csv');
        process.exit(1);
    }

    const flagArgs = args.filter(a => a.startsWith('--'));
    const posArgs = args.filter(a => !a.startsWith('--'));
    const [parNr, domain, csvPath] = posArgs;
    const generateReview = flagArgs.includes('--generate-review');

    // Validate domain
    if (!VALID_DOMAINS.includes(domain)) {
        console.error('Invalid domain: ' + domain + '. Must be: ' + VALID_DOMAINS.join(', '));
        process.exit(1);
    }

    // Read CSV
    const fullPath = path.resolve(csvPath);
    if (!fs.existsSync(fullPath)) {
        console.error('CSV file not found: ' + fullPath);
        process.exit(1);
    }

    const csvContent = fs.readFileSync(fullPath, 'utf8');
    console.log('Validating CSV for ' + parNr + ' (domain: ' + domain + ')...\n');

    const result = validate(csvContent, domain);

    // Report warnings
    for (const w of result.warnings) {
        console.warn('  \u26A0 WARNING: ' + w);
    }

    // Report errors
    if (result.errors.length > 0) {
        for (const e of result.errors) {
            console.error('  \u2717 ERROR: ' + e);
        }
        console.error('\n\u2717 Validation failed with ' + result.errors.length + ' error(s). Fix them and try again.');
        process.exit(1);
    }

    console.log('  \u2713 ' + result.rowCount + ' problems, ' + result.structureTypes.length + ' structure types');
    console.log('  \u2713 All required fields present');
    console.log('  \u2713 Flow types valid for domain "' + domain + '"');

    // Look up paragraph name
    const parName = findParName(parNr);
    // Write output file
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const outPath = path.join(OUTPUT_DIR, parNr + '.js');

    // Escape backticks in CSV for template literal
    const escapedCSV = csvContent.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

    const output = `// Reasoning Game data for ${parNr} ${parName}
// Domain: ${domain}
// Generated by build-reasoning-questions.js

var REASONING_CSV = \`${escapedCSV}\`;

var REASONING_META = ${JSON.stringify({
        parNr: parNr,
        parName: parName,
        domain: domain
    }, null, 2)};
`;

    fs.writeFileSync(outPath, output, 'utf8');
    console.log('\n\u2713 Written: ' + path.relative(MODULE_ROOT, outPath));

    // Generate review document if requested
    if (generateReview) {
        const reviewDoc = generateReviewDocument(csvContent, parNr, domain);
        const reviewPath = path.join(OUTPUT_DIR, parNr + '-review.md');
        fs.writeFileSync(reviewPath, reviewDoc, 'utf8');
        console.log('\u2713 Review document: ' + path.relative(MODULE_ROOT, reviewPath));
        console.log('\n  Run an economics review subagent on this document before deploying.');
    }
}

main();
