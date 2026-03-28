import type { MemberResponse } from '@/server/modules/account/members/features/response'
import type { UpdateMemberRequest } from '@/server/modules/account/members/features/update-member/schema'
import {
  deleteTeamMemberFn,
  fetchTeamMembersFn,
  updateTeamMemberFn,
} from '@hooks/api/team'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const team = {
  fetchMembers: {
    useQuery: () =>
      useQuery<MemberResponse[]>({
        queryKey: ['teamMembers'],
        queryFn: fetchTeamMembersFn,
      }),
  },

  update: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        MemberResponse,
        Error,
        { id: string; payload: UpdateMemberRequest },
        { previous?: MemberResponse[] }
      >({
        mutationFn: ({ id, payload }) => updateTeamMemberFn(id, payload),
        onMutate: async ({ id, payload }) => {
          await queryClient.cancelQueries({ queryKey: ['teamMembers'] })
          const previous = queryClient.getQueryData<MemberResponse[]>([
            'teamMembers',
          ])

          // Optimistically update the user in the cache
          queryClient.setQueryData<MemberResponse[]>(
            ['teamMembers'],
            (old = []) =>
              old.map((user) =>
                user.id === id ? { ...user, ...payload } : user,
              ),
          )

          return { previous }
        },
        onSuccess: (data, _vars) => {
          queryClient.setQueryData<MemberResponse[]>(
            ['teamMembers'],
            (old = []) => old.map((p) => (p.id === data.id ? data : p)),
          )
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['teamMembers'], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
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
        { previous?: MemberResponse[] }
      >({
        mutationFn: deleteTeamMemberFn,
        onMutate: async (id) => {
          await queryClient.cancelQueries({ queryKey: ['teamMembers'] })
          const previous = queryClient.getQueryData<MemberResponse[]>([
            'teamMembers',
          ])

          // Optimistically remove the user from the cache
          queryClient.setQueryData<MemberResponse[]>(
            ['teamMembers'],
            (old = []) => old.filter((user) => user.id !== id),
          )

          return { previous }
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['teamMembers'], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
        },
      })
    },
  },
}

export default team
