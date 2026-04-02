import type {
  PolicyResponse,
  RoleResponse,
} from '@/server/modules/account/roles/features/response'
import { Input } from '@ui/input'
import { Loader2, Search, Shield } from 'lucide-react'
import { useState } from 'react'
import { RoleCard } from '../RoleCard'
import { CreateRoleDialog } from '../dialogs/CreateRoleDialog'

type Props = {
  roles: RoleResponse[]
  policies: PolicyResponse[]
  isLoading: boolean
  onCreateRole: (data: { name: string; description?: string }) => void
  onDeleteRole: (id: string) => void
  onAttachPolicy: (roleId: string, policyId: string) => void
  onDetachPolicy: (roleId: string, policyId: string) => void
  onEditPolicy: (policy: PolicyResponse) => void
}

export const RolesTab = ({
  roles,
  policies,
  isLoading,
  onCreateRole,
  onDeleteRole,
  onAttachPolicy,
  onDetachPolicy,
  onEditPolicy,
}: Props) => {
  const [search, setSearch] = useState('')

  const filtered = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <Input
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <CreateRoleDialog onSubmit={onCreateRole} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((r) => (
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
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Shield className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mb-3" />
          <p className="text-sm font-medium text-neutral-500">No roles found</p>
          {search && (
            <p className="text-xs text-neutral-400 mt-1">
              Try a different search term.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
