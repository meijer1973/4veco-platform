# Lossless native-test evidence publication and exact duplicate cleanup

The complete successful source-probes-r3 process capture was 302,044,775 bytes,
SHA256 `062d65ff80c22026cd5d1eb26072523100bef75e86fe66de073f6212f3bc8576`.
It contains actual repeated immutable Git stdout plus its base64 encoding and
exceeds the normal GitHub 100 MB per-file limit. The owned `pack-source-log`
controller wrote a new lossless gzip, verified decompression against every raw
byte, and retained the original hash/length in `source-probes-r3-log-custody.json`.
The gzip is 64,289,362 bytes, SHA256
`1f7d1c4808f530a0a265b08f935756c7fc9dd328b2bb6556aaf72fe1f0cb9296`.

After those verifications, PowerShell resolved the exact own-created raw file
under this task's `reports/sprints` directory, required exact path equality and
both raw/gzip hashes, and used `Remove-Item -LiteralPath` on that single
uncommitted raw duplicate. The returned checks confirm the raw path is absent,
gzip is retained, and every original byte is recoverable by gunzip. No recursive
deletion, wildcard deletion, foreign fixture, old evidence, failed attempt,
PENDING manifest, or committed file was removed. The gzip is intentional
durable evidence, not a disposable fixture. Do not expand it into the repository
for publication; read through gzip or expand only into a disposable owned area.

The real test fixtures separately use owned temporary directories and assert
all restored bytes and directory removal on context exit. The complete log
records 13 passed tests, 603 raw-input cases, 78 actual-Git source/controller
cases, and zero native effects for invalid inputs. These are author tests, not
independent reviewer acceptance.
