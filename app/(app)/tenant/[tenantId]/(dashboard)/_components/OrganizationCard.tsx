// app/(app)/tenant/[tenantId]/(dashboard)/_components/OrganizationCard.tsx
'use client'
import { cn } from '@src/lib/utils'
import type { OrganizationResponse } from '@src/modules/tenant/organization/organization.types'
import { Button } from '@ui/button'
import { ArrowUpRight, FolderOpen, Pencil, Users } from 'lucide-react'

interface OrganizationCardProps {
  org: OrganizationResponse
  onEnter: (org: OrganizationResponse) => void
  onEdit: (org: OrganizationResponse) => void
}

const OrganizationCard = ({ org, onEnter, onEdit }: OrganizationCardProps) => {
  const initial = org.name[0].toUpperCase()

  return (
    <div
      className={cn(
        'group relative rounded-xl overflow-hidden bg-surface-dark',
        'transition-all duration-200 hover:-translate-y-1 hover:shadow-xl',
      )}
    >
      <button
        type="button"
        onClick={() => onEnter(org)}
        className="absolute inset-0 z-0 cursor-pointer"
        aria-label={`Open ${org.name}`}
      />

      <div className="relative z-10 p-5 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-2">
          <div className="w-11 h-11 rounded-xl bg-lava flex items-center justify-center text-sm font-bold text-white shrink-0">
            {initial}
          </div>

          <div className="flex items-center gap-1 pointer-events-auto">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(org)
              }}
              aria-label={`Edit ${org.name}`}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>

            <ArrowUpRight className="w-4 h-4 shrink-0 text-white/20 transition-all duration-200 group-hover:text-white/50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-white leading-snug truncate">
            {org.name}
          </p>
          <p className="text-xs font-mono mt-0.5 text-white/40 truncate">
            {org.slug}
          </p>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-white/10 text-xs text-white/35">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {org.memberCount} {org.memberCount === 1 ? 'member' : 'members'}
          </span>
          <span className="flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5" />
            {org.projectCount} {org.projectCount === 1 ? 'project' : 'projects'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrganizationCard
