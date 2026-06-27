// src/modules/pm/projects/milestones/milestones.hooks.ts
import { usePaginatedQuery } from '@src/modules/shared/hooks/helpers'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projectKeys } from '../projects.hooks'
import {
  createProjectMilestoneFn,
  deleteProjectMilestoneFn,
  fetchProjectMilestonesFn,
  updateProjectMilestoneFn,
} from './milestones.api'
import type {
  CreateProjectMilestoneCommand,
  ProjectMilestoneResponse,
  UpdateProjectMilestoneCommand,
} from './milestones.types'

const projectMilestones = {
  fetch: {
    useQuery: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      return usePaginatedQuery(
        projectKeys.milestones(activeOrganizationId, projectId),
        (params) =>
          fetchProjectMilestonesFn(activeOrganizationId, projectId, params),
      )
    },
  },

  create: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()

      type Vars = { projectId: string; data: CreateProjectMilestoneCommand }

      return useMutation<ProjectMilestoneResponse, Error, Vars>({
        mutationFn: ({ projectId, data }) =>
          createProjectMilestoneFn(activeOrganizationId, projectId, data),
        onSuccess: () => toast.success('Milestone created'),
        onError: (err) => toast.error(err?.message || 'An error occurred'),
        onSettled: (_data, _error, vars) => {
          queryClient.invalidateQueries({
            queryKey: projectKeys.detail(activeOrganizationId, vars.projectId),
          })
        },
      })
    },
  },

  update: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()

      type Vars = {
        projectId: string
        milestoneId: string
        data: UpdateProjectMilestoneCommand
      }

      return useMutation<ProjectMilestoneResponse, Error, Vars>({
        mutationFn: ({ projectId, milestoneId, data }) =>
          updateProjectMilestoneFn(
            activeOrganizationId,
            projectId,
            milestoneId,
            data,
          ),
        onSuccess: () => toast.success('Milestone updated'),
        onError: (err) => toast.error(err?.message || 'An error occurred'),
        onSettled: (_data, _error, vars) => {
          queryClient.invalidateQueries({
            queryKey: projectKeys.detail(activeOrganizationId, vars.projectId),
          })
        },
      })
    },
  },

  delete: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()

      type Vars = { projectId: string; milestoneId: string }

      return useMutation<void, Error, Vars>({
        mutationFn: ({ projectId, milestoneId }) =>
          deleteProjectMilestoneFn(
            activeOrganizationId,
            projectId,
            milestoneId,
          ),
        onSuccess: () => toast.success('Milestone deleted'),
        onError: (err) => toast.error(err?.message || 'An error occurred'),
        onSettled: (_data, _error, vars) => {
          queryClient.invalidateQueries({
            queryKey: projectKeys.detail(activeOrganizationId, vars.projectId),
          })
        },
      })
    },
  },
}

export default projectMilestones
