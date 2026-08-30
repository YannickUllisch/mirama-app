// app/(app)/setup/_components/SetupSlider.tsx
'use client'

import { Children } from 'react'
import { motion, type Transition } from 'motion/react'

// Premium, pure x-axis pane transition. Panes are stacked in the same grid
// cell (not measured/height-animated like animate-ui's TabsContents), so
// there is no vertical component at all - only transform: translateX moves,
// softened by a blur/opacity crossfade so the pane's edge never reads as a
// hard-cut bounding box.
export const setupSliderTransition: Transition = {
  type: 'tween',
  duration: 0.85,
  ease: [0.16, 1, 0.3, 1],
}

type SetupSliderProps = {
  activeIndex: number
  children: React.ReactNode
}

const SetupSlider = ({ activeIndex, children }: SetupSliderProps) => {
  const panes = Children.toArray(children)

  return (
    <div className="grid overflow-hidden">
      {panes.map((pane, index) => {
        const isActive = index === activeIndex
        return (
          <motion.div
            key={index}
            className="col-start-1 row-start-1 w-full px-2"
            initial={false}
            animate={{
              x: `${(index - activeIndex) * 100}%`,
              opacity: isActive ? 1 : 0,
              filter: isActive ? 'blur(0px)' : 'blur(10px)',
            }}
            transition={setupSliderTransition}
            inert={!isActive}
            aria-hidden={!isActive}
            style={{ pointerEvents: isActive ? 'auto' : 'none' }}
          >
            {pane}
          </motion.div>
        )
      })}
    </div>
  )
}

export default SetupSlider
