// app/(app)/tenant/[tenantId]/(dashboard)/_components/OrganizationCard.tsx
'use client'
import type { OrganizationListResponse } from '@server/modules/account/organizations/features/response'
import { cn } from '@src/lib/utils'
import { Button } from '@ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import {
  ArrowRight,
  ExternalLink,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Users,
} from 'lucide-react'

interface ColorScheme {
  card: string
  text: string
  subtext: string
  iconBg: string
  divider: string
  meta: string
  menuBtn: string
}

const PALETTE: ColorScheme[] = [
  {
    card: 'bg-signature-coral',
    text: 'text-white',
    subtext: 'text-white/60',
    iconBg: 'bg-white/20',
    divider: 'border-white/15',
    meta: 'text-white/65',
    menuBtn:
      'text-white/50 hover:text-white hover:bg-white/15 data-[state=open]:bg-white/15 data-[state=open]:text-white',
  },
  {
    card: 'bg-signature-forest',
    text: 'text-white',
    subtext: 'text-white/60',
    iconBg: 'bg-white/20',
    divider: 'border-white/15',
    meta: 'text-white/65',
    menuBtn:
      'text-white/50 hover:text-white hover:bg-white/15 data-[state=open]:bg-white/15 data-[state=open]:text-white',
  },
  {
    card: 'bg-signature-peach',
    text: 'text-ink',
    subtext: 'text-ink/55',
    iconBg: 'bg-ink/12',
    divider: 'border-ink/12',
    meta: 'text-ink/60',
    menuBtn:
      'text-ink/40 hover:text-ink hover:bg-ink/10 data-[state=open]:bg-ink/10 data-[state=open]:text-ink',
  },
  {
    card: 'bg-signature-mint',
    text: 'text-ink',
    subtext: 'text-ink/55',
    iconBg: 'bg-ink/12',
    divider: 'border-ink/12',
    meta: 'text-ink/60',
    menuBtn:
      'text-ink/40 hover:text-ink hover:bg-ink/10 data-[state=open]:bg-ink/10 data-[state=open]:text-ink',
  },
  {
    card: 'bg-signature-yellow',
    text: 'text-ink',
    subtext: 'text-ink/55',
    iconBg: 'bg-ink/12',
    divider: 'border-ink/12',
    meta: 'text-ink/60',
    menuBtn:
      'text-ink/40 hover:text-ink hover:bg-ink/10 data-[state=open]:bg-ink/10 data-[state=open]:text-ink',
  },
  {
    card: 'bg-signature-mustard',
    text: 'text-ink',
    subtext: 'text-ink/55',
    iconBg: 'bg-ink/12',
    divider: 'border-ink/12',
    meta: 'text-ink/60',
    menuBtn:
      'text-ink/40 hover:text-ink hover:bg-ink/10 data-[state=open]:bg-ink/10 data-[state=open]:text-ink',
  },
]

interface OrganizationCardProps {
  org: OrganizationListResponse
  colorIndex: number
  onEnter: (org: OrganizationListResponse) => void
  onEdit: (org: OrganizationListResponse) => void
}

const OrganizationCard = ({
  org,
  colorIndex,
  onEnter,
  onEdit,
}: OrganizationCardProps) => {
  const c = PALETTE[colorIndex % PALETTE.length]
  const initial = org.name[0].toUpperCase()

  return (
    <div
      className={cn(
        'group relative rounded-xl overflow-hidden transition-all duration-200',
        'hover:-translate-y-1 hover:shadow-xl',
        c.card,
      )}
    >
      {/* Full-card click target */}
      <button
        type="button"
        onClick={() => onEnter(org)}
        className="absolute inset-0 z-0 cursor-pointer"
        aria-label={`Open ${org.name}`}
      />

      <div className="relative z-10 p-5 flex flex-col gap-4">
        {/* Top row: initial + actions */}
        <div className="flex items-start justify-between gap-2">
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold shrink-0',
              c.iconBg,
              c.text,
            )}
          >
            {initial}
          </div>

          <div className="flex items-center gap-1 pointer-events-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity',
                    c.menuBtn,
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onEnter(org)
                  }}
                >
                  <ExternalLink className="mr-2 h-3.5 w-3.5" />
                  Open portal
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(org)
                  }}
                >
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  Edit details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ArrowRight
              className={cn(
                'w-4 h-4 mt-0.5 shrink-0 transition-all duration-200 group-hover:translate-x-0.5',
                c.meta,
              )}
            />
          </div>
        </div>

        {/* Name + slug */}
        <div className="flex-1">
          <p className={cn('text-base font-medium leading-tight truncate', c.text)}>
            {org.name}
          </p>
          <p className={cn('text-xs font-mono mt-0.5 truncate', c.subtext)}>
            {org.slug}
          </p>
        </div>

        {/* Meta footer */}
        <div
          className={cn(
            'flex items-center gap-4 pt-3 border-t text-xs',
            c.divider,
            c.meta,
          )}
        >
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {org._count.members}{' '}
            {org._count.members === 1 ? 'member' : 'members'}
          </span>
          <span className="flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5" />
            {org._count.projects}{' '}
            {org._count.projects === 1 ? 'project' : 'projects'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrganizationCard
