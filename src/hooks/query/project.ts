import {
  archiveProjectFn,
  createProjectFn,
  deleteProjectFn,
  fetchArchivedProjectsFn,
  fetchProjectAssigneesFn,
  fetchProjectByIdFn,
  fetchProjectsFn,
  updateProjectFn,
} from '@hooks/api/project'
import type {
  ProjectResponseInput,
  UpdateProjectInput,
} from '@server/domain/projectSchema'
import type { UserProjectResponseType } from '@server/domain/userSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const project = {
  fetchAll: {
    useQuery: () =>
      useQuery<ProjectResponseInput[]>({
        queryKey: ['projects'],
        queryFn: fetchProjectsFn,
      }),
  },

  fetchById: {
    useQuery: (id: string) =>
      useQuery<ProjectResponseInput | null>({
        enabled: !!id,
        queryKey: ['project', id],
        queryFn: () => fetchProjectByIdFn(id),
      }),
  },

  fetchAssignees: {
    useQuery: (id: string) =>
      useQuery<UserProjectResponseType[]>({
        enabled: !!id,
        queryKey: ['projectAssignees', id],
        queryFn: () => fetchProjectAssigneesFn(id),
      }),
  },

  fetchArchived: {
    useQuery: () =>
      useQuery<ProjectResponseInput[]>({
        queryKey: ['projects'],
        queryFn: () => fetchArchivedProjectsFn(),
      }),
  },

  create: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: createProjectFn,
        onMutate: async (_newProject) => {
          await queryClient.cancelQueries({ queryKey: ['projects'] })

          const previous = queryClient.getQueryData<ProjectResponseInput[]>([
            'projects',
          ])

          return { previous }
        },
        onError: (_err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['projects'], ctx.previous)
          }
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['projects'] })
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
        { id: string; data: UpdateProjectInput }
      >({
        mutationFn: ({ id, data }) => updateProjectFn(id, data),
        onMutate: async ({ id, data }) => {
          await queryClient.cancelQueries({ queryKey: ['projects'] })
          await queryClient.cancelQueries({ queryKey: ['project', id] })

          const previousProjects = queryClient.getQueryData<
            ProjectResponseInput[]
          >(['projects'])
          const previousProject =
            queryClient.getQueryData<ProjectResponseInput>(['project', id])

          // TODO: Figure out how to optimistically update types to which we dont have all information in a update request
          queryClient.setQueryData<ProjectResponseInput[]>(
            ['projects'],
            (old = []) =>
              old.map((p) =>
                p.id === id
                  ? {
                      ...data,
                      archived: p.archived,
                      tasks: p.tasks,
                      id: p.id,
                      tags: p.tags,
                      users: p.users,
                    }
                  : p,
              ),
          )

          queryClient.setQueryData<ProjectResponseInput>(
            ['project', id],
            (old) =>
              old
                ? {
                    ...data,
                    archived: old.archived,
                    tasks: old.tasks,
                    id: old.id,
                    tags: old.tags,
                    users: old.users,
                  }
                : old,
          )

          return { previousProjects, previousProject }
        },
        // onError: (_err, _vars, ctx) => {
        //   // Rollback to previous cache on error
        //   if (ctx?.previousProjects) {
        //     queryClient.setQueryData(['projects'], ctx.previousProjects)
        //   }
        //   if (ctx?.previousProject) {
        //     queryClient.setQueryData(['project', _vars.id], ctx.previousProject)
        //   }
        // },
        onSettled: (_data, _error, variables) => {
          queryClient.invalidateQueries({ queryKey: ['projects'] })
          if (variables?.id) {
            queryClient.invalidateQueries({
              queryKey: ['project', variables.id],
            })
          }
        },
      })
    },
  },

  delete: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<{ success: boolean }, Error, string>({
        mutationFn: deleteProjectFn,
        onMutate: async (id) => {
          await queryClient.cancelQueries({ queryKey: ['projects'] })

          const previous = queryClient.getQueryData<ProjectResponseInput[]>([
            'projects',
          ])

          queryClient.setQueryData<ProjectResponseInput[]>(
            ['projects'],
            (old = []) => old.filter((p) => p.id !== id),
          )

          return { previous }
        },
        // onError: (_err, _vars, ctx) => {
        //   if (ctx?.previous) {
        //     queryClient.setQueryData(['projects'], ctx.previous)
        //   }
        // },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['projects'] })
        },
      })
    },
  },

  archive: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        { success: boolean },
        Error,
        { id: string; archive: boolean }
      >({
        mutationFn: ({ id, archive }) => archiveProjectFn(id, archive),
        onMutate: async ({ id, archive }) => {
          await queryClient.cancelQueries({ queryKey: ['projects'] })

          const previous = queryClient.getQueryData<ProjectResponseInput[]>([
            'projects',
          ])

          queryClient.setQueryData<ProjectResponseInput[]>(
            ['projects'],
            (old = []) =>
              old.map((p) => (p.id === id ? { ...p, archived: archive } : p)),
          )

          return { previous }
        },
        // onError: (_err, _vars, ctx) => {
        //   if (ctx?.previous) {
        //     queryClient.setQueryData(['projects'], ctx.previous)
        //   }
        // },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['projects'] })
        },
      })
    },
  },
}

export default project
