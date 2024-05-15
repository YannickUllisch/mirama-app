import { Avatar, AvatarFallback } from '@src/components/ui/avatar'
import type { FC } from 'react'
import { extractFirstLetters, getColorByName } from '@src/lib/utils'

interface UserAvatarProps {
  username: string | null
  avatarSize: number
  fontSize?: number
}

const UserAvatar: FC<UserAvatarProps> = ({
  username,
  avatarSize,
  fontSize,
}) => {
  const userColor = username ? getColorByName(username) : 'bg-neutral-400/20'

  return (
    <Avatar
      className={`cursor-pointer h-${avatarSize} w-${avatarSize} shadow flex`}
    >
      <AvatarFallback
        className={userColor}
        style={fontSize ? { fontSize: fontSize } : {}}
      >
        {username ? extractFirstLetters(username) : ''}
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
