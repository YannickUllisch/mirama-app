import type { CreateOrganizationRequest } from '@/server/modules/account/organizations/features/create-organization/schema'
import type {
  OrganizationListResponse,
  OrganizationResponse,
} from '@/server/modules/account/organizations/features/response'
import type { UpdateOrganizationRequest } from '@/server/modules/account/organizations/features/update-organization/schema'
import {
  createOrganizationFn,
  fetchOrganizationsFn,
  updateOrganizationFn,
} from '@hooks/api/organization'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const organization = {
  fetchAll: {
    useQuery: (tenantId: string) =>
      useQuery<OrganizationListResponse[]>({
        queryKey: ['organizations'],
        queryFn: () => fetchOrganizationsFn(tenantId),
      }),
  },

  create: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        OrganizationResponse,
        Error,
        { tenantId: string; data: CreateOrganizationRequest },
        { previous?: OrganizationListResponse[] }
      >({
        mutationFn: ({ data, tenantId }) =>
          createOrganizationFn(tenantId, data),
        onMutate: async () => {
          await queryClient.cancelQueries({ queryKey: ['organizations'] })
          const previous = queryClient.getQueryData<OrganizationListResponse[]>(
            ['organizations'],
          )
          return { previous }
        },
        onSuccess: () => {
          toast.success('Organization created')
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['organizations'], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['organizations'] })
        },
      })
    },
  },

  update: {
    useMutation: () => {
      const queryClient = useQueryClient()
      return useMutation<
        OrganizationResponse,
        Error,
        { id: string; tenantId: string; data: UpdateOrganizationRequest },
        { previous?: OrganizationListResponse[] }
      >({
        mutationFn: ({ id, data, tenantId }) =>
          updateOrganizationFn(id, tenantId, data),
        onMutate: async ({ id, data }) => {
          await queryClient.cancelQueries({ queryKey: ['organizations'] })
          const previous = queryClient.getQueryData<OrganizationListResponse[]>(
            ['organizations'],
          )

          queryClient.setQueryData<OrganizationListResponse[]>(
            ['organizations'],
            (old = []) =>
              old.map((org) => (org.id === id ? { ...org, ...data } : org)),
          )

          return { previous }
        },
        onSuccess: () => {
          toast.success('Organization updated')
        },
        onError: (err, _vars, ctx) => {
          if (ctx?.previous) {
            queryClient.setQueryData(['organizations'], ctx.previous)
          }
          toast.error(err?.message || 'An error occurred')
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['organizations'] })
        },
      })
    },
  },
}

export default organization
