import type { ProjectUser, User } from '@prisma/client'
import type React from 'react'
import { type FC, type PropsWithChildren, useEffect, useState } from 'react'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
} from '../ui/multiselect'
import { v4 } from 'uuid'
import UserAvatar from '../Avatar/UserAvatar'

interface UserMultiSelectProps {
  users: User[]
  assignedUsers: (ProjectUser & { user: User })[]
  projectId: string
  managerSelect?: boolean
}

const UserMultiSelect: FC<PropsWithChildren<UserMultiSelectProps>> = ({
  children,
  users,
  assignedUsers,
  projectId,
  managerSelect,
}) => {
  const [selectedUsers, setSelectedUsers] =
    useState<(ProjectUser & { user: User })[]>(assignedUsers)

  useEffect(() => {
    console.log(selectedUsers)
  }, [selectedUsers])

  return (
    <MultiSelector
      className="col-span-3 flex-grow"
      values={assignedUsers.map((p) => p.user.name)}
      onValuesChange={(usernames) =>
        setSelectedUsers((prevSelect) => ({
          ...prevSelect,
          users: usernames
            .map((name) => {
              const existingUser = users?.find((user) => user.name === name)
              if (!existingUser) return null

              const existingProjectUser = assignedUsers.find(
                (pu) => pu.user.name === name,
              )

              return (
                existingProjectUser || {
                  id: v4(),
                  isManager: managerSelect ? true : false,
                  projectId: projectId,
                  userId: existingUser.id,
                  user: existingUser,
                }
              )
            })
            .filter((u) => u !== null) as (ProjectUser & {
            user: User
          })[],
        }))
      }
      loop
    >
      <MultiSelectorInput asChild>{children}</MultiSelectorInput>
      <MultiSelectorContent>
        <MultiSelectorList>
          {users?.map((user) => (
            <MultiSelectorItem
              value={user.name}
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
