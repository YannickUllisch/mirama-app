import OrgLink from '@src/components/OrgLink'
import { ArrowLeft } from 'lucide-react'

const SettingsBackLink = () => {
  return (
    <OrgLink
      href=""
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm text-body-text hover:bg-sidebar-accent hover:text-ink transition-colors"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      Back to app
    </OrgLink>
  )
}

export default SettingsBackLink
