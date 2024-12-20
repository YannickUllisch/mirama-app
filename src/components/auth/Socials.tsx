'use client'
import React from 'react'
import { Button } from '../ui/button'
import { GoogleColoredIcon } from '@src/lib/ui/CompanyIcons'
import { signIn } from 'next-auth/react'
import ResendSigninDialog from '../Dialogs/ResendSignInDialog'

export const AuthSocial = () => {
  return (
    <div className="my-5 flex items-center w-full gap-x-2 flex-col gap-y-2">
      <ResendSigninDialog />
      <Button
        className="w-full gap-2"
        variant={'outline'}
        onClick={async () => {
          await signIn('google', {
            redirect: true,
            redirectTo: '/app',
          })
        }}
      >
        <GoogleColoredIcon height="15" width="15" />
        <span>Sign in with Google</span>
      </Button>
    </div>
  )
}
