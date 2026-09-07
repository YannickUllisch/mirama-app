import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface SettingsBackLinkProps {
  organizationSlug: string
}

const SettingsBackLink = ({ organizationSlug }: SettingsBackLinkProps) => {
  return (
    <Link
      href={`/organization/${organizationSlug}`}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm text-body-text hover:bg-sidebar-accent hover:text-ink transition-colors"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      Back to app
    </Link>
  )
}

export default SettingsBackLink
