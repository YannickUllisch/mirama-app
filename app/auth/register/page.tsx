'use client'
import RegisterForm from '@src/components/auth/RegisterForm'
import { Shapes } from 'lucide-react'
import React from 'react'

const RegisterPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="MainImage"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-text-inverted">
              <Shapes size={19} />
            </div>
            <span className="text-2xl font-bold ">mirage</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
