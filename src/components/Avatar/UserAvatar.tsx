import { Avatar, AvatarFallback } from '@src/components/ui/avatar'
import type { FC } from 'react'
import { extractFirstLetters, getColorByName } from '@src/lib/utils'
import { CircleUserRound } from 'lucide-react'
import GeneralTooltip from '@src/components/GeneralTooltip'

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
    <GeneralTooltip tipText={username ?? 'Unassigned'}>
      <Avatar className={`cursor-pointer h-${avatarSize} w-${avatarSize} flex`}>
        <AvatarFallback
          className={username ? userColor : ''}
          style={fontSize ? { fontSize: fontSize } : {}}
        >
          {username ? (
            extractFirstLetters(username)
          ) : (
            <CircleUserRound strokeWidth={0.8} />
          )}
        </AvatarFallback>
      </Avatar>
    </GeneralTooltip>
  )
}

export default UserAvatar
