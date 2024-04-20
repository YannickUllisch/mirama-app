import { Avatar, AvatarFallback } from '@src/components/ui/avatar'
import type { FC } from 'react'
import { extractFirstLetters, getColorByName } from '@src/lib/utils'

interface UserAvatarProps {
  username: string | null
}

const UserAvatar: FC<UserAvatarProps> = ({ username }) => {
  const userColor = username ? getColorByName(username) : 'bg-neutral-400/20'

  return (
    <Avatar className="cursor-pointer h-6 w-6 shadow">
      <AvatarFallback className={userColor} style={{ fontSize: 10 }}>
        {username ? extractFirstLetters(username) : ''}
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
