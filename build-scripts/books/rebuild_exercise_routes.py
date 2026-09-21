"""Rebuild the 2026-09-21 Part A route revision from the selected editable sources.

Received renderers remain immutable provenance. This platform entry point owns
the current assembly/record templates and binds revised Book 2 chapter inputs.
Use the pinned books34-v3 renderer environment and locally available fonts.
"""
from pathlib import Path
import argparse
import importlib
import json
import os
import runpy
import shutil
import subprocess
import sys

import fitz
from build_book2_chat import EDITION, build, file_record

PLATFORM = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
REVISION = "exercise-routes-20260921"


def write_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2)+"\n", encoding="utf-8", newline="\n")


def book2_chapter(lessons, number):
    folder = lessons / EDITION / "bronnen" / f"H{number}"
    receipt = json.loads((lessons/EDITION/"delivery-manifest.json").read_text(encoding="utf-8"))
    received = {r["path"]: r for r in receipt["files"]}
    # This route-only revision reuses answer PDFs. Fail rather than publishing
    # stale answers if their source or the reused PDF has subsequently changed.
    answer_inputs = [*folder.glob("*antwoorden.md"), *folder.glob("*Antwoorden.md"),
                     *folder.glob("output/*Antwoorden.pdf")]
    for source in set(answer_inputs):
        current = file_record(lessons/EDITION, source)
        old = received[current["path"]]
        if any(current[k] != old[k] for k in current):
            raise ValueError("Changed answer input requires an explicit answer rebuild: "+current["path"])
    sys.path.insert(0, str(folder))
    renderer = importlib.import_module("build")
    renderer.CSS += "\n.route{padding:4pt 9pt;margin:4pt 0 5pt;line-height:1.15;}\n"
    renderer.build_chapter()
    page_map = json.loads((folder/"output/page_map.json").read_text(encoding="utf-8"))
    if any([str(p["pdf_page"])] != p["designed_pages"] for p in page_map):
        raise ValueError(f"Book 2 H{number}: designed-page overflow")
    # Answers do not change; reuse their already reviewed chapter bytes. The
    # existing exporter retains the source answers and slices/rebuilds its views.
    importlib.import_module("build_teacher").build_teacher()
    exporter = importlib.import_module("export_paragraphs")
    # Extended paths avoid Windows MAX_PATH failures for the long Dutch
    # paragraph filenames in a nested paired worktree.
    previous = Path.cwd()
    try:
        os.chdir(folder)
        exporter.ROOT = Path("\\\\?\\" + str(folder)) if os.name == "nt" else folder
        exporter.export()
        for wrapper in (folder/"paragrafen").glob("*/build_pdf.py"):
            wrapper.write_text('''"""Rebuild this current edition through the platform-owned route."""
from pathlib import Path
import subprocess
import sys
lessons = Path(__file__).resolve().parents[7]
builder = lessons.parent / "4veco-platform/build-scripts/books/rebuild_exercise_routes.py"
subprocess.run([sys.executable, "-X", "utf8", str(builder), "--lesson-root", str(lessons), "--books", "2"], check=True)
''', encoding="utf-8", newline="\n")
        # Received exporters use the host's default text newline. Canonicalize
        # only generated text, never the immutable renderer or authored answers.
        generated = [*folder.glob("*hoofdstuk.md"), *folder.glob("paragraph-exports.json")]
        for generated_root in (folder/"output", exporter.ROOT/"paragrafen"):
            generated.extend(p for p in generated_root.rglob("*")
                             if p.is_file() and p.suffix in (".md", ".html", ".json", ".py", ".css"))
        for file in generated:
            text = file.read_text(encoding="utf-8")
            if file.name == "manifest.json":
                rows = json.loads(text)
                if isinstance(rows, list):
                    for row in rows:
                        if isinstance(row, dict) and "folder" in row:
                            row["folder"] = row["folder"].replace("\\", "/")
                    text = json.dumps(rows, ensure_ascii=False, indent=2)+"\n"
            file.write_text(text, encoding="utf-8", newline="\n")
    finally:
        os.chdir(previous)


def book2(lessons):
    root = lessons / EDITION
    for number in (1, 2, 3):
        subprocess.run([sys.executable, "-X", "utf8", str(__file__), "--lesson-root", str(lessons),
                        "--book2-chapter", str(number)], check=True)
    config = json.loads((root/"assembly.json").read_text(encoding="utf-8"))
    for bundle in config["bundles"]:
        counts = []
        for number, name in enumerate(bundle["chapters"], 1):
            source = root/f"bronnen/H{number}/output"/Path(name).name
            shutil.copyfile(source, root/name)
            with fitz.open(source) as doc:
                counts.append(len(doc))
        # Student/reference pages must stay stable. Teacher pagination can grow.
        if bundle["kind"] != "teacher" and counts != bundle["page_counts"]:
            raise ValueError("Unexpected student/answer pagination")
        bundle["page_counts"] = counts
    write_json(root/"assembly.json", config)
    sources = [root/"assembly.json"]
    for folder in sorted((root/"bronnen").glob("H*")):
        sources.extend(sorted((folder/"manuscript").glob("*.md")))
        sources.extend(sorted(folder.glob("*.py")))
        sources.extend(sorted(folder.glob("*antwoorden.md")))
        sources.extend(sorted(folder.glob("*Docenten*.md")))
        sources.append(folder/"chapter-order.json")
        sources.extend(sorted((folder/"_assets").glob("*")))
    sources = sorted(set(p for p in sources if p.is_file()))
    write_json(root/"route-chapter-inputs.json", {
        "revision": REVISION,
        "sources": [file_record(root, p) for p in sources],
        "chapters": {name: file_record(root, root/name) for b in config["bundles"] for name in b["chapters"]},
    })
    build(root, revised=True)


def books34(lessons):
    root = lessons/"edities/books34-v3"
    for name in ("render.py", "content.py", "export_paragraphs.py", "preview_targets.py", "render_outlines.py"):
        received = PLATFORM/"references/staged/books34-v3/build"/name
        if (root/"build"/name).read_bytes() != received.read_bytes():
            raise ValueError(f"Received renderer changed; revise the platform build path explicitly: {name}")
    sys.path.insert(0, str(root/"build"))
    renderer = importlib.import_module("render")
    # The received renderer's root resolves to the selected lesson sources.
    if renderer.ROOT.resolve() != root.resolve():
        raise ValueError("Wrong Books 3/4 source root")
    results = []
    for chapter in ("3.1", "3.2", "3.3", "4.1", "4.2", "4.3"):
        current = renderer.build_chapter(chapter, ("student", "teacher"))
        if any(r["overflow"] for r in current):
            raise ValueError(f"{chapter}: designed-page overflow")
        results.extend(current)
    # Current templates live in platform, not generated book-matter/front.md.
    runpy.run_path(str(HERE/"books34_assemble.py"), run_name="__main__")
    runpy.run_path(str(HERE/"books34_records.py"), run_name="__main__")
    runpy.run_path(str(root/"build/export_paragraphs.py"), run_name="__main__")
    runpy.run_path(str(root/"build/preview_targets.py"), run_name="__main__")
    runpy.run_path(str(HERE/"books34_outlines.py"), run_name="__main__")
    evidence = root/"checks/route-revision-build.json"
    write_json(evidence, {"revision": REVISION, "chapters": results})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lesson-root", type=Path, default=PLATFORM.parent/"4veco-lessen")
    parser.add_argument("--books", choices=("2", "34", "all"), default="all")
    parser.add_argument("--book2-chapter", type=int, choices=(1, 2, 3))
    args = parser.parse_args()
    os.environ["PYTHONUTF8"] = "1"
    os.environ["PYTHONDONTWRITEBYTECODE"] = "1"
    sys.dont_write_bytecode = True
    lessons = args.lesson_root.resolve()
    if args.book2_chapter:
        book2_chapter(lessons, args.book2_chapter)
    else:
        if args.books in ("2", "all"):
            book2(lessons)
        if args.books in ("34", "all"):
            books34(lessons)


if __name__ == "__main__":
    main()
