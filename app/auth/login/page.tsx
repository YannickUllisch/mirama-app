'use client'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'
import React from 'react'
import Link from 'next/link'
import mirageLogoBlack from '@public/logo/mirage-logo-black.png'
import LoginForm from '@/src/components/auth/LoginForm'
import Image from 'next/image'

const LoginPage = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader className="flex items-center mt-4">
        <Link href={'/'} className="ml-4 lg:ml-0">
          <Image height={30} src={mirageLogoBlack} alt={'Logo'} />
        </Link>
        <CardDescription>Welcome Back</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="link">
          <Link href={'/'}>Cancel</Link>
        </Button>
        <Button asChild variant="link">
          <Link href={'/auth/register'}>Don't have an account?</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default LoginPage
