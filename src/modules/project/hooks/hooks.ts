// src/modules/project/hooks/hooks.ts
import type { MemberResponse } from '@/server/modules/account/members/features/response'
import type { TagResponse } from '@/server/modules/account/tags/features/response'
import type { CreateProjectRequest } from '@/server/modules/project/features/create-project/schema'
import type { ProjectResponse } from '@/server/modules/project/features/response'
import type { UpdateProjectRequest } from '@/server/modules/project/features/update-project/schema'
import { useOrganizationResource } from '@src/modules/organization/organizationResourceContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  archiveProjectFn,
  createProjectFn,
  deleteProjectFn,
  fetchArchivedProjectsFn,
  fetchProjectAssigneesFn,
  fetchProjectByIdFn,
  fetchProjectsFn,
  updateProjectFn,
} from './api'

export const projectKeys = {
  root: ['projects'] as const,
  org: (orgId: string) => [...projectKeys.root, orgId] as const,
  list: (orgId: string) => [...projectKeys.org(orgId), 'list'] as const,
  archived: (orgId: string) => [...projectKeys.org(orgId), 'archived'] as const,
  detail: (orgId: string, id: string) =>
    [...projectKeys.org(orgId), 'detail', id] as const,
  assignees: (orgId: string, id: string) =>
    [...projectKeys.detail(orgId, id), 'assignees'] as const,
}

const project = {
  fetchAll: {
    useQuery: () => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<ProjectResponse[]>({
        queryKey: projectKeys.list(activeOrganizationId),
        queryFn: () => fetchProjectsFn(activeOrganizationId),
      })
    },
  },

  fetchById: {
    useQuery: (id: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<ProjectResponse | null>({
        enabled: !!id,
        queryKey: projectKeys.detail(activeOrganizationId, id),
        queryFn: () => fetchProjectByIdFn(activeOrganizationId, id),
      })
    },
  },

  fetchAssignees: {
    useQuery: (id: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<MemberResponse[]>({
        enabled: !!id,
        queryKey: projectKeys.assignees(activeOrganizationId, id),
        queryFn: () => fetchProjectAssigneesFn(activeOrganizationId, id),
      })
    },
  },

  fetchArchived: {
    useQuery: () => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<ProjectResponse[]>({
        queryKey: projectKeys.archived(activeOrganizationId),
        queryFn: () => fetchArchivedProjectsFn(activeOrganizationId),
      })
    },
  },

  create: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      return useMutation<
        ProjectResponse,
        Error,
        CreateProjectRequest,
        { previous?: ProjectResponse[] }
      >({
        mutationFn: (payload) => createProjectFn(activeOrganizationId, payload),
        onMutate: async (newProject) => {
          await queryClient.cancelQueries({
            queryKey: projectKeys.org(activeOrganizationId),
          })

          if (newProject.newTags.length > 0) {
            queryClient.setQueryData<TagResponse[]>(['tags'], (old = []) => [
              ...old,
              ...newProject.newTags.map((tag) => ({
                title: tag.title ?? '',
                id: `temp-${Math.random()}`,
              })),
            ])
          }

          const previous = queryClient.getQueryData<ProjectResponse[]>(
            projectKeys.list(activeOrganizationId),
          )

          return { previous }
        },
        onSuccess: (serverProject) => {
          queryClient.setQueryData<ProjectResponse[]>(
            projectKeys.list(activeOrganizationId),
            (old = []) => [...old, serverProject],
          )
          queryClient.setQueryData(
            projectKeys.detail(activeOrganizationId, serverProject.id),
            serverProject,
          )
          toast.success('Project created')
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(
              projectKeys.list(activeOrganizationId),
              ctx.previous,
            )
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['tags'] })
          queryClient.invalidateQueries({
            queryKey: projectKeys.org(activeOrganizationId),
          })
        },
      })
    },
  },

  update: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()

      type Vars = { id: string; data: UpdateProjectRequest }

      return useMutation<
        ProjectResponse,
        Error,
        Vars,
        {
          previousProjects?: ProjectResponse[]
          previousProject?: ProjectResponse
        }
      >({
        mutationFn: ({ id, data }) =>
          updateProjectFn(activeOrganizationId, id, data),
        onMutate: async ({ id, data }) => {
          await queryClient.cancelQueries({
            queryKey: projectKeys.org(activeOrganizationId),
          })

          const previousProjects = queryClient.getQueryData<ProjectResponse[]>(
            projectKeys.list(activeOrganizationId),
          )
          const previousProject = queryClient.getQueryData<ProjectResponse>(
            projectKeys.detail(activeOrganizationId, id),
          )

          if (data.newTags.length > 0) {
            queryClient.setQueryData<TagResponse[]>(['tags'], (old = []) => [
              ...old,
              ...data.newTags.map((tag) => ({
                title: tag.title ?? '',
                id: `temp-${Math.random()}`,
              })),
            ])
          }

          queryClient.setQueryData<ProjectResponse[]>(
            projectKeys.list(activeOrganizationId),
            (old = []) =>
              old.map((p) =>
                p.id === id
                  ? {
                      ...p,
                      name: data.name,
                      description: data.description,
                      startDate: data.startDate,
                      endDate: data.endDate,
                      priority: data.priority,
                      status: data.status,
                      budget: data.budget,
                      tags: p.tags.filter((tag) => data.tags.includes(tag.id)),
                    }
                  : p,
              ),
          )

          queryClient.setQueryData<ProjectResponse>(
            projectKeys.detail(activeOrganizationId, id),
            (old) =>
              old
                ? {
                    ...old,
                    name: data.name,
                    description: data.description,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    priority: data.priority,
                    status: data.status,
                    budget: data.budget,
                    tags: old.tags.filter((tag) => data.tags.includes(tag.id)),
                  }
                : old,
          )

          return { previousProjects, previousProject }
        },
        onSuccess: (serverProject) => {
          queryClient.setQueryData<ProjectResponse[]>(
            projectKeys.list(activeOrganizationId),
            (old = []) =>
              old.map((p) => (p.id === serverProject.id ? serverProject : p)),
          )
          queryClient.setQueryData(
            projectKeys.detail(activeOrganizationId, serverProject.id),
            serverProject,
          )
          toast.success('Project updated')
        },
        onError: (err, vars, ctx) => {
          if (ctx?.previousProjects) {
            queryClient.setQueryData(
              projectKeys.list(activeOrganizationId),
              ctx.previousProjects,
            )
          }
          if (ctx?.previousProject) {
            queryClient.setQueryData(
              projectKeys.detail(activeOrganizationId, vars.id),
              ctx.previousProject,
            )
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: (_data, _error, variables) => {
          queryClient.invalidateQueries({ queryKey: ['tags'] })
          queryClient.invalidateQueries({
            queryKey: projectKeys.org(activeOrganizationId),
          })
          if (variables?.id) {
            queryClient.invalidateQueries({
              queryKey: projectKeys.detail(activeOrganizationId, variables.id),
            })
          }
        },
      })
    },
  },

  delete: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      return useMutation<
        { success: boolean },
        Error,
        string,
        {
          previousProjects: ProjectResponse[]
          previousArchived: ProjectResponse[]
        }
      >({
        mutationFn: (id) => deleteProjectFn(activeOrganizationId, id),
        onMutate: async (id) => {
          await queryClient.cancelQueries({
            queryKey: projectKeys.org(activeOrganizationId),
          })

          const previousProjects =
            queryClient.getQueryData<ProjectResponse[]>(
              projectKeys.list(activeOrganizationId),
            ) ?? []

          const previousArchived =
            queryClient.getQueryData<ProjectResponse[]>(
              projectKeys.archived(activeOrganizationId),
            ) ?? []

          queryClient.setQueryData<ProjectResponse[]>(
            projectKeys.list(activeOrganizationId),
            (old = []) => old.filter((p) => p.id !== id),
          )

          queryClient.setQueryData<ProjectResponse[]>(
            projectKeys.archived(activeOrganizationId),
            (old = []) => old.filter((p) => p.id !== id),
          )

          return { previousProjects, previousArchived }
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previousProjects) {
            queryClient.setQueryData(
              projectKeys.list(activeOrganizationId),
              ctx.previousProjects,
            )
          }
          if (ctx?.previousArchived) {
            queryClient.setQueryData(
              projectKeys.archived(activeOrganizationId),
              ctx.previousArchived,
            )
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: projectKeys.org(activeOrganizationId),
          })
        },
      })
    },
  },

  archive: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      return useMutation<
        { success: boolean },
        Error,
        { id: string; archive: boolean },
        {
          previousProject: ProjectResponse | null
          previousProjects: ProjectResponse[]
          previousArchived: ProjectResponse[]
        }
      >({
        mutationFn: ({ id, archive }) =>
          archiveProjectFn(activeOrganizationId, id, archive),
        onMutate: async ({ id, archive }) => {
          await queryClient.cancelQueries({
            queryKey: projectKeys.org(activeOrganizationId),
          })

          const previousProject = queryClient.getQueryData<ProjectResponse>(
            projectKeys.detail(activeOrganizationId, id),
          )
          const previousProjects =
            queryClient.getQueryData<ProjectResponse[]>(
              projectKeys.list(activeOrganizationId),
            ) ?? []
          const previousArchived =
            queryClient.getQueryData<ProjectResponse[]>(
              projectKeys.archived(activeOrganizationId),
            ) ?? []

          if (archive) {
            const archivedProject = previousProjects.find((p) => p.id === id)
            if (archivedProject) {
              queryClient.setQueryData(
                projectKeys.list(activeOrganizationId),
                previousProjects.filter((p) => p.id !== id),
              )
              queryClient.setQueryData(
                projectKeys.archived(activeOrganizationId),
                [{ ...archivedProject, archived: true }, ...previousArchived],
              )
            }
          } else {
            const unarchivedProject = previousArchived.find((p) => p.id === id)
            if (unarchivedProject) {
              queryClient.setQueryData(
                projectKeys.archived(activeOrganizationId),
                previousArchived.filter((p) => p.id !== id),
              )
              queryClient.setQueryData(projectKeys.list(activeOrganizationId), [
                { ...unarchivedProject, archived: false },
                ...previousProjects,
              ])
            }
          }

          queryClient.setQueryData<ProjectResponse>(
            projectKeys.detail(activeOrganizationId, id),
            (old) => (old ? { ...old, archived: archive } : old),
          )

          return {
            previousProject: previousProject ?? null,
            previousProjects,
            previousArchived,
          }
        },
        onError: (err, vars, ctx) => {
          if (ctx?.previousProjects) {
            queryClient.setQueryData(
              projectKeys.list(activeOrganizationId),
              ctx.previousProjects,
            )
          }
          if (ctx?.previousArchived) {
            queryClient.setQueryData(
              projectKeys.archived(activeOrganizationId),
              ctx.previousArchived,
            )
          }
          if (ctx?.previousProject) {
            queryClient.setQueryData(
              projectKeys.detail(activeOrganizationId, vars.id),
              ctx.previousProject,
            )
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: (_data, _error, variables) => {
          queryClient.invalidateQueries({
            queryKey: projectKeys.org(activeOrganizationId),
          })
          if (variables?.id) {
            queryClient.invalidateQueries({
              queryKey: projectKeys.detail(activeOrganizationId, variables.id),
            })
          }
        },
      })
    },
  },
}

export default project
