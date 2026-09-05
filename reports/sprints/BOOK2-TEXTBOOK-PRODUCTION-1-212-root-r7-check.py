"""One-shot root212 R7 source/output/reproduction checkpoint; not acceptance.

HOW TO ADAPT: use new explicit pre-adoption commits and fresh evidence paths.
Preserve all old helpers, source contracts, manifests and inspection provenance.
"""
import hashlib
import importlib.util
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LESSON = ROOT.parent / "4veco-lessen"
REPORT = ROOT / "reports/sprints"
PREFIX = "BOOK2-TEXTBOOK-PRODUCTION-1-212-root-r7"
ORIGINAL = REPORT / "BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence"
OUT = REPORT / (PREFIX + "-evidence")
PBASE = "b7b584e9157929b1efa521af0101a0795f34d2d9"
LBASE = "1432170d88341de6d8cd8b703a084f550a238251"
BUILDER_PAIR = "C:/wt/book2-212-bonus-correction-20260905/"
assert not OUT.exists(), "Fresh root checkpoint required; no overwrite"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def previous(repo, path):
    return subprocess.check_output(["git", "show", (LBASE if repo == LESSON else PBASE) + ":" + path], cwd=repo)


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


def save(name, data):
    with (OUT / (name + ".json")).open("x", encoding="utf-8", newline="\n") as stream:
        stream.write(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


original_hashes = {p.name: sha(p.read_bytes()) for p in ORIGINAL.glob("*.json")}
baseline = relocate(json.loads((ORIGINAL / "baseline.json").read_text(encoding="utf-8")))
updated_prior = []
for row in baseline["files"]:
    actual_old = sha(previous(LESSON if row["repo"] == "lessons" else ROOT, row["path"]))
    if actual_old != row["sha256"]:
        updated_prior.append({"repo": row["repo"], "path": row["path"],
                              "builder_baseline_sha256": row["sha256"], "root_baseline_sha256": actual_old})
    row["sha256"] = actual_old
# The only earlier root change within this exact protected inventory is the
# already verified211 R5 answer insertion. It is not ignored or allowed to drift
# here: its exact pre212 root bytes become the immutable comparison baseline.
assert len(updated_prior) == 3
assert all(row["repo"] == "lessons" and "/2.1.1 Kostenstructuren/2.1.1 Kostenstructuren – antwoorden." in row["path"]
           and row["path"].rsplit(".", 1)[1] in ("md", "html", "pdf") for row in updated_prior)
baseline["platform_base"], baseline["lessons_base"] = PBASE, LBASE
baseline["explicit_prior_root_adoption"] = updated_prior
for relative in baseline["native34"]:
    assert sha(previous(LESSON, relative)) == baseline["native34"][relative]
for row in baseline["old_pages"].values():
    directory = Path(row["directory"])
    assert sha((directory / "manifest.json").read_bytes()) == row["manifest_sha256"]
    for name, expected in row["page_sha256"].items():
        assert sha((directory / "pages" / name).read_bytes()) == expected
build = relocate(json.loads((ORIGINAL / "build-r7.json").read_text(encoding="utf-8")))
for row in build["input_sources"]:
    assert sha(Path(row["path"]).read_bytes()) == row["sha256"]
for record in build["documents"]:
    for key, field in (("source_md", "source_sha256"), ("source_html", "html_sha256"), ("source_pdf", "pdf_sha256")):
        assert sha(Path(record[key]).read_bytes()) == record[field]
    for asset in record["assets"]:
        assert sha(Path(asset["path"]).read_bytes()) == asset["sha256"]
OUT.mkdir()
save("baseline", baseline)
save("build-r7", build)
module_path = REPORT / "BOOK2-TEXTBOOK-PRODUCTION-1-212-BONUS-evidence.py"
spec = importlib.util.spec_from_file_location("root_212_r7_exact_verifier", module_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.PBASE, module.LBASE, module.OUT = PBASE, LBASE, OUT
module.verify()
module.rebuild()
mechanical = json.loads((OUT / "mechanical-r7.json").read_text(encoding="utf-8"))
changed_pages = [(row["edition"], Path(row["file"]).name) for row in mechanical["pages"] if row["changed"]]
assert len(mechanical["pages"]) == 27 and len(mechanical["figures"]) == 11
assert changed_pages == [("antwoorden", "page-006.png")]
changed_paths = subprocess.check_output(["git", "-c", "core.quotepath=false", "diff", "--name-only", LBASE], cwd=LESSON).decode("utf-8").splitlines()
assert set(changed_paths) == {(module.b.LESSON_REL / (module.b.STEM + " – antwoorden." + ext)).as_posix()
                              for ext in ("md", "html", "pdf", "zip")}
assert original_hashes == {p.name: sha(p.read_bytes()) for p in ORIGINAL.glob("*.json")}
binding = {"result": "PASS", "executed_by": "codex-root", "platform_base": PBASE,
           "lessons_base": LBASE, "original_evidence_hashes": original_hashes,
           "unchanged_builder_helper_sha256": sha(module_path.read_bytes()),
           "root_evidence_hashes": {p.name: sha(p.read_bytes()) for p in OUT.glob("*.json")},
           "actual_lesson_paths": changed_paths, "changed_pages": changed_pages,
           "unchanged_pages": 26, "full_and_print_native_files": 34,
           "personal_visual_review": "Not supplied by script: root separately views answer page6; only exact unchanged bytes transfer prior personal views.",
           "independent_paragraph_review": "PENDING", "specialist_QC": "PENDING",
           "root_acceptance": "NOT_GRANTED", "classroom_timing": "UNOBSERVED_54_67_77"}
save("binding", binding)
print(json.dumps({"result": "PASS", "files": 34, "pages": 27, "changed_pages": changed_pages,
                  "binding_sha256": sha((OUT / "binding.json").read_bytes())}))
