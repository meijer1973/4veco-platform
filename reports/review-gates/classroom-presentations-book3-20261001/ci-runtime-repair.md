# CI Python selection repair

The first required platform CI run at payload `d466488194bf4b8d6ab0b2c45de2d99767a04752`
failed only the new straight-scatter wrapper: 133 suites and 2,210 tests passed,
but that wrapper reported `ModuleNotFoundError: No module named 'lxml'`.
[Failed run and log](https://github.com/meijer1973/4veco-platform/actions/runs/36858405124).

The same log confirms that setup-python selected Python 3.13 and installed lxml
successfully before the presentation tooling installation. The later bare
`python` command did not use that configured environment. The wrapper now uses
an explicit `RUNTIME_PYTHON`, otherwise setup-python's `pythonLocation`, and only
then the platform PATH fallback. The CI requirements also declare lxml directly
because the graph helper and its regression suite import it directly.

A controlled local test placed a fresh Python environment without lxml first on
PATH. With `RUNTIME_PYTHON` cleared and `pythonLocation` pointing at the configured
runtime, the Jest wrapper and all six Python cases passed. Removing
`pythonLocation` reproduced the original missing-lxml failure. No test was
skipped or weakened.

This repair changes only CI dependency declaration and the test interpreter
selection. It changes no presentation, PDF, paragraph builder, chart data or
textbook file. The earlier exact-head compatibility result remains historical;
new required CI, exact-pair compatibility and independent binding are recorded
on the consolidated PRs for the repaired payload.
