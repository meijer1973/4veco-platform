# Direct-child Unicode protocol correction — pre-implementation addendum

The actual inherited-environment direct run r1000009 exposed an existing protocol
dependency: print_pipeline.py emits Unicode JSON filenames, Windows Python defaults
to a non-UTF-8 stdout encoding, and the owner controller decodes UTF-8. Original
author evidence had supplied PYTHONIOENCODING=utf-8 externally, hiding that dependency.
The child ran successfully; zip_document then received U+FFFD in the en-dash filename.
No planned native byte changed. One22-byte empty orphan ZIP was created, recorded
with exact path/raw/base64 custody, and removed by exact contained own-file cleanup.
The attempt/reservation/process and original failures remain immutable. No restoration.

Root was notified with a request to confirm the bounded transport interpretation.
The proposed fix is within the requested native-consumer path transport, not any
new economic or pupil-content authority: explicitly set PYTHONIOENCODING=utf-8 ONLY
for the owned shared Python print child, leaving its exact argv/cwd and original
inherited PATH unchanged, and record the child override in actual command evidence.
No shared print code, global runtime, generation content or test guard is weakened.

Before execution: add an actual child-process regression with hostile inherited
PYTHONIOENCODING=cp1252, preserving Unicode filename round-trip and original PATH;
prove normal command behavior and exact shared-child dispatch. Preserve all23
existing tests and all19 originals. Commit a new whole eleven-file source epoch;
old source manifests remain old, not silently rebound. Mark unused r1000010 as
historical old-epoch reservation without rewriting it. Reserve new global revisions
and rerun full/thin/guarded-direct/checker routes under the actual correction role.
Recompute41-byte,42raw/RGB, ZIP25/13/13 parity and original proof custody; no native
restore or false fresh visual review. Root/distinct review still judge the correction.
