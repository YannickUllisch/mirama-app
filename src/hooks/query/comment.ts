import {
  createTaskCommentFn,
  deleteTaskCommentFn,
  fetchCommentsByTaskIdFn,
  updateTaskCommentFn,
} from '@hooks/api/comment'
import type {
  CommentResponseType,
  CreateCommentType,
  UpdateCommentType,
} from '@server/domain/commentSchema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const comment = {
  fetchByTaskId: {
    useQuery: (id: string) =>
      useQuery<CommentResponseType[]>({
        enabled: !!id,
        queryKey: ['taskComments', id],
        queryFn: () => fetchCommentsByTaskIdFn(id),
      }),
  },

  createOnTask: {
    useMutation: (
      taskId: string,
      sessionUserId: string,
      sessionUserName: string,
    ) => {
      const queryClient = useQueryClient()
      return useMutation<
        CommentResponseType,
        Error,
        CreateCommentType,
        { previous?: CommentResponseType[] }
      >({
        mutationFn: createTaskCommentFn,
        onMutate: async (newComment) => {
          await queryClient.cancelQueries({
            queryKey: ['taskComments', taskId],
          })

          const previous = queryClient.getQueryData<CommentResponseType[]>([
            'taskComments',
            taskId,
          ])

          // Optimistically add the new invitation (with a temp id/email if needed)
          queryClient.setQueryData<CommentResponseType[]>(
            ['taskComments', taskId],
            (old = []) => [
              ...old,
              {
                ...newComment,
                id: `temp-${Math.random()}`,
                createdAt: new Date(),
                userId: sessionUserId,
                userName: sessionUserName,
              },
            ],
          )

          return { previous }
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['taskComments', taskId], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['taskComments', taskId] })
        },
      })
    },
  },

  updateTaskComment: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        CommentResponseType,
        Error,
        { id: string; data: UpdateCommentType },
        { previous?: CommentResponseType[] }
      >({
        mutationFn: ({ id, data }) => updateTaskCommentFn(id, data),
        onMutate: async ({ id, data }) => {
          await queryClient.cancelQueries({ queryKey: ['taskComments', id] })

          const previous = queryClient.getQueryData<CommentResponseType[]>([
            'taskComments',
            id,
          ])

          // Optimistically update the invitation in the cache
          queryClient.setQueryData<CommentResponseType[]>(
            ['taskComments'],
            (old = []) => old.map((c) => (c.id === id ? { ...c, ...data } : c)),
          )

          return { previous }
        },
        onError: (err, vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['taskComments', vars.id], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: (_data, _err, vars) => {
          queryClient.invalidateQueries({ queryKey: ['taskComments', vars.id] })
        },
      })
    },
  },

  deleteTaskComment: {
    useMutation: (taskId: string) => {
      const queryClient = useQueryClient()
      return useMutation<
        { success: boolean },
        Error,
        string,
        { previous?: CommentResponseType[] }
      >({
        mutationFn: deleteTaskCommentFn,
        onMutate: async (id) => {
          await queryClient.cancelQueries({
            queryKey: ['taskComments', taskId],
          })

          const previous = queryClient.getQueryData<CommentResponseType[]>([
            'taskComments',
            taskId,
          ])

          // Optimistically remove the invitation from the cache
          queryClient.setQueryData<CommentResponseType[]>(
            ['taskComments', taskId],
            (old = []) => old.filter((p) => p.id !== id),
          )

          return { previous }
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['taskComments', taskId], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['taskComments', taskId] })
        },
      })
    },
  },
}

export default comment
