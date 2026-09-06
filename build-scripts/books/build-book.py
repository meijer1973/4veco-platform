#!/usr/bin/env python3
"""
Book builder CLI — assembles a printable textbook from chapter outputs
in 4veco-lessen/.

Prerequisite: every chapter listed in the book manifest must already be
assembled via econ-chapter-builder (i.e., hoofdstuk.md + _assets/ exist).

Usage:
    python build-scripts/books/build-book.py --book 1
    python build-scripts/books/build-book.py --book 1 --lessen-root ../4veco-lessen

See skills/econ-book-builder.md for the full design.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from lib_book import build_book  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Assemble a printable textbook from chapter outputs."
    )
    parser.add_argument(
        "--book",
        type=int,
        required=True,
        help="Book number (1-4).",
    )
    parser.add_argument(
        "--lessen-root",
        default="../4veco-lessen",
        help="Path to 4veco-lessen root (default: ../4veco-lessen).",
    )
    parser.add_argument(
        "--platform-root",
        default=".",
        help="Path to 4veco-platform root (default: current directory).",
    )
    parser.add_argument(
        "--proof-root",
        type=Path,
        help="Unused Book 2 task-evidence namespace for an independent native capture.",
    )
    args = parser.parse_args()

    platform_root = Path(args.platform_root).resolve()
    lessen_root = Path(args.lessen_root).resolve()

    if not lessen_root.is_dir():
        sys.exit(f"ERROR: lessen root not found: {lessen_root}")

    manifest_path = (
        platform_root
        / "build-scripts"
        / "books"
        / "book-manifests"
        / f"book-{args.book}.json"
    )
    if not manifest_path.exists():
        sys.exit(f"ERROR: manifest not found: {manifest_path}")

    try:
        if args.proof_root is None:
            build_book(manifest_path, lessen_root, platform_root)
        else:
            build_book(manifest_path, lessen_root, platform_root, proof_root=args.proof_root)
    except FileNotFoundError as e:
        sys.exit(f"ERROR: {e}")
    except ValueError as e:
        sys.exit(f"ERROR: {e}")


if __name__ == "__main__":
    main()
