import { auth } from '@auth'
import QueryClientWrapper from '@src/components/Wrappers/QueryClientWrapper'
import SessionWrapper from '@src/components/Wrappers/SessionWrapper'
import { redirect } from 'next/navigation'

const TenantLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()

  if (!session) {
    return redirect('/auth/login?callbackUrl=/tenant')
  }

  return (
    <SessionWrapper>
      <QueryClientWrapper>
        <div className="min-h-screen bg-background">{children}</div>
      </QueryClientWrapper>
    </SessionWrapper>
  )
}

export default TenantLayout
