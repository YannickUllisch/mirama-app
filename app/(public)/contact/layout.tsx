import ContactFooter from '@src/components/Footer/ContactFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Mirama',
  description: 'Contact Us Form',
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ContactFooter />
    </>
  )
}

export default Layout
