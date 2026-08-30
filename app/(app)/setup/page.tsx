// app/(app)/setup/page.tsx
import { auth } from '@auth'
import { TenantResourceProvider } from '@src/modules/tenant/tenant/tenantResourceContext'
import { redirect } from 'next/navigation'
import SetupTabs from './_components/SetupTabs'

const SetupPage = async () => {
  const session = await auth()
  if (!session?.user.tenantId) redirect('/auth/login')

  return (
    <TenantResourceProvider value={{ activeTenantId: session.user.tenantId }}>
      <div className="min-h-screen flex items-center bg-canvas px-6">
        <div className="w-full max-w-md mx-auto">
          <SetupTabs />
        </div>
      </div>
    </TenantResourceProvider>
  )
}

export default SetupPage
