// app/(app)/organization/[organizationId]/settings/organizations/_components/OrganizationGrid.tsx
'use client'
import apiRequest from '@hooks'
import type { OrganizationResponse } from '@src/modules/tenant/organization/organization.types'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import { Button } from '@ui/button'
import { Building2, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import OrganizationCard from './OrganizationCard'
import OrganizationGridSkeleton from './OrganizationGridSkeleton'

const OrganizationGrid = () => {
  const router = useRouter()
  const { update: updateSession } = useSession()
  const { activeOrganizationId } = useOrganizationResource()

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
    router.push(
      `/organization/${activeOrganizationId}/settings/organizations/${org.id}/edit`,
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-ink">Organizations</h2>
          {!isLoading && organizations && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-canvas border border-hairline text-[10px] font-medium text-body-text tabular-nums">
              {organizations.length}
            </span>
          )}
        </div>
        <Button variant="primary" size="sm" asChild>
          <Link
            href={`/organization/${activeOrganizationId}/settings/organizations/create`}
          >
            <Plus className="w-3.5 h-3.5" />
            New organization
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <OrganizationGridSkeleton />
      ) : !organizations || organizations.length === 0 ? (
        <div className="rounded-xl border border-hairline bg-canvas flex flex-col items-center justify-center py-16 text-center">
          <div className="w-10 h-10 rounded-xl bg-surface-soft border border-hairline flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5 text-body-text" />
          </div>
          <p className="text-sm font-medium text-ink">No organizations yet</p>
          <p className="text-xs text-body-text mt-1 mb-5 max-w-xs">
            Create your first organization to start managing projects and team
            members.
          </p>
          <Button variant="primary" size="sm" asChild>
            <Link
              href={`/organization/${activeOrganizationId}/settings/organizations/create`}
            >
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
