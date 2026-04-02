export const RESOURCE_PERMISSIONS = [
  {
    resource: 'project',
    label: 'Projects',
    description:
      'Controls access to ALL projects within an organization. Granting project rights gives the user access to every public project.',
    actions: ['read', 'create', 'update', 'delete'] as const,
  },
  {
    resource: 'task',
    label: 'Tasks',
    description:
      'Controls access to tasks across all projects in the organization.',
    actions: ['read', 'create', 'update', 'delete', 'assign'] as const,
  },
  {
    resource: 'member',
    label: 'Members',
    description:
      'Manage organization members — invite, remove, and update roles.',
    actions: ['read', 'create', 'update', 'delete', 'invite'] as const,
  },
  {
    resource: 'milestone',
    label: 'Milestones',
    description: 'Manage project milestones within the organization.',
    actions: ['read', 'create', 'update', 'delete'] as const,
  },
  {
    resource: 'tag',
    label: 'Tags',
    description: 'Create and manage tags used across projects and tasks.',
    actions: ['read', 'create', 'update', 'delete'] as const,
  },
  {
    resource: 'invitation',
    label: 'Invitations',
    description: 'Send and manage organization invitations.',
    actions: ['read', 'create', 'update', 'delete'] as const,
  },
  {
    resource: 'team',
    label: 'Teams',
    description: 'Create and manage teams within the organization.',
    actions: ['read', 'create', 'update', 'delete'] as const,
  },
  {
    resource: 'organization',
    label: 'Organization',
    description: 'Organization-level settings, billing, and configuration.',
    actions: ['read', 'update', 'delete'] as const,
  },
] as const
