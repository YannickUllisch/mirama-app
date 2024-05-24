import { auth } from '@/auth'

const SettingsPage = async () => {
  const session = await auth()

  return <div className=" dark:text-white">{JSON.stringify(session)}</div>
}

export default SettingsPage
