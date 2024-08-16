import type { FC, PropsWithChildren } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@src/lib/utils'

interface HoverBoxProps {
  styleOptions?: {
    classnameouter?: string
    classnameinner?: string
    bgsizeIncrease: number
    minWidth: number
    minHeight: number
  }
}

const HoverBox: FC<PropsWithChildren<HoverBoxProps>> = ({
  children,
  styleOptions = {
    classnameouter: '',
    classnameinner: '',
    bgsizeIncrease: 50,
    minHeight: 350,
    minWidth: 250,
  },
}) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXspring = useSpring(x)
  const mouseYspring = useSpring(y)

  const rotateX = useTransform(
    mouseYspring,
    [0.5, -0.5],
    ['-15.5deg', '15.5deg'],
  )
  const rotateY = useTransform(
    mouseXspring,
    [0.5, -0.5],
    ['15.5deg', '-15.5deg'],
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className={cn(
        'bg-white/30 shadow-lg dark:bg-neutral-900/30 dark:shadow-neutral-800 outline outline-neutral-50 dark:outline-neutral-800 relative rounded-lg min-w-[200px] min-h-[450px]',
        styleOptions.classnameouter,
      )}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          'absolute rounded-md shadow-lg inset-4 bg-primary min-w-[150px] min-h-[400px]',
          styleOptions.classnameinner,
        )}
        style={{
          transform: 'translateZ(75px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}

export default HoverBox
