// app/(app)/organization/[organizationId]/(pm)/layout.tsx
import { auth } from '@auth'
import { SidebarInset } from '@src/components/animate-ui/components/radix/sidebar'
import SidebarProjectsSkeleton from '@src/components/Skeletons/SidebarProjectsSkeleton'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import PmClientsServer from './_components/PmClientsServer'
import PmHeader from './_components/PmHeader'
import { PmHeaderProvider } from './_components/PmHeaderContext'
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
      <PmHeaderProvider>
        <PmSidebar
          organizationId={organizationId}
          clientsSlot={
            <Suspense fallback={<SidebarProjectsSkeleton />}>
              <PmClientsServer organizationId={organizationId} />
            </Suspense>
          }
        />
        <SidebarInset className="overflow-hidden">
          <PmHeader />
          <main className="flex-1 overflow-y-auto bg-card rounded-l-lg">
            <div className="p-5 min-h-full">{children}</div>
          </main>
        </SidebarInset>
      </PmHeaderProvider>
    </PmSidebarProvider>
  )
}

export default ShellLayout
