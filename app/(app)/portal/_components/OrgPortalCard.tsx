// app/(app)/portal/_components/OrgPortalCard.tsx
'use client'
import { cn } from '@src/lib/utils'
import type { OrganizationResponse } from '@src/modules/tenant/organization/organization.types'
import { ArrowRight, FolderOpen, Users } from 'lucide-react'

interface OrgPortalCardProps {
  org: OrganizationResponse
  onEnter: (org: OrganizationResponse) => void
}

const OrgPortalCard = ({ org, onEnter }: OrgPortalCardProps) => {
  const initial = org.name[0].toUpperCase()

  return (
    <button
      type="button"
      onClick={() => onEnter(org)}
      className={cn(
        'group text-left w-full rounded-xl transition-all duration-200 overflow-hidden',
        'border border-hairline bg-canvas flex flex-col',
        'hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      {/* Visual zone */}
      <div className="bg-surface-soft border-b border-hairline px-6 py-8 flex items-center justify-center">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-medium bg-lava text-white">
          {initial}
        </div>
      </div>

      {/* Content zone */}
      <div className="px-5 py-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[15px] font-medium text-ink leading-tight truncate">
            {org.name}
          </p>
          <p className="text-xs font-mono mt-0.5 truncate text-body-text">
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
          <ArrowRight className="w-4 h-4 text-ink/25 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-ink" />
        </div>
      </div>
    </button>
  )
}

export default OrgPortalCard
