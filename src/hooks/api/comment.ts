import type {
  CommentResponseType,
  CreateCommentType,
  UpdateCommentType,
} from '@server/domain/commentSchema'
import { api } from '@src/lib/api'

export const fetchCommentsByTaskIdFn = async (
  projectId: string,
  taskId: string,
): Promise<CommentResponseType[]> => {
  const { data } = await api.get(
    `project/${projectId}/tasks/${taskId}/comments`,
  )
  return data
}

export const createTaskCommentFn = async (
  projectId: string,
  payload: CreateCommentType,
) => {
  const { data } = await api.post(
    `project/${projectId}/tasks/${payload.taskId}/comments`,
    payload,
  )
  return data
}

export const updateTaskCommentFn = async (
  projectId: string,
  taskId: string,
  commentId: string,
  payload: UpdateCommentType,
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
