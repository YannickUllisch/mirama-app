// src/modules/pm/projects/workflow/workflow.hooks.ts
import { usePaginatedQuery } from '@src/modules/shared/hooks/helpers'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addProjectPriorityFn,
  addProjectStatusFn,
  addTaskPriorityFn,
  addTaskStatusFn,
  fetchProjectPrioritiesFn,
  fetchProjectStatusesFn,
  fetchTaskPrioritiesFn,
  fetchTaskStatusesFn,
  fetchWorkflowFn,
  removeProjectPriorityFn,
  removeProjectStatusFn,
  removeTaskPriorityFn,
  removeTaskStatusFn,
  updateProjectPriorityFn,
  updateProjectStatusFn,
  updateTaskPriorityFn,
  updateTaskStatusFn,
} from './workflow.api'
import type {
  AddPriorityCommand,
  AddStatusCommand,
  PriorityResponse,
  StatusResponse,
  UpdatePriorityCommand,
  UpdateStatusCommand,
  WorkflowResponse,
} from './workflow.types'

export const workflowKeys = {
  root: (orgId: string, projectId: string) =>
    ['workflow', orgId, projectId] as const,
  detail: (orgId: string, projectId: string) =>
    [...workflowKeys.root(orgId, projectId), 'detail'] as const,
  projectStatuses: (orgId: string, projectId: string) =>
    [...workflowKeys.root(orgId, projectId), 'project-statuses'] as const,
  projectPriorities: (orgId: string, projectId: string) =>
    [...workflowKeys.root(orgId, projectId), 'project-priorities'] as const,
  taskStatuses: (orgId: string, projectId: string) =>
    [...workflowKeys.root(orgId, projectId), 'task-statuses'] as const,
  taskPriorities: (orgId: string, projectId: string) =>
    [...workflowKeys.root(orgId, projectId), 'task-priorities'] as const,
}

const workflow = {
  fetchWorkflow: {
    useQuery: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<WorkflowResponse>({
        queryKey: workflowKeys.detail(activeOrganizationId, projectId),
        queryFn: () => fetchWorkflowFn(activeOrganizationId, projectId),
        enabled: !!projectId,
      })
    },
  },

  // Project Statuses
  fetchProjectStatuses: {
    useQuery: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      return usePaginatedQuery<StatusResponse>(
        workflowKeys.projectStatuses(activeOrganizationId, projectId),
        (params) =>
          fetchProjectStatusesFn(activeOrganizationId, projectId, params),
      )
    },
  },

  addProjectStatus: {
    useMutation: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      return useMutation<StatusResponse, Error, AddStatusCommand>({
        mutationFn: (payload) =>
          addProjectStatusFn(activeOrganizationId, projectId, payload),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: workflowKeys.root(activeOrganizationId, projectId),
          })
        },
      })
    },
  },

  updateProjectStatus: {
    useMutation: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      type Vars = { statusId: string; data: UpdateStatusCommand }
      return useMutation<StatusResponse, Error, Vars>({
        mutationFn: ({ statusId, data }) =>
          updateProjectStatusFn(
            activeOrganizationId,
            projectId,
            statusId,
            data,
          ),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: workflowKeys.root(activeOrganizationId, projectId),
          })
        },
      })
    },
  },

  removeProjectStatus: {
    useMutation: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      return useMutation<void, Error, string>({
        mutationFn: (statusId) =>
          removeProjectStatusFn(activeOrganizationId, projectId, statusId),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: workflowKeys.root(activeOrganizationId, projectId),
          })
        },
      })
    },
  },

  // Project Priorities
  fetchProjectPriorities: {
    useQuery: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      return usePaginatedQuery<PriorityResponse>(
        workflowKeys.projectPriorities(activeOrganizationId, projectId),
        (params) =>
          fetchProjectPrioritiesFn(activeOrganizationId, projectId, params),
      )
    },
  },

  addProjectPriority: {
    useMutation: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      return useMutation<PriorityResponse, Error, AddPriorityCommand>({
        mutationFn: (payload) =>
          addProjectPriorityFn(activeOrganizationId, projectId, payload),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: workflowKeys.root(activeOrganizationId, projectId),
          })
        },
      })
    },
  },

  updateProjectPriority: {
    useMutation: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      type Vars = { priorityId: string; data: UpdatePriorityCommand }
      return useMutation<PriorityResponse, Error, Vars>({
        mutationFn: ({ priorityId, data }) =>
          updateProjectPriorityFn(
            activeOrganizationId,
            projectId,
            priorityId,
            data,
          ),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: workflowKeys.root(activeOrganizationId, projectId),
          })
        },
      })
    },
  },

  removeProjectPriority: {
    useMutation: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      return useMutation<void, Error, string>({
        mutationFn: (priorityId) =>
          removeProjectPriorityFn(activeOrganizationId, projectId, priorityId),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: workflowKeys.root(activeOrganizationId, projectId),
          })
        },
      })
    },
  },

  // Task Statuses
  fetchTaskStatuses: {
    useQuery: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      return usePaginatedQuery<StatusResponse>(
        workflowKeys.taskStatuses(activeOrganizationId, projectId),
        (params) =>
          fetchTaskStatusesFn(activeOrganizationId, projectId, params),
      )
    },
  },

  addTaskStatus: {
    useMutation: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      return useMutation<StatusResponse, Error, AddStatusCommand>({
        mutationFn: (payload) =>
          addTaskStatusFn(activeOrganizationId, projectId, payload),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: workflowKeys.root(activeOrganizationId, projectId),
          })
        },
      })
    },
  },

  updateTaskStatus: {
    useMutation: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      type Vars = { statusId: string; data: UpdateStatusCommand }
      return useMutation<StatusResponse, Error, Vars>({
        mutationFn: ({ statusId, data }) =>
          updateTaskStatusFn(activeOrganizationId, projectId, statusId, data),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: workflowKeys.root(activeOrganizationId, projectId),
          })
        },
      })
    },
  },

  removeTaskStatus: {
    useMutation: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      return useMutation<void, Error, string>({
        mutationFn: (statusId) =>
          removeTaskStatusFn(activeOrganizationId, projectId, statusId),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: workflowKeys.root(activeOrganizationId, projectId),
          })
        },
      })
    },
  },

  // Task Priorities
  fetchTaskPriorities: {
    useQuery: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      return usePaginatedQuery<PriorityResponse>(
        workflowKeys.taskPriorities(activeOrganizationId, projectId),
        (params) =>
          fetchTaskPrioritiesFn(activeOrganizationId, projectId, params),
      )
    },
  },

  addTaskPriority: {
    useMutation: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      return useMutation<PriorityResponse, Error, AddPriorityCommand>({
        mutationFn: (payload) =>
          addTaskPriorityFn(activeOrganizationId, projectId, payload),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: workflowKeys.root(activeOrganizationId, projectId),
          })
        },
      })
    },
  },

  updateTaskPriority: {
    useMutation: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      type Vars = { priorityId: string; data: UpdatePriorityCommand }
      return useMutation<PriorityResponse, Error, Vars>({
        mutationFn: ({ priorityId, data }) =>
          updateTaskPriorityFn(
            activeOrganizationId,
            projectId,
            priorityId,
            data,
          ),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: workflowKeys.root(activeOrganizationId, projectId),
          })
        },
      })
    },
  },

  removeTaskPriority: {
    useMutation: (projectId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      const queryClient = useQueryClient()
      return useMutation<void, Error, string>({
        mutationFn: (priorityId) =>
          removeTaskPriorityFn(activeOrganizationId, projectId, priorityId),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: workflowKeys.root(activeOrganizationId, projectId),
          })
        },
      })
    },
  },
}

export default workflow
