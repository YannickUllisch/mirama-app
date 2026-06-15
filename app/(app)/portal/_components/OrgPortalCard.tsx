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
        'group relative text-left w-full rounded-xl transition-all duration-200',
        'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'hover:-translate-y-1 hover:shadow-xl p-6 flex flex-col gap-5',
        'bg-surface-dark',
      )}
    >
      {/* Initial chip + arrow */}
      <div className="flex items-start justify-between gap-3">
        <div className="w-11 h-11 rounded-lg flex items-center justify-center text-base font-medium shrink-0 bg-lava text-white">
          {initial}
        </div>
        <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-white/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white" />
      </div>

      {/* Name + slug */}
      <div className="flex-1">
        <p className="text-base font-medium leading-tight truncate text-white">
          {org.name}
        </p>
        <p className="text-xs font-mono mt-1 truncate text-white/60">
          {org.slug}
        </p>
      </div>

      {/* Meta footer */}
      <div className="flex items-center gap-4 pt-4 border-t border-white/20 text-xs text-white/60">
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          {org.memberCount} {org.memberCount === 1 ? 'member' : 'members'}
        </span>
        <span className="flex items-center gap-1.5">
          <FolderOpen className="w-3.5 h-3.5" />
          {org.projectCount} {org.projectCount === 1 ? 'project' : 'projects'}
        </span>
      </div>
    </button>
  )
}

export default OrgPortalCard
