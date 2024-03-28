'use client'
import { Button } from '@/src/components/ui/button'
import { NextSeo } from 'next-seo'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'

const ProjectsPage = () => {
  const router = useRouter()

  const onClick = () => {
    router.push('/auth/login')
  }

  return (
    <main className="grid place-items-center h-screen">
      <Button variant={'destructive'} onClick={onClick}>
        Test
      </Button>
    </main>
  )
}

export default ProjectsPage
