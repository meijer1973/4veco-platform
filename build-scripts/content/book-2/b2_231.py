"""HOW TO ADAPT: §231-only native production under the immutable approved v2 plan.
No predecessor acceptance is invented; this demand-only route consumes no §213 files.
"""
from __future__ import annotations
import argparse
from datetime import datetime, timezone
import hashlib
import html
import json
from pathlib import Path
import re
import subprocess
import sys
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo
from print_pipeline import build_document, digest, render_proof

ROOT = Path(__file__).resolve().parents[3]
CONTENT = Path(__file__).with_name("231")
STEM = "2.3.1 Consumentensurplus"
BOOK = Path("Boek 2 - Kosten, opbrengsten, elasticiteit en surplus")
LESSON_REL = BOOK / "2.3 Hoofdstuk Surplus en welvaart" / STEM
PLAN_HASH = "60d6a743681e1361478395a591b7c82e44acf8c4587a93c4cc842b036cf017b1"
TARGET_HASH = "a385e00b2fffea168089c32f796668e51ae45cb325504644392f79b20bde8571"
PREFIX = "BOOK2-TEXTBOOK-PRODUCTION-1-231"
KINDS = ("paragraaf", "opgaven", "antwoorden")
ASSETS = [f"2.3.1_fig_{i}" for i in range(1, 5)] + ["2.3.1_we_1"] + [f"2.3.1_ex_{i}" for i in range(1, 11)]
HEADINGS = ["Uitgewerkt voorbeeld", "Startopgaven", "Begeleide inoefening",
            "Zelfstandige oefening", "Doeloefening", "Denkertje / Bonusopgave",
            "Herhaling / Herhaling en interleaving"]
SOURCE_NAMES = ("theory.md", "exercises.md", "answers.md", "target-answers.md",
                "assets.js", "test_source.py", "check_render.py", "verify_rebuild.py")
GRANT_PATH = "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-plan-r2-root-continuation.md"
GRANT_COMMIT = "0a168145a9b7d16942ba5718164149706055d422"
GRANT_HASH = "c6ade2c6ba52ba147d89ada603e88b80086749529944a378b0a4cf44a213ef58"

def lf_hash(path):
    text = Path(path).read_text(encoding="utf-8-sig").replace("\r\n", "\n").replace("\r", "\n")
    return hashlib.sha256(text.encode()).hexdigest()

def target_record():
    records = json.loads((ROOT / "references/authored/course-target-exercises.json").read_text(encoding="utf-8-sig"))["exercises"]
    selected = [r for r in records if r["id"] == "2.3.1"]
    if len(selected) != 1:
        raise ValueError("Exactly one frozen §231 target is required")
    record = selected[0]
    actual = hashlib.sha256(json.dumps(record, ensure_ascii=False, separators=(",", ":")).encode()).hexdigest()
    if actual != TARGET_HASH:
        raise ValueError("Frozen §231 target changed")
    return record

def authority_pins(lesson_root):
    return [
        (lesson_root / LESSON_REL / "2.3.1-textbook-plan.md", PLAN_HASH, "canonical_lf"),
        (lesson_root / BOOK / "_book-plan.md", "b6ae8e07e05337838dc38b2838a6e5db43b2e153569fa5bc490cf4bfeb8d7a76", "canonical_lf"),
        (lesson_root / LESSON_REL.parent / "_chapter-plan.md", "e8a07bfe212a6ae817db99fecb93e86812e1d9e9af533b7ef21591bbb9025dc7", "canonical_lf"),
        (ROOT / "references/owned/course-blueprint-v6-three-year.md", "72fb1bc8c7b4843ac5cf4c29acfb9d117b6118eeaa1cd5fe5229604dfe412e6e", "canonical_lf"),
        (ROOT / "references/owned/course-blueprint-v5.md", "61130f10e7b8b6417641436f0995be090db04b11075d02878ae0a51c12b497c7", "canonical_lf"),
        (ROOT / "references/authored/course-target-exercises.json", "d3d7163ad82e0ddcf2f9ae1cbfa653335c96cb46762e8125bd594583f5d5885e", "canonical_lf"),
        (ROOT / GRANT_PATH, GRANT_HASH, "canonical_lf"),
        (ROOT / "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-231-plan-r2-independent-review.md",
         "3bfc2f8bddb0659d3b83e5a15e993cb2282003ddc33e0b142dcf6c1263b3a652", "canonical_lf"),
    ]

def authorize(lesson_root):
    """All input identity gates run before any subprocess or output write."""
    lesson_root = Path(lesson_root).resolve(strict=True)
    destination = (lesson_root / LESSON_REL).resolve(strict=True)
    if destination.parent.parent.parent != lesson_root:
        raise ValueError("Unexpected §231 destination")
    pins = authority_pins(lesson_root)
    for path, expected, contract in pins:
        actual = digest(path) if contract == "raw" else lf_hash(path)
        if actual != expected:
            raise ValueError(f"Required authority changed: {path}")
    return destination, pins, target_record()

def serialize_target(record):
    target = record["target_exercise"]
    return "\n\n".join(["**Opgave 8**", target["context"]] +
        [f'{q["label"]}) **({q["points"]} punten)** {q["prompt"]}' for q in target["subquestions"]])

def layout_tables(markdown):
    """Equal small data columns; long scoring rationale gets most of its table."""
    def convert(match):
        rows = [[c.strip() for c in row.strip().strip("|").split("|")] for row in match.group().strip().splitlines()]
        columns, data = rows[0], rows[2:]
        if any(len(row) != len(columns) for row in data):
            raise ValueError("Table column mismatch")
        widths = [17, 17, 66] if columns == ["Onderdeel", "Maximum", "Verdeling"] else [100 / len(columns)] * len(columns)
        return "\n".join(['<table style="break-inside:avoid"><colgroup>',
            *[f'<col style="width:{w:g}%">' for w in widths], "</colgroup><thead><tr>" +
            "".join(f"<th>{html.escape(c)}</th>" for c in columns) + "</tr></thead><tbody>",
            *["<tr>" + "".join(f"<td>{html.escape(c)}</td>" for c in row) + "</tr>" for row in data],
            "</tbody></table>"]) + "\n"
    return re.sub(r"(?m)^\|[^\n]+\|\r?\n\|(?:\s*:?-+:?\s*\|)+\r?\n(?:\|[^\n]+\|(?:\r?\n|$))+", convert, markdown)

def documents(record):
    exercises = (CONTENT / "exercises.md").read_text(encoding="utf-8").replace("{{TARGET}}", serialize_target(record))
    theory = (CONTENT / "theory.md").read_text(encoding="utf-8").replace("{{GOALS}}", "\n".join(f"{i}. {g}" for i, g in enumerate(record["lesson_goals"], 1)))
    target_answers = (CONTENT / "target-answers.md").read_text(encoding="utf-8")
    for label, value in record["short_answer_model"].items():
        target_answers = target_answers.replace("{{ANSWER_" + label + "}}", value)
    answers = (CONTENT / "answers.md").read_text(encoding="utf-8").replace("{{TARGET_ANSWERS}}", target_answers)
    values = {"paragraaf": theory.rstrip() + "\n\n" + exercises,
              "opgaven": f"# {STEM} — opgaven\n\n" + exercises, "antwoorden": answers}
    for kind, value in values.items():
        if "{{" in value or "}}" in value:
            raise ValueError(f"Unresolved placeholder in {kind}")
        # Keep a), b) etc as explicit paragraph text, never repeated list a).
        values[kind] = layout_tables(re.sub(r"^([a-z])\) ", r"\1\\) ", value, flags=re.M)).rstrip() + "\n"
    return values

def wrapper_source():
    return '''"""HOW TO ADAPT: thin §231 wrapper; all content and print logic lives in platform."""
from pathlib import Path
import subprocess
import sys
lesson_root = Path(__file__).resolve().parents[3]
builder = lesson_root.parent / "4veco-platform/build-scripts/content/book-2/b2_231.py"
if not builder.is_file():
    raise FileNotFoundError(f"Paired §231 platform builder not found: {builder}")
if "--lesson-root" in sys.argv[1:]:
    raise ValueError("The wrapper supplies its exact lesson root; do not duplicate it")
subprocess.run([sys.executable, str(builder), "--lesson-root", str(lesson_root), *sys.argv[1:]], check=True)
'''

def zip_document(record):
    pdf = Path(record["source_pdf"])
    files = [Path(record[k]) for k in ("source_md", "source_html", "source_pdf")] + [Path(a["path"]) for a in record["assets"]]
    destination = pdf.with_suffix(".zip")
    with ZipFile(destination, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(set(files)):
            relative = path.relative_to(pdf.parent).as_posix()
            info = ZipInfo(relative, date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            archive.writestr(info, path.read_bytes(), compress_type=ZIP_DEFLATED, compresslevel=9)
    return {"path": str(destination), "sha256": digest(destination)}

def packet_paths(destination):
    return [destination / f"{STEM} – {kind}{ext}" for kind in KINDS for ext in (".md", ".html", ".pdf", ".zip")] + [
        destination / "_assets" / f"{stem}{ext}" for stem in ASSETS for ext in (".svg", ".png")]

def used_revisions(proof_root, evidence_root):
    names = [p.name for p in proof_root.glob("231-*")] + [p.name for p in evidence_root.glob(PREFIX + "-build-*-r*.json")]
    return sorted({int(match.group(1)) for name in names if (match := re.search(r"-r([1-9][0-9]*)(?:\.json)?$", name))})

def next_revision(proof_root, evidence_root):
    used = used_revisions(Path(proof_root), Path(evidence_root))
    return "r" + str(max(used, default=0) + 1)

def reserve_attempt(destination, proof_root, suffix, manifest):
    if not re.fullmatch(r"r[1-9][0-9]*", suffix):
        raise ValueError("A positive revision rN is required")
    if manifest.exists():
        raise ValueError("Refusing existing build manifest")
    if manifest.name != f"{PREFIX}-build-manifest-{suffix}.json":
        raise ValueError("Use exact §231 build-manifest-rN filename")
    if suffix != next_revision(proof_root, manifest.parent):
        raise ValueError("Choose globally next unused §231 rN; failed attempts consume their suffix")
    if list(proof_root.glob(f"231-*-{suffix}")):
        raise ValueError("Proof revision destination already exists")
    manifest.parent.mkdir(parents=True, exist_ok=True)
    attempt = manifest.with_name(f"{PREFIX}-build-attempt-{suffix}.json")
    with attempt.open("x", encoding="utf-8", newline="\n") as stream:
        stream.write(json.dumps({"paragraph": "2.3.1", "revision": suffix, "destination": str(destination),
            "started_at": datetime.now(timezone.utc).isoformat(), "status": "ATTEMPT_RECORDED",
            "inspection_status": "PENDING", "note": "Immutable attempt; completion is a separately created build manifest."}, indent=2) + "\n")
    return attempt

def build(lesson_root, proof_root, *, proof_suffix, manifest, sources_only=False):
    destination, pins, record = authorize(lesson_root)
    proof_root, manifest = Path(proof_root).resolve(), Path(manifest).resolve()
    for command in [
        ["node", "build-scripts/workflows/check-book-outline-currentness.js", "--require-approved", "--action", "paragraph_production", "--paragraph", "2.3.1"],
        ["node", "build-scripts/workflows/check-book2-target-authority-remediation.js", "--durable"],
    ]:
        subprocess.run(command, cwd=ROOT, check=True)
    attempt = reserve_attempt(destination, proof_root, proof_suffix, manifest)
    subprocess.run(["node", str(CONTENT / "assets.js"), str(destination / "_assets")], cwd=ROOT, check=True)
    (destination / "build_pdf.py").write_text(wrapper_source(), encoding="utf-8", newline="\n")
    records = []
    for kind, markdown in documents(record).items():
        source = destination / f"{STEM} – {kind}.md"
        source.write_text(markdown, encoding="utf-8", newline="\n")
        if not sources_only:
            built = build_document(source)
            built["zip"] = zip_document(built)
            directory = proof_root / f"231-{kind}-{built['pdf_sha256'][:12]}-{proof_suffix}"
            if directory.exists():
                raise ValueError("Never reuse an existing proof directory")
            render_proof(built, directory)
            built["proof_directory"] = str(directory)
            records.append(built)
    inputs = [Path(__file__), ROOT / "build-scripts/content/book-2/print_pipeline.py", *[CONTENT / n for n in SOURCE_NAMES]]
    result = {"paragraph": "2.3.1", "paragraph_folder": str(destination), "lesson_root": str(Path(lesson_root).resolve()),
              "revision": proof_suffix, "proof_root": str(proof_root), "target_record_sha256": TARGET_HASH,
              "plan_sha256_canonical_lf": PLAN_HASH, "root_continuation_commit": GRANT_COMMIT,
              "authority_pins": [{"path": str(p), "sha256": h, "contract": c} for p, h, c in pins],
              "input_sources": [{"path": str(p.resolve()), "sha256": digest(p)} for p in inputs],
              "thin_wrapper": {"path": str(destination / "build_pdf.py"), "sha256": digest(destination / "build_pdf.py")},
              "attempt": {"path": str(attempt), "sha256": digest(attempt)},
              "runtime": {"python": sys.executable, "python_version": sys.version},
              "inspection_status": "PENDING", "documents": records}
    if not sources_only:
        result["packet"] = {p.relative_to(destination).as_posix(): digest(p) for p in packet_paths(destination)}
        if len(result["packet"]) != 42:
            raise ValueError("Expected all 42 packet files")
    with manifest.open("x", encoding="utf-8", newline="\n") as stream:
        stream.write(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    return result

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lesson-root", type=Path, default=ROOT.parent / "4veco-lessen")
    parser.add_argument("--proof-root", type=Path, required=True)
    parser.add_argument("--proof-suffix", required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--sources-only", action="store_true")
    args = parser.parse_args()
    result = build(args.lesson_root, args.proof_root, proof_suffix=args.proof_suffix,
                   manifest=args.manifest, sources_only=args.sources_only)
    print(json.dumps({"paragraph": "2.3.1", "revision": result["revision"], "manifest": str(args.manifest),
                      "packet_files": len(result.get("packet", {})), "inspection_status": "PENDING"}, indent=2))
if __name__ == "__main__":
    main()
