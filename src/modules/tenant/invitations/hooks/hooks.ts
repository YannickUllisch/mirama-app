// src/modules/tenant/invitations/hooks/hooks.ts
import type { InvitationResponse } from '@/server/modules/account/invitations/features/response'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTenantResource } from '../../tenantResourceContext'
import {
  acceptInvitationFn,
  declineInvitationFn,
  fetchMyInvitationsFn,
} from './api'

export const myInvitationKeys = {
  root: ['my-invitations'] as const,
  list: () => [...myInvitationKeys.root, 'list'] as const,
}

export const useMyInvitations = () =>
  useQuery<InvitationResponse[]>({
    queryKey: myInvitationKeys.list(),
    queryFn: fetchMyInvitationsFn,
    refetchOnWindowFocus: false,
    retry: false,
  })

export const useAcceptInvitation = () => {
  const queryClient = useQueryClient()
  const { activeTenantId } = useTenantResource()

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (invId) => acceptInvitationFn(activeTenantId, invId),
    onSuccess: () => {
      toast.success('Invitation accepted — welcome aboard!')
      queryClient.invalidateQueries({ queryKey: myInvitationKeys.root })
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to accept invitation')
    },
  })
}

export const useDeclineInvitation = () => {
  const queryClient = useQueryClient()
  const { activeTenantId } = useTenantResource()

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: (invId) => declineInvitationFn(activeTenantId, invId),
    onSuccess: () => {
      toast.success('Invitation declined')
      queryClient.invalidateQueries({ queryKey: myInvitationKeys.root })
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to decline invitation')
    },
  })
}
