// app/(app)/organization/[organizationId]/settings/page.tsx
import { redirect } from 'next/navigation'

const SettingsIndexPage = async ({
  params,
}: {
  params: Promise<{ organizationId: string }>
}) => {
  const { organizationId } = await params
  redirect(`/organization/${organizationId}/settings/general`)
}

export default SettingsIndexPage
