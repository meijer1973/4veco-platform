"""Bounded R7 builder command evidence; adapted from the R6 review recorder.

HOW TO ADAPT: choose a new task-owned report folder and update the exact owner
assertion; preserve actual subprocess exit codes and never overwrite past logs.
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
assert ROOT.parent.name == 'book2-213-bonus-correction-20260905'
label = sys.argv[1]
argv = sys.argv[2:]
started = datetime.now(timezone.utc).isoformat()
result = subprocess.run(argv, cwd=ROOT, capture_output=True)

def decode(raw):
    try:
        return raw.decode('utf-8'), 'utf-8'
    except UnicodeDecodeError:
        return raw.decode('cp1252', errors='backslashreplace'), 'cp1252'

stdout, stdout_encoding = decode(result.stdout)
stderr, stderr_encoding = decode(result.stderr)
record = {'actor': 'paragraph_213_bonus_correction_builder', 'role': 'bounded correction builder',
          'label': label, 'cwd': str(ROOT), 'argv': argv, 'start': started,
          'end': datetime.now(timezone.utc).isoformat(), 'exit_code': result.returncode,
          'inherited_PATH': os.environ.get('PATH'), 'python_executable': sys.executable,
          'stdout': stdout, 'stderr': stderr, 'stdout_encoding': stdout_encoding,
          'stderr_encoding': stderr_encoding,
          'stdout_sha256': hashlib.sha256(result.stdout).hexdigest(),
          'stderr_sha256': hashlib.sha256(result.stderr).hexdigest()}
with (OUT/'command-log.jsonl').open('a', encoding='utf-8', newline='\n') as stream:
    stream.write(json.dumps(record, ensure_ascii=False)+'\n')
print(json.dumps({key: record[key] for key in ('label', 'exit_code', 'stdout', 'stderr')}, ensure_ascii=True))
sys.exit(result.returncode)
