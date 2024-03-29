'use client'
import { NextSeo } from 'next-seo'
import PublicHeader from '@/src/components/Header/PublicHeader'

const HomePage = () => {
  return (
    <>
      <PublicHeader />
      <main className="flex items-center flex-col h-screen">
        <h1 className="dark:text-white" style={{ fontSize: 50, marginTop: 50 }}>
          Mirage Management
        </h1>
      </main>
    </>
  )
}

export default HomePage
