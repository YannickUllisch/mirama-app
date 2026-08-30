// app/(app)/organization/[organizationId]/settings/_components/SettingsSidebar.tsx
import { cn } from '@src/lib/utils'
import { SettingsSidebarMenu } from '@src/modules/tenant/settings/settingsSidebarMenu'
import SettingsBackLink from './SettingsBackLink'
import SettingsNavLink from './SettingsNavLink'
import SettingsSearchInput from './SettingsSearchInput'

interface SettingsSidebarProps {
  organizationId: string
  className?: string
}

const SettingsSidebar = ({
  organizationId,
  className,
}: SettingsSidebarProps) => {
  return (
    <nav
      className={cn(
        'w-full h-full border-r border-hairline flex flex-col gap-4 px-3 py-4 overflow-y-auto',
        className,
      )}
    >
      <div className="flex flex-col gap-3">
        <SettingsBackLink organizationId={organizationId} />
        <SettingsSearchInput />
      </div>

      {SettingsSidebarMenu.map(({ group, items }) => (
        <div key={group}>
          <p className="px-2.5 mb-1 text-[11px] font-medium text-body-text/55 uppercase tracking-[0.4px]">
            {group}
          </p>
          <div className="space-y-0.5">
            {items.map((item) => (
              <SettingsNavLink
                key={item.href}
                href={item.href.replace('[organizationId]', organizationId)}
                label={item.label}
                icon={<item.icon className="w-4 h-4 shrink-0 text-body-text" />}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

export default SettingsSidebar
