import {
  createTaskFn,
  deleteTaskFn,
  deleteTasksFn,
  fetchPersonalTasksFn,
  fetchTaskById,
  fetchTasksByProjectFn,
  updateTaskFn,
} from '@hooks/api/task'
import type {
  CreateTaskType,
  DeleteTasksType,
  TaskResponseType,
  UpdateTaskType,
} from '@server/domain/taskSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type ListContext = {
  previousTasks?: TaskResponseType[]
  previousPersonalTasks?: TaskResponseType[]
  previousTask?: TaskResponseType | null
  affectedIds?: string[]
}

const task = {
  fetchById: {
    useQuery: (projectId: string, id: string) =>
      useQuery<TaskResponseType | null>({
        enabled: !!id,
        queryKey: ['task', id],
        queryFn: () => fetchTaskById(projectId, id),
      }),
  },

  fetchByProject: {
    useQuery: (projectId: string) =>
      useQuery<TaskResponseType[]>({
        queryKey: ['tasks', projectId],
        queryFn: () => fetchTasksByProjectFn(projectId),
      }),
  },

  fetchPersonal: {
    useQuery: (projectId?: string) =>
      useQuery<TaskResponseType[]>({
        queryKey: ['personalTasks', projectId ?? 'all'],
        queryFn: () => fetchPersonalTasksFn(projectId),
      }),
  },

  create: {
    useMutation: (projectId: string) => {
      const qc = useQueryClient()
      return useMutation<TaskResponseType, Error, CreateTaskType, ListContext>({
        mutationFn: (payload) => createTaskFn(projectId, payload),
        onMutate: async (newTask) => {
          await Promise.all([
            qc.cancelQueries({ queryKey: ['tasks', projectId] }),
            qc.cancelQueries({ queryKey: ['personalTasks', 'all'] }),
          ])

          const previousTasks = qc.getQueryData<TaskResponseType[]>([
            'tasks',
            projectId,
          ])
          const previousPersonal = qc.getQueryData<TaskResponseType[]>([
            'personalTasks',
            'all',
          ])

          // Optimistic add (temp id)
          const optimistic: TaskResponseType = {
            ...(newTask as any),
            id: `optimistic-${Date.now()}`,
            projectId,
          }
          if (previousTasks) {
            qc.setQueryData<TaskResponseType[]>(
              ['tasks', projectId],
              [optimistic, ...previousTasks],
            )
          }
          if (previousPersonal) {
            qc.setQueryData<TaskResponseType[]>(
              ['personalTasks', 'all'],
              [optimistic, ...previousPersonal],
            )
          }

          return {
            previousTasks,
            previousPersonalTasks: previousPersonal,
          }
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previousTasks) {
            qc.setQueryData(['tasks', projectId], ctx.previousTasks)
          }
          if (ctx?.previousPersonalTasks) {
            qc.setQueryData(['personalTasks', 'all'], ctx.previousPersonalTasks)
          }
          toast.error(err.message || 'Create task failed')
        },
        onSuccess: (created) => {
          qc.setQueryData<TaskResponseType[]>(
            ['tasks', projectId],
            (old = []) => {
              // replace optimistic
              const withoutOptimistic = old.filter(
                (t) => !t.id.startsWith('optimistic-'),
              )
              return [created, ...withoutOptimistic]
            },
          )
          qc.setQueryData<TaskResponseType[]>(
            ['personalTasks', 'all'],
            (old = []) => {
              const withoutOptimistic = old.filter(
                (t) => !t.id.startsWith('optimistic-'),
              )
              return [created, ...withoutOptimistic]
            },
          )
          qc.setQueryData(['task', created.id], created)
        },
        onSettled: () => {
          qc.invalidateQueries({ queryKey: ['tasks', projectId] })
          qc.invalidateQueries({ queryKey: ['personalTasks'] })
        },
      })
    },
  },

  update: {
    useMutation: (projectId: string, taskId: string) => {
      const qc = useQueryClient()
      return useMutation<TaskResponseType, Error, UpdateTaskType, ListContext>({
        mutationFn: (payload) => updateTaskFn(projectId, taskId, payload),
        onMutate: async (payload) => {
          await Promise.all([
            qc.cancelQueries({ queryKey: ['tasks', projectId] }),
            qc.cancelQueries({ queryKey: ['personalTasks', 'all'] }),
            qc.cancelQueries({ queryKey: ['task', taskId] }),
          ])

          const previousTasks = qc.getQueryData<TaskResponseType[]>([
            'tasks',
            projectId,
          ])
          const previousPersonal = qc.getQueryData<TaskResponseType[]>([
            'personalTasks',
            'all',
          ])
          const previousTask = qc.getQueryData<TaskResponseType | null>([
            'task',
            taskId,
          ])

          // TODO: Figure out how to optimistically update types to which we dont have all information in a update request
          const patch = (t: TaskResponseType) =>
            t.id === taskId
              ? { ...t, ...payload, subtasks: t.subtasks, tags: t.tags }
              : t

          if (previousTasks) {
            qc.setQueryData<TaskResponseType[]>(
              ['tasks', projectId],
              previousTasks.map(patch),
            )
          }
          if (previousPersonal) {
            qc.setQueryData<TaskResponseType[]>(
              ['personalTasks', 'all'],
              previousPersonal.map(patch),
            )
          }
          if (previousTask) {
            qc.setQueryData(['task', taskId], { ...previousTask, ...payload })
          }

          return {
            previousTasks,
            previousPersonalTasks: previousPersonal,
            previousTask,
          }
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previousTasks)
            qc.setQueryData(['tasks', projectId], ctx.previousTasks)
          if (ctx?.previousPersonalTasks)
            qc.setQueryData(['personalTasks', 'all'], ctx.previousPersonalTasks)
          if (ctx?.previousTask)
            qc.setQueryData(['task', taskId], ctx.previousTask)
          toast.error(err.message || 'Update task failed')
        },
        onSuccess: (updated) => {
          qc.setQueryData<TaskResponseType[]>(
            ['tasks', projectId],
            (old = []) => old.map((t) => (t.id === updated.id ? updated : t)),
          )
          qc.setQueryData<TaskResponseType[]>(
            ['personalTasks', 'all'],
            (old = []) => old.map((t) => (t.id === updated.id ? updated : t)),
          )
          qc.setQueryData(['task', updated.id], updated)
        },
        onSettled: () => {
          qc.invalidateQueries({ queryKey: ['tasks', projectId] })
          qc.invalidateQueries({ queryKey: ['personalTasks'] })
          qc.invalidateQueries({ queryKey: ['task', taskId] })
        },
      })
    },
  },

  delete: {
    useMutation: (projectId: string, taskId: string) => {
      const qc = useQueryClient()
      return useMutation<{ success: boolean } | any, Error, void, ListContext>({
        mutationFn: () => deleteTaskFn(projectId, taskId),
        onMutate: async () => {
          await Promise.all([
            qc.cancelQueries({ queryKey: ['tasks', projectId] }),
            qc.cancelQueries({ queryKey: ['personalTasks', 'all'] }),
            qc.cancelQueries({ queryKey: ['task', taskId] }),
          ])
          const previousTasks = qc.getQueryData<TaskResponseType[]>([
            'tasks',
            projectId,
          ])
          const previousPersonal = qc.getQueryData<TaskResponseType[]>([
            'personalTasks',
            'all',
          ])
          const previousTask = qc.getQueryData<TaskResponseType | null>([
            'task',
            taskId,
          ])

          if (previousTasks) {
            qc.setQueryData<TaskResponseType[]>(
              ['tasks', projectId],
              previousTasks.filter((t) => t.id !== taskId),
            )
          }
          if (previousPersonal) {
            qc.setQueryData<TaskResponseType[]>(
              ['personalTasks', 'all'],
              previousPersonal.filter((t) => t.id !== taskId),
            )
          }
          qc.removeQueries({ queryKey: ['task', taskId] })

          return {
            previousTasks,
            previousPersonalTasks: previousPersonal,
            previousTask,
            affectedIds: [taskId],
          }
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previousTasks)
            qc.setQueryData(['tasks', projectId], ctx.previousTasks)
          if (ctx?.previousPersonalTasks)
            qc.setQueryData(['personalTasks', 'all'], ctx.previousPersonalTasks)
          if (ctx?.previousTask)
            qc.setQueryData(['task', taskId], ctx.previousTask)
          toast.error(err.message || 'Delete failed')
        },
        onSettled: () => {
          qc.invalidateQueries({ queryKey: ['tasks', projectId] })
          qc.invalidateQueries({ queryKey: ['personalTasks'] })
        },
      })
    },
  },

  deleteMany: {
    useMutation: (projectId: string) => {
      const qc = useQueryClient()
      return useMutation<
        { success: boolean } | any,
        Error,
        DeleteTasksType,
        ListContext
      >({
        mutationFn: (payload) => deleteTasksFn(projectId, payload),
        onMutate: async (payload) => {
          await Promise.all([
            qc.cancelQueries({ queryKey: ['tasks', projectId] }),
            qc.cancelQueries({ queryKey: ['personalTasks', 'all'] }),
          ])
          const previousTasks = qc.getQueryData<TaskResponseType[]>([
            'tasks',
            projectId,
          ])
          const previousPersonal = qc.getQueryData<TaskResponseType[]>([
            'personalTasks',
            'all',
          ])

          if (previousTasks) {
            qc.setQueryData<TaskResponseType[]>(
              ['tasks', projectId],
              previousTasks.filter((t) => !payload.ids.includes(t.id)),
            )
          }
          if (previousPersonal) {
            qc.setQueryData<TaskResponseType[]>(
              ['personalTasks', 'all'],
              previousPersonal.filter((t) => !payload.ids.includes(t.id)),
            )
          }

          for (const id of payload.ids) {
            qc.removeQueries({ queryKey: ['task', id] })
          }

          return {
            previousTasks,
            previousPersonalTasks: previousPersonal,
            affectedIds: payload.ids,
          }
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previousTasks)
            qc.setQueryData(['tasks', projectId], ctx.previousTasks)
          if (ctx?.previousPersonalTasks)
            qc.setQueryData(['personalTasks', 'all'], ctx.previousPersonalTasks)
          toast.error(err.message || 'Delete tasks failed')
        },
        onSettled: () => {
          qc.invalidateQueries({ queryKey: ['tasks', projectId] })
          qc.invalidateQueries({ queryKey: ['personalTasks'] })
        },
      })
    },
  },
}

export default task
