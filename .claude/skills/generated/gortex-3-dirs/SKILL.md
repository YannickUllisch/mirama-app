---
name: gortex-3-dirs
description: "Work in the . +3 dirs area — 62 symbols across 4 files (77% cohesion)"
---

# . +3 dirs

62 symbols | 4 files | 77% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `src/components/Tables/DataTable.tsx`
- `src/hooks/use-server-table.ts`
- `src/lib/parsers.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | stringify |
| `src/components/Tables/DataTable.tsx` | setSorting, onColumnVisibilityChange, onColumnSizingChange, columnSizeModel, newColSizeState, ... |
| `src/hooks/use-server-table.ts` | apiParams, TData, pageKey, table, perPageKey, ... |
| `src/lib/parsers.ts` | parse, getFiltersStateParser, value, columnIds, result, ... |

## Entry Points

- `src/components/Tables/DataTable.tsx::DataTable`

## Connected Communities

- **components/ui +15 dirs** (7 cross-edges)
- **components/ui +97 dirs** (4 cross-edges)
- **components/Skeletons +17 dirs** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-149"
smart_context with task: "understand . +3 dirs", format: "gcx"
find_usages with id: "src/components/Tables/DataTable.tsx::DataTable", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
