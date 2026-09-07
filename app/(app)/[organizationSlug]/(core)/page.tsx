'use client'
import OrgLink from '@src/components/OrgLink'
import { useShellHeader } from '@src/components/layouts/shell/ShellHeaderContext'
import ShellHeaderCrumb from '@src/components/layouts/shell/ShellHeaderCrumb'
import PageHeader from '@src/components/PageHeader'
import { Button } from '@ui/button'
import { Plus, User } from 'lucide-react'
import { DateTime } from 'luxon'

const Dashboard = () => {
  useShellHeader(<ShellHeaderCrumb items={[{ label: 'Dashboard' }]} />)

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Overview"
        icon={User}
        description={DateTime.now().toFormat('EEEE, d MMMM')}
      >
        <OrgLink href="/projects/create">
          <Button variant={'tertiary'}>
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Button>
        </OrgLink>
      </PageHeader>
    </div>
  )
}

export default Dashboard
