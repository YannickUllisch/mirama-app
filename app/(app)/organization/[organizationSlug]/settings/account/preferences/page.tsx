import PageHeader from '@src/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Input } from '@ui/input'
import { Label } from '@ui/label'
import { Settings2 } from 'lucide-react'

const PreferencesPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Preferences"
        icon={Settings2}
        description="Personalize how Mirama looks and behaves for you"
      />
      <div className="flex-1 px-10 md:px-16 pb-10">
        <Card className="overflow-hidden">
          <CardHeader className="px-6 py-4 bg-surface-dark">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
              <Settings2 className="w-4 h-4 text-white/70" />
              General
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-2 max-w-xs">
            <Label>Date format</Label>
            <Input disabled value="dd-MM-yyyy" />
            <p className="text-xs text-muted-foreground">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PreferencesPage
