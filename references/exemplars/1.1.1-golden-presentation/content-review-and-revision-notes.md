# Content review for §1.1.1 web presentation

## Verdict

The layout, notes panel, and visual language are good enough to keep. The weak point was the learning route. The earlier version opened with a hook, but not with a clear lesson contract. A student saw “choosing costs something” before being told what they were expected to learn. A teacher could probably teach from it, but had to supply the route verbally.

## Student-lens audit

### What worked

- The notes are readable as student explanations.
- The examples are concrete: Lisa, the farmer, and later the government pattern.
- The slide format is not too crowded.

### What blocked understanding

1. **No explicit goal at the start.** The first slide asked a question before establishing the route: schaarste → alternatieve kosten → four-step procedure.
2. **Lisa’s concrete alternatives were not visible early enough.** The opening visual showed €20 versus €27, but the student did not immediately see “bioscoop €12 + boek €15”.
3. **The abstraction came too fast.** “Schaarste is a relation” is correct, but it needs to be anchored in Lisa’s exact numbers before transferring to other contexts.
4. **Alternative costs risked becoming the price of the book.** The previous slide could make a student think: “book €15 = alternative costs.” The revised version says more explicitly that the concept is the value/opbrengst of what is given up, not simply the paid price.
5. **The mini-check repeated an earlier misconception slide.** The revised check asks students to apply the pattern to Lisa and the farmer instead of only recognizing the correct definition.

## Teacher-lens audit

### What worked

- The deck is usable as a guided explanation rather than a slide dump.
- Speaker notes are strong enough to support student self-study.
- The visual design supports pacing.

### What a teacher still needed

1. A first slide that tells the class what the lesson will achieve.
2. A stable classroom routine: “kiezer → schaars middel → alternatieven → beste niet-gekozen → nettowaarde.”
3. Less hidden teacher work in transitions. The old deck needed the teacher to explain why the class moved from Lisa to schaarste to the farmer.
4. A stronger check that students can do the operation, not only repeat the definition.

## Applied revision

The revised content version changes the route to 11 slides:

1. Lesson goal and route.
2. Lisa’s concrete choice tension.
3. Schaarste as behoeften > middelen, anchored in Lisa.
4. Transfer pattern across scholier, producent, overheid.
5. Alternative costs as the best non-chosen alternative.
6. Misconceptions: not price, not all missed options.
7. Four-step procedure.
8. Farmer example: calculate both alternatives.
9. Farmer example: determine alternative costs and nettowaarde.
10. Active check: apply the pattern.
11. Summary and bridge.

## Remaining recommendation before platform integration

Before committing this into the platform generator, run a rendered-output review with two questions:

- Student question: “Can I explain what I am supposed to learn by slide 1 and apply it by slide 10?”
- Teacher question: “Can I teach this without adding a separate oral structure that is missing from the slides?”

If both are yes, integrate this as the production web-first presentation route in `4veco-platform`, regenerate `4veco-lessen`, and only then consider PowerPoint export.
