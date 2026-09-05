# Specialist round 1 correction log

Round 1 reviewed package: `1811875244510bef045ea037845cbcdec90dbd74fcc55cb9d03fd8a64db99154`.

Corrected implementation candidate package: `673e2de8f6ca4a92a637d4061e5d77bbafa1cf5b07dcaa4e5edb5e44ead75ebe`.

## Applied corrections

- Removed `productiegebied`, `break-evenafzet`, `kruiselingse`, `Ek`, `WTP`, and trapezoid surplus routes from all student-facing candidate fields.
- Reduced every question to at most four points; shortened the largest theory workloads and made all mixed targets predominantly two-point.
- Added the §2.1.1 classification source, reduced its comparison set to three claims, and supplied an economic cause for every claim.
- Removed invalid quadratic/welfare skill links from linear TK/TO work and recorded explicit linear-operation gaps.
- Reduced both §2.1.3 tables to four rows while retaining normalised interval evidence.
- Made §2.1.4 visibly retrieve constant/variable classification and specified its base graph completely.
- Reframed §2.2.2 as a local small-change rule plus exact finite-change factors.
- Rebuilt §2.2.3 around canonical Ekr, named goods/variables/units, and two function-output/direction questions without duplicate elasticity chains.
- Converted §§2.2.4 sources A–C into actual tables and made its final answer exactly one supported plus two unsupported conclusions.
- Added realised sales and highest-betalingsbereidheid allocation to demand-only §2.3.1.
- Bounded inverse supply as MK for §2.3.2, supplied a base graph, removed D20, and added D39/A40 with the stale D39 prerequisite flagged.
- Rebuilt §2.3.3 at P=€25 with Qd=50, Qs=80, a binding limit of 40, technical capacity of at least 60, and costless relaxation. CS=€600, PS=€600, TS=€1.200, DWL=€150; Q41 proves a feasible Pareto improvement.
- Rebuilt §2.3.4 at P=€45 with Qd=35, Qs=50, a binding limit of 30, technical capacity of at least 40, and costless relaxation. CS=€600, PS=€525, TS=€1.125, DWL=€75; Q31 retrieves the Pareto operation.
- Reconciled all goal/question labels in both alignment surfaces and added a machine comparison.
- Expanded the mutation suite to reject forbidden terminology, >4-point questions, nonbinding limits, infeasible Pareto logic, stale finite-change claims, invalid skill links, unsupported surplus shapes, and stale Markdown alignment maps.

Candidate bindings remain non-approving and open. The corrected package must receive a second specialist pass before its lifecycle can advance to `specialist_reviewed_candidate`.

## Round 2 corrections

Round 2 reviewed package: `673e2de8f6ca4a92a637d4061e5d77bbafa1cf5b07dcaa4e5edb5e44ead75ebe`.

Corrected recheck candidate package: `0e11c6a2b8688196af264095d9babf32da6f4fd363bfe4315df6d04a2f838c2d`.

- Replaced student-facing `Ekr` with the authored notation `Ek`; retained the stale A16/D12 wording only as an explicit gap.
- Removed D25 as purported coverage for the local Ev/TO rule and added a negative checker assertion.
- Replaced the §2.3.4 capacity wording with the actual booking-limit model.
- Added A38, A15, A05, D06, D1.5, D1.6, and D1.18 where the prerequisite or exam-code route requires them; recorded the D02, D28, and D20 scope gaps without inventing coverage.
- Reduced theory targets to one sufficient evidence chain per goal and added exact positive-integer time budgets per visible question.
- Tightened mixed-target scoring to require at least 80% two-point questions; a mutation with only four of six now fails.
- Converted the §2.1.3 and §2.1.4 source data to real table structures and assigned every interval result to a named right endpoint.
- Removed the unused multivariable-function source from §2.2.4 and added an ordinary-language Ev interpretation.
- Rebalanced §2.1.2 to reserve five of twelve minutes for its complete graph.
- Rewrote abstract student language such as `partieel verband` and removed bare `ceteris paribus` from goals.
- Regenerated A17 through the protected unit-update CLI while preserving the repository’s historical Markdown spacing; the final projection diff is limited to the stats date and A17 procedure.

Candidate bindings remain open and non-approving. The corrected package now awaits specialist round 3 against its exact hash.

## Round 3 corrections

Round 3 reviewed package: `0e11c6a2b8688196af264095d9babf32da6f4fd363bfe4315df6d04a2f838c2d`.

Corrected recheck candidate package: `ad2afda91c6f8cc3cb489d67bae7b1b093f22076a04aaa11d36488de0dcd4774`.

- Removed the three Curva MK answers from the §2.1.3 learner prompt and added a negative answer-leak mutation.
- Narrowed §§2.1.1 and 2.1.3 goals to the work learners visibly perform.
- Corrected §2.1.4: normal production from Q=400 to Q=700 has margin `MO−MK=€3`, greater than the three rush margins `€2/€1,50/€1`; the candidate, both alignment surfaces, and checker now require that full comparison.
- Made the §2.1.1 classification source a structured table.
- Removed unsupported A2.5 claims from all elasticity records, added A2.4 to §2.2.2, recorded the broader MTU-metadata debt, and made the `−12%` revenue change explicit.
- Restored the required multivariable-demand-function consolidation in §2.2.4 while retaining five two-point questions and one four-point combined Ei/Ek question.
- Added an exact per-question action-budget schema (`label`, `minutes`, `points`, `observable_actions`) for all twelve records. The checker rejects missing budgets, label/time/point drift, empty actions, and more observable action groups than available points.
- Reduced surplus workload by supplying a marginal-comparison table in §2.3.2, premarking P=25 and Q=40 in the §2.3.3 base graph, and supplying the binding and Q31 marginal facts in §2.3.4.
- Gave §2.3.3c four minutes, removed redundant graph-marking work from §2.3.3d, and mapped the restricted-state comparison back to goal 2.

Candidate bindings remain open and non-approving. Specialist round 4 must review the new exact package hash before lifecycle promotion.

## Round 4 and final exact recheck

Round 4 reviewed package: `ad2afda91c6f8cc3cb489d67bae7b1b093f22076a04aaa11d36488de0dcd4774`.

The three specialist verdicts were PASS with nonblocking flags. Every evidence-quality suggestion was applied: §2.2.4 goal 1 was narrowed to the visible Ev/Ei/Ek route, the §2.3.4 matrix no longer asks learners to reverify supplied bindendheid, and separate mutations now exercise budget label, minutes, points, and empty-action drift.

Final exact specialist-reviewed candidate package: `32f5325a542445eb093b0e645304afae7542b2c92e491c8bd09ace9fefa71441`.

Economics, teacher/learning-quality, and student-language reviewers each returned PASS against that exact hash. The candidate may advance to `specialist_reviewed_candidate`; owner approval fields remain null and all integration, production, lesson-authoring, and merge holds remain open.
