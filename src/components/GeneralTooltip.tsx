import type React from 'react'
import type { FC } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@src/components/ui/tooltip'

interface ToolTipProps {
  trigger: React.ReactNode
  tipText: string
}

const GeneralTooltip: FC<ToolTipProps> = (obj) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{obj.trigger}</TooltipTrigger>
        <TooltipContent side="bottom">{obj.tipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default GeneralTooltip
