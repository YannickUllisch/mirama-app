'use client'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@ui/sidebar'
import { ClipboardCheck } from 'lucide-react'
import Link from 'next/link'

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
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-text text-text-inverted">
                <ClipboardCheck size={18} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tighter">
                      .mirama
                    </span>
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
