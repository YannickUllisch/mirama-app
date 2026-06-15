// server/shared/domain/permissions.ts

/**
 * Single source of truth for all IAM resource → action mappings.
 *
 * Usage (routes):
 *   import { P } from '@/server/shared/domain/permissions'
 *   permissions: P.project.read
 *
 * Usage (client `can()`):
 *   import type { ResourceName, ActionFor } from '@/server/shared/domain/permissions'
 *   can('project', 'read')
 */

const RESOURCE_ACTIONS = {
  project: ['read', 'create', 'update', 'delete'],
  task: ['read', 'create', 'update', 'delete', 'assign'],
  member: ['read', 'create', 'update', 'delete', 'invite'],
  milestone: ['read', 'create', 'update', 'delete'],
  tag: ['read', 'create', 'update', 'delete'],
  invitation: ['read', 'create', 'update', 'delete'],
  team: ['read', 'create', 'update', 'delete'],
  comment: ['read', 'create', 'update', 'delete'],
  expense: ['read', 'create', 'update', 'delete'],
  organization: ['read', 'update', 'delete'],
} as const

type ResourceActionMap = typeof RESOURCE_ACTIONS
export type ResourceName = keyof ResourceActionMap
export type ActionFor<R extends ResourceName> = ResourceActionMap[R][number]
export type IamAction = {
  [R in ResourceName]: `${R}:${ActionFor<R>}`
}[ResourceName]

/** All valid resource path patterns + the global wildcard. */
export type IamResource = `${ResourceName}/*` | '*'

/** A typed route-level permission requirement. */
export type PermissionRequirement = {
  action: IamAction
  resource: IamResource
}

type PermissionMap = {
  [R in ResourceName]: {
    [A in ActionFor<R>]: { action: `${R}:${A}`; resource: `${R}/*` }
  }
}

const buildPermissionMap = (): PermissionMap => {
  const map: Record<string, Record<string, PermissionRequirement>> = {}

  for (const [resource, actions] of Object.entries(RESOURCE_ACTIONS)) {
    map[resource] = {}
    for (const action of actions) {
      map[resource][action] = {
        action: `${resource}:${action}` as IamAction,
        resource: `${resource}/*` as IamResource,
      }
    }
  }

  return map as PermissionMap
}

export const P = buildPermissionMap()
