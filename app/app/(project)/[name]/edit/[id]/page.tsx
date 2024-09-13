'use server'
import { auth } from '@src/lib/auth'
import { db } from '@src/lib/db'
import { redirect } from 'next/navigation'
import EditTaskForm from './client'

const EditTaskPage = async ({
  params,
}: { params: { name: string; id: string } }) => {
  const session = await auth()

  // Fetching in parallel
  const [task, project, tags] = await Promise.all([
    db.task.findFirst({
      where: {
        id: params.id,
      },
      include: {
        assignedTo: true,
        tags: true,
        parent: true,
        subtasks: true,
        category: true,
      },
    }),
    db.project.findFirst({
      where: {
        name: params.name,
        teamId: session?.user.teamId,
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        tasks: true,
        taskCategories: true,
      },
    }),
    db.tag.findMany({
      where: {
        teamId: session?.user.teamId,
      },
    }),
  ])

  if (!task) {
    redirect(`/app/${params.name}`)
  }

  if (!project) {
    redirect('/app')
  }

  return (
    <main className="flex flex-col">
      <EditTaskForm
        project={project}
        tags={tags}
        task={task}
        projName={project.name}
      />
    </main>
  )
}

export default EditTaskPage
