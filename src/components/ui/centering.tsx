import { cn } from '@src/lib/utils'
import React, { type FC, type PropsWithChildren } from 'react'

interface CenteringProps {
  className?: string
}

const Centering: FC<PropsWithChildren<CenteringProps>> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {children}
    </div>
  )
}

export default Centering
