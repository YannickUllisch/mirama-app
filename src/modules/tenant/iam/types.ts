export type StatementDraft = {
  effect: 'ALLOW' | 'DENY'
  action: string
  resource: string
}
