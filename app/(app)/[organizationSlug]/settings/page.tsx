import { redirect } from 'next/navigation'

const SettingsIndexPage = async ({
  params,
}: {
  params: Promise<{ organizationSlug: string }>
}) => {
  const { organizationSlug } = await params
  redirect(`/${organizationSlug}/settings/account/preferences`)
}

export default SettingsIndexPage
