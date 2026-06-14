// src/modules/organization/tags/hooks/api.ts
import type {
  PaginatedResponse,
  PaginationParams,
} from '@src/modules/api.types'
import { api } from '@src/modules/shared/api'
import type {
  CreateTagCommand,
  TagResponse,
  UpdateTagCommand,
} from './tags.types'

export const fetchTagsFn = async (
  organizationId: string,
  scope?: number,
  paginationParams?: PaginationParams,
): Promise<PaginatedResponse<TagResponse>> => {
  const { data } = await api.get(`organization/${organizationId}/tags`, {
    params: { ...paginationParams, ...(scope != null ? { scope } : {}) },
  })
  return data
}

export const fetchTagByIdFn = async (
  organizationId: string,
  tagId: string,
): Promise<TagResponse> => {
  const { data } = await api.get(`organization/${organizationId}/tags/${tagId}`)
  return data.data
}

export const createTagFn = async (
  organizationId: string,
  payload: CreateTagCommand,
): Promise<TagResponse> => {
  const { data } = await api.post(
    `organization/${organizationId}/tags`,
    payload,
  )
  return data.data
}

export const updateTagFn = async (
  organizationId: string,
  tagId: string,
  payload: UpdateTagCommand,
): Promise<TagResponse> => {
  const { data } = await api.put(
    `organization/${organizationId}/tags/${tagId}`,
    payload,
  )
  return data.data
}

export const deleteTagFn = async (
  organizationId: string,
  tagId: string,
): Promise<void> => {
  await api.delete(`organization/${organizationId}/tags/${tagId}`)
}
