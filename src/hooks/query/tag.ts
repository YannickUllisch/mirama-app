import {
  createTagFn,
  deleteTagFn,
  fetchTagsFn,
  updateTagFn,
} from '@hooks/api/tag'
import type {
  CreateTagType,
  TagResponseType,
  UpdateTagType,
} from '@server/domain/tagSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const tag = {
  fetchAll: {
    useQuery: () =>
      useQuery<TagResponseType[]>({
        queryKey: ['tags'],
        queryFn: fetchTagsFn,
      }),
  },

  create: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        TagResponseType,
        Error,
        CreateTagType,
        { previous?: TagResponseType[] }
      >({
        mutationFn: createTagFn,
        onMutate: async (newTag) => {
          await queryClient.cancelQueries({ queryKey: ['tags'] })
          const previous = queryClient.getQueryData<TagResponseType[]>(['tags'])

          // Optimistically add the new tag (with a temp id if needed)
          queryClient.setQueryData<TagResponseType[]>(['tags'], (old = []) => [
            ...old,
            { title: newTag.title ?? '', id: `temp-${Math.random()}` },
          ])

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

  update: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        TagResponseType,
        Error,
        { id: string; data: UpdateTagType },
        { previous?: TagResponseType[] }
      >({
        mutationFn: ({ id, data }) => updateTagFn(id, data),
        onMutate: async ({ id, data }) => {
          await queryClient.cancelQueries({ queryKey: ['tags'] })
          const previous = queryClient.getQueryData<TagResponseType[]>(['tags'])

          // Optimistically update the tag in the cache
          queryClient.setQueryData<TagResponseType[]>(['tags'], (old = []) =>
            old.map((tag) => (tag.id === id ? { ...tag, ...data } : tag)),
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

  delete: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        { success: boolean },
        Error,
        string,
        { previous?: TagResponseType[] }
      >({
        mutationFn: deleteTagFn,
        onMutate: async (id) => {
          await queryClient.cancelQueries({ queryKey: ['tags'] })
          const previous = queryClient.getQueryData<TagResponseType[]>(['tags'])

          // Optimistically remove the tag from the cache
          queryClient.setQueryData<TagResponseType[]>(['tags'], (old = []) =>
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
