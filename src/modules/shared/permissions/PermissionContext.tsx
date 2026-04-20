// src/modules/shared/permissions/PermissionContext.tsx
'use client'

import type {
  ActionFor,
  ResourceName,
} from '@/server/shared/domain/permissions'
import { createContext, useContext, useMemo } from 'react'

type PermissionContextType = {
  grants: string[]
}

const PermissionContext = createContext<PermissionContextType | null>(null)

export const PermissionProvider = ({
  children,
  grants,
}: {
  children: React.ReactNode
  grants: string[]
}) => {
  const value = useMemo(() => ({ grants }), [grants])
  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  )
}

/**
 * Returns a type-safe `can(resource, action)` function that evaluates the
 * current user's flattened permission set.
 *
 * Usage:
 *   const { can } = usePermissions()
 *   can('project', 'read')   // boolean
 *   can('task', 'assign')    // boolean
 */
export const usePermissions = () => {
  const ctx = useContext(PermissionContext)
  if (!ctx) {
    throw new Error('usePermissions must be used within a PermissionProvider')
  }

  const can = useMemo(() => {
    const grantSet = ctx.grants

    return <R extends ResourceName>(
      resource: R,
      action: ActionFor<R>,
    ): boolean => {
      const target = `${resource}:${action}`
      const targetResource = `${resource}/*`

      for (const grant of grantSet) {
        const [gAction, gResource] = grant.split('::')
        if (
          matchPattern(gAction, target) &&
          matchPattern(gResource, targetResource)
        ) {
          return true
        }
      }
      return false
    }
  }, [ctx.grants])

  return { can, grants: ctx.grants }
}

/**
 * Matches a grant pattern against a concrete value.
 * Supports:
 *  - "*"         → matches everything
 *  - "project:*" → matches "project:read", "project:create", etc.
 *  - "*:read"    → matches "project:read", "task:read", etc.
 *  - "project/*" → matches "project/abc123", etc.
 */
const matchPattern = (pattern: string, value: string): boolean => {
  if (pattern === '*') return true
  if (pattern === value) return true

  // Convert wildcards to a simple regex
  // Escape all regex-special chars except *, then replace * with .*
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
  const regexStr = `^${escaped.replace(/\*/g, '.*')}$`
  return new RegExp(regexStr).test(value)
}
