import type { CreateInvitationRequest } from '@/server/modules/account/invitations/features/create-invitation/schema'
import type { InvitationResponse } from '@/server/modules/account/invitations/features/response'
import type { UpdateInvitationRequest } from '@/server/modules/account/invitations/features/update-invitation/schema'
import {
  createInviteFn,
  deleteInvitationFn,
  fetchInvitationsFn,
  updateInvitationFn,
} from '@hooks/api/invitation/api'
import { useOrganizationResource } from '@src/core/organization/organizationResourceContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { optimisticList } from '../../query/helpers'

export const invitationKeys = {
  root: ['invitations'] as const,
  organization: (orgId: string) => [...invitationKeys.root, orgId] as const,
  list: (orgId: string) =>
    [...invitationKeys.organization(orgId), 'list'] as const,
}

export const invitation = {
  fetchAll: {
    useQuery: () => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<InvitationResponse[]>({
        queryKey: invitationKeys.list(activeOrganizationId),
        queryFn: () => fetchInvitationsFn(activeOrganizationId),
      })
    },
  },

  create: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()

      return useMutation<
        InvitationResponse,
        Error,
        CreateInvitationRequest,
        { previous?: InvitationResponse[] }
      >({
        mutationFn: (data) => createInviteFn(activeOrganizationId, data),
        ...optimisticList<InvitationResponse, CreateInvitationRequest>(
          queryClient,
          invitationKeys.list(activeOrganizationId),
          {
            successMessage: 'Invitation sent',
            apply: (old, vars) => [
              ...old,
              {
                id: `temp-${Math.random()}`,
                name: vars.name,
                email: vars.email,
                organizationRole: vars.role,
                organizationId: activeOrganizationId,
                expiresAt: DateTime.utc().plus({ days: 1 }).toJSDate(),
              } as InvitationResponse,
            ],
          },
        ),
      })
    },
  },

  update: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()

      type Vars = { email: string; data: UpdateInvitationRequest }

      return useMutation<
        InvitationResponse,
        Error,
        Vars,
        { previous?: InvitationResponse[] }
      >({
        mutationFn: ({ email, data }) =>
          updateInvitationFn(activeOrganizationId, email, data),
        ...optimisticList<InvitationResponse, Vars>(
          queryClient,
          invitationKeys.list(activeOrganizationId),
          {
            successMessage: 'Invitation updated',
            apply: (old, { email, data }) =>
              old.map((inv) =>
                inv.email === email ? { ...inv, ...data } : inv,
              ),
          },
        ),
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
        { previous?: InvitationResponse[] }
      >({
        mutationFn: (email) => deleteInvitationFn(activeOrganizationId, email),
        ...optimisticList<InvitationResponse, string>(
          queryClient,
          invitationKeys.list(activeOrganizationId),
          {
            successMessage: 'Invitation deleted',
            apply: (old, email) => old.filter((inv) => inv.email !== email),
          },
        ),
      })
    },
  },
}
