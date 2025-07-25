'use client'
import { GoogleColoredIcon } from '@src/lib/ui/CompanyIcons'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { FormError } from './popups/FormError'

export const AuthSocial = () => {
  const [formError, setFormError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setFormError(null)
    try {
      const result = await signIn('cognito', {
        redirect: false, // Don't redirect so we can handle errors
        callbackUrl: '/app',
      })
      setFormError(result.error ?? 'Error Occurred with Google Provider')
    } catch (err: any) {
      setFormError(err)
    }
  }
  return (
    <div className="my-5 flex items-center w-full gap-x-2 flex-col gap-y-2">
      <Button
        className="w-full gap-2"
        variant={'outline'}
        onClick={handleGoogleSignIn}
      >
        <GoogleColoredIcon height="15" width="15" />
        <span>Sign in with Google</span>
      </Button>
      {formError && (
        <div className="w-full">
          {' '}
          <FormError message={formError} />{' '}
        </div>
      )}
    </div>
  )
}
