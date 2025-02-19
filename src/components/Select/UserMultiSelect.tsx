import type { User } from '@prisma/client'
import type React from 'react'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
} from '@src/components/ui/multiselect'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import useSWR from 'swr'
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react'

interface UserMultiSelectProps {
  selectedUserIds: string[] | null
  setSelectedUserIds: Dispatch<SetStateAction<string[] | null>>
  onSelectionChange?: (ids: string[]) => void
}

const UserMultiSelect: FC<PropsWithChildren<UserMultiSelectProps>> = ({
  selectedUserIds,
  setSelectedUserIds,
  onSelectionChange,
  children,
}) => {
  // Fetching users depending on scope.
  const { data: users } = useSWR<User[]>('/api/db/team/member')

  return (
    <MultiSelector
      className="col-span-3 flex-grow"
      values={selectedUserIds ?? []}
      onValuesChange={(updated) => {
        const updatedUserIds =
          users
            ?.filter((user) => updated.includes(user.id))
            .map((user) => user.id) ?? []

        setSelectedUserIds(updatedUserIds)
        // Running some function on selection change
        // Might have to change this to avoid a bunch of API requests
        if (onSelectionChange) {
          onSelectionChange(updatedUserIds)
        }
      }}
      loop
    >
      <MultiSelectorInput asChild>{children}</MultiSelectorInput>
      <MultiSelectorContent>
        <MultiSelectorList>
          {users?.map((user) => (
            <MultiSelectorItem
              value={user.id}
              className="hover:bg-neutral-200 dark:hover:bg-neutral-800"
              key={`multiselect-item-${user.name}`}
            >
              <div className="flex items-center gap-1 text-text">
                <UserAvatar
                  avatarSize={25}
                  fontSize={10}
                  username={user.name}
                />
                {user.name}
              </div>
            </MultiSelectorItem>
          ))}
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  )
}

export default UserMultiSelect
