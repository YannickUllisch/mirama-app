'use client'
import { GoogleColoredIcon } from '@src/lib/CompanyIcons'
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
        redirect: false,
        callbackUrl: '/app',
      })

      if (result?.error) {
        // Show the error returned from NextAuth (from PrismaAdapter)
        setFormError(result.error)
      } else if (!result?.ok) {
        setFormError('An unknown error occurred during social login.')
      } else if (result?.ok && result.url) {
        window.location.href = result.url
      }
    } catch (err: any) {
      setFormError(err)
    }
  }
  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full h-12 gap-3 border-2 border-border/30 hover:bg-muted/50 rounded-xl font-bold text-xs hover:border hover:border-primary uppercase tracking-wider transition-all"
        onClick={handleGoogleSignIn}
      >
        <GoogleColoredIcon height="18" width="18" />
        <span>Continue with Google</span>
      </Button>
      {formError && <FormError message={formError} />}
    </div>
  )
}
