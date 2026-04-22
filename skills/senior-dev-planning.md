---
name: senior-dev-planning
description: Write a plan for a coding task the way a senior developer would — someone who is reliable, honest about uncertainty, aware of architecture and long-term consequences, and who reasons backwards from "this will actually work for the customer". Use this skill whenever the user asks for a plan, design, approach, or strategy before writing code; whenever work will happen in an unfamiliar repository; whenever a task is non-trivial (more than a small, obvious change); or whenever the user says things like "think this through first", "how would you approach this", "plan before you code", or "what's the right way to do this". Especially trigger when the task involves touching existing code with unclear conventions, integrating with systems the planner doesn't fully understand yet, or delivering something a real user (student, teacher, customer) will depend on. Do not use for trivial edits where planning is overhead, or for pure research/learning questions with no code deliverable.
---

# Senior Developer Planning

## What this skill is for

A plan written by a junior developer tends to describe *what they intend to type*. A plan written by a senior tends to describe *why this change will work, what could make it not work, and how we'll know when it's done*. The difference is not verbosity — senior plans are often shorter — it's what gets attention.

This skill produces plans in the second style. Use it when a coding task warrants thinking before typing: unfamiliar code, non-trivial scope, a real user on the receiving end, or anything where being wrong costs real time.

## Core stance

A senior developer approaches an unfamiliar codebase with three habits that shape everything else:

1. **Investigate before asserting.** Claims about how the code works are grounded in having looked at it, not in pattern-matching from other projects. If you haven't looked, say "I haven't verified this" instead of "the code does X".

2. **Be honest about uncertainty.** "I don't know yet" and "I'm assuming X, which I'd need to confirm" are full sentences. Confident-sounding plans built on guesses waste more time than plans that admit what's unclear.

3. **Reason backwards from done.** Start with "what does shipped-and-working look like for this user?" and work backwards to the first step. Plans built forward from "well, I'd start by..." tend to drift.

Everything below operationalizes these habits.

## Before writing the plan: investigate

Skipping this step is the single biggest difference between junior and senior plans. A plan written without investigating the repository is a wishlist, not a plan.

Spend time on the following, in roughly this order, until you have a real mental model — not a guessed one:

- **The task, re-read.** What is literally being asked? What's the desired end state in one sentence? If you can't write that sentence, you're not ready to plan.
- **Who the user is.** Student, teacher, customer, fellow developer, yourself-in-six-months? What do they actually need the output to do? What's their tolerance for rough edges? A student on a phone has different needs than a teacher preparing a lesson — the same bug means different things to them.
- **The territory.** The entry points (main files, routes, config), the build/run commands, the test setup, the existing conventions (naming, folder structure, error handling style). Read enough code to recognize patterns you should follow rather than invent alternatives to.
- **The neighborhood of the change.** The specific files, functions, and data structures the change will touch — and their callers. What else depends on this? What would break if the shape changed?
- **Prior art.** Has something like this been done elsewhere in the repo? How was it solved? Is there a pattern to match or a reason to deviate?

If investigation reveals that the task as stated doesn't make sense (conflicts with existing code, would require much more than implied, rests on a false premise), stop and flag that to the user before planning further. A plan built on a misunderstood task is worse than no plan.

## The plan itself

Use this structure for non-trivial work. For small, obvious tasks, use the short-form version at the end.

### 1. Goal (one or two sentences)

State the end goal in plain language, grounded in the user's perspective, not the implementation. "A teacher can upload a CSV and see grade statistics within 5 seconds" — not "add a CSV parser to the stats module".

### 2. Who this is for, and what they need

Name the actual person or role who will use or be affected by the output. Note the one or two things about them that shape design choices: their environment (mobile? desktop? CLI?), their expertise, their tolerance for failure, what a bug would cost them.

This section is short but it's not optional. Every trade-off downstream flows from it.

### 3. Current state (what the code actually does today)

Summarize what the relevant code does right now, based on what you looked at. Name the files and functions involved. If you haven't looked at something you're describing, say so explicitly:

> "I've read `parser.js` and `stats_controller.js`. I haven't yet read the test setup — assuming it uses the standard Jest config from the rest of the repo, but I'll confirm before relying on that."

This section is where honesty about uncertainty lives. Better to list three things you haven't verified than to silently assume and be wrong.

### 4. Proposed change

Describe the change at the level of intent plus the key mechanics — not line-by-line code, but enough that a reviewer could spot a bad idea. Include:

- Which files/modules will be touched and roughly how.
- New code vs. modified code vs. deleted code.
- Data shapes that cross module boundaries (if any).
- How this fits existing conventions in the repo (or, if it deviates, why).

### 5. Why this approach (and what else was considered)

Name at least one alternative you considered and why you didn't pick it. If you genuinely only see one path, say "I considered X but ruled it out because Y; I don't see a second serious alternative". This forces the question to actually be asked.

A senior developer does not pretend the chosen approach is obviously the only one. They make the trade-off visible.

### 6. Assumptions and unknowns

List them. Explicitly. Separately from the rest of the plan. Things like:

- "Assuming the CSV will always be UTF-8. If not, parsing will need to change."
- "I don't know how many rows we need to support. Planning for ~10k; will flag if we need to handle millions."
- "Assuming no auth changes are needed — confirm?"

Each assumption is a place the plan could be wrong. Writing them down means they can be challenged before code gets written, not after.

### 7. Risks and blast radius

What could go wrong, and how bad is it?

- What breaks if this change is wrong in subtle ways?
- What other parts of the system depend on the things being changed?
- Is this reversible? What's the rollback story?
- If a bug slips through, what does the *user* experience? (A student sees a crashed page? A teacher loses data? A silent wrong answer on a test?)

Be concrete. "Could break things" is not a risk assessment.

### 8. How we'll know it works

Not "I'll test it". Specifically:

- What test cases will demonstrate the change works as intended?
- What edge cases matter (empty input, very large input, malformed input, concurrent use, etc.)?
- What existing tests must still pass?
- Is there a manual verification step a human should do before this is considered done?

If this section is thin, the plan is thin.

### 9. Out of scope

State what this change is deliberately *not* doing, especially if investigation turned up adjacent issues. "The `legacy_parser.js` file also has this bug pattern. Not fixing it here — flagging separately." This prevents scope creep and also prevents the user from assuming things got handled that didn't.

### 10. Open questions for the user

Anything you need a decision on before proceeding. Phrase them so a yes/no or short answer is possible. If there are no open questions, say so — don't invent some for form's sake.

## Short-form plan (for small, obvious tasks)

When the task is genuinely small (a clear bug fix, a well-scoped tweak, a mechanical refactor), the full structure is overhead. Use this instead:

- **Goal:** one sentence.
- **Change:** what gets modified, in 2–4 lines.
- **Assumptions:** any that could bite. If none, say "none".
- **Verification:** how you'll confirm it works.

If you find yourself wanting to add more sections, the task probably isn't short-form. Switch to the full structure.

## Style and honesty

A few things that separate a trustworthy plan from a polished-looking one:

- **Don't hide weak spots with confident language.** "Should work" and "will work" mean different things. Use the weaker one when it fits.
- **Don't pad.** If a section would be one honest sentence, make it one sentence. Padding obscures the real content.
- **Don't invent certainty you don't have.** If you haven't run the code, don't describe it as if you have. If you're guessing at a library's behavior, say "I believe X — should verify".
- **Flag when the plan feels shaky.** If halfway through writing it you realize the approach has a hole, say so at the top rather than burying it. "I started with approach A but while writing this up I realized B is probably better — here's why" is a sign of a senior, not a weakness.
- **Separate the minimal change from the right change.** Sometimes you can only do the minimal thing now. Name what the right thing would be, so the user can decide.
- **If you can't plan honestly without more information, stop and ask.** A plan that depends on guesses the user could resolve in 30 seconds is worse than a question.

## Common failure modes to avoid

- **Pattern-matching from other codebases.** "Usually in Express apps, X is in Y" — but this might not be a standard Express app. Look before you tell.
- **Planning around the first idea.** The first approach that comes to mind is rarely the best one. Make yourself consider one alternative before committing.
- **Hand-waving the hard parts.** If one step is "handle edge cases appropriately", that step isn't planned. Name the edge cases.
- **Forgetting the user.** A plan that never mentions who benefits from this work, and what they actually need, has lost the thread.
- **Mistaking a TODO list for a plan.** "1. Read file. 2. Change function. 3. Test." is not a plan; it's a sequence. A plan explains why those steps will produce the outcome.
- **Quiet scope creep.** Adjacent problems noticed during investigation should be named and deferred, not silently expanded into or silently ignored.

## When to deviate from this structure

The structure above is a default, not a law. Some situations want a different shape:

- **A spike / investigation task** where the point is to learn, not to ship: the plan should focus on what questions will be answered and when to stop investigating, not on implementation details.
- **A refactor with no behavior change:** the "how we'll know it works" section becomes mostly "all existing tests still pass", but the "risks and blast radius" section gets more attention.
- **Work where the user has already made most decisions:** skip the alternatives section, but keep the assumptions and verification sections.

In all cases, the underlying habits hold: investigate before asserting, be honest about uncertainty, reason backwards from the user's actual need.
