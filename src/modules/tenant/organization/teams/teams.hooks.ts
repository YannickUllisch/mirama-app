// src/modules/organization/teams/hooks/hooks.ts

import {
  optimisticList,
  usePaginatedQuery,
} from '@src/modules/shared/hooks/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { MemberResponse } from '../members/members.types'
import { useOrganizationResource } from '../organizationResourceContext'
import {
  addTeamMemberFn,
  createTeamFn,
  deleteTeamFn,
  fetchTeamByIdFn,
  fetchTeamMembersFn,
  fetchTeamsFn,
  removeTeamMemberFn,
  updateTeamFn,
} from './teams.api'
import type {
  AddTeamMemberCommand,
  CreateTeamCommand,
  TeamResponse,
  UpdateTeamCommand,
} from './teams.types'

export const teamKeys = {
  root: ['teams'] as const,
  org: (orgId: string) => [...teamKeys.root, orgId] as const,
  list: (orgId: string) => [...teamKeys.org(orgId), 'list'] as const,
  detail: (orgId: string, teamId: string) =>
    [...teamKeys.org(orgId), teamId] as const,
  members: (orgId: string, teamId: string) =>
    [...teamKeys.detail(orgId, teamId), 'members'] as const,
}

const team = {
  fetchAll: {
    useQuery: (opts?: { initialPageSize?: number }) => {
      const { activeOrganizationId } = useOrganizationResource()
      return usePaginatedQuery<TeamResponse>(
        teamKeys.list(activeOrganizationId),
        (params) => fetchTeamsFn(activeOrganizationId, params),
        opts,
      )
    },
  },

  fetchById: {
    useQuery: (teamId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<TeamResponse>({
        queryKey: teamKeys.detail(activeOrganizationId, teamId),
        queryFn: () => fetchTeamByIdFn(activeOrganizationId, teamId),
        enabled: !!activeOrganizationId && !!teamId,
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
        CreateTeamCommand,
        { previous?: TeamResponse[] }
      >({
        mutationFn: (data) => createTeamFn(activeOrganizationId, data),
        ...optimisticList<TeamResponse, CreateTeamCommand>(
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
                organizationId: activeOrganizationId,
                memberIds: [],
              } satisfies TeamResponse,
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
      type Vars = { teamId: string; data: UpdateTeamCommand }

      return useMutation<
        TeamResponse,
        Error,
        Vars,
        { previous?: TeamResponse[] }
      >({
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

      return useMutation<void, Error, string, { previous?: TeamResponse[] }>({
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
    fetchAll: {
      useQuery: (teamId: string) => {
        const { activeOrganizationId } = useOrganizationResource()
        return useQuery<MemberResponse[]>({
          queryKey: teamKeys.members(activeOrganizationId, teamId),
          queryFn: () => fetchTeamMembersFn(activeOrganizationId, teamId),
          enabled: !!activeOrganizationId && !!teamId,
        })
      },
    },

    add: {
      useMutation: (teamId: string) => {
        const { activeOrganizationId } = useOrganizationResource()
        const qc = useQueryClient()

        return useMutation<
          TeamResponse,
          Error,
          AddTeamMemberCommand,
          { previous?: TeamResponse[] }
        >({
          mutationFn: (data) =>
            addTeamMemberFn(activeOrganizationId, teamId, data),
          ...optimisticList<TeamResponse, AddTeamMemberCommand>(
            qc,
            teamKeys.list(activeOrganizationId),
            {
              invalidateKey: teamKeys.org(activeOrganizationId),
              successMessage: 'Member added to team',
              apply: (old, { memberId }) =>
                old.map((t) =>
                  t.id === teamId
                    ? { ...t, memberIds: [...t.memberIds, memberId] }
                    : t,
                ),
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
          void,
          Error,
          string,
          { previous?: MemberResponse[] }
        >({
          mutationFn: (memberId) =>
            removeTeamMemberFn(activeOrganizationId, teamId, memberId),
          ...optimisticList<MemberResponse, string>(
            qc,
            teamKeys.members(activeOrganizationId, teamId),
            {
              invalidateKey: teamKeys.org(activeOrganizationId),
              successMessage: 'Member removed from team',
              apply: (old, memberId) => old.filter((m) => m.id !== memberId),
            },
          ),
        })
      },
    },
  },
}

export default team
