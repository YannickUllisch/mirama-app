import type { AccessScope } from '@/prisma/generated/client'

export type ResourcePermission = {
  resource: string
  label: string
  description: string
  actions: readonly string[]
  allowedScopes: AccessScope[]
  actionsForScope?: Partial<Record<AccessScope, readonly string[]>>
}

export const RESOURCE_PERMISSIONS: ResourcePermission[] = [
  {
    resource: 'project',
    label: 'Projects',
    description:
      'Controls access to projects within the organization. Org-scope grants access to ALL projects; project-scope grants access to a specific project.',
    actions: ['read', 'create', 'update', 'delete'] as const,
    allowedScopes: ['ORGANIZATION', 'PROJECT'],
    actionsForScope: {
      PROJECT: ['read', 'update', 'delete'],
    },
  },
  {
    resource: 'task',
    label: 'Tasks',
    description: 'Controls access to tasks across projects.',
    actions: ['read', 'create', 'update', 'delete', 'assign'] as const,
    allowedScopes: ['ORGANIZATION', 'PROJECT'],
  },
  {
    resource: 'member',
    label: 'Members',
    description:
      'Manage organization members — invite, remove, and update roles.',
    actions: ['read', 'create', 'update', 'delete', 'invite'] as const,
    allowedScopes: ['ORGANIZATION'],
  },
  {
    resource: 'milestone',
    label: 'Milestones',
    description: 'Manage project milestones within the organization.',
    actions: ['read', 'create', 'update', 'delete'] as const,
    allowedScopes: ['ORGANIZATION', 'PROJECT'],
  },
  {
    resource: 'tag',
    label: 'Tags',
    description: 'Create and manage tags used across projects and tasks.',
    actions: ['read', 'create', 'update', 'delete'] as const,
    allowedScopes: ['ORGANIZATION', 'PROJECT'],
  },
  {
    resource: 'invitation',
    label: 'Invitations',
    description: 'Send and manage organization invitations.',
    actions: ['read', 'create', 'update', 'delete'] as const,
    allowedScopes: ['ORGANIZATION'],
  },
  {
    resource: 'team',
    label: 'Teams',
    description: 'Create and manage teams within the organization.',
    actions: ['read', 'create', 'update', 'delete'] as const,
    allowedScopes: ['ORGANIZATION'],
  },
  {
    resource: 'comment',
    label: 'Comments',
    description: 'Create and manage comments on tasks.',
    actions: ['read', 'create', 'update', 'delete'] as const,
    allowedScopes: ['ORGANIZATION', 'PROJECT'],
  },
  {
    resource: 'expense',
    label: 'Expenses',
    description: 'Track and manage project expenses.',
    actions: ['read', 'create', 'update', 'delete'] as const,
    allowedScopes: ['ORGANIZATION', 'PROJECT'],
  },
  {
    resource: 'organization',
    label: 'Organization',
    description: 'Organization-level settings, billing, and configuration.',
    actions: ['read', 'update', 'delete'] as const,
    allowedScopes: ['ORGANIZATION'],
  },
] as const
