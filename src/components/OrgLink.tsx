'use client'
import HoverLink from '@src/components/HoverLink'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import type { LinkProps } from 'next/link'
import type { HTMLProps } from 'react'

type Props = Omit<LinkProps, 'href'> &
  Omit<HTMLProps<HTMLAnchorElement>, 'href'> & {
    href: string
  }

// Same hover-prefetch behavior as HoverLink, but href is relative to the
// active organization (/settings, /projects/create, ...) - the /{slug}
// prefix is resolved from OrganizationResourceProvider, so callers never
// have to thread organizationSlug through just to build a link.
const OrgLink: React.FC<Props> = ({ href, children, ...props }) => {
  const { activeOrganizationSlug } = useOrganizationResource()

  return (
    <HoverLink href={`/${activeOrganizationSlug}${href}`} {...props}>
      {children}
    </HoverLink>
  )
}

export default OrgLink
