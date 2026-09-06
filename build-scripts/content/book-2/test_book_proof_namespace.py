"""Unused Book2 proof namespaces; all chapter/matter data are technical fixtures."""
from __future__ import annotations

import json
import runpy
import subprocess
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

from PIL import Image

import test_book_pipeline as fixtures
from book_pipeline import build_book
from print_pipeline import digest


class BookProofNamespaceTests(unittest.TestCase):
    def setUp(self):
        # Reuse setup data, not its assertions or any real student authority.
        fixtures.BookPipelineTests.setUp(self)

    def save(self):
        fixtures.BookPipelineTests.save(self)

    def proof(self, revision="r1"):
        return self.platform / "reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1" / f"book-namespace-{revision}"

    def snapshot(self):
        return {p.relative_to(self.temp.name).as_posix(): digest(p)
                for p in Path(self.temp.name).rglob("*") if p.is_file()}

    def fixture_gates(self, args, **kwargs):
        if args[0] == "node":
            return subprocess.CompletedProcess(args, 0)
        return self.real_run(args, **kwargs)

    def test_existing_empty_and_populated_namespaces_reject_before_preflight(self):
        for revision, populated in (("empty", False), ("populated", True)):
            with self.subTest(revision=revision):
                destination = self.proof(revision)
                destination.mkdir(parents=True)
                if populated:
                    (destination / "original-proof.txt").write_text("Immutable fixture evidence", encoding="utf-8")
                before = self.snapshot()
                with patch("book_pipeline.prepare_book") as prepare, \
                     patch("book_pipeline.subprocess.run") as commands, \
                     patch("book_pipeline.build_document") as render:
                    with self.assertRaisesRegex(ValueError, "already exists"):
                        build_book(self.manifest, self.lessons, self.platform, proof_root=destination)
                    prepare.assert_not_called()
                    commands.assert_not_called()
                    render.assert_not_called()
                self.assertEqual(self.snapshot(), before)

    def test_out_of_scope_and_broad_roots_reject_before_preflight(self):
        paths = [Path(self.temp.name) / "outside", self.platform / "other",
                 self.platform / "reports", self.platform / "reports/sprints/other-sprint",
                 self.platform / "reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1",
                 self.proof().parent / ".." / "different-sprint" / "r1"]
        for destination in paths:
            with self.subTest(destination=str(destination)), patch("book_pipeline.prepare_book") as prepare:
                with self.assertRaisesRegex(ValueError, "platform task evidence"):
                    build_book(self.manifest, self.lessons, self.platform, proof_root=destination)
                prepare.assert_not_called()
                self.assertFalse(destination.exists())

    def test_denied_authority_does_not_reserve_namespace_or_write_outputs(self):
        before = self.snapshot()
        self.real_run = subprocess.run

        def denied(args, **kwargs):
            if args[0] == "node":
                raise subprocess.CalledProcessError(1, args)
            return self.real_run(args, **kwargs)

        with patch("book_pipeline.subprocess.run", side_effect=denied), \
             patch("book_pipeline.build_document") as render:
            with self.assertRaises(subprocess.CalledProcessError):
                build_book(self.manifest, self.lessons, self.platform, proof_root=self.proof())
            render.assert_not_called()
        self.assertEqual(self.snapshot(), before)
        self.assertFalse(self.proof().exists())

    def test_stale_input_does_not_reserve_namespace_or_invoke_authority(self):
        self.spec["chapters"][0]["hoofdstuk_sha256"] = "0" * 64
        self.save()
        before = self.snapshot()
        self.real_run = subprocess.run
        calls = []

        def observed(args, **kwargs):
            if args[0] == "node":
                calls.append(args)
            return self.real_run(args, **kwargs)

        with patch("book_pipeline.subprocess.run", side_effect=observed), \
             patch("book_pipeline.build_document") as render:
            with self.assertRaisesRegex(ValueError, "Unpinned or changed"):
                build_book(self.manifest, self.lessons, self.platform, proof_root=self.proof())
            render.assert_not_called()
        self.assertEqual(calls, [])
        self.assertEqual(self.snapshot(), before)
        self.assertFalse(self.proof().exists())

    def test_namespace_appearing_during_preflight_rejects_before_student_writes(self):
        before = self.snapshot()
        self.real_run = subprocess.run

        def competing_reservation(args, **kwargs):
            if args[0] == "node":
                self.proof().mkdir(parents=True, exist_ok=True)
                return subprocess.CompletedProcess(args, 0)
            return self.real_run(args, **kwargs)

        with patch("book_pipeline.subprocess.run", side_effect=competing_reservation), \
             patch("book_pipeline.build_document") as render:
            with self.assertRaisesRegex(ValueError, "already exists"):
                build_book(self.manifest, self.lessons, self.platform, proof_root=self.proof())
            render.assert_not_called()
        self.assertEqual(self.snapshot(), before)
        self.assertEqual(list(self.proof().iterdir()), [])

    def test_failed_render_consumes_namespace_and_cannot_overwrite_proof(self):
        self.real_run = subprocess.run
        destination = self.platform / "reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-book-proof-fixture/r1"
        with patch("book_pipeline.subprocess.run", side_effect=self.fixture_gates), \
             patch("book_pipeline.build_document", side_effect=RuntimeError("fixture renderer failure")):
            with self.assertRaisesRegex(RuntimeError, "fixture renderer failure"):
                build_book(self.manifest, self.lessons, self.platform, proof_root=destination)
        self.assertTrue(destination.is_dir())
        before = self.snapshot()
        with patch("book_pipeline.prepare_book") as prepare:
            with self.assertRaisesRegex(ValueError, "already exists"):
                build_book(self.manifest, self.lessons, self.platform, proof_root=destination)
            prepare.assert_not_called()
        self.assertEqual(self.snapshot(), before)

    def test_atomic_reservation_collision_precedes_student_writes(self):
        self.proof().parent.mkdir(parents=True)
        before = self.snapshot()
        self.real_run = subprocess.run
        real_mkdir = Path.mkdir

        def competing_mkdir(destination, *args, **kwargs):
            if destination == self.proof():
                real_mkdir(destination)
            return real_mkdir(destination, *args, **kwargs)

        with patch("book_pipeline.subprocess.run", side_effect=self.fixture_gates), \
             patch.object(Path, "mkdir", competing_mkdir), \
             patch("book_pipeline.build_document") as render:
            with self.assertRaisesRegex(ValueError, "concurrently reserved"):
                build_book(self.manifest, self.lessons, self.platform, proof_root=self.proof())
            render.assert_not_called()
        self.assertEqual(self.snapshot(), before)

    def test_common_dispatch_forwards_only_explicit_book2_option(self):
        sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "books"))
        import lib_book
        with patch("book_pipeline.build_book", return_value=[]) as delegated:
            lib_book.build_book(self.manifest, self.lessons, self.platform, proof_root=self.proof())
            delegated.assert_called_once_with(self.manifest, self.lessons, self.platform, proof_root=self.proof())
        with patch("book_pipeline.build_book", return_value=[]) as delegated:
            lib_book.build_book(self.manifest, self.lessons, self.platform)
            delegated.assert_called_once_with(self.manifest, self.lessons, self.platform)
        del self.spec["print_profile"]
        self.save()
        with patch("lib_book.detect_toolchain_versions") as legacy:
            with self.assertRaisesRegex(ValueError, "require the frozen Book 2"):
                lib_book.build_book(self.manifest, self.lessons, self.platform, proof_root=self.proof())
            legacy.assert_not_called()

    def test_existing_cli_forwards_explicit_option_and_preserves_default_call(self):
        sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "books"))
        import lib_book
        cli = Path(__file__).resolve().parents[2] / "books/build-book.py"
        argv = [str(cli), "--book", "2", "--platform-root", str(self.platform), "--lessen-root", str(self.lessons)]
        for option in ([], ["--proof-root", str(self.proof())]):
            with self.subTest(option=option), patch.object(sys, "argv", argv + option), \
                 patch.object(lib_book, "build_book") as delegated:
                runpy.run_path(str(cli), run_name="__main__")
                kwargs = {"proof_root": self.proof()} if option else {}
                delegated.assert_called_once_with(self.manifest, self.lessons, self.platform, **kwargs)

    def test_two_real_native_rebuilds_preserve_bytes_pixels_and_independent_proof(self):
        """Stub only fixture authority: real Pandoc, WeasyPrint and Poppler twice."""
        folder = self.book / "2.1 Hoofdstuk Kosten en opbrengsten"
        assets = folder / "_assets"
        assets.mkdir()
        svg = assets / "2.1.1_fig_1.svg"
        svg.write_text('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">'
                       '<rect width="40" height="40" fill="#17365d"/></svg>', encoding="utf-8")
        Image.new("RGB", (40, 40), "#17365d").save(svg.with_suffix(".png"))
        source = folder / "2.1 Kosten en opbrengsten – hoofdstuk.md"
        source.write_text(source.read_text(encoding="utf-8") +
                          '\n![Technical fixture](_assets/2.1.1_fig_1.svg)\n', encoding="utf-8")
        self.spec["chapters"][0]["hoofdstuk_sha256"] = digest(source)
        self.spec["chapters"][0]["asset_sha256"]["hoofdstuk"] = {p.name: digest(p) for p in assets.iterdir()}
        self.save()
        self.real_run = subprocess.run
        with patch("book_pipeline.subprocess.run", side_effect=self.fixture_gates):
            first = build_book(self.manifest, self.lessons, self.platform, proof_root=self.proof("r1"))
            originals = {record[field]: Path(record[field]).read_bytes() for record in first
                         for field in ("source_md", "source_html", "source_pdf")}
            prior_proof = {p.relative_to(self.proof("r1")).as_posix(): digest(p)
                           for p in self.proof("r1").rglob("*") if p.is_file()}
            second = build_book(self.manifest, self.lessons, self.platform, proof_root=self.proof("r2"))
        for filename, data in originals.items():
            self.assertEqual(Path(filename).read_bytes(), data, filename)
        self.assertEqual(prior_proof, {p.relative_to(self.proof("r1")).as_posix(): digest(p)
                                      for p in self.proof("r1").rglob("*") if p.is_file()})
        for left, right in zip(first, second):
            self.assertEqual(left, right)  # Same relative record, separate parent namespace.
            self.assertEqual(left["inspection_status"], "PENDING")
            self.assertEqual(left["pages_inspected"], [])
            self.assertEqual(left["assembly_inputs"], right["assembly_inputs"])
            for revision in ("r1", "r2"):
                manifest = self.proof(revision) / left["artifact_id"] / "manifest.json"
                self.assertEqual(json.loads(manifest.read_bytes()), left)
            for page in left["rendered_pages"]:
                one = self.proof("r1") / left["artifact_id"] / page
                two = self.proof("r2") / right["artifact_id"] / page
                self.assertEqual(digest(one), digest(two))
                with Image.open(one) as x, Image.open(two) as y:
                    self.assertEqual(x.size, y.size)
                    self.assertEqual(x.convert("RGB").tobytes(), y.convert("RGB").tobytes())
        for source_asset in assets.iterdir():
            self.assertEqual(digest(source_asset), digest(self.book / "_assets" / source_asset.name))


if __name__ == "__main__":
    unittest.main()
