// app/(app)/portal/_components/PortalChooser.tsx
'use client'
import apiRequest from '@hooks'
import type { OrganizationResponse } from '@src/modules/tenant/organization/organization.types'
import { TenantResourceProvider } from '@src/modules/tenant/tenant/tenantResourceContext'
import { Button } from '@ui/button'
import { Skeleton } from '@ui/skeleton'
import { Building2, LogOut, Plus, Settings2 } from 'lucide-react'
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

  const handleEnterTenant = async () => {
    await updateSession({ organizationId: null })
    router.push(`/tenant/${tenantId}`)
  }

  const firstName = userName.split(' ')[0]

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Header — white canvas, hairline border */}
      <header className="bg-canvas border-b border-hairline h-12 px-8 flex items-center justify-between shrink-0">
        <span className="text-[15px] font-black tracking-tight text-ink">
          MIRAMA<span className="text-ink/20">.</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-body-text hidden sm:block">
            {userName}
          </span>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="inline-flex items-center gap-1.5 text-sm text-body-text hover:text-ink transition-colors px-2 py-1.5 rounded-md hover:bg-surface-soft"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </header>

      {/* Main canvas */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 md:px-10 py-16">
        {/* Hero */}
        <div className="mb-14 text-center">
          <p className="text-[11px] font-medium tracking-[0.6px] uppercase text-body-text mb-2">
            {getGreeting()}
          </p>
          <h1 className="text-[32px] font-[450] text-ink leading-tight">
            {firstName}.
          </h1>
          <p className="text-sm text-body-text mt-2">
            Select an organization to continue.
          </p>
        </div>

        {/* Organizations */}
        <section className="mb-12">
          <p className="text-[11px] font-medium tracking-[0.6px] uppercase text-body-text mb-4">
            Your organizations
          </p>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={`portal-skel-${i}`}
                  className="h-52 rounded-xl"
                />
              ))}
            </div>
          ) : !organizations?.length ? (
            <div className="flex flex-col items-center justify-center py-14 border border-dashed border-hairline rounded-xl text-center bg-surface-soft">
              <div className="w-10 h-10 rounded-lg bg-surface-medium flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5 text-body-text" />
              </div>
              <p className="text-sm font-medium text-ink">
                No organizations yet
              </p>
              <p className="text-xs text-body-text mt-1 mb-4">
                Create your first organization in the tenant portal.
              </p>
              <Button variant="outline" size="sm" onClick={handleEnterTenant}>
                <Plus className="w-3.5 h-3.5" />
                Go to tenant portal
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {organizations.map((org) => (
                <OrgPortalCard
                  key={org.id}
                  org={org}
                  onEnter={handleEnterOrg}
                />
              ))}
            </div>
          )}
        </section>

        {/* Workspace settings */}
        <section>
          <p className="text-[11px] font-medium tracking-[0.6px] uppercase text-body-text mb-4">
            Workspace settings
          </p>
          <div className="max-w-xs">
            <SecondaryPortalCard
              icon={Settings2}
              label="Tenant portal"
              description="Manage billing, members, roles, and workspace settings."
              onClick={handleEnterTenant}
            />
          </div>
        </section>
      </main>

      {/* Footer — minimal, white canvas, hairline top */}
      <footer className="bg-canvas border-t border-hairline px-8 py-4 flex items-center justify-between">
        <p className="text-xs text-body-text">Mirama Management Platform</p>
        <p className="text-xs text-body-text/50">
          © {new Date().getFullYear()}
        </p>
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
