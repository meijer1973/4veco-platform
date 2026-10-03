import unittest
from verify import revised_student,NORMAL,CHALLENGE

class BoundedChanges(unittest.TestCase):
    def test_route_preserves_unrelated_numbers(self):
        old='Korte route: Startopgaven → Zelfstandige oefening → Doeloefening. Extra hulp nodig? Maak eerst Begeleide inoefening.\nQ = 100 − 5P'
        new=revised_student(old,'1.2.2 paragraaf.md')
        self.assertIn(NORMAL,new);self.assertIn(CHALLENGE,new);self.assertIn('Q = 100 − 5P',new)
        self.assertNotEqual(new,new.replace('100','120'))
    def test_answer_leak_removed_without_numeric_changes_elsewhere(self):
        old='De berekende 64 kilo is aangeboden kaas. Bereken met q = 4P − 40.'
        self.assertEqual(revised_student(old,'paragraaf.md'),'De berekende hoeveelheid is aangeboden kaas. Bereken met q = 4P − 40.')
    def test_domain_is_explicit_without_giving_intercept(self):
        text=revised_student('Hierdoor worden bij Lumi bij elke onderzochte prijs 20 bezoeken extra gevraagd.','paragraaf.md')
        self.assertIn('tot de gevraagde hoeveelheid nul is',text);self.assertNotIn('24',text)
    def test_no_global_domain_expansion(self):
        text='Het model geldt voor 0 ≤ P ≤ 8.'
        self.assertEqual(revised_student(text,'gemengd.md'),text)

if __name__=='__main__':unittest.main()
