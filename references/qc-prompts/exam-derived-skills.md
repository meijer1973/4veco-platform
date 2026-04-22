# QC prompt — exam-derived skills

**Test ID:** exam-derived-skills
**Subagent role:** VWO-economie teacher with CvTE-exam expertise
**Catches:** Whether the catalog can be reached from real exam questions; surface integrative-skill gaps.

---

## Prompt (verbatim — runner pastes this into the Agent call, with `<EXAM-FILES>` and `<OUTPUT-PATH>` substituted)

You are a senior Dutch VWO economics teacher with a decade of CvTE-exam prep experience. You know exactly what each exam question is testing.

Your task: read TWO CvTE VWO central-exam question booklets, and for each opgave (numbered question set) identify the SINGLE most important skill being tested.

**Files to read** (in `C:/Projects/4veco/4veco-platform/references/external/exams/`):
1. `<EXAM-FILE-A>` — VWO economie [year-tijdvak] vragenboekje
2. `<EXAM-FILE-B>` — VWO economie [year-tijdvak] vragenboekje

Use the Read tool with `pages` parameter for each — these PDFs are long, so read each in 2-page chunks until you have all the opgaves. Each exam usually has 4-6 opgaves (opgave 1, opgave 2, ...), each with 4-8 subvragen. You only need to identify the MAIN skill per opgave, not per subvraag.

For each opgave across both exams, output:

- **Exam**: vwo-[year]-tijdvak-[N]
- **Opgave-nummer**: e.g. 1, 2, 3 ...
- **Korte naam/context**: one sentence in Dutch summarising the context
- **Hoofdvaardigheid**: the SINGLE core skill a student needs to answer the opgave's kernvraag — 1 Dutch sentence, imperatief for apply/analyze-tier skills
- **Examendomein**: best-fit letter (D / E / F / G / H / I) and a rough sub-code guess (e.g. D3.x welvaart, H5.x arbeidsmarkt)

**Important constraints:**
- Do NOT look at the platform's catalog files (`references/machine/micro-teaching-units.*`). Answer from your own exam expertise.
- Focus on the UNDERLYING skill, not surface content. E.g. an opgave about tulpen and an opgave about streaming-diensten both test the same monopolie-procedure.
- Do not include CvTE correctiemodel files (`-c.pdf`) — only read the `-o.pdf` (open-vragen) booklets.

**Output format:** write to `<OUTPUT-PATH>`. Use a Markdown table with columns: Exam | Opg | Context | Hoofdvaardigheid | Domein. Include a short 2-3 sentence intro stating how many opgaves you identified in total.

Report back in under 80 words what you wrote and where, and give the total opgave count.

---

## Runner notes

- Exam-PDF rotation: the runner picks two `vw-1022-a-*-o.pdf` files from `references/external/exams/`. Default policy: select the two least-recently-used (track in `reports/qc/SUMMARY.md` notes column or via filename in last few run filenames). At most one of the chosen exams may have been used in a previous run within the last 90 days.
- Substitutions: `<EXAM-FILE-A>` and `<EXAM-FILE-B>` are concrete filenames; `<OUTPUT-PATH>` is the per-run scratch path (e.g. `/tmp/claude-work/qc-2026-04-22/exam-derived-skills.md`).
- After the agent completes, the runner maps each Hoofdvaardigheid to the closest existing catalog unit (1-3 candidates), walks each tree, and reports per-opgave whether the catalog covers it.

## What good looks like

- All ≥10 opgaves map to existing catalog units with non-empty `needs` and procedures.
- Domain coverage is broad (≥4 of D/E/F/G/H/I touched).
- No opgave maps to "missing entirely".

## Failure signals

- Opgave maps to nothing → catalog gap (priority depends on how often this opgave-type appears across years).
- Multiple opgaves all reach the same shallow unit → the unit is a hub but its tree is too thin to support the question.
- Opgave's domain has zero candidate units → that domain is under-covered.
