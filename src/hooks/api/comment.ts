import type {
  CommentResponseType,
  CreateCommentType,
  UpdateCommentType,
} from '@server/domain/commentSchema'
import { api } from '@src/lib/api'

export const fetchCommentsByTaskIdFn = async (
  id: string,
): Promise<CommentResponseType[]> => {
  const { data } = await api.get(`task/comments/${id}`)
  return data
}

export const createTaskCommentFn = async (payload: CreateCommentType) => {
  const { data } = await api.post('task/comment', payload)
  return data
}

export const updateTaskCommentFn = async (
  id: string,
  payload: UpdateCommentType,
) => {
  const { data } = await api.put(`task/comment/${id}`, payload)
  return data
}

export const deleteTaskCommentFn = async (id: string) => {
  const { data } = await api.delete(`task/comment/${id}`)
  return data
}
