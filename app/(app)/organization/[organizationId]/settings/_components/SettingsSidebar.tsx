// app/(app)/organization/[organizationId]/settings/_components/SettingsSidebar.tsx
'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@src/components/animate-ui/components/radix/sidebar'
import { SettingsSidebarMenu } from '@src/modules/tenant/settings/settingsSidebarMenu'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import SettingsBackLink from './SettingsBackLink'
import SettingsNavLink from './SettingsNavLink'
import SettingsSearchInput from './SettingsSearchInput'

interface SettingsSidebarProps {
  organizationId: string
}

const SettingsSidebar = ({ organizationId }: SettingsSidebarProps) => {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is a change-trigger to close the sheet on navigation, not read in the body
  useEffect(() => {
    setOpenMobile(false)
  }, [pathname])

  return (
    <Sidebar className="border-transparent">
      <SidebarHeader className="gap-3">
        <SettingsBackLink organizationId={organizationId} />
        <SettingsSearchInput />
      </SidebarHeader>
      <SidebarContent>
        {SettingsSidebarMenu.map(({ group, items }) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel className="h-auto px-2.5 mb-1 text-[11px] uppercase tracking-[0.4px] text-body-text/55">
              {group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SettingsNavLink
                      href={item.href.replace(
                        '[organizationId]',
                        organizationId,
                      )}
                      label={item.label}
                      icon={<item.icon className="w-4 h-4 shrink-0" />}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

export default SettingsSidebar
