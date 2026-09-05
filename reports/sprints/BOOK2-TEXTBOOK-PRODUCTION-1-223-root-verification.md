# §2.2.3 R3 — root candidate verification

Date: 2026-09-05. Accountable integrator: codex-root.
Status: candidate adopted and root-checked; **independent paragraph review and
separate specialist QC remain pending**. This is not a replacement for either.

## Exact adoption and output

Published builder platform source/evidence commits `e6f6db132c2f8c30d106cd621bf504973079de3b`,
`1d52021c30a9057727df1e2f4c05ae765914ed31`, `10f9425ee06fe372927f0d2980833110ca4edf99`
were selectively cherry-picked as `0ae129b2`, `f4cdac7f`, `7714bc77`.
Builder lesson content `b23e0056511fc5b9b10f0b8e6bbe130d2599c36b` was adopted as
`1146bd026cc1652bf3c389ca78e10fec34361ab5`. Generated builder index tails were
not imported. The verified root platform content head is
`7714bc7736dd687801de5a1c92217ea92b43e7d0`.

| Edition | Full pages personally viewed by root | PDF SHA-256 |
|---|---:|---|
| paragraaf | 1–15 | ca27f8bd6cbb3b596e5621280d76631c5561134e9e53c3556725c313fdf8aecb |
| opgaven | 1–10 | 50cf2bbeaa198c45d1832cf6112b0f50ccb0dfc3d171f110b2a09f2bb1f62f80 |
| antwoorden | 1–7 | 30cd682358c5eeb8cb6af53cf72e3ebcfc8feaf14856e3f671a850fe45de2e10 |

Root used the immutable R3 `pages/page-NNN.png` captures under
`reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1/223-<edition>-<hash12>-r3/`,
opening each full page at readable size, not contact sheets alone. Their three
manifest raw hashes are respectively `54a684ab32f7ac453f270867d18f70ccb097cecaa7e57f337fcc199772cab25d`,
`43f41e2c6377e13a629ad7f8b95aa38765906ae42d871bc763ffaadca9111128`, and
`b4b068c88c34fd00704f0a6ab3b8a9122f24c27a5b7ff2c582167968c6d75691`.
All 32 recorded page hashes matched the actual imported PNG bytes. Generation
manifests remain honestly PENDING with empty inspection lists; this later
root observation is separate from their generation state and builder evidence.

## Actual reproduction, including failed attempts

Seven focused source/calculation/geometry tests passed in the root checkout.
The first full generator attempt failed on Windows at the long paragraph HTML
path (261 characters) despite the parent/file being present. The extended
Windows lesson-root path resolved that access problem without a registry change.

The next full generator completed but used the default Cairo runtime rather
than the builder's documented MSYS-first process PATH. Four PNGs and the two
student HTML/PDF/ZIP sets differed; the answer edition was unchanged. Its
`BOOK2-TEXTBOOK-PRODUCTION-1-223-root-rebuild-r3.json` is retained as a **diagnostic
nonmatching build**, not accepted reproducibility evidence.

The actual successful full rebuild used explicit `C:/Python314/python.exe`,
`C:/msys64/mingw64/bin` prepended to this process PATH, and extended lesson root
`\\?\C:\wt\book2-part-a-production-20260905\4veco-lessen`. It regenerated all
MD/HTML/PDF/ZIP files and all eight SVG/PNG assets byte-identically to the builder
candidate. No manual file restore or historical manifest rewrite was used.
Lesson Git status returned clean after the correct generator run.

Current root rebuild record:
`BOOK2-TEXTBOOK-PRODUCTION-1-223-root-rebuild-r3-msys.json`, raw SHA-256
`99930938211e81ec71d1973e954483c65c5a66144f11447bac0f8264662ac31b`.
Root's read-only comparison verified 28 input/document/asset references against
current files and the builder manifest, plus all 32 immutable page hashes.
This is exact reproduction under the documented runtime, not a claim that
different Cairo installations produce identical PNGs.

Two validator invocation mistakes were also retained in the append-only command
log: a guessed nonexistent lesson-repository script path, then an unquoted
space-containing paragraph path passed through the Windows shell runner. The
correct platform `scripts/validate-paragraph.js` with explicit inner path quotes
passed both `student-web` and `publisher-print` Part A profiles. These passes
recognize unchanged historical June review/quality files; **that stale presence
is explicitly excluded from renewed acceptance**.

Fresh scoped approved-use §2.2.3 outline check and durable twelve-target lifecycle
check passed. Committed delta from root `92862e3` passed platform shared scope
(seven source/tool files and 43 evidence files); lessons from `abe7347` passed
textbook scope (21 files). No plan, frozen target, registry, hold or shared print
helper changed in this adoption. Full-suite/remote CI are separate later gates;
the earlier 1,872-test checkpoint is not this candidate's final-head CI.

## Source, mathematical and visual observations

Root read all four authored Markdown sources, generator, source/render tests,
stage-2 release and final builder report. Signed Ei categories preserve the
approved open boundaries at zero and one; the normal/luxury distinction does
not import Ev's absolute-value classification. Ek always identifies the
quantity good and other-price good. Annual income stays annual in substitution;
the coefficient is not an elasticity. One-input scenarios reset the baseline.

The full question chain contains printed retrieval, worked substitution,
guided support, reduced support and independent choices. The supplied
combined-input table asks pupils to reject attributing the whole change to
income; it does not infer causal identification from uncontrolled observations.
All five target questions, three sources, four goals and 16 points remain
intact. Target d gives 390→420, exact Ei=10/13 and final rounding to 0.77;
target e resets and gives 392, with the fixed inputs and positive direction.

All four figures were viewed in actual paragraph placement (pages 2, 3, 5, 8);
the reset panel was also viewed on opgaven page 2. Sign bars, open Ei boundaries,
named fraction goods, units and repeated/reset inputs remain readable and
consistent. The target fits on paragraph page 14/opgaven page 9 without answers.
The answer target spans logical groups a–c on page 5 and d–e on page 6, with
complete scoring and worked reasoning. No visible clipping, collision, missing
glyph/asset, stray markup or detached question label was found on any page.
Root did not perform a separate grayscale rerender in this check; distinct
specialist QC must supply its own complete visual/contrast acceptance.

The 54-minute core (69 with all support, 81 with all tasks) remains tight and
unobserved, especially target d's multistep chain. No numeric pupil timing labels
or classroom-attainment claims were introduced. §221's bounded presentation
correction does not reopen the accepted prerequisite concepts, but the final
current-head dependency pins need a truthful successor once R7 is accepted.

## Required continuation

Distinct `paragraph_223_independent_review` is assigned the published original
R3 candidate. A separate specialist must then review/QC the exact accepted
output. Root handoff, inventories and final package readiness remain pending.
See the cumulative corrections index for the §221→§223 runtime pin successor
requirement. No PR, integration authorization, or future merge is supplied here.
