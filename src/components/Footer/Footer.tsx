import React from 'react'
import Link from 'next/link'
import { DateTime } from 'luxon'
import ToggleTheme from './ToggleTheme'

const Footer = () => {
  return (
    <div className="bg-inherit pt-4 h-[80px] border-t-2 border-neutral-100 dark:border-neutral-800">
      <div className="text-xs max-w-5xl mx-auto flex justify-between text-black/80 dark:text-white/80 pt-4">
        <div>{`Copyright © ${
          DateTime.now().year
        } Mirage Studio, All rights reserved.`}</div>
        <div className="gap-2 items-center flex">
          <ToggleTheme height="4" width="4" /> ·{' '}
          <Link className="hover:underline" href="/privacy-policy">
            Privacy Policy
          </Link>{' '}
          ·{'  '}
          <Link className="hover:underline" href="/terms-and-conditions">
            Terms and conditions
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Footer
