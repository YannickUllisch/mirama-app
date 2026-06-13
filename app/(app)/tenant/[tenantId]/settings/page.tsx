// app/(app)/tenant/[tenantId]/settings/page.tsx
import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ tenantId: string }>
}

const SettingsPage = async ({ params }: Props) => {
  const { tenantId } = await params
  redirect(`/tenant/${tenantId}/settings/general`)
}

export default SettingsPage
