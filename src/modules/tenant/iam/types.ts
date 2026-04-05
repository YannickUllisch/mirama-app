export type StatementDraft = {
  effect: 'ALLOW' | 'DENY'
  action: string
  resource: string
}

export type IamScope =
  | { type: 'tenant' }
  | {
      type: 'project'
      organizationId: string
      organizationName?: string
      projectId: string
      projectName?: string
    }
