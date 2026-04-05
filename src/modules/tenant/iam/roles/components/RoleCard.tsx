import type { PolicyResponse } from '@server/modules/account/policies/features/response'
import type { RoleResponse } from '@server/modules/account/roles/features/response'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import {
  ChevronRight,
  FileText,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { PolicyRow } from '../../policy/components/PolicyRow'

export const RoleCard = ({
  role,
  allPolicies,
  onAttach,
  onDetach,
  onDelete,
  onEditPolicy,
}: {
  role: RoleResponse
  allPolicies: PolicyResponse[]
  onAttach: (policyId: string) => void
  onDetach: (policyId: string) => void
  onDelete: () => void
  onEditPolicy?: (policy: PolicyResponse) => void
}) => {
  const [expanded, setExpanded] = useState(false)
  const isSystem = !role.tenantId
  const attachedIds = new Set(role.policies.map((p) => p.id))
  const unattached = allPolicies.filter(
    (p) => !attachedIds.has(p.id) && p.scope === role.scope,
  )

  return (
    <div className="group relative border border-border rounded-xl bg-card hover:border-primary/30 transition-all duration-200 overflow-hidden">
      <button
        type="button"
        aria-expanded={expanded}
        className="absolute inset-0 w-full h-full cursor-pointer bg-transparent z-0"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="sr-only">Toggle {role.name} details</span>
      </button>

      <div className="relative z-10 pointer-events-none flex items-center gap-4 px-4 py-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <ChevronRight
            className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
              expanded ? 'rotate-90' : ''
            }`}
          />
          <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[13px] font-bold font-mono tracking-tight text-foreground">
                {role.name}
              </span>
              {isSystem && (
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1 h-3.5 uppercase tracking-tighter"
                >
                  system
                </Badge>
              )}
              <Badge
                variant="outline"
                className="text-[9px] px-1 h-3.5 uppercase tracking-tighter"
              >
                {role.scope === 'PROJECT' ? 'project' : 'org'}
              </Badge>
            </div>
            {role.description ? (
              <p className="text-xs text-muted-foreground truncate">
                {role.description}
              </p>
            ) : (
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> {role.policies.length}{' '}
                  Policies
                </span>
                <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                  <Users className="w-3 h-3" />{' '}
                  {role._count.organizationMembers} Members
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {!isSystem && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {unattached.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Attach Policy
                    </div>
                    {unattached.slice(0, 5).map((p) => (
                      <DropdownMenuItem
                        key={p.id}
                        onClick={() => onAttach(p.id)}
                      >
                        <Plus className="mr-2 h-3.5 w-3.5" />
                        <span className="truncate">{p.name}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={onDelete}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete Role
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {expanded && (
        <div className="relative z-10 border-t bg-neutral-50/30 dark:bg-neutral-900/30">
          <div className="px-4 py-3 flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Active Permissions
            </h4>
            <div className="h-px flex-1 bg-border mx-4" />
          </div>

          <div className="px-2 pb-2 space-y-1">
            {role.policies.length > 0 ? (
              role.policies.map((p) => (
                <div key={p.id} className="relative pointer-events-auto">
                  <PolicyRow
                    policy={p}
                    canDetach={!isSystem}
                    canEdit
                    onDetach={() => onDetach(p.id)}
                    onEdit={() => onEditPolicy?.(p)}
                  />
                </div>
              ))
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <FileText className="w-8 h-8 text-neutral-200 mb-2" />
                <p className="text-xs text-neutral-400">
                  No policies attached.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
