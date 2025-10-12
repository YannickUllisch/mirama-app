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
    useMutation: () => {
      const qc = useQueryClient()
      return useMutation<
        TaskResponseType,
        Error,
        { id: string; payload: CreateTaskType },
        ListContext
      >({
        mutationFn: ({ id, payload }) => createTaskFn(id, payload),
        onMutate: async ({ id, payload }) => {
          await Promise.all([
            qc.cancelQueries({ queryKey: ['tasks', id] }),
            qc.cancelQueries({ queryKey: ['personalTasks', 'all'] }),
          ])

          const previousTasks = qc.getQueryData<TaskResponseType[]>([
            'tasks',
            id,
          ])
          const previousPersonal = qc.getQueryData<TaskResponseType[]>([
            'personalTasks',
            'all',
          ])

          // Optimistic add (temp id)
          const optimistic: TaskResponseType = {
            ...(payload as any),
            id: `optimistic-${Date.now()}`,
            projectId: id,
          }
          if (previousTasks) {
            qc.setQueryData<TaskResponseType[]>(
              ['tasks', id],
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

        onError: (err, vars, ctx) => {
          if (ctx?.previousTasks) {
            qc.setQueryData(['tasks', vars.id], ctx.previousTasks)
          }
          if (ctx?.previousPersonalTasks) {
            qc.setQueryData(['personalTasks', 'all'], ctx.previousPersonalTasks)
          }
          toast.error(err.message || 'Create task failed')
        },
        onSuccess: (created, vars) => {
          qc.setQueryData<TaskResponseType[]>(
            ['tasks', vars.id],
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
        onSettled: (_data, _err, vars) => {
          qc.invalidateQueries({ queryKey: ['tags'] })
          qc.invalidateQueries({ queryKey: ['tasks', vars.id] })
          qc.invalidateQueries({ queryKey: ['personalTasks'] })
        },
      })
    },
  },

  update: {
    useMutation: () => {
      const qc = useQueryClient()
      return useMutation<
        TaskResponseType,
        Error,
        { id: string; projectId: string; payload: UpdateTaskType },
        ListContext
      >({
        mutationFn: ({ id, projectId, payload }) =>
          updateTaskFn(projectId, id, payload),
        onMutate: async ({ id, projectId, payload }) => {
          await Promise.all([
            qc.cancelQueries({ queryKey: ['tasks', projectId] }),
            qc.cancelQueries({ queryKey: ['personalTasks', 'all'] }),
            qc.cancelQueries({ queryKey: ['task', id] }),
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
            id,
          ])

          // TODO: Figure out how to optimistically update types to which we dont have all information in a update request
          const patch = (t: TaskResponseType) =>
            t.id === id
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
            qc.setQueryData(['task', id], { ...previousTask, ...payload })
          }

          return {
            previousTasks,
            previousPersonalTasks: previousPersonal,
            previousTask,
          }
        },
        onError: (err, vars, ctx) => {
          if (ctx?.previousTasks)
            qc.setQueryData(['tasks', vars.projectId], ctx.previousTasks)
          if (ctx?.previousPersonalTasks)
            qc.setQueryData(['personalTasks', 'all'], ctx.previousPersonalTasks)
          if (ctx?.previousTask)
            qc.setQueryData(['task', vars.id], ctx.previousTask)
          toast.error(err.message || 'Update task failed')
        },
        onSuccess: (updated, vars) => {
          qc.setQueryData<TaskResponseType[]>(
            ['tasks', vars.projectId],
            (old = []) => old.map((t) => (t.id === updated.id ? updated : t)),
          )
          qc.setQueryData<TaskResponseType[]>(
            ['personalTasks', 'all'],
            (old = []) => old.map((t) => (t.id === updated.id ? updated : t)),
          )
          qc.setQueryData(['task', updated.id], updated)
        },
        onSettled: (_data, _err, vars) => {
          qc.invalidateQueries({ queryKey: ['tags'] })
          qc.invalidateQueries({ queryKey: ['tasks', vars.projectId] })
          qc.invalidateQueries({ queryKey: ['personalTasks'] })
          qc.invalidateQueries({ queryKey: ['task', vars.id] })
        },
      })
    },
  },

  delete: {
    useMutation: () => {
      const qc = useQueryClient()
      return useMutation<
        { success: boolean } | any,
        Error,
        { id: string; pid: string },
        ListContext
      >({
        mutationFn: ({ id, pid }) => deleteTaskFn(pid, id),
        onMutate: async ({ id, pid }) => {
          await Promise.all([
            qc.cancelQueries({ queryKey: ['tasks', pid] }),
            qc.cancelQueries({ queryKey: ['personalTasks', 'all'] }),
            qc.cancelQueries({ queryKey: ['task', id] }),
          ])
          const previousTasks = qc.getQueryData<TaskResponseType[]>([
            'tasks',
            pid,
          ])
          const previousPersonal = qc.getQueryData<TaskResponseType[]>([
            'personalTasks',
            'all',
          ])
          const previousTask = qc.getQueryData<TaskResponseType | null>([
            'task',
            id,
          ])

          if (previousTasks) {
            qc.setQueryData<TaskResponseType[]>(
              ['tasks', pid],
              previousTasks.filter((t) => t.id !== id),
            )
          }
          if (previousPersonal) {
            qc.setQueryData<TaskResponseType[]>(
              ['personalTasks', 'all'],
              previousPersonal.filter((t) => t.id !== id),
            )
          }
          qc.removeQueries({ queryKey: ['task', id] })

          return {
            previousTasks,
            previousPersonalTasks: previousPersonal,
            previousTask,
            affectedIds: [id],
          }
        },
        onError: (err, vars, ctx) => {
          if (ctx?.previousTasks)
            qc.setQueryData(['tasks', vars.pid], ctx.previousTasks)
          if (ctx?.previousPersonalTasks)
            qc.setQueryData(['personalTasks', 'all'], ctx.previousPersonalTasks)
          if (ctx?.previousTask)
            qc.setQueryData(['task', vars.id], ctx.previousTask)
          toast.error(err.message || 'Delete failed')
        },
        onSettled: (_data, _err, vars) => {
          qc.invalidateQueries({ queryKey: ['tasks', vars.pid] })
          qc.invalidateQueries({ queryKey: ['personalTasks'] })
        },
      })
    },
  },

  deleteMany: {
    useMutation: () => {
      const qc = useQueryClient()
      return useMutation<
        { success: boolean } | any,
        Error,
        { projectId: string; payload: DeleteTasksType },
        ListContext
      >({
        mutationFn: ({ projectId, payload }) =>
          deleteTasksFn(projectId, payload),
        onMutate: async ({ projectId, payload }) => {
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
        onError: (err, vars, ctx) => {
          if (ctx?.previousTasks)
            qc.setQueryData(['tasks', vars.projectId], ctx.previousTasks)
          if (ctx?.previousPersonalTasks)
            qc.setQueryData(['personalTasks', 'all'], ctx.previousPersonalTasks)
          toast.error(err.message || 'Delete tasks failed')
        },
        onSettled: (_data, _err, vars) => {
          qc.invalidateQueries({ queryKey: ['tasks', vars.projectId] })
          qc.invalidateQueries({ queryKey: ['personalTasks'] })
        },
      })
    },
  },
}

export default task
