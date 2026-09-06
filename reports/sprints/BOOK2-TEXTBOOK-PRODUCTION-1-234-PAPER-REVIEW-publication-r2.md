# §234 review publication — retained diagnostic and bounded runner correction

2026-09-06, paragraph_224_builder. No change to the review verdict or any lesson,
plan, protected input, source/native artifact, historical report or scope result.

First normal push completed at P81546e1b512c10b03e889fae450d3e4fddd79d92 /
L56bb0f1e4f45b844304895cbbc3aee8770ec0829. The following final-check invocation
exited1 at publication-check.cjs line20, `A(checks.every(x=>x.allowed_exit))`.
Before that assertion, both repositories had already passed exact clean
HEAD=tracking=ls-remote, branch, own-prefix/zero-L and four-index-only-tail tests.
That failed final result is NOT retroactively a PASS. Its exact old runner is
preserved in commit5db9d118bc772ecc30e00b984bb6790d0f1e0793 and the immutable
index-capture record, with the original final tool diagnostic in the task trace.

Read-only reproduction identified the actual error:
`Agent worktree-safety check failed: missing mode: pass --claim, --check, or --release`.
Both task-local final-check argv lists omitted required `--check`. A separate
exploratory `--cwd` invocation also failed with `unknown argument: --cwd`;
it was not the final runner's command and is not a successful claim check.
The actual documented checker accepts a normal child CWD (or --worktree), and
no ownership override or shared checker edit is needed.

This successor adds `--check` to the two owned final-check child argv lists and
prints their results before a future failed assertion. The original command/
source remains retrievable at the previous commits; this is a new publication
diagnostic correction, not rewriting evidence. No candidate review test rerun is
needed because reviewed bytes and594-probe controller are unchanged. Full raw
baseline custody was also rerun after the first normal push.

The earlier four-index-only commit81546e1b is preserved history and must be
excluded from root imports along with the new final four-index-only tail.
Substantive sequence remains ce6d15ca → a88857b4 → af335aae →5db9d118 →0991cc18,
then this bounded publication correction. The new final tail is regenerated
at this correction head with all six explicit paired env values, actual NUL
filename verification and normal push. Its subsequent clean claim/remote/index
verification is reported by actual tool output, not a predicted future hash.
