import { auth } from '@auth'
import PmClientsList from './PmClientsList'

export type PmClient = {
  id: string
  name: string
  slug: string
}

const PmClientsServer = async ({
  organizationId,
}: {
  organizationId: string
}) => {
  const session = await auth()
  if (!session?.user.memberId) return null

  const clients: PmClient[] = []

  return <PmClientsList organizationId={organizationId} clients={clients} />
}

export default PmClientsServer
