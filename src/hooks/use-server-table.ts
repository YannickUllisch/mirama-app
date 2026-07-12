// src/hooks/use-server-table.ts
'use client'

import { useDataTable } from '@src/hooks/use-data-table'
import { getFiltersStateParser, getSortingStateParser } from '@src/lib/parsers'
import type { PaginatedResponse } from '@src/modules/api.types'
import { api } from '@src/modules/shared/api'
import type { QueryKeys, TableApiParams } from '@src/types/data-table'
import {
  keepPreviousData,
  type UseQueryOptions,
  useQuery,
} from '@tanstack/react-query'
import type { ColumnDef, TableOptions } from '@tanstack/react-table'
import { parseAsInteger, parseAsStringEnum, useQueryState } from 'nuqs'
import * as React from 'react'

interface UseServerTableOptions<TData> {
  apiPath?: string
  queryKey: readonly unknown[]
  columns: ColumnDef<TData>[]
  fetchFn?: (params: TableApiParams<TData>) => Promise<PaginatedResponse<TData>>
  queryKeys?: Partial<QueryKeys>
  enableAdvancedFilter?: boolean
  enableRowSelection?: TableOptions<TData>['enableRowSelection']
  initialColumnPinning?: { left?: string[]; right?: string[] }
  initialPageSize?: number
  queryOptions?: Omit<
    UseQueryOptions<PaginatedResponse<TData>>,
    'queryKey' | 'queryFn'
  >
}

export function useServerTable<TData>({
  apiPath,
  queryKey,
  columns,
  fetchFn,
  queryKeys,
  enableAdvancedFilter = false,
  enableRowSelection,
  initialColumnPinning,
  initialPageSize = 10,
  queryOptions,
}: UseServerTableOptions<TData>) {
  const pageKey = queryKeys?.page ?? 'page'
  const perPageKey = queryKeys?.perPage ?? 'perPage'
  const sortKey = queryKeys?.sort ?? 'sort'
  const filtersKey = queryKeys?.filters ?? 'filters'
  const joinOperatorKey = queryKeys?.joinOperator ?? 'joinOperator'

  const columnIds = React.useMemo(
    () => new Set(columns.map((c) => c.id).filter(Boolean) as string[]),
    [columns],
  )

  const [page] = useQueryState(pageKey, parseAsInteger.withDefault(1))
  const [perPage] = useQueryState(
    perPageKey,
    parseAsInteger.withDefault(initialPageSize),
  )
  const [sort] = useQueryState(
    sortKey,
    getSortingStateParser<TData>(columnIds).withDefault([]),
  )
  const [filters] = useQueryState(
    filtersKey,
    getFiltersStateParser<TData>(Array.from(columnIds)).withDefault([]),
  )
  const [joinOperator] = useQueryState(
    joinOperatorKey,
    parseAsStringEnum(['and', 'or'] as const).withDefault('and'),
  )

  const apiParams = React.useMemo<TableApiParams<TData>>(
    () => ({
      page,
      pageSize: perPage,
      sort,
      filters,
      joinOperator,
    }),
    [page, perPage, sort, filters, joinOperator],
  )

  const query = useQuery<PaginatedResponse<TData>>({
    queryKey: [...queryKey, apiParams],
    queryFn: async () => {
      if (fetchFn) {
        return fetchFn(apiParams)
      }

      if (!apiPath)
        throw new Error('apiPath required when fetchFn not provided')

      const params: Record<string, string | number> = {
        page: apiParams.page,
        pageSize: apiParams.pageSize,
      }
      if (apiParams.sort.length) params.sort = JSON.stringify(apiParams.sort)
      if (apiParams.filters.length)
        params.filters = JSON.stringify(apiParams.filters)
      if (apiParams.joinOperator !== 'and')
        params.joinOperator = apiParams.joinOperator

      const { data } = await api.get<PaginatedResponse<TData>>(apiPath, {
        params,
      })
      return data
    },
    placeholderData: keepPreviousData,
    ...queryOptions,
  })

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data: query.data?.items ?? ([] as TData[]),
    columns,
    pageCount: query.data?.totalPages ?? 0,
    enableAdvancedFilter,
    enableRowSelection,
    queryKeys: {
      page: pageKey,
      perPage: perPageKey,
      sort: sortKey,
      filters: filtersKey,
      joinOperator: joinOperatorKey,
    },
    initialState: {
      pagination: { pageSize: initialPageSize, pageIndex: 0 },
      ...(initialColumnPinning && { columnPinning: initialColumnPinning }),
    },
  })

  return { table, query, shallow, debounceMs, throttleMs, apiParams }
}
