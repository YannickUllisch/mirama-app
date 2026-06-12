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

interface OrganizationCardProps {
  org: OrganizationListResponse
  onEnter: (org: OrganizationListResponse) => void
  onEdit: (org: OrganizationListResponse) => void
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

      <div className="relative z-10 p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="w-10 h-10 rounded-lg bg-lava flex items-center justify-center text-base font-bold text-white shrink-0">
            {initial}
          </div>

          <div className="flex items-center gap-1 pointer-events-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white hover:bg-white/10 data-[state=open]:opacity-100 data-[state=open]:bg-white/10 data-[state=open]:text-white"
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

            <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-white/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white/60" />
          </div>
        </div>

        <div className="flex-1">
          <p className="text-base font-medium text-white leading-tight truncate">
            {org.name}
          </p>
          <p className="text-xs font-mono mt-0.5 truncate text-white/50">
            {org.slug}
          </p>
        </div>

        <div className="flex items-center gap-4 pt-3 border-t border-white/10 text-xs text-white/40">
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
