# Authoring workflow assessment — 13 September 2026

Three cold agents receive the same platform and lesson snapshots, inherited model/settings, tool availability, logging instructions and independent reviewer service. They receive only their assignment, workspace, time limit and measurement instructions, not previous trial findings or the intended implementation. This is an observational assessment of the current workflow, not a controlled before/after experiment.

Platform: `85b0f347f3070e005eae3f35f0b11ce6eac71b4d` (merged PR #245).
Lessons: `0acaaa97443e5c4fee34f7da8a12ccd5db62d762`.
All use Book 2 §2.1.1 Kostenstructuren. Dedicated paired worktrees live below this directory. Their `codex/assessment-<case>-20260913` branches are local only. No assessment output is authorized for publishing, merging or student use.

| Run | Assignment | Stopping point | Deadline UTC |
|---|---|---|---|
| exercise | Requested correction of the printing exercise's subscription charge, EUR150 to EUR175; corresponding answer and dependent outputs | Independently reviewed bounded correction; no full paragraph acceptance | 12:08:30 |
| layout | Keep the existing orphaned “De procedure samengevat:” label with its table in the exercises PDF | Independently reviewed layout repair and affected pagination/HTML | 12:09:00 |
| paragraph | Fresh complete Part A version using the approved paragraph target | Complete local production/review/checks if possible; honest incomplete handoff otherwise | 12:09:00 |

The arithmetic case is a deliberately requested benchmark change, not a claimed defect in main. The layout issue was visually confirmed on the existing PDF pages 1–2. The new paragraph is a replacement draft of an existing approved paragraph, not a new curriculum unit. These are different workloads; raw duration differences do not rank agent quality.

Maximum 30 minutes per agent, including its logging, review waiting and repairs. Agents record actual starts; the fixed deadlines are slightly earlier than 30 minutes from dispatch. Parent review is independent of every assessment author. The parent has not authored their content or supplied implementation fixes before review. One reviewer covers each case; parent shared setup is reported separately from author reading.

Environment: Windows, Node, Python 3.14, Pandoc, Poppler, WeasyPrint 68.1, pypdf 6.13.2. Identical unchanged node_modules are provisioned through read-only-use junctions. Worktree creation and parent setup precede the timed agent runs. Concurrent execution shares CPU/disk and reviewer availability. Exact model identifier/token usage is not exposed by the subagent tool; identical inherited settings are ensured by omitting overrides.

`observe.py` writes external JSONL events and selected text-read volume. Agents log other tool/search reads and actions, useful first edits, commands, friction and review repairs. Reported file words are a reading-volume proxy, not model tokens; failed/truncated reads, searches, multimodal/tool context and repeated reads must be distinguished. Event durations are agent-reported unless directly measured. Logging itself adds work. In particular the observer initially encountered Windows stdout encoding on Unicode; that is assessment instrumentation friction, not repository friction.

Acceptance evidence: inspect actual diffs, affected calculations and dependencies; visually inspect final changed pages and HTML. New paragraph review additionally checks all approved targets, teaching/support, actual time budget, source/action authority, all final pages and current-file binding. Incomplete checks or absent publication evidence remain explicit. No full hosted product CI is requested for these local experiments.

The September 9 cold paragraph trial is historical context only: different starting instructions/tooling, no matching component tasks and no controlled repeated samples. This assessment can identify next deletions and present current costs; it cannot prove a percentage improvement in model performance or token savings.
