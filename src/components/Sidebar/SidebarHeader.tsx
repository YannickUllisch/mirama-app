'use client'
import type * as React from 'react'
import Link from 'next/link'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@ui/sidebar'
import { Unlink2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'

const SidebarHeader = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary-light/20 text-primary">
                <Unlink2 size={18} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold">.mirage</span>
                  </Link>
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default SidebarHeader
