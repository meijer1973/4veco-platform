"""Append command evidence with original stdout/stderr and real exit codes."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib, json, os, subprocess, sys
OUT=Path(__file__).parent
ROOT=OUT.parents[2]
assert ROOT.parent.name=='book2-213-r6-review-20260905'
label=sys.argv[1]; args=sys.argv[2:]
start=datetime.now(timezone.utc).isoformat()
result=subprocess.run(args,cwd=ROOT,capture_output=True)
def decode(raw):
    try: return raw.decode('utf-8'), 'utf-8'
    except UnicodeDecodeError: return raw.decode('cp1252'), 'cp1252'
stdout,stdout_encoding=decode(result.stdout)
stderr,stderr_encoding=decode(result.stderr)
record={'label':label,'cwd':str(ROOT),'argv':args,'start':start,'end':datetime.now(timezone.utc).isoformat(),'exit_code':result.returncode,
 'inherited_PATH':True,'python_executable':sys.executable,'stdout':stdout,'stderr':stderr,'stdout_encoding':stdout_encoding,'stderr_encoding':stderr_encoding,
 'stdout_sha256':hashlib.sha256(result.stdout).hexdigest(),'stderr_sha256':hashlib.sha256(result.stderr).hexdigest()}
with (OUT/'command-log.jsonl').open('a',encoding='utf-8',newline='\n') as f: f.write(json.dumps(record,ensure_ascii=False)+'\n')
print(json.dumps(record,ensure_ascii=True,indent=2))
sys.exit(result.returncode)
