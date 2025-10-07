import {
  createInviteFn,
  deleteInvitationFn,
  fetchInvitationsFn,
  updateInvitationFn,
} from '@hooks/api/invitation'
import type {
  CreateInvitationInput,
  InvitationResponseType,
  UpdateInvitationInput,
} from '@server/domain/invitationSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { toast } from 'sonner'

const invitation = {
  fetchAll: {
    useQuery: () =>
      useQuery<InvitationResponseType[]>({
        queryKey: ['invitation'],
        queryFn: fetchInvitationsFn,
      }),
  },

  create: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        InvitationResponseType,
        Error,
        CreateInvitationInput,
        { previous?: InvitationResponseType[] }
      >({
        mutationFn: createInviteFn,
        onMutate: async (newInvite) => {
          await queryClient.cancelQueries({ queryKey: ['invitation'] })

          const previous = queryClient.getQueryData<InvitationResponseType[]>([
            'invitation',
          ])

          // Optimistically add the new invitation (with a temp id/email if needed)
          queryClient.setQueryData<InvitationResponseType[]>(
            ['invitation'],
            (old = []) => [
              ...old,
              {
                ...newInvite,
                id: `temp-${Math.random()}`,
                email: newInvite.email,
                expiresAt: DateTime.utc().plus({ days: 1 }).toJSDate(),
                teamId: '',
              },
            ],
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

  update: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        InvitationResponseType,
        Error,
        { id: string; data: UpdateInvitationInput },
        { previous?: InvitationResponseType[] }
      >({
        mutationFn: ({ id, data }) => updateInvitationFn(id, data),
        onMutate: async ({ id, data }) => {
          await queryClient.cancelQueries({ queryKey: ['invitation'] })

          const previous = queryClient.getQueryData<InvitationResponseType[]>([
            'invitation',
          ])

          // Optimistically update the invitation in the cache
          queryClient.setQueryData<InvitationResponseType[]>(
            ['invitation'],
            (old = []) =>
              old.map((inv) => (inv.email === id ? { ...inv, ...data } : inv)),
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

  delete: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        { success: boolean },
        Error,
        string,
        { previous?: InvitationResponseType[] }
      >({
        mutationFn: deleteInvitationFn,
        onMutate: async (email) => {
          await queryClient.cancelQueries({ queryKey: ['invitation'] })

          const previous = queryClient.getQueryData<InvitationResponseType[]>([
            'invitation',
          ])

          // Optimistically remove the invitation from the cache
          queryClient.setQueryData<InvitationResponseType[]>(
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
