'use client'
import { signOut } from 'next-auth/react'
import { ChevronsUpDown, LogOut, Settings, Sparkles } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@src/components/ui/sidebar'
import type { User } from '@prisma/client'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import Link from 'next/link'

const ICON_WIDTH = 17

const SidebarUserNav = ({ user }: { user: User }) => {
  const { isMobile } = useSidebar()

  const DropdownItem = ({
    label,
    icon,
    onClick,
  }: {
    label: string
    icon: React.ReactNode
    onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
  }) => {
    return (
      <DropdownMenuItem className="cursor-pointer" onClick={onClick}>
        <div className="flex items-center gap-3">
          {icon}
          {label}
        </div>
      </DropdownMenuItem>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar avatarSize={30} username={user.name} fontSize={10} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar
                  avatarSize={25}
                  username={user.name}
                  fontSize={10}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownItem
                icon={<Sparkles width={ICON_WIDTH} />}
                label="Upgrade to Pro"
              />
              <Link href={'/app/settings'}>
                <DropdownItem
                  icon={<Settings width={ICON_WIDTH} />}
                  label="Settings"
                />
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownItem
              icon={<LogOut width={ICON_WIDTH} />}
              label="Sign out"
              onClick={() => signOut({ callbackUrl: '/', redirect: true })}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default SidebarUserNav
