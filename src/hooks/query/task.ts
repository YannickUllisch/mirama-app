import { fetchProjectByIdFn } from '@hooks/api/project'
import { createTaskFn, fetchTaskById } from '@hooks/api/task'
import type { TaskResponseType } from '@server/domain/taskSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const project = {
  fetchById: {
    useQuery: (id: string) =>
      useQuery<TaskResponseType | null>({
        enabled: !!id,
        queryKey: ['task', id],
        queryFn: () => fetchProjectByIdFn(id),
      }),
  },

  fetchByProject: {
    useQuery: (id: string) =>
      useQuery<TaskResponseType[]>({
        queryKey: ['tasks'],
        queryFn: () => fetchTaskById(id),
      }),
  },

  create: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: createTaskFn,
        onMutate: async (_newTask) => {
          await queryClient.cancelQueries({ queryKey: ['tasks'] })

          const previous = queryClient.getQueryData<TaskResponseType[]>([
            'tasks',
          ])

          return { previous }
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['tasks'], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
      })
    },
  },
}

export default project
