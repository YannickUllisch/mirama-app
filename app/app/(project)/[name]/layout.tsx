import type { Metadata } from 'next'
import { auth } from '@auth'
import { db } from '@db'

export const metadata: Metadata = {
  title: 'Projects | Mirama',
  description: 'Project and Task Management',
}

export const dynamicParams = true

// We can allow to generate all paths while the website is small and only used by one company
// The way this is currently done it is not scalable at all.
export const generateStaticParams = async () => {
  const projects = await db.project.findMany({
    select: {
      name: true,
    },
  })

  return projects.map((project) => ({
    name: project.name,
  }))
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
