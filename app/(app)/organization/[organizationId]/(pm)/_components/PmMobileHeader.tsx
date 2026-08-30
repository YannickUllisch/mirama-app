// app/(app)/organization/[organizationId]/(pm)/_components/PmMobileHeader.tsx
'use client'

import { SidebarTrigger } from '@src/components/animate-ui/components/radix/sidebar'

const PmMobileHeader = () => {
  return (
    <div className="flex items-center gap-3 h-12 px-4 border-b border-hairline bg-canvas shrink-0 md:hidden">
      <SidebarTrigger />
    </div>
  )
}

export default PmMobileHeader
