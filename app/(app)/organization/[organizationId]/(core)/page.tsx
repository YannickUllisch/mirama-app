'use client'
import apiRequest from '@hooks'
import HoverLink from '@src/components/HoverLink'
import PageHeader from '@src/components/PageHeader'
import MetricCard from '@src/components/ProjectDashboard/MetricCard'
import ProjectGrid from '@src/components/ProjectDashboard/ProjectGrid'
import TimelineCard from '@src/components/ProjectDashboard/TimelineCard'
import { Button } from '@ui/button'
import {
  ChevronRight,
  Clock,
  Kanban,
  ListChecks,
  Plus,
  User,
} from 'lucide-react'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'
import { useShellHeader } from '@src/components/layouts/shell/ShellHeaderContext'
import ShellHeaderCrumb from '@src/components/layouts/shell/ShellHeaderCrumb'

const Dashboard = () => {
  useShellHeader(<ShellHeaderCrumb label="Dashboard" />)

  const {
    items: projects,
    data: projectsData,
    isLoading: isProjectsLoading,
  } = apiRequest.project.fetchAll.useQuery()

  const { data: session } = useSession()

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Overview"
        icon={User}
        description={DateTime.now().toFormat('EEEE, d MMMM')}
      >
        <HoverLink
          href={`/organization/${session?.user.organizationId}/projects/create`}
        >
          <Button variant={'tertiary'}>
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Button>
        </HoverLink>
      </PageHeader>

      <main className="flex-1 px-8 py-6 overflow-y-auto">
        <div className="grid grid-cols-12 gap-8 max-w-400 mx-auto">
          <div className="col-span-12 lg:col-span-8 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label="Active Projects"
                value={projectsData?.totalCount || 0}
                icon={Kanban}
                trend="+2 this month"
              />
              <MetricCard label="Open Tasks" value={0} icon={ListChecks} />
              <MetricCard
                label="Hours Tracked"
                value="124.5"
                icon={Clock}
                trend="On track"
              />
            </div>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">
                  Recent Projects
                </h2>
                <HoverLink
                  href={`/organization/${session?.user.organizationId}/projects`}
                >
                  <Button variant={'ghost'}>
                    View all <ChevronRight className="w-4 h-4" />
                  </Button>
                </HoverLink>
              </div>
              <ProjectGrid projects={projects} loading={isProjectsLoading} />
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight">Schedule</h2>
              <TimelineCard projects={projects} loading={isProjectsLoading} />
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
