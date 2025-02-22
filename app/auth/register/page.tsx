'use client'
import RegisterForm from '@src/components/auth/RegisterForm'
import React from 'react'
import image from '@public/test.png'
import Image from 'next/image'
import Link from 'next/link'
import { AuthSocial } from '@src/components/auth/Socials'

const RegisterPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <Image
          src={image}
          priority
          alt="RegisterImage"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">.mirage</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
            <AuthSocial />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
