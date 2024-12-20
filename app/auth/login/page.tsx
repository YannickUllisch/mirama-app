'use client'
import LoginForm from '@src/components/auth/LoginForm'
import image from '@public/test2.png'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import Loading from '@/app/loading'

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold ">.mirage</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
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
