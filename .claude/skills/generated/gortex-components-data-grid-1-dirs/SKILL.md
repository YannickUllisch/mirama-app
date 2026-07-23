---
name: gortex-components-data-grid-1-dirs
description: "Work in the components/data-grid +1 dirs area — 57 symbols across 2 files (96% cohesion)"
---

# components/data-grid +1 dirs

57 symbols | 2 files | 96% cohesion

## When to Use

Use this skill when working on files in:
- `src/components/data-grid/data-grid-context-menu.tsx`
- `src/hooks/use-data-grid.ts`

## Key Files

| File | Symbols |
|------|---------|
| `src/components/data-grid/data-grid-context-menu.tsx` | onCellsCut, dataGridRef, TData, onRowsDelete, selectionState, ... |
| `src/hooks/use-data-grid.ts` | clampedX, dy, columns, dir, scrollAreaRight, ... |

## How to Explore

```
get_communities with id: "community-231"
smart_context with task: "understand components/data-grid +1 dirs", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
