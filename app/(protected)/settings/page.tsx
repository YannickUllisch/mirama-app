import { auth, signOut } from '@/auth'
import { Button } from '@/src/components/ui/button'

const SettingsPage = async () => {
  const session = await auth()

  return <div className=" dark:text-white">{JSON.stringify(session)}</div>
}

export default SettingsPage
