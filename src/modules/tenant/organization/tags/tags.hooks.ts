import { optimisticList } from '@src/modules/shared/hooks/helpers'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useOrganizationResource } from '../organizationResourceContext'
import {
  createTagFn,
  deleteTagFn,
  fetchTagByIdFn,
  fetchTagsFn,
  updateTagFn,
} from './tags.api'
import type {
  CreateTagCommand,
  TagResponse,
  UpdateTagCommand,
} from './tags.types'

export const tagKeys = {
  root: ['tags'] as const,
  org: (orgId: string) => [...tagKeys.root, orgId] as const,
  list: (orgId: string, scope?: number) =>
    scope != null
      ? ([...tagKeys.org(orgId), 'list', scope] as const)
      : ([...tagKeys.org(orgId), 'list'] as const),
  detail: (orgId: string, tagId: string) =>
    [...tagKeys.org(orgId), tagId] as const,
}

const tags = {
  fetchAll: {
    useQuery: (scope?: number) => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<TagResponse[]>({
        queryKey: tagKeys.list(activeOrganizationId, scope),
        queryFn: () => fetchTagsFn(activeOrganizationId, scope),
        enabled: !!activeOrganizationId,
      })
    },
  },

  fetchById: {
    useQuery: (tagId: string) => {
      const { activeOrganizationId } = useOrganizationResource()
      return useQuery<TagResponse>({
        queryKey: tagKeys.detail(activeOrganizationId, tagId),
        queryFn: () => fetchTagByIdFn(activeOrganizationId, tagId),
        enabled: !!activeOrganizationId && !!tagId,
      })
    },
  },

  create: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const qc = useQueryClient()

      return useMutation<
        TagResponse,
        Error,
        CreateTagCommand,
        { previous?: TagResponse[] }
      >({
        mutationFn: (payload) => createTagFn(activeOrganizationId, payload),
        ...optimisticList<TagResponse, CreateTagCommand>(
          qc,
          tagKeys.list(activeOrganizationId),
          {
            invalidateKey: tagKeys.org(activeOrganizationId),
            successMessage: 'Tag created',
            apply: (old, vars) => [
              ...old,
              {
                id: `temp-${Date.now()}`,
                name: vars.name,
                slug: vars.name.toLowerCase().replace(/\s+/g, '-'),
                color: vars.color ?? null,
                description: vars.description ?? null,
                scope: String(vars.scope),
                scopeValue: vars.scope,
                organizationId: activeOrganizationId,
                dateCreated: new Date(),
              } satisfies TagResponse,
            ],
          },
        ),
      })
    },
  },

  update: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const qc = useQueryClient()
      type Vars = { tagId: string; data: UpdateTagCommand }

      return useMutation<
        TagResponse,
        Error,
        Vars,
        { previous?: TagResponse[] }
      >({
        mutationFn: ({ tagId, data }) =>
          updateTagFn(activeOrganizationId, tagId, data),
        ...optimisticList<TagResponse, Vars>(
          qc,
          tagKeys.list(activeOrganizationId),
          {
            invalidateKey: tagKeys.org(activeOrganizationId),
            successMessage: 'Tag updated',
            apply: (old, { tagId, data }) =>
              old.map((t) =>
                t.id === tagId
                  ? {
                      ...t,
                      ...data,
                      scope: String(data.scope),
                      scopeValue: data.scope,
                    }
                  : t,
              ),
          },
        ),
      })
    },
  },

  remove: {
    useMutation: () => {
      const { activeOrganizationId } = useOrganizationResource()
      const qc = useQueryClient()

      return useMutation<void, Error, string, { previous?: TagResponse[] }>({
        mutationFn: (tagId) => deleteTagFn(activeOrganizationId, tagId),
        ...optimisticList<TagResponse, string>(
          qc,
          tagKeys.list(activeOrganizationId),
          {
            invalidateKey: tagKeys.org(activeOrganizationId),
            successMessage: 'Tag deleted',
            apply: (old, tagId) => old.filter((t) => t.id !== tagId),
          },
        ),
      })
    },
  },
}

export default tags
