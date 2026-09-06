# Exact source-heading compatibility — source checks pass, review pending

2026-09-06; codex-root; BOOK2-TEXTBOOK-PRODUCTION-1 / #229.

Actual old shared prepare rejected accepted223 because its correct pupil H1
differs from the preserved legacy path. Original-r1-process.json reproduces
that failure on source907b48f7488e4030a34baa1c1ef4613acc8235db, with no native
write. The original input candidate is retained as historical candidate-only
custody evidence, not represented as working assembly or production release.

The two-file correction adds optional exact student/answers source-heading
validation while retaining original behavior when omitted. A supplied map
must have exactly both roles, single-line H1s naming the correct paragraph,
and match each actual complete source's first nonblank line exactly. Complete
raw source hashes, paths, asset pins, content, styles and output selection are
unchanged. It does not approve the caller's offered hashes or grant production.

Source chapter_pipeline.py SHA256
ad0a9cfe9e92d579cc066c122e7a9d2765f94cf7d819138d3c5a9270fd40a4f8;
test_chapter_pipeline.py SHA256
5007e3ed1793f82743ce667b555a168d581de52fc72fe6c562c909606235aadc.
The corrected pair exists at26f0ef384164cf48979abbfab3b2dbe6864d3435 and
remains byte-identical at actual probe commite2612bd1010c7f931f1e8eac3454b37c71bc33da.

All10 unit methods pass: the6 original methods and4 new methods covering exact
two-edition preservation, malformed role maps, full-line rather than prefix
matching, wrong paragraph identity and mandatory whole-source hashes. Actual
build-path negatives verify no native build_document, mkdir or write_bytes call.
This is technical fixture evidence, not a new pupil/render approval.

Actual corrected-r3-process.json raw SHA256
010dc3ba7b998621cd40f20808636d1f0c78919efa994f37da1f3730ff909d29
prepares all8 real selected source documents and30 actual referenced assets.
Every complete byte-derived source occurs once in its correct edition. Prepared
in-memory student text SHA1235ad1a4a443aa732ba902fe6e5825b9df734f5bfb14309522b6f80c2de40c9;
answer text SHA fda097355796e5c70673c3997b8221534bfb10df097e2abf72ea518b0fa0c97b.
No native files, PDFs, proof images or personal visual observations were produced.

Two own diagnostic failures remain immutable. Tests-r1's new full-text oracle
incorrectly compared LF construction text against actual Windows CRLF fixture
bytes; the oracle now compares actual source bytes. Corrected-r2 used ordinary
Python data paths for the long223 answer filename and failed before assembly.
The final probe uses extended syntax only for lesson data paths; Python argv,
script path, imports, cwd, PATH and unchanged shared print source remain normal.
Neither diagnostic is passed off as a pupil content defect or erased.

Next: publish an R2 complete immutable accepted-input candidate with these exact
two source hashes and eight explicit headings, proving all other136 original
input bytes unchanged. Distinct source/input review and a separate root release
must precede chapter native production. All existing lesson/PDF/manifest/target
and historical approval bytes remain untouched; final combined41PDF work and
CI/lead/readiness continue. No future merge is authorized.
