import type React from 'react'
import type { FC, PropsWithChildren } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@src/components/ui/tooltip'

interface ToolTipProps {
  tipText: string
  side?: 'bottom' | 'top' | 'left' | 'right'
}

const GeneralTooltip: FC<PropsWithChildren<ToolTipProps>> = ({
  tipText,
  side,
  children,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="z-50" side={side ? side : 'bottom'}>
          {tipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default GeneralTooltip
