import { auth } from '@auth'
import UserAvatar from '@src/components/(application)/core/Avatar/UserAvatar'
import { Input } from '@ui/input'
import { Pencil } from 'lucide-react'
import LeaveWorkspaceButton from './_components/LeaveWorkspaceButton'

const ProfilePage = async () => {
  const session = await auth()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-6">Profile</h1>

      <div className="rounded-xl border border-hairline bg-canvas divide-y divide-hairline overflow-hidden">
        <div className="flex items-center justify-between gap-6 px-5 py-4">
          <span className="text-sm font-medium text-ink">Profile picture</span>
          <UserAvatar
            username={session?.user.name ?? ''}
            avatarSize={10}
            fontSize={14}
          />
        </div>

        <div className="flex items-center justify-between gap-6 px-5 py-4">
          <span className="text-sm font-medium text-ink">Email</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-body-text">
              {session?.user.email}
            </span>
            <button
              type="button"
              title="Contact an administrator to change your email"
              className="flex items-center justify-center h-7 w-7 rounded-md text-body-text/60 hover:text-ink hover:bg-surface-soft transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 px-5 py-4">
          <span className="text-sm font-medium text-ink">Full name</span>
          <Input
            defaultValue={session?.user.name ?? ''}
            className="w-full max-w-55"
          />
        </div>

        <div className="flex items-center justify-between gap-6 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-ink">Title</p>
            <p className="text-xs text-body-text">Your job title or role</p>
          </div>
          <Input placeholder="Software Engineer" className="w-full max-w-55" />
        </div>

        <div className="flex items-center justify-between gap-6 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-ink">Username</p>
            <p className="text-xs text-body-text">
              One word, like a nickname or first name
            </p>
          </div>
          <Input placeholder="username" className="w-full max-w-55" />
        </div>
      </div>

      <h2 className="text-sm font-semibold text-ink mt-8 mb-3">
        Workspace access
      </h2>
      <div className="rounded-xl border border-hairline bg-canvas overflow-hidden">
        <div className="flex items-center justify-between gap-6 px-5 py-4">
          <span className="text-sm text-body-text">
            Remove yourself from workspace
          </span>
          <LeaveWorkspaceButton />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
