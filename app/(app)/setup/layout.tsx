// app/(app)/setup/layout.tsx

import fs from 'node:fs'
import path from 'node:path'
import { auth } from '@auth'
import QueryClientWrapper from '@src/components/Wrappers/QueryClientWrapper'
import SessionWrapper from '@src/components/Wrappers/SessionWrapper'
import { ThemeProvider } from '@src/components/Wrappers/ThemeProvider'
import { redirect } from 'next/navigation'
import SetupProvider from './_components/SetupProvider'

const readAvatars = () => {
  const dir = path.join(process.cwd(), 'public', 'avatars')
  try {
    return fs
      .readdirSync(dir)
      .filter((file) => /\.(png|jpe?g|webp|svg)$/i.test(file))
  } catch {
    return []
  }
}

const SetupLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  if (session.user.organizationId)
    redirect(`/organization/${session.user.organizationId}`)

  return (
    <SessionWrapper>
      <QueryClientWrapper>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SetupProvider
            avatars={readAvatars()}
            initialName={session.user.name ?? ''}
          >
            {children}
          </SetupProvider>
        </ThemeProvider>
      </QueryClientWrapper>
    </SessionWrapper>
  )
}

export default SetupLayout
