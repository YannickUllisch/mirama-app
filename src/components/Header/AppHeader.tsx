// src/components/Header/AppHeader.tsx
import BreadcrumbSkeleton from '@src/components/Skeletons/BreadcrumbSkeleton'
import FavouriteButtonSkeleton from '@src/components/Skeletons/FavouriteButtonSkeleton'
import HeaderProfileSkeleton from '@src/components/Skeletons/HeaderProfileSkeleton'
import Link from 'next/link'
import { Suspense } from 'react'
import MiramaIcon from '../MiramaIcon'
import HeaderBreadcrumbs from './HeaderBreadcrumbs'
import HeaderFavouriteToggle from './HeaderFavouriteToggle'
import HeaderProfile from './HeaderProfile'
import HeaderSearch from './HeaderSearch'
import HeaderSidebarTrigger from './HeaderSidebarTrigger'

const AppHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-sidebar">
      <div className="flex h-14 items-center gap-4 px-4 justify-between">
        <div className="flex items-center gap-4">
          <HeaderSidebarTrigger />

          <Link
            href="/"
            className="flex items-center shrink-0"
            prefetch={false}
          >
            <MiramaIcon />
          </Link>

          <div className="h-6 w-px bg-black/10 dark:bg-white/10 mx-1 hidden sm:block" />

          <Suspense fallback={<BreadcrumbSkeleton />}>
            <HeaderBreadcrumbs />
          </Suspense>
        </div>

        <HeaderSearch />

        <div className="flex items-center gap-2">
          <Suspense fallback={<FavouriteButtonSkeleton />}>
            <HeaderFavouriteToggle />
          </Suspense>

          <div className="h-6 w-px bg-black/10 dark:bg-white/10 mx-1" />

          <Suspense fallback={<HeaderProfileSkeleton />}>
            <HeaderProfile />
          </Suspense>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
