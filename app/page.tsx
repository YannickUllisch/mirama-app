'use client'
import PublicHeader from '@/src/components/Header/PublicHeader'
import { NextSeo } from 'next-seo'

const HomePage = () => {
  return (
    <>
      <NextSeo
        title={'Homepage'}
        description={'Mirama Tool Homepage'}
        noindex
      />
      <PublicHeader />

      <main className="flex items-center flex-col h-screen">MIRAMA</main>
    </>
  )
}

export default HomePage
