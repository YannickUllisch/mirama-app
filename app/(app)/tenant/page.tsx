import { auth } from '@auth'
import { redirect } from 'next/navigation'

const TenantPage = async () => {
  const session = await auth()
  redirect(`/tenant/${session?.user.tenantId}`)
}

export default TenantPage
