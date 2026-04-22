---
name: qc-references
description: Run the catalog quality-control pipeline against references/machine/micro-teaching-units.md. Spawns subagent tests defined in references/qc-prompts/, walks the resulting trees, writes a timestamped report under reports/qc/, and appends one row to reports/qc/SUMMARY.md. Trigger when the user invokes /qc-references, asks for a "QC run", "stress test the catalog", "audit the references folder", "check catalog quality", or wants to verify the references-data integrity beyond what the deterministic reports (dag-integrity, unresolved-refs, terminology-drift) cover.
---

# qc-references — Catalog Quality-Control Pipeline

## Purpose

The platform's **structural** integrity is checked by the 8 deterministic Node scripts under `build-scripts/reports/`. They guarantee schema validity, DAG acyclicity, terminology canonicity, and reference-resolvability. They do NOT and cannot check:

- Whether `exam_codes` actually point to the *right* CvTE eindterm (semantic correctness).
- Whether each `needs` edge is *structurally justified* by the kern (over-wiring).
- Whether the catalog can be *reached* from a real exam question (coverage from the user side).
- Whether *integrative* skills exist for the kind of cross-concept reasoning real exams demand.

This skill runs the **LLM-judgment layer** that catches those bugs. It pairs with `/manage-references` (policy-of-record for the references folder).

## When to invoke

- After ≥5 catalog edits since the last run (mints, deprecations, exam_code fixes, needs-edge changes).
- At minimum once per month so cumulative drift gets caught.
- Whenever a teacher / SME flags a real exam question that doesn't seem covered.

## What the user sees

A single timestamped report at `reports/qc/qc-run-YYYY-MM-DD.md` (overwrite if same day) plus one new row in `reports/qc/SUMMARY.md`. The report ends with a "Recommended fixes" rollup. The runner **never auto-mints** — the user reviews and decides.

## Tests in the MVP set

Each test is a versioned prompt in `references/qc-prompts/`. Edit a prompt to change what the test checks; the runner snapshots prompts at invocation time.

| Test ID | Prompt file | What it catches |
|---|---|---|
| `probe-questions` | `references/qc-prompts/probe-questions.md` | Catalog gaps that real exam topics demand but no unit covers |
| `exam-derived-skills` | `references/qc-prompts/exam-derived-skills.md` | Whether the catalog can be reached from real CvTE exam questions |
| `tree-integrity-audit` | `references/qc-prompts/tree-integrity-audit.md` | Wrong exam_codes, over-wired needs edges, kern↔procedure drift (top-down per-unit audit) |
| `foundation-audit` | `references/qc-prompts/foundation-audit.md` | L0 units that assume prereq concepts VWO 4 students don't bring from onderbouw (bottom-up, inverse of tree-integrity-audit) |

## Runner protocol

When the user invokes `/qc-references`, execute the following sequence:

### 1. Set up the run

- Today's date: `YYYY-MM-DD` (UTC date in run filename).
- Create scratch directory: `/tmp/claude-work/qc-YYYY-MM-DD/` (mkdir -p).
- Read all four prompt files from `references/qc-prompts/*.md`.
- Read current catalog stats: `node -e` to print catalog-units count from `references/machine/micro-teaching-units.json`.
- Read `reports/qc/SUMMARY.md` to find the most recent prior run row (for "gaps closed" comparison later).

### 2. Parameterise per-test inputs

**For `exam-derived-skills`:**
- List `references/external/exams/vw-1022-a-*-o.pdf` (open-vragen booklets only — exclude `-c.pdf` correctiemodel).
- Pick the two least-recently-used filenames. Track usage by scanning the `Notes` column of `reports/qc/SUMMARY.md` for filename mentions in past run rows; if no history, pick `vw-1022-a-25-1-o.pdf` and `vw-1022-a-25-2-o.pdf` as defaults.
- Substitute `<EXAM-FILE-A>`, `<EXAM-FILE-B>`, `<OUTPUT-PATH>` in the prompt.

**For `tree-integrity-audit`:**
- Sample 5 unit IDs from the catalog. Strategy: 3 IDs from units edited in the last 10 commits to `references/machine/micro-teaching-units.md` (use `git log -n 10 --diff-filter=AM --name-only -- references/machine/micro-teaching-units.md` and inspect line ranges for unit IDs; fallback to `git log -L` if needed); 2 IDs uniformly random from the catalog. If fewer than 3 recent edits, fall all 5 from random.
- For each chosen ID, dump its full text block (id, name, kern, mastery_target, exam_codes, needs, procedure, terms) into the prompt's `<UNIT-DUMPS>` placeholder.
- Substitute `<OUTPUT-PATH>`.

**For `foundation-audit`:**
- Filter catalog to L0 foundation candidates: `layer === 0 && (!needs || needs.length === 0) && !deprecated`.
- Sample 5 L0 unit IDs. Strategy: **3 high-risk slots** picked from the top-decile by fan-out (number of direct dependents = count of units where this ID appears in `needs`); **2 random slots** uniformly from the remaining L0 pool. If fewer than 30 L0 units exist, pick top-3 fan-out + 2 random from the rest. Prefer IDs NOT audited in the prior run (scan prior SUMMARY.md `Notes` for IDs) but don't exclude them — slight weighting only.
- Dump each chosen unit's full text block (id, name, kern, mastery_target, exam_codes, aspects, terms, procedure, pitfalls) into `<UNIT-DUMPS>`.
- Substitute `<OUTPUT-PATH>`.

**For `probe-questions`:**
- Substitute `<RUNNER-PROVIDES-PATH>` with the per-run scratch path.
- No other parameters — the prompt is fixed.

### 3. Launch all 4 subagents in parallel

In a single message with four Agent tool calls (subagent_type: `general-purpose`), each with `run_in_background: true`. The four prompts are sent verbatim from the prompt files (with substitutions applied). Each subagent writes its output to its assigned scratch path under `/tmp/claude-work/qc-YYYY-MM-DD/`.

### 4. Wait for all four completions

The system notifies as each subagent finishes. Do NOT poll. Continue with other work or simply wait.

### 5. Walk trees + synthesise findings

For each subagent's output:

- **`probe-questions`**: For each of the 7 questions, find the closest catalog unit by fuzzy-matching `Hoofdvaardigheid` against unit `name + kern`. For matches, walk the `needs` tree (use the inline node script template below). For non-matches, flag as a gap.
- **`exam-derived-skills`**: For each opgave, same fuzzy-match + tree walk per opgave's `Hoofdvaardigheid`.
- **`tree-integrity-audit`**: Read the agent's per-unit verdicts directly. No tree walking needed — the agent already audited.
- **`foundation-audit`**: Read the agent's per-unit verdicts directly. No tree walking. For each RED verdict, record the mint-voorstel in the "Recommended fixes" rollup as a candidate new L0 unit with the agent's proposed title.

**Tree walk template (inline node):**
```javascript
const u = require('./references/machine/micro-teaching-units.json');
const byId = Object.fromEntries(u.map(x => [x.id, x]));
function walk(id, prefix, isLast, lines, visited) {
  visited = visited || new Set();
  if (visited.has(id)) { lines.push((prefix||'')+(isLast?'└─ ':'├─ ')+'⟲ '+id); return; }
  visited.add(id);
  const n = byId[id]; if (!n) return;
  const connector = prefix === null ? '' : (isLast ? '└─ ' : '├─ ');
  const m = '['+(n.mastery_target||'?')[0].toUpperCase()+']';
  const L = typeof n.layer==='number' ? ' L'+n.layer : '';
  const prc = Array.isArray(n.procedure)&&n.procedure.length ? ' +proc' : '';
  lines.push((prefix||'') + connector + n.id + ' ' + m + L + prc + ' — ' + n.name);
  (n.needs||[]).forEach((c,i,a) => walk(c, (prefix||'')+(prefix===null?'':(isLast?'   ':'│  ')), i===a.length-1, lines, visited));
}
```

### 6. Write the timestamped report

At `reports/qc/qc-run-YYYY-MM-DD.md`. Structure:

```markdown
# Catalog QC Run — YYYY-MM-DD

**Catalog at run time:** N units.
**Tests run:** comma-separated list of test IDs.
**Prompts used:** paths to prompt files (with current commit SHA if reachable via `git rev-parse HEAD`).

---

## Test 1 — Probing exam questions
<per-question section: vraag, hoofdvaardigheid, catalog match, tree depth, verdict>

## Test 2 — Exam-derived skills
<per-opgave table or section list>

## Test 3 — Tree-integrity audit
<the agent's per-unit output, lightly cleaned>

## Test 4 — Foundation audit (bottom-up L0 check)
<the agent's per-unit output: verdict GREEN/YELLOW/RED, ontbrekende voorkennis, mint-voorstel>

---

## Recommended fixes

<priority-ranked rollup of all flagged gaps>

## Same-day actions taken (optional)

<filled in if the user approves any fixes during the same session and they get committed before the report is finalised>
```

### 7. Append one row to `reports/qc/SUMMARY.md`

Compute:
- **New gaps**: count of distinct candidate findings in this run NOT present in the prior run.
- **Gaps closed**: count of items flagged in the prior run that no longer appear here.
- **Notes**: brief — e.g. "Used vwo-2024-tv2 + vwo-2025-tv1 for exam-derived test."

Append (do NOT overwrite earlier rows):
```
| YYYY-MM-DD | <test-IDs> | <new> | <closed> | <unit-count> | <notes> |
```

### 8. Cleanup + report-back

- Delete `/tmp/claude-work/qc-YYYY-MM-DD/` once the synthesised report is written (the per-test agent outputs are no longer needed).
- Tell the user: "QC run complete. Report at `reports/qc/qc-run-YYYY-MM-DD.md`. N new gaps, M closed. Catalog: X units."

The user reviews the report and decides which fixes to apply via `unit-add` / `unit-update` / `unit-deprecate` CLIs. The runner never edits the catalog.

## Verification (after the runner completes)

- `node build-scripts/references/build-unit-index.js` still passes (catalog unchanged by the runner).
- `reports/qc/qc-run-YYYY-MM-DD.md` exists and is non-empty.
- `reports/qc/SUMMARY.md` has exactly one new row appended (no overwrite of prior rows).

## Failure modes + recovery

- **Subagent crash / timeout**: scratch file may be empty or partial. Retry just the failed test by re-launching one Agent call with the same parameterised prompt; do NOT re-launch the other two.
- **Tree walk hits a unit ID the prompt cited that doesn't exist**: log as a "spurious citation" warning in the report; this signals the agent hallucinated an ID — useful debug, not a catalog bug.
- **Same-day re-invocation**: overwrite `qc-run-YYYY-MM-DD.md` (already the policy). Do NOT add a second SUMMARY row for the same date — update the existing row's `Notes` column with "(re-run)" instead.

## Cross-references

- Policy-of-record for the references folder: `skills/manage-references.md` (see PART 7).
- Existing structural reports: `build-scripts/reports/*.js` → `reports/*.md` (the layer below this one).
- Prompt files: `references/qc-prompts/*.md`.
- Output directory: `reports/qc/`.
