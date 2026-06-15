import HoverLink from '@src/components/HoverLink'
import { ArrowLeft } from 'lucide-react'

const ReturnLink = ({ href, text }: { href: string; text: string }) => {
  return (
    <HoverLink
      href={href}
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      {text}
    </HoverLink>
  )
}

export default ReturnLink
