'use client'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@src/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@src/components/ui/avatar'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@src/components/ui/dropdown-menu'
import Link from 'next/link'
import { logout } from '@/src/lib/logout'

const ProfileButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>MI</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Link href={'/settings'}> Settings </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileButton
