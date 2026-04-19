// src/modules/project/task/comments/hooks/api.ts
import type { CommentResponse } from '@/server/modules/task/features/comments/response'
import type {
  CreateCommentRequest,
  UpdateCommentRequest,
} from '@/server/modules/task/features/comments/schema'
import { api } from '@src/lib/api'

export const fetchCommentsByTaskIdFn = async (
  projectId: string,
  taskId: string,
): Promise<CommentResponse[]> => {
  const { data } = await api.get(
    `project/${projectId}/tasks/${taskId}/comments`,
  )
  return data
}

export const createTaskCommentFn = async (
  projectId: string,
  taskId: string,
  payload: CreateCommentRequest,
) => {
  const { data } = await api.post(
    `project/${projectId}/tasks/${taskId}/comments`,
    payload,
  )
  return data
}

export const updateTaskCommentFn = async (
  projectId: string,
  taskId: string,
  commentId: string,
  payload: UpdateCommentRequest,
) => {
  const { data } = await api.put(
    `project/${projectId}/tasks/${taskId}/comments/${commentId}`,
    payload,
  )
  return data
}

export const deleteTaskCommentFn = async (
  projectId: string,
  taskId: string,
  commentId: string,
) => {
  const { data } = await api.delete(
    `project/${projectId}/tasks/${taskId}/comments/${commentId}`,
  )
  return data
}
