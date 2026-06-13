// app/(app)/tenant/[tenantId]/roles/_components/AttachPolicyDialog.tsx
'use client'

import policyHooks from '@src/modules/tenant/iam/policy/hooks/policy.hooks'
import type { PolicyResponse } from '@src/modules/tenant/iam/policy/policy.types'
import roleHooks from '@src/modules/tenant/iam/roles/hooks/role.hooks'
import type {
  AccessScope,
  RoleWithPoliciesResponse,
} from '@src/modules/tenant/iam/roles/role.types'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog'
import { FileText, Link2, Unlink } from 'lucide-react'
import { useState } from 'react'

export const AttachPolicyDialog = ({
  role,
}: {
  role: RoleWithPoliciesResponse
}) => {
  const [open, setOpen] = useState(false)

  const { items: allPolicies = [], isLoading } = policyHooks.fetchAll.useQuery(
    role.scope as AccessScope,
  )
  const { mutate: attach, isPending: attaching } =
    roleHooks.attachPolicy.useMutation()
  const { mutate: detach, isPending: detaching } =
    roleHooks.detachPolicy.useMutation()

  const attachedIds = new Set(role.policies.map((p) => p.id))
  const unattached = allPolicies.filter((p) => !attachedIds.has(p.id))
  const isBusy = attaching || detaching

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          title="Manage policies"
        >
          <Link2 className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">{role.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Attached policies */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Attached ({role.policies.length})
            </p>
            {role.policies.length === 0 ? (
              <p className="text-xs text-muted-foreground/60 py-2 px-1">
                No policies attached.
              </p>
            ) : (
              <div className="space-y-1">
                {role.policies.map((p) => (
                  <PolicyRow
                    key={p.id}
                    policy={p}
                    action="detach"
                    disabled={role.isSystemRole || isBusy}
                    onAction={() => detach({ roleId: role.id, policyId: p.id })}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Available policies */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Available
            </p>
            {isLoading ? (
              <p className="text-xs text-muted-foreground/60 py-2 px-1">
                Loading...
              </p>
            ) : unattached.length === 0 ? (
              <p className="text-xs text-muted-foreground/60 py-2 px-1">
                All policies attached.
              </p>
            ) : (
              <div className="space-y-1 max-h-52 overflow-y-auto">
                {unattached.map((p) => (
                  <PolicyRow
                    key={p.id}
                    policy={p}
                    action="attach"
                    disabled={role.isSystemRole || isBusy}
                    onAction={() => attach({ roleId: role.id, policyId: p.id })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const PolicyRow = ({
  policy,
  action,
  disabled,
  onAction,
}: {
  policy: PolicyResponse
  action: 'attach' | 'detach'
  disabled: boolean
  onAction: () => void
}) => (
  <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-hairline bg-card hover:bg-surface-soft transition-colors">
    <div className="flex items-center gap-2 min-w-0">
      <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <span className="text-xs font-mono font-medium truncate">
        {policy.name}
      </span>
      {policy.isSystemPolicy && (
        <Badge variant="secondary" className="text-[9px] px-1 h-3.5 shrink-0">
          system
        </Badge>
      )}
    </div>
    <Button
      variant={action === 'detach' ? 'ghost' : 'secondary'}
      size="sm"
      className="h-6 px-2 text-[11px] shrink-0"
      disabled={disabled}
      onClick={onAction}
    >
      {action === 'detach' ? (
        <Unlink className="w-3 h-3 mr-1" />
      ) : (
        <Link2 className="w-3 h-3 mr-1" />
      )}
      {action === 'detach' ? 'Detach' : 'Attach'}
    </Button>
  </div>
)
