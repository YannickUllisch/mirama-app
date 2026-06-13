import { optimisticList } from '@src/modules/shared/hooks/helpers'
import { useTenantResource } from '@src/modules/tenant/tenant/tenantResourceContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { useOrganizationResource } from '../organizationResourceContext'
import {
  acceptInvitationFn,
  createInviteFn,
  declineInvitationFn,
  extendInvitationFn,
  fetchInvitationsFn,
  fetchMyInvitationsFn,
  revokeInvitationFn,
} from './invitations.api'
import type {
  InvitationResponse,
  SendInvitationCommand,
} from './invitations.types'

export const invitationKeys = {
  root: ['invitations'] as const,
  organization: (orgId: string) => [...invitationKeys.root, orgId] as const,
  list: (orgId: string) =>
    [...invitationKeys.organization(orgId), 'list'] as const,
  my: {
    root: ['my-invitations'] as const,
    list: () => ['my-invitations', 'list'] as const,
  },
}

const invitation = {
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
        SendInvitationCommand,
        { previous?: InvitationResponse[] }
      >({
        mutationFn: (data) => createInviteFn(activeOrganizationId, data),
        ...optimisticList<InvitationResponse, SendInvitationCommand>(
          queryClient,
          invitationKeys.list(activeOrganizationId),
          {
            successMessage: 'Invitation sent',
            apply: (old, vars) => [
              ...old,
              {
                id: `temp-${Date.now()}`,
                email: vars.email,
                name: vars.name,
                inviterId: '',
                iamRoleId: vars.iamRoleId,
                status: 'Pending' as const,
                expiresAt: DateTime.utc().plus({ days: 1 }).toJSDate(),
                organizationId: activeOrganizationId,
                organizationName: '',
              } satisfies InvitationResponse,
            ],
          },
        ),
      })
    },
  },

  extend: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()

      return useMutation<
        InvitationResponse,
        Error,
        string,
        { previous?: InvitationResponse[] }
      >({
        mutationFn: (invitationId) =>
          extendInvitationFn(activeOrganizationId, invitationId),
        ...optimisticList<InvitationResponse, string>(
          queryClient,
          invitationKeys.list(activeOrganizationId),
          {
            successMessage: 'Invitation extended',
          },
        ),
      })
    },
  },

  revoke: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()

      return useMutation<
        void,
        Error,
        string,
        { previous?: InvitationResponse[] }
      >({
        mutationFn: (invitationId) =>
          revokeInvitationFn(activeOrganizationId, invitationId),
        ...optimisticList<InvitationResponse, string>(
          queryClient,
          invitationKeys.list(activeOrganizationId),
          {
            successMessage: 'Invitation revoked',
            apply: (old, invitationId) =>
              old.filter((inv) => inv.id !== invitationId),
          },
        ),
      })
    },
  },

  // ─── Tenant-scoped (current user's pending invitations) ──────────────────────

  fetchMine: {
    useQuery: () => {
      const { activeTenantId } = useTenantResource()
      return useQuery<InvitationResponse[]>({
        queryKey: invitationKeys.my.list(),
        queryFn: () => fetchMyInvitationsFn(activeTenantId),
        refetchOnWindowFocus: false,
        retry: false,
      })
    },
  },

  accept: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      return useMutation<
        { success: boolean },
        Error,
        string,
        { previous?: InvitationResponse[] }
      >({
        mutationFn: (invId) => acceptInvitationFn(activeTenantId, invId),
        ...optimisticList<InvitationResponse, string>(
          queryClient,
          invitationKeys.my.list(),
          {
            invalidateKey: invitationKeys.my.root,
            successMessage: 'Invitation accepted — welcome aboard!',
            apply: (old, invId) => old.filter((inv) => inv.id !== invId),
          },
        ),
      })
    },
  },

  decline: {
    useMutation: () => {
      const { activeTenantId } = useTenantResource()
      const queryClient = useQueryClient()

      return useMutation<
        { success: boolean },
        Error,
        string,
        { previous?: InvitationResponse[] }
      >({
        mutationFn: (invId) => declineInvitationFn(activeTenantId, invId),
        ...optimisticList<InvitationResponse, string>(
          queryClient,
          invitationKeys.my.list(),
          {
            invalidateKey: invitationKeys.my.root,
            successMessage: 'Invitation declined',
            apply: (old, invId) => old.filter((inv) => inv.id !== invId),
          },
        ),
      })
    },
  },
}

export default invitation
