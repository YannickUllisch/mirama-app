// app/(app)/tenant/[tenantId]/(dashboard)/OrganizationGrid.tsx
'use client'
import apiRequest from '@hooks/query'
import type { OrganizationListResponse } from '@server/modules/account/organizations/features/response'
import CreateOrganizationDialog from '@src/modules/tenant/components/dialogs/CreateOrganizationDialog'
import EditOrganizationDialog from '@src/modules/tenant/components/dialogs/EditOrganizationDialog'
import { Building2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import OrganizationCard from './OrganizationCard'
import OrganizationGridSkeleton from './OrganizationGridSkeleton'

const OrganizationGrid = () => {
  const router = useRouter()
  const { update: updateSession } = useSession()
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

  if (isLoading) {
    return <OrganizationGridSkeleton />
  }

  if (!organizations || organizations.length === 0) {
    return (
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
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <OrganizationCard
            key={org.id}
            org={org}
            onEnter={handleEnterOrg}
            onEdit={setEditingOrg}
          />
        ))}
      </div>

      {editingOrg && (
        <EditOrganizationDialog
          org={editingOrg}
          open={!!editingOrg}
          onOpenChange={(open) => !open && setEditingOrg(null)}
        />
      )}
    </>
  )
}

export default OrganizationGrid
