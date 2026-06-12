// app/(app)/portal/_components/PortalChooser.tsx
'use client'
import apiRequest from '@hooks'
import type { OrganizationListResponse } from '@server/modules/account/organizations/features/response'
import { TenantResourceProvider } from '@src/modules/tenant/tenant/tenantResourceContext'
import { Button } from '@ui/button'
import { Skeleton } from '@ui/skeleton'
import {
  Building2,
  LogOut,
  Plus,
  Settings2,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import OrgPortalCard from './OrgPortalCard'
import SecondaryPortalCard from './SecondaryPortalCard'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

interface PortalChooserInnerProps {
  tenantId: string
  userName: string
}

const PortalChooserInner = ({
  tenantId,
  userName,
}: PortalChooserInnerProps) => {
  const router = useRouter()
  const { update: updateSession } = useSession()
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

  const handleEnterTenant = async () => {
    await updateSession({ organizationId: null })
    router.push(`/tenant/${tenantId}`)
  }

  const firstName = userName.split(' ')[0]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header — dark surface bookend */}
      <header className="bg-surface-dark px-6 md:px-10 h-14 flex items-center justify-between shrink-0">
        <div>
          <span className="text-xl font-black tracking-tight text-white">
            MIRAMA
            <span className="text-white/40">.</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/50 hidden sm:block">
            {userName}
          </span>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors px-2 py-1.5 rounded-md hover:bg-white/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 md:px-10 py-14">
        {/* Greeting */}
        <div className="mb-12">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            {getGreeting()}
          </p>
          <h1 className="text-3xl font-medium text-foreground">{firstName}.</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Select a portal to continue.
          </p>
        </div>

        {/* Organization Portals */}
        <section className="mb-10">
          <p className="text-xs font-medium text-muted-foreground mb-4">
            Organization portals
          </p>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={`portal-skel-${i}`}
                  className="h-42 rounded-xl"
                />
              ))}
            </div>
          ) : !organizations?.length ? (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border/50 rounded-xl text-center">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No organizations yet
              </p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Create your first organization in the tenant portal.
              </p>
              <Button variant="outline" size="sm" onClick={handleEnterTenant}>
                <Plus className="w-3.5 h-3.5" />
                Go to tenant portal
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {organizations.map((org, i) => (
                <OrgPortalCard
                  key={org.id}
                  org={org}
                  colorIndex={i}
                  onEnter={handleEnterOrg}
                />
              ))}
            </div>
          )}
        </section>

        {/* Secondary Portals */}
        <section>
          <p className="text-xs font-medium text-muted-foreground mb-4">
            More portals
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SecondaryPortalCard
              icon={Settings2}
              label="Tenant Admin"
              description="Manage your workspace, billing, roles and settings."
              variant="dark"
              onClick={handleEnterTenant}
            />
            <SecondaryPortalCard
              icon={Users}
              label="Client Portal"
              description="External client access and collaboration."
              variant="cream"
              comingSoon
            />
            <SecondaryPortalCard
              icon={TrendingUp}
              label="Finance Portal"
              description="Financial reporting, invoices and expenses."
              variant="mint"
              comingSoon
            />
            <SecondaryPortalCard
              icon={UserCheck}
              label="HR Portal"
              description="People management, payroll and onboarding."
              variant="mustard"
              comingSoon
            />
          </div>
        </section>
      </main>

      {/* Footer — dark surface bookend */}
      <footer className="bg-surface-dark px-6 md:px-10 py-5 flex items-center justify-between">
        <p className="text-xs text-white/40">Mirama Management Platform</p>
        <p className="text-xs text-white/25">© {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

interface PortalChooserProps {
  tenantId: string
  userName: string
}

const PortalChooser = ({ tenantId, userName }: PortalChooserProps) => (
  <TenantResourceProvider value={{ activeTenantId: tenantId }}>
    <PortalChooserInner tenantId={tenantId} userName={userName} />
  </TenantResourceProvider>
)

export default PortalChooser
