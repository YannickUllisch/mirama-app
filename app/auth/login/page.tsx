'use client'
import React from 'react'

import LoginForm from '@src/components/auth/LoginForm'
import AuthCard from '@src/components/auth/AuthCard'
import { AuthSocial } from '@src/components/auth/Socials'
import { Separator } from '@src/components/ui/separator'

const LoginPage = () => {
  return (
    <AuthCard
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
    >
      <AuthSocial />
      <div className="flex items-center w-[130px] pt-4 ">
        <Separator />
        <span className="p-2">OR</span>
        <Separator />
      </div>
      <LoginForm />
    </AuthCard>
  )
}

export default LoginPage
