"""Semantic negatives: a newly recorded checksum cannot bless stale content."""
from pathlib import Path
import json
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import books34_signed_common as common
import verify_books34_signed as verifier

LESSONS = common.PLATFORM.parent/'4veco-lessen'


class SignedRetrievalTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory(prefix='b34-semantic-test-')
        self.root = Path(self.directory.name)
        for binding in common.CONTRACT['source_bindings']:
            content = common.original(LESSONS, binding['path']).decode('utf-8')
            for edit in common.CONTRACT['source_edits']:
                if edit['path'] == binding['path']:
                    content = content.replace(edit['old'], edit['new'], 1)
            file = self.root/binding['path']
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_bytes(content.encode('utf-8'))

    def tearDown(self):
        self.directory.cleanup()

    def test_exact_eight_substitutions_keep_six_expected_hashes(self):
        self.assertEqual(len(common.sources(self.root)), 6)

    def test_extra_source_edit_fails_without_any_manifest(self):
        file = self.root/common.CONTRACT['source_bindings'][0]['path']
        file.write_bytes(file.read_bytes()+b'\nAdditional instruction.\n')
        with self.assertRaisesRegex(ValueError, 'Unapproved source bytes'):
            common.sources(self.root)

    def test_wrong_signed_boundary_fails(self):
        file = self.root/common.CONTRACT['source_bindings'][2]['path']
        file.write_bytes(file.read_bytes().replace('−1 &lt; Ev &lt; 0'.encode(), 'Ev &lt; −1'.encode(), 1))
        with self.assertRaisesRegex(ValueError, 'Unapproved source bytes'):
            common.sources(self.root)

    def test_all_six_exact_measurements(self):
        self.assertEqual([r['Ev'] for r in verifier.arithmetic()], ['-1/2','-1/2','-2/5','-1/2','-3/2','-2'])

    def test_comparison_cannot_be_revision_itself(self):
        with self.assertRaisesRegex(ValueError, 'distinct roots'):
            common.authenticate_baseline(self.root, self.root)

    def test_comparison_cannot_be_another_revised_copy(self):
        with self.assertRaisesRegex(ValueError, 'Unapproved source bytes'):
            common.authenticate_baseline(self.root, LESSONS)

    def test_baseline_output_tampering_rejects_receipt(self):
        for row in common.CONTRACT['source_bindings']:
            (self.root/row['path']).write_bytes(common.original(LESSONS, row['path']))
        output = self.root/common.EDITION/'test-output.pdf'
        output.write_bytes(b'original fixture')
        with patch.object(common, 'environment', return_value={'test': True}):
            common.write_json(self.root/common.BASELINE_RECEIPT, common.baseline_receipt(self.root))
            common.authenticate_baseline(self.root, LESSONS)
            output.write_bytes(b'altered fixture')
            with self.assertRaisesRegex(ValueError, 'Stale baseline outputs'):
                common.authenticate_baseline(self.root, LESSONS)

    def test_stale_answer_pdf_fails_semantically_before_manifest_recording(self):
        name = 'books/book-3/chapters/3.1/output/Boek_3_H1_Antwoorden_v3.pdf'
        file = self.root/common.EDITION/name
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_bytes(common.original(LESSONS, common.EDITION+'/'+name))
        with patch.object(verifier, 'PUBLICATIONS', {name}), patch.object(verifier, 'original', side_effect=lambda _root, name: common.original(LESSONS, name)):
            with self.assertRaisesRegex(ValueError, 'Stale answer/student PDF'):
                verifier.publication_text(self.root)

    def test_stale_target_answer_pin_fails_even_without_inventory_pin(self):
        name = common.EDITION+'/curriculum/course-target-exercises-books34-v3.json'
        old = common.original(LESSONS, name)
        file = self.root/name
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_bytes(old)
        first = self.root/common.EDITION/'curriculum/targets/3.1.1.json'
        first.parent.mkdir(exist_ok=True)
        first.write_bytes(common.original(LESSONS, common.EDITION+'/curriculum/targets/3.1.1.json'))
        with patch.object(common, 'original', return_value=old):
            with self.assertRaisesRegex(ValueError, 'Changed/stale target record 3.1.1'):
                common.targets(self.root)


if __name__ == '__main__':
    unittest.main()
