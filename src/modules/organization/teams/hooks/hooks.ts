// src/modules/organization/teams/hooks/hooks.ts
import type { AddTeamMemberRequest } from '@/server/modules/account/teams/features/team-members/add-team-member/schema'
import type { CreateTeamRequest } from '@/server/modules/account/teams/features/create-team/schema'
import type {
  TeamMemberResponse,
  TeamResponse,
} from '@/server/modules/account/teams/features/response'
import type { UpdateTeamRequest } from '@/server/modules/account/teams/features/update-team/schema'
import { useOrganizationResource } from '@src/modules/organization/organizationResourceContext'
import { optimisticList } from '@src/modules/shared/hooks/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addTeamMemberFn,
  createTeamFn,
  deleteTeamFn,
  fetchTeamMembersFn,
  fetchTeamsFn,
  removeTeamMemberFn,
  updateTeamFn,
} from './api'

export const teamKeys = {
  root: ['teams'] as const,
  org: (orgId: string) => [...teamKeys.root, orgId] as const,
  list: (orgId: string) => [...teamKeys.org(orgId), 'list'] as const,
  members: (orgId: string, teamId: string) =>
    [...teamKeys.org(orgId), teamId, 'members'] as const,
}

const team = {
  fetchAll: {
    useQuery: () => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<TeamResponse[]>({
        queryKey: teamKeys.list(activeOrganizationId),
        queryFn: () => fetchTeamsFn(activeOrganizationId),
        enabled: !!activeOrganizationId,
      })
    },
  },

  create: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const qc = useQueryClient()

      return useMutation<
        TeamResponse,
        Error,
        CreateTeamRequest,
        { previous?: TeamResponse[] }
      >({
        mutationFn: (data) => createTeamFn(activeOrganizationId, data),
        ...optimisticList<TeamResponse, CreateTeamRequest>(
          qc,
          teamKeys.list(activeOrganizationId),
          {
            invalidateKey: teamKeys.org(activeOrganizationId),
            successMessage: 'Team created',
            apply: (old, vars) => [
              ...old,
              {
                id: `temp-${Date.now()}`,
                name: vars.name,
                slug: vars.name.toLowerCase().replace(/\s+/g, '-'),
                dateCreated: new Date(),
                memberCount: 0,
              },
            ],
          },
        ),
      })
    },
  },

  update: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const qc = useQueryClient()
      type Vars = { teamId: string; data: UpdateTeamRequest }

      return useMutation<TeamResponse, Error, Vars, { previous?: TeamResponse[] }>({
        mutationFn: ({ teamId, data }) =>
          updateTeamFn(activeOrganizationId, teamId, data),
        ...optimisticList<TeamResponse, Vars>(
          qc,
          teamKeys.list(activeOrganizationId),
          {
            invalidateKey: teamKeys.org(activeOrganizationId),
            successMessage: 'Team updated',
            apply: (old, { teamId, data }) =>
              old.map((t) => (t.id === teamId ? { ...t, ...data } : t)),
          },
        ),
      })
    },
  },

  remove: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const qc = useQueryClient()

      return useMutation<
        { success: boolean },
        Error,
        string,
        { previous?: TeamResponse[] }
      >({
        mutationFn: (teamId) => deleteTeamFn(activeOrganizationId, teamId),
        ...optimisticList<TeamResponse, string>(
          qc,
          teamKeys.list(activeOrganizationId),
          {
            invalidateKey: teamKeys.org(activeOrganizationId),
            successMessage: 'Team deleted',
            apply: (old, teamId) => old.filter((t) => t.id !== teamId),
          },
        ),
      })
    },
  },

  members: {
    fetch: {
      useQuery: (teamId: string) => {
        const { activeOrganizationId } = useOrganizationResource()
        return useQuery<TeamMemberResponse[]>({
          queryKey: teamKeys.members(activeOrganizationId, teamId),
          queryFn: () => fetchTeamMembersFn(activeOrganizationId, teamId),
          enabled: !!activeOrganizationId && !!teamId,
        })
      },
    },

    add: {
      // No optimistic apply — member name/email not available in mutation vars.
      // optimisticList still provides cancel-in-flight, rollback, toast, and invalidation.
      useMutation: (teamId: string) => {
        const { activeOrganizationId } = useOrganizationResource()
        const qc = useQueryClient()

        return useMutation<
          TeamMemberResponse,
          Error,
          AddTeamMemberRequest,
          { previous?: TeamMemberResponse[] }
        >({
          mutationFn: (data) =>
            addTeamMemberFn(activeOrganizationId, teamId, data),
          ...optimisticList<TeamMemberResponse, AddTeamMemberRequest>(
            qc,
            teamKeys.members(activeOrganizationId, teamId),
            {
              invalidateKey: teamKeys.org(activeOrganizationId),
              successMessage: 'Member added to team',
            },
          ),
        })
      },
    },

    remove: {
      useMutation: (teamId: string) => {
        const { activeOrganizationId } = useOrganizationResource()
        const qc = useQueryClient()

        return useMutation<
          { success: boolean },
          Error,
          string,
          { previous?: TeamMemberResponse[] }
        >({
          mutationFn: (memberId) =>
            removeTeamMemberFn(activeOrganizationId, teamId, memberId),
          ...optimisticList<TeamMemberResponse, string>(
            qc,
            teamKeys.members(activeOrganizationId, teamId),
            {
              invalidateKey: teamKeys.org(activeOrganizationId),
              successMessage: 'Member removed from team',
              apply: (old, memberId) =>
                old.filter((m) => m.memberId !== memberId),
            },
          ),
        })
      },
    },
  },
}

export default team
