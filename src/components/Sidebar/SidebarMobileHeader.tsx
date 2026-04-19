// src/components/Sidebar/SidebarMobileHeader.tsx
'use client'
import { useIsMobile } from '@src/modules/shared/hooks/utils/use-mobile'
import HoverLink from '../HoverLink'
import MiramaIcon from '../MiramaIcon'

const SidebarMobileHeader = () => {
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <HoverLink href="/" className="flex items-center gap-2 p-2">
      <MiramaIcon />
    </HoverLink>
  )
}

export default SidebarMobileHeader
