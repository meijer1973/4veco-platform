"""Inspect actual committed review scope; never invent a shared-source anchor."""
import importlib.util
from pathlib import Path
import sys

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('probes', HERE / 'BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-REVIEW-probes.py')
p = importlib.util.module_from_spec(spec)
spec.loader.exec_module(p)
head = sys.argv[1]
assert p.git('rev-parse', head).decode().strip() == head
assert p.git('rev-parse', 'HEAD').decode().strip() == head
assert p.git('status', '--porcelain') == b''
paths = p.git('diff','--name-only',p.SUBJECT,head).decode().splitlines()
assert paths and all(n.startswith('reports/sprints/'+p.PREFIX+'-') for n in paths)
assert not p.git('diff','--name-only',p.LESSON,'HEAD',cwd=p.L)
tail = p.git('diff','--name-only','04969d33875ab2265b5101647e3584985ae91b87',p.SUBJECT).decode().splitlines()
expected = [f'reports/github-agent-index-{repo}.{ext}' for repo in ('platform','lessen') for ext in ('json','md')]
assert set(tail) == set(expected)
p.save('committed-scope.json', dict(result='PASS', base=p.SUBJECT, head=head, paths=paths,
    lesson_base=p.LESSON, lesson_head=p.LESSON, lesson_changes=[], source_terminal_index_only=tail))
for label,base,want in [('owned-evidence-only',p.SUBJECT,1),
                        ('complete-successor-candidate',p.BASE,0),
                        ('whole-candidate','96416b6b5bd57094576e9aba0a42d682584ec479',0)]:
    p.cmd('scope-'+label,['node','build-scripts/workflows/check-paragraph-lane-scope.js',
        '--lane','shared','--base',base,'--head',head], expected=want)
p.cmd('scope-default-whitespace',['git','diff','--check',p.SUBJECT,head],expected=None)
p.cmd('scope-cr-at-eol-whitespace',['git','-c','core.whitespace=cr-at-eol','diff','--check',p.SUBJECT,head])
p.cmd('scope-source-whitespace',['git','diff','--check',p.BASE,head,'--','build-scripts/'])
p.cmd('scope-25-tests',[p.PY,'-m','unittest','discover','-s',p.SRC,'-p','test_*.py','-v'])
p.preserve()
print('Actual committed strict-own scope and genuine complete-candidate checks passed; lesson unchanged.')
