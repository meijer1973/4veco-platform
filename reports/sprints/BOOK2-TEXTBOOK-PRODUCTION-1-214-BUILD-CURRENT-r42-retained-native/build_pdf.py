"""Thin §214 entrypoint; no rendering or authorization bypass."""
import argparse
from pathlib import Path
import sys
sys.dont_write_bytecode = True
def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--platform-root", type=Path, required=True)
    parser.add_argument("--lessons-root", type=Path, required=True)
    parser.add_argument("--proof-root", type=Path, required=True)
    parser.add_argument("--proof-suffix", required=True)
    args = parser.parse_args()
    sys.path.insert(0, str(args.platform_root / "build-scripts/content/book-2"))
    import b2_214
    b2_214.main(["--lessons-root", str(args.lessons_root), "--proof-root", str(args.proof_root), "--proof-suffix", args.proof_suffix, "--route", "thin"])
if __name__ == "__main__":
    main()
