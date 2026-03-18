import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Mirama’s mission, values, and the team behind the platform. Discover our story, vision, and commitment to empowering organizations and teams.',
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default Layout
