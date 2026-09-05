"""Owned evidence runner: native reproduction, exclusive capture, exact parity."""
import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import zipfile
from pathlib import Path, PurePosixPath
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "build-scripts/content/book-2/223"))
import test_successor as contract
import b2_223 as builder

PREFIX = "BOOK2-TEXTBOOK-PRODUCTION-1-223-S1"
EVIDENCE = ROOT / "reports/sprints"
PROOF = ROOT / "reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1"
LESSONS = contract.LESSONS
DEST = LESSONS / builder.LESSON_REL
KINDS = ("paragraaf", "opgaven", "antwoorden")
PAGES = dict(zip(KINDS, (15, 10, 7)))
ZIP_COUNTS = dict(zip(KINDS, (11, 5, 3)))


def digest(value):
    return hashlib.sha256(value).hexdigest()


def save(name, data):
    path = EVIDENCE / f"{PREFIX}-{name}.json"
    with path.open("x", encoding="utf-8", newline="\n") as stream:
        stream.write(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    return path


def native_names():
    return [f"{builder.STEM} – {kind}.{ext}" for kind in KINDS for ext in ("md", "html", "pdf", "zip")] + [
        f"_assets/2.2.3_fig_{n}.{ext}" for n in range(1, 5) for ext in ("svg", "png")]


def inventory():
    return {path.relative_to(DEST).as_posix(): digest(path.read_bytes())
            for path in sorted(DEST.rglob("*")) if path.is_file()}


def baseline():
    assert subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT).decode().strip() == contract.BASE
    assert subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=LESSONS).decode().strip() == contract.LESSON_BASE
    sources = {}
    for name in [contract.GENERATOR, *contract.UNCHANGED]:
        actual = (ROOT / name).read_bytes()
        contract.require_exact(actual, contract.blob(ROOT, contract.BASE, name))
        sources[name] = digest(actual)
    incoming = {}
    for path, expected in contract.required_inputs():
        data = path.read_bytes()
        contract.require_exact(data, contract.blob(LESSONS, contract.LESSON_BASE, path.relative_to(LESSONS).as_posix()))
        assert builder.lf_hash(path) == expected
        incoming[path.relative_to(LESSONS).as_posix()] = {"raw": digest(data), "lf": expected}
    files = inventory()
    for name in files:
        contract.require_exact((DEST / name).read_bytes(), contract.blob(LESSONS, contract.LESSON_BASE, (builder.LESSON_REL / name).as_posix()))
    assert set(native_names()).issubset(files) and len(native_names()) == 20
    assert "2.2.3-textbook-handoff.md" not in files
    assert files["2.2.3-review.md"] == "793c8460e7d20e8a2e40d7e8912c969c94a091e67fa25566c812264c8769539e"
    historical = {}
    for kind in KINDS:
        candidates = list(PROOF.glob(f"223-{kind}-*-r3"))
        assert len(candidates) == 1
        directory = candidates[0]
        manifest = json.loads((directory / "manifest.json").read_text(encoding="utf-8-sig"))
        assert manifest["inspection_status"] == "PENDING" and not manifest["pages_inspected"]
        assert len(manifest["page_sha256"]) == PAGES[kind]
        for page, expected in manifest["page_sha256"].items():
            assert digest((directory / "pages" / page).read_bytes()) == expected
        historical[kind] = {"directory": directory.relative_to(ROOT).as_posix(),
                            "manifest_sha256": digest((directory / "manifest.json").read_bytes()),
                            "page_sha256": manifest["page_sha256"]}
    result = {"platform": contract.BASE, "lessons": contract.LESSON_BASE, "sources": sources,
              "required_inputs": incoming, "entire_paragraph_inventory": files,
              "native_files": native_names(), "handoff_exists": False, "historical_proof": historical}
    save("baseline", result)
    print(json.dumps(result, ensure_ascii=True, indent=2))


def reserve(mode):
    worktrees = subprocess.check_output(["git", "worktree", "list", "--porcelain"], cwd=ROOT).decode()
    roots = [Path(line[9:]) for line in worktrees.splitlines() if line.startswith("worktree ")]
    seen = []
    for root in roots:
        directory = root / "reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1"
        if directory.is_dir():
            for child in directory.glob("223-*-r*"):
                match = re.search(r"-r(\d+)$", child.name)
                if match:
                    seen.append(int(match.group(1)))
        # A failed capture consumes its reservation even when it wrote no pages.
        for reservation in (root / "reports/sprints").glob(f"{PREFIX}-*-reservation.json"):
            seen.append(int(json.loads(reservation.read_text(encoding="utf-8"))["suffix"][1:]))
    revision = max(seen, default=0) + 1
    suffix = f"r{revision}"
    assert all(not list((root / "reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1").glob(f"223-*-{suffix}")) for root in roots)
    save(f"{mode}-reservation", {"suffix": suffix, "registered_worktrees_checked": len(roots),
                               "maximum_existing_revision": max(seen, default=0), "exclusive_paths": True})
    return suffix


def verify(mode, manifest):
    baseline = json.loads((EVIDENCE / f"{PREFIX}-baseline.json").read_text(encoding="utf-8"))
    assert inventory() == baseline["entire_paragraph_inventory"], "STOP: native or metadata bytes drifted"
    comparisons = {}
    for kind, record in zip(KINDS, manifest["documents"]):
        archive = DEST / f"{builder.STEM} – {kind}.zip"
        with zipfile.ZipFile(archive) as package:
            names = package.namelist()
            assert len(names) == len(set(names)) == ZIP_COUNTS[kind]
            assert package.testzip() is None
            for name in names:
                member = PurePosixPath(name)
                assert not member.is_absolute() and ".." not in member.parts and "\\" not in name and ":" not in name
                assert package.read(name) == (DEST / name).read_bytes()
        old = baseline["historical_proof"][kind]
        old_directory = ROOT / old["directory"]
        assert digest((old_directory / "manifest.json").read_bytes()) == old["manifest_sha256"]
        fresh_directory = Path(record["proof_directory"])
        fresh = json.loads((fresh_directory / "manifest.json").read_text(encoding="utf-8"))
        assert fresh["inspection_status"] == "PENDING" and not fresh["pages_inspected"]
        assert fresh["page_sha256"] == old["page_sha256"]
        for name, expected in old["page_sha256"].items():
            first, second = old_directory / "pages" / name, fresh_directory / "pages" / name
            assert digest(second.read_bytes()) == expected
            with Image.open(first) as a, Image.open(second) as b:
                assert a.size == b.size and a.mode == b.mode and a.tobytes() == b.tobytes()
        comparisons[kind] = {"pages": PAGES[kind], "zip_members": names,
                             "all_page_raw_and_pixels_identical": True,
                             "fresh_manifest_sha256": digest((fresh_directory / "manifest.json").read_bytes()),
                             "pdf_sha256": record["pdf_sha256"]}
    save(f"{mode}-parity", {"pass": True, "native_raw_files_identical": 20,
                           "entire_paragraph_inventory_identical": True, "pages_identical": 32,
                           "proof_inspection_status": "PENDING", "fresh_personal_visual_acceptance": False,
                           "editions": comparisons})
    print(f"PASS {mode}: all20 native bytes, ZIP11/5/3 and32 page hashes/pixels unchanged")


def reproduce(mode):
    assert Path(sys.executable).resolve() == Path("C:/Python314/python.exe").resolve()
    assert os.environ["PATH"].split(os.pathsep)[0].replace("\\", "/").rstrip("/").lower() == "c:/msys64/mingw64/bin"
    contract.require_exact((ROOT / contract.GENERATOR).read_bytes(), contract.expected_generator())
    suffix = reserve(mode)
    manifest_path = EVIDENCE / f"{PREFIX}-{mode}-manifest.json"
    assert not manifest_path.exists()
    if mode == "print":
        records = []
        for kind in KINDS:
            record = builder.build_document(DEST / f"{builder.STEM} – {kind}.md")
            builder.zip_document(record)
            directory = PROOF / f"223-{kind}-{record['pdf_sha256'][:12]}-{suffix}"
            assert not directory.exists()
            builder.render_proof(record, directory)
            record["proof_directory"] = str(directory)
            records.append(record)
        manifest = {"inspection_status": "PENDING", "documents": records}
        save("print-manifest", manifest)
    else:
        command = [sys.executable, str(ROOT / contract.GENERATOR), "--lesson-root", str(LESSONS)]
        if mode == "thin":
            command = [sys.executable, str(DEST / "build_pdf.py")]
        elif mode == "thin-retry":
            # Ordinary __file__ keeps Node's platform cwd free of the extended
            # prefix; argparse's final override retains long lesson output paths.
            command = [sys.executable, str(ROOT.parent / "4veco-lessen" / builder.LESSON_REL / "build_pdf.py"),
                       "--lesson-root", str(LESSONS)]
        command += ["--proof-root", str(PROOF), "--proof-suffix", suffix, "--manifest", str(manifest_path)]
        completed = subprocess.run(command, cwd=ROOT, capture_output=True, encoding="utf-8", errors="replace")
        save(f"{mode}-process", {"command": command, "exit_code": completed.returncode,
                                "stdout": completed.stdout, "stderr": completed.stderr})
        if completed.returncode:
            raise RuntimeError(f"STOP: {mode} failed {completed.returncode}; diagnostics preserved")
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    verify(mode, manifest)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=("baseline", "full", "thin", "thin-retry", "print"))
    args = parser.parse_args()
    baseline() if args.mode == "baseline" else reproduce(args.mode)
