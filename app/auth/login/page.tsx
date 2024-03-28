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
import LoginForm from '@/src/components/auth/LoginForm'

const LoginPage = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader className="flex items-center">
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Welcome Back</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="link">
          <Link href={'/'}>Cancel</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default LoginPage
