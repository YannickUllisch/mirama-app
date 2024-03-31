import { auth, signOut } from '@/auth'
import { Button } from '@/src/components/ui/button'

const SettingsPage = async () => {
  const session = await auth()

  return (
    <div className=" dark:text-white">
      {JSON.stringify(session)}
      <form
        action={async () => {
          'use server'

          await signOut({
            redirectTo: '/',
          })
        }}
      >
        <Button type="submit" variant="destructive">
          Sign Out
        </Button>
      </form>
    </div>
  )
}

export default SettingsPage
