'use client'
import React from 'react'
import { Button } from '../ui/button'
import { GoogleColoredIcon } from '@src/lib/ui/CompanyIcons'
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export const AuthSocial = () => {
  const onClick = (provider: 'google' | 'option') => {
    signIn(provider, { redirectTo: DEFAULT_LOGIN_REDIRECT })
  }
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button onClick={() => onClick('google')}>
        <GoogleColoredIcon height="15" width="15" />
      </Button>
    </div>
  )
}
