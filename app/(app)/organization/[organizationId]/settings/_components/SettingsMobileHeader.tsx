'use client'

import { SidebarTrigger } from '@src/components/animate-ui/components/radix/sidebar'

const SettingsMobileHeader = () => {
  return (
    <div className="flex items-center gap-3 h-12 px-4 border-b border-hairline bg-canvas shrink-0 lg:hidden">
      <SidebarTrigger />
      <span className="text-sm font-medium text-ink">Settings</span>
    </div>
  )
}

export default SettingsMobileHeader
