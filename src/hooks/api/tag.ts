import type { CreateTagRequest } from '@/server/modules/account/tags/features/create-tag/schema'
import type { TagResponse } from '@/server/modules/account/tags/features/response'
import type { UpdateTagRequest } from '@/server/modules/account/tags/features/update-tag/schema'
import { api } from '@src/lib/api'

export const fetchTagsFn = async (): Promise<TagResponse[]> => {
  const { data } = await api.get('tag')
  return data
}

export const createTagFn = async (payload: CreateTagRequest) => {
  const { data } = await api.post('tag', payload)
  return data
}

export const updateTagFn = async (id: string, payload: UpdateTagRequest) => {
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
