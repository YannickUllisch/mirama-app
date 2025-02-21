'use client'
import type * as React from 'react'
import Link from 'next/link'

const SidebarTeamSwitcher = () => {
  return (
    <div className="px-2 pt-1 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
      <div className="grid flex-1 text-left leading-tight">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl font-bold">.mirage</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SidebarTeamSwitcher
