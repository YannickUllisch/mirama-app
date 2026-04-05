import type { AccessScope } from '@/prisma/generated/client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ui/accordion'
import { Badge } from '@ui/badge'
import { Checkbox } from '@ui/checkbox'
import { Separator } from '@ui/separator'
import { RESOURCE_PERMISSIONS } from '../permissions'
import type { StatementDraft } from '../types'

type Props = {
  statements: StatementDraft[]
  onToggle: (action: string, resource: string) => void
  scope?: AccessScope
}

export const PermissionAccordion = ({ statements, onToggle, scope }: Props) => {
  const visibleResources = RESOURCE_PERMISSIONS.filter(
    (rp) => !scope || rp.allowedScopes.includes(scope),
  )

  const isChecked = (action: string, resource: string) =>
    statements.some(
      (s) =>
        s.resource === `${resource}/*` &&
        (s.action === `${resource}:${action}` || s.action === `${resource}:*`),
    )

  const isWildcard = (resource: string) =>
    statements.some(
      (s) => s.resource === `${resource}/*` && s.action === `${resource}:*`,
    )

  return (
    <Accordion type="multiple" className="w-full divide-y divide-border">
      {visibleResources.map((rp) => {
        const scopedActions =
          (scope && rp.actionsForScope?.[scope]) ?? rp.actions
        const activeCount = scopedActions.filter((a) =>
          isChecked(a, rp.resource),
        ).length
        const wild = isWildcard(rp.resource)

        return (
          <AccordionItem
            key={rp.resource}
            value={rp.resource}
            className="border-0"
          >
            <AccordionTrigger className="px-3 py-2.5 hover:no-underline hover:bg-neutral-50 dark:hover:bg-neutral-800/40 rounded-lg data-[state=open]:rounded-b-none transition-colors text-sm">
              <div className="flex items-center gap-2.5 flex-1 mr-2">
                <span className="font-medium text-sm">{rp.label}</span>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 font-mono"
                >
                  {rp.resource}
                </Badge>
                {(wild || activeCount > 0) && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 h-4 text-primary border-primary/30 bg-primary/5"
                  >
                    {wild
                      ? 'full access'
                      : `${activeCount} action${activeCount !== 1 ? 's' : ''}`}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-3 pt-1 pb-3 space-y-0">
              <p className="text-xs text-muted-foreground mb-3 mt-1">
                {rp.description}
              </p>
              <div className="space-y-1">
                {/* Wildcard Row */}
                <label
                  htmlFor={`${rp.resource}-wildcard`}
                  className="w-full flex items-center gap-2.5 cursor-pointer rounded-md px-2 py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <Checkbox
                    id={`${rp.resource}-wildcard`}
                    checked={wild}
                    onCheckedChange={() => onToggle('*', rp.resource)}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-mono font-medium">
                      {rp.resource}:*
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Full access to all {rp.label.toLowerCase()} actions
                    </p>
                  </div>
                </label>

                <Separator className="my-1" />

                {/* Individual actions */}
                {scopedActions.map((action) => (
                  <label
                    key={action}
                    htmlFor={`${rp.resource}-${action}`}
                    className={`w-full flex items-center gap-2.5 cursor-pointer rounded-md px-2 py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors ${
                      wild ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <Checkbox
                      id={`${rp.resource}-${action}`}
                      checked={isChecked(action, rp.resource)}
                      disabled={wild}
                      onCheckedChange={() => onToggle(action, rp.resource)}
                    />
                    <span className="text-xs font-mono">
                      {rp.resource}:{action}
                    </span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
