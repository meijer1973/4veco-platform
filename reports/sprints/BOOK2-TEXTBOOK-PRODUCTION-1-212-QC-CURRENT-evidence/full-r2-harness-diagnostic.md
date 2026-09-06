# r20 extended-path inventory diagnostic

The authorized ordinary full regeneration exited zero. The original-file custody
check passed for every tracked lesson file, all platform inputs and historical
§212 reports. The first document's 14 raw and decoded page comparisons passed.
The subsequent own-harness ZIP inventory comparison stopped with `ValueError`:
an asset path beginning with Windows `\\?\C:\...` was compared by `relative_to`
against the same ordinary `C:\...` folder without prefix normalization.

The native invocation and stdout/stderr remain unchanged in
`full-r2-process.json`, SHA-256
`b080b44e3fe7126d7d10e28f0fab71750f5370fdc13d1cdb7444f4afed49987f`.
The outer Python traceback was returned by the task terminal; it was not native
subprocess stderr. No native artifact failure is inferred from this harness bug.

The helper now removes only the exact Windows extended-path prefix before its
same-root relative-path comparison. It reruns parity against the existing r20
PENDING proof, without regenerating or overwriting any artifact or evidence.
All expected members, safe-name/CRC/current-byte conditions and original native
and page comparisons remain required; this is no output-drift waiver.
