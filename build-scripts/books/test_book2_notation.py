import unittest
from book2_print_compatibility import page_exercises,facing
from book2_notation_checks import canonical,exercise_blocks
from book2_notation_print import destination_id


class PrintCompatibilityChecks(unittest.TestCase):
    def test_continuation_figure_is_not_lost_without_an_exercise_heading(self):
        body='<figure><figcaption>Bij opgave 3. Gegeven grafiek.</figcaption></figure><b>Opgave 4 · Vervolg</b>'
        self.assertEqual(page_exercises(body),['3','4'])
        self.assertEqual(page_exercises('Gebruik wat je bij Opgave 3 hebt geleerd.'),[])

    def test_facing_parity_and_nonadjacent_reference(self):
        self.assertTrue(facing([88,89]))
        self.assertFalse(facing([89,90]))
        with self.assertRaises(ValueError):facing([89,91])
class NotationChecks(unittest.TestCase):
    def test_stable_preexisting_destinations(self):
        self.assertEqual(destination_id(24),'book2-page-24')
        self.assertEqual(destination_id(26),'book2-page-25')
        self.assertEqual(destination_id(38),'book2-page-37')
        self.assertEqual(destination_id(74),'book2-page-73')
        self.assertEqual(len({destination_id(i)for i in range(3,112)}),109)
    def test_equivalent_notation_and_separate_lines(self):
        self.assertEqual(canonical('Vraag Qd = 40 − P. Aanbod Qs = P − 10.'),canonical('Vraag Qv = 40 − P<br/>Aanbod Qa = P − 10.'))

    def test_values_and_signs_are_preserved(self):
        self.assertNotEqual(canonical('Qd = 40 − P'),canonical('Qv = 41 − P'))
        self.assertNotEqual(canonical('Qd = 40 − P'),canonical('Qv = 40 + P'))
        self.assertNotEqual(canonical('P = 3.4'),canonical('P = 34'))

    def test_target_blocks_are_included(self):
        source='<div class="exercise">Opgave 1</div><div class="exercise target">Opgave 2</div>'
        self.assertEqual(exercise_blocks(source),['Opgave 1','Opgave 2'])

    def test_marked_bold_does_not_change_payload(self):
        self.assertEqual(canonical('<b>Opgave 1</b>'),canonical('**Opgave 1**'))

if __name__=='__main__':unittest.main()
