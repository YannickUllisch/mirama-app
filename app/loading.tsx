import { Spinner } from '@ui/spinner'

const Loading = () => {
  return (
    <div className="w-full flex justify-center items-center h-screen">
      <Spinner size="md" className="bg-black dark:bg-white" />
    </div>
  )
}

export default Loading
