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
  CreateProjectInput,
  ProjectResponseInput,
  UpdateProjectInput,
} from '@server/domain/projectSchema'
import type { TagResponseType } from '@server/domain/tagSchema'
import type { UserProjectResponseType } from '@server/domain/userSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
        queryKey: ['archivedProjects'],
        queryFn: () => fetchArchivedProjectsFn(),
      }),
  },

  create: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        ProjectResponseInput, // result
        Error, // error
        CreateProjectInput, // variables
        { previous?: ProjectResponseInput[] } // context
      >({
        mutationFn: createProjectFn,
        onMutate: async (newProject) => {
          await queryClient.cancelQueries({ queryKey: ['projects'] })

          if (newProject.newTags.length > 0) {
            queryClient.setQueryData<TagResponseType[]>(
              ['tags'],
              (old = []) => [
                ...old,
                ...newProject.newTags.map((tag) => ({
                  title: tag.title ?? '',
                  id: `temp-${Math.random()}`,
                })),
              ],
            )
          }

          const previous = queryClient.getQueryData<ProjectResponseInput[]>([
            'projects',
          ])

          return { previous }
        },
        onSuccess: (serverProject, _vars) => {
          // Replace optimistic with authoritative data (now includes proper tag titles)
          queryClient.setQueryData<ProjectResponseInput[]>(
            ['projects'],
            (old = []) => [...old, serverProject],
          )
          queryClient.setQueryData(['project', serverProject.id], serverProject)
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['projects'], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['tags'] })
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
        { id: string; data: UpdateProjectInput },
        {
          previousProjects?: ProjectResponseInput[]
          previousProject?: ProjectResponseInput
        }
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

          if (data.newTags.length > 0) {
            queryClient.setQueryData<TagResponseType[]>(
              ['tags'],
              (old = []) => [
                ...old,
                ...data.newTags.map((tag) => ({
                  title: tag.title ?? '',
                  id: `temp-${Math.random()}`,
                })),
              ],
            )
          }

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
                      tags: p.tags.filter((tag) => data.tags.includes(tag.id)),
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
                    tags: old.tags.filter((tag) => data.tags.includes(tag.id)),
                    users: old.users,
                  }
                : old,
          )

          return { previousProjects, previousProject }
        },
        onSuccess: (serverProject, _vars) => {
          queryClient.setQueryData<ProjectResponseInput[]>(
            ['projects'],
            (old = []) =>
              old.map((p) => (p.id === serverProject.id ? serverProject : p)),
          )
          queryClient.setQueryData(['project', serverProject.id], serverProject)
        },
        onError: (err, _vars, ctx) => {
          // Rollback to previous cache on error
          if (ctx?.previousProjects) {
            queryClient.setQueryData(['projects'], ctx.previousProjects)
          }
          if (ctx?.previousProject) {
            queryClient.setQueryData(['project', _vars.id], ctx.previousProject)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: (_data, _error, variables) => {
          queryClient.invalidateQueries({ queryKey: ['tags'] })
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
      return useMutation<
        { success: boolean },
        Error,
        string,
        {
          previousProjects: ProjectResponseInput[]
          previousArchived: ProjectResponseInput[]
        }
      >({
        mutationFn: deleteProjectFn,
        onMutate: async (id) => {
          await queryClient.cancelQueries({ queryKey: ['projects'] })

          const previousProjects =
            queryClient.getQueryData<ProjectResponseInput[]>(['projects']) ?? []

          const previousArchived =
            queryClient.getQueryData<ProjectResponseInput[]>([
              'archivedProjects',
            ]) ?? []

          queryClient.setQueryData<ProjectResponseInput[]>(
            ['projects'],
            (old = []) => old.filter((p) => p.id !== id),
          )

          queryClient.setQueryData<ProjectResponseInput[]>(
            ['archivedProjects'],
            (old = []) => old.filter((p) => p.id !== id),
          )

          return { previousProjects, previousArchived }
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previousProjects) {
            queryClient.setQueryData(['projects'], ctx.previousProjects)
          }

          if (ctx?.previousArchived) {
            queryClient.setQueryData(['archivedProjects'], ctx.previousArchived)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['projects'] })
          queryClient.invalidateQueries({ queryKey: ['archivedProjects'] })
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
        { id: string; archive: boolean },
        {
          previousProject: ProjectResponseInput | null
          previousProjects: ProjectResponseInput[]
          previousArchived: ProjectResponseInput[]
        }
      >({
        mutationFn: ({ id, archive }) => archiveProjectFn(id, archive),
        onMutate: async ({ id, archive }) => {
          await queryClient.cancelQueries({ queryKey: ['projects'] })
          await queryClient.cancelQueries({ queryKey: ['archivedProjects'] })
          await queryClient.cancelQueries({ queryKey: ['project', id] })

          const previousProject =
            queryClient.getQueryData<ProjectResponseInput>(['project', id])
          const previousProjects =
            queryClient.getQueryData<ProjectResponseInput[]>(['projects']) ?? []
          const previousArchived =
            queryClient.getQueryData<ProjectResponseInput[]>([
              'archivedProjects',
            ]) ?? []

          // Optimistically move project between caches
          if (archive) {
            // Archiving
            const archivedProject = previousProjects.find((p) => p.id === id)
            if (archivedProject) {
              queryClient.setQueryData(
                ['projects'],
                previousProjects.filter((p) => p.id !== id),
              )
              queryClient.setQueryData(
                ['archivedProjects'],
                [{ ...archivedProject, archived: true }, ...previousArchived],
              )
            }
          } else {
            // Unarchiving
            const unarchivedProject = previousArchived.find((p) => p.id === id)
            if (unarchivedProject) {
              queryClient.setQueryData(
                ['archivedProjects'],
                previousArchived.filter((p) => p.id !== id),
              )
              queryClient.setQueryData(
                ['projects'],
                [
                  { ...unarchivedProject, archived: false },
                  ...previousProjects,
                ],
              )
            }
          }

          queryClient.setQueryData(['project', id], (old = []) =>
            old ? { ...old, archived: archive } : old,
          )

          return {
            previousProject: previousProject ?? null,
            previousProjects,
            previousArchived,
          }
        },

        onError: (err, _vars, ctx) => {
          if (ctx?.previousProjects) {
            queryClient.setQueryData(['projects'], ctx.previousProjects)
          }
          if (ctx?.previousArchived) {
            queryClient.setQueryData(['archivedProjects'], ctx.previousArchived)
          }
          if (ctx?.previousProject) {
            queryClient.setQueryData(['project', _vars.id], ctx.previousProject)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: (_data, _error, variables) => {
          queryClient.invalidateQueries({ queryKey: ['projects'] })
          queryClient.invalidateQueries({ queryKey: ['archivedProjects'] })
          if (variables?.id) {
            queryClient.invalidateQueries({
              queryKey: ['project', variables.id],
            })
          }
        },
      })
    },
  },
}

export default project
