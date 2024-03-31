import type { FC } from 'react'
import mirageLogoBlack from '@public/logo/mirage-logo-black.png'
import Link from 'next/link'
import { Button } from '@src/components/ui/button'
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from '@src/components/ui/card'
import Image from 'next/image'

interface AuthCardProps {
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
  children: React.ReactNode
}

const AuthCard: FC<AuthCardProps> = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
}) => {
  return (
    <Card className="w-[350px]">
      <CardHeader className="flex items-center mt-4">
        <Link href={'/'} className="ml-4 lg:ml-0">
          <Image height={30} src={mirageLogoBlack} alt={'Logo'} />
        </Link>
        <CardDescription>{headerLabel}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild variant="link">
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default AuthCard
