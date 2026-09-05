"""Record actual independent-review commands; never replace an earlier entry.

HOW TO ADAPT: use a new owned evidence directory and exact ownership assertion.
"""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import os
import subprocess
import sys

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[2]
assert ROOT.parent.name == 'book2-213-r7-review-20260905'
label, argv = sys.argv[1], sys.argv[2:]
start = datetime.now(timezone.utc).isoformat()
result = subprocess.run(argv, cwd=ROOT, capture_output=True)
def decode(raw):
    try:
        return raw.decode('utf-8'), 'utf-8'
    except UnicodeDecodeError:
        return raw.decode('cp1252', errors='backslashreplace'), 'cp1252'
stdout, stdout_encoding = decode(result.stdout)
stderr, stderr_encoding = decode(result.stderr)
record = dict(actor='paragraph_213_r7_independent_review', role='independent paragraph review',
    label=label, argv=argv, cwd=str(ROOT), start=start, end=datetime.now(timezone.utc).isoformat(),
    exit_code=result.returncode, inherited_PATH=os.environ.get('PATH'), python_executable=sys.executable,
    stdout=stdout, stderr=stderr, stdout_encoding=stdout_encoding, stderr_encoding=stderr_encoding,
    stdout_sha256=hashlib.sha256(result.stdout).hexdigest(), stderr_sha256=hashlib.sha256(result.stderr).hexdigest())
with (OUT/'command-log.jsonl').open('a', encoding='utf-8', newline='\n') as stream:
    stream.write(json.dumps(record, ensure_ascii=False)+'\n')
print(json.dumps({k: record[k] for k in ('label', 'exit_code', 'stdout', 'stderr')}, ensure_ascii=True))
sys.exit(result.returncode)
