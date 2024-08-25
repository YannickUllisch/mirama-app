import React, { type FC } from 'react'
import GeneralTooltip from '@src/components/GeneralTooltip'
import { RefreshCcw } from 'lucide-react'
import { Button } from '../ui/button'

interface ToolbaRefreshProps {
  mutate?: () => any
}

const ToolbarRefresh: FC<ToolbaRefreshProps> = ({ mutate }) => {
  return (
    <Button
      onClick={() => {
        if (mutate) mutate()
      }}
      variant="outline"
      size="sm"
      className="ml-auto hidden h-8 lg:flex gap-2 bg-inherit"
    >
      <RefreshCcw className="h-4 w-4 cursor-pointer hover:-rotate-90 duration-500 transition-all ease-in-out" />
      Refresh
    </Button>
  )
}

export default ToolbarRefresh
