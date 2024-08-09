'use server'
import React from 'react'
import Link from 'next/link'
import { DateTime } from 'luxon'
import ToggleTheme from './ToggleTheme'

const Footer = async () => {
  return (
    <div className="bg-transparent mx-auto flex h-[80px] border-t-2 border-neutral-100 dark:border-neutral-800 text-black/80 dark:text-white/80 w-full ">
      <div className="w-full max-w-xs sm:max-w-5xl md:max-w-7xl xl:max-w-6xl lg:max-w-4xl mx-auto text-xs align-center justify-between flex">
        <div className="items-center flex text-black/80 dark:text-white/80">
          <div>{`Copyright © ${DateTime.now().year} Mirage Studio`}</div>
        </div>
        <div className="gap-4 md:gap-2 items-center flex">
          <ToggleTheme height="4" width="4" />
          <span>·</span>
          <Link className="hover:underline" href="/privacy-policy">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link className="hover:underline" href="/terms-and-conditions">
            Terms and conditions
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Footer
