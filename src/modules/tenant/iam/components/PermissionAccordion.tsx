// src/modules/tenant/iam/components/PermissionAccordion.tsx
'use client'

import type { StatementDraft } from '@src/modules/tenant/iam/iam.types'
import type {
  Effect,
  PermissionGroupResponse,
} from '@src/modules/tenant/iam/policy/policy.types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ui/accordion'
import { Badge } from '@ui/badge'
import { Checkbox } from '@ui/checkbox'
import { Separator } from '@ui/separator'

type Props = {
  groups: PermissionGroupResponse[]
  statements: StatementDraft[]
  onToggle: (action: string, resourcePattern: string) => void
  onEffectChange: (
    action: string,
    resourcePattern: string,
    effect: Effect,
  ) => void
  scope?: string
}

const EffectToggle = ({
  effect,
  onAllow,
  onDeny,
}: {
  effect: Effect
  onAllow: () => void
  onDeny: () => void
}) => (
  <div className="flex items-center rounded-md border border-hairline overflow-hidden shrink-0 ml-auto">
    <button
      type="button"
      onClick={onAllow}
      className={`px-2 py-0.5 text-[10px] font-medium transition-colors ${
        effect === 'Allow'
          ? 'bg-success text-white'
          : 'text-muted-foreground hover:bg-surface-soft'
      }`}
    >
      Allow
    </button>
    <div className="w-px h-3 bg-hairline" />
    <button
      type="button"
      onClick={onDeny}
      className={`px-2 py-0.5 text-[10px] font-medium transition-colors ${
        effect === 'Deny'
          ? 'bg-destructive text-white'
          : 'text-muted-foreground hover:bg-surface-soft'
      }`}
    >
      Deny
    </button>
  </div>
)

export const PermissionAccordion = ({
  groups,
  statements,
  onToggle,
  onEffectChange,
  scope,
}: Props) => {
  const visibleGroups = scope ? groups.filter((g) => g.scope === scope) : groups

  const getStatement = (action: string, group: PermissionGroupResponse) =>
    statements.find(
      (s) =>
        s.resource === group.resourcePattern &&
        (s.action === action || s.action === group.allActionsPattern),
    )

  const isChecked = (action: string, group: PermissionGroupResponse) =>
    !!getStatement(action, group)

  const getWildcardStatement = (group: PermissionGroupResponse) =>
    statements.find(
      (s) =>
        s.resource === group.resourcePattern &&
        s.action === group.allActionsPattern,
    )

  const isWildcard = (group: PermissionGroupResponse) =>
    !!getWildcardStatement(group)

  if (visibleGroups.length === 0) {
    return (
      <p className="px-4 py-6 text-xs text-muted-foreground/60 text-center">
        No permissions available for this scope.
      </p>
    )
  }

  return (
    <Accordion type="multiple" className="w-full divide-y divide-border">
      {visibleGroups.map((group) => {
        const wild = isWildcard(group)
        const activeCount = group.actions.filter((a) =>
          isChecked(a.action, group),
        ).length
        const resourceLabel = group.resourcePattern.replace('/*', '')

        return (
          <AccordionItem
            key={group.resourcePattern}
            value={group.resourcePattern}
            className="border-0"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-surface-soft data-[state=open]:bg-surface-soft transition-colors text-sm">
              <div className="flex items-center gap-2.5 flex-1 mr-2">
                <span className="font-medium text-sm">{group.label}</span>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 font-mono"
                >
                  {resourceLabel}
                </Badge>
                {(wild || activeCount > 0) && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-4 text-lava border-lava/30 bg-lava/5"
                  >
                    {wild
                      ? 'full access'
                      : `${activeCount} action${activeCount !== 1 ? 's' : ''}`}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pt-1 pb-3 space-y-0">
              <div className="space-y-1">
                {/* Wildcard row */}
                {(() => {
                  const wildcardStmt = getWildcardStatement(group)
                  return (
                    <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-surface-soft transition-colors">
                      <Checkbox
                        id={`${group.resourcePattern}-wildcard`}
                        checked={wild}
                        onCheckedChange={() =>
                          onToggle(
                            group.allActionsPattern,
                            group.resourcePattern,
                          )
                        }
                      />
                      <label
                        htmlFor={`${group.resourcePattern}-wildcard`}
                        className="flex-1 min-w-0 cursor-pointer"
                      >
                        <span className="text-xs font-mono font-medium">
                          {group.allActionsPattern}
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Full access to all {group.label.toLowerCase()} actions
                        </p>
                      </label>
                      {wildcardStmt && (
                        <EffectToggle
                          effect={wildcardStmt.effect}
                          onAllow={() =>
                            onEffectChange(
                              group.allActionsPattern,
                              group.resourcePattern,
                              'Allow',
                            )
                          }
                          onDeny={() =>
                            onEffectChange(
                              group.allActionsPattern,
                              group.resourcePattern,
                              'Deny',
                            )
                          }
                        />
                      )}
                    </div>
                  )
                })()}

                <Separator className="my-1" />

                {/* Individual actions */}
                {group.actions.map((perm) => {
                  const stmt = getStatement(perm.action, group)
                  const checked = !!stmt && !wild
                  return (
                    <div
                      key={perm.action}
                      className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-surface-soft transition-colors ${
                        wild ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      <Checkbox
                        id={`${group.resourcePattern}-${perm.action}`}
                        checked={isChecked(perm.action, group)}
                        disabled={wild}
                        onCheckedChange={() =>
                          onToggle(perm.action, group.resourcePattern)
                        }
                      />
                      <label
                        htmlFor={`${group.resourcePattern}-${perm.action}`}
                        className="flex-1 min-w-0 cursor-pointer"
                      >
                        <span className="text-xs font-mono">{perm.action}</span>
                        {perm.label && (
                          <p className="text-[11px] text-muted-foreground">
                            {perm.label}
                          </p>
                        )}
                      </label>
                      {checked && stmt && (
                        <EffectToggle
                          effect={stmt.effect}
                          onAllow={() =>
                            onEffectChange(
                              perm.action,
                              group.resourcePattern,
                              'Allow',
                            )
                          }
                          onDeny={() =>
                            onEffectChange(
                              perm.action,
                              group.resourcePattern,
                              'Deny',
                            )
                          }
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
