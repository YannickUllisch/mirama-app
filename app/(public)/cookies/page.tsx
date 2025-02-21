import Link from 'next/link'
import { Button } from '@src/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@src/components/ui/card'
import { Separator } from '@src/components/ui/separator'

export default function CookiePolicy() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Cookie Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-4">
          <p>
            This Cookie Policy explains how we use cookies and similar tracking
            technologies on our website. By continuing to use our website, you
            agree to the use of cookies as described in this policy.
          </p>

          <h2 className="text-2xl font-semibold mt-8">What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device when you
            visit a website. They are widely used to make websites work more
            efficiently and provide useful information to website owners.
          </p>

          <h2 className="text-2xl font-semibold mt-8">
            Types of Cookies We Use
          </h2>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Essential Cookies</CardTitle>
              <CardDescription>
                These cookies are necessary for the website to function properly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Essential cookies enable core functionality such as security,
                network management, and accessibility. You may disable these by
                changing your browser settings, but this may affect how the
                website functions.
              </p>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Analytics Cookies</CardTitle>
              <CardDescription>
                Help us understand how visitors interact with the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                We use analytics cookies to help us understand how visitors
                interact with our website. This information is used to compile
                reports and help us improve the site.
              </p>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Marketing Cookies</CardTitle>
              <CardDescription>
                Used to track visitors across websites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Marketing cookies are used to track visitors across websites.
                The intention is to display ads that are relevant and engaging
                for the individual user.
              </p>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-semibold mt-8">Managing Cookies</h2>
          <p>
            Most web browsers allow you to control cookies through their
            settings preferences. However, if you limit the ability of websites
            to set cookies, you may worsen your overall user experience.
          </p>

          <h2 className="text-2xl font-semibold mt-8">Your Choices</h2>
          <p>
            You can choose to accept or decline cookies. Most web browsers
            automatically accept cookies, but you can usually modify your
            browser settings to decline cookies if you prefer.
          </p>

          <Separator className="my-8" />

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Cookie Preferences</h2>
            <p>
              You can update your cookie preferences at any time by clicking the
              button below.
            </p>
            <Button variant="outline" className="mt-4">
              Update Cookie Preferences
            </Button>
          </div>

          <h2 className="text-2xl font-semibold mt-8">Contact Us</h2>
          <p>
            If you have any questions about our Cookie Policy, please{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  )
}
