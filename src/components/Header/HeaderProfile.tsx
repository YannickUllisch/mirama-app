// src/components/Header/HeaderProfile.tsx
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
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import UserAvatar from '../(application)/core/Avatar/UserAvatar'
import HoverLink from '../HoverLink'

const HeaderProfile = () => {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()

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
        side="bottom"
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
              {(['light', 'dark', 'system'] as const).map((value) => (
                <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
                  <div className="flex items-center gap-2 justify-between w-full">
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                    {theme === value && <Check width={13} />}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <HoverLink href={`/tenant/${session?.user.tenantId}`}>
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex items-center gap-3">
                <UserKeyIcon width={17} />
                Go to tenant
              </div>
            </DropdownMenuItem>
          </HoverLink>
        </DropdownMenuGroup>
        {session?.user.organizationId && (
          <HoverLink
            href={`/organization/${session?.user.organizationId}/settings`}
          >
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex items-center gap-3">
                <Settings width={17} />
                Settings
              </div>
            </DropdownMenuItem>
          </HoverLink>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => signOut({ callbackUrl: '/', redirect: true })}
        >
          <div className="flex items-center gap-3">
            <LogOut width={17} />
            Sign out
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default HeaderProfile
