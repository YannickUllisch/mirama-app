'use server'

import { Leaf } from 'lucide-react'

const HomePage = async () => {
  return (
    <>
      <main className="flex items-center flex-col h-screen mt-40">
        <div className="flex w-[50%] justify-between">
          <div>
            <h1 className="text-6xl font-bold mb-4">
              Manage. <br />
              Collaborate. <br />
              Achieve.
            </h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Project & Task Management made easy.
            </p>
          </div>
          <div className="items-center justify-center flex flex-col">
            <Leaf
              width={120}
              height={120}
              strokeWidth={2}
              className="text-rose-500"
            />
            <span className="font-semibold" style={{ fontSize: 50 }}>
              MIRAMA
            </span>
          </div>
        </div>
      </main>
    </>
  )
}

export default HomePage
