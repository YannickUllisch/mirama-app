'use client'
import HoverLink from '@src/components/HoverLink'
import { useShellHeader } from '@src/components/layouts/shell/ShellHeaderContext'
import ShellHeaderCrumb from '@src/components/layouts/shell/ShellHeaderCrumb'
import PageHeader from '@src/components/PageHeader'
import { Button } from '@ui/button'
import { Plus, User } from 'lucide-react'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'

const Dashboard = () => {
  useShellHeader(<ShellHeaderCrumb items={[{ label: 'Dashboard' }]} />)

  const { data: session } = useSession()

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Overview"
        icon={User}
        description={DateTime.now().toFormat('EEEE, d MMMM')}
      >
        <HoverLink
          href={`/organization/${session?.user.organizationSlug}/projects/create`}
        >
          <Button variant={'tertiary'}>
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Button>
        </HoverLink>
      </PageHeader>
    </div>
  )
}

export default Dashboard
