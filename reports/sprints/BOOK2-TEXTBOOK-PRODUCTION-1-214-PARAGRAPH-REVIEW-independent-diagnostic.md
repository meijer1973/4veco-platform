# Preserved independent helper first diagnostic

At controller c984794f, content passed with raw26e8e1333f4d298d3106e7a516a7c4ae11bf45d47dacf6824e91747951820ed0.
The negative mode then exited1 before creating any fixture or changing files:

    File ...214-PARAGRAPH-REVIEW-independent.py, line86, in negative
    AssertionError: ('2.1.2-handoff.md', [])

The actual immutable input path ends2.1.2-textbook-handoff.md. Only the own
selector is corrected. Before rerun, also remove the prospective Path.open
effect patch: source raw reads legitimately use it, so preventing all opens
would forbid reads as well as writes. No source guard has changed and no
fixture/native action occurred during this first failure. Earlier helper
commit remains the complete recoverable first implementation.
