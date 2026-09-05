"""Exact-source Book 2 Part A chapter assembly (no review/hold authorization).

Call only after independent paragraph/chapter gates. This module assembles
already reviewed Markdown; it does not create teaching content or approve it.
Front matter must be authored/reviewed separately. Both outputs share the
paragraph print pipeline and retain the original exercise source exactly once.
"""
from __future__ import annotations

import hashlib
import re
from pathlib import Path

from bs4 import BeautifulSoup

from print_pipeline import build_document, digest, prepare_html, render_proof


def _read_pinned(path: Path, expected: str) -> tuple[str, dict]:
    data = path.read_bytes()
    actual = hashlib.sha256(data).hexdigest()
    if not re.fullmatch(r"[a-f0-9]{64}", expected) or actual != expected:
        raise ValueError(f"Unpinned or changed chapter input: {path}")
    return data.decode("utf-8-sig"), {"path": str(path), "sha256": actual}


def prepare_chapter(chapter_dir: Path, spec: dict, *, pandoc: str = "pandoc") -> dict:
    """Preflight all eight exact sources/assets before any output write.

    spec: nr, title, front_html, paragraphs (nr, folder, student_sha256,
    answers_sha256). Book 2 has three theory paragraphs followed by one mixed
    paragraph. No discovery by broad filename substring or companion fallback.
    Hashes are raw source-byte hashes recorded by the reviewed handoffs.
    """
    chapter_dir = chapter_dir.resolve(strict=True)
    nr, title = spec["nr"], spec["title"]
    if not re.fullmatch(r"2\.[123]", nr) or chapter_dir.name != f"{nr} Hoofdstuk {title}":
        raise ValueError("Expected the exact Book 2 chapter directory")
    paragraphs = spec["paragraphs"]
    if [p["nr"] for p in paragraphs] != [f"{nr}.{i}" for i in range(1, 5)]:
        raise ValueError("Expected ordered, unique Book 2 paragraphs 1 through 4")
    front = spec["front_html"].strip()
    front_soup = BeautifulSoup(front, "html.parser")
    roots = [child for child in front_soup.contents if getattr(child, "name", None)]
    if len(roots) != 1 or roots[0].name != "div" or "chapter-front" not in roots[0].get("class", []):
        raise ValueError("Reviewed front matter must be one chapter-front div")
    # Validate active/resource/style channels without publishing a render.
    _, front_assets = prepare_html(front, chapter_dir / "front.md", pandoc=pandoc)
    if front_assets:
        raise ValueError("Chapter front requires text-only title, contents, goals and introduction")

    student_parts = [front]
    answer_parts = [f"# Antwoorden Hoofdstuk {nr} — {title}"]
    inputs, assets = [], {}
    for index, paragraph in enumerate(paragraphs, 1):
        folder_name = paragraph["folder"]
        if not folder_name.startswith(paragraph["nr"] + " ") or Path(folder_name).name != folder_name:
            raise ValueError("Paragraph folder must be one exact chapter-local name")
        folder = (chapter_dir / folder_name).resolve(strict=True)
        if folder.parent != chapter_dir:
            raise ValueError("Paragraph folder escapes the selected chapter")
        student_kind = "opgaven" if index == 4 else "paragraaf"
        for kind, destination, hash_key in (
            (student_kind, student_parts, "student_sha256"),
            ("antwoorden", answer_parts, "answers_sha256"),
        ):
            source = (folder / f"{folder_name} – {kind}.md").resolve(strict=True)
            if source.parent != folder:
                raise ValueError("Paragraph source escapes its selected folder")
            markdown, record = _read_pinned(source, paragraph[hash_key])
            if not markdown.lstrip().startswith(f"# {folder_name}"):
                raise ValueError(f"Source heading does not identify its paragraph: {source}")
            _, used_assets = prepare_html(markdown, source, pandoc=pandoc)
            for asset in used_assets:
                path = Path(asset["path"])
                if path.parent != folder / "_assets" or not re.fullmatch(
                    re.escape(paragraph["nr"]) + r"_(?:fig|we|ex)_\d+\.(?:svg|png)", path.name
                ):
                    raise ValueError(f"Chapter asset must have its paragraph namespace: {path}")
                previous = assets.get(path.name)
                if previous and previous["sha256"] != asset["sha256"]:
                    raise ValueError(f"Conflicting aggregate asset: {path.name}")
                assets[path.name] = asset
            inputs.append(record)
            # Retain the complete reviewed source; do not append theory opgaven.
            destination.append('<div class="page-break"></div>\n\n' + markdown.strip())
    result = {"student_md": "\n\n".join(student_parts) + "\n",
              "answers_md": "\n\n".join(answer_parts) + "\n",
              "inputs": inputs, "assets": list(assets.values())}
    verify_chapter_inputs(result)
    return result


def verify_chapter_inputs(prepared: dict) -> None:
    for record in prepared["inputs"] + prepared["assets"]:
        if digest(Path(record["path"])) != record["sha256"]:
            raise ValueError(f"Chapter input changed after preflight: {record['path']}")


def build_chapter(chapter_dir: Path, spec: dict, *, proof_root: Path | None = None,
                  pandoc: str = "pandoc", pdftoppm: str = "pdftoppm") -> list[dict]:
    prepared = prepare_chapter(chapter_dir, spec, pandoc=pandoc)
    chapter_dir = chapter_dir.resolve(strict=True)
    destination_assets = chapter_dir / "_assets"
    verify_chapter_inputs(prepared)
    for asset in prepared["assets"]:
        source = Path(asset["path"])
        data = source.read_bytes()
        if hashlib.sha256(data).hexdigest() != asset["sha256"]:
            raise ValueError(f"Asset changed during chapter collection: {source}")
        destination_assets.mkdir(exist_ok=True)
        destination = destination_assets / source.name
        destination.write_bytes(data)
        if digest(destination) != asset["sha256"]:
            raise ValueError(f"Aggregate asset does not match paragraph: {destination}")
    results = []
    for kind, source_key in (("hoofdstuk", "student_md"), ("antwoorden", "answers_md")):
        path = chapter_dir / f"{spec['nr']} {spec['title']} – {kind}.md"
        path.write_bytes(prepared[source_key].replace("\r\n", "\n").encode("utf-8"))
        record = build_document(path, pandoc=pandoc)
        # Bind paragraph sources in the on-disk proof, including capture-time
        # freshness checks, not only in this function's returned result.
        record["assembly_inputs"] = prepared["inputs"] + prepared["assets"]
        verify_chapter_inputs(prepared)
        if proof_root:
            record = render_proof(record, proof_root / f"{spec['nr']}-{kind}-{record['pdf_sha256'][:12]}",
                                  pdftoppm=pdftoppm)
        results.append(record)
    verify_chapter_inputs(prepared)
    return results
