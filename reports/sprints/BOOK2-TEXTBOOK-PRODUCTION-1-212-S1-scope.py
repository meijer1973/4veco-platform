"""Record full committed scope output without the standard Markdown log display cap."""
from pathlib import Path
import importlib.util
import subprocess

ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('own_driver',Path(__file__).with_name('BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-run.py'))
driver=importlib.util.module_from_spec(spec)
spec.loader.exec_module(driver)
HEAD='8fc9957a8118079888f0503bcd066aec820aa315'
MAIN='96416b6b5bd57094576e9aba0a42d682584ec479'
for label,base in [('owned',driver.PBASE),('whole-candidate',MAIN)]:
    driver.command(['node','build-scripts/workflows/check-paragraph-lane-scope.js',
                    '--lane','shared','--base',base,'--head',HEAD],
                   'complete-scope-'+label+'.json')
driver.command(['git','-c','core.whitespace=cr-at-eol','diff','--check',driver.PBASE,HEAD],
               'payload-cr-at-eol-whitespace.json')
driver.command(['git','diff','--check',driver.PBASE,HEAD,'--','build-scripts/'],
               'payload-source-whitespace.json')
driver.check_baseline()
assert subprocess.check_output(['git','status','--porcelain'],cwd=driver.LESSONS)==b''
print('Complete exact committed scope output preserved; native/protected/lesson tree unchanged.')
