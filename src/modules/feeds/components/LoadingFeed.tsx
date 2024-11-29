import { Loader } from 'lucide-react'

const LoadingFeed = () => {
  return (
    <li className="flex w-full items-center justify-center gap-3 px-2 py-2">
      <Loader className="animate-spin" />
    </li>
  )
}

export default LoadingFeed
