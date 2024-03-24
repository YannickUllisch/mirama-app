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
} from '@radix-ui/react-dropdown-menu'
import { Settings } from 'lucide-react'

const ProfileButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>MI</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="h-6 w-6" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileButton
