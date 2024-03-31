'use client'
import RegisterForm from '@/src/components/auth/RegisterForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/src/components/ui/card'
import Link from 'next/link'
import React from 'react'
import { Button } from '@src/components/ui/button'
import Image from 'next/image'
import mirageLogoBlack from '@public/logo/mirage-logo-black.png'

const RegisterPage = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader className="flex items-center mt-4">
        <Link href={'/'} className="ml-4 lg:ml-0">
          <Image height={30} src={mirageLogoBlack} alt={'Logo'} />
        </Link>
        <CardDescription className="mt-3">Create an Account</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild variant="link">
          <Link href={'/auth/login'}>Already have an account?</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default RegisterPage
