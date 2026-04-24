// src/modules/project/task/hooks/hooks.ts
import type { CreateTaskRequest } from '@/server/modules/task/features/create-task/schema'
import type { DeleteTasksBulkRequest } from '@/server/modules/task/features/delete-task/schema'
import type { TaskResponse } from '@/server/modules/task/features/response'
import type { UpdateTaskRequest } from '@/server/modules/task/features/update-task/schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createTaskFn,
  deleteTaskFn,
  deleteTasksFn,
  fetchPersonalTasksFn,
  fetchTaskById,
  fetchTasksByProjectFn,
  updateTaskFn,
} from './api'

type ListContext = {
  previousTasks?: TaskResponse[]
  previousPersonalTasks?: TaskResponse[]
  previousTask?: TaskResponse | null
  affectedIds?: string[]
}

const task = {
  fetchById: {
    useQuery: (projectId: string, id: string) =>
      useQuery<TaskResponse | null>({
        enabled: !!id,
        queryKey: ['task', id],
        queryFn: () => fetchTaskById(projectId, id),
      }),
  },

  fetchByProject: {
    useQuery: (projectId: string) =>
      useQuery<TaskResponse[]>({
        queryKey: ['tasks', projectId],
        queryFn: () => fetchTasksByProjectFn(projectId),
      }),
  },

  fetchPersonal: {
    useQuery: (projectId?: string) =>
      useQuery<TaskResponse[]>({
        queryKey: ['personalTasks', projectId ?? 'all'],
        queryFn: () => fetchPersonalTasksFn(projectId),
      }),
  },

  create: {
    useMutation: () => {
      const qc = useQueryClient()
      return useMutation<
        TaskResponse,
        Error,
        { id: string; payload: CreateTaskRequest },
        ListContext
      >({
        mutationFn: ({ id, payload }) => createTaskFn(id, payload),
        onMutate: async ({ id, payload }) => {
          await Promise.all([
            qc.cancelQueries({ queryKey: ['tasks', id] }),
            qc.cancelQueries({ queryKey: ['personalTasks', 'all'] }),
          ])

          const previousTasks = qc.getQueryData<TaskResponse[]>(['tasks', id])
          const previousPersonal = qc.getQueryData<TaskResponse[]>([
            'personalTasks',
            'all',
          ])

          const optimistic: TaskResponse = {
            ...payload,
            taskCode: 'TMP',
            dateCreated: new Date(),
            updatedAt: new Date(),
            parent: null,
            assignedTo: null,
            projectName: '',
            comments: [],
            subtasks: [],
            tags: [],
            id: `optimistic-${Date.now()}`,
            projectId: id,
          }
          if (previousTasks) {
            qc.setQueryData<TaskResponse[]>(
              ['tasks', id],
              [optimistic, ...previousTasks],
            )
          }
          if (previousPersonal) {
            qc.setQueryData<TaskResponse[]>(
              ['personalTasks', 'all'],
              [optimistic, ...previousPersonal],
            )
          }

          return { previousTasks, previousPersonalTasks: previousPersonal }
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
          qc.setQueryData<TaskResponse[]>(['tasks', vars.id], (old = []) => {
            const withoutOptimistic = old.filter(
              (t) => !t.id.startsWith('optimistic-'),
            )
            return [created, ...withoutOptimistic]
          })
          qc.setQueryData<TaskResponse[]>(
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
        TaskResponse,
        Error,
        { projectId: string; id: string; data: UpdateTaskRequest },
        ListContext
      >({
        mutationFn: ({ projectId, id, data }) =>
          updateTaskFn(projectId, id, data),
        onMutate: async ({ projectId, id, data }) => {
          await Promise.all([
            qc.cancelQueries({ queryKey: ['tasks', projectId] }),
            qc.cancelQueries({ queryKey: ['personalTasks', 'all'] }),
            qc.cancelQueries({ queryKey: ['task', id] }),
          ])

          const previousTasks = qc.getQueryData<TaskResponse[]>([
            'tasks',
            projectId,
          ])
          const previousPersonal = qc.getQueryData<TaskResponse[]>([
            'personalTasks',
            'all',
          ])
          const previousTask = qc.getQueryData<TaskResponse | null>([
            'task',
            id,
          ])

          const patch = (t: TaskResponse) =>
            t.id === id
              ? { ...t, ...data, subtasks: t.subtasks, tags: t.tags }
              : t

          if (previousTasks) {
            qc.setQueryData<TaskResponse[]>(
              ['tasks', projectId],
              previousTasks.map(patch),
            )
          }
          if (previousPersonal) {
            qc.setQueryData<TaskResponse[]>(
              ['personalTasks', 'all'],
              previousPersonal.map(patch),
            )
          }
          if (previousTask) {
            qc.setQueryData(['task', id], { ...previousTask, ...data })
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
        onSuccess: (updated) => {
          qc.setQueryData<TaskResponse[]>(
            ['tasks', updated.projectId],
            (old = []) => old.map((t) => (t.id === updated.id ? updated : t)),
          )
          qc.setQueryData<TaskResponse[]>(
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
        { success: boolean },
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
          const previousTasks = qc.getQueryData<TaskResponse[]>(['tasks', pid])
          const previousPersonal = qc.getQueryData<TaskResponse[]>([
            'personalTasks',
            'all',
          ])
          const previousTask = qc.getQueryData<TaskResponse | null>([
            'task',
            id,
          ])

          if (previousTasks) {
            qc.setQueryData<TaskResponse[]>(
              ['tasks', pid],
              previousTasks.filter((t) => t.id !== id),
            )
          }
          if (previousPersonal) {
            qc.setQueryData<TaskResponse[]>(
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
        { success: boolean },
        Error,
        { projectId: string; payload: DeleteTasksBulkRequest },
        ListContext
      >({
        mutationFn: ({ projectId, payload }) =>
          deleteTasksFn(projectId, payload),
        onMutate: async ({ projectId, payload }) => {
          await Promise.all([
            qc.cancelQueries({ queryKey: ['tasks', projectId] }),
            qc.cancelQueries({ queryKey: ['personalTasks', 'all'] }),
          ])
          const previousTasks = qc.getQueryData<TaskResponse[]>([
            'tasks',
            projectId,
          ])
          const previousPersonal = qc.getQueryData<TaskResponse[]>([
            'personalTasks',
            'all',
          ])

          if (previousTasks) {
            qc.setQueryData<TaskResponse[]>(
              ['tasks', projectId],
              previousTasks.filter((t) => !payload.ids.includes(t.id)),
            )
          }
          if (previousPersonal) {
            qc.setQueryData<TaskResponse[]>(
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
