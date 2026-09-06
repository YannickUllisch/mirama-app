'use client'

import {
  SidebarTrigger,
  useSidebar,
} from '@src/components/ui/sidebar'
import { cn } from '@src/lib/utils'
import { usePmHeaderContent } from './PmHeaderContext'

const PmHeader = () => {
  const { state, isMobile } = useSidebar()
  const content = usePmHeaderContent()
  const showTrigger = isMobile || state === 'collapsed'

  return (
    <header className="flex h-10 shrink-0 items-center gap-2 border-b border-hairline/40 bg-background px-3">
      <div
        aria-hidden={!showTrigger}
        className={cn(
          'flex shrink-0 items-center overflow-hidden transition-[width,opacity] duration-200 ease-out',
          showTrigger ? 'w-7 opacity-100' : 'w-0 opacity-0',
        )}
      >
        <SidebarTrigger tabIndex={showTrigger ? 0 : -1} />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2">{content}</div>
    </header>
  )
}

export default PmHeader
