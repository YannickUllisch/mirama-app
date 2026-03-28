import { auth } from '@/serverOld/auth/auth'
import HoverLink from '@src/components/HoverLink'
import { Button } from '@ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card'
import { AlertTriangle, Home, LogIn, Shield } from 'lucide-react'

const NotFoundPage = async () => {
  const session = await auth()
  const isAuthenticated = !!session

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Status Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        {/* Main Card */}
        <Card className="text-center">
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">
                404: Not Found
              </CardTitle>
              <CardDescription className="text-base">
                The resource you are looking for could not be found
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Action Buttons */}
            <div className="space-y-3">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <HoverLink href="/app" className="w-full">
                    <Button className="w-full" size="lg">
                      <Shield className="h-4 w-4 mr-2" />
                      Back to App
                    </Button>
                  </HoverLink>
                  <HoverLink href="/" className="w-full">
                    <Button variant="outline" className="w-full" size="lg">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Landing Page
                    </Button>
                  </HoverLink>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <HoverLink href="/auth/login" className="w-full">
                    <Button className="w-full" size="lg">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </HoverLink>
                  <HoverLink href="/" className="w-full">
                    <Button variant="outline" className="w-full" size="lg">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Landing Page
                    </Button>
                  </HoverLink>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Need help? Contact our{' '}
                <a href="/contact" className="underline font-bold">
                  support team
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NotFoundPage
