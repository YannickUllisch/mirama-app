import { ScrollArea } from '@src/components/ui/scroll-area'
import { Separator } from '@src/components/ui/separator'

export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: February 20, 2024
            </p>
          </div>

          <Separator />

          <ScrollArea className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
              <p className="leading-7">
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact information</li>
                <li>Account credentials</li>
                <li>Payment information</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">
                How We Use Your Information
              </h2>
              <p className="leading-7">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process your transactions</li>
                <li>Send you technical notices and support messages</li>
                <li>
                  Communicate with you about products, services, and events
                </li>
                <li>Protect against malicious or fraudulent activity</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Information Sharing</h2>
              <p className="leading-7">
                We do not sell your personal information. We may share your
                information with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Service providers who assist in our operations</li>
                <li>Professional advisers and auditors</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Your Rights</h2>
              <p className="leading-7">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to our processing of your information</li>
                <li>Withdraw consent where applicable</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Security</h2>
              <p className="leading-7">
                We implement appropriate technical and organizational measures
                to protect your personal information. However, no security
                system is impenetrable and we cannot guarantee the security of
                our systems 100%.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Us</h2>
              <p className="leading-7">
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <p className="leading-7">
                Email: privacy@example.com
                <br />
                Address: 123 Privacy Street, Security City, 12345
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
              <p className="leading-7">
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new privacy policy on
                this page and updating the "Last updated" date at the top of
                this policy.
              </p>
            </section>
          </ScrollArea>
        </div>
      </div>
    </main>
  )
}
