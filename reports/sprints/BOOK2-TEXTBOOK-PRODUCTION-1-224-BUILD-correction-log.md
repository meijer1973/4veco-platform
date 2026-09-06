# §224 author correction log

The operational work order d871912d preceded implementation. Initial source
payload ee25376f00248b7c9dc8eb4c9b18e38e71f803aa and whole-baseline/controller
d4be8f2d generated fullr1 successfully, retaining both immutable PENDING page
manifests and all pages. The original native outputs are committed on the owned
lesson branch before replacement; no generated artifact is hand-edited.

## Pre-render implementation diagnostics

- A read-only first release probe stopped on a long223 data path before effects.
  Data reads now use extended Windows paths; CLI entrypoint/CWD remain normal.
- Direct registry inspection exposed columns/rows at source top level, not a
  nested table object. The serializer was corrected before the first source
  commit and full target table/cell tests pass.
- The first ten-method test run completed its invalid-input probes but Windows
  failed cleanup of a long temporary fixture path. A proposed exact PowerShell
  cleanup was rejected by execution policy and was not retried through another
  tool. The isolated residual directory
  C:/Users/meije/AppData/Local/Temp/b224-native-negative-5nk_gzhg remains outside
  both repositories; no user data was removed. Subsequent fixtures use short
  fresh C:/wt/b224-neg-* temporary directories and normal cleanup succeeds.
- An attempted baseline commit ran while the initial inventory process was
  still computing. Git correctly rejected the absent path and created no
  commit. Inventory completion then bound all15331 files before generation.

## First actual-page layout refinement

The fullr1 automated native checker passed: ten pupil and ten answer pages,
actual12pt body/footer and15.685pt placed figure labels. Contact-sheet inspection
then found a target question4 alone on a nearly empty page, the rehearsal5
scoring paragraph alone on another page, and target5 scoring separated from
its model. These are author-observed layout defects, not a new plan/target.

Source correction aca14c61d258c05d668005d20bf0e4196de89ced adds only bounded
page grouping: target A with questions1–3, sources B/C with question4, then
D with5–6. Both the exact source order and question order remain original;
all frozen context/source/cell/prompt/answer bytes and points are unchanged.
The answer source starts rehearsal5 and target5 on purposeful new pages so
their complete calculations and scoring stay together. No text, mathematics,
source, point allocation, goal, figure geometry or approved plan is changed.

The controller's source binding advances to this actual committed successor,
not an invented future hash. Fullr1 evidence remains exact. Reserve a new
globally unused revision and repeat actual native generation, full page/figure
inspection and final three-route parity on the corrected candidate.
