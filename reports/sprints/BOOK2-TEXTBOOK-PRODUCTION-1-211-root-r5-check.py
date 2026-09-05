"""One-shot root R5 adoption/reproduction; no independent acceptance.

HOW TO ADAPT: declare a new exact root baseline and fresh evidence prefix.
Never rerun completed evidence or change the immutable builder/old review proof.
"""
import hashlib
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports/sprints"
PREFIX = "BOOK2-TEXTBOOK-PRODUCTION-1-211-root-r5"
ORIGINAL = "BOOK2-TEXTBOOK-PRODUCTION-1-211-BONUS"
LESSON_BASE = "6a6c8183bd2e9b52d2898e587543f735e6e87299"
PLATFORM_BASE = "6eb34debb2210a2a4fa6718a13eaeefcacedc8f8"
BUILDER_PAIR = "C:/wt/book2-211-bonus-correction-20260905/"
BUILD_PATH = REPORT / (PREFIX + "-build-r5.json")
EVIDENCE = REPORT / (PREFIX + "-evidence")
for suffix in ("-build-r5.json", "-mechanical-r5.json", "-reproduction-r5.json", "-native-r5.json", "-binding.json"):
    assert not (REPORT / (PREFIX + suffix)).exists(), "Completed/root proof collision"
assert not EVIDENCE.exists(), "Fresh root evidence directory required"


def sha(data):
    return hashlib.sha256(data).hexdigest()


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


def write_new(path, value):
    with path.open("x", encoding="utf-8", newline="\n") as stream:
        stream.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


original_path = REPORT / (ORIGINAL + "-build-r5.json")
original_bytes = original_path.read_bytes()
manifest = relocate(json.loads(original_bytes))
for source in manifest["input_sources"]:
    assert sha(Path(source["path"]).read_bytes()) == source["sha256"]
for record in manifest["documents"]:
    for key, h in (("source_md", "source_sha256"), ("source_html", "html_sha256"), ("source_pdf", "pdf_sha256")):
        assert sha(Path(record[key]).read_bytes()) == record[h]
    for asset in record["assets"]:
        assert sha(Path(asset["path"]).read_bytes()) == asset["sha256"]
write_new(BUILD_PATH, manifest)

module_path = REPORT / (ORIGINAL + "-evidence.py")
spec = importlib.util.spec_from_file_location("root_211_r5_bounded_verifier", module_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.BASE = LESSON_BASE
module.PREFIX = PREFIX
module.EVIDENCE = EVIDENCE
module.BUILD_PATH = BUILD_PATH
# The original default argument captures its own historical base. This root
# comparison explicitly uses the pre-adoption root commit, preserving the
# original helper and its four-source contract baseline unchanged.
original_previous = module.previous
module.previous = lambda path, root=module.LESSONS, ref=LESSON_BASE: original_previous(path, root, ref)
EVIDENCE.mkdir()
module.verify()
module.rebuild()

native_path = ROOT / "build-scripts/content/book-2/211/check_render.py"
native_spec = importlib.util.spec_from_file_location("root_211_r5_native_checker", native_path)
native = importlib.util.module_from_spec(native_spec)
native_spec.loader.exec_module(native)
write_new(REPORT / (PREFIX + "-native-r5.json"), native.inspect(ROOT.parent / "4veco-lessen"))
mechanical_path = REPORT / (PREFIX + "-mechanical-r5.json")
mechanical = json.loads(mechanical_path.read_text(encoding="utf-8"))
pages = [(document["kind"], page) for document in mechanical["documents"] for page in document["pages"]]
assert len(pages) == 31
changed = [(kind, page["page"]) for kind, page in pages if not page["R4_bytes_equal"]]
assert changed == [("antwoorden", "pages/page-007.png")], changed
assert original_path.read_bytes() == original_bytes
binding = {
    "executed_by": "codex-root",
    "root_platform_base": PLATFORM_BASE,
    "root_lessons_base": LESSON_BASE,
    "original_builder_manifest_sha256": sha(original_bytes),
    "original_bounded_verifier_sha256": sha(module_path.read_bytes()),
    "root_mechanical_sha256": sha(mechanical_path.read_bytes()),
    "root_reproduction_sha256": sha((REPORT / (PREFIX + "-reproduction-r5.json")).read_bytes()),
    "changed_pages": changed,
    "unchanged_pages": 30,
    "personal_visual_review": "Not supplied by this script; root separately inspects current answer page7 and cites earlier personal views only for byte-identical pages.",
    "independent_paragraph_review": "PENDING",
    "independent_specialist_QC": "PENDING",
    "root_acceptance": "NOT_GRANTED",
    "legacy_ZIP": "Unchanged historical archive excluded; no native211 ZIP output contract.",
}
write_new(REPORT / (PREFIX + "-binding.json"), binding)
print(json.dumps({"result": "PASS", "full_and_print_native_files": 21, "pages": 31,
                  "changed_pages": changed, "binding": str(REPORT / (PREFIX + "-binding.json"))}))
