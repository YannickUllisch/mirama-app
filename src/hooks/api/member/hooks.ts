import type { MemberResponse } from '@/server/modules/account/members/features/response'
import type { UpdateMemberRequest } from '@/server/modules/account/members/features/update-member/schema'
import { optimisticList } from '@hooks/query/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchOrgMembersFn, updateOrgMemberFn } from './api'

export const memberKeys = {
  root: ['members'] as const,
  org: (orgId: string) => [...memberKeys.root, orgId] as const,
  list: (orgId: string) => [...memberKeys.org(orgId), 'list'] as const,
}

const member = {
  fetchByOrg: {
    useQuery: (organizationId: string) =>
      useQuery<MemberResponse[]>({
        queryKey: memberKeys.list(organizationId),
        queryFn: () => fetchOrgMembersFn(organizationId),
        enabled: !!organizationId,
      }),
  },

  update: {
    useMutation: (organizationId: string) => {
      const queryClient = useQueryClient()

      type Vars = { memberId: string; data: UpdateMemberRequest }

      return useMutation<
        MemberResponse,
        Error,
        Vars,
        { previous?: MemberResponse[] }
      >({
        mutationFn: ({ memberId, data }) =>
          updateOrgMemberFn(organizationId, memberId, data),
        ...optimisticList<MemberResponse, Vars>(
          queryClient,
          memberKeys.list(organizationId),
          {
            invalidateKey: memberKeys.org(organizationId),
            successMessage: 'Member updated',
            apply: (old, { memberId, data }) =>
              old.map((m) => (m.id === memberId ? { ...m, ...data } : m)),
          },
        ),
      })
    },
  },
}

export default member
