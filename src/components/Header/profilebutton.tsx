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
import { useSession } from 'next-auth/react'
import { getColorByName } from '@/src/lib/utils'

const ProfileButton = () => {
  const { data: session } = useSession()
  const userColor = session?.user?.name
    ? getColorByName(session?.user?.name)
    : 'bg-neutral-400/20'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback className={userColor}>
            {session?.user?.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Link href={'/settings'}> Settings </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileButton
