import { auth } from '@auth'
import { Settings } from 'lucide-react'

const SettingsPage = async () => {
  const _session = await auth()

  return (
    <>
      <div className="flex items-center gap-4 dark:text-white mb-5">
        <Settings width={20} />
        <span style={{ fontSize: 20 }}>Settings</span>
      </div>
    </>
  )
}

export default SettingsPage
