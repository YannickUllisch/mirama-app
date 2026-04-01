'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'
import { Check, LogOut, Settings, SunMoon, UserKeyIcon } from 'lucide-react'
import type { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import UserAvatar from '../(application)/core/Avatar/UserAvatar'
import HoverLink from '../HoverLink'

const HeaderProfile = ({ session }: { session: Session | null }) => {
  const { theme, setTheme } = useTheme()

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

  const SubItemChecked = ({ subItem }: { subItem: string }) => {
    return (
      <div className="flex items-center gap-2 justify-between w-full">
        {subItem}
        {theme === subItem.toLowerCase() && <Check width={13} />}
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          avatarSize={30}
          username={session?.user.name ?? ''}
          fontSize={10}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={'bottom'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserAvatar
              avatarSize={25}
              username={session?.user.name ?? ''}
              fontSize={10}
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {session?.user.name}
              </span>
              <span className="truncate text-xs">{session?.user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <div className="flex items-center gap-3">
                <SunMoon width={17} />
                Change Theme
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <SubItemChecked subItem="Light" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <SubItemChecked subItem="Dark" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <SubItemChecked subItem="System" />
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <HoverLink href={`/tenant/${session?.user.tenantId}`}>
            <DropdownItem
              icon={<UserKeyIcon width={17} />}
              label="Go to tenant"
            />
          </HoverLink>
        </DropdownMenuGroup>
        {session?.user.organizationId && (
          <HoverLink
            href={`/organization/${session?.user.organizationId}/settings`}
          >
            <DropdownItem icon={<Settings width={17} />} label="Settings" />
          </HoverLink>
        )}

        <DropdownMenuSeparator />
        <DropdownItem
          icon={<LogOut width={17} />}
          label="Sign out"
          onClick={() => signOut({ callbackUrl: '/', redirect: true })}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default HeaderProfile
