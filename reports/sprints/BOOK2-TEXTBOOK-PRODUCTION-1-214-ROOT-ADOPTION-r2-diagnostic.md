# Root read-only verification r2 — same-renderer comparison

At344634b5ee40976c40af8da0913ffcaf7592660a the corrected role classifier
passed all five actual author runs: three authority gates precede the four
ordered raster workers (or the one direct shared CLI). All100 original stored
page PNGs had exact raw, decoded RGB and grayscale parity across five runs.
All source/native bytes and all nine current local checks passed.

The next root-only assertion incorrectly compared PyMuPDF checker pixels to
Poppler proof pixels. These are different rasterizers, even at the same150dpi
and1241x1754 dimensions. Actual original native-check-r46.json independently
uses PyMuPDF, while unchanged print_pipeline.py:266 uses pdftoppm for proofs.
For example the first pupil page's original MuPDF RGB is ece7ed0f53ac7b7491bfd0bdd2bb5dbe29291bec671894844f7c81d92bf1a31e;
its original Poppler RGB is75d4278662d48e075753bc06318effd80dc1df2c4d8ed260ea456b3d7d772d2a.
Their PDF bytes are the exact same c89e1c4f49491028d0cf171eb3219977b7545c127ad0a5c37f0f713df4136f48.

The bounded verifier correction compares the complete actual current checker
result (all20 MuPDF pages, source/native hashes, figures, text/geometry/HTML)
against the immutable original same-engine native-check-r46.json, raw
82b810f0736125cdeb5adba318951c921f749703fe336a3a24607b2ec9f8538a.
The separate exact100 Poppler proof comparisons remain mandatory, and every
proof MD/HTML/PDF and embedded asset hash is explicitly rebound to current root
bytes. No renderer, PDF, source, proof, tolerance or personal verdict changes.
Root does not claim fresh Poppler native production in this adoption phase.

The failed r2 capture and authority gzip remain, along with original committed
verifier source. Fresh r3 evidence cannot overwrite them. All13 root source
test methods separately passed with complete streamed stdout/stderr gzip and
lossless verification; that success is not the failed cross-renderer assertion.
Independent paragraph/specialist review and root native builds remain pending.
