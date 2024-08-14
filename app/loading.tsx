import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className="w-full flex justify-center align-center min-h-[500px]">
      <Loader2 className="h-6 w-6 animate-spin ml-2 dark:text-white m-1" />
    </div>
  )
}

export default Loading
