import PageHeader from '@src/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Link2 } from 'lucide-react'

const ConnectedAccountsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Connected accounts"
        icon={Link2}
        description="Link external accounts and integrations"
      />
      <div className="flex-1 px-10 md:px-16 pb-10">
        <Card className="overflow-hidden">
          <CardHeader className="px-6 py-4 bg-surface-dark">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
              <Link2 className="w-4 h-4 text-white/70" />
              Connections
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

export default ConnectedAccountsPage
