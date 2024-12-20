import { TriangleAlert } from 'lucide-react'
interface FormErrorProps {
  message?: string
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null

  return (
    <div className="bg-destructive/90 pl-2 p-1 rounded-md flex items-center gap-x-2 text-xs text-white">
      <TriangleAlert className="h-3 w-3" />
      <p>{message}</p>
    </div>
  )
}
