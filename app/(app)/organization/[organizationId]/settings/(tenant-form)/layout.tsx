// app/(app)/organization/[organizationId]/settings/(tenant-form)/layout.tsx
import TenantSettingsFormProvider from './_components/TenantSettingsFormProvider'

const TenantFormLayout = ({ children }: { children: React.ReactNode }) => (
  <TenantSettingsFormProvider>{children}</TenantSettingsFormProvider>
)

export default TenantFormLayout
