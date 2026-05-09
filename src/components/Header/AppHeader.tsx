// src/components/Header/AppHeader.tsx
import HeaderProfileSkeleton from '@src/components/Skeletons/HeaderProfileSkeleton'
import { Suspense } from 'react'
import HeaderProfile from './HeaderProfile'
import HeaderSearch from './HeaderSearch'

const AppHeader = () => {
  return (
    <header className="sticky top-0 z-20 w-full bg-background border-b border-neutral-100 dark:border-neutral-900">
      <div className="flex h-14 items-center gap-4 px-4 justify-between">
        <HeaderSearch />

        <Suspense fallback={<HeaderProfileSkeleton />}>
          <HeaderProfile />
        </Suspense>
      </div>
    </header>
  )
}

export default AppHeader
