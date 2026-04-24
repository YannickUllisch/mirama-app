// app/(app)/tenant/[tenantId]/(dashboard)/OrganizationCard.tsx
'use client'
import type { OrganizationListResponse } from '@server/modules/account/organizations/features/response'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import {
  Building2,
  ExternalLink,
  FolderOpen,
  MapPin,
  MoreHorizontal,
  Pencil,
  Users,
} from 'lucide-react'

interface OrganizationCardProps {
  org: OrganizationListResponse
  onEnter: (org: OrganizationListResponse) => void
  onEdit: (org: OrganizationListResponse) => void
}

const OrganizationCard = ({ org, onEnter, onEdit }: OrganizationCardProps) => (
  <Card
    className="group relative flex flex-col hover:border-black/20 dark:hover:border-white/20 transition-colors duration-200 cursor-pointer"
    onClick={() => onEnter(org)}
  >
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-mirama-blue/10 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-mirama-blue" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-[15px] font-semibold [letter-spacing:-0.1px] truncate">
              {org.name}
            </CardTitle>
            <Badge variant="secondary" className="mt-0.5 font-mono">
              {org.slug}
            </Badge>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
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
              Open
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
      </div>

      <CardDescription className="flex items-center gap-1.5 mt-1">
        <MapPin className="w-3 h-3 shrink-0" />
        <span className="truncate">
          {org.street} {org.zipCode} {org.city}, {org.country}
        </span>
      </CardDescription>
    </CardHeader>

    <CardContent className="pt-0 mt-auto">
      <div className="flex items-center gap-4 text-[12px] font-medium text-warm-gray-300 pt-2 border-t border-black/10 dark:border-white/10">
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          {org._count.members} {org._count.members === 1 ? 'member' : 'members'}
        </span>
        <span className="flex items-center gap-1.5">
          <FolderOpen className="w-3.5 h-3.5" />
          {org._count.projects}{' '}
          {org._count.projects === 1 ? 'project' : 'projects'}
        </span>
      </div>
    </CardContent>
  </Card>
)

export default OrganizationCard
