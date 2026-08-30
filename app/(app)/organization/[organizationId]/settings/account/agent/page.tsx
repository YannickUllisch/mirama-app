// app/(app)/organization/[organizationId]/settings/account/agent/page.tsx
import PageHeader from '@src/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Bot } from 'lucide-react'

const AgentPersonalizationPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Agent personalization"
        icon={Bot}
        description="Customize how AI agents behave for you"
      />
      <div className="flex-1 px-10 md:px-16 pb-10">
        <Card className="overflow-hidden">
          <CardHeader className="px-6 py-4 bg-surface-dark">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
              <Bot className="w-4 h-4 text-white/70" />
              Agent preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AgentPersonalizationPage
