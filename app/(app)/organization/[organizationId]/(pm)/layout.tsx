import { auth } from '@auth'
import { SidebarInset } from '@src/components/animate-ui/components/radix/sidebar'
import { redirect } from 'next/navigation'
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
          clientsSlot={<PmClientsServer organizationId={organizationId} />}
        />
        <SidebarInset className="overflow-hidden transition-[margin,border-radius] duration-400 ease-[cubic-bezier(0.7,-0.15,0.25,1.15)] lg:my-2 lg:mr-2 lg:rounded-xl lg:peer-data-[state=collapsed]:ml-2">
          <PmHeader />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="p-5 min-h-full">{children}</div>
          </main>
        </SidebarInset>
      </PmHeaderProvider>
    </PmSidebarProvider>
  )
}

export default ShellLayout
