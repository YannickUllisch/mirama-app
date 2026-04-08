// server/shared/domain/evaluate-permissions.ts

type Statement = {
  effect: string
  action: string
  resource: string
}

/**
 * Evaluates whether a set of policy statements grants access for
 * the requested action + resource pair.
 *
 * Supports wildcard matching following the PolicyStatement convention:
 *  - "*"          → matches everything
 *  - "project:*"  → matches "project:read", "project:create", etc.
 *  - "*:read"     → matches "project:read", "task:read", etc.
 *  - "project/*"  → matches "project/abc123", etc.
 */
export const evaluateStatements = (
  statements: Statement[],
  action: string,
  resource: string,
): boolean => {
  let granted = false

  for (const s of statements) {
    if (matchPattern(s.action, action) && matchPattern(s.resource, resource)) {
      if (s.effect === 'DENY') return false
      granted = true
    }
  }

  return granted
}

const matchPattern = (pattern: string, value: string): boolean => {
  if (pattern === '*') return true
  if (pattern === value) return true

  // Convert wildcards to a regex: escape specials, replace * with .*
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&')
  const regexStr = `^${escaped.replace(/\*/g, '.*')}$`
  return new RegExp(regexStr).test(value)
}
