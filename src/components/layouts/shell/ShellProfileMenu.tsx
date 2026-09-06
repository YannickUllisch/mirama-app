'use client'

import UserAvatar from '@src/components/(application)/core/Avatar/UserAvatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'
import { useSidebar } from '@src/components/ui/sidebar'
import {
  Check,
  ChevronDown,
  LogOut,
  Settings,
  SunMoon,
  UsersRound,
} from 'lucide-react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useRef } from 'react'

interface ShellProfileMenuProps {
  organizationId: string
}

const ShellProfileMenu = ({ organizationId }: ShellProfileMenuProps) => {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const { lockPeek } = useSidebar()
  const unlockPeekRef = useRef<(() => void) | null>(null)
  const name = session?.user?.name ?? session?.user?.email ?? 'Workspace'

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) {
          unlockPeekRef.current = lockPeek()
        } else {
          unlockPeekRef.current?.()
          unlockPeekRef.current = null
        }
      }}
    >
      <DropdownMenuTrigger className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg px-1.5 py-1 hover:bg-sidebar-accent transition-colors group-data-[collapsible=icon]:px-0">
        <UserAvatar avatarSize={22} username={name} fontSize={9} />
        <span className="min-w-0 max-w-36 truncate text-left text-[13px] font-medium text-ink group-data-[collapsible=icon]:hidden">
          {name}
        </span>
        <ChevronDown className="size-3.5 shrink-0 text-body-text/50 group-data-[collapsible=icon]:hidden" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="min-w-60"
      >
        <Link href={`/organization/${organizationId}/settings`}>
          <DropdownMenuItem className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </DropdownMenuItem>
        </Link>
        <Link href={`/organization/${organizationId}/settings/members`}>
          <DropdownMenuItem className="flex items-center gap-2">
            <UsersRound className="w-4 h-4" />
            Invite and manage members
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div className="flex items-center gap-2">
              <SunMoon className="w-4 h-4" />
              Change theme
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {(['light', 'dark', 'system'] as const).map((value) => (
              <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
                <div className="flex w-full items-center justify-between gap-2">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                  {theme === value && <Check className="w-3.5 h-3.5" />}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ShellProfileMenu
