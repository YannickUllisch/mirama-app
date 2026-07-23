---
name: gortex-components-ui-3-dirs
description: "Work in the components/ui +3 dirs area — 328 symbols across 9 files (83% cohesion)"
---

# components/ui +3 dirs

328 symbols | 9 files | 83% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `src/components/Tables/Filters/filter-fns.ts`
- `src/components/ui/button.tsx`
- `src/components/ui/color-picker.tsx`
- `src/components/ui/dropzone.tsx`
- `src/components/ui/mask-input.tsx`
- `src/components/ui/speed-dial.tsx`
- `src/components/ui/time-picker.tsx`
- `src/lib/data-grid.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | isNaN, parseInt, match, padStart, querySelectorAll, ... |
| `src/components/Tables/Filters/filter-fns.ts` | inDateRangeFilterFn, end, filterValue, date, raw, ... |
| `src/components/ui/button.tsx` | ButtonProps |
| `src/components/ui/color-picker.tsx` | parseColorString, g, h, alpha, rgbToHsl, ... |
| `src/components/ui/dropzone.tsx` | DropzoneRetryFileProps, DropzoneRemoveFileProps |
| `src/components/ui/mask-input.tsx` | num, currency.validate, value, value, max, ... |
| `src/components/ui/speed-dial.tsx` | key, setState, value |
| `src/components/ui/time-picker.tsx` | TimePickerInputProps, ref, min, formatTimeValue, onBlur, ... |
| `src/lib/data-grid.ts` | year, day, month, formatDateToString, date |

## Entry Points

- `src/components/ui/time-picker.tsx::TimePickerInput`

## Connected Communities

- **components/ui +15 dirs** (45 cross-edges)
- **components/ui +23 dirs** (14 cross-edges)
- **components/ui +97 dirs** (9 cross-edges)
- **components/Skeletons +17 dirs** (4 cross-edges)
- **components · getState** (2 cross-edges)
- **components/ui · rgbToHex** (1 cross-edges)
- **. +9 dirs** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-222"
smart_context with task: "understand components/ui +3 dirs", format: "gcx"
find_usages with id: "src/components/ui/time-picker.tsx::TimePickerInput", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
