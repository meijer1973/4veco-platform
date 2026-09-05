# §2.1.3 R6 — bounded accessibility correction candidate

Builder: `paragraph_213_alt_builder`, 2026-09-05.
Task `BOOK2-TEXTBOOK-PRODUCTION-1-213-ALT`, under the combined #229/#223 task.
Status: implemented and builder-verified candidate, **not independently accepted**.
Distinct paragraph rereview, specialist QC and root handoff remain required.

## Scope and exact correction

The paired claimed branch is `agent/book2-213-alt-correction-20260905` under
`C:/wt/book2-213-alt-correction-20260905/`. Exact platform/lesson bases are
`199772e2aa586fce0f71b647ed5188e568dba2e5` /
`4c4cd7d0c1d2e5242c818399a96dce3e26013e9c`. The read-first bounded plan is
`BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-correction-plan.md`.
I read the full final distinct specialist REVISE report published in platform
`25e3bdf696b84f8005fe30ce435efd0be8d95c4d`, as well as the root's committed
`B2-SHORT-ALT-01` finding. The complete required set is corrected, not waived.

Three native Pandoc `alt` attributes were added, preserving their full original
caption brackets and every surrounding source character. The actual new HTML
alternatives are:

| Asset | Old/new characters | Actual new alternative |
|---|---:|---|
| fig3 | 158 / 114 | MO bij vaste prijs: 80 euro extra opbrengst voor 10 extra fotohouders in beide intervallen, dus 8 euro per houder. |
| fig4 | 155 / 106 | Winsttoename per extra fotohouder: 5 euro in interval 0–10 en 3 euro in interval 10–20, telkens MO min MK. |
| we1 | 160 / 105 | Eindpuntrijen van Lus en Bout: MK 2/2/2 tegenover 2/6/10; MO steeds 6 en 12 euro per extra sleutelhanger. |

All begin with functional noun phrases. Fig3 identifies equal interval MO under
the fixed-price assumption; fig4 distinguishes normalized profit change in two
named intervals from total profit; we1 identifies the two workshops' endpoint
patterns with the unit. Their full visible captions and adjacent long descriptions
retain all detailed totals, fractions, intervals and limitations. The we1
alternative occurs in both pupil editions. Other alts remain exactly 101, 113
and 60 characters (fig1, fig2, ex1). All eight actual HTML occurrences were checked
against the exact embedded PNG bytes and caption text, not merely Markdown.

The one allowed SVG title change is:

- Old: `Vergelijk de drie eindpuntrijen van Lus en Bout; constante en stijgende MK`
- New: `Drie eindpuntrijen van Lus en Bout; constante en stijgende MK`

The new title is 61 characters and preserves the three endpoint rows and constant/
rising marginal-cost contrast without an imperative. All six SVG accessible names
and role/ID bindings pass; the other five titles are untouched. we1 SVG raw SHA-256
changes from `700dc46322fb0fc527f1c2b84efdf018edd15f479f2e3bc25bdd496251d65461`
to `66fe52b99ff706c9a81d5ba699d5575d04f18f974205902bf45a8ad8cd2c148d`.
All drawing-body bytes and all PNG bytes remain identical.

## Actual native DOM and artifact delta

Pandoc's native distinct-caption route changes exactly four actual `img.alt`
occurrences (paragraaf fig3/fig4/we1, opgaven we1), removes `aria-hidden="true"`
from their four corresponding full figcaptions, and reflows HTML soft whitespace.
The removal makes the different long caption available to assistive technology;
it does not hide or delete educational detail. All full caption words and the
complete normalized HTML DOM/text are identical after excluding only those
enumerated metadata attributes. Unaffected captions keep their existing native
attributes. No pipeline, CSS, sanitizer or PDF renderer was changed.

Exactly seven of 24 artifact files change: the two pupil MD/HTML/ZIP triples and
we1 SVG. All three PDF files, all 29 final rendered page PNGs, all six asset PNGs,
all six SVG drawing bodies, and the complete answer MD/HTML/PDF/ZIP are byte-identical
to R5. ZIP inventories stay 15/7/3 members; changed member CRC/bytes are restricted
to each pupil edition's MD/HTML and we1 SVG. Every other member remains exact.

| Edition | Pages | Unchanged PDF SHA-256 |
|---|---:|---|
| paragraaf | 14 | 534177c8280eddd4785dce1491856c33c96cd698ae558b5136bdb206a79c7024 |
| opgaven | 9 | d12487671bd2f2cfe329f59bc9c48cfec5f03b871626c5c4016e88c2646d5f05 |
| antwoorden | 6 | aa3b6ccc9dbb0114854e835bc3a4ec01428f219eef82aba09ba9fd0949ce976a |

The full final 24-file hashes, old/new alternatives and titles, exact ZIP member
hashes/CRC, all page hashes and protected input hashes are in the final delta
record. It also verifies the complete theory/exercise sources against the exact
published base with only the three new attributes removed, and verifies the entire
generator differs only by the one permitted title. Historical 211 handoff and 212
handoff/review/QC/Markdown pins are unchanged; no new prerequisite is self-authorized.

## Executed checks and immutable evidence

All Python checks use explicit `C:/Python314/python.exe` with inherited PATH, no
MSYS prepend. The first build used an extended exact lesson-root path with normal
platform cwd for Node. Full/print rebuild used the normal-root verifier successfully.
Native r6 destinations were absent before generation. Old R4/R5 evidence remains
untouched; new proof manifests also retain PENDING/empty inspection lists.

| Executed check | Result |
|---|---|
| Source tests, including native production `prepare_html` route | 13 PASS (10 existing, 3 new) |
| Negative original-alt/caption-loss/imperative-title probes | Rejected as required; no output mutation |
| Six actual SVG→PNG rerasterizations | Zero changed pixels, zero maximum channel delta, identical raw PNG bytes |
| Actual HTML inventory/captions and SVG title bindings | All six unique figures/eight HTML occurrences PASS |
| Frozen source/render/table/answer/ZIP checks | PASS; unchanged 10/6 blanks, five prompts, 4+3+2+4+2=15, Q0 dashes and nine exercise IDs |
| Full generator rebuild | All 24 artifacts reproduced byte-identically |
| Print-only rebuild | All 24 artifacts reproduced byte-identically |
| Old/new actual artifact, native DOM, page and protected-source comparison | PASS, exact bounded delta |
| Both normal Part A profiles | student-web and publisher-print PASS |
| Approved-use §213 production currentness and durable target authority | PASS; all twelve frozen records unchanged |

Normal validator recognition of existing review/quality files is structural,
not fresh R6 acceptance. The old quality-ref is not promoted by this report.

Machine records below are in `reports/sprints/`, prefixed
`BOOK2-TEXTBOOK-PRODUCTION-1-213-`:

| Record suffix | Raw SHA-256 |
|---|---|
| alt-build-r6.json | c1eb06dc784f2e09c9b4996d970470b4a703151d2bdb88004e99461ad0ff8fde |
| alt-render-r6.json | ebe88287490086c0bbebdf968d7f6aab611ea3be1414599b64650a759874edcb |
| alt-rebuild-r6.json | ff1130f22e2f4348945f4e49bc5c3b050162fd15ed7469b6d6e853384366412e |
| alt-final-delta-r6.json | 613569e2ebaaf749036ffc132b96b3ab0ad28b25bd5ac6921e7741199cdb8ba6 |
| alt-before-native-r5.json | 8c6915c3516d3e83436e4e8b924f63e9b2e37e4b4ee5d1f76637efd12759b18a |

Command timestamps, cwd, exits, output hashes and excerpts are preserved in the
task-owned `BOOK2-TEXTBOOK-PRODUCTION-1-213-ALT-command-log.{jsonl,md}`.
No full platform suite, final-head CI, future PR or merge is claimed.

## Personal builder visual inspection

I personally opened each final full-page image at readable scale in the three
fresh r6 directories below, not just contact sheets and not another agent's views.

| Proof directory under reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/ | Full pages personally viewed | Manifest raw SHA-256 |
|---|---|---|
| 213-paragraaf-534177c8280e-r6 | 1–14, every page | 14f2020fc087e4d9954800e67c5ad4786229676dae238ef0f9679379d10c7d60 |
| 213-opgaven-d12487671bd2-r6 | 1–9, every page | b4bf7ebb40d51ab1cf11020fcd6b3acfd76b1294b9e5fbe30316ffaf446d8cb9 |
| 213-antwoorden-aa3b6ccc9dbb-r6 | 1–6, every page | f223e1555481af15766a8b9a4883584a111bf0260a607719dc39ba55dff6c2d9 |

Paragraph pages 1–4 preserve the four goals, prior knowledge, original cost table,
both interval arrows, normalized MK/MO, endpoint warning and two-interval profit
bridge. The fig3 full caption on page3 is complete and legible. Page5 retains the
entire fig4 two-card comparison/caption and begins the worked example. Pages6–7
retain Lus/Bout source/completed tables, ratios, all we1 labels and full caption.
The isolated final 6 in the existing fixed-price explanation on paragraph6 and
opgaven2 remains a minor readable line wrap, not a new defect or changed symbol.
Pages8–12 retain recap, Start1/2, the faded bridge, optional patch/unequal-width/
combined-input practice and unsupported Draad/Kaft operations without clipping.
Pages13–14 preserve the native frozen Linea/Curva tables and all five prompts;
d/e continue clearly to page14, followed by optional transfer and brief retrieval.

Opgaven pages1–3 retain the full worked example and recap, including the we1
caption on page3; page4 contains both Start roles. Pages5–7 retain optional and
independent practice. Pages8–9 retain target tables/questions and the closing
tasks. Answer pages1–3 show readable steps and units for Start/guided/independent
work. Pages4–6 preserve both completed target tables, all five item allocations,
the 15-point table, bonus limitations and closing answers. No missing glyph,
clipping, collision, lost row, missing asset, stray attribute markup, stranded
heading or illegible label was found anywhere on the 29 pages.

I also personally opened all six final standalone asset PNGs and all five fresh
150-DPI grayscale paragraph captures (pages2,3,5,7,10 in
`BOOK2-TEXTBOOK-PRODUCTION-1-213-alt-grayscale-r6/`). Interval arrows, direct
TK/TO/MK/MO labels, endpoint placement, ratio cards and the support-fading panel
remain understandable without colour. Every label is visible. The actual render
check measures minimum body/table/footer12.0pt and placed figure labels15.685038pt.
These builder observations supplement, not rewrite, the generation manifests.
The PDF skill's render/inspect workflow applied; the root's existing41-output
operation was not duplicated.

## Incidents, limitations and next gate

Read-only discovery initially guessed `ROADMAP.md` and a one-level-short pipeline
path; both misses were corrected through file discovery. No source mutation
resulted. A supplemental before-snapshot diagnostic held BeautifulSoup attribute
dictionaries by reference, so its `caption_attributes` diagnostic field was emptied
by normalization. Its immutable raw caption strings, artifact/page hashes and
normalized DOM hashes were correct and are preserved. The corrected verifier
copies dictionaries, reconstructs original attributes from the retained raw
captions, and tests the exact four removals. No record was retroactively rewritten.
The initial plain before snapshot and first delta record also remain intact.

`npm ci` succeeded and reported eight dependency advisories (1 low,1 moderate,
6 high); no dependency fix or unrelated lockfile change was attempted. This is
not a current vulnerability-resolution claim. No production/test failure was
masked, and no tolerance, source restoration or assertion monkeypatch was used
to obtain reproducibility.

Frozen targets, historical approvals, all16 protected source files in the snapshot,
the two-interval bridge/Start2, plans, holds, canonical reviews/quality/handoffs,
shared helpers and other paragraphs are unchanged. H-213-OPC2 remains excluded.
Core54, supported66 and all-item78 minutes remain unobserved estimates; no classroom
timing/attainment, blanket accessibility certification or current Inspectie mapping
is asserted. Root owns separately accepted prerequisite successors and any later
explicit pin-update task. Next: distinct exact-candidate rereview and specialist
QC, then root's gated continuation; no self-approval or merge authorization.

## Committed candidate scope

Platform payload `420326feb3961981f7673eddb0c8bf49469a75d8` contains the seven
paragraph-owned source/check files and51 fresh evidence files. Lesson payload
`56f43382946a079fdc5ff6f6e67d3d246b4e4e01` contains exactly the seven enumerated
metadata/output changes. Committed platform shared-lane and lesson textbook-lane
scope checks passed against their exact starting commits above. Both staged
whitespace checks passed. The generated command-log Markdown was mechanically
normalized to LF with trailing whitespace removed; raw JSONL evidence was not
rewritten. A following evidence commit records these executed scope results;
generated URL/agent-index files are kept in a separate tail, not content authority.
