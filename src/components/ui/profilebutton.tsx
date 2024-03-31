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
import { signOut } from '@/auth'

const ProfileButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="" />
          <AvatarFallback className="dark:bg-neutral-800">MI</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Link href={'/settings'}> Settings </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <form action={logout}> Log Out </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileButton
