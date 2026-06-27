// src/modules/pm/projects/projects.hooks.ts
import {
  optimisticList,
  usePaginatedQuery,
} from '@src/modules/shared/hooks/helpers'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  archiveProjectFn,
  createProjectFn,
  fetchProjectByIdFn,
  fetchProjectsFn,
  updateProjectFn,
} from './projects.api'
import type {
  CreateProjectCommand,
  ProjectResponse,
  UpdateProjectCommand,
} from './projects.types'

export const projectKeys = {
  root: ['projects'] as const,
  org: (orgId: string) => [...projectKeys.root, orgId] as const,
  list: (orgId: string) => [...projectKeys.org(orgId), 'list'] as const,
  detail: (orgId: string, id: string) =>
    [...projectKeys.org(orgId), 'detail', id] as const,
  members: (orgId: string, projectId: string) =>
    [...projectKeys.detail(orgId, projectId), 'members'] as const,
  teams: (orgId: string, projectId: string) =>
    [...projectKeys.detail(orgId, projectId), 'teams'] as const,
  milestones: (orgId: string, projectId: string) =>
    [...projectKeys.detail(orgId, projectId), 'milestones'] as const,
}

const project = {
  fetchAll: {
    useQuery: () => {
      const { activeOrganizationId } = useOrganizationResource()
      return usePaginatedQuery(
        projectKeys.list(activeOrganizationId),
        (params) => fetchProjectsFn(activeOrganizationId, params),
      )
    },
  },

  fetchById: {
    useQuery: (id: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<ProjectResponse>({
        queryKey: projectKeys.detail(activeOrganizationId, id),
        queryFn: () => fetchProjectByIdFn(activeOrganizationId, id),
        enabled: !!id,
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
        CreateProjectCommand,
        { previous?: ProjectResponse[] }
      >({
        mutationFn: (payload) => createProjectFn(activeOrganizationId, payload),
        ...optimisticList<ProjectResponse, CreateProjectCommand>(
          queryClient,
          projectKeys.list(activeOrganizationId),
          {
            invalidateKey: projectKeys.org(activeOrganizationId),
            successMessage: 'Project created',
          },
        ),
      })
    },
  },

  update: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()

      type Vars = { id: string; data: UpdateProjectCommand }

      return useMutation<
        ProjectResponse,
        Error,
        Vars,
        { previousDetail?: ProjectResponse }
      >({
        mutationFn: ({ id, data }) =>
          updateProjectFn(activeOrganizationId, id, data),
        onMutate: async ({ id, data }) => {
          await queryClient.cancelQueries({
            queryKey: projectKeys.org(activeOrganizationId),
          })
          const previousDetail = queryClient.getQueryData<ProjectResponse>(
            projectKeys.detail(activeOrganizationId, id),
          )
          queryClient.setQueryData<ProjectResponse>(
            projectKeys.detail(activeOrganizationId, id),
            (old) => (old ? { ...old, ...data } : old),
          )
          return { previousDetail }
        },
        onSuccess: (updated) => {
          queryClient.setQueryData(
            projectKeys.detail(activeOrganizationId, updated.projectId),
            updated,
          )
          toast.success('Project updated')
        },
        onError: (err, vars, ctx) => {
          if (ctx?.previousDetail) {
            queryClient.setQueryData(
              projectKeys.detail(activeOrganizationId, vars.id),
              ctx.previousDetail,
            )
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: (_data, _error, vars) => {
          queryClient.invalidateQueries({
            queryKey: projectKeys.org(activeOrganizationId),
          })
          queryClient.invalidateQueries({
            queryKey: projectKeys.detail(activeOrganizationId, vars.id),
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
        void,
        Error,
        string,
        { previousDetail?: ProjectResponse }
      >({
        mutationFn: (id) => archiveProjectFn(activeOrganizationId, id),
        onMutate: async (id) => {
          await queryClient.cancelQueries({
            queryKey: projectKeys.org(activeOrganizationId),
          })
          const previousDetail = queryClient.getQueryData<ProjectResponse>(
            projectKeys.detail(activeOrganizationId, id),
          )
          queryClient.setQueryData<ProjectResponse>(
            projectKeys.detail(activeOrganizationId, id),
            (old) => (old ? { ...old, isArchived: true } : old),
          )
          return { previousDetail }
        },
        onError: (err, id, ctx) => {
          if (ctx?.previousDetail) {
            queryClient.setQueryData(
              projectKeys.detail(activeOrganizationId, id),
              ctx.previousDetail,
            )
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: (_data, _error, id) => {
          queryClient.invalidateQueries({
            queryKey: projectKeys.org(activeOrganizationId),
          })
          queryClient.invalidateQueries({
            queryKey: projectKeys.detail(activeOrganizationId, id),
          })
        },
      })
    },
  },
}

export default project
