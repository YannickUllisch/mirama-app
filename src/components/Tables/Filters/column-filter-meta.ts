import type { FilterFn, RowData } from '@tanstack/table-core'
import type React from 'react'

// ─── Filter metadata types ────────────────────────────────────────────────────

export type EnumFilterOption = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  color?: string
}

export type EnumFilterMeta = {
  type: 'enum'
  title: string
  options: EnumFilterOption[]
}

export type DateRangeFilterMeta = {
  type: 'dateRange'
  title: string
}

export type NumberRangeFilterMeta = {
  type: 'numberRange'
  title: string
  unit?: string
}

export type ColumnFilterMeta =
  | EnumFilterMeta
  | DateRangeFilterMeta
  | NumberRangeFilterMeta

// ─── TanStack Table module augmentation ───────────────────────────────────────
// Extends ColumnMeta so every ColumnDef can carry filter?: ColumnFilterMeta
// and extends FilterFns so custom filterFn string literals type-check.

declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filter?: ColumnFilterMeta
  }

  interface FilterFns {
    inEnumSet: FilterFn<RowData>
    inDateRange: FilterFn<RowData>
    // inNumberRange is already built-in but re-declaring ensures the string
    // literal is accepted when the base interface isn't in scope.
    inNumberRange: FilterFn<RowData>
  }
}
