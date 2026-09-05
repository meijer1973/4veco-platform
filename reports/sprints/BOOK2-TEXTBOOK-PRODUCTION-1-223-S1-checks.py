"""Owned complete command evidence, no acceptance or writes outside this pair."""
import argparse
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("s1_runner", Path(__file__).with_name("BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-run.py"))
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)


def execute(label, commands):
    results = []
    for command in commands:
        result = subprocess.run(command, cwd=ROOT, capture_output=True, encoding="utf-8", errors="replace")
        results.append({"command": command, "exit_code": result.returncode,
                        "stdout": result.stdout, "stderr": result.stderr})
        print(f"{result.returncode}: {' '.join(command)}")
    runner.save(label, {"pass": all(r["exit_code"] == 0 for r in results), "commands": results})
    if any(r["exit_code"] for r in results):
        raise RuntimeError(f"Checks failed; full diagnostics preserved in {label}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=("native", "gates", "integrity", "whitespace-diagnostic", "scope"))
    parser.add_argument("--head")
    args = parser.parse_args()
    if args.mode == "native":
        sys.path.insert(0, str(ROOT / "build-scripts/content/book-2/223"))
        import check_render
        manifest = ROOT / f"reports/sprints/{runner.PREFIX}-full-manifest.json"
        result = check_render.inspect(runner.LESSONS, manifest, rebuild=True)
        runner.save("native-render-check", result)
        for mode in ("full", "thin-retry", "print"):
            data = json.loads((ROOT / f"reports/sprints/{runner.PREFIX}-{mode}-manifest.json").read_text(encoding="utf-8"))
            # Re-check without overwriting prior parity records.
            baseline = json.loads((ROOT / f"reports/sprints/{runner.PREFIX}-baseline.json").read_text(encoding="utf-8"))
            assert runner.inventory() == baseline["entire_paragraph_inventory"]
            for record in data["documents"]:
                directory = Path(record["proof_directory"])
                proof = json.loads((directory / "manifest.json").read_text(encoding="utf-8"))
                assert proof["inspection_status"] == "PENDING" and proof["pages_inspected"] == []
        print(json.dumps(result, ensure_ascii=True, indent=2))
    elif args.mode == "integrity":
        baseline = json.loads((ROOT / f"reports/sprints/{runner.PREFIX}-baseline.json").read_text(encoding="utf-8"))
        assert runner.inventory() == baseline["entire_paragraph_inventory"]
        runner.contract.require_exact((ROOT / runner.contract.GENERATOR).read_bytes(), runner.contract.expected_generator())
        for name in runner.contract.UNCHANGED:
            runner.contract.require_exact((ROOT / name).read_bytes(), runner.contract.blob(ROOT, runner.contract.BASE, name))
        for path, expected in runner.contract.required_inputs():
            assert runner.builder.lf_hash(path) == expected
        proof_hashes = {}
        for mode in ("full", "thin-retry", "print"):
            data = json.loads((ROOT / f"reports/sprints/{runner.PREFIX}-{mode}-manifest.json").read_text(encoding="utf-8"))
            parity = json.loads((ROOT / f"reports/sprints/{runner.PREFIX}-{mode}-parity.json").read_text(encoding="utf-8"))
            for kind, record in zip(runner.KINDS, data["documents"]):
                directory = Path(record["proof_directory"])
                path = directory / "manifest.json"
                actual = runner.digest(path.read_bytes())
                assert actual == parity["editions"][kind]["fresh_manifest_sha256"]
                proof_hashes[path.relative_to(ROOT).as_posix()] = actual
                old = baseline["historical_proof"][kind]
                old_directory = ROOT / old["directory"]
                assert runner.digest((old_directory / "manifest.json").read_bytes()) == old["manifest_sha256"]
                fresh = json.loads(path.read_text(encoding="utf-8"))
                assert fresh["inspection_status"] == "PENDING" and fresh["pages_inspected"] == []
                assert fresh["page_sha256"] == old["page_sha256"]
                for name, expected in old["page_sha256"].items():
                    assert runner.digest((directory / "pages" / name).read_bytes()) == expected
        runner.save("final-integrity", {"pass": True, "generator_raw_sha256": runner.digest((ROOT / runner.contract.GENERATOR).read_bytes()),
                                       "entire_paragraph_inventory_unchanged": True,
                                       "immutable_original_tests_and_four_sources_and_helper": True,
                                       "all_six_required_inputs_current": True, "historical_manifests_unchanged": True,
                                       "nine_fresh_pending_manifests_unchanged": proof_hashes,
                                       "unchanged_captures": 96, "independent_review_or_QC": False})
        print("PASS final integrity: exact four substitutions; full paragraph/source/history equality; nine immutable PENDING manifests/96 captures")
    elif args.mode == "whitespace-diagnostic":
        execute("prepublication-whitespace-diagnostic", [["git", "diff", "--cached", "--check"]])
    elif args.mode == "gates":
        execute("gates", [
            ["node", "scripts/validate-paragraph.js", "--mode", "part-a", "--profile", profile, str(runner.DEST)]
            for profile in ("student-web", "publisher-print")
        ] + [
            ["node", "build-scripts/workflows/check-book-outline-currentness.js", "--require-approved", "--action", "paragraph_production", "--paragraph", "2.2.3"],
            ["node", "build-scripts/workflows/check-book2-target-authority-remediation.js", "--durable"],
            ["node", "build-scripts/sprints/check-sprint-bundle.js", "BOOK2-TEXTBOOK-PRODUCTION-1"],
            ["git", "diff", "--check"],
            ["git", "-C", str(runner.LESSONS), "diff", "--check"],
        ])
    else:
        assert args.head and len(args.head) == 40
        execute("scope", [
            ["node", "build-scripts/workflows/check-paragraph-lane-scope.js", "--lane", "shared", "--base", runner.contract.BASE, "--head", args.head],
            # No lesson payload exists in S1; do not invent a lane-owned change
            # to make the non-empty lane classifier accept an empty diff.
            ["git", "-C", str(runner.LESSONS), "diff", "--exit-code", runner.contract.LESSON_BASE, "HEAD"],
            ["git", "diff", "--check", runner.contract.BASE, args.head],
            ["git", "diff", "--name-status", runner.contract.BASE, args.head],
        ])
