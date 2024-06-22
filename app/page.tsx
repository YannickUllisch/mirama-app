'use server'

import PublicHeader from '@/src/components/Header/PublicHeader'

const HomePage = async () => {
  return (
    <>
      <PublicHeader />
      <main className="flex items-center flex-col h-screen">...</main>
    </>
  )
}

export default HomePage
