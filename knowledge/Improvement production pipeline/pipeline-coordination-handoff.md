# Pipeline Coordination — Handoff Spec

**Status:** operational, urgent
**Audience:** the team commissioned to design and implement multi-team coordination across `4veco-platform` and `4veco-lessen`
**Authority:** Head of Engineering, in coordination with Director
**Created:** April 2026

---

## 1. Why this exists

A recent crash made the failure mode concrete: two teams were writing into overlapping parts of the repository at the same time, with no mechanism to surface the conflict before merge. The crash was an accident of timing, but the underlying failure is structural — coordination is currently **implicit**.

Sprint ledgers in `knowledge/platform-team-roadmap.md` and `lessen-team-roadmap.md` describe **intent**: which sprint is active, what its goal is, what's coming next. They do not describe **ownership**: which exact files and paths are claimed for write-access by which sprint, right now. Without that, two well-formed sprints can collide on the same path with neither team aware until the merge.

This is a production-level operational problem. It needs to be fixed independently of vision, roadmap, or course-design discussions.

## 2. What you are being asked to deliver

Design and implement a lightweight coordination mechanism that:

1. Makes path-level ownership of every active sprint **explicit and visible** before work starts.
2. **Detects conflicts** between simultaneous claims at sprint kickoff, not at merge time.
3. **Detects staleness** — closed sprints that did not release their claims.
4. **Enforces** the existing "shared resources are write-protected outside their owning workflow" principle that already exists in policy but is not consistently catchable by tooling.

The bar is: prevent the next crash, without slowing existing sprint workflows materially.

This is not a request to redesign the sprint system, the build pipeline, the reference CLI, or the dashboard. Those work. This is the missing coordination layer between them.

## 3. Constraints to respect

These are the existing decisions you should build on, not relitigate:

- **Two-repo architecture is preserved.** `4veco-platform` is the mutation surface (engines, generators, skills, CLI). `4veco-lessen` is generated student-facing output. Do not propose unifying them.
- **Machine-only editing already exists for `references/machine/`** via the build-scripts CLI. The pattern is the model: humans declare intent, tooling validates and writes. Extend the same logic to other shared surfaces, do not invent a different one.
- **Sprint ledgers in both roadmaps are the source of truth for sprint state.** Extend their format; do not replace them.
- **The internal dashboard (`reports/internal-dashboard/`)** already aggregates from team roadmap sources. It is the natural home for any aggregated view of active claims.
- **Senior developer operating discipline** (`AGENTS.md`) already requires sprint plans before execution and verification subagents at sprint close. Hook into those gates rather than adding new ones.
- **Path conventions are already established** — paragraph-level directories, chapter-level directories, `Boek N - <title>/shared/` for auto-copied engines, `_paragraph-plan.md` and `_chapter-plan.md` files. Use the existing structure to define ownership granularity.

## 4. Proposed design direction

This is a starting proposal, not a fixed solution. You are expected to refine it.

### 4.1 Path ownership declaration

Every sprint plan must declare, in a structured block, the exact paths it claims write-access to for the duration of the sprint.

- **Granularity:** file-level or paragraph-directory-level. Not "Book 1." Not "all of `4veco-lessen`." Examples of valid claims: `4veco-lessen/Boek 1 - .../1.1.2 .../`, `4veco-platform/build-scripts/platform/build-skilltree-shells.js`, `4veco-platform/skills/econ-textbook-paragraph/`.
- **Format:** suggest a YAML or fenced-code block in the sprint plan, with `claims:` listing paths and `release_at: sprint-close`.
- **Required at sprint kickoff.** Without it, the sprint cannot start. Treat it like the existing requirement that sprint plans exist before execution.

### 4.2 Live claims registry

A single aggregated view of every active claim across both repos.

- **Location:** in the platform repo, probably under `knowledge/` or under `reports/internal-dashboard/`, regenerated from the sprint plans.
- **Form:** a markdown table for human reading, plus a JSON projection for tooling.
- **Update trigger:** any change to a sprint plan's claims block.
- **Conflict surfacing:** the registry generator fails (or flags) if two active sprints claim overlapping paths.

### 4.3 Branch protocol

- One feature branch per active sprint, named for the sprint (`sprint/L1.4-pipeline-regression`).
- Merges to `main` happen at sprint close, after the verification subagent confirms exit criteria (this gate already exists; this just makes it the merge gate).
- Cross-sprint dependencies become explicit handoffs: when a platform sprint produces something a lessen sprint needs, the platform sprint merges first; the dependent sprint rebases. Document the dependency in both sprint plans.

### 4.4 Shared-resource validation

Several surfaces are already policy-protected against hand-editing but have no enforcement:

- `Boek N/shared/<engine>*.{js,css}` — auto-copied platform engines.
- `Boek N/deploy-config.json` and `Boek N/index.html` — platform-generated.
- Assembled artifacts (`– hoofdstuk.{html,pdf}`, `– boek.{html,pdf}`) — platform-built.
- `<id>-quality-ref.yaml` and review artifacts — regenerated alongside paragraphs.

A precommit hook or CI validator that **fails on hand-edits to these paths** would close the gap. Use the existing machine-references pattern as the model.

## 5. Phased delivery

Phase the work so the lightweight protection lands in week one and the full enforcement follows.

**Phase A — Manual coordination (1 week, blocking).**
A markdown table of active claims, regenerated from sprint plans. Sprint plan template updated to require a claims block. Cross-team visual check at sprint kickoff. No tooling beyond a generator script. **This alone would have prevented the crash.**

**Phase B — Programmatic conflict detection (2–3 weeks).**
Generator detects overlapping claims and fails the build. Daily stale-claim check (a sprint marked complete should release its claims; if it doesn't, surface it). Dashboard tab added.

**Phase C — Enforcement layer (later, as needed).**
Precommit / CI validator on shared-resource paths. Branch protection rules. Migration of any remaining hand-editable shared surfaces into machine-only mode. Schedule this once Phase A and B have run for several sprints and the real edge cases are visible.

## 6. Acceptance criteria

Phase A is complete when:

- The sprint plan template requires a `claims:` block.
- A registry generator exists and runs against both repo roadmaps.
- The current active sprints (L1.4, L1.5, L2.1, P1.4, P1.5) have retroactively declared claims, with no detected conflicts.
- A documented procedure exists for resolving claim conflicts at sprint kickoff.

Phase B is complete when:

- Conflict detection is automated and runs on every sprint plan change.
- Stale-claim detection runs daily.
- The dashboard shows active claims with conflict status.

Phase C is complete when:

- Hand-edits to platform-generated paths in `4veco-lessen` fail validation.
- Branch protection prevents merges that bypass the verification subagent.
- The shared-resource list in `AGENTS.md` matches what the validator actually enforces.

The success metric across phases: **zero coordination-related crashes across four consecutive sprints involving cooperating teams.**

## 7. Out of scope

Be explicit about what this work does *not* do, so it does not absorb adjacent decisions:

- Sprint scope and prioritization. Those belong to the roadmaps.
- Course-content design. That belongs to the three-year course outline track.
- Reference CLI extension. The CLI is mature; this work uses it as a model, not a target.
- Vision and product strategy. Separate discussion.
- Refactoring the sprint workflow itself. Add a coordination layer; don't redesign what's underneath.

## 8. What you should produce

1. A short design document (`knowledge/pipeline-coordination-design.md`) proposing the schema for the claims block, the registry location, the conflict-detection logic, and the validator integration. Reviewable by Head of Engineering before implementation starts.
2. A Phase A sprint plan, executed against the proposed design.
3. A migration note: how active sprints retroactively declare their claims, and what to do if the migration surfaces a conflict.
4. Updates to `AGENTS.md` and both team roadmaps documenting the coordination layer and its enforcement.
5. After Phase A is live: a brief retrospective (one page) on whether the lightweight version is sufficient, or whether Phase B should start immediately.

## 9. Existing material to read first

- `AGENTS.md` — "Senior developer operating discipline," "Architectural principles" (especially "Machine-only editing")
- `CLAUDE.md` — working agreement and seven non-negotiable operating rules
- `knowledge/platform-team-roadmap.md` — sprint ledger format and current active sprints
- `lessen-team-roadmap.md` — same, for the lessen side
- `references/reference-team-roadmap.md` — sprint ledger applied to a third surface (references), good model for cross-team work
- `build-scripts/references/README.md` — how the existing CLI-only mutation pattern is implemented
- `reports/internal-dashboard/` — current dashboard structure and generators

## 10. Escalation

If during design you find that:

- The proposed architecture conflicts with an existing principle in `AGENTS.md` or `CLAUDE.md`,
- Phase A cannot land in a week without compromise, or
- A constraint listed in §3 is genuinely blocking the work,

escalate to Head of Engineering before working around it. The constraints are deliberate; if one needs to bend, it should be a documented decision, not a quiet exception.
