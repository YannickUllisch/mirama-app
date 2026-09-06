import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@src/components/ui/breadcrumb'
import Link from 'next/link'
import { Fragment } from 'react'

interface ShellHeaderCrumbSegment {
  label: string
  href?: string
}

interface ShellHeaderCrumbProps {
  items: ShellHeaderCrumbSegment[]
  actions?: React.ReactNode
}

const ShellHeaderCrumb = ({ items, actions }: ShellHeaderCrumbProps) => (
  <div className="flex w-full min-w-0 items-center justify-between gap-2">
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={item.label}>
              <BreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink asChild className="text-sm font-medium">
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-sm font-medium text-ink">
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
    {actions && (
      <div className="flex shrink-0 items-center gap-2">{actions}</div>
    )}
  </div>
)

export default ShellHeaderCrumb
