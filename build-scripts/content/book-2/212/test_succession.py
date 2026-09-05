"""Exact S1 two-pin regression memory; not independent review or acceptance."""
import ast
from contextlib import ExitStack
import hashlib
from pathlib import Path
import subprocess
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import b2_212 as b
import test_metadata as metadata

BASE = '572d1ea2ededaffd28afc44eeeca223252a58ec5'
ORIGINAL = '798cacfeeb40e4e0ba54d26f2b040cbdeec327a9'
PREDECESSOR = '5e14325d70b6cc6aee643d9b57395c92b0904ffb'
GENERATOR = 'build-scripts/content/book-2/b2_212.py'
CONTENT = 'build-scripts/content/book-2/212/'
SWAPS = (
    ('PRIOR_REVIEW_HASH = "92b4a9462caf8316274fb58f8beef5c850147c44e6bf80b9a28fad442d9dbe96"',
     'PRIOR_REVIEW_HASH = "a75755c7c2e6cdffb2defcbb5403814cf854d87bfae9a8172dd768aadb5b8023"'),
    ('PRIOR_QUALITY_HASH = "0dddb6e9d8f3a8da0e0f31e67dafabf53b99feb6ad86ce72039480dd7e12ea18"',
     'PRIOR_QUALITY_HASH = "c85c44a53d46af87ad61500b83b0fd721fac43c97ffd1be3d512308158a4b9f5"'),
)
SOURCES = ('theory.md','exercises.md','answers.md','target-answers.md')
TITLES = '''    titles = {
        "2.1.2_we_1": "Kajakverhuur: TK, TO, break-even en verticale winstafstand per dag",
        "2.1.2_ex_1": "Zeep: TK, TO, break-even en verticale winstafstand per dag",
        "2.1.2_ex_3": "Bloempotten: TK, TO, break-even en verticale winstafstand per dag",
        "2.1.2_ex_4": "Minigolf: TK, TO, break-even en verticale winstafstand per dag",
        "2.1.2_ex_5": "Bakkerij: TK, TO, break-even en verticale winstafstand per maand",
    }
'''


def blob(commit, relative, cwd=b.ROOT):
    return subprocess.check_output(['git','show',commit+':'+relative],cwd=cwd).decode('utf-8')


def swap_exact(previous):
    for old,new in SWAPS:
        assert previous.count(old) == 1
        assert previous.count(new) == 0
        previous=previous.replace(old,new,1)
    return previous


def expected_generator():
    previous=blob(ORIGINAL,GENERATOR)
    start='    for name, fixed, variable, price, qmax, ymax, qticks, yticks, qunit, period, complete in cases:'
    old_title='name + ": TK en TO" if complete else "Bloempotten: alleen TK"'
    assert previous.count(start) == previous.count(old_title) == 1
    previous=previous.replace(start,TITLES+start,1).replace(old_title,'titles[name] if complete else "Bloempotten: alleen TK"',1)
    assert previous == blob(BASE,GENERATOR)
    return swap_exact(previous)


class SuccessionTests(unittest.TestCase):
    def test_exact_complete_generator_from_both_immutable_baselines(self):
        expected=expected_generator()
        self.assertEqual(expected,swap_exact(blob(BASE,GENERATOR)))
        self.assertEqual(Path(b.__file__).read_text(encoding='utf-8'),expected)
        # Exercise the actual evolved original metadata guard, not only a duplicate assertion.
        metadata.MetadataTests('test_unchanged_generator_outside_title_loop').test_unchanged_generator_outside_title_loop()

    def test_old_partial_unknown_and_unrelated_generators_rejected(self):
        original=blob(BASE,GENERATOR)
        expected=expected_generator()
        fixtures=[original,
            original.replace(*SWAPS[0],1), original.replace(*SWAPS[1],1),
            expected.replace(SWAPS[0][1],SWAPS[0][1].replace('a757','ffff'),1),
            expected+'\n# Unrelated edit\n',
            expected.replace('assets.mkdir(exist_ok=True)','assets.mkdir(exist_ok=True, parents=True)',1),
            expected.replace('raise ValueError(f"Required accepted source differs: {path}")','pass',1)]
        original_reader=Path.read_text
        for candidate in fixtures:
            self.assertNotEqual(candidate,expected)
            def read(path,*args,**kwargs):
                return candidate if path == Path(b.__file__) else original_reader(path,*args,**kwargs)
            with self.subTest(candidate_sha256=hashlib.sha256(candidate.encode()).hexdigest()), patch.object(Path,'read_text',read):
                with self.assertRaises(AssertionError):
                    metadata.MetadataTests('test_unchanged_generator_outside_title_loop').test_unchanged_generator_outside_title_loop()

    def test_exact_original_tests_and_other_metadata_methods(self):
        for name in ('test_source.py','test_bonus.py'):
            self.assertEqual((b.CONTENT/name).read_text(encoding='utf-8'),blob(BASE,CONTENT+name))
        before=ast.parse(blob(BASE,CONTENT+'test_metadata.py'))
        after=ast.parse((b.CONTENT/'test_metadata.py').read_text(encoding='utf-8'))
        def methods(tree):
            return {node.name:ast.dump(node,include_attributes=False) for node in ast.walk(tree)
                    if isinstance(node,ast.FunctionDef) and node.name != 'test_unchanged_generator_outside_title_loop'}
        self.assertEqual(methods(before),methods(after))
        self.assertEqual(sum(name.startswith('test_') for name in methods(before)),4)
        insertion='''        old_review = 'PRIOR_REVIEW_HASH = "92b4a9462caf8316274fb58f8beef5c850147c44e6bf80b9a28fad442d9dbe96"'
        new_review = 'PRIOR_REVIEW_HASH = "a75755c7c2e6cdffb2defcbb5403814cf854d87bfae9a8172dd768aadb5b8023"'
        old_quality = 'PRIOR_QUALITY_HASH = "0dddb6e9d8f3a8da0e0f31e67dafabf53b99feb6ad86ce72039480dd7e12ea18"'
        new_quality = 'PRIOR_QUALITY_HASH = "c85c44a53d46af87ad61500b83b0fd721fac43c97ffd1be3d512308158a4b9f5"'
        self.assertEqual(expected.count(old_review), 1)
        self.assertEqual(expected.count(old_quality), 1)
        expected = expected.replace(old_review, new_review, 1)
        expected = expected.replace(old_quality, new_quality, 1)
'''
        original_metadata=blob(BASE,CONTENT+'test_metadata.py')
        anchor='        self.assertEqual(current,expected)\n'
        self.assertEqual(original_metadata.count(anchor),1)
        self.assertEqual((b.CONTENT/'test_metadata.py').read_text(encoding='utf-8'),
                         original_metadata.replace(anchor,insertion+anchor,1))

    def test_four_whole_sources_and_unrelated_source_rejection(self):
        current={name:(b.CONTENT/name).read_text(encoding='utf-8') for name in SOURCES}
        for name in SOURCES:
            self.assertEqual(current[name],blob(BASE,CONTENT+name))
        original_reader=Path.read_text
        for name in SOURCES:
            def read(path,*args,**kwargs):
                return current[name]+'\nUnrelated drift.\n' if path == b.CONTENT/name else original_reader(path,*args,**kwargs)
            with self.subTest(name=name),patch.object(Path,'read_text',read):
                with self.assertRaises(AssertionError):
                    metadata.MetadataTests('test_nine_exact_native_insertions_and_unchanged_full_sources').test_nine_exact_native_insertions_and_unchanged_full_sources()

    def test_successor_files_are_exact_published_accepted_predecessor(self):
        lessons=b.ROOT.parent/'4veco-lessen'
        prior=b.LESSON_REL.parent/'2.1.1 Kostenstructuren'
        for name,expected in [('2.1.1-review.md','a75755c7c2e6cdffb2defcbb5403814cf854d87bfae9a8172dd768aadb5b8023'),
                              ('2.1.1-quality-ref.yaml','c85c44a53d46af87ad61500b83b0fd721fac43c97ffd1be3d512308158a4b9f5')]:
            actual=(lessons/prior/name).read_text(encoding='utf-8-sig')
            previous=blob(PREDECESSOR,(prior/name).as_posix(),lessons)
            self.assertEqual(actual,previous)
            self.assertEqual(hashlib.sha256(previous.encode()).hexdigest(),expected)
            self.assertEqual(b.lf_hash(lessons/prior/name),expected)

    def test_each_missing_or_unknown_input_rejected_before_process_mkdir_write(self):
        lessons=b.ROOT.parent/'4veco-lessen'
        prior=lessons/b.LESSON_REL.parent/'2.1.1 Kostenstructuren'
        original_reader=Path.read_text
        for name in ('2.1.1-review.md','2.1.1-quality-ref.yaml'):
            for problem in ('missing','wrong_hash'):
                def read(path,*args,**kwargs):
                    if path == prior/name:
                        if problem=='missing': raise FileNotFoundError(str(path))
                        return original_reader(path,*args,**kwargs)+'\nForged input.\n'
                    return original_reader(path,*args,**kwargs)
                with self.subTest(name=name,problem=problem),ExitStack() as stack:
                    stack.enter_context(patch.object(Path,'read_text',read))
                    process=stack.enter_context(patch.object(b.subprocess,'run'))
                    mkdir=stack.enter_context(patch.object(Path,'mkdir'))
                    write_text=stack.enter_context(patch.object(Path,'write_text'))
                    write_bytes=stack.enter_context(patch.object(Path,'write_bytes'))
                    build=stack.enter_context(patch.object(b,'build_document'))
                    with self.assertRaises(FileNotFoundError if problem=='missing' else ValueError):
                        b.build(lessons,proof_suffix='r999')
                    for action in (process,mkdir,write_text,write_bytes,build): action.assert_not_called()

    def test_valid_actual_inputs_reach_first_governance_process_only(self):
        class GuardPassed(Exception): pass
        with ExitStack() as stack:
            process=stack.enter_context(patch.object(b.subprocess,'run',side_effect=GuardPassed))
            mkdir=stack.enter_context(patch.object(Path,'mkdir'))
            write_text=stack.enter_context(patch.object(Path,'write_text'))
            write_bytes=stack.enter_context(patch.object(Path,'write_bytes'))
            with self.assertRaises(GuardPassed): b.build(b.ROOT.parent/'4veco-lessen',proof_suffix='r999')
            process.assert_called_once()
            self.assertEqual(process.call_args.args[0][1],'build-scripts/workflows/check-book-outline-currentness.js')
            for action in (mkdir,write_text,write_bytes): action.assert_not_called()


if __name__=='__main__': unittest.main()
