# Stack Selection (Preflight)
| Layer | Requested | Variant Req. | Chosen | Variant | Note |
|---|---|---|---|---|---|
| Frontend | nextjs | enterprise | nextjs | base | Downgraded frontend nextjs enterprise → base |
| Backend | none | enterprise | none | base | Downgraded backend none enterprise → base |
| Database | none | base | none | base |  |
| Compliance | accessibility, performance | — | accessibility, performance | overlay | rule-based overlay |

## Engine Checks
- node: required >=20.10.0, current v20.19.5 → OK

## Warnings
- Downgraded frontend nextjs enterprise → base
- Downgraded backend none enterprise → base
