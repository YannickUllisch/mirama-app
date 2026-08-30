// app/(app)/organization/[organizationId]/settings/account/security/page.tsx
import PageHeader from '@src/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { ShieldCheck } from 'lucide-react'
import CloseAccountButton from './_components/CloseAccountButton'

const SecurityPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Security & access"
        icon={ShieldCheck}
        description="Manage your account security"
      />
      <div className="flex-1 px-10 md:px-16 pb-10">
        <Card className="overflow-hidden">
          <CardHeader className="px-6 py-4 bg-surface-dark">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
              <ShieldCheck className="w-4 h-4 text-white/70" />
              Critical actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <CloseAccountButton />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SecurityPage
