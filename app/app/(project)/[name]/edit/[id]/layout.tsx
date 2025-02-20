import type { Metadata } from 'next'
import { auth } from '@auth'
import { redirect } from 'next/navigation'
import db from '@db'

export const metadata: Metadata = {
  title: 'Edit Task',
  description: 'Edit your Task',
}

const Layout = async ({
  children,
  params,
}: { children: React.ReactNode; params: { name: string; id: string } }) => {
  const session = await auth()

  // We need to perform validation for both project and task
  const [project, task] = await db.$transaction([
    db.project.findFirst({
      where: {
        name: params.name,
        teamId: session?.user.teamId ?? 'undef',
      },
      select: {
        id: true,
      },
    }),
    db.task.findFirst({
      where: {
        id: params.id,
      },
      select: {
        id: true,
      },
    }),
  ])

  // Handling invalid dynamic routes
  if (!session?.user) {
    return redirect(
      `/auth/login?callbackUrl=/app/${params.name}/edit/${params.id}`,
    )
  }

  if (!task) {
    redirect(`/app/${params.name}`)
  }

  if (!project) {
    redirect('/app')
  }

  return children
}

export default Layout
