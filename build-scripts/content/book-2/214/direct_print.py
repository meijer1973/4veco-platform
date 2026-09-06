"""Authorized §214 direct-print orchestration, delegating unchanged shared CLI.

HOW TO ADAPT: no copied rendering. The shared worker alone is not authorized.
Release/input/current-action/durable and source/asset gates precede reservation
and the exact plan command. Distinct reviews must assess this boundary.
"""
import argparse
import json
from pathlib import Path
import sys
sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_214 as b


def direct(lessons, proof_root, suffix):
    _grant, _manifest, env = b.authorize(lessons)
    docs = b.documents(b.target_record())
    assets = b.load_owned("figures").asset_sources()
    b.verify_native_derivation(lessons,docs,assets,require_png=True)
    namespace = b.namespace_check(proof_root,suffix)
    b.reserve(namespace)
    base = lessons/b.LESSON_REL
    # This is the exact plan's final worker CLI, including exactly two MDs.
    argv = [sys.executable, b.CONTENT/"print_pipeline.py",
            base/(b.STEM+" – opgaven.md"), base/(b.STEM+" – antwoorden.md"),
            "--proof-root", proof_root]
    stdout = b.run(argv,env=env,native=True)
    proofs = [json.loads(line) for line in stdout.decode("utf-8").splitlines() if line.strip()]
    b.must(len(proofs) == 2, "Exactly two direct child products")
    return b.complete_result(lessons,proof_root,suffix,"direct",namespace,proofs)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lessons-root",type=Path,required=True)
    parser.add_argument("--proof-root",type=Path,required=True)
    parser.add_argument("--proof-suffix",required=True)
    args = parser.parse_args()
    result = direct(args.lessons_root,args.proof_root,args.proof_suffix)
    print(json.dumps({"status":"NATIVE_CAPTURE_COMPLETE_NOT_ACCEPTED","route":"direct","native_files":len(result["native"])}))


if __name__ == "__main__":
    main()
