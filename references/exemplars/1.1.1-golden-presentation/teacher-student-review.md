# Teacher And Student Review

Status: conceptual review standard for promotion from golden concept to implemented reference.

## Required Review Perspectives

1. Teacher learning quality.
2. Student experience.
3. Visual QA.
4. Accessibility and inclusive usability.
5. Lead synthesis.

## Teacher Learning Quality Review

Use `agents/teacher-learning-quality-review-agent.md`.

Review questions:

- Does the route start with clear learning goals?
- Does the sequence move from concrete to abstract?
- Are misconceptions addressed before they harden?
- Is the B02 procedure explicit and correct?
- Does the worked example scaffold calculation before interpretation?
- Does the active check reveal whether students can use the concept?
- Is the teacher able to use the deck without inventing missing structure?

## Student Experience Review

Use `agents/student-experience-review-agent.md`.

Review questions:

- Does a typical 15-year-old 4 vwo student know what the presentation is for?
- Does slide 1 explain the route clearly?
- Does each slide make one clear point?
- Are the visuals understandable without teacher repair?
- Are the notes useful if the student opens them?
- Does the student understand what to check on the active-check slide?

## Visual QA Review

Use `agents/visual-qa-agent.md`.

Required screenshot states:

- desktop slide 1;
- desktop slide 2;
- desktop slide 5;
- desktop slide 8;
- desktop slide 10;
- desktop slide 11;
- notes panel open;
- dark mode;
- mobile/narrow viewport;
- fullscreen or presentation mode if supported.

Missing screenshots block a PASS verdict for visual QA.

## Accessibility Review

Use `agents/accessibility-agent.md`.

Review:

- text size;
- contrast;
- semantic headings;
- keyboard navigation;
- focus visibility;
- notes readability;
- alt text or aria labels for instructional visuals;
- cognitive accessibility and density.

## Lead Verdict Options

- `PASS` - promote conceptual exemplar and policy.
- `PASS WITH FLAGS` - promote exemplar, but block implementation rollout.
- `REVISE` - do not promote yet.
- `FAIL` - discard as golden candidate.

For this conceptual package, the expected verdict is `PASS` for conceptual golden exemplar. Implementation rollout still requires generator integration, regenerated lesson output, screenshots, and specialist review.
