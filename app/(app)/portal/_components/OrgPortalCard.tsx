// app/(app)/portal/_components/OrgPortalCard.tsx
'use client'
import type { OrganizationResponse } from '@src/modules/tenant/organization/organization.types'
import { cn } from '@src/lib/utils'
import { ArrowRight, FolderOpen, Users } from 'lucide-react'

interface ColorScheme {
  card: string
  text: string
  subtext: string
  iconBg: string
  divider: string
  arrow: string
}

const PALETTE: ColorScheme[] = [
  {
    card: 'bg-signature-coral',
    text: 'text-white',
    subtext: 'text-white/65',
    iconBg: 'bg-white/20',
    divider: 'border-white/20',
    arrow: 'text-white/50 group-hover:text-white',
  },
  {
    card: 'bg-signature-forest',
    text: 'text-white',
    subtext: 'text-white/65',
    iconBg: 'bg-white/20',
    divider: 'border-white/20',
    arrow: 'text-white/50 group-hover:text-white',
  },
  {
    card: 'bg-signature-peach',
    text: 'text-ink',
    subtext: 'text-ink/60',
    iconBg: 'bg-ink/12',
    divider: 'border-ink/15',
    arrow: 'text-ink/40 group-hover:text-ink',
  },
  {
    card: 'bg-signature-mint',
    text: 'text-ink',
    subtext: 'text-ink/60',
    iconBg: 'bg-ink/12',
    divider: 'border-ink/15',
    arrow: 'text-ink/40 group-hover:text-ink',
  },
  {
    card: 'bg-signature-yellow',
    text: 'text-ink',
    subtext: 'text-ink/60',
    iconBg: 'bg-ink/12',
    divider: 'border-ink/15',
    arrow: 'text-ink/40 group-hover:text-ink',
  },
  {
    card: 'bg-signature-mustard',
    text: 'text-ink',
    subtext: 'text-ink/60',
    iconBg: 'bg-ink/12',
    divider: 'border-ink/15',
    arrow: 'text-ink/40 group-hover:text-ink',
  },
]

interface OrgPortalCardProps {
  org: OrganizationResponse
  colorIndex: number
  onEnter: (org: OrganizationResponse) => void
}

const OrgPortalCard = ({ org, colorIndex, onEnter }: OrgPortalCardProps) => {
  const c = PALETTE[colorIndex % PALETTE.length]
  const initial = org.name[0].toUpperCase()

  return (
    <button
      type="button"
      onClick={() => onEnter(org)}
      className={cn(
        'group relative text-left w-full rounded-xl transition-all duration-200',
        'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'hover:-translate-y-1 hover:shadow-xl p-6 flex flex-col gap-5',
        c.card,
      )}
    >
      {/* Top row: initial + arrow */}
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            'w-11 h-11 rounded-lg flex items-center justify-center text-base font-medium shrink-0',
            c.iconBg,
            c.text,
          )}
        >
          {initial}
        </div>
        <ArrowRight
          className={cn(
            'w-4 h-4 mt-0.5 shrink-0 transition-all duration-200 group-hover:translate-x-0.5',
            c.arrow,
          )}
        />
      </div>

      {/* Name + slug */}
      <div className="flex-1">
        <p
          className={cn('text-base font-medium leading-tight truncate', c.text)}
        >
          {org.name}
        </p>
        <p className={cn('text-xs font-mono mt-1 truncate', c.subtext)}>
          {org.slug}
        </p>
      </div>

      {/* Meta footer */}
      <div
        className={cn(
          'flex items-center gap-4 pt-4 border-t text-xs',
          c.divider,
          c.subtext,
        )}
      >
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          {org.memberCount} {org.memberCount === 1 ? 'member' : 'members'}
        </span>
        <span className="flex items-center gap-1.5">
          <FolderOpen className="w-3.5 h-3.5" />
          {org.projectCount}{' '}
          {org.projectCount === 1 ? 'project' : 'projects'}
        </span>
      </div>
    </button>
  )
}

export default OrgPortalCard
