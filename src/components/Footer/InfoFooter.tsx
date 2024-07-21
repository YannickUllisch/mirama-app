import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'
import Link from 'next/link'
import { Linkedin, Rss } from 'lucide-react'
import { Button } from '@/src/components/ui/button'

const InfoFooter = () => {
  return (
    <div className="p-8 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm ml-[350px] ">
        <Card className="bg-inherit shadow-none border-none">
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              <li className="mb-2">
                <Link href="/pricing">Pricing</Link>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-inherit shadow-none border-none">
          <CardHeader>
            <CardTitle>Help</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              <li className="mb-2">
                <Link href="/support-center">Supportcenter</Link>
              </li>
              <li className="mb-2">
                <Link href="/faq">FAQ</Link>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-inherit shadow-none border-none">
          <CardHeader>
            <CardTitle>Company</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              <li className="mb-2">
                <Link href="/mirage/about-us">About Us</Link>
              </li>
            </ul>
            <div className="flex space-x-4">
              <Link href="https://www.linkedin.com/company/miragexyz/">
                <Linkedin />
              </Link>
              <Link href="https://www.mirage-studio.xyz/" target="website">
                <Rss />
              </Link>
              <Link href="https://behance.com">BE</Link>
            </div>
            <Button className="mt-5">Contact Us</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default InfoFooter
