import type { PolicyResponse } from '@/server/modules/account/roles/features/response'
import { Button } from '@ui/button'
import { FileCode2, Pencil, X } from 'lucide-react'

type Props = {
  policy: PolicyResponse
  onDetach?: () => void
  onEdit?: () => void
  canDetach: boolean
  canEdit?: boolean
}

export const PolicyRow = ({
  policy,
  onDetach,
  onEdit,
  canDetach,
  canEdit,
}: Props) => {
  // Group actions by resource
  const resourceGroups = policy.statements.reduce(
    (acc, s) => {
      const res = s.resource.replace('/*', '')
      if (!acc[res]) acc[res] = []
      const shortAction = s.action.includes(':')
        ? s.action.split(':').pop()
        : s.action
      if (shortAction && !acc[res].includes(shortAction))
        acc[res].push(shortAction)
      return acc
    },
    {} as Record<string, string[]>,
  )

  return (
    <div className="group flex items-start gap-5 py-4 px-5 rounded-xl transition-all hover:bg-blue-50/30 dark:hover:bg-blue-900/10 border border-transparent hover:border-blue-100 dark:hover:border-blue-800/30">
      {/* Icon with Tertiary Background */}
      <div className="shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
          <FileCode2 className="h-5 w-5" />
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-3">
          {/* Bigger, clearer Policy Name */}
          <span className="text-[15px] font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            {policy.name}
          </span>

          <div className="flex gap-2">
            {policy.isManaged && (
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                Managed
              </span>
            )}
            {!policy.tenantId && (
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/80">
                System
              </span>
            )}
          </div>
        </div>

        {/* Description with better line height */}
        {policy.description && (
          <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-snug">
            {policy.description}
          </p>
        )}

        {/* Highlighted Permissions Section */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
          {Object.entries(resourceGroups).map(([resource, actions]) => (
            <div key={resource} className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-tight">
                {resource}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {actions.map((action) => (
                  <span
                    key={action}
                    className="text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800"
                  >
                    {action}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
        {canEdit && onEdit && !policy.isManaged && policy.tenantId && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            <Pencil className="h-4 w-4 text-neutral-500" />
          </Button>
        )}
        {canDetach && onDetach && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 text-neutral-400 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation()
              onDetach()
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
