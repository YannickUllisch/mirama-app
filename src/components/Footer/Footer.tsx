'use server'
import React from 'react'
import Link from 'next/link'
import { DateTime } from 'luxon'

const Footer = () => {
  return (
    <div className="bg-secondary mx-auto flex h-[60px] text-muted dark:text-white/80 w-full ">
      <div className="w-full mx-[5%] text-xs align-center justify-center md:justify-between flex">
        <div className="items-center  dark:text-white/80 hidden md:flex">
          <div>{`Copyright © ${DateTime.now().year} Mirage Studio`}</div>
        </div>
        <div className="gap-4 justify-center md:gap-2 items-center flex">
          <Link className="hover:underline" href="/about-us" prefetch={false}>
            About Us
          </Link>
          <span>·</span>
          <Link className="hover:underline" href="/privacy" prefetch={false}>
            Privacy Policy
          </Link>
          <span>·</span>
          <Link
            className="hover:underline"
            href="/termsofservice"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <span>·</span>
          <Link className="hover:underline" href="/cookies" prefetch={false}>
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Footer
