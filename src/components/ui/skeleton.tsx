import { cn } from '@src/lib/utils'

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-border/60 dark:bg-border/40',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
