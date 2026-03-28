import type { CreateInvitationRequest } from '@/server/modules/account/invitations/features/create-invitation/schema'
import type { InvitationResponse } from '@/server/modules/account/invitations/features/response'
import type { UpdateInvitationRequest } from '@/server/modules/account/invitations/features/update-invitation/schema'
import {
  createInviteFn,
  deleteInvitationFn,
  fetchInvitationsFn,
  updateInvitationFn,
} from '@hooks/api/invitation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { toast } from 'sonner'

const invitation = {
  fetchAll: {
    useQuery: () =>
      useQuery<InvitationResponse[]>({
        queryKey: ['invitation'],
        queryFn: fetchInvitationsFn,
      }),
  },

  create: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        InvitationResponse,
        Error,
        CreateInvitationRequest,
        { previous?: InvitationResponse[] }
      >({
        mutationFn: createInviteFn,
        onMutate: async (newInvite) => {
          await queryClient.cancelQueries({ queryKey: ['invitation'] })

          const previous = queryClient.getQueryData<InvitationResponse[]>([
            'invitation',
          ])

          // Optimistically add the new invitation (with a temp id/email if needed)
          queryClient.setQueryData<InvitationResponse[]>(
            ['invitation'],
            (old = []) => [
              ...old,
              {
                id: `temp-${Math.random()}`,
                name: newInvite.name,
                email: newInvite.email,
                organizationRole: newInvite.role,
                organizationId: '',
                expiresAt: DateTime.utc().plus({ days: 1 }).toJSDate(),
              },
            ],
          )

          return { previous }
        },
        onSuccess: (data, _vars) => {
          queryClient.setQueryData<InvitationResponse[]>(
            ['invitation'],
            (old = []) => [...old, data],
          )
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['invitation'], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['invitation'] })
        },
      })
    },
  },

  update: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        InvitationResponse,
        Error,
        { id: string; data: UpdateInvitationRequest },
        { previous?: InvitationResponse[] }
      >({
        mutationFn: ({ id, data }) => updateInvitationFn(id, data),
        onMutate: async ({ id, data }) => {
          await queryClient.cancelQueries({ queryKey: ['invitation'] })

          const previous = queryClient.getQueryData<InvitationResponse[]>([
            'invitation',
          ])

          // Optimistically update the invitation in the cache
          queryClient.setQueryData<InvitationResponse[]>(
            ['invitation'],
            (old = []) =>
              old.map((inv) => (inv.email === id ? { ...inv, ...data } : inv)),
          )

          return { previous }
        },
        onSuccess: (data, _vars) => {
          queryClient.setQueryData<InvitationResponse[]>(
            ['invitation'],
            (old = []) => old.map((p) => (p.id === data.id ? data : p)),
          )
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['invitation'], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['invitation'] })
        },
      })
    },
  },

  delete: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        { success: boolean },
        Error,
        string,
        { previous?: InvitationResponse[] }
      >({
        mutationFn: deleteInvitationFn,
        onMutate: async (email) => {
          await queryClient.cancelQueries({ queryKey: ['invitation'] })

          const previous = queryClient.getQueryData<InvitationResponse[]>([
            'invitation',
          ])

          // Optimistically remove the invitation from the cache
          queryClient.setQueryData<InvitationResponse[]>(
            ['invitation'],
            (old = []) => old.filter((p) => p.email !== email),
          )

          return { previous }
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['invitation'], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['invitation'] })
        },
      })
    },
  },
}

export default invitation
