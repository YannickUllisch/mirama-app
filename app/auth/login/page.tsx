'use client'
import Loading from '@/app/loading'
import image from '@public/test2.png'
import LoginForm from '@src/components/auth/LoginForm'
import { AuthSocial } from '@src/components/auth/Socials'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold ">.mirama</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
            <AuthSocial />
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <a href="/auth/register" className="underline underline-offset-4">
                Create an account
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Suspense fallback={<Loading />}>
          <Image
            src={image}
            alt="LoginImage"
            priority
            className="absolute inset-0 h-full w-full object-cover"
          />
        </Suspense>
      </div>
    </div>
  )
}
