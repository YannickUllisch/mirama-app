'use server'
import InfoFooter from '@src/components/Footer/InfoFooter'
import TestFooter from '@src/components/Footer/TestFooter'
import PublicHeader from '@src/components/Header/PublicHeader'
import React, { type FC, type PropsWithChildren } from 'react'

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  return (
    <>
      <PublicHeader />
      {children}
      {/* <TestFooter />
      <InfoFooter /> */}
    </>
  )
}

export default Layout
