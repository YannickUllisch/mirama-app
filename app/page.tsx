'use server'

import PublicHeader from '@/src/components/Header/PublicHeader'

const HomePage = async () => {
  return (
    <>
      <PublicHeader />
      <main className="flex items-center flex-col h-screen">
        <div className="text-center mt-20 px-4">
          <h1 className="text-6xl font-bold mb-4">
            Manage. Collaborate. Achieve
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Platform Description..
          </p>
        </div>
      </main>
    </>
  )
}

export default HomePage
