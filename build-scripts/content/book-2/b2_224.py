"""HOW TO ADAPT: owned §224 two-edition consolidation, never a generic builder.

Change only after a reviewed plan/release. Fixed release bytes precede every
native effect. Shared print_pipeline owns rendering; this module owns source,
serialization, geometry, and its exact fifteen-file contract. No acceptance.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import re
import subprocess
import sys
from pathlib import Path

from print_pipeline import build_document, digest, render_proof

ROOT = Path(__file__).resolve().parents[3]
CONTENT = Path(__file__).with_name("224")
LESSON_REL = Path("Boek 2 - Kosten, opbrengsten, elasticiteit en surplus") / "2.2 Hoofdstuk Elasticiteit" / "2.2.4 Gemengde opgaven elasticiteit"
STEM = "2.2.4 Gemengde opgaven elasticiteit"
RELEASE_PATH = "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-PRODUCTION-RELEASE-inputs.json"
RELEASE_COMMIT = "6c3f46dbe97ce3eebe481e18bd25424a2de55aac"
RELEASE_HASH = "33c1473db0cbeec66e93557a72ab0586ccfcef29ba52b2a36148946c65598c7e"
TARGET_HASH = "4e0840ddf202ce4906ee05cd4dde97c0f3577885c34f0b9613ea18760aad7519"
PLAN_HASH = "fcc55870ba93b18324c1f04fe61c0cd3642e0ad3dbbffe87d42de35382072257"
INK, PURPLE, PALE = "#2D3748", "#7B2D8E", "#F3EBF5"
TITLES = [
    "Omzetrechthoeken van de telescoopverhuur: oude en nieuwe prijs en hoeveelheid.",
    "Omzetrechthoeken van de verrekijkerverhuur: oude en nieuwe prijs en hoeveelheid.",
    "Omzetvergelijking van de telescoopverhuur met bedragen en verandering.",
    "Omzetvergelijking van de verrekijkerverhuur met de eindige veranderingsfactor.",
]
HEADINGS = ["Aanpak en korte herinnering", "Opgave 1 — Sterrenplek",
            "Hulp bij het lezen van bronnen (optioneel)", "Doeloefening — StreamPlus",
            "Denkertje / Bonusopgave", "Herhaling / Herhaling en interleaving"]


def sha(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def data_path(path: Path) -> Path:
    """Windows extended path for long DATA reads only, never CLI/cwd paths."""
    value = os.path.abspath(path)
    if os.name == "nt" and not value.startswith("\\\\?\\"):
        return Path("\\\\?\\" + value)
    return Path(value)


def target_record(platform_root: Path = ROOT) -> dict:
    data = json.loads((platform_root / "references/authored/course-target-exercises.json").read_text(encoding="utf-8"))
    matches = [record for record in data["exercises"] if record["id"] == "2.2.4"]
    if len(matches) != 1:
        raise ValueError("Expected exactly one frozen §224 record")
    record = matches[0]
    if sha(json.dumps(record, ensure_ascii=False, separators=(",", ":")).encode()) != TARGET_HASH:
        raise ValueError("Whole original-order frozen §224 record changed")
    return record


def verify_current_release(lesson_root: Path, platform_root: Path = ROOT) -> dict:
    """Pure reads: all invalid current inputs reject before ANY subprocess/write.

    The expected file list cannot be learned from a modified manifest: its
    complete raw hash is an immutable literal, also independently Git-bound.
    """
    raw = (platform_root / RELEASE_PATH).read_bytes()
    if sha(raw) != RELEASE_HASH:
        raise ValueError("Immutable production-release manifest differs")
    manifest = json.loads(raw)
    if (manifest["schema_version"] != 1 or manifest["paragraph"] != "2.2.4"
            or manifest["decision"] != "RELEASED_FOR_GATED_PART_A_AUTHORING"
            or manifest["accountable_actor"] != "codex-root"
            or len(manifest["inputs"]) != 34
            or manifest["plan"]["raw_sha256"] != PLAN_HASH
            or manifest["target"]["record_sha256"] != TARGET_HASH):
        raise ValueError("Production release identity/decision/input shape differs")
    roots = {"4veco-platform": platform_root, "4veco-lessen": lesson_root}
    seen = set()
    for row in manifest["inputs"]:
        identity = (row["repository"], row["path"])
        if identity in seen or row["repository"] not in roots:
            raise ValueError("Duplicate or unknown released input")
        seen.add(identity)
        path = data_path(roots[row["repository"]] / row["path"])
        if not path.is_file() or digest(path) != row["raw_sha256"]:
            raise ValueError(f"Actual accepted input absent/changed: {row['path']}")
    target_record(platform_root)
    return manifest


def verify_committed_release(manifest: dict, lesson_root: Path, platform_root: Path = ROOT) -> None:
    """Read-only object custody, after all current checks; no native generation."""
    roots = {"4veco-platform": platform_root, "4veco-lessen": lesson_root}
    rows = [{"repository": "4veco-platform", "path": RELEASE_PATH,
             "commit": RELEASE_COMMIT, "raw_sha256": RELEASE_HASH}, *manifest["inputs"]]
    for row in rows:
        blob = subprocess.run(["git", "show", f"{row['commit']}:{row['path']}"],
                              cwd=roots[row["repository"]], check=True, capture_output=True).stdout
        if sha(blob) != row["raw_sha256"]:
            raise ValueError(f"Committed authority differs: {row['path']}")


def serialize_source(source: dict) -> str:
    result = [f"### Bron {source['id'].split('-')[-1].upper()}", source["content"]]
    if source.get("type") == "table":
        table = source
        result += ["| " + " | ".join(table["columns"]) + " |",
                   "| " + " | ".join("---" for _ in table["columns"]) + " |"]
        result += ["| " + " | ".join(str(value) for value in row) + " |" for row in table["rows"]]
        return "\n\n".join(result[:2]) + "\n\n" + "\n".join(result[2:])
    return "\n\n".join(result)


def serialize_target(record: dict) -> str:
    target = record["target_exercise"]
    sources, questions = target["sources"], target["subquestions"]
    if [s["id"] for s in sources] != ["bron-a", "bron-b", "bron-c", "bron-d"]:
        raise ValueError("Target source order differs")
    parts = [target["context"], *(serialize_source(s) for s in sources[:3])]
    parts += [f"**Vraag {q['label']} ({q['points']} punten).** {q['prompt']}" for q in questions[:4]]
    parts += ['<div class="page-break"></div>', serialize_source(sources[3])]
    parts += [f"**Vraag {q['label']} ({q['points']} punten).** {q['prompt']}" for q in questions[4:]]
    return "\n\n".join(parts)


def format_tables(markdown: str) -> str:
    """Bounded whole-width tables; no font overrides or shared CSS edits."""
    def convert(match):
        rows = [[c.strip() for c in line.strip().strip("|").split("|")]
                for line in match.group().strip().splitlines()]
        columns, data = rows[0], rows[2:]
        widths = {3: [50, 25, 25], 4: [37, 23, 22, 18]}[len(columns)]
        if any(len(row) != len(columns) for row in data):
            raise ValueError("Irregular table")
        return ("<table>\n<colgroup>" + "".join(f'<col style="width:{w}%">' for w in widths)
                + "</colgroup>\n<thead><tr>" + "".join(f"<th>{html.escape(c)}</th>" for c in columns)
                + "</tr></thead>\n<tbody>\n" + "\n".join("<tr>" + "".join(f"<td>{html.escape(c)}</td>" for c in row) + "</tr>" for row in data)
                + "\n</tbody></table>\n")
    return re.sub(r"(?m)^\|[^\n]+\|\n\|(?:\s*:?-+:?\s*\|)+\n(?:\|[^\n]+\|(?:\n|$))+", convert, markdown)


def documents(record: dict) -> dict[str, str]:
    exercise = (CONTENT / "exercises.md").read_text(encoding="utf-8")
    exercise = exercise.replace("{{GOALS}}", "\n".join(f"- {g}" for g in record["lesson_goals"]))
    exercise = exercise.replace("{{TARGET}}", serialize_target(record))
    target_answers = (CONTENT / "target-answers.md").read_text(encoding="utf-8")
    for label, answer in record["short_answer_model"].items():
        target_answers = target_answers.replace("{{ANSWER_" + label + "}}", answer)
    answers = (CONTENT / "answers.md").read_text(encoding="utf-8").replace("{{TARGET_ANSWERS}}", target_answers)
    result = {"opgaven": format_tables(exercise), "antwoorden": format_tables(answers)}
    for kind, value in result.items():
        if "{{" in value or "}}" in value:
            raise ValueError(f"Unresolved source placeholder: {kind}")
    return result


def text(x, y, value, *, bold=False, anchor="start"):
    return (f'<text x="{x}" y="{y}" font-family="Arial" font-size="40" '
            f'font-weight="{700 if bold else 400}" text-anchor="{anchor}" fill="{INK}">'
            f'{html.escape(value)}</text>')


def line(x1, y1, x2, y2, *, dashed=False, color=INK):
    return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" '
            f'stroke-width="3"' + (' stroke-dasharray="12 8"' if dashed else '') + '/>')


def asset_sources() -> dict[str, str]:
    outputs = {}
    for index, (product, prices, quantities, answer) in enumerate([
        ("Telescoopverhuur", (20, 22), (100, 80), False),
        ("Verrekijkerverhuur", (10, 15), (100, 60), False),
        ("Telescoopverhuur", (20, 22), (100, 80), True),
        ("Verrekijkerverhuur", (10, 15), (100, 60), True),
    ], 1):
        parts = [text(30, 52, product, bold=True)]
        for panel, (origin, price, quantity) in enumerate(zip((100, 700), prices, quantities)):
            old = panel == 0
            end_x, top_y = origin + 3 * quantity, 630 - 16 * price
            parts += [text(origin, 112, "Oud" if old else "Nieuw", bold=True),
                      text(origin, 170, "P (€ per verhuring)"),
                      f'<rect data-role="revenue" data-state="{"old" if old else "new"}" data-p="{price}" data-q="{quantity}" '
                      f'x="{origin}" y="{top_y}" width="{3 * quantity}" height="{16 * price}" fill="{"#F3EBF5" if old else "url(#new)"}" '
                      f'stroke="{PURPLE}" stroke-width="4"' + (' stroke-dasharray="12 8"' if old else '') + '/>',
                      line(origin, 630, origin + 360, 630), line(origin, 630, origin, 230)]
            for p in (0, 10, 20, 25):
                y = 630 - 16 * p
                parts += [line(origin - 6, y, origin, y), text(origin - 18, y + 14, str(p), anchor="end")]
            for q in (0, 60, 120):
                x = origin + 3 * q
                parts += [line(x, 630, x, 640), text(x, 688, str(q), anchor="middle")]
            if quantity not in (0, 60, 120):
                parts += [line(end_x, 630, end_x, 703, dashed=True), text(end_x, 749, str(quantity), anchor="middle")]
            if price not in (0, 10, 20, 25):
                parts += [line(end_x, top_y, end_x + 38, top_y, dashed=True), text(end_x + 52, top_y + 14, str(price))]
            parts += [text(origin, 806, "Q (verhuringen"), text(origin, 856, "per week)")]
        if answer:
            # Annotation band is inside the wide white header, never over a bar.
            value = "€2.000 → €1.760 per week; −12%" if index == 3 else "€1.000 → €900 per week; 1,5 × 0,6 = 0,9"
            parts.insert(1, text(1170, 52, value, anchor="end"))
            # Product and result cannot share the same horizontal ink band.
            parts[0] = text(30, 52, "A" if index == 3 else "B", bold=True)
        outputs[f"2.2.4_ex_{index}"] = (
            '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" role="img">'
            f'<title>{html.escape(TITLES[index - 1])}</title>'
            f'<defs><pattern id="new" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="{PALE}"/>'
            f'<path d="M0 14L14 0" stroke="{PURPLE}" stroke-width="2"/></pattern></defs>'
            '<rect width="1200" height="900" fill="white"/>' + ''.join(parts) + '</svg>\n')
    return outputs


def wrapper_source() -> str:
    return '''"""Thin §2.2.4 entrypoint; all source/rendering lives in the paired platform."""
from pathlib import Path
import subprocess
import sys

lesson_root = Path(__file__).resolve().parents[3]
builder = lesson_root.parent / "4veco-platform/build-scripts/content/book-2/b2_224.py"
if not builder.is_file():
    raise SystemExit(f"Paired platform builder not found: {builder}")
subprocess.run([sys.executable, str(builder), "--lesson-root", str(lesson_root),
                *sys.argv[1:]], check=True)
'''


def native_paths(destination: Path) -> list[Path]:
    return ([destination / f"{STEM} – {kind}.{ext}" for kind in ("opgaven", "antwoorden") for ext in ("md", "html", "pdf")]
            + [destination / "build_pdf.py"]
            + [destination / "_assets" / f"2.2.4_ex_{n}.{ext}" for n in range(1, 5) for ext in ("svg", "png")])


def build(lesson_root: Path, proof_root: Path | None = None, *, proof_suffix="", print_only=False) -> dict:
    # Nothing above this line at import time writes or launches processes.
    manifest = verify_current_release(lesson_root, ROOT)
    verify_committed_release(manifest, lesson_root, ROOT)
    if proof_root is not None and not re.fullmatch(r"r[1-9][0-9]*", proof_suffix):
        raise ValueError("A fresh revision suffix is required for proof")
    lesson_root = lesson_root.resolve(strict=True)
    destination = (lesson_root / LESSON_REL).resolve(strict=True)
    if destination.parent.parent.parent != lesson_root:
        raise ValueError("Unexpected paragraph root")
    if proof_root and proof_root.exists() and any(proof_root.glob(f"224-*-{proof_suffix}")):
        raise ValueError("Proof revision already used in this evidence root")
    record = target_record(ROOT)
    source_documents, source_assets = documents(record), asset_sources()
    for command in [
        ["node", "build-scripts/workflows/check-book-outline-currentness.js", "--require-approved", "--action", "paragraph_production", "--paragraph", "2.2.4"],
        ["node", "build-scripts/workflows/check-book2-target-authority-remediation.js", "--durable"],
    ]:
        subprocess.run(command, cwd=ROOT, check=True)
    if not print_only:
        (destination / "_assets").mkdir(exist_ok=True)
        for name, source in source_assets.items():
            path = destination / "_assets" / f"{name}.svg"
            path.write_text(source, encoding="utf-8", newline="\n")
            subprocess.run([sys.executable, "-m", "cairosvg", str(path), "-o", str(path.with_suffix(".png")), "-s", "2"], check=True)
        (destination / "build_pdf.py").write_text(wrapper_source(), encoding="utf-8", newline="\n")
        for kind, markdown in source_documents.items():
            (destination / f"{STEM} – {kind}.md").write_text(markdown.rstrip() + "\n", encoding="utf-8", newline="\n")
    else:
        for kind, markdown in source_documents.items():
            if (destination / f"{STEM} – {kind}.md").read_bytes() != (markdown.rstrip() + "\n").encode():
                raise ValueError("Print-only Markdown differs from exact source derivation")
        for name, source in source_assets.items():
            if (destination / "_assets" / f"{name}.svg").read_bytes() != source.encode():
                raise ValueError("Print-only SVG differs from source derivation")
    records = []
    for kind in source_documents:
        built = build_document(destination / f"{STEM} – {kind}.md")
        if proof_root:
            proof_dir = proof_root / f"224-{kind}-{built['pdf_sha256'][:12]}-{proof_suffix}"
            render_proof(built, proof_dir)
            built["proof_directory"] = str(proof_dir.resolve())
        records.append(built)
    paths = native_paths(destination)
    if any(not p.is_file() for p in paths) or len(paths) != 15:
        raise ValueError("Incomplete fifteen-file native contract")
    return {"paragraph": "2.2.4", "release_commit": RELEASE_COMMIT, "release_sha256": RELEASE_HASH,
            "accepted_input_count": 34, "target_sha256": TARGET_HASH, "plan_sha256": PLAN_HASH,
            "inspection_status": "PENDING", "documents": records,
            "native_files": [{"path": str(p.relative_to(lesson_root)), "sha256": digest(p)} for p in paths],
            "source_files": [{"path": str(p.relative_to(ROOT)), "sha256": digest(p)} for p in
                             [Path(__file__), Path(__file__).with_name("print_pipeline.py"), *sorted(CONTENT.glob("*.md"))]]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lesson-root", type=Path, default=ROOT.parent / "4veco-lessen")
    parser.add_argument("--proof-root", type=Path)
    parser.add_argument("--proof-suffix", default="")
    parser.add_argument("--manifest", type=Path)
    parser.add_argument("--print-only", action="store_true")
    args = parser.parse_args()
    # A caller may not overwrite an earlier failed/pending evidence manifest.
    if args.manifest and args.manifest.exists():
        raise ValueError("Manifest already exists; choose a fresh attempt")
    result = build(args.lesson_root, args.proof_root, proof_suffix=args.proof_suffix, print_only=args.print_only)
    if args.manifest:
        args.manifest.parent.mkdir(parents=True, exist_ok=True)
        args.manifest.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps(result, ensure_ascii=True, indent=2))


if __name__ == "__main__":
    main()
