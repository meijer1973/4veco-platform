# Focused validation of a paired paragraph

Required `platform-ci / validate-platform` checks the platform with lesson
`main`. It does not attest a different lesson PR head. Use the additional
`paired-paragraph-ci` workflow for a paragraph PR's actual repository pair.

Dispatch it after both commits are pushed:

```powershell
gh workflow run paired-paragraph-ci.yml --repo meijer1973/4veco-platform --ref <platform-branch> -f lesson_sha=<40-character-lesson-head> -f lesson_base_sha=<40-character-lesson-base> -f paragraph_path="Boek N - Title/N.N Hoofdstuk Title/N.N.N Paragraph"
```

The selected workflow ref supplies the platform SHA; the report records it and
the explicitly supplied lesson head/base. Both checkouts must match their
declared commits and contain no uncommitted inputs. The lesson base must be an
ancestor. The check validates the entire lesson diff's textbook lane ownership,
the selected paragraph inventory, and its current review manifest and verdict.
Unknown paths and companion changes fail this focused textbook check; use the
applicable mixed/bundle procedure when those are intentional.

Download `paired-paragraph-evidence` from the run. Its JSON reports exact SHAs,
scope, validation output and decision. Input/checkout failures fail the run
before a report can be written. A passing result supplements required CI; it
does not prove independent reviewer identity, teaching quality, rendering
quality, source authority or permission to publish. Those remain in the review
and source records. Lesson scripts are not executed by this focused check.

The same command can run locally on clean committed checkouts by setting
`PLATFORM_SHA`, `LESSON_SHA`, `LESSON_BASE_SHA`, `LESSON_ROOT`, `PARAGRAPH_PATH`
and optionally `PARAGRAPH_CI_OUTPUT`, then running
`node build-scripts/ci/paired-paragraph-ci.js` from the platform checkout.
There is no npm install in the focused CI job: this check uses Node built-ins.

A newly added manually dispatched workflow becomes available through GitHub's
workflow interface after it exists on the default branch. Until then, test its
CLI locally and review its YAML; do not report a hosted run that has not happened.
