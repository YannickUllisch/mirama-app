import type { CreateTagRequest } from '@/server/modules/account/tags/features/create-tag/schema'
import type { TagResponse } from '@/server/modules/account/tags/features/response'
import type { UpdateTagRequest } from '@/server/modules/account/tags/features/update-tag/schema'
import {
  createTagFn,
  deleteTagFn,
  fetchTagsFn,
  updateTagFn,
} from '@hooks/api/tag'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const tag = {
  fetchAll: {
    useQuery: () =>
      useQuery<TagResponse[]>({
        queryKey: ['tags'],
        queryFn: fetchTagsFn,
      }),
  },

  create: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        TagResponse,
        Error,
        CreateTagRequest,
        { previous?: TagResponse[] }
      >({
        mutationFn: createTagFn,
        onMutate: async (newTag) => {
          await queryClient.cancelQueries({ queryKey: ['tags'] })
          const previous = queryClient.getQueryData<TagResponse[]>(['tags'])

          // Optimistically add the new tag (with a temp id if needed)
          queryClient.setQueryData<TagResponse[]>(['tags'], (old = []) => [
            ...old,
            { title: newTag.title ?? '', id: `temp-${Math.random()}` },
          ])

          return { previous }
        },
        onSuccess: (data, _vars) => {
          queryClient.setQueryData<TagResponse[]>(
            ['invitation'],
            (old = []) => [...old, data],
          )
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['tags'], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['tags'] })
        },
      })
    },
  },

  update: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        TagResponse,
        Error,
        { id: string; data: UpdateTagRequest },
        { previous?: TagResponse[] }
      >({
        mutationFn: ({ id, data }) => updateTagFn(id, data),
        onMutate: async ({ id, data }) => {
          await queryClient.cancelQueries({ queryKey: ['tags'] })
          const previous = queryClient.getQueryData<TagResponse[]>(['tags'])

          // Optimistically update the tag in the cache
          queryClient.setQueryData<TagResponse[]>(['tags'], (old = []) =>
            old.map((tag) => (tag.id === id ? { ...tag, ...data } : tag)),
          )

          return { previous }
        },
        onSuccess: (data, _vars) => {
          queryClient.setQueryData<TagResponse[]>(['tags'], (old = []) =>
            old.map((p) => (p.id === data.id ? data : p)),
          )
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['tags'], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['tags'] })
        },
      })
    },
  },

  delete: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        { success: boolean },
        Error,
        string,
        { previous?: TagResponse[] }
      >({
        mutationFn: deleteTagFn,
        onMutate: async (id) => {
          await queryClient.cancelQueries({ queryKey: ['tags'] })
          const previous = queryClient.getQueryData<TagResponse[]>(['tags'])

          // Optimistically remove the tag from the cache
          queryClient.setQueryData<TagResponse[]>(['tags'], (old = []) =>
            old.filter((tag) => tag.id !== id),
          )

          return { previous }
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['tags'], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['tags'] })
        },
      })
    },
  },
}

export default tag
