import { useEffect, useState, type FC } from 'react'
import mirageLogoBlack from '@public/logo/mirage-logo-black.png'
import mirageLogoWhite from '@public/logo/mirage-logo-white.png'
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
import { useTheme } from 'next-themes'

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
  const [logo, setLogo] = useState(mirageLogoWhite)
  const { theme } = useTheme()

  useEffect(() => {
    if (theme === 'light') {
      setLogo(mirageLogoBlack)
    } else {
      setLogo(mirageLogoWhite)
    }
  }, [theme])

  return (
    <Card className="w-[350px]">
      <CardHeader className="flex items-center mt-4">
        <Link href={'/'} className="ml-4 lg:ml-0">
          <Image height={30} src={logo} alt={'Logo'} />
        </Link>
        <CardDescription>{headerLabel}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex justify-center">
        <div className="flex flex-col">
          <Button asChild variant="link" style={{ fontSize: 11 }}>
            <Link href={backButtonHref}>{backButtonLabel}</Link>
          </Button>
          <Button asChild variant="link" style={{ fontSize: 13 }}>
            <Link href={'/'}>Cancel</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default AuthCard
