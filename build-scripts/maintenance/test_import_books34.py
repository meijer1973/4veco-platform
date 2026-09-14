"""Finite importer safety regression checks; no delivered content is modified."""
import importlib.util,io,os,stat,tempfile,unittest,zipfile
from pathlib import Path
spec=importlib.util.spec_from_file_location('books34',Path(__file__).with_name('import-books34-delivery.py'))
importer=importlib.util.module_from_spec(spec);spec.loader.exec_module(importer)
class SafetyTests(unittest.TestCase):
 def entries(self,names):
  buf=io.BytesIO()
  with zipfile.ZipFile(buf,'w') as z:
   for name in names:
    if isinstance(name,str):
     entry=zipfile.ZipInfo('entry');entry.filename=name
    else:entry=name
    z.writestr(entry,b'text')
  return zipfile.ZipFile(io.BytesIO(buf.getvalue()))
 def test_paths(self):
  for name in ['../outside','/absolute','C:/drive','folder\\escape','folder./file']:
   with self.subTest(name=name),self.entries([name]) as z,self.assertRaises(ValueError):list(importer.safe_entries(z))
 def test_duplicates(self):
  with self.entries(['file','FILE']) as z,self.assertRaises(ValueError):list(importer.safe_entries(z))
 def test_symlink(self):
  entry=zipfile.ZipInfo('link');entry.external_attr=(stat.S_IFLNK|0o777)<<16
  with self.entries([entry]) as z,self.assertRaises(ValueError):list(importer.safe_entries(z))
 def test_preserved_and_long_path(self):
  temporary_root=('\\\\?\\'+tempfile.gettempdir()) if os.name=='nt' else tempfile.gettempdir()
  with tempfile.TemporaryDirectory(dir=temporary_root) as folder:
   root=Path(folder);rel='/'.join(['nested'*5]*8)+'/source.md'
   importer.write_preserved(root,rel,b'unchanged\r\n')
   importer.write_preserved(root,rel,b'unchanged\r\n')
   with self.assertRaises(ValueError):importer.write_preserved(root,rel,b'changed')
   with self.assertRaises(ValueError):importer.write_preserved(root,'../outside',b'escape')
if __name__=='__main__':unittest.main()
