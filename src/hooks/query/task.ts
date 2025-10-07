import {
  createTaskFn,
  fetchPersonalTasksFn,
  fetchTaskById,
  fetchTasksByProjectFn,
} from '@hooks/api/task'
import type { TaskResponseType } from '@server/domain/taskSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const task = {
  fetchById: {
    useQuery: (id: string) =>
      useQuery<TaskResponseType | null>({
        enabled: !!id,
        queryKey: ['task', id],
        queryFn: () => fetchTaskById(id),
      }),
  },

  fetchByProject: {
    useQuery: (id: string) =>
      useQuery<TaskResponseType[]>({
        queryKey: ['tasks'],
        queryFn: () => fetchTasksByProjectFn(id),
      }),
  },

  fetchPersonal: {
    useQuery: (id?: string) =>
      useQuery<TaskResponseType[]>({
        queryKey: ['tasks'],
        queryFn: () => fetchPersonalTasksFn(id),
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

export default task
