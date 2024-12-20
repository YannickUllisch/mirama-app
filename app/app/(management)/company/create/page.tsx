'use client'
import { api } from '@api'
import { Button } from '@src/components/ui/button'
import React from 'react'

const CompanyCreatePage = () => {
  const func = async () => {
    api.post('mailer')
  }
  return <Button onClick={func}>test </Button>
}

export default CompanyCreatePage
