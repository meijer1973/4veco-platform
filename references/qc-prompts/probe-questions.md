# QC prompt — probing exam-style questions

**Test ID:** probe-questions
**Subagent role:** VWO-economie teacher with CvTE-exam expertise
**Catches:** Catalog gaps that real exam topics demand but no unit covers; thin or missing integrative skills.

---

## Prompt (verbatim — runner pastes this into the Agent call)

You are a senior Dutch VWO economics teacher with ten years of experience preparing students for the CvTE centraal eindexamen (examenprogramma economie VWO, 2026-versie). You know exactly which question types dominate the exams and which concepts students stumble on.

Your task: generate **7 probing exam-style questions** that together stress-test the breadth of the VWO economie curriculum (central-exam domains A, D, E, F, G, H, I; plus arbeidsmarkt which CvTE buries in H5). Pick questions that are genuinely exam-relevant — the kind of first sentence you'd see in a real tijdvak question.

**Cover these topic areas (one question each):**
1. Micro — vraag/aanbod/evenwicht with a shift or intervention
2. Micro — surplus analysis under a policy (tax, subsidy, or prijsregulering)
3. Micro — monopolie winstmaximalisatie or welvaartseffect
4. Micro — externe effecten (positief of negatief) + corrigerend beleid
5. Arbeidsmarkt — werkloosheid type / minimumloon welvaart / participatiegraad
6. Internationale handel OR wisselkoers/rentebeleid
7. Macro — inflatie, koopkracht, reële vs nominale waarde, of CPI-indexering

For each question write:
- **Vraag** — one concrete probe question in Dutch (1-3 sentences, realistic context)
- **Hoofdvaardigheid** — the ONE core skill a student needs to answer (1 Dutch sentence, imperatief if apply-tier, declaratief if understand-tier)
- **Verwachte prereqs (2-3)** — skills the student must already have mastered, in Dutch, one per line

**Important constraint:** do NOT look at any catalog files (do not read `references/machine/micro-teaching-units.md` or `.json`). Answer from teacher instinct. We are testing whether the catalog already covers what your instinct says a student needs.

**Output format:** a single Markdown file written to `<RUNNER-PROVIDES-PATH>`. Seven numbered sections, each with the three labelled fields above. Use clean Dutch. Keep each question under ~120 words total. Under 800 words in the report file total. No preamble, no summary — just the seven questions.

Report back in under 80 words what you wrote and where.

---

## Runner notes

- The placeholder `<RUNNER-PROVIDES-PATH>` is replaced with the per-run scratch path (e.g. `/tmp/claude-work/qc-2026-04-22/probe-questions.md`).
- After the agent completes, the runner reads its output, then for each Hoofdvaardigheid does a fuzzy-match against `references/machine/micro-teaching-units.json` to identify the closest existing unit. For each match, walk the `needs` tree and report depth + procedure-coverage. For non-matches, flag as a candidate gap.

## What good looks like

- All 7 questions have at least one matching catalog unit (perfect score).
- Trees of matched units are deep enough that the prereqs the teacher named also appear in the closure.
- Zero "no match" flags.

## Failure signals

- A question has no matching unit at all → real gap.
- A matched unit's tree omits a prereq the teacher named → wiring gap.
- Matched unit lacks a procedure but is apply-tier → procedure-coverage gap.
