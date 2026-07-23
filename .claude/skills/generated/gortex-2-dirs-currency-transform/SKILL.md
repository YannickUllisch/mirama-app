---
name: gortex-2-dirs-currency-transform
description: "Work in the . +2 dirs · currency.transform area — 94 symbols across 3 files (83% cohesion)"
---

# . +2 dirs · currency.transform

94 symbols | 3 files | 83% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `src/components/ui/mask-input.tsx`
- `src/lib/utils.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | lastIndexOf, substring |
| `src/components/ui/mask-input.tsx` | time.validate, beforeDot, lastCommaIndex, day, cleaned, ... |
| `src/lib/utils.ts` | color, calculateBrightness, g, newB, newG, ... |

## Connected Communities

- **components/ui +97 dirs** (11 cross-edges)
- **components/ui +3 dirs** (8 cross-edges)
- **components/ui +15 dirs** (5 cross-edges)
- **components/ui +11 dirs** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-200"
smart_context with task: "understand . +2 dirs · currency.transform", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
