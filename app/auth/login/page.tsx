'use client'
import React from 'react'

import LoginForm from '@src/components/auth/LoginForm'
import AuthCard from '@src/components/auth/AuthCard'
import { AuthSocial } from '@src/components/auth/social'

const LoginPage = () => {
  return (
    <AuthCard
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
    >
      <AuthSocial />
      <LoginForm />
    </AuthCard>
  )
}

export default LoginPage
