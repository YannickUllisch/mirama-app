'use client'
import Link, { type LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useRef } from 'react'
import type { HTMLProps } from 'react'

type Props = LinkProps & HTMLProps<HTMLAnchorElement>

const HoverLink: React.FC<Props> = ({ href, children, ...props }) => {
  const router = useRouter()
  const prefetched = useRef(false)

  const handleMouseEnter = () => {
    // Only prefetch if not already done
    if (!prefetched.current && typeof href === 'string') {
      router.prefetch(href)
      prefetched.current = true
    }
  }

  return (
    <Link
      href={href}
      prefetch={false}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </Link>
  )
}

export default HoverLink
