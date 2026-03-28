import {
  createTaskCommentFn,
  deleteTaskCommentFn,
  fetchCommentsByTaskIdFn,
  updateTaskCommentFn,
} from '@hooks/api/comment'
import type { CommentResponse } from '@server/modules/task/features/comments/response'
import type {
  CreateCommentRequest,
  UpdateCommentRequest,
} from '@server/modules/task/features/comments/schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const comment = {
  fetchByTaskId: {
    useQuery: (projectId: string, taskId: string) =>
      useQuery<CommentResponse[]>({
        enabled: !!taskId,
        queryKey: ['taskComments', taskId],
        queryFn: () => fetchCommentsByTaskIdFn(projectId, taskId),
      }),
  },

  createOnTask: {
    useMutation: (
      projectId: string,
      taskId: string,
      sessionUserId: string,
      sessionUserName: string,
    ) => {
      const queryClient = useQueryClient()
      return useMutation<
        CommentResponse,
        Error,
        CreateCommentRequest,
        { previous?: CommentResponse[] }
      >({
        mutationFn: (payload) =>
          createTaskCommentFn(projectId, taskId, payload),
        onMutate: async (newComment) => {
          await queryClient.cancelQueries({
            queryKey: ['taskComments', taskId],
          })

          const previous = queryClient.getQueryData<CommentResponse[]>([
            'taskComments',
            taskId,
          ])

          // Optimistically add the new invitation (with a temp id/email if needed)
          queryClient.setQueryData<CommentResponse[]>(
            ['taskComments', taskId],
            (old = []) => [
              ...old,
              {
                ...newComment,
                id: `temp-${Math.random()}`,
                createdAt: new Date(),
                memberId: sessionUserId,
                memberName: sessionUserName,
              },
            ],
          )

          return { previous }
        },
        onSuccess: (data) => {
          queryClient.setQueryData<CommentResponse[]>(
            ['taskComments', taskId],
            (old = []) => old.map((p) => (p.id === data.id ? data : p)),
          )
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
    useMutation: (projectId: string, taskId: string) => {
      const queryClient = useQueryClient()
      return useMutation<
        CommentResponse,
        Error,
        { id: string; projectId: string; data: UpdateCommentRequest },
        { previous?: CommentResponse[] }
      >({
        mutationFn: ({ id, data }) =>
          updateTaskCommentFn(projectId, taskId, id, data),
        onMutate: async ({ id, data }) => {
          await queryClient.cancelQueries({ queryKey: ['taskComments', id] })

          const previous = queryClient.getQueryData<CommentResponse[]>([
            'taskComments',
            id,
          ])

          // Optimistically update the invitation in the cache
          queryClient.setQueryData<CommentResponse[]>(
            ['taskComments'],
            (old = []) => old.map((c) => (c.id === id ? { ...c, ...data } : c)),
          )

          return { previous }
        },
        onSuccess: (data, vars) => {
          queryClient.setQueryData<CommentResponse[]>(
            ['taskComments', vars.id],
            (old = []) => old.map((p) => (p.id === data.id ? data : p)),
          )
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
    useMutation: (projectId: string, taskId: string) => {
      const queryClient = useQueryClient()
      return useMutation<
        { success: boolean },
        Error,
        string,
        { previous?: CommentResponse[] }
      >({
        mutationFn: (commentId) =>
          deleteTaskCommentFn(projectId, taskId, commentId),
        onMutate: async (id) => {
          await queryClient.cancelQueries({
            queryKey: ['taskComments', taskId],
          })

          const previous = queryClient.getQueryData<CommentResponse[]>([
            'taskComments',
            taskId,
          ])

          // Optimistically remove the invitation from the cache
          queryClient.setQueryData<CommentResponse[]>(
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
