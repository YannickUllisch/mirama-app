// app/(app)/organization/[organizationSlug]/settings/page.tsx
import { redirect } from 'next/navigation'

const SettingsIndexPage = async ({
  params,
}: {
  params: Promise<{ organizationSlug: string }>
}) => {
  const { organizationSlug } = await params
  redirect(`/organization/${organizationSlug}/settings/account/preferences`)
}

export default SettingsIndexPage
