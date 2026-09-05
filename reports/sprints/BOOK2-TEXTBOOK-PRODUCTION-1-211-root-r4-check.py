"""One-shot root R4 rebuild/delta audit; no visual or independent approval.

HOW TO ADAPT: use a new explicit root checkpoint, never overwrite the immutable
builder report or silently substitute a successor for an earlier acceptance pin.
"""
import hashlib
import importlib.util
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports/sprints"
PREFIX = "BOOK2-TEXTBOOK-PRODUCTION-1-211-root-r4"
ORIGINAL = "BOOK2-TEXTBOOK-PRODUCTION-1-211-ALT"
BASE = "3745ef9757e6f10e5edd746dc4508ee73c596d6d"
PLATFORM_BASE = "50656d50432fe7e91d53ea99b7fc73c8872b5eff"
BUILDER_PAIR = "C:/wt/book2-211-alt-correction-20260905/"
for suffix in ("-build-r4.json", "-audit-r4.json"):
    assert not (REPORT / (PREFIX + suffix)).exists(), "Root proof collision"

def sha(data):
    return hashlib.sha256(data).hexdigest()

# A failed first root audit left only these six deterministic grayscale files.
# Reuse is allowed only after proving the entire exact set and bytes; no deletion,
# foreign output overwrite or completed audit replacement is permitted.
gray_root = REPORT / (PREFIX + "-grayscale")
if gray_root.exists():
    old_audit = json.loads((REPORT / (ORIGINAL + "-audit-r4.json")).read_text(encoding="utf-8"))
    expected_gray = {a["name"] + ".png": a["grayscale_sha256"] for a in old_audit["assets"]}
    assert {p.name for p in gray_root.iterdir()} == set(expected_gray)
    for name, expected_hash in expected_gray.items():
        assert sha((gray_root / name).read_bytes()) == expected_hash

def relocate(value):
    if isinstance(value, str):
        normal = value.replace("\\", "/")
        if normal.startswith(BUILDER_PAIR):
            result = ROOT.parent / normal[len(BUILDER_PAIR):]
            assert result.resolve().is_relative_to(ROOT.parent.resolve())
            return str(result)
        return value
    if isinstance(value, list):
        return [relocate(x) for x in value]
    if isinstance(value, dict):
        return {k: relocate(v) for k, v in value.items()}
    return value

original_file = REPORT / (ORIGINAL + "-build-r4.json")
original_bytes = original_file.read_bytes()
manifest = relocate(json.loads(original_bytes))
for source in manifest["input_sources"]:
    assert sha(Path(source["path"]).read_bytes()) == source["sha256"]
for document in manifest["documents"]:
    for key, h in (("source_md", "source_sha256"), ("source_html", "html_sha256"), ("source_pdf", "pdf_sha256")):
        assert sha(Path(document[key]).read_bytes()) == document[h]
    for asset in document["assets"]:
        assert sha(Path(asset["path"]).read_bytes()) == asset["sha256"]

module_file = REPORT / (ORIGINAL + "-verify.py")
spec = importlib.util.spec_from_file_location("root_211_bounded_verifier", module_file)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
# Explicit pre-adoption root base already contains the independent213 R6 review.
# All builder bases and old evidence remain untouched. This fresh root comparison
# is not an exception to the original builder's protected-file assertions.
module.BASE = BASE
module.PLATFORM_BASE = PLATFORM_BASE
module.PREFIX = PREFIX
module.BUILD = manifest
# Python's original default ref captured its builder base at function definition.
# Pass the already-declared exact root baseline explicitly on every lookup.
original_previous = module.previous
module.previous = lambda file, root=module.LESSONS, ref=BASE: original_previous(file, root, ref)
module.rebuild()
module.audit()
audit_path = REPORT / (PREFIX + "-audit-r4.json")
audit = json.loads(audit_path.read_text(encoding="utf-8"))
audit["executed_by"] = "codex-root"
audit["original_builder_manifest_sha256"] = sha(original_bytes)
audit["original_bounded_verifier_sha256"] = sha(module_file.read_bytes())
audit["root_baseline_lessons"] = BASE
audit["root_baseline_platform"] = PLATFORM_BASE
audit["page_view_claim"] = "None: actual R3/R4 byte parity transfers root's earlier R3 observations; separate new reviewers still required."
audit_path.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
(REPORT / (PREFIX + "-build-r4.json")).write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
assert original_file.read_bytes() == original_bytes
changed = subprocess.check_output(["git", "diff", "--name-only", BASE, "HEAD"], cwd=ROOT.parent / "4veco-lessen", text=True).splitlines()
assert len(changed) == 5 and all("2.1.1 Kostenstructuren" in p for p in changed)
print(json.dumps({"result": "PASS", "root_audit_sha256": sha(audit_path.read_bytes()),
                  "actual_source_delta": "native we1 alt and fig3 title; two corresponding native HTML aria-hidden removals and soft wrapping",
                  "candidate_changed_files": changed, "independent_review": "PENDING", "specialist_QC": "PENDING"}, indent=2))
