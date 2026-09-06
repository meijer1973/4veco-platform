"""Read-only Win32 long-data-path adapter for the EXACT untouched author checker.

Normal script name/CWD; only Path.open read modes receive an extended prefix.
This adapts file access, not source, predicates, authority or accepted outcomes.
The original failure is retained in author-readonly-r1-process.json.
"""
import hashlib
import io
import os
from pathlib import Path
import runpy

P = Path(__file__).resolve().parents[2]
script = P / 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-233-PLAN-check.py'
expected = '5e858bcf58ceda0720e05efd84a076360fa1ee6d048b20a41866a16c668221d0'
original = Path.open
assert hashlib.sha256(script.read_bytes()).hexdigest() == expected
roots = [str(P).lower() + os.sep, str(P.parent / '4veco-lessen').lower() + os.sep]

def read_only_open(self, mode='r', buffering=-1, encoding=None, errors=None, newline=None):
    assert mode in ('r', 'rb'), 'Author check may not open a write-capable handle'
    absolute = os.path.abspath(str(self))
    assert any(absolute.lower().startswith(root) for root in roots), absolute
    extended = absolute if absolute.startswith('\\\\?\\') else '\\\\?\\' + absolute
    return io.open(extended, mode, buffering, encoding, errors, newline)

try:
    Path.open = read_only_open
    runpy.run_path(str(script), run_name='__main__')
finally:
    Path.open = original
    assert hashlib.sha256(script.read_bytes()).hexdigest() == expected
