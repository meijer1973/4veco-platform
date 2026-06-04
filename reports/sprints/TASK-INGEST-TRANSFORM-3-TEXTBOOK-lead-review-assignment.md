# Sprint TASK-INGEST-TRANSFORM-3-TEXTBOOK: Lead Review Assignment

## Assignment

Sprint: `TASK-INGEST-TRANSFORM-3-TEXTBOOK`

Lead reviewer agent: Codex structural lead review, informed by verification subagent Herschel (`019e923b-4caa-7c32-9933-0aad7eb9d04d`)

Scope: review the textbook-source task transformation bundle for the owned `1.1.3 Grafieken en tabellen` ice-cream table/graph source. The review must judge owned-source authority boundaries, context-first rendering, TaskShellEngine validity, task-family coverage, operation-chain preservation, answer-form preservation, the 50 percent interval ambiguity, visual variants, screenshot proof, protected-path discipline, and product-boundary claims.

## Evidence To Inspect

- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-plan.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-baseline.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-planning-review.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-planning-review-resolution.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-verification-review.md`
- `reports/json/task-ingest-transform3-textbook.json`
- `reports/json/task-ingest-transform3-textbook-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-source-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-visual-variant-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-operation-chain-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-answer-form-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-task-family-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-reviewer-notes.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-rendered-lab.html`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/desktop-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-screenshots/mobile-dark.png`
- `build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js`
- `build-scripts/sprints/check-task-ingest-transform3-textbook.js`
- `reports/sprints/TASK-INGEST-TRANSFORM-3-TEXTBOOK-command-log.jsonl`

## Required Review Questions

1. Is `sourceAuthority.kind` correctly limited to `owned_textbook_source`?
2. Does the bundle reject official exam, external-primary, target-equivalent, product-route, Scale Gate, diagnostic, mastery, PV, and student-use claims?
3. Does the task set validate as one `TaskShellEngine` task set?
4. Do context blocks appear before task cards in proof and rendered lab evidence?
5. Do task cards cover table reading, P-Q axes, graph procedure, point placement, interpolation source values, graph reading, calculation work, source-chain reasoning, and answer-form construction?
6. Do correct responses pass and adversarial/final-interval-only responses fail?
7. Does the bundle record both the paragraph-taught and also source-valid 50 percent intervals?
8. Do visual variants and screenshots cover desktop light, mobile light, and mobile dark?
9. Are protected references, source-data, and Book 1 generated output unchanged?
10. Are omitted product requirements named as follow-up work instead of claimed?

## Stop Conditions

Stop with REVISE, FAIL, or PAUSE if any required output file is missing, source authority claims external-primary or official exam authority, `TaskShellEngine` validation is absent, operation families are reduced to shallow recognition, final-interval-only work can pass, the 50 percent ambiguity is hidden, visual proof is missing, screenshots are absent, protected paths changed, or the bundle claims generated lesson output, product adoption, target-equivalent proof, diagnostics, mastery, PV, Scale Gate, or student/product use.

## Expected Output

Return a `# Lead Review Summary` using the strict sprint format, with `Round: lead review round 1`, command-log evidence, blocking findings, flags, ownership, and one concrete next action.

