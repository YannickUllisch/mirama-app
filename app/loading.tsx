import { Spinner } from '@ui/spinner'
import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className="w-full flex justify-center items-center h-[100vh]">
      <Spinner size="md" className="bg-black dark:bg-white" />
    </div>
  )
}

export default Loading
