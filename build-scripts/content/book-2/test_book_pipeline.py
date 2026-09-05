"""Book 2 profile regressions; no fixture grants educational acceptance."""
import copy
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from PIL import Image

from book_pipeline import CHAPTERS, PROFILE, TITLE, build_book, prepare_book, _namespace_chapter, _resolved_html
from chapter_pipeline import verify_chapter_inputs
from print_pipeline import digest, prepare_html
from bs4 import BeautifulSoup


class BookPipelineTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="book2-book-test-")
        self.addCleanup(self.temp.cleanup)
        root = Path(self.temp.name)
        self.platform, self.lessons = root / "platform", root / "lessons"
        self.manifests = self.platform / "build-scripts/books/book-manifests"
        self.manifests.mkdir(parents=True)
        self.book = self.lessons / f"Boek 2 - {TITLE}"
        self.book.mkdir(parents=True)
        plan = self.book / "_book-plan.md"
        plan.write_text("Fixture plan, not approval.\n", encoding="utf-8")
        self.spec = {"print_profile": PROFILE, "book": {"nr": 2, "title": TITLE,
                     "edition": "fixture", "year": 2026},
                     "colofon": {"jaar": 2026, "licentie": "fixture"},
                     "book_plan_sha256": digest(plan), "chapters": [], "matter": {}}
        for kind in ("boek", "antwoorden"):
            self.spec["matter"][kind] = {}
            for position in ("front", "back"):
                path = self.manifests / f"{kind}-{position}.md"
                path.write_text(f"# {kind} {position}\n\nReviewed fixture matter.\n", encoding="utf-8")
                self.spec["matter"][kind][position] = {
                    "path": path.relative_to(self.platform).as_posix(), "sha256": digest(path)}
        for nr, title in CHAPTERS:
            folder = self.book / f"{nr} Hoofdstuk {title}"
            folder.mkdir()
            chapter = {"nr": nr, "title": title, "mode": "assembled", "asset_sha256": {}}
            for kind in ("hoofdstuk", "antwoorden"):
                path = folder / f"{nr} {title} – {kind}.md"
                body = [f"# Hoofdstuk {nr} {kind}"]
                body.extend(f"# {nr}.{i} Test\n\nUNIQUE-{kind}-{nr}.{i}." for i in range(1, 5))
                path.write_text("\n\n".join(body) + "\n", encoding="utf-8")
                chapter[f"{kind}_sha256"] = digest(path)
                chapter["asset_sha256"][kind] = {}
            self.spec["chapters"].append(chapter)
        self.manifest = self.manifests / "book-2.json"
        self.save()

    def save(self):
        self.manifest.write_text(json.dumps(self.spec), encoding="utf-8")

    def prepare(self):
        return prepare_book(self.manifest, self.lessons, self.platform)

    def test_order_single_route_separate_answers_and_all_stable_toc_targets(self):
        result = self.prepare()
        self.assertEqual(len(result["inputs"]), 12)  # manifest, root plan, four matter, six chapters
        student, answers = result["documents"]["boek"], result["documents"]["antwoorden"]
        for nr, _ in CHAPTERS:
            for i in range(1, 5):
                self.assertEqual(student.count(f"UNIQUE-hoofdstuk-{nr}.{i}."), 1)
                self.assertEqual(answers.count(f"UNIQUE-antwoorden-{nr}.{i}."), 1)
                self.assertIn(f'book-boek-paragraph-{nr.replace(".", "-")}-{i}', student)
        self.assertNotIn("UNIQUE-antwoorden", student)
        self.assertNotIn("UNIQUE-hoofdstuk", answers)
        self.assertLess(student.index("UNIQUE-hoofdstuk-2.1.1"), student.index("UNIQUE-hoofdstuk-2.3.4"))
        self.assertFalse((self.book / "_assets").exists())

    def test_changed_or_unpinned_sources_fail_before_writes(self):
        self.spec["chapters"][0]["hoofdstuk_sha256"] = "0" * 64
        self.save()
        with self.assertRaisesRegex(ValueError, "Unpinned or changed"):
            self.prepare()
        self.assertEqual(list(self.book.glob("* – boek.md")), [])

    def test_wrong_book_missing_chapter_duplicate_order_or_plan_pin_rejected(self):
        original = copy.deepcopy(self.spec)
        variants = []
        for key, value in (("nr", 1), ("title", "Other")):
            spec = copy.deepcopy(original)
            spec["book"][key] = value
            variants.append(spec)
        spec = copy.deepcopy(original)
        spec["chapters"].reverse()
        variants.append(spec)
        spec = copy.deepcopy(original)
        spec["chapters"][1] = spec["chapters"][0]
        variants.append(spec)
        spec = copy.deepcopy(original)
        spec["book_plan_sha256"] = "0" * 64
        variants.append(spec)
        for variant in variants:
            with self.subTest(variant=variant), self.assertRaises(ValueError):
                self.spec = variant
                self.save()
                self.prepare()

    def test_front_path_escape_active_html_and_typography_override_rejected(self):
        item = self.spec["matter"]["boek"]["front"]
        path = self.platform / item["path"]
        for bad in ("<script>alert(1)</script>", '<p style="font-size:8pt">Tiny</p>'):
            path.write_text(bad, encoding="utf-8")
            item["sha256"] = digest(path)
            self.save()
            with self.assertRaises(ValueError):
                self.prepare()
        outside = self.platform / "outside.md"
        outside.write_text("Outside matter", encoding="utf-8")
        item.update(path="outside.md", sha256=digest(outside))
        self.save()
        with self.assertRaisesRegex(ValueError, "stay in book-manifests"):
            self.prepare()

    def test_each_edition_requires_asset_map_and_both_exact_paired_bytes(self):
        chapter = self.spec["chapters"][0]
        folder = self.book / "2.1 Hoofdstuk Kosten en opbrengsten"
        assets = folder / "_assets"
        assets.mkdir()
        svg = assets / "2.1.1_fig_1.svg"
        svg.write_text('<svg xmlns="http://www.w3.org/2000/svg"/>', encoding="utf-8")
        Image.new("RGB", (10, 10), "white").save(svg.with_suffix(".png"))
        path = folder / "2.1 Kosten en opbrengsten – hoofdstuk.md"
        path.write_text(path.read_text(encoding="utf-8") + "\n![Fixture](_assets/2.1.1_fig_1.svg)\n", encoding="utf-8")
        chapter["hoofdstuk_sha256"] = digest(path)
        self.save()
        with self.assertRaisesRegex(ValueError, "asset pins differ"):
            self.prepare()
        chapter["asset_sha256"]["hoofdstuk"] = {p.name: digest(p) for p in assets.iterdir()}
        self.save()
        result = self.prepare()
        self.assertEqual(len(result["assets"]), 2)
        svg.write_text("Changed", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "changed after preflight"):
            verify_chapter_inputs(result)
        with self.assertRaisesRegex(ValueError, "asset pins differ"):
            self.prepare()

    def test_post_preflight_manifest_and_front_mutation_detected(self):
        result = self.prepare()
        self.manifest.write_text("{}", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "changed after preflight"):
            verify_chapter_inputs(result)

    def test_missing_paragraph_heading_and_authored_link_namespace(self):
        raw = '\n\n'.join(f'# 2.1.{i} Test' for i in range(1, 5))
        raw += '\n\n<div id="local"></div><a href="#local">Local</a>\n\n[More](#local)\n'
        result = _namespace_chapter(raw, "2.1", "boek")
        self.assertIn('id="book-boek-2-1-local"', result)
        self.assertIn('href="#book-boek-2-1-local"', result)
        self.assertIn('href="#book-boek-2-1-local">More</a>', result)
        with self.assertRaisesRegex(ValueError, "exactly one complete paragraph"):
            _namespace_chapter(raw + '\n# 2.1.1 Duplicate\n', "2.1", "boek")

    def test_structural_namespace_resolves_all_markdown_forms_and_preserves_code(self):
        raw = '\n\n'.join(f'# 2.1.{i} Test' for i in range(1, 5))
        raw += '''

## Recall

[Implicit](#recall)

<div id='local'></div>

[Single quote](#local)

[Reference][ref]

[ref]: #recall

    <div id="example"></div>

Ordinary text: id="not-a-structural-id".
'''
        soup = BeautifulSoup(_namespace_chapter(raw, "2.1", "boek"), "html.parser")
        for link in soup.find_all("a"):
            self.assertEqual(len(soup.find_all(id=link["href"][1:])), 1)
        self.assertEqual(soup.code.get_text(), '<div id="example"></div>')
        self.assertEqual(soup.get_text(), _resolved_html(raw).get_text())
        self.assertIsNotNone(soup.find(id="book-boek-2-1-recall"))
        self.assertIsNotNone(soup.find(id="book-boek-2-1-local"))

    def test_duplicate_unresolved_and_cross_matter_book_references_are_validated(self):
        raw = '\n\n'.join(f'# 2.1.{i} Test' for i in range(1, 5))
        for bad in (raw + '\n\n[Missing](#missing)', raw + '\n\n<div id="x"></div><p id="x">Duplicate</p>'):
            with self.assertRaisesRegex(ValueError, "Unresolved|duplicate"):
                _namespace_chapter(bad, "2.1", "boek")
        item = self.spec["matter"]["boek"]["front"]
        path = self.platform / item["path"]
        path.write_text('# Contents\n\n[First](#book-boek-paragraph-2-1-1)\n', encoding="utf-8")
        item["sha256"] = digest(path)
        self.save()
        self.prepare()
        path.write_text('# Contents\n\n[Missing](#missing)\n', encoding="utf-8")
        item["sha256"] = digest(path)
        self.save()
        with self.assertRaisesRegex(ValueError, "Unresolved"):
            self.prepare()
        path.write_text('<div id="book-boek-paragraph-2-1-1">Duplicate</div>', encoding="utf-8")
        item["sha256"] = digest(path)
        self.save()
        with self.assertRaisesRegex(ValueError, "duplicate"):
            self.prepare()

    def test_legacy_book_entry_dispatches_only_explicit_book2_profile(self):
        sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "books"))
        import lib_book
        with patch("book_pipeline.build_book", return_value=["bounded"]) as build:
            self.assertEqual(lib_book.build_book(self.manifest, self.lessons, self.platform), ["bounded"])
            build.assert_called_once()
        self.spec["print_profile"] = "unrecognized"
        self.save()
        with self.assertRaisesRegex(ValueError, "Unsupported book print profile"):
            lib_book.build_book(self.manifest, self.lessons, self.platform)

    def test_book_front_and_back_are_not_wrapped_as_exercises(self):
        result = self.prepare()
        markdown = result["documents"]["boek"].replace("Reviewed fixture matter.", "**Opgave 1**\n\nA quoted heading in front/back matter.")
        html, _ = prepare_html(markdown, self.book / "fixture.md")
        soup = BeautifulSoup(html, "html.parser")
        for cls in ("book-front", "book-back"):
            region = soup.find(class_=cls)
            self.assertIsNotNone(region)
            self.assertIsNone(region.find(class_="exercise"))

    def test_denied_assembly_authority_prevents_output_and_proof_writes(self):
        real_run = subprocess.run
        before = {p.relative_to(self.temp.name): digest(p)
                  for p in Path(self.temp.name).rglob("*") if p.is_file()}

        def deny_node(args, **kwargs):
            if args[0] == "node":
                raise subprocess.CalledProcessError(1, args)
            return real_run(args, **kwargs)

        with patch("book_pipeline.subprocess.run", side_effect=deny_node), \
             patch("book_pipeline.build_document") as render:
            with self.assertRaises(subprocess.CalledProcessError):
                build_book(self.manifest, self.lessons, self.platform)
            render.assert_not_called()
        after = {p.relative_to(self.temp.name): digest(p)
                 for p in Path(self.temp.name).rglob("*") if p.is_file()}
        self.assertEqual(before, after)
        self.assertFalse((self.platform / "reports").exists())

    def test_real_render_and_page_capture_bind_all_inputs_without_acceptance(self):
        """Only authority subprocesses are stubbed; this grants no real approval."""
        from pypdf import PdfReader

        folder = self.book / "2.1 Hoofdstuk Kosten en opbrengsten"
        assets = folder / "_assets"
        assets.mkdir()
        svg = assets / "2.1.1_fig_1.svg"
        svg.write_text('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">'
                       '<rect width="40" height="40" fill="#17365d"/></svg>', encoding="utf-8")
        Image.new("RGB", (40, 40), "#17365d").save(svg.with_suffix(".png"))
        source = folder / "2.1 Kosten en opbrengsten – hoofdstuk.md"
        source.write_text(source.read_text(encoding="utf-8") +
                          "\n![Technical fixture](_assets/2.1.1_fig_1.svg)\n", encoding="utf-8")
        self.spec["chapters"][0]["hoofdstuk_sha256"] = digest(source)
        self.spec["chapters"][0]["asset_sha256"]["hoofdstuk"] = {
            p.name: digest(p) for p in assets.iterdir()}
        for kind in ("boek", "antwoorden"):
            item = self.spec["matter"][kind]["front"]
            path = self.platform / item["path"]
            path.write_text(f"# Technical fixture {kind}\n\n"
                            f"[First paragraph](#book-{kind}-paragraph-2-1-1)\n",
                            encoding="utf-8")
            item["sha256"] = digest(path)
        self.save()
        real_run = subprocess.run
        gate_calls = []

        def fixture_authority_only(args, **kwargs):
            if args[0] == "node":
                gate_calls.append((args, kwargs))
                return subprocess.CompletedProcess(args, 0)
            return real_run(args, **kwargs)

        with patch("book_pipeline.subprocess.run", side_effect=fixture_authority_only):
            records = build_book(self.manifest, self.lessons, self.platform)
        self.assertEqual([call[0] for call in gate_calls], [
            ["node", "build-scripts/workflows/check-book-outline-currentness.js",
             "--require-approved", "--action", "whole_book_assembly"],
            ["node", "build-scripts/workflows/check-book2-target-authority-remediation.js", "--durable"],
        ])
        self.assertTrue(all(call[1] == {"cwd": self.platform, "check": True} for call in gate_calls))
        self.assertEqual(len(records), 2)
        for kind, record in zip(("boek", "antwoorden"), records):
            with self.subTest(kind=kind):
                self.assertEqual(len(record["assembly_inputs"]), 14)
                verify_chapter_inputs({"inputs": record["assembly_inputs"], "assets": record["assets"]})
                for path_field, hash_field in (("source_md", "source_sha256"),
                                                ("source_html", "html_sha256"),
                                                ("source_pdf", "pdf_sha256")):
                    self.assertEqual(digest(Path(record[path_field])), record[hash_field])
                reader = PdfReader(record["source_pdf"])
                text = "\n".join(page.extract_text() for page in reader.pages)
                expected_kind = "hoofdstuk" if kind == "boek" else "antwoorden"
                excluded_kind = "antwoorden" if kind == "boek" else "hoofdstuk"
                for nr, _ in CHAPTERS:
                    for i in range(1, 5):
                        self.assertEqual(text.count(f"UNIQUE-{expected_kind}-{nr}.{i}."), 1)
                self.assertNotIn(f"UNIQUE-{excluded_kind}", text)
                self.assertTrue(any(page.get("/Annots") for page in reader.pages))
                proof = self.platform / "reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1" / record["artifact_id"]
                self.assertEqual(record["artifact_id"], f"book-2-{kind}-{record['pdf_sha256'][:12]}")
                self.assertEqual(record["render_dpi"], 150)
                self.assertEqual(len(record["rendered_pages"]), len(reader.pages))
                self.assertEqual(record["inspection_status"], "PENDING")
                self.assertEqual(record["pages_inspected"], [])
                self.assertIsNone(record["visible_student_defects"])
                self.assertFalse(record["inspected_at_normal_reading_scale"])
                self.assertTrue((proof / "contact-sheet.png").is_file())
                raw_manifest = (proof / "manifest.json").read_bytes()
                self.assertNotIn(b"\r", raw_manifest)
                self.assertEqual(json.loads(raw_manifest), record)
                for page in record["rendered_pages"]:
                    self.assertEqual(digest(proof / page), record["page_sha256"][Path(page).name])
        for path in assets.iterdir():
            self.assertEqual(digest(self.book / "_assets" / path.name), digest(path))
        self.assertEqual(len(records[0]["assets"]), 2)
        self.assertEqual(records[1]["assets"], [])


if __name__ == "__main__":
    unittest.main()
