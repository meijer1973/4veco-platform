# §2.2.1 root adoption and reproducibility verification

Date: 2026-09-05. Accountable coordinator: `codex-root`.
Status: **REPRODUCIBLE; INDEPENDENT ACCEPTANCE PENDING**.

The builder's published platform commits e758d06dee6b553bc64d487e48a0c841021c2885
and 5ab950112d2e0f369b0cbe314d1947877272a56d were adopted as b5769b75 and
1e14df2b. Its lesson head 71286d417d922f5470bf663fd866df39bed8b6f0 was
adopted as dd01bbd. This is candidate integration into the isolated production
branch, not independent paragraph approval or a merge to main.

Root read the complete four authored sources, builder, final builder reports
and all twenty final R5 pages individually at normal reading scale: paragraph
pages 1–10, exercise pages 1–6 and answer pages 1–4. No visible clipping,
overlap, unreadable table/figure, answer-label orphan or missing target part
was observed. The large target-page remainder is usable working space; no
target operation is omitted to reduce page count. Long answer continuation
occurs at labelled steps/subquestions. Root's inspection supplements, and does
not replace, the separately assigned non-author paragraph review and specialist QC.

The exact Nova/StreamNow target remains nine points, with signed Ev −0.8 versus
−2 and the correct absolute-value interpretation. Root re-solved every source
case and checked that explanations about alternatives are possibilities, not
causes proved by these observations. Old-base retrieval and printed repair,
explicit-to-reduced-to-independent practice and optional support remain intact.
The 48.5-minute core is an estimate; classroom pacing and attainment are unobserved.

## Fresh root execution

Through the existing structured sprint command runner, root executed:

- `C:\Python314\python.exe build-scripts/content/book-2/221/test_source.py`:
  nine tests PASS.
- `C:\Python314\python.exe build-scripts/content/book-2/b2_221.py --manifest reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-root-rebuild.json`:
  PASS, including approved paragraph-production currentness and durable frozen
  target authority before output writes.
- `C:\Python314\python.exe build-scripts/content/book-2/221/check_render.py`:
  PASS on the immutable builder manifest and its final R5 files. This check
  follows the manifest's explicit original builder paths, not the root paths.

A separate read-only PowerShell comparison verified 43 raw hash references
in the root worktrees against the builder package: six build inputs, nine
MD/HTML/PDF outputs, eight asset references (including the repeated worked
figure pair), and twenty page PNGs. All three imported proof manifest raw
hashes also match their final builder-inspection pins. Thus the original-path
mechanical render checks apply to byte-identical root output, not an assumed
equivalent rebuild. The lesson worktree remained clean after rebuilding.

| Edition | Pages | PDF SHA-256 |
|---|---:|---|
| paragraaf | 10 | `e493735b1dce12fc6135769b73c2e08f63fdecc7b84f041ddd0c456b9348fe6d` |
| opgaven | 6 | `48af0e7d2f6fbd10b9f2ca19182e36fa1da8b125e045aba4111aa377e0087a82` |
| antwoorden | 4 | `d4a7c139d49276e80c23f4eda1cfab7841d063b204d7a9bb70cd225a796e5b5d` |

Source/HTML/asset hashes are in the builder and root build JSONs; every page
hash and each immutable proof manifest hash is in the builder-inspection JSON.
The three proof manifests remain PENDING with empty inspection arrays; no
historical manifest, review or quality-ref is promoted into fresh approval.
Measured body/footer minimum is 12.000pt; minimum placed figure label is 12.221pt.

Independent reviewer `paragraph_221_review` has the exact published heads and
all-page assignment. Specialist QC, fresh lane-owned review/quality-ref,
handoff and both Part A profiles remain required before downstream teaching
may rely on this paragraph. No final package CI, classroom readiness, Part B
authority or future PR merge is claimed here.

Read-only navigation mistakes were corrected without changes: root first
looked for a lesson commit and the §213 report inside the §221 platform tree,
then queried the correct repositories; an earlier root rebuild report has a
`.json`, not `.md`, extension. These failed lookups are not passing evidence.

The first root adoption evidence commit also included raw Windows CRLF from
Python stdout inside the Markdown command-log excerpts. `git diff --check`
reported those bytes, but the shell command sequence did not stop the commit.
Root corrected this with an LF-only mechanical format of that one Markdown
log (94 CR bytes), then reran diff validation with explicit failure stopping.
The JSONL's original escaped output, timestamps, result codes and output hashes
are unchanged. No proof manifest or student output was normalized. Subsequent
commit commands stop on failed checks; this was not a clean first-pass diff.
