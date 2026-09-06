import { useDebouncedMutation } from '@src/hooks/use-debounced-mutation'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { SidebarBootstrapResponse } from './sidebar'
import {
  fetchSidebarBootstrapFn,
  fetchViewStateFn,
  fetchViewStatesFn,
  saveViewStateFn,
} from './viewstate.api'
import type { ViewStateResponse, ViewType } from './viewstate.types'

export const viewStateKeys = {
  root: (orgId: string) => ['view-state', orgId] as const,
  detail: (orgId: string, surfaceKey: string) =>
    [...viewStateKeys.root(orgId), surfaceKey] as const,
  batch: (orgId: string, surfaceKeys: string[]) =>
    [
      ...viewStateKeys.root(orgId),
      'batch',
      [...surfaceKeys].sort().join(','),
    ] as const,
  sidebarBootstrap: (orgId: string) =>
    [...viewStateKeys.root(orgId), 'sidebar-bootstrap'] as const,
}

type SaveViewStateVars = { viewType: ViewType; stateJson: string }
type SaveViewStateContext = { previous?: ViewStateResponse | null }

const viewState = {
  fetchViewState: {
    useQuery: (surfaceKey: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<ViewStateResponse | null>({
        queryKey: viewStateKeys.detail(activeOrganizationId, surfaceKey),
        queryFn: () => fetchViewStateFn(activeOrganizationId, surfaceKey),
        enabled: !!activeOrganizationId && !!surfaceKey,
      })
    },
  },

  // Batch bootstrap lookup - fetch every surface the shell needs for first paint in one
  // round trip instead of one request per widget.
  fetchViewStates: {
    useQuery: (surfaceKeys: string[]) => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<ViewStateResponse[]>({
        queryKey: viewStateKeys.batch(activeOrganizationId, surfaceKeys),
        queryFn: () => fetchViewStatesFn(activeOrganizationId, surfaceKeys),
        enabled: !!activeOrganizationId && surfaceKeys.length > 0,
      })
    },
  },

  // Sidebar-specific composed bootstrap: personalization state + the live client list,
  // in one round trip. Prefer this over fetchViewState('sidebar') when rendering the
  // sidebar itself - see viewstate.server.ts for the SSR equivalent.
  fetchSidebarBootstrap: {
    useQuery: () => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<SidebarBootstrapResponse>({
        queryKey: viewStateKeys.sidebarBootstrap(activeOrganizationId),
        queryFn: () => fetchSidebarBootstrapFn(activeOrganizationId),
        enabled: !!activeOrganizationId,
        // Personalization data we already hydrate from the server and update
        // optimistically on save - no need to treat it as short-lived/pollable.
        staleTime: 5 * 60 * 1000,
      })
    },
  },

  // Optimistic by design: sidebar drags, column reorders and filter tweaks need to feel
  // instant. We apply the new state to the cache immediately and roll back only if the
  // server rejects it - no waiting on a round trip for the UI to reflect the change.
  saveViewState: {
    useMutation: (surfaceKey: string, options?: { debounceMs?: number }) => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      const detailKey = viewStateKeys.detail(activeOrganizationId, surfaceKey)

      return useDebouncedMutation<
        ViewStateResponse,
        Error,
        SaveViewStateVars,
        SaveViewStateContext
      >({
        debounceMs: options?.debounceMs,
        mutationFn: ({ viewType, stateJson }) =>
          saveViewStateFn(activeOrganizationId, surfaceKey, {
            surfaceKey,
            viewType,
            stateJson,
          }),

        onMutate: async (vars) => {
          await queryClient.cancelQueries({ queryKey: detailKey })
          const previous = queryClient.getQueryData<ViewStateResponse | null>(
            detailKey,
          )

          queryClient.setQueryData<ViewStateResponse | null>(
            detailKey,
            (old) => ({
              id: old?.id ?? `temp-${surfaceKey}`,
              surfaceKey,
              viewType: vars.viewType,
              stateJson: vars.stateJson,
              lastModified: new Date(),
            }),
          )

          return { previous }
        },

        onError: (err, _vars, ctx) => {
          if (ctx && 'previous' in ctx) {
            queryClient.setQueryData(detailKey, ctx.previous)
          }
          toast.error(err?.message || 'Failed to save view state')
        },

        onSuccess: (data) => {
          queryClient.setQueryData(detailKey, data)
        },

        onSettled: () => {
          // Batch/bootstrap caches aren't on the interactive path, so a plain
          // invalidate (rather than an in-place merge) is fine here.
          queryClient.invalidateQueries({
            queryKey: viewStateKeys.root(activeOrganizationId),
            predicate: (query) =>
              Array.isArray(query.queryKey) &&
              (query.queryKey[2] === 'batch' ||
                query.queryKey[2] === 'sidebar-bootstrap'),
          })
        },
      })
    },
  },
}

export default viewState
