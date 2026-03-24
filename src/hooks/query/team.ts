import {
  deleteTeamMemberFn,
  fetchTeamMembersFn,
  updateTeamMemberFn,
} from '@hooks/api/team'
import type {
  UpdateUserType,
  UserResponseType,
} from '@server/domain/memberSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const team = {
  fetchMembers: {
    useQuery: () =>
      useQuery<UserResponseType[]>({
        queryKey: ['teamMembers'],
        queryFn: fetchTeamMembersFn,
      }),
  },

  update: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        UserResponseType,
        Error,
        { id: string; payload: UpdateUserType },
        { previous?: UserResponseType[] }
      >({
        mutationFn: ({ id, payload }) => updateTeamMemberFn(id, payload),
        onMutate: async ({ id, payload }) => {
          await queryClient.cancelQueries({ queryKey: ['teamMembers'] })
          const previous = queryClient.getQueryData<UserResponseType[]>([
            'teamMembers',
          ])

          // Optimistically update the user in the cache
          queryClient.setQueryData<UserResponseType[]>(
            ['teamMembers'],
            (old = []) =>
              old.map((user) =>
                user.id === id ? { ...user, ...payload } : user,
              ),
          )

          return { previous }
        },
        onSuccess: (data, _vars) => {
          queryClient.setQueryData<UserResponseType[]>(
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
        { previous?: UserResponseType[] }
      >({
        mutationFn: deleteTeamMemberFn,
        onMutate: async (id) => {
          await queryClient.cancelQueries({ queryKey: ['teamMembers'] })
          const previous = queryClient.getQueryData<UserResponseType[]>([
            'teamMembers',
          ])

          // Optimistically remove the user from the cache
          queryClient.setQueryData<UserResponseType[]>(
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
