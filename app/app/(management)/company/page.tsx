'use client'
import { Button } from '@src/components/ui/button'
import { postResource } from '@src/lib/api/postResource'
import { signIn, useSession } from 'next-auth/react'
import React from 'react'

const CompanyPage = () => {
  const { data: session } = useSession()
  const func = async () => {
    if (session?.user.provider !== 'google') {
      await signIn('google', { redirect: false })
    }
    postResource('/google/calendarAPI', [])
  }
  return <Button onClick={func}>test </Button>
}

export default CompanyPage
