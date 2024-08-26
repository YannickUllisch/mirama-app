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

const HeaderProfile = ({ session }: { session: Session | null }) => {
  const userColor = session?.user?.name
    ? getColorByName(session?.user?.name)
    : 'bg-neutral-400/20'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-8 h-8 cursor-pointer">
          <AvatarFallback className={userColor} style={{ fontSize: 13 }}>
            {extractFirstLetters(session?.user.name ?? '')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="md:w-[200px]" align="end">
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
