// app/(app)/organization/[organizationId]/settings/invitations/page.tsx
import { auth } from '@auth'
import InvitationsTab from './_components/InvitationsTab'

const InvitationsPage = async () => {
  const session = await auth()
  return <InvitationsTab session={session} />
}

export default InvitationsPage
