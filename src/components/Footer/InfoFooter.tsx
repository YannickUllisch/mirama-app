import React from 'react'
import { Badge } from '../ui/badge'

const InfoFooter = () => {
  return (
    <div className="py-20 gap-y-4 flex justify-center items-center flex-col bg-white dark:bg-neutral-900/10">
      <Badge
        variant={'outline'}
        className="inline-block px-2 py-1 border border-current rounded-md w-fit"
      >
        Reach out to us
      </Badge>
      <span className="text-3xl font-bold">We'd Love to Hear From You</span>
      <span className="text-text-secondary gap-1 flex flex-col sm:flex-row">
        Reach out to us manually at
        <a
          href="mailto:info@mirage-studio.xyz"
          className="text-secondary font-medium hover:underline"
        >
          info@mirage-studio.xyz
        </a>
      </span>
    </div>
  )
  // return (
  //   <div className="p-8 bg-white dark:bg-neutral-900/10 border-t border-neutral-100 dark:border-neutral-800">
  //     <div className="max-w-2xl mx-auto grid grid-cols-3 md:grid-cols-3 gap-8 text-sm ">
  //       <Card className="bg-inherit shadow-none border-none">
  //         <CardHeader>
  //           <CardTitle>General</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <ul>
  //             <li className="mb-2">
  //               <Link href="/pricing">Pricing</Link>
  //             </li>
  //           </ul>
  //         </CardContent>
  //       </Card>
  //       <Card className="bg-inherit shadow-none border-none">
  //         <CardHeader>
  //           <CardTitle>Help</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <ul>
  //             <li className="mb-2">
  //               <Link href="/support-center">Supportcenter</Link>
  //             </li>
  //             <li className="mb-2">
  //               <Link href="/faq">FAQ</Link>
  //             </li>
  //           </ul>
  //         </CardContent>
  //       </Card>
  //       <Card className="bg-inherit shadow-none border-none">
  //         <CardHeader>
  //           <CardTitle>Company</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <ul>
  //             <li className="mb-2">
  //               <Link href="/mirage/about-us">About Us</Link>
  //             </li>
  //           </ul>
  //           <div className="flex space-x-4">
  //             <Link href="https://www.linkedin.com/company/miragexyz/">
  //               <Linkedin />
  //             </Link>
  //             <Link href="https://www.mirage-studio.xyz/" target="website">
  //               <Rss />
  //             </Link>
  //             <Link href="https://behance.com">BE</Link>
  //           </div>
  //           <Button className="mt-5">Contact Us</Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   </div>
  // )
}

export default InfoFooter
