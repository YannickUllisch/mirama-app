'use client'
import type { iMenuItem } from '@src/lib/constants'
import React, { useState, type FC } from 'react'
import { CommandItem } from '../ui/command'
import { AlertCircle, ChevronDown, StretchHorizontal } from 'lucide-react'
import Link from 'next/link'

interface SidebarItemProps {
  currentPath: string
  item: iMenuItem
  isCollapsed: boolean
}

const SidebarItem: FC<SidebarItemProps> = ({
  currentPath,
  item,
  isCollapsed = false,
}) => {
  const [subMenuOpen, setSubMenuOpen] = useState<boolean>(false)
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen)
  }
  return (
    <>
      {item.subItems ? (
        <>
          <div onClick={toggleSubMenu} onKeyDown={toggleSubMenu}>
            <CommandItem
              style={{ fontSize: 15 }}
              className={`flex gap-3 cursor-pointer justify-between relative hover:bg-neutral-100 dark:hover:bg-neutral-900 ${
                item.href === currentPath
                  ? 'bg-neutral-200 dark:bg-neutral-800'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {!isCollapsed && item.label}
              </div>
              {!isCollapsed && (
                <ChevronDown
                  width={15}
                  className={`${
                    subMenuOpen ? 'rotate-180' : ''
                  }  flex justify-end `}
                />
              )}
            </CommandItem>
          </div>
          {subMenuOpen && item.subItems
            ? item.subItems.map((subItem) => (
                <div
                  className="my-2 ml-12 flex flex-col space-y-4"
                  style={{ fontSize: 13 }}
                  key={subItem.label}
                >
                  <Link
                    href={subItem.href}
                    className={`${
                      subItem.href === currentPath ? 'font-bold' : ''
                    }`}
                  >
                    {!isCollapsed && subItem.label}
                  </Link>
                </div>
              ))
            : null}
        </>
      ) : (
        <Link href={item.href} key={item.label}>
          <CommandItem
            style={{ fontSize: 15 }}
            className={`flex gap-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 ${
              item.href === currentPath
                ? 'bg-neutral-200 dark:bg-neutral-800'
                : ''
            }`}
          >
            {item.icon}
            {!isCollapsed && item.label}
          </CommandItem>
        </Link>
      )}
    </>
  )
}

export default SidebarItem
