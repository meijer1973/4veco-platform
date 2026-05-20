# Sprint EX-NS0: Baseline

## Plan reference

- Plan: `reports/sprints/EX-NS0-plan.md`
- Plan metadata: `references/data/sprints/EX-NS0.plan.json`

## Repository state before edits

Platform repository:

- `git status --short --branch` reported `## main...origin/main`.
- Active reference roadmap version was `v2.54-cp6a-lesson-side-recheck`.
- CP.6b was the active sprint; CP.6c, CP.6d, CP.6e, and REF-CT3 followed.
- `AGENTS.md` already said exercises are the source of truth, especially real CvTE exam questions, but did not separately name official correction-model ingestion as the north-star endpoint.

Lesson repository:

- `git -C ../4veco-lessen status --short --branch` reported `## main...origin/main`.
- `course_blueprint_v5.md` exists and is the active v5 curriculum-source baseline in the lesson roadmap.
- `Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/` exists.
- Current Chapter 1.3 paragraph folders are `1.3.1 Aanbod`, `1.3.2 Marktevenwicht`, `1.3.3 Verschuivingen en nieuw evenwicht`, and `1.3.4 Gemengde opgaven`.
- `RESEARCH_AGENT_MAP.md` still contained stale primary references to `course_blueprint_v4.md` and old `1.3 Hoofdstuk Aanbod en kosten`.

## Data integrity notes

No protected reference data changed before implementation. This sprint forbids hand edits to `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, and `references/owned/course-blueprint-v5.md`.

The lesson repo is a generated student-facing target. This sprint may edit only its guidance, roadmap, map, and archive-log files; it must not hand-edit paragraph/chapter/book output, shared engines, companion surfaces, PDFs, DOCX/PPTX files, or assets.

## Baseline decision

Proceed with a guidance-only update. The stale lesson-map assumptions are real and should be corrected alongside the north-star wording. The current CP.6b and L1.7A/L2.0 operational sequence should remain active; exam-ingestion work should be inserted as future design/pilot lanes.
