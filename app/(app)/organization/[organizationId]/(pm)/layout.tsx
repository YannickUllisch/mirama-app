// app/(app)/organization/[organizationId]/(pm)/layout.tsx
import { auth } from '@auth'
import { SidebarInset } from '@src/components/animate-ui/components/radix/sidebar'
import SidebarProjectsSkeleton from '@src/components/Skeletons/SidebarProjectsSkeleton'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import PmClientsServer from './_components/PmClientsServer'
import PmCollapsedHeader from './_components/PmCollapsedHeader'
import PmMobileHeader from './_components/PmMobileHeader'
import PmSidebar from './_components/PmSidebar'
import PmSidebarProvider from './_components/PmSidebarProvider'

const ShellLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ organizationId: string }>
}) => {
  const session = await auth()
  const { organizationId } = await params

  if (!session?.user.tenantId) {
    redirect('/auth/login')
  }

  return (
    <PmSidebarProvider>
      <PmSidebar
        organizationId={organizationId}
        clientsSlot={
          <Suspense fallback={<SidebarProjectsSkeleton />}>
            <PmClientsServer organizationId={organizationId} />
          </Suspense>
        }
      />
      <SidebarInset className="overflow-hidden">
        <PmMobileHeader />
        <PmCollapsedHeader />
        <main className="flex-1 overflow-y-auto bg-card rounded-l-lg">
          <div className="p-5 min-h-full">{children}</div>
        </main>
      </SidebarInset>
    </PmSidebarProvider>
  )
}

export default ShellLayout
