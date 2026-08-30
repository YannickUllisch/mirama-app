// app/(app)/setup/_components/AvatarPicker.tsx
'use client'

import { cn } from '@src/lib/utils'
import Image from 'next/image'

type AvatarPickerProps = {
  avatars: string[]
  value: string
  onChange: (avatar: string) => void
}

const AvatarPicker = ({ avatars, value, onChange }: AvatarPickerProps) => {
  if (avatars.length === 0) return null

  return (
    <div className="flex flex-wrap gap-3">
      {avatars.map((avatar) => (
        <button
          key={avatar}
          type="button"
          onClick={() => onChange(avatar)}
          className={cn(
            'h-12 w-12 rounded-full overflow-hidden border-2 transition-colors',
            value === avatar
              ? 'border-ink'
              : 'border-transparent hover:border-hairline',
          )}
        >
          <Image
            src={`/avatars/${avatar}`}
            alt="Avatar option"
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </button>
      ))}
    </div>
  )
}

export default AvatarPicker
