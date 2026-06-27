// src/modules/pm/projects/members/members.hooks.ts
import { usePaginatedQuery } from '@src/modules/shared/hooks/helpers'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projectKeys } from '../projects.hooks'
import {
  addProjectMemberFn,
  fetchProjectMembersFn,
  removeProjectMemberFn,
  updateProjectMemberFn,
} from './members.api'
import type {
  AddProjectMemberCommand,
  ProjectMemberResponse,
  UpdateProjectMemberCommand,
} from './members.types'

const projectMembers = {
  fetch: {
    useQuery: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      return usePaginatedQuery(
        projectKeys.members(activeOrganizationId, projectId),
        (params) =>
          fetchProjectMembersFn(activeOrganizationId, projectId, params),
      )
    },
  },

  add: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()

      type Vars = { projectId: string; data: AddProjectMemberCommand }

      return useMutation<ProjectMemberResponse, Error, Vars>({
        mutationFn: ({ projectId, data }) =>
          addProjectMemberFn(activeOrganizationId, projectId, data),
        onSuccess: () => toast.success('Member added'),
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
        memberId: string
        data: UpdateProjectMemberCommand
      }

      return useMutation<ProjectMemberResponse, Error, Vars>({
        mutationFn: ({ projectId, memberId, data }) =>
          updateProjectMemberFn(
            activeOrganizationId,
            projectId,
            memberId,
            data,
          ),
        onSuccess: () => toast.success('Member updated'),
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

      type Vars = { projectId: string; memberId: string }

      return useMutation<void, Error, Vars>({
        mutationFn: ({ projectId, memberId }) =>
          removeProjectMemberFn(activeOrganizationId, projectId, memberId),
        onSuccess: () => toast.success('Member removed'),
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

export default projectMembers
