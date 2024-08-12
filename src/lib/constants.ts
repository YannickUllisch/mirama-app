export interface iMenuItem {
  href: string
  label: string
  icon: React.JSX.Element
  subItems?: {
    href: string
    label: string
  }[]
}

export interface iMenuList {
  group: string
  items: iMenuItem[]
}
