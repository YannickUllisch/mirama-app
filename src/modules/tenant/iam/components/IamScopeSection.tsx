import type { PolicyResponse } from '@server/modules/account/policies/features/response'
import type { RoleResponse } from '@server/modules/account/roles/features/response'
import { type LucideIcon, Shield } from 'lucide-react'
import { RoleCard } from '../roles/components/RoleCard'
import { SectionHeader } from './SectionHeader'

const IamScopeSection = ({
  icon,
  title,
  description,
  roles,
  policies,
  emptyLabel,
  onAttachPolicy,
  onDetachPolicy,
  onDeleteRole,
  onEditPolicy,
}: {
  icon: LucideIcon
  title: string
  description: string
  roles: RoleResponse[]
  policies: PolicyResponse[]
  emptyLabel: string
  onAttachPolicy: (roleId: string, policyId: string) => void
  onDetachPolicy: (roleId: string, policyId: string) => void
  onDeleteRole: (id: string) => void
  onEditPolicy: (policy: PolicyResponse) => void
}) => (
  <div className="space-y-3">
    <SectionHeader icon={icon} title={title} description={description} />
    {roles.length === 0 ? (
      <div className="flex items-center gap-2 text-xs text-muted-foreground/60 py-3 border border-dashed border-border rounded-xl px-4">
        <Shield className="w-3.5 h-3.5 shrink-0" />
        {emptyLabel}
      </div>
    ) : (
      <div className="space-y-2">
        {roles.map((r) => (
          <RoleCard
            key={r.id}
            role={r}
            allPolicies={policies}
            onAttach={(policyId) => onAttachPolicy(r.id, policyId)}
            onDetach={(policyId) => onDetachPolicy(r.id, policyId)}
            onDelete={() => onDeleteRole(r.id)}
            onEditPolicy={onEditPolicy}
          />
        ))}
      </div>
    )}
  </div>
)

export default IamScopeSection
