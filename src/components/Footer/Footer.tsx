import React from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { SocialIcon } from 'react-social-icons/component'
import { DateTime } from 'luxon'
import 'react-social-icons/behance'
import { Linkedin, Rss } from 'lucide-react'

const Footer = () => {
  return (
    <>
      <div className="p-8 bg-neutral-100 dark:bg-neutral-900">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <Card className="bg-inherit shadow-none border-none">
            <CardHeader>
              <CardTitle>General</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                <li className="mb-2">
                  <Link href="/community">Community</Link>
                </li>
                <li className="mb-2">
                  <Link href="/trending">Trending</Link>
                </li>
                <li className="mb-2">
                  <Link href="/picks">Picks</Link>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-inherit shadow-none border-none">
            <CardHeader>
              <CardTitle>Marketplace</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                <li className="mb-2">
                  <Link href="/marketplace/trending">Trending</Link>
                </li>
                <li className="mb-2">
                  <Link href="/marketplace/best-selling">Best selling</Link>
                </li>
                <li className="mb-2">
                  <Link href="/marketplace/latest">Latest</Link>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-inherit shadow-none border-none">
            <CardHeader>
              <CardTitle>Magazine</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                <li className="mb-2">
                  <Link href="/magazine/art-skills">Art Skills</Link>
                </li>
                <li className="mb-2">
                  <Link href="/magazine/career">Career</Link>
                </li>
                <li className="mb-2">
                  <Link href="/magazine/inspiration">Inspiration</Link>
                </li>
                <li className="mb-2">
                  <Link href="/magazine/news">News</Link>
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
                  <Link href="/magazine/art-skills">About Us</Link>
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
      <div className="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 pt-4 h-[80px]">
        <div className="text-xs max-w-5xl mx-auto flex justify-between text-black/80 dark:text-white/80 pt-4">
          <div>{`Copyright © ${
            DateTime.now().year
          } Mirage Studio, All rights reserved.`}</div>
          <div>
            <Link href="/privacy-policy">Privacy Policy</Link> ·{' '}
            <Link href="/terms-and-conditions">Terms and conditions</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer
