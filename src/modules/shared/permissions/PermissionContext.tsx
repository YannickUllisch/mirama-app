// src/modules/shared/permissions/PermissionContext.tsx
'use client'

import { createContext, useContext, useMemo } from 'react'

type PermissionContextType = {
  /** Raw granted entries in "action::resource" format, including wildcards */
  grants: string[]
}

const PermissionContext = createContext<PermissionContextType | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────

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

// ── Hook ───────────────────────────────────────────────────────────────────

/**
 * Returns a `can(action, resource)` function that evaluates the current
 * user's flattened permission set.
 *
 * Supports wildcard matching following the `action::resource` convention
 * from PolicyStatement seed data:
 *  - `*::*`                → full access
 *  - `project:*::project/*`  → any action on projects
 *  - `*:read::*`           → read on everything
 */
export const usePermissions = () => {
  const ctx = useContext(PermissionContext)
  if (!ctx) {
    throw new Error('usePermissions must be used within a PermissionProvider')
  }

  const can = useMemo(() => {
    const grantSet = ctx.grants

    return (action: string, resource: string): boolean => {
      for (const grant of grantSet) {
        const [gAction, gResource] = grant.split('::')
        if (
          matchPattern(gAction, action) &&
          matchPattern(gResource, resource)
        ) {
          return true
        }
      }
      return false
    }
  }, [ctx.grants])

  return { can, grants: ctx.grants }
}

// ── Pattern matching ───────────────────────────────────────────────────────

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
