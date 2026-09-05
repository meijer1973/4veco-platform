# §2.1.3 R7 bounded correction candidate

Builder: `paragraph_213_bonus_correction_builder`; root remains sole integrator.
Status: implemented and locally verified candidate; independent R7 paragraph
re-review and separate specialist QC are still required. This does not supersede
the current R6 specialist REVISE or alter canonical acceptance records.

## Exact correction

Only student-source edit: three Dutch assessment-criteria bullets appended after
existing bonus8a–c model answers and before Herhaling in
`build-scripts/content/book-2/213/answers.md`. Each recognizes an existing
response requirement: K's unequal denominators4/8 and MK3/3, L's5/2 comparison
despite equal terminal TK56, and the unavailable fifth-unit cost without TK5.
No new points, operation, model answer, question or teaching content.

Exact insertion-only source proof and generated-MD removal proof pass: deleting
only the added label/bullets restores every original R6 byte. The answer HTML
DOM likewise matches R6 exactly after deleting that label/list (ignoring only
text-source whitespace). The original13 tests remain byte-identical and pass;
four complementary bonus tests pass, including the verbatim R6 missing-block
negative fixture plus location, count, reversed-pattern and denominator negatives.
The exercise-builder §4.4 requirement drove the bounded addition.

## Measured outputs

| PDF | Pages | SHA-256 |
|---|---:|---|
| paragraaf | 14 | `534177c8280eddd4785dce1491856c33c96cd698ae558b5136bdb206a79c7024` |
| opgaven | 9 | `d12487671bd2f2cfe329f59bc9c48cfec5f03b871626c5c4016e88c2646d5f05` |
| antwoorden | 7 | `d96f21c3abed471f3a12dd318cb1485043fe557e4a4d4b54034407763ae87787` |

Only answer MD/HTML/PDF/ZIP change among24 native artifacts. The other20,
including all12 SVG/PNG files and both pupil PDFs, are byte-identical to exact
lesson baseline `5d67998d1e1d1aa5497d59850b53aebc780eaa96`. ZIP contract15/7/3,
CRCs, deterministic timestamps and all member bytes pass. Answer ZIP SHA-256:
`9d1a0197cd02451e2168a31472ce5351aef9bd9169e8af535b261ba2353930a1`.
Answers grew6→7pages; all bonus models/criteria fit on page6 and unchanged
closing answers move to page7. No answer-model split was introduced.

Full native generation used explicit `C:/Python314/python.exe` with inherited
PATH. Unchanged `check_render.py` passes; it has no --rebuild flag. Unchanged
separate `verify_rebuild.py` proves exact24-artifact equality for both full and
print-only rebuilds. Native R7 proof directories are hash-named, with all30
pages personally inspected, plus six actual figures and five grayscale pages.
Personal observations are in the companion `BONUS-inspection-r7.md` record.

## Preserved authority and acceptance state

Platform baseline is `984547a17c966d3749d08ef34b92747de21eacbf`, not the root's
later §212 branch. The target registry, outline/meta, generator, print pipeline,
all other student sources,13-test file, native render/rebuild checkers, all plan
and prerequisite files remain byte-identical. Current-action approved outline
check and durable twelve-target authority pass. H-213-OPC2 remains open/excluded;
no hold, target, historical approval or successor pin changes.

Canonical paragraph review remains R6 at raw SHA-256
`a70fd9571cea3afc5861d1b91dc99c102757767e0fb9d66da211602a90c82d66`.
Canonical legacy QC remains exactly
`c96a4af45cfbf6c43ceda27ecf6dd231c75667ece58b378b9080975fe4be717f`.
Handoff remains absent. The initial R6 specialist PASS was explicitly superseded
by the full `R6-QC-disposition-successor.md` required REVISE; this candidate does
not rewrite that history. The withdrawn Draad suspicion stays withdrawn:
fresh direct-PDF extraction records all30 cell rectangles and exact correct
Q8=8/28/40/12/1/5 and Q12=12/32/60/28/1/5, without altering its table.

Both actual part-a profiles (`student-web`, `publisher-print`) pass. These
validators recognize the historical review/QC files structurally; that is not
a new acceptance claim. Parent bundle passes in **planned/active** mode, not
whole-book completion. Actual committed scopes and publication follow in a
separate scope record after payload commits. No PR, merge or CI-pass claim.

## Honest diagnostics

All actual test/build/validator command attempts are retained with real exit
codes in `BONUS-evidence-r7/command-log.jsonl` (including inherited PATH).

- Expected pre-correction bonus run: three positive tests fail, historical
  missing-block negative passes. This demonstrates the actual R6 omission.
- Three early post-correction focused runs exposed new-test assumptions:
  Pandoc wraps text-source whitespace; native print uses section containers;
  closing h2 source text also wraps. The regression now normalizes rendered
  whitespace and crosses the native container with `find_next('h2')`. No native
  render checker, output, model answer or tolerance was changed to fix these.
- Delta probe initially read JSON using Windows's implicit encoding, causing
  an en-dash filename lookup failure (two logged attempts). Fixed by explicitly
  decoding both UTF-8 JSON inputs. No filesystem or Git names changed.
- First direct-PDF table probe assumed the detected header was the first row;
  PyMuPDF merged nearby prose into that detector region. Final probe finds the
  exact header and four consecutive rows and verifies30 separate rectangles.
  This is extraction-only probe repair, not a document defect or table patch.
- Read-only discovery attempts also included nonexistent guessed report paths
  and a Windows rg wildcard-path error; no writes or content conclusions followed
  from them. Truncated instruction reads were resumed in bounded chunks.
- The first staged diff check detected CRLF line endings in the newly generated
  delta JSON. The payload commit was already issued in that sequential tool
  batch; a follow-up evidence-only commit fixes LF serialization and normalizes
  that JSON without altering its parsed data. The original commit and logged
  failing committed diff remain available; the final candidate diff must pass.

No failed build, native render, rebuild, currentness, durable authority or
profile run is hidden. Empirical timing54/66/78 remains unobserved. Part B,
chapter/book assembly, current Inspectie mapping, formal output choice, CI,
independent R7 reviews and final integration remain outside this builder result.
