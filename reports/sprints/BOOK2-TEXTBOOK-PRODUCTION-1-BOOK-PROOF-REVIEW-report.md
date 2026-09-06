# Independent Book2 proof namespace tooling review

Date 2026-09-06. Reviewer paragraph_231_specialist_qc; implementation author
codex-root. Task BOOK2-TEXTBOOK-PRODUCTION-1-BOOK-PROOF-REVIEW.
This is distinct from the reviewer's closed232 plan-author work.

## Verdict

PASS against exact source payload e5edeb270120bc9ae041673267adddcd5575766f.
No blocking implementation defect found in the requested unused-namespace
mechanism. No implementation correction is requested. Root remains sole
integrator; this review is not root integration, actual assembly authority,
student visual acceptance, fullCI or a PR merge grant.

Reviewed source baseline8bd4bd66fa0352a770f5069c50ee1bbdf2f651bd;
author evidence48cc4a9b6bcc88f4cc6e07e01b9251bd8d662804;
published review input Pefbac988f46b9daccacb47cdf90cd88d01430733 /
L30f57bfad2096c7afa507da48db9d82ee35a3c23. Operational review plan committed
before test execution at45b3ff0943ae870c6fbda474ed28132bafd10df4.

## Exact source binding and personal inspection

The complete four source files, their full delta, original print/chapter/book
fixtures/tests, common-book tests, CLI and common dispatch were personally
read. Author plan/result/scope/publication were inspected separately from
the new evidence. Both AGENTS, strategic specs, Part A/assembly workflow and
book/chapter/PDF skills informed the review. Previously personally read
unchanged Part A references were checked for exact source-diff equality.
Generic legacy11pt/website-answer recipes do not override the current Book2
paper-only12pt profile; this patch changes neither renderer nor teaching.

Raw and Git SHA-256 are identical for each reviewed source in this checkout:

| Source | SHA-256 |
|---|---|
| build-scripts/books/build-book.py | 804022f8ecae79798538588f9595d8409062d17010935335b97fcb78178f31e2 |
| build-scripts/books/lib_book.py | 38858fca44192c4470c501adeca30f472ccde85a25ad714793fa8b3b1313e4f7 |
| build-scripts/content/book-2/book_pipeline.py | 263159ca85021c7d7addd2a628dbf2e4dc25e0f165c9a0ba11789ad3e15e6ab6 |
| build-scripts/content/book-2/test_book_proof_namespace.py | ba23a3ec99e3da5794ad49e2b4dfa4b68d75252613d5f4050be75cf248f9330b |

The whole common library preceding build_book and the exact legacy build
branch after detect_toolchain_versions are unchanged bytes. Original Book2
preparation helpers compare identically as ASTs; full original print/chapter
pipeline and all original test files are unchanged. The source diff adds
only the explicit option, bounded namespace validation/reservation and new
separate tests. No Book1 rendering, source authority or student content is
silently rerouted through the new profile.

## Core requirement findings

| Requirement | Independent evidence / conclusion |
|---|---|
| Default/Book1 isolation | PASS. CLI omission preserves exactly three positional arguments; explicit option is keyword-only. Legacy branch is exact, unsupported profile or nonBook2 explicit calls fail before legacy/native dispatch. |
| Namespace containment | PASS. Resolved path must be inside the declared platform task evidence; broad roots, wrong sprint, prefix-lookalike, traversal escape and native parent-junction escape reject before preparation. Validation alone writes nothing. |
| Occupation protection | PASS. Existing empty/populated directories and ordinary files reject before prepare/build; original contents remain exact. Dangling-symlink branch additionally checked with explicitly simulated state because native creation is unavailable here. |
| Authority and input order | PASS. Original complete prepare and both original Node gates precede reservation/output. Denial at either gate slot creates no proof or aggregate output. Manifest/front/chapter drift during authority is rejected before reservation. |
| Preflight/atomic collisions | PASS. Competing empty directory or file during authority fails before book writes. Exclusive mkdir collision preserves other owner. Actual Windows junction retarget within permitted scope during authority is detected by resolved-path inequality before either destination is reserved. |
| Failure consumption | PASS. Injected render failure consumes the new directory; reuse rejects before prepare, preserving failed-attempt state. No cleanup recycles the namespace. |
| Native reproducibility | PASS. Two actual native fixture builds at different allowed roots preserve six MD/HTML/PDF files, paired assets, all ten raw and decoded page pairs, original inputs and the entire first proof. |
| Honest evidence state | PASS. Four separate native manifests remain PENDING, pages_inspected=[], visible_student_defects=null, inspected_at_normal_reading_scale=false. No technical test marks educational or visual acceptance. |
| Scope | Review evidence only. Implementation, original tests, whole real lesson tree, all prior source/proof/authority files are unchanged except exact generated publication indexes. Genuine lane outcomes are separately captured; no invented source anchor. |

## Actual test execution

All commands used explicit C:/Python314/python.exe and MSYS-first CHILD PATH,
with UTF-8 command capture; no global runtime or configuration change.
Full actual stdout/stderr/exits are retained under this review's unique prefix.

| Command family | Actual result |
|---|---|
| unittest discover test_book_proof_namespace.py | 10 PASS;9.015s test runtime; original-namespace-process.json |
| unittest discover test_*pipeline.py | 39 PASS;13.241s; original-pipelines-process.json |
| build-scripts/books/test_lib_book.py -v | 7 PASS;0.007s; original-common-process.json |
| Independent probes.py r2 | 25 check groups PASS;13.390s process duration; independent-probes-r2-process.json / probes-result.json |
| Independent dispatch-race.py | 8 additional interface/race cases PASS; dispatch-race-r1-process.json / dispatch-race-result.json |
| Approved whole_book_assembly currentness | PASS0; foundation-process.json |
| Durable twelve-target authority | PASS0; durable-process.json |
| Active umbrella sprint bundle | PASS0; bundle-process.json; not terminal --complete |

Total56 Python regression tests plus33 independent check groups. They include
the payload's10 new namespace tests and49 pre-existing tests. The49 Book2
native tests (10 namespace+39 pipelines) were MANUALLY invoked; normal Jest's
existing lib_book.test.js wrapper covers only7 common-book tests. This review
does not claim that Jest/hostedCI ran all56 or gained new native-suite wiring.
The existing convention plus explicit payload-bound native commands meets this
bounded plan's evidence requirement. Root must preserve those commands in the
final package; current fullCI remains PENDING and is not waived.

Native fixture gates are deliberately stubbed only for their Node authority
subprocesses. Pandoc, WeasyPrint and Poppler ran normally. Gate-denial probes
exercise the real two subprocess positions with injected exit failure; their
synthetic outcomes are not actual owner grants. The three ordinary repository
currentness/durable/bundle checks above ran separately without those stubs.

## Native evidence and visual-inspection boundary

Two five-page fixture editions were built twice:20 page images in four
independent proof captures, compared as10 page pairs. Student-kind PDF SHA:
3852967b5c0f12b30f0fe064d1bc2c7bad6d5ac3eeb00d47fc36487928380af4.
Answer-kind PDF SHA:
82e53362b933178ec3677a65c890dd9deb2734aa59f6002a95f50b58f7e7bd1c.

The complete byte-exact technical fixture archive is
BOOK2-TEXTBOOK-PRODUCTION-1-BOOK-PROOF-REVIEW-native-fixture.zip,
SHA-2569fe93063368d98dc1d958930ee78bc13657fccbef1e932e454c42e4a90f7c63a.
It contains50 unique safe relative members, CRC checked, with every member
SHA and original temporary-root mapping in native-result.json. The archive
retains inputs, six native document files, assets and both proof namespaces.
Original manifests retain their original absolute fixture paths unchanged;
archive members map by removal of the explicitly recorded temporary prefix.
No copied manifest is rebound to a new path or misrepresented as live pupil
authority. Temporary fixture directories were cleaned by their context managers.

I personally inspected both contact sheets: distinct front, three chapter
markers and back appear in order; the student-kind technical rectangle appears
only in its intended second page. This is a contact-sheet fixture sanity
inspection, NOT full-scale all-page student visual/accessibility approval.
Raw/decoded equality is stronger evidence of unchanged rendering, but does
not establish that a future real book teaches well or is readable. Original
PENDING fields remain untouched despite this separate technical observation.

## Preserved failure and bounded limitations

Independent probes r1 stopped with Windows WinError1314 when creating a native
symbolic link. Full original failure is retained, not overwritten or called
an implementation defect. The reviewer helper was adjusted, not root source:
native Windows directory junctions test real escape and retarget behavior;
the dangling-symlink early-rejection branch is explicitly SIMULATED. No admin
privilege, Developer Mode or security/environment configuration was changed.
No new test assertion was weakened or original test rewritten.

Other limits are explicit, not blockers against the stated mechanism:

- Omitted proof_root retains the historical default collision behavior.
  Independent real rebuilds must select an explicitly unused root.
- This is not a filesystem transaction against every adversarial parent/path
  race after the last check, nor a lock over concurrent writers of the same
  real lesson output. Normal separate worktree/one-writer ownership still applies.
- A failed render can leave partial aggregate outputs and a consumed empty
  namespace; retry must use a new root. The change promises evidence separation,
  not rollback of every output write.
- Exact source hashes and ordinary outline/target gates do not manufacture
  independent acceptance of future book matter or chapter inputs. Those source,
  review/QC/handoff gates still precede actual assembly.
- Real Book2 manifest/matter/lesson outputs, student visual review, classroom
  timing/attainment, current fullCI and final lead review remain outside this
  technical review. No merge or scope expansion is authorized.

## Next action

Root may adopt this independent technical PASS for exact payloade5edeb27.
Use the explicit unused namespace only within separately authorized and
reviewed assembly work; keep manual native test evidence and current fullCI
requirements. The reviewer publishes evidence with exact remote-clean paired
indexes, returns importable commits and stops. No implementation fix is needed.
