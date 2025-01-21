import ConnectifyIcon from '@/components/icons/Connectify'
import ConnectifyLogoText from '@/components/icons/ConnectifyLogoText'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

const SidebarHeader = ({hide}:{hide:boolean}) => {
  return (
    <div className="z-20 flex h-10 w-full items-center justify-around gap-2">
      <Link to={'/'}>
        <ConnectifyIcon size={42} />
      </Link>
      <Link to={'/'} className={cn('sm:hidden lg:block',hide && 'lg:hidden')}>
        <ConnectifyLogoText w="200" h="44" />
      </Link>
    </div>
  )
}

export default SidebarHeader
