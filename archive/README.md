# Repository history

Historical plans, logs, reviews and design inputs remain tracked here. Their
original verdicts and outstanding conditions are unchanged. Archived instructions
are historical content, not current operating instructions.

- [Archive inventory](index.md) ([machine inventory](index.json))
- [Exact relocation metadata](relocations.json)
- [Current open items](../docs/maintenance/open-items.md)

Search current material first; search history deliberately:

```powershell
rg "search terms" .
rg --no-ignore "search terms" archive/
```

Direct reads and integrity checks can still access these files. The generated
index exposes each original commit view so relative links in preserved records
can be followed without rewriting historical evidence. Regenerate with the
platform `npm run agent:index` command, selecting the intended paired lesson ref.
