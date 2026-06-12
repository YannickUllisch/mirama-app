// app/(app)/tenant/[tenantId]/(dashboard)/_components/OrganizationGrid.tsx
'use client'
import apiRequest from '@hooks'
import type { OrganizationListResponse } from '@server/modules/account/organizations/features/response'
import { useTenantResource } from '@src/modules/tenant/tenant/tenantResourceContext'
import { Button } from '@ui/button'
import { Building2, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import OrganizationCard from './OrganizationCard'
import OrganizationGridSkeleton from './OrganizationGridSkeleton'

const OrganizationGrid = () => {
  const router = useRouter()
  const { update: updateSession } = useSession()
  const { activeTenantId } = useTenantResource()

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

  const handleEditOrg = (org: OrganizationListResponse) => {
    router.push(`/tenant/${activeTenantId}/organization/${org.id}/edit`)
  }

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <div className="px-5 py-4 bg-surface-dark flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-white/50" />
          <span className="text-sm font-medium text-white">Organizations</span>
          {!isLoading && organizations && (
            <span className="text-xs text-white/40 ml-0.5">
              ({organizations.length})
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-white/70 hover:text-white hover:bg-white/10 gap-1.5"
          asChild
        >
          <Link href={`/tenant/${activeTenantId}/organization/create`}>
            <Plus className="w-3.5 h-3.5" />
            New
          </Link>
        </Button>
      </div>

      <div className="p-4">
        {isLoading ? (
          <OrganizationGridSkeleton />
        ) : !organizations || organizations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No organizations yet
            </p>
            <p className="text-xs text-muted-foreground mt-1 mb-5">
              Create your first organization to get started.
            </p>
            <Button variant="primary" size="sm" asChild>
              <Link href={`/tenant/${activeTenantId}/organization/create`}>
                <Plus className="w-3.5 h-3.5" />
                New Organization
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <OrganizationCard
                key={org.id}
                org={org}
                onEnter={handleEnterOrg}
                onEdit={handleEditOrg}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrganizationGrid
