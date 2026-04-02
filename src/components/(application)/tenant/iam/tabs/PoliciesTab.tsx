import type { UpdatePolicyRequest } from '@/server/modules/account/policies/features/update-policy/schema'
import type { PolicyResponse } from '@/server/modules/account/roles/features/response'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { Input } from '@ui/input'
import { FileText, Loader2, Pencil, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { EffectBadge } from '../EffectBadge'
import { CreatePolicyDialog } from '../dialogs/CreatePolicyDialog'
import { EditPolicyDialog } from '../dialogs/EditPolicyDialog'
import type { StatementDraft } from '../types'

type Props = {
  policies: PolicyResponse[]
  isLoading: boolean
  onCreatePolicy: (data: {
    name: string
    description?: string
    statements: StatementDraft[]
  }) => void
  onUpdatePolicy: (id: string, data: UpdatePolicyRequest) => void
  onDeletePolicy: (id: string) => void
}

export const PoliciesTab = ({
  policies,
  isLoading,
  onCreatePolicy,
  onUpdatePolicy,
  onDeletePolicy,
}: Props) => {
  const [search, setSearch] = useState('')
  const [editingPolicy, setEditingPolicy] = useState<PolicyResponse | null>(
    null,
  )

  const filtered = policies.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? '').toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <Input
            placeholder="Search policies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <CreatePolicyDialog onSubmit={onCreatePolicy} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="border border-border rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_2fr_auto] items-center gap-4 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/50 border-b border-border">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
              Policy
            </span>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
              Statements
            </span>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
              Actions
            </span>
          </div>

          {filtered.map((p, idx) => (
            <div
              key={p.id}
              className={`grid grid-cols-[1fr_2fr_auto] items-start gap-4 px-4 py-3 group hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors ${
                idx < filtered.length - 1 ? 'border-b border-border/60' : ''
              }`}
            >
              {/* Name + meta */}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-mono font-medium text-neutral-800 dark:text-neutral-200">
                    {p.name}
                  </span>
                  {p.isManaged && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-4"
                    >
                      managed
                    </Badge>
                  )}
                  {!p.tenantId && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-4"
                    >
                      system
                    </Badge>
                  )}
                </div>
                {p.description && (
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {p.description}
                  </p>
                )}
              </div>

              {/* Statements */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {p.statements.map((s) => (
                  <div key={s.id} className="flex items-center gap-1">
                    <EffectBadge effect={s.effect} />
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-4 font-mono"
                    >
                      {s.action}
                    </Badge>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {s.resource}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-0.5">
                {!p.isManaged && p.tenantId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground"
                    onClick={() => setEditingPolicy(p)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                )}
                {!p.isManaged && p.tenantId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => onDeletePolicy(p.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mb-3" />
          <p className="text-sm font-medium text-neutral-500">
            No policies found
          </p>
          {search && (
            <p className="text-xs text-neutral-400 mt-1">
              Try a different search term.
            </p>
          )}
        </div>
      )}

      <EditPolicyDialog
        policy={editingPolicy}
        open={!!editingPolicy}
        onOpenChange={(open) => !open && setEditingPolicy(null)}
        onSubmit={onUpdatePolicy}
      />
    </div>
  )
}
