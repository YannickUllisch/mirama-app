import {
  createTagFn,
  deleteTagFn,
  fetchTagsFn,
  updateTagFn,
} from '@hooks/api/tag'
import type { ProjectResponseInput } from '@server/domain/projectSchema'
import type { TagResponseType, UpdateTagType } from '@server/domain/tagSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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
      return useMutation({
        mutationFn: createTagFn,
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
        ProjectResponseInput,
        Error,
        { id: string; data: UpdateTagType }
      >({
        mutationFn: ({ id, data }) => updateTagFn(id, data),
        onSettled: (_data, _error) => {
          queryClient.invalidateQueries({ queryKey: ['tags'] })
        },
      })
    },
  },

  delete: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<{ success: boolean }, Error, string>({
        mutationFn: deleteTagFn,
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['tags'] })
        },
      })
    },
  },
}

export default tag
