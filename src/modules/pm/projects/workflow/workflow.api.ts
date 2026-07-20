// src/modules/pm/projects/workflow/workflow.api.ts
import type {
  PaginatedResponse,
  PaginationParams,
} from '@src/modules/api.types'
import { api } from '@src/modules/shared/api'
import type {
  AddPriorityCommand,
  AddStatusCommand,
  PriorityResponse,
  StatusResponse,
  UpdatePriorityCommand,
  UpdateStatusCommand,
  WorkflowResponse,
} from './workflow.types'

const base = (organizationId: string, projectId: string) =>
  `organization/${organizationId}/projects/${projectId}/workflow`

export const fetchWorkflowFn = async (
  organizationId: string,
  projectId: string,
): Promise<WorkflowResponse> => {
  const { data } = await api.get(base(organizationId, projectId))
  return data
}

// Project Statuses

export const fetchProjectStatusesFn = async (
  organizationId: string,
  projectId: string,
  params?: PaginationParams,
): Promise<PaginatedResponse<StatusResponse>> => {
  const { data } = await api.get(
    `${base(organizationId, projectId)}/statuses`,
    { params },
  )
  return data
}

export const addProjectStatusFn = async (
  organizationId: string,
  projectId: string,
  payload: AddStatusCommand,
): Promise<StatusResponse> => {
  const { data } = await api.post(
    `${base(organizationId, projectId)}/statuses`,
    { projectId, ...payload },
  )
  return data
}

export const updateProjectStatusFn = async (
  organizationId: string,
  projectId: string,
  statusId: string,
  payload: UpdateStatusCommand,
): Promise<StatusResponse> => {
  const { data } = await api.put(
    `${base(organizationId, projectId)}/statuses/${statusId}`,
    { projectId, statusId, ...payload },
  )
  return data
}

export const removeProjectStatusFn = async (
  organizationId: string,
  projectId: string,
  statusId: string,
): Promise<void> => {
  await api.delete(`${base(organizationId, projectId)}/statuses/${statusId}`)
}

// Project Priorities

export const fetchProjectPrioritiesFn = async (
  organizationId: string,
  projectId: string,
  params?: PaginationParams,
): Promise<PaginatedResponse<PriorityResponse>> => {
  const { data } = await api.get(
    `${base(organizationId, projectId)}/priorities`,
    { params },
  )
  return data
}

export const addProjectPriorityFn = async (
  organizationId: string,
  projectId: string,
  payload: AddPriorityCommand,
): Promise<PriorityResponse> => {
  const { data } = await api.post(
    `${base(organizationId, projectId)}/priorities`,
    { projectId, ...payload },
  )
  return data
}

export const updateProjectPriorityFn = async (
  organizationId: string,
  projectId: string,
  priorityId: string,
  payload: UpdatePriorityCommand,
): Promise<PriorityResponse> => {
  const { data } = await api.put(
    `${base(organizationId, projectId)}/priorities/${priorityId}`,
    { projectId, priorityId, ...payload },
  )
  return data
}

export const removeProjectPriorityFn = async (
  organizationId: string,
  projectId: string,
  priorityId: string,
): Promise<void> => {
  await api.delete(
    `${base(organizationId, projectId)}/priorities/${priorityId}`,
  )
}

// Task Statuses

export const fetchTaskStatusesFn = async (
  organizationId: string,
  projectId: string,
  params?: PaginationParams,
): Promise<PaginatedResponse<StatusResponse>> => {
  const { data } = await api.get(
    `${base(organizationId, projectId)}/task-statuses`,
    { params },
  )
  return data
}

export const addTaskStatusFn = async (
  organizationId: string,
  projectId: string,
  payload: AddStatusCommand,
): Promise<StatusResponse> => {
  const { data } = await api.post(
    `${base(organizationId, projectId)}/task-statuses`,
    { projectId, ...payload },
  )
  return data
}

export const updateTaskStatusFn = async (
  organizationId: string,
  projectId: string,
  statusId: string,
  payload: UpdateStatusCommand,
): Promise<StatusResponse> => {
  const { data } = await api.put(
    `${base(organizationId, projectId)}/task-statuses/${statusId}`,
    { projectId, statusId, ...payload },
  )
  return data
}

export const removeTaskStatusFn = async (
  organizationId: string,
  projectId: string,
  statusId: string,
): Promise<void> => {
  await api.delete(
    `${base(organizationId, projectId)}/task-statuses/${statusId}`,
  )
}

// Task Priorities

export const fetchTaskPrioritiesFn = async (
  organizationId: string,
  projectId: string,
  params?: PaginationParams,
): Promise<PaginatedResponse<PriorityResponse>> => {
  const { data } = await api.get(
    `${base(organizationId, projectId)}/task-priorities`,
    { params },
  )
  return data
}

export const addTaskPriorityFn = async (
  organizationId: string,
  projectId: string,
  payload: AddPriorityCommand,
): Promise<PriorityResponse> => {
  const { data } = await api.post(
    `${base(organizationId, projectId)}/task-priorities`,
    { projectId, ...payload },
  )
  return data
}

export const updateTaskPriorityFn = async (
  organizationId: string,
  projectId: string,
  priorityId: string,
  payload: UpdatePriorityCommand,
): Promise<PriorityResponse> => {
  const { data } = await api.put(
    `${base(organizationId, projectId)}/task-priorities/${priorityId}`,
    { projectId, priorityId, ...payload },
  )
  return data
}

export const removeTaskPriorityFn = async (
  organizationId: string,
  projectId: string,
  priorityId: string,
): Promise<void> => {
  await api.delete(
    `${base(organizationId, projectId)}/task-priorities/${priorityId}`,
  )
}
