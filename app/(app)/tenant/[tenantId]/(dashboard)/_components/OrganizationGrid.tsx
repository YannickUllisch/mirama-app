// app/(app)/tenant/[tenantId]/(dashboard)/_components/OrganizationGrid.tsx
'use client'
import apiRequest from '@hooks'
import type { OrganizationResponse } from '@src/modules/tenant/organization/organization.types'
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

  const { items: organizations, isLoading } =
    apiRequest.organization.fetchAll.useQuery()

  const handleEnterOrg = async (org: OrganizationResponse) => {
    const updated = await updateSession({ organizationId: org.id })
    if (updated?.user?.organizationId === org.id) {
      router.push(`/organization/${org.id}`)
    } else {
      toast.error('You are not a member of this organization')
    }
  }

  const handleEditOrg = (org: OrganizationResponse) => {
    router.push(`/tenant/${activeTenantId}/organization/${org.id}/edit`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-foreground">Organizations</h2>
          {!isLoading && organizations && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground tabular-nums">
              {organizations.length}
            </span>
          )}
        </div>
        <Button variant="primary" size="sm" asChild>
          <Link href={`/tenant/${activeTenantId}/organization/create`}>
            <Plus className="w-3.5 h-3.5" />
            New organization
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <OrganizationGridSkeleton />
      ) : !organizations || organizations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">
            No organizations yet
          </p>
          <p className="text-xs text-muted-foreground mt-1 mb-5 max-w-xs">
            Create your first organization to start managing projects and team
            members.
          </p>
          <Button variant="primary" size="sm" asChild>
            <Link href={`/tenant/${activeTenantId}/organization/create`}>
              <Plus className="w-3.5 h-3.5" />
              New organization
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
  )
}

export default OrganizationGrid
