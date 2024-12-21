'use server'
import React from 'react'
import Link from 'next/link'
import { DateTime } from 'luxon'
import ToggleTheme from './ToggleTheme'

const Footer = () => {
  return (
    <div className="bg-white dark:bg-neutral-900/10 mx-auto flex h-[60px] border-t-2 border-neutral-100/60 dark:border-neutral-800/40 text-black/80 dark:text-white/80 w-full ">
      <div className="w-full mx-[5%] text-xs align-center justify-center md:justify-between flex">
        <div className="items-center text-black/80 dark:text-white/80 hidden md:flex">
          <div>{`Copyright © ${DateTime.now().year} Mirage Studio`}</div>
        </div>
        <div className="gap-4 justify-center md:gap-2 items-center flex">
          <Link className="hover:underline" href="/about-us">
            About Us
          </Link>
          <span>·</span>
          <Link className="hover:underline" href="/privacy">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link className="hover:underline" href="/termsofservice">
            Terms of Service
          </Link>
          <span>·</span>
          <Link className="hover:underline" href="/cookies">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Footer
