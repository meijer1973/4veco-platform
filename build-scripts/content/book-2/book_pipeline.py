"""Pinned, stitch-only Book 2 student/answer assembly for the book CLI.

This profile does not rebuild or approve chapters. The reviewed manifest binds
chapter sources/assets and independently authored paper-only front/back matter.
No machine glossary, legacy website-only answer note or Book 1 styling is used.
"""
from __future__ import annotations

import hashlib
import json
import re
import subprocess
from pathlib import Path

from chapter_pipeline import _read_pinned, verify_chapter_inputs
from print_pipeline import build_document, digest, prepare_html, render_proof

PROFILE = "book2-frozen-part-a"
TITLE = "Kosten, opbrengsten, elasticiteit en surplus"
CHAPTERS = [("2.1", "Kosten en opbrengsten"), ("2.2", "Elasticiteit"),
            ("2.3", "Surplus en welvaart")]
BREAK = '<div class="page-break"></div>'


def _local_file(root: Path, relative: str) -> Path:
    path = (root / relative).resolve(strict=True)
    if not path.is_relative_to(root) or not path.is_file():
        raise ValueError(f"Book input escapes its declared root: {relative}")
    return path


def _namespace_chapter(markdown: str, chapter: str, kind: str) -> str:
    """Prefix authored anchors without modifying the reviewed teaching text.

    Paragraph headings repeat e.g. 'Startopgaven'; Pandoc otherwise creates
    implicit suffixed IDs, which is acceptable, but authored links/IDs must
    remain unique and retain their relationship within each chapter.
    """
    prefix = f"book-{kind}-{chapter.replace('.', '-')}-"
    markdown = re.sub(r'\bid="([^"]+)"', lambda m: f'id="{prefix}{m[1]}"', markdown)
    markdown = re.sub(r'\bhref="#([^"]+)"', lambda m: f'href="#{prefix}{m[1]}"', markdown)
    markdown = re.sub(r'\{#([^}\s]+)\}', lambda m: f'{{#{prefix}{m[1]}}}', markdown)
    markdown = re.sub(r'\]\(#([^\s)]+)\)', lambda m: f'](#{prefix}{m[1]})', markdown)
    # Explicit stable TOC targets supplement Pandoc's generated heading IDs.
    for index in range(1, 5):
        nr = f"{chapter}.{index}"
        pattern = r"(?m)^(# " + re.escape(nr) + r" [^\n]+)$"
        if len(re.findall(pattern, markdown)) != 1:
            raise ValueError(f"Chapter must contain exactly one complete paragraph heading: {nr}/{kind}")
        anchor = f'<div id="book-{kind}-paragraph-{nr.replace(".", "-")}"></div>'
        markdown = re.sub(pattern, lambda m: anchor + "\n\n" + m[1], markdown)
    return markdown


def prepare_book(manifest_path: Path, lesson_root: Path, platform_root: Path) -> dict:
    """Validate exact inputs before any output mutation; never infer approval."""
    platform_root = platform_root.resolve(strict=True)
    lesson_root = lesson_root.resolve(strict=True)
    manifest_path = manifest_path.resolve(strict=True)
    if not manifest_path.is_relative_to(platform_root / "build-scripts" / "books" / "book-manifests"):
        raise ValueError("Book 2 manifest must stay in the platform book-manifests directory")
    raw = manifest_path.read_bytes()
    spec = json.loads(raw)
    if spec.get("print_profile") != PROFILE or spec.get("book", {}).get("nr") != 2 or spec["book"].get("title") != TITLE:
        raise ValueError("Expected the exact frozen Book 2 print profile")
    if [(c.get("nr"), c.get("title")) for c in spec["chapters"]] != CHAPTERS:
        raise ValueError("Book 2 requires all three unique chapters in reviewed order")
    book_dir = (lesson_root / f"Boek 2 - {TITLE}").resolve(strict=True)
    if book_dir.parent != lesson_root:
        raise ValueError("Book directory escapes the lesson root")
    _, plan_record = _read_pinned(book_dir / "_book-plan.md", spec["book_plan_sha256"])
    inputs = [{"path": str(manifest_path), "sha256": hashlib.sha256(raw).hexdigest()}, plan_record]
    documents, all_assets = {}, {}
    for kind in ("boek", "antwoorden"):
        # Front/back matter is explicit, reviewed source, including cover,
        # colofon, preface, complete TOC, glossary and formula overview as needed.
        front_back = []
        for position in ("front", "back"):
            item = spec["matter"][kind][position]
            path = _local_file(platform_root, item["path"])
            if not path.is_relative_to(platform_root / "build-scripts" / "books" / "book-manifests"):
                raise ValueError("Reviewed book matter must stay in book-manifests")
            markdown, record = _read_pinned(path, item["sha256"])
            _, assets = prepare_html(markdown, path)
            if assets:
                raise ValueError("Book matter must be text-only; chapter diagrams remain in the body")
            inputs.append(record)
            front_back.append(f'::: {{.book-{position}}}\n\n{markdown.strip()}\n\n:::')
        body = []
        for chapter in spec["chapters"]:
            nr, title = chapter["nr"], chapter["title"]
            folder = (book_dir / f"{nr} Hoofdstuk {title}").resolve(strict=True)
            if folder.parent != book_dir:
                raise ValueError("Chapter escapes the book root")
            source_kind = "hoofdstuk" if kind == "boek" else "antwoorden"
            source = _local_file(folder, f"{nr} {title} – {source_kind}.md")
            markdown, record = _read_pinned(source, chapter[f"{source_kind}_sha256"])
            _, used_assets = prepare_html(markdown, source)
            expected = chapter.get("asset_sha256", {}).get(source_kind)
            if not isinstance(expected, dict):
                raise ValueError("Each chapter edition requires its explicit reviewed asset hash map")
            observed = {}
            for asset in used_assets:
                path = Path(asset["path"])
                if path.parent != folder / "_assets" or not re.fullmatch(
                    re.escape(nr) + r"\.[1234]_(?:fig|we|ex)_\d+\.(?:svg|png)", path.name
                ):
                    raise ValueError(f"Book asset must keep its chapter/paragraph namespace: {path}")
                previous = all_assets.get(path.name)
                if previous and previous["sha256"] != asset["sha256"]:
                    raise ValueError(f"Conflicting book asset: {path.name}")
                all_assets[path.name] = asset
                observed[path.name] = asset["sha256"]
            if observed != expected:
                raise ValueError(f"Reviewed chapter asset pins differ: {nr}/{kind}")
            inputs.append(record)
            anchor = f'<div id="book-{kind}-chapter-{nr.replace(".", "-")}"></div>'
            body.append(anchor + "\n\n" + _namespace_chapter(markdown.strip(), nr, kind))
        documents[kind] = (f"\n\n{BREAK}\n\n".join([front_back[0], *body, front_back[1]]) + "\n")
    prepared = {"documents": documents, "inputs": inputs, "assets": list(all_assets.values()),
                "book_dir": str(book_dir), "spec": spec}
    verify_chapter_inputs(prepared)
    return prepared


def build_book(manifest_path: Path, lesson_root: Path, platform_root: Path) -> list[dict]:
    prepared = prepare_book(manifest_path, lesson_root, platform_root)
    for args in (
        ["node", "build-scripts/workflows/check-book-outline-currentness.js", "--require-approved",
         "--action", "whole_book_assembly"],
        ["node", "build-scripts/workflows/check-book2-target-authority-remediation.js", "--durable"],
    ):
        subprocess.run(args, cwd=platform_root, check=True)
    verify_chapter_inputs(prepared)
    book_dir = Path(prepared["book_dir"])
    for asset in prepared["assets"]:
        data = Path(asset["path"]).read_bytes()
        if hashlib.sha256(data).hexdigest() != asset["sha256"]:
            raise ValueError("Chapter asset changed during collection")
        output = book_dir / "_assets" / Path(asset["path"]).name
        output.parent.mkdir(exist_ok=True)
        output.write_bytes(data)
        if digest(output) != asset["sha256"]:
            raise ValueError("Collected book asset differs from its reviewed source")
    proof_root = platform_root / "reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1"
    results = []
    for kind, markdown in prepared["documents"].items():
        output = book_dir / f"Boek 2 {TITLE} – {kind}.md"
        output.write_bytes(markdown.replace("\r\n", "\n").encode("utf-8"))
        record = build_document(output)
        record["assembly_inputs"] = prepared["inputs"] + prepared["assets"]
        verify_chapter_inputs(prepared)
        proof = proof_root / f"book-2-{kind}-{record['pdf_sha256'][:12]}"
        results.append(render_proof(record, proof))
    verify_chapter_inputs(prepared)
    return results
