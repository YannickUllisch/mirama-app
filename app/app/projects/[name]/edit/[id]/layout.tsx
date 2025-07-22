import { auth } from '@auth'
import db from '@db'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Edit Task',
  description: 'Edit your Task',
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ name: string; id: string }>
}) => {
  const session = await auth()

  const awaitedParams = await params

  // We need to perform validation for both project and task
  const [project, task] = await db.$transaction([
    db.project.findFirst({
      where: {
        name: awaitedParams.name,
        teamId: session?.user.teamId ?? 'undef',
      },
      select: {
        id: true,
      },
    }),
    db.task.findFirst({
      where: {
        id: awaitedParams.id,
      },
      select: {
        id: true,
      },
    }),
  ])

  // Handling invalid dynamic routes
  if (!session?.user) {
    return redirect(
      `/auth/login?callbackUrl=/app/${awaitedParams.name}/edit/${awaitedParams.id}`,
    )
  }

  if (!task) {
    redirect(`/app/${awaitedParams.name}`)
  }

  if (!project) {
    redirect('/app')
  }

  return children
}

export default Layout
