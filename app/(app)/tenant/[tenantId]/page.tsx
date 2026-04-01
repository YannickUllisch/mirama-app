'use client'

import apiRequest from '@hooks/query'
import type { OrganizationListResponse } from '@server/modules/account/organizations/features/response'
import CreateOrganizationDialog from '@src/components/(application)/tenant/dialogs/CreateOrganizationDialog'
import EditOrganizationDialog from '@src/components/(application)/tenant/dialogs/EditOrganizationDialog'
import PageHeader from '@src/components/PageHeader'
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
import { Skeleton } from '@ui/skeleton'
import {
  Building2,
  ExternalLink,
  FolderOpen,
  MapPin,
  MoreHorizontal,
  Pencil,
  Users,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const TenantPage = () => {
  const router = useRouter()
  const { data: session, update: updateSession } = useSession()
  const [editingOrg, setEditingOrg] = useState<OrganizationListResponse | null>(
    null,
  )

  const { data: organizations, isLoading } =
    apiRequest.organization.fetchAll.useQuery()

  const handleEnterOrg = async (org: OrganizationListResponse) => {
    const updated = await updateSession({ organizationId: org.id })
    if (updated?.user?.organizationId === org.id) {
      router.push(`/organization/${org.id}`)
    } else {
      toast.error('You are not a member of this organization')
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Organizations"
        icon={Building2}
        description={`${session?.user?.tenantId ?? '—'}`}
      >
        <CreateOrganizationDialog />
      </PageHeader>

      <div className="flex-1 px-6 md:px-10 py-6 space-y-6">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={`skeleton-${i}`}
                className="h-[148px] rounded-xl"
              />
            ))}
          </div>
        ) : organizations && organizations.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <Card
                key={org.id}
                className="group relative flex flex-col hover:border-primary/50 transition-colors duration-200 cursor-pointer"
                onClick={() => handleEnterOrg(org)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-sm font-semibold truncate">
                          {org.name}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className="text-[10px] mt-0.5 font-mono"
                        >
                          {org.slug}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions menu — stop propagation so card click doesn't fire */}
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
                            handleEnterOrg(org)
                          }}
                        >
                          <ExternalLink className="mr-2 h-3.5 w-3.5" />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingOrg(org)
                          }}
                        >
                          <Pencil className="mr-2 h-3.5 w-3.5" />
                          Edit details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <CardDescription className="flex items-center gap-1.5 text-xs mt-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      {org.city}, {org.state} {org.zipCode}
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 mt-auto">
                  <div className="flex items-center gap-4 text-xs text-neutral-400 dark:text-neutral-500 pt-2 border-t border-border/60">
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
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              No organizations yet
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 mb-5">
              Create your first organization to get started.
            </p>
            <CreateOrganizationDialog />
          </div>
        )}
      </div>

      {editingOrg && (
        <EditOrganizationDialog
          org={editingOrg}
          open={!!editingOrg}
          onOpenChange={(open) => !open && setEditingOrg(null)}
        />
      )}
    </div>
  )
}

export default TenantPage
