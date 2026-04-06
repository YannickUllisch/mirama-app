// app/(app)/tenant/[tenantId]/settings/page.tsx
import PageHeader from '@src/components/PageHeader'
import { Settings } from 'lucide-react'
import { Suspense } from 'react'
import SettingsForm from './_components/SettingsForm'
import SettingsFormSkeleton from './_components/SettingsFormSkeleton'

const SettingsPage = () => {
  return (
    <>
      <PageHeader
        icon={Settings}
        title="Settings"
        description="Tenant configuration"
      />

      <Suspense fallback={<SettingsFormSkeleton />}>
        <SettingsForm />
      </Suspense>
    </>
  )
}

export default SettingsPage
