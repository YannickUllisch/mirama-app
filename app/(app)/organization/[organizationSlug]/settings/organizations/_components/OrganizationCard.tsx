// app/(app)/organization/[organizationSlug]/settings/organizations/_components/OrganizationCard.tsx
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
        'group relative rounded-xl overflow-hidden',
        'border border-hairline bg-canvas flex flex-col',
        'transition-all duration-200',
        'hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]',
      )}
    >
      <button
        type="button"
        onClick={() => onEnter(org)}
        className="absolute inset-0 z-0 cursor-pointer"
        aria-label={`Open ${org.name}`}
      />

      {/* Visual zone */}
      <div className="relative bg-surface-soft border-b border-hairline px-6 py-8 flex items-center justify-center">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-medium bg-lava text-white">
          {initial}
        </div>
        <div className="absolute top-2.5 right-2.5 z-10 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-body-text hover:text-ink hover:bg-surface-medium"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(org)
            }}
            aria-label={`Edit ${org.name}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Content zone */}
      <div className="relative z-10 px-5 py-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[15px] font-medium text-ink leading-tight truncate">
            {org.name}
          </p>
          <p className="text-xs font-mono mt-0.5 text-body-text truncate">
            {org.slug}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-body-text">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {org.memberCount} {org.memberCount === 1 ? 'member' : 'members'}
          </span>
          <span className="flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5" />
            {org.projectCount} {org.projectCount === 1 ? 'project' : 'projects'}
          </span>
        </div>

        <div className="pt-3 border-t border-hairline flex items-center justify-between">
          <span className="text-sm font-medium text-ink">Enter workspace</span>
          <ArrowUpRight className="w-4 h-4 text-ink/25 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
        </div>
      </div>
    </div>
  )
}

export default OrganizationCard
