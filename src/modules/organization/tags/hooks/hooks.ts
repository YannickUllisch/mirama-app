// src/modules/organization/tags/hooks/hooks.ts
import type { CreateTagRequest } from '@/server/modules/account/tags/features/create-tag/schema'
import type { TagResponse } from '@/server/modules/account/tags/features/response'
import type { UpdateTagRequest } from '@/server/modules/account/tags/features/update-tag/schema'
import { optimisticList } from '@src/modules/shared/hooks/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTagFn, deleteTagFn, fetchTagsFn, updateTagFn } from './api'

export const tagKeys = {
  root: ['tags'] as const,
  list: () => [...tagKeys.root, 'list'] as const,
}

const tag = {
  fetchAll: {
    useQuery: () =>
      useQuery<TagResponse[]>({
        queryKey: tagKeys.root,
        queryFn: fetchTagsFn,
      }),
  },

  create: {
    useMutation: () => {
      const qc = useQueryClient()
      return useMutation<
        TagResponse,
        Error,
        CreateTagRequest,
        { previous?: TagResponse[] }
      >({
        mutationFn: createTagFn,
        ...optimisticList<TagResponse, CreateTagRequest>(qc, tagKeys.root, {
          successMessage: 'Tag created',
          apply: (old, vars) => [
            ...old,
            { id: `temp-${Date.now()}`, title: vars.title ?? '' },
          ],
        }),
      })
    },
  },

  update: {
    useMutation: () => {
      const qc = useQueryClient()
      type Vars = { id: string; data: UpdateTagRequest }
      return useMutation<
        TagResponse,
        Error,
        Vars,
        { previous?: TagResponse[] }
      >({
        mutationFn: ({ id, data }) => updateTagFn(id, data),
        ...optimisticList<TagResponse, Vars>(qc, tagKeys.root, {
          successMessage: 'Tag updated',
          apply: (old, { id, data }) =>
            old.map((t) => (t.id === id ? { ...t, ...data } : t)),
        }),
      })
    },
  },

  delete: {
    useMutation: () => {
      const qc = useQueryClient()
      return useMutation<
        { success: boolean },
        Error,
        string,
        { previous?: TagResponse[] }
      >({
        mutationFn: deleteTagFn,
        ...optimisticList<TagResponse, string>(qc, tagKeys.root, {
          successMessage: 'Tag deleted',
          apply: (old, id) => old.filter((t) => t.id !== id),
        }),
      })
    },
  },
}

export default tag
