import { auth } from '@auth'
import { SIDEBAR_COOKIE_NAME, SidebarInset } from '@src/components/ui/sidebar'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ShellHeader from '@src/components/layouts/shell/ShellHeader'
import { ShellHeaderProvider } from '@src/components/layouts/shell/ShellHeaderContext'
import ShellSidebarProvider from '@src/components/layouts/shell/ShellSidebarProvider'
import ShellSidebarServer from '@src/components/layouts/shell/ShellSidebarServer'

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

  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value
  const defaultOpen =
    sidebarCookie === undefined ? true : sidebarCookie === 'true'

  return (
    <ShellSidebarProvider defaultOpen={defaultOpen}>
      <ShellHeaderProvider>
        <ShellSidebarServer organizationId={organizationId} />
        <SidebarInset className="overflow-hidden transition-[margin,border-radius] duration-400 ease-[cubic-bezier(0.7,-0.15,0.25,1.15)] lg:my-2 lg:mr-2 lg:rounded-xl lg:peer-data-[state=collapsed]:ml-2">
          <ShellHeader />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="p-5 min-h-full">{children}</div>
          </main>
        </SidebarInset>
      </ShellHeaderProvider>
    </ShellSidebarProvider>
  )
}

export default ShellLayout
