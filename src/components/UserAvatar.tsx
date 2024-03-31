import { Avatar, AvatarFallback } from '@src/components/ui/avatar'
import type { FC } from 'react'
import { getColorByName } from '../lib/utils'

interface UserAvatarProps {
  username: string | null
}

const UserAvatar: FC<UserAvatarProps> = ({ username }) => {
  const userColor = username ? getColorByName(username) : 'bg-neutral-400/20'
  return (
    <Avatar className="cursor-pointer h-8 w-8 shadow">
      <AvatarFallback className={userColor}>
        {username ? username?.slice(0, 2).toUpperCase() : ''}
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
