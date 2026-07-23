---
name: gortex-components-ui-15-dirs
description: "Work in the components/ui +15 dirs area — 1243 symbols across 50 files (85% cohesion)"
---

# components/ui +15 dirs

1243 symbols | 50 files | 85% cohesion

## When to Use

Use this skill when working on files in:
- ``
- `external-call::stdlib:react`
- `external-call::stdlib:react-dom`
- `server/auth/cognito/handleAuthChallenge.ts`
- `src/components/Calendar/hooks/useMonthChange.tsx`
- `src/components/Calendar/hooks/useWeekChange.tsx`
- `src/components/Select/CalendarTableSelect.tsx`
- `src/components/Tables/Filters/EnumFilter.tsx`
- `src/components/data-grid/data-grid-cell-variants.tsx`
- `src/components/data-grid/data-grid-cell-wrapper.tsx`
- `src/components/data-grid/data-grid-column-header.tsx`
- `src/components/data-grid/data-grid-context-menu.tsx`
- `src/components/data-grid/data-grid-paste-dialog.tsx`
- `src/components/data-grid/data-grid-presence.tsx`
- `src/components/data-grid/data-grid-row.tsx`
- `src/components/data-grid/data-grid-search.tsx`
- `src/components/data-grid/data-grid.tsx`
- `src/components/data-table/data-table-date-filter.tsx`
- `src/components/data-table/data-table-faceted-filter.tsx`
- `src/components/data-table/data-table-slider-filter.tsx`
- `src/components/data-table/data-table-toolbar.tsx`
- `src/components/ui/action-bar.tsx`
- `src/components/ui/calendar.tsx`
- `src/components/ui/color-picker.tsx`
- `src/components/ui/direction.tsx`
- `src/components/ui/faceted.tsx`
- `src/components/ui/form.tsx`
- `src/components/ui/sortable.tsx`
- `src/components/ui/speed-dial.tsx`
- `src/components/ui/tableInput.tsx`
- `src/components/ui/time-picker.tsx`
- `src/components/ui/timeline.tsx`
- `src/components/visually-hidden-input.tsx`
- `src/hooks/use-as-ref.ts`
- `src/hooks/use-badge-overflow.ts`
- `src/hooks/use-callback-ref.ts`
- `src/hooks/use-data-grid.ts`
- `src/hooks/use-data-table.ts`
- `src/hooks/use-debounced-callback.ts`
- `src/hooks/use-isomorphic-layout-effect.ts`
- `src/hooks/use-lazy-ref.ts`
- `src/lib/compose-refs.ts`
- `src/lib/data-grid.ts`
- `src/lib/format.ts`
- `src/modules/pm/tasks/tasks.hooks.ts`
- `src/modules/shared/auth-helpers.ts`
- `src/modules/shared/hooks/utils/use-mobile.tsx`
- `src/modules/tenant/iam/roles/components/RoleForm.tsx`
- `src/types/data-grid.ts`
- `src/types/data-table.ts`

## Key Files

| File | Symbols |
|------|---------|
| `` | findIndex, catch, trim, blur, isFinite, ... |
| `external-call::stdlib:react` | react |
| `external-call::stdlib:react-dom` | react-dom |
| `server/auth/cognito/handleAuthChallenge.ts` | email, validatedFields, authResult, client, currentPassword, ... |
| `src/components/Calendar/hooks/useMonthChange.tsx` | useMonthChange |
| `src/components/Calendar/hooks/useWeekChange.tsx` | useWeekChange |
| `src/components/Select/CalendarTableSelect.tsx` | handleSelect, setPopupOpen, setDate, error, date, ... |
| `src/components/Tables/Filters/EnumFilter.tsx` | next, TData, value, isActive, EnumFilter, ... |
| `src/components/data-grid/data-grid-cell-variants.tsx` | hiddenFileCount, visibleFiles, setValue, NumberCell, setValue, ... |
| `src/components/data-grid/data-grid-cell-wrapper.tsx` | onMouseDown, cellPresence, onMouseEnter, TData, onClick, ... |
| `src/components/data-grid/data-grid-column-header.tsx` | DataGridColumnHeader, TValue, onSortRemove, cellVariant, isAnyColumnResizing, ... |
| `src/components/data-grid/data-grid-context-menu.tsx` | ContextMenuImpl, propsRef, TData, onClear, onCut, ... |
| `src/components/data-grid/data-grid-paste-dialog.tsx` | expandRadioRef, onOpenChange, PasteDialogImpl, propsRef, onCancel, ... |
| `src/components/data-grid/data-grid-presence.tsx` | useDataGridPresence, DataGridPresenceProviderProps, DataGridCellPresence, cellKey, map |
| `src/components/data-grid/data-grid-row.tsx` | visibleCells, onRowChange, virtualRowIndex, DataGridRowImpl, rowRef, ... |
| `src/components/data-grid/data-grid-search.tsx` | event, inputRef, value, propsRef, setHasQuery, ... |
| `src/components/data-grid/data-grid.tsx` | DataGrid, onFooterCellKeyDown, DataGridProps, rows, readOnly, ... |
| `src/components/data-table/data-table-date-filter.tsx` | onSelect, numericTimestamp, timestamp, DateSelection, selectedDates, ... |
| `src/components/data-table/data-table-faceted-filter.tsx` | DataTableFacetedFilter, TData, setOpen, TValue, columnFilterValue, ... |
| `src/components/data-table/data-table-slider-filter.tsx` | range, value, RangeValue, unit, onSliderValueChange, ... |
| `src/components/data-table/data-table-toolbar.tsx` | TData, DataTableToolbarFilter, columnMeta, onFilterRender |
| `src/components/ui/action-bar.tsx` | dir, event, itemProps, composedRef, GroupPrimitive, ... |
| `src/components/ui/calendar.tsx` | CalendarDayButton, DayButton, defaultClassNames, ref |
| `src/components/ui/color-picker.tsx` | Store, cb, subscribe |
| `src/components/ui/direction.tsx` | useDirection |
| `src/components/ui/faceted.tsx` | open, Faceted, value, onItemSelect, children, ... |
| `src/components/ui/form.tsx` | fieldState, formState, fieldContext, getFieldState, id, ... |
| `src/components/ui/sortable.tsx` | ItemPrimitive, Sortable, onDragEnd, asHandle, attributes, ... |
| `src/components/ui/speed-dial.tsx` | contentProps, composedRef, triggerRef, asChild, disabledProp, ... |
| `src/components/ui/tableInput.tsx` | handleKeyDown, event |
| `src/components/ui/time-picker.tsx` | consumerName, props, rootId, composedRef, instanceId, ... |
| `src/components/ui/timeline.tsx` | setInternalStep, currentStep, activeStep, setActiveStep, Timeline |
| `src/components/visually-hidden-input.tsx` | isCheckInput, value, controlSize, control, prevValue, ... |
| `src/hooks/use-as-ref.ts` | props, useAsRef, T, ref |
| `src/hooks/use-badge-overflow.ts` | setContainerWidth, useBadgeOverflow, result, UseBadgeOverflowReturn, T, ... |
| `src/hooks/use-callback-ref.ts` | callback, callbackRef, useCallbackRef, T |
| `src/hooks/use-data-grid.ts` | notify, onAutoScrollStop, getMemoizedFilteredRowModel, onNavigateToNextMatch, searchQuery, ... |
| `src/hooks/use-data-table.ts` | setRowSelection, tableProps, joinOperatorKey, setColumnFilters, pagination, ... |
| `src/hooks/use-debounced-callback.ts` | handleCallback, delay, useDebouncedCallback, debounceTimerRef, T, ... |
| `src/hooks/use-isomorphic-layout-effect.ts` | useIsomorphicLayoutEffect |
| `src/hooks/use-lazy-ref.ts` | T, useLazyRef, ref, fn |
| `src/lib/compose-refs.ts` | refs, useComposedRefs, T |
| `src/lib/data-grid.ts` | isFirstRightPinnedColumn, nextColumn, leftPosition, urlString, TData, ... |
| `src/lib/format.ts` | formatDate, _err, date, opts |
| `src/modules/pm/tasks/tasks.hooks.ts` | qc, create.useMutation |
| `src/modules/shared/auth-helpers.ts` | token, name, value, cookieStore, cookieName, ... |
| `src/modules/shared/hooks/utils/use-mobile.tsx` | setIsMobile, onChange, isMobile, useIsMobile |
| `src/modules/tenant/iam/roles/components/RoleForm.tsx` | attached, currentRole, allPolicies, isLoading, expanded, ... |
| `src/types/data-grid.ts` | CellSelectOption, CellOpts, Direction, ColumnMeta, CellUpdate, ... |
| `src/types/data-table.ts` | ExtendedColumnSort |

## Entry Points

- `src/hooks/use-data-grid.ts::useDataGrid`
- `src/components/data-grid/data-grid-cell-variants.tsx::FileCell`
- `src/components/data-grid/data-grid-cell-variants.tsx::MultiSelectCell`
- `src/components/ui/speed-dial.tsx::SpeedDialContent`
- `src/components/data-grid/data-grid-cell-variants.tsx::UrlCell`

## Connected Communities

- **components/ui +97 dirs** (134 cross-edges)
- **components/ui +23 dirs** (34 cross-edges)
- **components/ui +3 dirs** (31 cross-edges)
- **components/Skeletons +17 dirs** (20 cross-edges)
- **. +9 dirs** (20 cross-edges)
- **components/ui +11 dirs** (8 cross-edges)
- **components · getState** (4 cross-edges)
- **. +3 dirs** (4 cross-edges)
- **components/ui · ColorPicker** (2 cross-edges)
- **src/lib · parseLocalDate** (2 cross-edges)
- **auth · providers.authorize** (1 cross-edges)
- **. +1 dirs · useDropzone** (1 cross-edges)
- **. +1 dirs · measureBadgeWidth** (1 cross-edges)
- **Tabs/ViewTaskTabs +6 dirs** (1 cross-edges)
- **. +1 dirs · ColorPickerImpl** (1 cross-edges)
- **src/lib · setRef** (1 cross-edges)
- **components/data-grid +2 dirs** (1 cross-edges)
- **teams/_components +8 dirs** (1 cross-edges)

## How to Explore

```
get_communities with id: "community-232"
smart_context with task: "understand components/ui +15 dirs", format: "gcx"
find_usages with id: "src/hooks/use-data-grid.ts::useDataGrid", format: "gcx"
```

_`format: "gcx"` returns the [GCX1 compact wire format](../../docs/wire-format.md) — round-trippable, ~27% fewer tokens than JSON. Drop it for JSON output; agents using `@gortex/wire` or the Go `github.com/gortexhq/gcx-go` package decode either._
