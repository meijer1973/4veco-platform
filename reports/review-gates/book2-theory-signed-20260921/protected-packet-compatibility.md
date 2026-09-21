# Historical protected-packet compatibility

Full platform CI at af0ecc14 passed the test suite and product checks, then found
three expected hash differences in the sealed MTU-H7 Bundle 4 packet: two A15
forbidden-role snapshots and the complete registry hash. No historical packet,
source PDF, negative fixture, preparation status or authority flag was changed.

The current checker admits one exact successor registry, canonical SHA-256
`a67185a7e2f8b3389dccf9ef9108036cd02f0bfe2c270fed0fba15552332aaf8`.
It reverses only the previously reviewed four-unit CLI patches and requires
reconstruction of the exact historical registry hash
`6588a10086ecd1a0f08ac4ff3870469ad011c13970737b27d66f21f59e2dc1cd`.
The original packet must still name that old hash. A repinned packet fails.

Only A15's two existing `forbidden_over_trigger_guard` uses can compare against
that historical unit: net-income ratio comparison and insurance cost-benefit.
A15 remains forbidden for both; its signed elasticity procedure does not make
those operations valid elasticity matches. Unknown operations, different roles,
partial application, an altered A15 character or unrelated unit changes receive
no compatibility. All seven protected negative mutations remain detected.

This preserves historical provenance while allowing the explicitly authorized
Book 2 convention revision. It confers no H7 approval, product use, unit minting,
protected-source mutation or lifecycle release. Independent review of this final
compatibility addition and exact-head CI are recorded in the PR delivery record.
