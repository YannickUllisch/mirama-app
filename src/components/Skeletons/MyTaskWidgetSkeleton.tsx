import { Skeleton } from '@ui/skeleton'

const MyTaskWidgetSkeleton = () => {
  return (
    <div className="h-[250px] flex-grow flex gap-2 flex-col w-full ">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={`skeleton-${index}`} className="w-full h-[40px]" />
      ))}
    </div>
  )
}

export default MyTaskWidgetSkeleton
