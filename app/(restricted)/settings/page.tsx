import { auth } from '@auth'

const SettingsPage = async () => {
  const _session = await auth()

  return <div className=" dark:text-white">Settings</div>
}

export default SettingsPage
