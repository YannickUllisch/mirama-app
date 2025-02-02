import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Budget | Mirama',
  description: 'Management of Project Budgets',
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
