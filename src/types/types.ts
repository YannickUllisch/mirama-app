import type { LucideIcon } from 'lucide-react'

// Sidebar Interfaces
export interface AppMenuItem {
  title: string
  href?: string
  isCollapsible: boolean
  isActive?: boolean
  icon: LucideIcon
  group?: string
  items?: {
    title: string
    href: string
    roles?: string[]
  }[]
  roles?: string[]
}
