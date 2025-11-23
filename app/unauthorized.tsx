import { auth } from '@auth'
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

const UnauthorizedPage = async () => {
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
                Access Denied
              </CardTitle>
              <CardDescription className="text-base">
                You don't have permission to access this resource
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Status Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>
                  Status:{' '}
                  {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                </span>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg text-left">
                <h3 className="font-semibold text-sm mb-2 text-text">
                  Why am I seeing this page?
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You may not have the required permissions</li>
                  <li>• Your session may have expired</li>
                  <li>• The resource requires authentication</li>
                  <li>• You may need to contact an administrator</li>
                </ul>
              </div>
            </div>

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

            {/* Additional Help */}
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Need help? Contact our support team or check your account
                permissions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UnauthorizedPage
