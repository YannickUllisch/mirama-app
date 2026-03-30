'use client'

import apiRequest from '@hooks/query'
import { Skeleton } from '@src/components/ui/skeleton'
import { Badge } from '@ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card'
import { Building2, FolderOpen, MapPin, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import CreateOrganizationDialog from '../../../../src/components/(application)/tenant/dialogs/CreateOrganizationDialog'

const TenantPage = () => {
  const router = useRouter()
  const { data: session, update: updateSession } = useSession()

  const { data: organizations, isLoading } =
    apiRequest.organization.fetchAll.useQuery(session?.user.tenantId ?? '')

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
              Tenant
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Organizations</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Manage the organizations within your tenant.
          </p>
        </div>
        <CreateOrganizationDialog session={session} />
      </div>

      {/* Tenant Info */}
      {session?.user?.tenantId && (
        <div className="mb-6">
          <Badge variant="secondary">Tenant ID: {session.user.tenantId}</Badge>
        </div>
      )}

      {/* Organization List */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`skeleton-${i}`} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : organizations && organizations.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {organizations.map((org) => (
            <Card
              key={`organization-${org.id}`}
              className="cursor-pointer hover:border-primary/40 transition-all duration-200"
              onClick={async () => {
                const updated = await updateSession({ organizationId: org.id })
                if (updated?.user?.organizationId === org.id) {
                  router.push(`/organization/${org.id}`)
                } else {
                  toast.error('You are not a member of this organization')
                }
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{org.name}</CardTitle>
                  <Badge variant="outline">{org.slug}</Badge>
                </div>
                <CardDescription className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  {org.city}, {org.state} {org.zipCode}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {org._count.members}{' '}
                    {org._count.members === 1 ? 'member' : 'members'}
                  </span>
                  <span className="flex items-center gap-1">
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
        <Card className="flex flex-col items-center justify-center py-16">
          <Building2 className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mb-4" />
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            No organizations yet
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            Create your first organization to get started.
          </p>
        </Card>
      )}
    </div>
  )
}

export default TenantPage
