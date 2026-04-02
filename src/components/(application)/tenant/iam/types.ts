export type StatementDraft = {
  effect: 'ALLOW' | 'DENY'
  action: string
  resource: string
}

/**
 * Determines how the IamManager is scoped.
 *
 * - `tenant`  → shows all tenant roles + policies + member-access explorer
 * - `project` → shows only the project-member role view (org + project are pre-set)
 */
export type IamScope =
  | { type: 'tenant' }
  | {
      type: 'project'
      organizationId: string
      organizationName?: string
      projectId: string
      projectName?: string
    }
