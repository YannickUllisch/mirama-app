import type {
  CreateTagType,
  TagResponseType,
  UpdateTagType,
} from '@server/domain/tagSchema'
import { api } from '@src/lib/api'

export const fetchTagsFn = async (): Promise<TagResponseType[]> => {
  const { data } = await api.get('tag')
  return data
}

export const createTagFn = async (payload: CreateTagType) => {
  const { data } = await api.post('tag', payload)
  return data
}

export const updateTagFn = async (id: string, payload: UpdateTagType) => {
  const { data } = await api.put(`tag/${id}`, payload)
  return data
}

export const deleteTagFn = async (id: string) => {
  const { data } = await api.delete(`tag/${id}`)
  return data
}

export const deleteMultipleTagsFn = async (ids: string[]) => {
  const { data } = await api.delete(`tag?ids=${ids}`)
  return data
}
