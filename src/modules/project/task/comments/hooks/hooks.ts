// src/modules/project/task/comments/hooks/hooks.ts
import type { CommentResponse } from '@/server/modules/task/features/comments/response'
import type {
  CreateCommentRequest,
  UpdateCommentRequest,
} from '@/server/modules/task/features/comments/schema'
import { optimisticList } from '@src/modules/shared/hooks/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTaskCommentFn,
  deleteTaskCommentFn,
  fetchCommentsByTaskIdFn,
  updateTaskCommentFn,
} from './api'

export const commentKeys = {
  root: ['taskComments'] as const,
  task: (taskId: string) => [...commentKeys.root, taskId] as const,
}

const comment = {
  fetchByTaskId: {
    useQuery: (projectId: string, taskId: string) =>
      useQuery<CommentResponse[]>({
        enabled: !!taskId,
        queryKey: commentKeys.task(taskId),
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
      const qc = useQueryClient()
      return useMutation<
        CommentResponse,
        Error,
        CreateCommentRequest,
        { previous?: CommentResponse[] }
      >({
        mutationFn: (payload) =>
          createTaskCommentFn(projectId, taskId, payload),
        ...optimisticList<CommentResponse, CreateCommentRequest>(
          qc,
          commentKeys.task(taskId),
          {
            successMessage: 'Comment added',
            apply: (old, vars) => [
              ...old,
              {
                ...vars,
                id: `temp-${Date.now()}`,
                createdAt: new Date(),
                memberId: sessionUserId,
                memberName: sessionUserName,
              },
            ],
          },
        ),
      })
    },
  },

  updateTaskComment: {
    useMutation: (projectId: string, taskId: string) => {
      const qc = useQueryClient()
      return useMutation<
        CommentResponse,
        Error,
        { id: string; data: UpdateCommentRequest },
        { previous?: CommentResponse[] }
      >({
        mutationFn: ({ id, data }) =>
          updateTaskCommentFn(projectId, taskId, id, data),
        ...optimisticList<
          CommentResponse,
          { id: string; data: UpdateCommentRequest }
        >(qc, commentKeys.task(taskId), {
          successMessage: 'Comment updated',
          apply: (old, { id, data }) =>
            old.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }),
      })
    },
  },

  deleteTaskComment: {
    useMutation: (projectId: string, taskId: string) => {
      const qc = useQueryClient()
      return useMutation<
        { success: boolean },
        Error,
        string,
        { previous?: CommentResponse[] }
      >({
        mutationFn: (commentId) =>
          deleteTaskCommentFn(projectId, taskId, commentId),
        ...optimisticList<CommentResponse, string>(
          qc,
          commentKeys.task(taskId),
          {
            successMessage: 'Comment deleted',
            apply: (old, id) => old.filter((c) => c.id !== id),
          },
        ),
      })
    },
  },
}

export default comment
