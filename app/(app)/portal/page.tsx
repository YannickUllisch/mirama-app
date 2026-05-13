// app/(app)/(portal)/page.tsx
import { auth } from '@auth'
import { redirect } from 'next/navigation'
import PortalChooser from './_components/PortalChooser'

const PortalPage = async () => {
  const session = await auth()

  if (!session?.user?.tenantId) {
    redirect('/auth/login')
  }

  return (
    <PortalChooser
      tenantId={session.user.tenantId}
      userName={session.user.name ?? 'User'}
    />
  )
}

export default PortalPage
