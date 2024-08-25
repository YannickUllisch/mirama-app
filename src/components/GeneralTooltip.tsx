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
}

const GeneralTooltip: FC<PropsWithChildren<ToolTipProps>> = (obj) => {
  return (
    <TooltipProvider>
      <Tooltip>
        {<TooltipTrigger>{obj.children}</TooltipTrigger>}
        <TooltipContent side="bottom">{obj.tipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default GeneralTooltip
