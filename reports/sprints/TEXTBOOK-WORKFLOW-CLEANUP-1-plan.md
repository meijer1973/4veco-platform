# Textbook Workflow Cleanup 1 Plan

Status: plan for lead-reviewer review before implementation.
Branch: `codex/textbook-workflow-cleanup-1-20260630`.
Base: `origin/main` at `99a9dde56e5606658ea5f744a6efd819eed708c1`.
Date: 2026-06-30.

## User Decision

The Part B companion main line is web output plus PPTX. PDF output belongs to
Part A / publisher-print. Do not expand the companion lane to own PDF files.
DOCX/Office companion exports remain opt-in profile work, not the default Part B
student-web lane.

## Objective

Clean up the paragraph textbook/companion workflow guidance after the Part A /
Part B lane split so agents get one coherent operating model:

- Part A: textbook source, textbook web pages, core textbook assets, reviews,
  quality-ref `partA:`, and publisher-print PDFs when explicitly in scope.
- Part B: companion route, HTML/game surfaces, PPTX presentation route, web
  visual variants, companion review, and quality-ref `companion:`.
- Complete mode: integration verification after both lanes exist, not the
  default production assignment.

This is platform workflow/governance work only. It should not mutate
student-facing lesson output in `4veco-lessen`.

## Quality Floor

The PR is acceptable only when:

1. The active entry docs no longer use "Part B" for chapter assembly or any
   non-companion meaning.
2. The quality-ref schema v2 authority is an implemented current spec, not an
   old gated design proposal.
3. The quality-control skill no longer teaches the old `quality_ref:` four-part
   layout or old `1. Voorbereiden/`, `2. Leren/`, `3. Oefenen/` storage layout
   as current guidance.
4. AGENTS, BUILD-PARAGRAPH, BUILD-CHAPTER, build-scripts README, and the lane
   runbooks agree that normal Part B is web plus PPTX and that PDFs are Part A /
   publisher-print.
5. Converter guidance is profile-gated: normal student-web deploy skips DOCX
   converters; Office/legacy profiles may enable them intentionally.
6. Legacy target and old subfolder examples are marked legacy or replaced with
   flat-layout guidance.
7. Local-path guidance is portable enough for current Windows worktrees and
   sibling repo checkouts.
8. GitHub-facing generated indexes are refreshed, and stale index metadata is
   covered by a deterministic check.
9. Tests and workflow checks prove the lane-scope and index behavior.
10. The lead-reviewer subagent returns PASS/OK on the plan and on the final
    implementation before PR readiness routing.

## Pre-Implementation Preflight

Before any implementation edits after this plan is approved, run:

```powershell
git fetch --prune origin
git rebase origin/main
npm.cmd run check:governance-freshness -- --allow-policy-edit
npm.cmd run check:agent-worktree-safety -- --claim --task TEXTBOOK-WORKFLOW-CLEANUP-1-20260630 --agent codex --require-prefix codex/,agent/ --require-clean
git status --short --branch
git branch --show-current
```

If the branch is dirty during follow-up review edits, use the same worktree
safety checker with `--check` instead of `--claim --require-clean`, then return
to a clean tree before implementation and final validation.

## Planned Changes

### 1. Create current schema authority

Add `docs/workflows/paragraph-quality-ref-schema-v2.md` as the active
implemented schema reference for `${parNr}-quality-ref.yaml`.

The spec will define:

- exact filename;
- `schema_version: 2`;
- `partA:` owner and minimum fields;
- `companion:` owner and minimum fields;
- validator behavior in `--mode part-a`, `--mode part-b`, and `--mode complete`;
- lane ownership rules for block edits;
- migration note that `docs/L1.5V/F-plan-part-a-b-separation.md` is historical
  design context only.

Update GitHub-facing entry maps so off-site reviewers can find the new current
schema authority:

- `AGENT_GITHUB_ENTRY.md`;
- `RESEARCH_AGENT_MAP.md`;
- `RESEARCH_AGENT_MAP_REFERENCES.md` if it references the old schema authority
  or needs the new workflow spec for reference traversal.

### 2. Align workflow docs

Update:

- `AGENTS.md`
- `BUILD-PARAGRAPH.md`
- `BUILD-CHAPTER.md`
- `build-scripts/README.md`
- `docs/workflows/textbook-paragraph-lane.md`
- `docs/workflows/web-companion-paragraph-lane.md`
- `agents/README.md`

Expected edits:

- Rename chapter workflow "Part A / Part B" phases to chapter steps/phases that
  do not collide with paragraph Part B companion ownership.
- Point schema references to the new current spec.
- Clarify Part B default outputs as HTML/games/route plus PPTX; DOCX is
  opt-in Office/legacy; PDF is Part A / publisher-print.
- Replace old subfolder shell references with flat paragraph-root shell
  guidance, or mark them legacy.
- Replace hardcoded local target path guidance with sibling-repo examples.
- Replace stale provider-specific model table with review-gate/tooling guidance
  that does not depend on hardcoded model names.
- Make temp-file guidance platform-neutral.

### 3. Clean the quality-control skill

Update `skills/econ-quality-control.md` so it:

- treats schema v2 as current;
- removes or clearly labels legacy top-level `quality_ref:` structure;
- stores paragraph quality refs at the paragraph root;
- uses flat layout and 14-file student-web language;
- distinguishes Part A and companion block ownership.

### 4. Add deterministic index freshness check

Add a small check under `build-scripts/reports/` and an npm script, likely
`check:agent-index-freshness`, that reads:

- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.json`

and fails when a checked index claims the current platform repo but its
`source_commit` is not fresh. Fresh means either:

- `source_commit` equals `git rev-parse HEAD`; or
- `source_commit` equals `HEAD^` and the final commit changes only generated
  index/url-index files. This allows the normal two-commit closure pattern:
  code/docs first, generated index refresh second.

The lessen index should be checked against the sibling lesson repo only when
that repo is available; if it is not available, the checker should report a skip
rather than false failure.

Add focused tests for the checker.

Before running `npm.cmd run agent:index`, set the lesson repository source
explicitly. Use the current clean lesson repo when available:

```powershell
$env:FOURVECO_LESSEN_ROOT = "C:\wt\TEXT-20260608\4veco-lessen"
$env:FOURVECO_LESSEN_SOURCE_REF = "origin/main"
```

Then verify that root is clean/current against its `origin/main`. If no clean
current lesson repo is available, do not silently fall back to
`C:/Projects/4veco/4veco-lessen`; pause and either create a sibling lesson
worktree or record an explicit no-anchor/skip decision before generating
cross-repo indexes.

### 5. Preserve PDF ownership in lane-scope behavior

Do not add companion PDF suffixes to the Part B lane. Add focused lane-scope
tests documenting that:

- `samenvatting.pdf` remains Part A/publisher-print classification where
  applicable;
- unknown companion-like PDFs such as `uitleg vaardigheden.pdf` remain blocked
  as unknown unless a future human decision creates a PDF lane.

### 6. Refresh generated maps and indexes

After implementation and validations:

- run `npm.cmd run agent:index`;
- run `node build-scripts/sprints/emit-url-index.js`;
- commit generated updates if changed.

## Validation Plan

Run before PR:

```powershell
npx.cmd jest build-scripts/workflows/check-paragraph-lane-scope.test.js build-scripts/reports/agent-index-freshness.test.js --runInBand
npm.cmd test -- --runInBand
npm.cmd run check:scope-language

$env:FOURVECO_LESSEN_ROOT = "C:\wt\TEXT-20260608\4veco-lessen"
$env:FOURVECO_LESSEN_SOURCE_REF = "origin/main"
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js

npm.cmd run check:agent-index-freshness
npm.cmd run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD
npm.cmd run finalization:freshness
```

Commit code/docs before the generated index refresh when possible. If
`agent:index` or `emit-url-index` changes files, include those generated updates
in a final generated-index commit. Rerun `check:agent-index-freshness`,
`check:paragraph-lane-scope`, and `finalization:freshness` on the exact final
head before push.

## Review Gates

1. Lead-reviewer subagent reviews this plan before implementation.
2. Implement required plan-review changes until lead reviewer says OK/PASS.
3. Execute implementation.
4. Lead-reviewer subagent reviews the work on the exact local head.
5. Implement required work-review changes until lead reviewer says OK/PASS.
6. Open draft PR with scope, rationale, and validation evidence.
7. Run PR workflow review gates, including lead reviewer and PR-readiness
   routing, on the exact PR head.
8. Keep the PR in the human-review route because this changes governance,
   workflow rules, agent operating docs, and validators.

## Stop Conditions

Pause and report if:

- the lead reviewer rejects the plan as too broad or missing a core requirement;
- validation exposes lesson-output changes that require a paired lesson PR;
- index generation changes unexpected non-index files;
- GitHub PR workflow tooling cannot authenticate or create the draft PR;
- current `origin/main` advances and creates conflicts requiring a base refresh.
