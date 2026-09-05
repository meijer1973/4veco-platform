# Independent successor-binding plan review — REVISE

Date: 2026-09-05. Reviewer: paragraph_213_r6_independent_review, independent of
codex-root, the plan author. Technical dependency-plan review only; no incoming
pin, test, lesson source, canonical review/QC/handoff or historical evidence edit.

## Exact subject

Platform 788145fbdbb8731c8dd7d836a07cf259932780e2,
`reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-successor-binding-plan.md`,
canonical-LF SHA-256
`a1817d2396ca255a0fd42fa05b42a49b1117cc9333791d9b14ba1fcdc1fd9133`.
Paired lessons80977d94dcf3705841b6541b7cde1ee91dd767ee remain untouched.

**REVISE for one concrete guard-compatibility correction.** The dependency
ordering, exact hash semantics, fail-before-process requirement and immutable
history policy are correct. The permitted test-change language does not yet
allow a legitimate successor to pass the newer exact §212 metadata regression
guards. Resolve that explicitly before the affected implementation; do not
disable, bypass or silently weaken those tests. Unrelated planning remains free.

## Required correction S-1: specify exact successor expectations for whole-file guards

Subject lines 49 and 60–61 say current historical tests remain intact and source
diffs are limited to specified hash literals plus new tests, with prior tests'
AST/meaning retained. Read-only newer root
`13b7ac8e1a000878f50a3d70ce1017327820d8e2` contains
`build-scripts/content/book-2/212/test_metadata.py`. Its original R6 commit is
`89a8fc34f7c017b10af86d6b058bf6ba21328367`; I independently verified the complete
test file is identical at both refs.

- `test_unchanged_generator_outside_title_loop` builds the entire expected
  b2_212.py from immutable798cacfeeb40e4e0ba54d26f2b040cbdeec327a9 plus the exact
  five-title loop edit, then asserts `self.assertEqual(current,expected)`.
  Neither old prerequisite hash is substituted. The current R6 generator equals
  that expected string exactly. An in-memory change of only PRIOR_REVIEW_HASH
  makes the same equality fail. No test or actual generator was changed to
  demonstrate this.
- `test_nine_exact_native_insertions_and_unchanged_full_sources` compares every
  byte of four paragraph source texts with the historical source plus exactly
  nine native alt insertions. The separately authorized missing-bonus-criteria
  correction cannot satisfy that unchanged full-source expectation either.
  A successor-binding-only builder must not quietly add that student correction;
  its accepted corrected baseline must already include a precisely reviewed
  expected-source evolution for the bonus change.

Thus merely adding new tests and retaining both exact current comparisons
unchanged is incompatible with the authorized transition. This is an actual
guard-contract conflict, not a request to allow arbitrary prerequisite hashes.

Required plan correction: inventory the full-file/source guards on the actual
published starting baseline and expressly allow narrowly reviewed expected-
successor evolution in these two named tests when their exact authorized change
requires it. Specify immutable historical baseline and full expected successor,
exact paths, accepted predecessor commit/record identities and old→new hash
literals. For the pin phase, allow only the two accepted hash replacements in
the expected generator; compare everything else exactly. The prior bonus phase
must have its own exact source expectation, not broad text stripping.

Keep the original ten `212/test_source.py` tests and their AST/meaning intact.
Retain all R6 metadata assertions, nine insertion count, old long-alt negative
fixtures, five contextual title checks, title-negative fixtures, and complete
source/caption preservation except the explicit authorized bonus delta. Do not
skip a test, filter away source blocks, normalize arbitrary differences, accept
multiple unreviewed hashes or make assertions tautological against the current
file. Preserve the immutable original test/source revision in history and name
the new exact expectation independently; this review does not edit either.

Proof to close: revised bounded plan text naming this compatibility issue and
its exact permitted expectation transitions. Later implementation must show the
new accepted inputs pass, each changed/unexpected prerequisite still fails
before subprocesses/output writes, an unrelated generator/source edit still
fails whole-file comparison, all original economic tests pass and the downstream
student packet remains byte-identical to its then-current accepted baseline.
This blocks the affected §212 successor step under the current test-change
contract; it does not invent an all-paragraph barrier or block §231 planning.

## What passes this plan review

Personally inspected the actual generator functions, not only the plan table:

| Consumer | Incoming acceptance pins | Actual check semantics |
|---|---|---|
| b2_212.py | §211 review and quality-ref | `lf_hash`: UTF-8-sig decode, CRLF/CR→LF, UTF-8 SHA-256 |
| b2_213.py | §211 handoff; §212 handoff, review, quality-ref | Four `lf_hash` checks in prerequisite_pins |
| b2_213.py separately | §212 paragraaf.md | Raw file SHA-256 through `digest`, not LF normalization |
| b2_223.py | §221 handoff, review, quality-ref and paragraaf.md | All four `lf_hash`, including the Markdown source |

The plan correctly excludes each consumer's own plan/chapter/target pins from
this transition. It correctly does not invent incoming acceptance hash changes
in221/222. The §213 source check really differs from §223's source semantics;
using one blanket hash normalization for all records would be wrong.

Executed seventeen isolated in-memory negative probes against the actual three
build functions: every plan/chapter/incoming LF check individually, and the
separate §213 raw-MD check. Each produced ValueError before any subprocess,
mkdir, write_text or write_bytes call. This includes eleven incoming acceptance
checks (2+5+4), plus six own plan/chapter checks. These are guard-order probes,
not a full build or proof of an as-yet-unselected accepted successor.

The sequence is correctly dependency-scoped: accepted211 →212, then accepted211
and212 →213; accepted221 →223 independently. Its explicit paragraph below the
numbered steps removes any apparent global barrier in step1. No incomplete QC
is promoted into handoff authority. Root owns acceptance and current lineage;
the builder and separate integration-delta reviewer do not self-accept.

Requiring exact unchanged own student MD/HTML/PDF/SVG/PNG/ZIP and page/member
bytes is appropriate for pin-only rebinding. Generation input hashes necessarily
change with generator constants; therefore a fresh input→generation→review
record is needed even if student bytes do not. The plan states this correctly.
Old PENDING manifests and source checkpoints remain immutable. Next-unused rN
captures preserve `render_proof`'s nonempty-directory rejection. Original raw
archives/member hashes remain proof obligations, not just file counts.

The runtime distinction is supported by actual existing §223 root verification:
inherited Cairo runtime produced different PNG/student packets; explicit
C:/Python314/python.exe with C:/msys64/mingw64/bin first and extended Windows
lesson path reproduced the candidate. This plan properly retains that §223-only
runtime and inherited PATH for212/213. I did not run the §223 full build here or
import that runtime into the read-only guard checks.

Both profiles, currentness/durable authority, committed actual-base scope and
separate payload/scope/index tails are appropriately required. An unchanged
student packet may use a separately reviewed exact integration-delta acceptance;
that must remain distinct from historical full paragraph/QC decisions and root
must bind whatever current lineage records it actually accepts. The plan does
not authorize deleting history, reviving a stale source hash or future merges.

## Evidence and boundary

Shared read-only evidence is in this review's uniquely prefixed
`BOOK2-TEXTBOOK-PRODUCTION-1-231-plan-independent-probes.js` and corresponding
checks JSON. It records exact plan and foundation hashes, full newer/original
§212 metadata identity, concrete equality conflict, seventeen real guard probes,
existing CLI help, scoped currentness and durable twelve-record authority PASS.
The §231 plan verdict is separately reported; this file does not combine the two
acceptance decisions. The narrow evidence-only lane FAIL is retained separately
alongside actual committed whole-candidate scope and strict own-path audit.

No canonical plan or test was corrected; no source pin was rebound; lessons and
all historical review/QC/handoff/target/hold data are unchanged. There is no
student-output change, so rendered proof is not applicable. No full regeneration,
paragraph/QC acceptance, root handoff, classroom observation, full suite/new-head
CI, PR or merge is claimed. Stop here for root to route the bounded correction
and independently review the revised plan before affected execution.
