// src/modules/organization/tags/hooks/hooks.ts
import type { CreateTagRequest } from '@/server/modules/account/tags/features/create-tag/schema'
import type { TagResponse } from '@/server/modules/account/tags/features/response'
import type { UpdateTagRequest } from '@/server/modules/account/tags/features/update-tag/schema'
import { useOrganizationResource } from '@src/modules/organization/organizationResourceContext'
import { optimisticList } from '@src/modules/shared/hooks/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTagFn, deleteTagFn, fetchTagsFn, updateTagFn } from './api'

export const tagKeys = {
  root: ['tags'] as const,
  org: (orgId: string) => [...tagKeys.root, orgId] as const,
  list: (orgId: string) => [...tagKeys.org(orgId), 'list'] as const,
}

const tag = {
  fetchAll: {
    useQuery: () => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<TagResponse[]>({
        queryKey: tagKeys.list(activeOrganizationId),
        queryFn: () => fetchTagsFn(activeOrganizationId),
        enabled: !!activeOrganizationId,
      })
    },
  },

  create: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const qc = useQueryClient()
      return useMutation<
        TagResponse,
        Error,
        CreateTagRequest,
        { previous?: TagResponse[] }
      >({
        mutationFn: (payload) => createTagFn(activeOrganizationId, payload),
        ...optimisticList<TagResponse, CreateTagRequest>(
          qc,
          tagKeys.list(activeOrganizationId),
          {
            invalidateKey: tagKeys.org(activeOrganizationId),
            successMessage: 'Tag created',
            apply: (old, vars) => [
              ...old,
              { id: `temp-${Date.now()}`, title: vars.title ?? '' },
            ],
          },
        ),
      })
    },
  },

  update: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const qc = useQueryClient()
      type Vars = { id: string; data: UpdateTagRequest }
      return useMutation<
        TagResponse,
        Error,
        Vars,
        { previous?: TagResponse[] }
      >({
        mutationFn: ({ id, data }) =>
          updateTagFn(activeOrganizationId, id, data),
        ...optimisticList<TagResponse, Vars>(
          qc,
          tagKeys.list(activeOrganizationId),
          {
            invalidateKey: tagKeys.org(activeOrganizationId),
            successMessage: 'Tag updated',
            apply: (old, { id, data }) =>
              old.map((t) => (t.id === id ? { ...t, ...data } : t)),
          },
        ),
      })
    },
  },

  delete: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const qc = useQueryClient()
      return useMutation<
        { success: boolean },
        Error,
        string,
        { previous?: TagResponse[] }
      >({
        mutationFn: (id) => deleteTagFn(activeOrganizationId, id),
        ...optimisticList<TagResponse, string>(
          qc,
          tagKeys.list(activeOrganizationId),
          {
            invalidateKey: tagKeys.org(activeOrganizationId),
            successMessage: 'Tag deleted',
            apply: (old, id) => old.filter((t) => t.id !== id),
          },
        ),
      })
    },
  },
}

export default tag
