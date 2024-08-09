import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@src/components/ui/card'
import Link from 'next/link'
import { Leaf, Linkedin, Rss } from 'lucide-react'
import { Button } from '@src/components/ui/button'

// Single item type
type CategoryItem = {
  name: string
  url: string
  external?: boolean
  icon?: JSX.Element
}

// Category Type declaration
type Categories = {
  [key: string]: CategoryItem[]
}

const categories: Categories = {
  General: [{ name: 'Pricing', url: '/pricing' }],
  Help: [
    { name: 'Support Center', url: '/support-center' },
    { name: 'FAQ', url: '/faq' },
  ],
  Company: [
    { name: 'About Us', url: '/mirage/about-us' },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/miragexyz/',
      external: true,
      icon: <Linkedin />,
    },
    {
      name: 'RSS',
      url: 'https://www.mirage-studio.xyz/',
      external: true,
      icon: <Rss />,
    },
    { name: 'Behance', url: 'https://behance.com', external: true },
  ],
}

const TestFooter = () => {
  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 justify-between flex">
      <div>
        <Leaf />
        <div>Mirage Logo</div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {Object.keys(categories).map((category) => (
          <Card key={category} className="bg-inherit shadow-none border-none">
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {categories[category].map((item) => (
                  <li key={item.name} className="mb-2">
                    <Link href={item.url} passHref legacyBehavior>
                      <a
                        href={item.url}
                        target={item.external ? '_blank' : '_self'}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="flex items-center space-x-2"
                      >
                        {item.icon && item.icon}
                        <span>{item.name}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
              {category === 'Company' && (
                <Button className="mt-5">Contact Us</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TestFooter
