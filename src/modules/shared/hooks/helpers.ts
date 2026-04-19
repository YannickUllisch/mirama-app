// src/modules/shared/hooks/helpers.ts
import type { QueryClient, QueryKey } from '@tanstack/react-query'
import { toast } from 'sonner'

type OptimisticListContext<T> = { previous?: T[] }

/**
 * Creates standard optimistic mutation callbacks for a list query:
 * cancel, snapshot, (optional apply), rollback on error, invalidate on settle.
 *
 * `queryKey`      — the specific list cache to snapshot & roll back.
 * `invalidateKey` — a broader prefix to invalidate on settle (e.g. the entity
 *                   root key so both list + detail caches are refreshed).
 *                   Falls back to `queryKey` when omitted.
 *
 * Usage:
 *   ...optimisticList(queryClient, queryKey, {
 *     invalidateKey: organizationKeys.tenant(tenantId),
 *     successMessage: 'Created!',
 *     apply: (old, vars) => [...old, vars],
 *   })
 */
export function optimisticList<TData, TVars>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  opts: {
    invalidateKey?: QueryKey
    successMessage: string
    apply?: (old: TData[], vars: TVars) => TData[]
  },
) {
  const invalidateKey = opts.invalidateKey ?? queryKey

  return {
    onMutate: async (vars: TVars): Promise<OptimisticListContext<TData>> => {
      await queryClient.cancelQueries({ queryKey: invalidateKey })
      const previous = queryClient.getQueryData<TData[]>(queryKey)

      if (opts.apply && previous) {
        const applyFn = opts.apply
        queryClient.setQueryData<TData[]>(queryKey, (old = []) =>
          applyFn(old, vars),
        )
      }

      return { previous }
    },
    onSuccess: () => {
      toast.success(opts.successMessage)
    },
    onError: (
      err: Error,
      _vars: TVars,
      ctx: OptimisticListContext<TData> | undefined,
    ) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKey, ctx.previous)
      }
      toast.error(err?.message || 'An error occurred')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: invalidateKey })
    },
  }
}
