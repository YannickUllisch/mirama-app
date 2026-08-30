// app/(app)/organization/[organizationId]/(pm)/_components/PmCollapsedHeader.tsx
'use client'

import {
  SidebarTrigger,
  useSidebar,
} from '@src/components/animate-ui/components/radix/sidebar'

const PmCollapsedHeader = () => {
  const { state } = useSidebar()

  if (state !== 'collapsed') return null

  return (
    <>
      {/* Reserves the vertical space in normal flow; the visible bar below
          is fixed so it appears at the true left edge immediately instead
          of sliding in with the (slower, differently-eased) content area
          as the sidebar gap animates shut. */}
      <div aria-hidden className="hidden h-10 shrink-0 lg:block" />
      <div className="fixed inset-x-0 top-0 z-20 hidden h-10 items-center border-b border-hairline bg-canvas px-2 lg:flex">
        <SidebarTrigger />
      </div>
    </>
  )
}

export default PmCollapsedHeader
