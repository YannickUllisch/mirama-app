import { filterFns, type FilterFn } from '@tanstack/table-core'

// ─── inEnumSet ────────────────────────────────────────────────────────────────
// Checks whether a scalar cell value appears in the filter's selected-values
// array. Used for single-value enum columns (status, priority, etc.) where
// the cell holds one string and the filter holds string[].

export const inEnumSetFilterFn: FilterFn<unknown> = (row, columnId, filterValue: string[]) => {
  const cellValue = row.getValue<string>(columnId)
  return filterValue.includes(cellValue)
}
inEnumSetFilterFn.autoRemove = (val: unknown) => !val || (val as string[]).length === 0

// ─── inDateRange ──────────────────────────────────────────────────────────────
// Filter value shape: [Date | null, Date | null] — from and to, both inclusive.
// The cell value may be a Date object or an ISO string.

export const inDateRangeFilterFn: FilterFn<unknown> = (
  row,
  columnId,
  filterValue: [Date | null, Date | null],
) => {
  const raw = row.getValue<Date | string | null>(columnId)
  if (raw == null) return false

  const date = raw instanceof Date ? raw : new Date(raw)
  if (Number.isNaN(date.getTime())) return false

  const [from, to] = filterValue

  if (from != null && date < from) return false

  if (to != null) {
    const end = new Date(to)
    end.setHours(23, 59, 59, 999)
    if (date > end) return false
  }

  return true
}
inDateRangeFilterFn.autoRemove = (val: unknown) => {
  const v = val as [Date | null, Date | null] | undefined
  return !v || (v[0] == null && v[1] == null)
}

// ─── inNumberRange ────────────────────────────────────────────────────────────
// Re-export the built-in TanStack filter function so it can be referenced
// via the registered key 'inNumberRange' in filterFns.

export const inNumberRangeFilterFn: FilterFn<unknown> = filterFns.inNumberRange as FilterFn<unknown>
