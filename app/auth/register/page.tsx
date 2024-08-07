'use client'
import RegisterForm from '@src/components/auth/RegisterForm'
import React from 'react'
import AuthCard from '@src/components/auth/AuthCard'

const RegisterPage = () => {
  return (
    <AuthCard
      headerLabel="Create an Account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
    >
      <RegisterForm />
    </AuthCard>
  )
}

export default RegisterPage
