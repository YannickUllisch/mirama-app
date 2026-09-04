// src/modules/workspace/viewstate.hooks.ts
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
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

  // Optimistic by design: sidebar drags, column reorders and filter tweaks need to feel
  // instant. We apply the new state to the cache immediately and roll back only if the
  // server rejects it - no waiting on a round trip for the UI to reflect the change.
  saveViewState: {
    useMutation: (surfaceKey: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      const detailKey = viewStateKeys.detail(activeOrganizationId, surfaceKey)

      return useMutation<
        ViewStateResponse,
        Error,
        SaveViewStateVars,
        SaveViewStateContext
      >({
        mutationFn: ({ viewType, stateJson }) =>
          saveViewStateFn(activeOrganizationId, surfaceKey, {
            surfaceKey,
            viewType,
            stateJson,
          }),

        onMutate: async (vars) => {
          await queryClient.cancelQueries({ queryKey: detailKey })
          const previous =
            queryClient.getQueryData<ViewStateResponse | null>(detailKey)

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
              Array.isArray(query.queryKey) && query.queryKey[2] === 'batch',
          })
        },
      })
    },
  },
}

export default viewState
