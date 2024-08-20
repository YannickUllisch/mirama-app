import type { FC } from 'react'
import UserAvatar from './UserAvatar' // Adjust the import path as needed

interface AvatarGroupProps {
  usernames: string[]
  avatarSize: number
  previewAmount: number
  fontSize?: number
}

const AvatarGroup: FC<AvatarGroupProps> = ({
  usernames,
  avatarSize,
  previewAmount,
  fontSize,
}) => {
  const shownUsers = usernames.slice(0, previewAmount)
  const remainingUsersCount = usernames.length - previewAmount

  return (
    <div className={'flex items-center -space-x-2'}>
      {shownUsers.map((username, index) => (
        <div
          key={username}
          className={`z-${shownUsers.length - index}`} // Ensure the leftmost is the frontmost
        >
          <UserAvatar
            username={username}
            avatarSize={avatarSize}
            fontSize={fontSize}
            toolTip
          />
        </div>
      ))}
      {remainingUsersCount > 0 && (
        <div
          className={`z-0 h-${avatarSize} w-${avatarSize} flex items-center justify-center bg-neutral-400/20 rounded-full text-neutral-600`}
          style={fontSize ? { fontSize: fontSize } : {}}
        >
          +{remainingUsersCount}
        </div>
      )}
      {usernames.length < 1 && (
        <UserAvatar
          username={null}
          avatarSize={avatarSize}
          fontSize={fontSize}
          toolTip
        />
      )}
    </div>
  )
}

export default AvatarGroup
