'use client'
import { addDays } from 'date-fns'
import TaskPriorityWidget from '@src/components/Widgets/MyTasksWidget'
import useSWR from 'swr'
import type {
  Project,
  ProjectUser,
  Task,
  TaskStatusType,
  User,
} from '@prisma/client'
import { updateResourceByIdNoToast } from '@src/lib/api/updateResource'

import UpcomingMilestoneWidget from '@src/components/Widgets/UpcomingMilestoneWidget'

const mockMilestones = [
  {
    id: 'milestone1',
    date: addDays(new Date(), 3),
    title: 'Design Phase Complete',
    colors: 'bg-blue-500',
    projectId: '1',
  },
  {
    id: 'milestone2',
    date: addDays(new Date(), 7),
    title: 'Alpha Release',
    colors: 'bg-green-500',
    projectId: '2',
  },
  {
    id: 'milestone3',
    date: addDays(new Date(), 14),
    title: 'Beta Testing',
    colors: 'bg-purple-500',
    projectId: '2',
  },
]

const Dashboard = () => {
  const { data: projects } = useSWR<
    (Project & {
      tasks: Task[]
      users: (ProjectUser & { user: User })[]
    })[]
  >({
    url: 'project',
    archived: 'false',
    select: {
      name: true,
      startDate: true,
      endDate: true,
      priority: true,
      tasks: true,
    },
  })

  const { data: personalTasks, mutate: updatePersonalTasks } = useSWR<Task[]>({
    url: 'task/personal',
  })

  // Mock function for task update
  const handleTaskUpdate = async (taskId: string, status: TaskStatusType) => {
    // Simulate API call delay
    await updateResourceByIdNoToast('task', taskId, { status })
    return Promise.resolve()
  }

  return (
    <div className="flex ">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Main dashboard content - fixed height */}
        <div className="flex-1 grid md:grid-cols-12 gap-4 p-4 ">
          {/* Left column - Project overview and stats */}
          <div className="col-span-8 grid grid-rows-[auto_1fr] gap-4">
            {/* Projects and milestones */}
            <div className="flex flex-col gap-4 h-full">
              {/* Upcoming milestones */}
              <UpcomingMilestoneWidget milestones={mockMilestones} />
            </div>
          </div>
          {/* Right column - Task priority widget */}
          <div className="col-span-4 h-full">
            <TaskPriorityWidget
              tasks={personalTasks ?? []}
              initialVisibleCount={6}
              onTaskUpdate={handleTaskUpdate}
              updatePersonalTasks={updatePersonalTasks}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
