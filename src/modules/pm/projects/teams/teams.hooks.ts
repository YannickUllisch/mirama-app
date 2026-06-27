// src/modules/pm/projects/teams/teams.hooks.ts
import { usePaginatedQuery } from '@src/modules/shared/hooks/helpers'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projectKeys } from '../projects.hooks'
import {
  addProjectTeamFn,
  fetchProjectTeamsFn,
  removeProjectTeamFn,
} from './teams.api'
import type { ProjectTeamResponse } from './teams.types'

const projectTeams = {
  fetch: {
    useQuery: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      return usePaginatedQuery(
        projectKeys.teams(activeOrganizationId, projectId),
        (params) =>
          fetchProjectTeamsFn(activeOrganizationId, projectId, params),
      )
    },
  },

  add: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()

      type Vars = { projectId: string; teamId: string }

      return useMutation<ProjectTeamResponse, Error, Vars>({
        mutationFn: ({ projectId, teamId }) =>
          addProjectTeamFn(activeOrganizationId, projectId, teamId),
        onSuccess: () => toast.success('Team added'),
        onError: (err) => toast.error(err?.message || 'An error occurred'),
        onSettled: (_data, _error, vars) => {
          queryClient.invalidateQueries({
            queryKey: projectKeys.detail(activeOrganizationId, vars.projectId),
          })
        },
      })
    },
  },

  remove: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()

      type Vars = { projectId: string; teamId: string }

      return useMutation<void, Error, Vars>({
        mutationFn: ({ projectId, teamId }) =>
          removeProjectTeamFn(activeOrganizationId, projectId, teamId),
        onSuccess: () => toast.success('Team removed'),
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

export default projectTeams
