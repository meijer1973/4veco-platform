# References Folder Migration — Execution Plan

## Goal

Relocate the eight hand-authored + external reference files currently at `references/*` into the three-bucket structure (`references/external/`, `references/authored/`, `references/machine/`) without breaking any of the 114 path citations across 27 files.

Scope of this plan: a single atomic commit that moves files and updates every reference in one go. The `references/external/README.md`, `references/authored/README.md`, and `references/machine/README.md` scaffolding was already created in an earlier session; this plan handles the content move.

---

## Path-rewrite table (exhaustive)

| Current path | New path |
|---|---|
| `references/syllabus-economie-vwo-2026-versie-2.pdf` | `references/external/syllabus-economie-vwo-2026-versie-2.pdf` |
| `references/inspectie-standaarden.md` | `references/external/inspectie-standaarden.md` |
| `references/amstelveencollege_quality_standards.md` | `references/external/amstelveencollege_quality_standards.md` |
| `references/economie-terminologie.md` | `references/authored/economie-terminologie.md` |
| `references/vraagtypen-en-opgaveontwerp.md` | `references/authored/vraagtypen-en-opgaveontwerp.md` |
| `references/economic_mathematical_precision_reference.md` | `references/authored/economic_mathematical_precision_reference.md` |
| `references/didactiek-principes.md` | `references/authored/didactiek-principes.md` |
| `references/skill-categories.md` | `references/authored/skill-categories.md` |

`knowledge/course_blueprint_v4.md` → `references/authored/course_blueprint_v4.md` is a separate move (changes originating folder); handle in the same commit for coherence but list it explicitly in the commit message.

---

## Impact surface — 27 files, 114 citations

### Skills (dual location — must update both paths)

Per the platform convention, every skill lives twice: `.claude/commands/*.md` (where Claude Code reads) and `skills/*.md` (shared canonical). Each pair must be kept in sync.

| Skill | Citations per copy |
|---|---|
| `econ-textbook-paragraph` | 10 |
| `econ-testprep-builder` | 9 |
| `econ-paragraph-review` | 7 |
| `econ-chapter-builder` | 6 |
| `econ-pptx-templates` | 3 |
| `econ-quality-control` | 3 |
| `econ-didactiek` | 2 |
| `econ-exercise-builder` | 2 |
| `econ-consolidation-builder` | 2 |
| `economic-graph` | 1 |

Total: 45 citations per side × 2 sides = 90 citations in skill files.

### Knowledge + plans

| File | Citations |
|---|---|
| `knowledge/Proeftoets_Eindbazen.md` | 6 |
| `knowledge/blueprint-v4-audit.md` | 2 |
| `knowledge/blueprint-v4-revisions-plan.md` | 1 |
| `knowledge/micro-teaching-units-plan.md` | 2 (this plan's own references) |
| `.claude/plans/module-3-3-graphs-dual-coding.md` | 3 |

Total: 14 citations.

### Internal cross-references within `references/` itself

| File | Citations |
|---|---|
| `references/skill-categories.md` | 8 (cites the others heavily) |
| `references/economie-terminologie.md` | 2 |

Total: 10 citations. These become intra-bucket (`references/authored/X.md` citing `references/authored/Y.md`).

### Top-level documentation

| File | Current content |
|---|---|
| `CLAUDE.md` | Line 10 says "**references/** — Authoritative external standards used by skills" with a bulleted list below. The bulleted list (every file in root of `references/`) needs rewriting to reflect the new three-bucket structure. |
| `AGENTS.md` | Line 63 says `├── references/` with a single-line description. Either keep the one-liner or expand to show the three buckets. |

---

## Recommended commit strategy

**Option A (preferred): single atomic commit.** 

```
1. git mv references/<file>  references/<bucket>/<file>   (8 moves)
2. git mv knowledge/course_blueprint_v4.md  references/authored/course_blueprint_v4.md
3. Run a path-rewrite pass across all 27 affected files:
   - For each reference file, replace `references/<name>` with `references/<bucket>/<name>`.
4. Update CLAUDE.md and AGENTS.md to describe the new structure.
5. Commit with a message listing all moves + all rewritten files.
```

Rewrite tool: a small Node script or `sed -i` invocation. Recommended script: `build-scripts/references/migrate-paths.js` — takes the mapping table above as input, walks the 27 files, performs exact-string replacements, reports diffs. Keeping this as a script (rather than hand-edits) makes the migration reproducible and is consistent with the platform-wide "machine-only edits" principle.

**Option B (staged): two commits.**

- Commit 1: `git mv` only. This temporarily breaks every citation — all 114 paths become invalid.
- Commit 2: path rewrites.

Option B is NOT recommended. Any intermediate state where references are broken may be bisected against during future debugging and will mislead. Atomic is correct.

**Option C (fallback): keep shims.**

Leave symlinks at the old locations (`references/economie-terminologie.md` → `references/authored/economie-terminologie.md`). This avoids any citation rewrites. 

- Pro: zero blast radius, reversible.
- Con: does not achieve the "folder location as signal" benefit. A human reading `references/` still sees a flat soup. Defeats the purpose.

Option C is a temporary safety net at best; don't commit it as the final state.

---

## Verification after the commit

1. **Structural check:** the only contents at the root of `references/` should be the three subfolder READMEs (no loose `.md` or `.pdf` files).
   ```bash
   ls references/
   # expected: authored/ external/ machine/
   ```
2. **Citation check:** no file in the repository cites a root-level reference path.
   ```bash
   rg "references/[a-z_-]+\.(md|pdf)" --glob '!references/**'
   # expected: no matches for paths lacking a subfolder
   ```
3. **Reverse citation check:** every new sub-bucket path is reached from somewhere (no orphan references).
   ```bash
   for f in references/external/*.md references/authored/*.md; do
     name=$(basename "$f")
     count=$(rg -c "references/(external|authored)/$name" --glob '!references/**' | wc -l)
     echo "$f → cited in $count files"
   done
   ```
4. **Sanity-run of a skill:** pick `econ-textbook-paragraph` (most citations: 10) and verify its path references all resolve with `ls`.
5. **Sanity-run of a build:** build one paragraph (e.g. `m1-111`) end-to-end to confirm no skill chokes on a stale path. If any builder uses `__dirname`-relative or `require`-based paths to references, those need attention too — see known risks.

---

## Known risks and edge cases

- **`require()` / `fs.readFileSync` paths in build scripts.** Grep only caught markdown citations. Some JS builders may reference these files by path. A secondary grep is needed:
  ```bash
  rg "references/[a-z_-]+\.(md|pdf)" --type js
  ```
  Any matches in `build-scripts/` must also be rewritten in the same commit.
- **`skills/` vs. `.claude/commands/` drift.** The two copies must stay in sync. If the rewrite script processes both folders, a post-check diffs the corresponding files to confirm.
- **Links inside `references/skill-categories.md`.** It cites other references 8 times. Since both source and targets move into `references/authored/`, intra-bucket relative references may use a relative path (e.g. `./economie-terminologie.md`) or stay absolute. Pick one convention and apply consistently.
- **PDF path in `syllabus-economie-vwo-2026-versie-2.pdf`.** The syllabus PDF is referenced by its relative path in a few skills' "open this page" instructions. Rewrite these to the new `external/` path.
- **`.claude/commands/` gitignore status: confirmed versioned.** Checked `.gitignore` — only `.claude/settings.local.json` is excluded, not `.claude/commands/`. Both copies of every skill (`.claude/commands/*.md` and `skills/*.md`) are in version control. Both must be rewritten in the same commit, and they must remain byte-identical afterward (post-check: `diff .claude/commands/econ-textbook-paragraph.md skills/econ-textbook-paragraph.md`).
- **Downstream consumers outside this repo.** The deployed module repo (`3. Module 3 - Markt en overheid/`) does not reference `4veco-platform/references/` paths because deploy copies assets. Verify quickly by grepping that repo for `references/` paths.

---

## Non-goals for this migration

- Do NOT update any reference file's content. Content changes are out of scope; this is a pure relocation commit.
- Do NOT add new references (syllabus-eindtermen, exam PDFs, etc.). Those are separate, future commits.
- Do NOT promote `skill-categories.md` toward `machine/` yet. That's a later architectural move after the CLI suite exists.

---

## Suggested commit message

```
Relocate references/ into external/authored/machine/ buckets

- Move 3 files to references/external/ (CvTE syllabus PDF, inspectie, school standards)
- Move 5 files to references/authored/ (economie-terminologie, didactiek-principes,
  vraagtypen, precision-reference, skill-categories)
- Move knowledge/course_blueprint_v4.md to references/authored/
- Rewrite 114 citations across 27 files (skills, knowledge, plans, root docs)
- Update CLAUDE.md and AGENTS.md to describe the new structure

Rationale: folder location now signals maintenance status (external refresh vs.
hand-authored vs. machine-edited). The authored/ bucket will shrink over time as
machine-editing pipelines replace manual maintenance. See
knowledge/micro-teaching-units-plan.md §1 for the architecture.

Blast-radius audit: knowledge/references-migration-plan.md
```
