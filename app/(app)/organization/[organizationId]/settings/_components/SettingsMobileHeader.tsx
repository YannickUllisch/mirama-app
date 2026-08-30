// app/(app)/organization/[organizationId]/settings/_components/SettingsMobileHeader.tsx
'use client'

import { useIsMobile } from '@src/modules/shared/hooks/utils/use-mobile'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@ui/sheet'
import { PanelLeftOpen } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface SettingsMobileHeaderProps {
  children: React.ReactNode
}

const SettingsMobileHeader = ({ children }: SettingsMobileHeaderProps) => {
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is a change-trigger to close the sheet on navigation, not read in the body
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  if (!isMobile) return null

  return (
    <div className="flex items-center gap-3 h-12 px-4 border-b border-hairline bg-canvas shrink-0">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-center h-8 w-8 rounded-lg text-body-text hover:text-ink hover:bg-surface-soft transition-colors"
            aria-label="Open settings navigation"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 max-w-[85vw] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Settings navigation</SheetTitle>
          </SheetHeader>
          <div className="h-full">{children}</div>
        </SheetContent>
      </Sheet>
      <span className="text-sm font-medium text-ink">Settings</span>
    </div>
  )
}

export default SettingsMobileHeader
