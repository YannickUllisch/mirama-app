import db from '@db'
import { TaskType } from '@prisma/client'
import { auth } from '@server/auth/auth'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Create Task',
  description: 'Create a new Task',
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ name: string; type: string }>
}) => {
  const session = await auth()

  const awaitedParams = await params

  const project = await db.project.findFirst({
    where: {
      name: awaitedParams.name,
      teamId: session?.user.teamId ?? 'undef',
    },
    select: {
      id: true,
    },
  })

  // Handling invalid dynamic routes
  if (!session?.user) {
    return redirect(
      `/auth/login?callbackUrl=/app/${awaitedParams.name}/create/${awaitedParams.type}`,
    )
  }

  const validTypes = Object.values(TaskType)
  if (!validTypes.includes(awaitedParams.type.toUpperCase() as TaskType)) {
    redirect(`/app/${awaitedParams.name}`)
  }

  if (!project) {
    redirect('/app')
  }

  return <>{children}</>
}

export default Layout
