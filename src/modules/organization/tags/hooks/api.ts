// src/modules/organization/tags/hooks/api.ts
import type { CreateTagRequest } from '@/server/modules/account/tags/features/create-tag/schema'
import type { TagResponse } from '@/server/modules/account/tags/features/response'
import type { UpdateTagRequest } from '@/server/modules/account/tags/features/update-tag/schema'
import { api } from '@src/modules/shared/api'

export const fetchTagsFn = async (
  organizationId: string,
): Promise<TagResponse[]> => {
  const { data } = await api.get(`organization/${organizationId}/tag`)
  return data.data
}

export const createTagFn = async (
  organizationId: string,
  payload: CreateTagRequest,
) => {
  const { data } = await api.post(`organization/${organizationId}/tag`, payload)
  return data.data
}

export const updateTagFn = async (
  organizationId: string,
  id: string,
  payload: UpdateTagRequest,
) => {
  const { data } = await api.put(
    `organization/${organizationId}/tag/${id}`,
    payload,
  )
  return data.data
}

export const deleteTagFn = async (organizationId: string, id: string) => {
  const { data } = await api.delete(`organization/${organizationId}/tag/${id}`)
  return data.data
}

export const deleteMultipleTagsFn = async (
  organizationId: string,
  ids: string[],
) => {
  const { data } = await api.delete(
    `organization/${organizationId}/tag?ids=${ids}`,
  )
  return data.data
}
