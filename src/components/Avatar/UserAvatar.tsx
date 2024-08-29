import { Avatar, AvatarFallback } from '@src/components/ui/avatar'
import type { FC } from 'react'
import { extractFirstLetters, getColorByName } from '@src/lib/utils'
import { CircleUserRound } from 'lucide-react'
import GeneralTooltip from '@src/components/GeneralTooltip'

interface UserAvatarProps {
  username: string | null
  avatarSize: number
  fontSize?: number
  toolTip?: boolean
}

const UserAvatar: FC<UserAvatarProps> = ({
  username,
  avatarSize,
  fontSize,
  toolTip,
}) => {
  const userColor = username ? getColorByName(username) : 'bg-neutral-400/20'

  return (
    <>
      {toolTip ? (
        <GeneralTooltip tipText={username ?? 'Unassigned'}>
          <Avatar className={`h-${avatarSize} w-${avatarSize} flex`}>
            <AvatarFallback
              className={`${username ? userColor : ''}`}
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
      ) : (
        <Avatar
          style={{
            height: `${avatarSize}px`,
            width: `${avatarSize}px`,
            fontSize: `${fontSize}px`,
            color: 'white',
          }}
        >
          <AvatarFallback className={username ? userColor : ''}>
            {username ? (
              extractFirstLetters(username)
            ) : (
              <CircleUserRound strokeWidth={0.8} />
            )}
          </AvatarFallback>
        </Avatar>
      )}
    </>
  )
}

export default UserAvatar
