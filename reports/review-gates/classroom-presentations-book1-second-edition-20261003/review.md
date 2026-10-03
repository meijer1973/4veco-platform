# Book 1 second-edition classroom presentations

Status: production and independent review in progress. This record is not acceptance of the complete series or merge authority.

The owner requested removal of obsolete first-edition presentations and a new classroom series for the Book 1 second edition merged in platform PR303 and lessons PR99. The task preserves the textbook manuscripts, answers, teacher guides, student PDFs and historical archive. Twelve current paragraph stems, including three mixed paragraphs, determine the output filenames.

## Completed individual reviews

| Paragraph | Slides | Cold handoff | Independent review |
|---|---:|---|---|
| 1.1.1 | 21 | PPTX/PDF unchanged after completed handoff | [PASS](111-review.json) |
| 1.1.2 | 29 | Author repaired wrap/header before handoff; coordinator normalized manifest naming only | [PASS](112-review.json) |
| 1.1.3 | 29 | Author completed its own coverage/layout repairs before handoff; artifact bytes unchanged afterward | [PASS](113-review.json) |
| 1.1.4 | 22 | Author repaired source layout, native markers and overview wraps before final v6; artifact bytes unchanged afterward | [PASS](114-review.json) |
| 1.2.1 | 25 | Author repaired labels and bounds before handoff; PPTX/PDF unchanged afterward | [PASS](121-review.json) |
| 1.2.2 | 25 | Author repaired labels/bounds before handoff; coordinator normalized metadata naming only | [PASS](122-review.json) |
| 1.2.3 | 25 | Author refined retrieval example and bounds before handoff; final artifact bytes unchanged afterward | [PASS](123-review.json) |
| 1.3.1 | 26 | Author repaired graphs/layout before handoff; coordinator normalized only manifest naming afterward | [PASS](131-review.json) |
| 1.3.2 | 30 | Author repaired labels/data precision/layout before handoff; artifact bytes unchanged afterward | [PASS](132-review.json) |
| 1.3.3 | 27 | Author repaired labels before final v4 handoff; final artifact bytes unchanged afterward | [PASS](133-review.json) |

The root coordinator inspected each of these 259 native PowerPoint renders individually, read every slide's teacher notes, checked the actual target context/questions against the current edition and independently recalculated the answers. The JSON records bind PPTX/PDF and all inspected render hashes. Matching PDFs were checked on every page for text and page-count agreement, with additional visual samples. Native render samples stay in the hash-checked local review archive; the delivered PPTX/PDF pairs and review records are in the repositories. This is file and planned-teaching review, not a classroom timing or learning-effect measurement.

## Production experiment

Fresh authors have no conversation history and receive only `Build the PowerPoint for paragraph 1.X.Y.` plus an environment wrapper naming their dedicated platform/lessons pair and the parent integration role. They receive no answer plan or new sibling presentation. These are Git worktrees on a shared operating-system filesystem, not an OS isolation guarantee.

The first two authors use platform `dbaf16bf02db94e27ba418dd4dd0684a1a29e0bb`; the next five authors use `27536dc220657c657665d013d4f9c7bed9c06231`, which adds only a generic instruction to derive filenames from the sealed student PDF stem. All use lessons `173aa9a803897965c572df2c4e7f83cdb135eb1c`. From §1.2.3 onward, platform seed `04a549d40cbc2937bff29344b6ac2155894c4c3e` adds the exact generic manifest filename, with no new sibling slide content. Private original/intermediate outputs are retained in their author workspaces or hash-checked local archives; clean completed worktrees may be retired after ownership release. Detailed final selection and continuity evidence will be added after the remaining authors finish.

## Retirement and source preservation

The finite retirement deletes the three old HTML/PPTX pairs, four images used only by those presentations, and the two Book 1 presentation support files. Four entry documents lose their obsolete presentation link/tile. The archive remains intact. A deterministic lesson-map section links the twelve new presentations and evidence beside the sealed second-edition student PDFs.

The separate classroom scope adapter verifies every one of the 376 sealed lesson bindings and preserves the edition receipt, pins and reviews. Legacy fixture production writes outside the active lesson repository. The historical Y1 capture is verified at its original inputs; it explicitly does not attest the newly retired pages. The current pair's finite retirement and landing transforms pass their separate checks.

## Local technical verification

The earlier full platform suite passed: 143 suites, 2,328 tests, eight skipped tests and zero failures. See [local check record](technical-local-checks.json). A subsequent finite retirement classification was added to the general lane checker. Its focused tests pass; a complete rerun and final published-pair CI remain pending.

## Remaining work

Finish and independently review the two remaining mixed-exercise decks, check the complete serialized teaching sequence, bind the final delivery, complete the actual-pair compatibility checks and publish the bundle PRs. No complete-series acceptance or merge is claimed at this checkpoint.
