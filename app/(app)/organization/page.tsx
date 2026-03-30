import { auth } from '@auth'
import { redirect } from 'next/navigation'

const OrganizationPage = async () => {
  const session = await auth()

  if (session?.user.organizationId) {
    redirect(`/organization/${session?.user.organizationId}`)
  }
  redirect(`/tenant/${session?.user.tenantId}`)
}

export default OrganizationPage
