// src/modules/organization/members/hooks/hooks.ts
import type { MemberResponse } from '@/server/modules/account/members/features/response'
import type { UpdateMemberRequest } from '@/server/modules/account/members/features/update-member/schema'
import { useOrganizationResource } from '@src/modules/organization/organizationResourceContext'
import { optimisticList } from '@src/modules/shared/hooks/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchOrgMembersFn, updateOrgMemberFn } from './api'

export const memberKeys = {
  root: ['members'] as const,
  org: (orgId: string) => [...memberKeys.root, orgId] as const,
  list: (orgId: string) => [...memberKeys.org(orgId), 'list'] as const,
}

const members = {
  fetchAll: {
    useQuery: () => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<MemberResponse[]>({
        queryKey: memberKeys.list(activeOrganizationId),
        queryFn: () => fetchOrgMembersFn(activeOrganizationId),
        enabled: !!activeOrganizationId,
      })
    },
  },

  update: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()

      type Vars = { memberId: string; data: UpdateMemberRequest }

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
}

export default members
