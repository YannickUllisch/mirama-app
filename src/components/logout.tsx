'use server'
import { signOut } from '@/auth'
import React from 'react'

const LogoutButton = () => {
  return (
    <form
      action={async () => {
        'use server'

        await signOut()
      }}
    >
      Sign Out
    </form>
  )
}

export default LogoutButton
