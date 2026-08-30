// app/(app)/organization/[organizationId]/(pm)/_components/PmSidebarCollapsibleGroup.tsx
'use client'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@src/components/animate-ui/components/radix/sidebar'
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@src/components/animate-ui/primitives/radix/accordion'
import { Button } from '@src/components/ui/button'
import { ChevronRightIcon, Plus } from 'lucide-react'
import Link from 'next/link'

interface PmSidebarCollapsibleGroupProps {
  label: string
  children: React.ReactNode
  action?: {
    href: string
    label: string
  }
}

const PmSidebarCollapsibleGroup = ({
  label,
  children,
  action,
}: PmSidebarCollapsibleGroupProps) => {
  return (
    <Accordion type="single" collapsible defaultValue="group">
      <AccordionItem value="group" className="group/section">
        <SidebarGroup className="p-0 px-2">
          <div className="flex items-center justify-between">
            <AccordionHeader>
              <AccordionTrigger asChild>
                <SidebarGroupLabel className="w-fit cursor-pointer gap-1">
                  <ChevronRightIcon className="size-3 shrink-0 transition-transform group-data-[state=open]/section:rotate-90" />
                  {label}
                </SidebarGroupLabel>
              </AccordionTrigger>
            </AccordionHeader>
            {action && (
              <Button
                asChild
                variant="ghost"
                size="icon"
                title={action.label}
                className="size-5 shrink-0 opacity-0 transition-opacity group-hover/section:opacity-100"
              >
                <Link href={action.href}>
                  <Plus className="size-3" />
                </Link>
              </Button>
            )}
          </div>
          <AccordionContent>
            <SidebarGroupContent>{children}</SidebarGroupContent>
          </AccordionContent>
        </SidebarGroup>
      </AccordionItem>
    </Accordion>
  )
}

export default PmSidebarCollapsibleGroup
