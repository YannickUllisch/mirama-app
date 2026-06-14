import {
  optimisticList,
  usePaginatedQuery,
} from '@src/modules/shared/hooks/helpers'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useOrganizationResource } from '../organizationResourceContext'
import {
  fetchOrgMembersFn,
  removeOrgMemberFn,
  updateOrgMemberFn,
} from './members.api'
import type { MemberResponse, UpdateMemberCommand } from './members.types'

export const memberKeys = {
  root: ['members'] as const,
  org: (orgId: string) => [...memberKeys.root, orgId] as const,
  list: (orgId: string) => [...memberKeys.org(orgId), 'list'] as const,
}

const members = {
  fetchAll: {
    useQuery: (opts?: { initialPageSize?: number }) => {
      const { activeOrganizationId } = useOrganizationResource()
      return usePaginatedQuery<MemberResponse>(
        memberKeys.list(activeOrganizationId),
        (params) => fetchOrgMembersFn(activeOrganizationId, params),
        opts,
      )
    },
  },

  update: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()

      type Vars = { memberId: string; data: UpdateMemberCommand }

      return useMutation<
        MemberResponse,
        Error,
        Vars,
        { previous?: MemberResponse[] }
      >({
        mutationFn: ({ memberId, data }) =>
          updateOrgMemberFn(activeOrganizationId, memberId, data),
        ...optimisticList<MemberResponse, Vars>(
          queryClient,
          memberKeys.list(activeOrganizationId),
          {
            invalidateKey: memberKeys.org(activeOrganizationId),
            successMessage: 'Member updated',
            apply: (old, { memberId, data }) =>
              old.map((m) => (m.id === memberId ? { ...m, ...data } : m)),
          },
        ),
      })
    },
  },

  remove: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()

      return useMutation<void, Error, string, { previous?: MemberResponse[] }>({
        mutationFn: (memberId) =>
          removeOrgMemberFn(activeOrganizationId, memberId),
        ...optimisticList<MemberResponse, string>(
          queryClient,
          memberKeys.list(activeOrganizationId),
          {
            invalidateKey: memberKeys.org(activeOrganizationId),
            successMessage: 'Member removed',
            apply: (old, memberId) => old.filter((m) => m.id !== memberId),
          },
        ),
      })
    },
  },
}

export default members
