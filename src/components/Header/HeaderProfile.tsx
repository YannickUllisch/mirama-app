'use client'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@src/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@src/components/ui/avatar'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@src/components/ui/dropdown-menu'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { capitalize, extractFirstLetters, getColorByName } from '@src/lib/utils'
import { ChevronsUpDown, LogOut, Settings } from 'lucide-react'
import type { Session } from 'next-auth'

const HeaderProfile = ({
  session,
  onlyAvatar,
}: { session: Session | null; onlyAvatar?: boolean }) => {
  const userColor = session?.user?.name
    ? getColorByName(session?.user?.name)
    : 'bg-neutral-400/20'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`flex items-center gap-3 cursor-pointer p-1 rounded-md ${
            onlyAvatar ? '' : 'hover:bg-neutral-50 hover:dark:bg-neutral-900'
          } `}
        >
          <Avatar className="w-8 h-8">
            <AvatarFallback className={userColor} style={{ fontSize: 13 }}>
              {extractFirstLetters(session?.user.name ?? '')}
            </AvatarFallback>
          </Avatar>
          {!onlyAvatar && (
            <>
              <div className="flex flex-col">
                <span style={{ fontSize: 12 }}>{session?.user.name}</span>
                <span
                  key={`session-role-${session?.user.role}`}
                  style={{ fontSize: 9 }}
                >
                  {capitalize(session?.user.role.toLowerCase() ?? 'No role')}
                </span>
              </div>
              <ChevronsUpDown width={15} />
            </>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="md:w-[200px]">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-normal" style={{ fontSize: 11 }}>
              Signed in as
            </span>
            <span style={{ fontSize: 12 }}>{session?.user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={'/app/settings'} legacyBehavior passHref>
          <DropdownMenuItem className="cursor-pointer">
            <div className="flex items-center gap-3">
              <Settings width={17} />
              Account settings
            </div>
          </DropdownMenuItem>
        </Link>
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
