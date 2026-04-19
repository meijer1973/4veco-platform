"""
roundtrip-pptx.py — open a pptx with python-pptx and save it back.

python-pptx produces strictly Microsoft-compliant OOXML. Round-tripping strips
PptxGenJS's phantom Override entries, empty directories, and any other small
non-conformances that make Microsoft PowerPoint trigger repair mode (LibreOffice
tolerates them, PowerPoint doesn't).

Usage:
  python roundtrip-pptx.py <file1.pptx> [file2.pptx ...]

The file is rewritten in place. A backup can be kept by setting --keep-backup.
"""
import argparse
import shutil
import sys
from pathlib import Path

try:
    from pptx import Presentation
except ImportError:
    sys.stderr.write("python-pptx is required: pip install python-pptx\n")
    sys.exit(1)


def roundtrip(pptx_path: Path, keep_backup: bool = False) -> None:
    if keep_backup:
        bak = pptx_path.with_suffix(pptx_path.suffix + ".bak")
        shutil.copy2(pptx_path, bak)
    pres = Presentation(str(pptx_path))
    # save back (overwrites)
    pres.save(str(pptx_path))


def main() -> int:
    ap = argparse.ArgumentParser(description="Roundtrip pptx files through python-pptx")
    ap.add_argument("files", nargs="+", help="pptx files to rewrite in place")
    ap.add_argument("--keep-backup", action="store_true", help="keep .bak next to each file")
    args = ap.parse_args()

    failed = 0
    for f in args.files:
        p = Path(f)
        if not p.exists():
            sys.stderr.write(f"missing: {p}\n")
            failed += 1
            continue
        try:
            roundtrip(p, args.keep_backup)
            print(f"roundtripped: {p.name}")
        except Exception as e:
            sys.stderr.write(f"FAILED {p.name}: {type(e).__name__}: {e}\n")
            failed += 1
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
