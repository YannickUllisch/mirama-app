import apiRequest from '@hooks/query'
import UserAvatar from '@src/components/(application)/core/Avatar/UserAvatar'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
} from '@src/components/ui/multiselect'
import { Button } from '@ui/button'
import { type FC, type PropsWithChildren, useState } from 'react'

interface UserMultiSelectProps {
  initialUserIds: string[]
  onSave: (ids: string[]) => void
}

const UserMultiSelect: FC<PropsWithChildren<UserMultiSelectProps>> = ({
  initialUserIds,
  onSave,
  children,
}) => {
  const [selectedUserIds, setSelectedUserIds] =
    useState<string[]>(initialUserIds)

  // Fetching users depending on scope.
  const { data: users } = apiRequest.members.fetchAll.useQuery()

  return (
    <MultiSelector
      className="col-span-3 grow"
      values={selectedUserIds ?? []}
      onValuesChange={(updated) => {
        const updatedUserIds =
          users
            ?.filter((user) => updated.includes(user.id))
            .map((user) => user.id) ?? []

        setSelectedUserIds(updatedUserIds)
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
          <Button onClick={() => onSave(selectedUserIds)}>Save</Button>
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  )
}

export default UserMultiSelect
