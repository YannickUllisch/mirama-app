import { cn } from '@src/lib/utils'
import React, { type FC, type PropsWithChildren } from 'react'

interface SectionHeadingProps {
  classname?: string
}

const SectionHeading: FC<PropsWithChildren<SectionHeadingProps>> = ({
  children,
  classname,
}) => {
  return (
    <div
      className={cn(
        'flex items-center text-xs border rounded-md p-2 gap-2 text-text-inverted bg-text dark:border-neutral-400',
        classname,
      )}
    >
      {children}
    </div>
  )
}

export default SectionHeading
