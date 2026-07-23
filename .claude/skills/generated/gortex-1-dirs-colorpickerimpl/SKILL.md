---
name: gortex-1-dirs-colorpickerimpl
description: "Work in the . +1 dirs · ColorPickerImpl area — 143 symbols across 2 files (83% cohesion)"
---

# . +1 dirs · ColorPickerImpl

143 symbols | 2 files | 83% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `src/components/ui/color-picker.tsx`

## Key Files

| File | Symbols |
|------|---------|
| `` | warn |
| `src/components/ui/color-picker.tsx` | colorValue, composedRef, colorString, readOnly, color, ... |

## Entry Points

- `src/components/ui/color-picker.tsx::ColorPickerArea`

## Connected Communities

- **components/ui +15 dirs** (23 cross-edges)
- **components/ui +3 dirs** (5 cross-edges)
- **components/ui +23 dirs** (4 cross-edges)
- **components · getState** (2 cross-edges)
- **components/ui · rgbToHex** (2 cross-edges)

## How to Explore

```
get_communities with id: "community-187"
smart_context with task: "understand . +1 dirs · ColorPickerImpl", format: "gcx"
find_usages with id: "src/components/ui/color-picker.tsx::ColorPickerArea", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
